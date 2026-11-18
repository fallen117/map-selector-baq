import L from 'leaflet'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapPin } from 'lucide-react'
import { CATEGORIAS } from '../config/categorias'

function colorSeguro(color: string | null | undefined) {
  return color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#0E7C86'
}

/** Convierte el nombre de un icono de Lucide en un marcador divIcon de Leaflet. */
export function crearIconoPin(
  color: string | null | undefined,
  icono: string | null | undefined,
  temporal = false,
) {
  const categoria = CATEGORIAS.find((item) => item.icono === icono)
  const Icono = categoria?.Icono ?? MapPin

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
