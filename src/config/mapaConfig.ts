/** Configuración central del mapa: ciudad, encuadre y límites. */

export const CIUDAD = {
  nombre: 'Barranquilla - Área Metropolitana',
  subtitulo: 'Mapa de interés',
  region: 'Atlántico, Colombia',
} as const

export const CENTRO: [number, number] = [10.9167, -74.7667]

export const ZOOM_INICIAL = 13
export const ZOOM_MINIMO = 12
export const ZOOM_MAXIMO = 18

/** Límites aproximados del área metropolitana (suroeste, noreste). */
export const LIMITES: [[number, number], [number, number]] = [
  [10.8, -74.9],
  [11.05, -74.62],
]

export const OPCIONES_MAPA = {
  center: CENTRO,
  zoom: ZOOM_INICIAL,
  minZoom: ZOOM_MINIMO,
  maxZoom: ZOOM_MAXIMO,
  maxBounds: LIMITES,
  maxBoundsViscosity: 1,
} as const
