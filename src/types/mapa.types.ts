import type { CategoriaCatalogo } from '../config/categorias'

export interface Categoria {
  id: number
  nombre: string
  icono_nombre: string
  color_hex: string
}

export interface PuntoInteres {
  id: string
  titulo: string
  descripcion: string
  latitud: number
  longitud: number
  categoria_id: number | null
  creado_en: string
  categoria: Categoria | null
}

export interface NuevoPunto {
  titulo: string
  descripcion: string
  latitud: number
  longitud: number
  categoria: CategoriaCatalogo
}

export interface Coordenadas {
  lat: number
  lng: number
}
