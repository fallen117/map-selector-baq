import {
  AlertTriangle,
  Landmark,
  ShoppingBag,
  Trees,
  Utensils,
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
  { nombre: 'Restaurante', icono: 'Utensils', color: '#D9634F', Icono: Utensils },
  { nombre: 'Parque', icono: 'Trees', color: '#2F8F6B', Icono: Trees },
  { nombre: 'Alerta', icono: 'TriangleAlert', color: '#D99A2B', Icono: AlertTriangle },
  { nombre: 'Tienda', icono: 'ShoppingBag', color: '#3F6FB5', Icono: ShoppingBag },
  { nombre: 'Servicio', icono: 'Landmark', color: '#7A5EA8', Icono: Landmark },
]

export function buscarCategoria(nombre: string | null | undefined) {
  return CATEGORIAS.find((categoria) => categoria.nombre === nombre)
}
