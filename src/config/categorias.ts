import {
  MapPin,
  ParkingSquare,
  ShoppingBag,
  Trees,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { buscarIcono } from './iconos'

/** Categoría del catálogo: la usan el filtro, el formulario y los marcadores. */
export interface CategoriaCatalogo {
  nombre: string
  icono: string
  color: string
  Icono: LucideIcon
}

/** Catálogo predefinido de iconos disponibles al crear un punto. */
export const CATEGORIAS: CategoriaCatalogo[] = [
  { nombre: 'Tienda', icono: 'ShoppingBag', color: '#3F6FB5', Icono: ShoppingBag },
  {
    nombre: 'Parqueadero',
    icono: 'ParkingSquare',
    color: '#D9634F',
    Icono: ParkingSquare,
  },
  { nombre: 'Parque', icono: 'Trees', color: '#2F8F6B', Icono: Trees },
  { nombre: 'Alerta', icono: 'TriangleAlert', color: '#D99A2B', Icono: TriangleAlert },
]

export const PALETA_CATEGORIAS = [
  '#3F6FB5',
  '#2F8F6B',
  '#D9634F',
  '#7A5EA8',
  '#D99A2B',
  '#0E7C86',
]

export function colorSeguro(color: string | null | undefined) {
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#0E7C86'
}

/** Color determinista para un POI personalizado recién creado. */
export function colorParaNombre(nombre: string) {
  let suma = 0
  for (const caracter of nombre) {
    suma += caracter.charCodeAt(0)
  }
  return PALETA_CATEGORIAS[suma % PALETA_CATEGORIAS.length]
}

const categoriasPersonalizadas = new Map<string, CategoriaCatalogo>()

/** Registra las categorías leídas de Supabase para resolverlas en toda la UI. */
export function registrarCategoriasPersonalizadas(
  filas: Array<{ nombre: string; icono_nombre: string; color_hex: string }>,
) {
  categoriasPersonalizadas.clear()

  for (const fila of filas) {
    const nombre = fila.nombre.trim()
    if (
      !nombre ||
      CATEGORIAS.some((categoria) => categoria.nombre === nombre)
    ) {
      continue
    }

    categoriasPersonalizadas.set(nombre, {
      nombre,
      icono: fila.icono_nombre,
      color: colorSeguro(fila.color_hex),
      Icono: buscarIcono(fila.icono_nombre) ?? MapPin,
    })
  }
}

export function buscarCategoria(nombre: string | null | undefined) {
  if (!nombre) return null
  return (
    CATEGORIAS.find((categoria) => categoria.nombre === nombre) ??
    categoriasPersonalizadas.get(nombre) ??
    null
  )
}

/** Catálogo completo (predefinido + personalizado) para filtros y formularios. */
export function todasLasCategorias(): CategoriaCatalogo[] {
  return [...CATEGORIAS, ...categoriasPersonalizadas.values()]
}
