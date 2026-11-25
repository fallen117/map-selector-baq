import { DB_SCHEMA, supabase } from '../config/supabase'

export interface CategoriaFila {
  id: number
  nombre: string
  icono_nombre: string
  color_hex: string
}

export interface DatosCategoriaPersonalizada {
  nombre: string
  icono: string
  color: string
}

const SELECT_CATEGORIAS = 'id, nombre, icono_nombre, color_hex'

export async function obtenerCategorias(): Promise<CategoriaFila[]> {
  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('categorias')
    .select(SELECT_CATEGORIAS)
    .order('nombre', { ascending: true })

  if (error) {
    throw new Error(`No se pudieron cargar las categorías: ${error.message}`)
  }

  return (data ?? []) as CategoriaFila[]
}

/** Crea una categoría/POI personalizado y la deja disponible para la app. */
export async function crearCategoriaPersonalizada(
  datos: DatosCategoriaPersonalizada,
): Promise<CategoriaFila> {
  const { data, error } = await supabase
    .schema(DB_SCHEMA)
    .from('categorias')
    .insert({
      nombre: datos.nombre.trim(),
      icono_nombre: datos.icono,
      color_hex: datos.color,
    })
    .select(SELECT_CATEGORIAS)
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe un POI personalizado con ese nombre.')
    }
    throw new Error(`No se pudo crear el POI personalizado: ${error.message}`)
  }

  return data as CategoriaFila
}
