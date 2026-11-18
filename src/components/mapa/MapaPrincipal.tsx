import type { Map as LeafletMap } from 'leaflet'
import { Crosshair } from 'lucide-react'
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
} from 'react-leaflet'
import { OPCIONES_MAPA } from '../../config/mapaConfig'
import type { Coordenadas, PuntoInteres } from '../../types/mapa.types'
import { crearIconoPin } from '../../utils/iconosLeaflet'
import { ManejadorClics } from './ManejadorClics'
import { MarcadorCustom } from './MarcadorCustom'

interface Props {
  puntos: PuntoInteres[]
  coordenadasTemporales: Coordenadas | null
  puntoResaltado: string | null
  onClicMapa: (coordenadas: Coordenadas) => void
  onMapaListo: (mapa: LeafletMap) => void
  onSeleccionar: (punto: PuntoInteres) => void
  onCentrar: () => void
}

export function MapaPrincipal({
  puntos,
  coordenadasTemporales,
  puntoResaltado,
  onClicMapa,
  onMapaListo,
  onSeleccionar,
  onCentrar,
}: Props) {
  const iconoTemporal = crearIconoPin('#F2B544', 'MapPin', true)

  return (
    <div className="relative h-full w-full">
      <MapContainer
        {...OPCIONES_MAPA}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />

        <ManejadorClics onClic={onClicMapa} onMapaListo={onMapaListo} />

        {puntos.map((punto) => (
          <MarcadorCustom
            key={punto.id}
            punto={punto}
            resaltado={punto.id === puntoResaltado}
            onSeleccionar={onSeleccionar}
          />
        ))}

        {coordenadasTemporales && (
          <Marker
            position={[coordenadasTemporales.lat, coordenadasTemporales.lng]}
            icon={iconoTemporal}
          />
        )}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-5 right-4 z-[1100] flex flex-col items-end gap-2">
        <div className="rounded-lg bg-white/95 px-3 py-2 font-data text-[11px] text-ink-soft shadow-md">
          {coordenadasTemporales
            ? `${coordenadasTemporales.lat.toFixed(5)} · ${coordenadasTemporales.lng.toFixed(5)}`
            : 'Clic para ubicar'}
        </div>
        <button
          type="button"
          onClick={onCentrar}
          className="pointer-events-auto flex items-center gap-2 rounded-xl bg-ink px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-[#233f51]"
        >
          <Crosshair size={15} /> Centrar vista
        </button>
      </div>
    </div>
  )
}
