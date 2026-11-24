import {
  AlertTriangle,
  ParkingSquare,
  ShoppingBag,
  Trees,
  type LucideIcon,
} from 'lucide-react'

/** Catálogo predefinido de iconos disponibles al crear un punto. */
export interface CategoriaCatalogo {
  nombre: string
  icono: string
  color: string
  Icono: LucideIcon
}

export const CATEGORIAS: CategoriaCatalogo[] = [
  { nombre: 'Tienda', icono: 'ShoppingBag', color: '#3F6FB5', Icono: ShoppingBag },
  { nombre: 'Parqueadero', icono: 'Utensils', color: '#D9634F', Icono: ParkingSquare },
  { nombre: 'Parque', icono: 'Trees', color: '#2F8F6B', Icono: Trees },
  { nombre: 'Alerta', icono: 'TriangleAlert', color: '#D99A2B', Icono: AlertTriangle },
]

export function buscarCategoria(nombre: string | null | undefined) {
  return CATEGORIAS.find((categoria) => categoria.nombre === nombre)
}
