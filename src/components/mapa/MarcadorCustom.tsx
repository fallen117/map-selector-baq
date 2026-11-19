import { useEffect, useMemo, useRef } from 'react'
import type { Marker as LeafletMarker } from 'leaflet'
import { MapPin } from 'lucide-react'
import { Marker, Popup } from 'react-leaflet'
import { buscarCategoria } from '../../config/categorias'
import { buscarDisponibilidad } from '../../config/disponibilidad'
import type { PuntoInteres } from '../../types/mapa.types'
import { crearIconoPin } from '../../utils/iconosLeaflet'

interface Props {
  punto: PuntoInteres
  resaltado: boolean
  onSeleccionar: (punto: PuntoInteres) => void
}

export function MarcadorCustom({ punto, resaltado, onSeleccionar }: Props) {
  const referencia = useRef<LeafletMarker>(null)
  const categoria = buscarCategoria(punto.categoria?.nombre)
  const Icono = categoria?.Icono ?? MapPin

  const icono = useMemo(
    () =>
      crearIconoPin(punto.categoria?.color_hex, punto.categoria?.icono_nombre),
    [punto.categoria?.color_hex, punto.categoria?.icono_nombre],
  )

  useEffect(() => {
    if (resaltado) referencia.current?.openPopup()
  }, [resaltado])

  return (
    <Marker
      ref={referencia}
      position={[punto.latitud, punto.longitud]}
      icon={icono}
      eventHandlers={{ click: () => onSeleccionar(punto) }}
    >
      <Popup>
        <div className="flex min-w-[190px] max-w-[260px] gap-3">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
            style={{ backgroundColor: categoria?.color ?? '#0E7C86' }}
          >
            <Icono size={17} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight">{punto.titulo}</p>
            {punto.disponibilidades.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {punto.disponibilidades.map((disponibilidad) => {
                  const opcion = buscarDisponibilidad(disponibilidad.nombre)
                  const IconoDisponibilidad = opcion?.Icono

                  return (
                    <span
                      key={disponibilidad.id}
                      className="inline-flex items-center gap-1 rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft"
                    >
                      {IconoDisponibilidad && (
                        <IconoDisponibilidad size={11} color={opcion?.color} />
                      )}
                      {disponibilidad.nombre}
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="mt-1.5 text-[11px] text-ink-soft">
                Sin disponibilidad registrada
              </p>
            )}
            <p className="mt-2 font-data text-[10px] text-[#8BA0AA]">
              {punto.latitud.toFixed(5)}, {punto.longitud.toFixed(5)}
            </p>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}
