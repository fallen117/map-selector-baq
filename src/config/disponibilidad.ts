import { Bath, CircleParking, ShoppingBag, type LucideIcon } from 'lucide-react'

/** Catálogo predefinido de disponibilidades asignables a un punto. */
export interface DisponibilidadCatalogo {
  nombre: string
  icono: string
  color: string
  Icono: LucideIcon
}

export const DISPONIBILIDADES: DisponibilidadCatalogo[] = [
  {
    nombre: 'Parqueadero',
    icono: 'CircleParking',
    color: '#3F6FB5',
    Icono: CircleParking,
  },
  { nombre: 'Baño', icono: 'Bath', color: '#7A5EA8', Icono: Bath },
  {
    nombre: 'Venta de Productos',
    icono: 'ShoppingBag',
    color: '#2F8F6B',
    Icono: ShoppingBag,
  },
]

export function buscarDisponibilidad(nombre: string | null | undefined) {
  return DISPONIBILIDADES.find(
    (disponibilidad) => disponibilidad.nombre === nombre,
  )
}
