import { DB_SCHEMA, supabase } from '../config/supabase'
import type { Categoria, NuevoPunto, PuntoInteres } from '../types/mapa.types'

const SELECT_PUNTOS =
  'id, titulo, descripcion, latitud, longitud, categoria_id, creado_en, categoria:categorias ( id, nombre, icono_nombre, color_hex )'

type FilaPunto = Omit<PuntoInteres, 'categoria'> & {
  categoria: Categoria | Categoria[] | null
}

function normalizar(fila: FilaPunto): PuntoInteres {
  const categoria = Array.isArray(fila.categoria)
    ? (fila.categoria[0] ?? null)
    : fila.categoria

  return { ...fila, categoria }
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

/** La categoría del catálogo se crea solo cuando un usuario la necesita. */
async function asegurarCategoria(categoria: NuevoPunto['categoria']): Promise<number> {
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

export async function crearPunto(nuevo: NuevoPunto): Promise<PuntoInteres> {
  const categoria_id = await asegurarCategoria(nuevo.categoria)

  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('puntos_interes')
    .insert({
      titulo: nuevo.titulo.trim(),
      descripcion: nuevo.descripcion.trim(),
      latitud: nuevo.latitud,
      longitud: nuevo.longitud,
      categoria_id,
    })
    .select(SELECT_PUNTOS)
    .single()

  if (error) {
    throw new Error(`No se pudo guardar el punto: ${error.message}`)
  }

  return normalizar(data as FilaPunto)
}
