import L from 'leaflet'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapPin } from 'lucide-react'
import { colorSeguro } from '../config/categorias'
import { buscarIcono } from '../config/iconos'

/** Convierte el nombre de un icono de Lucide en un marcador divIcon de Leaflet. */
export function crearIconoPin(
  color: string | null | undefined,
  icono: string | null | undefined,
  temporal = false,
) {
  const Icono = buscarIcono(icono) ?? MapPin

  const svg = renderToStaticMarkup(
    createElement(Icono, { size: 17, strokeWidth: 2.4, color: '#ffffff' }),
  )

  return L.divIcon({
    className: 'pin-contenedor',
    html: `<div class="pin${temporal ? ' pin-temporal' : ''}" style="background:${colorSeguro(color)}">${svg}</div>`,
    iconSize: [38, 46],
    iconAnchor: [19, 44],
    popupAnchor: [0, -42],
  })
}
