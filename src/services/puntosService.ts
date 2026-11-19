import { DISPONIBILIDADES } from '../config/disponibilidad'
import { DB_SCHEMA, supabase } from '../config/supabase'
import type {
  Categoria,
  Disponibilidad,
  NuevoPunto,
  PuntoInteres,
} from '../types/mapa.types'

const SELECT_PUNTOS = `
  id, titulo, latitud, longitud, categoria_id, creado_en,
  categoria:categorias ( id, nombre, icono_nombre, color_hex ),
  disponibilidades:puntos_interes_disponibilidad (
    disponibilidad:disponibilidad ( id, nombre, icono_nombre )
  )
`

type FilaDisponibilidad = {
  disponibilidad: Disponibilidad | Disponibilidad[] | null
}

type FilaPunto = Omit<PuntoInteres, 'categoria' | 'disponibilidades'> & {
  categoria: Categoria | Categoria[] | null
  disponibilidades: FilaDisponibilidad[] | null
}

function normalizar(fila: FilaPunto): PuntoInteres {
  const categoria = Array.isArray(fila.categoria)
    ? (fila.categoria[0] ?? null)
    : fila.categoria

  const disponibilidades = (fila.disponibilidades ?? [])
    .map((relacion) =>
      Array.isArray(relacion.disponibilidad)
        ? (relacion.disponibilidad[0] ?? null)
        : relacion.disponibilidad,
    )
    .filter((disponibilidad): disponibilidad is Disponibilidad =>
      Boolean(disponibilidad),
    )

  return { ...fila, categoria, disponibilidades }
}

export async function obtenerPuntos(): Promise<PuntoInteres[]> {
  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .select(SELECT_PUNTOS)
    .order('creado_en', { ascending: false })

  if (error) {
    throw new Error(`No se pudieron cargar los puntos: ${error.message}`)
  }

  return ((data ?? []) as FilaPunto[]).map(normalizar)
}

async function obtenerPunto(id: string): Promise<PuntoInteres> {
  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .select(SELECT_PUNTOS)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`No se pudo cargar el punto: ${error.message}`)
  }

  return normalizar(data as FilaPunto)
}

/** La categoría del catálogo se crea solo cuando un usuario la necesita. */
async function asegurarCategoria(
  categoria: NuevoPunto['categoria'],
): Promise<number> {
  const tabla = supabase.schema(DB_SCHEMA).from('categorias')

  const { data: existente, error: errorBusqueda } = await tabla
    .select('id')
    .eq('nombre', categoria.nombre)
    .maybeSingle()

  if (errorBusqueda) {
    throw new Error(`No se pudo resolver la categoría: ${errorBusqueda.message}`)
  }

  if (existente) {
    return existente.id as number
  }

  const { data, error } = await tabla
    .insert({
      nombre: categoria.nombre,
      icono_nombre: categoria.icono,
      color_hex: categoria.color,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`No se pudo crear la categoría: ${error.message}`)
  }

  return data.id as number
}

/** Igual que las categorías: el catálogo se materializa bajo demanda. */
async function asegurarDisponibilidades(nombres: string[]): Promise<number[]> {
  const unicos = [
    ...new Set(nombres.map((nombre) => nombre.trim()).filter(Boolean)),
  ]

  return Promise.all(
    unicos.map(async (nombre) => {
      const tabla = supabase.schema(DB_SCHEMA).from('disponibilidad')

      const { data: existente, error: errorBusqueda } = await tabla
        .select('id')
        .eq('nombre', nombre)
        .maybeSingle()

      if (errorBusqueda) {
        throw new Error(
          `No se pudo resolver la disponibilidad "${nombre}": ${errorBusqueda.message}`,
        )
      }

      if (existente) {
        return existente.id as number
      }

      const catalogo = DISPONIBILIDADES.find(
        (opcion) => opcion.nombre === nombre,
      )

      const { data, error } = await tabla
        .insert({ nombre, icono_nombre: catalogo?.icono ?? '' })
        .select('id')
        .single()

      if (error) {
        throw new Error(
          `No se pudo crear la disponibilidad "${nombre}": ${error.message}`,
        )
      }

      return data.id as number
    }),
  )
}

async function sincronizarDisponibilidades(
  puntoId: string,
  nombres: string[],
): Promise<void> {
  const ids = await asegurarDisponibilidades(nombres)
  const tabla = supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes_disponibilidad')

  const { error: errorLimpieza } = await tabla
    .delete()
    .eq('punto_id', puntoId)

  if (errorLimpieza) {
    throw new Error(
      `No se pudo actualizar la disponibilidad: ${errorLimpieza.message}`,
    )
  }

  if (ids.length === 0) return

  const { error } = await tabla.insert(
    ids.map((disponibilidad_id) => ({
      punto_id: puntoId,
      disponibilidad_id,
    })),
  )

  if (error) {
    throw new Error(`No se pudo asignar la disponibilidad: ${error.message}`)
  }
}

export async function crearPunto(nuevo: NuevoPunto): Promise<PuntoInteres> {
  const categoria_id = await asegurarCategoria(nuevo.categoria)

  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .insert({
      titulo: nuevo.titulo.trim(),
      latitud: nuevo.latitud,
      longitud: nuevo.longitud,
      categoria_id,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`No se pudo guardar el punto: ${error.message}`)
  }

  const id = data.id as string

  try {
    await sincronizarDisponibilidades(id, nuevo.disponibilidades)
  } catch (err) {
    await supabase.schema(DB_SCHEMA).from('puntos_interes').delete().eq('id', id)
    throw err
  }

  return obtenerPunto(id)
}

export async function actualizarPunto(
  id: string,
  nuevo: NuevoPunto,
): Promise<PuntoInteres> {
  const categoria_id = await asegurarCategoria(nuevo.categoria)

  const { error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .update({
      titulo: nuevo.titulo.trim(),
      categoria_id,
    })
    .eq('id', id)

  if (error) {
    throw new Error(`No se pudo actualizar el punto: ${error.message}`)
  }

  await sincronizarDisponibilidades(id, nuevo.disponibilidades)

  return obtenerPunto(id)
}

export async function eliminarPunto(id: string): Promise<void> {
  const { error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`No se pudo eliminar el punto: ${error.message}`)
  }
}
