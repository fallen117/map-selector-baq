import type { CategoriaCatalogo } from '../config/categorias'

export interface Categoria {
  id: number
  nombre: string
  icono_nombre: string
  color_hex: string
}

export interface Disponibilidad {
  id: number
  nombre: string
  icono_nombre: string
}

export interface PuntoInteres {
  id: string
  titulo: string
  latitud: number
  longitud: number
  categoria_id: number | null
  creado_en: string
  categoria: Categoria | null
  disponibilidades: Disponibilidad[]
}

export interface NuevoPunto {
  titulo: string
  latitud: number
  longitud: number
  categoria: CategoriaCatalogo
  disponibilidades: string[]
}

export interface Coordenadas {
  lat: number
  lng: number
}
