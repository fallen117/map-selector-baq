import { useCallback, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { CENTRO, ZOOM_INICIAL } from '../config/mapaConfig'
import type { Coordenadas } from '../types/mapa.types'

export function useMapa() {
  const mapaRef = useRef<LeafletMap | null>(null)
  const [coordenadasTemporales, setCoordenadasTemporales] =
    useState<Coordenadas | null>(null)
  const [puntoResaltado, setPuntoResaltado] = useState<string | null>(null)

  const registrarMapa = useCallback((mapa: LeafletMap) => {
    mapaRef.current = mapa
  }, [])

  const seleccionarCoordenadas = useCallback((coordenadas: Coordenadas) => {
    setCoordenadasTemporales(coordenadas)
  }, [])

  const limpiarCoordenadas = useCallback(() => {
    setCoordenadasTemporales(null)
  }, [])

  const centrarVista = useCallback(() => {
    mapaRef.current?.flyTo(CENTRO, ZOOM_INICIAL, { duration: 0.8 })
  }, [])

  const volarA = useCallback((coordenadas: Coordenadas, zoom = 15) => {
    mapaRef.current?.flyTo([coordenadas.lat, coordenadas.lng], zoom, {
      duration: 0.8,
    })
  }, [])

  const resaltarPunto = useCallback((id: string | null) => {
    setPuntoResaltado(id)
  }, [])

  return {
    coordenadasTemporales,
    puntoResaltado,
    registrarMapa,
    seleccionarCoordenadas,
    limpiarCoordenadas,
    centrarVista,
    volarA,
    resaltarPunto,
  }
}
