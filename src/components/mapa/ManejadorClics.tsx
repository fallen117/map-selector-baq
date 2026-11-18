import { useEffect } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { useMap, useMapEvents } from 'react-leaflet'
import type { Coordenadas } from '../../types/mapa.types'

interface Props {
  onClic: (coordenadas: Coordenadas) => void
  onMapaListo: (mapa: LeafletMap) => void
}

/** Componente sin UI: expone el mapa y captura clics sobre el lienzo. */
export function ManejadorClics({ onClic, onMapaListo }: Props) {
  const mapa = useMap()

  useEffect(() => {
    onMapaListo(mapa)
  }, [mapa, onMapaListo])

  useMapEvents({
    click(evento) {
      onClic({ lat: evento.latlng.lat, lng: evento.latlng.lng })
    },
  })

  return null
}
