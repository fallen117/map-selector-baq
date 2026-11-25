import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import type { Marker as LeafletMarker } from 'leaflet'
import { MapPin } from 'lucide-react'
import { Marker, Popup } from 'react-leaflet'
import { buscarCategoria } from '../../config/categorias'
import { buscarDisponibilidad } from '../../config/disponibilidad'
import { buscarIcono } from '../../config/iconos'
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
  const Icono =
    categoria?.Icono ?? buscarIcono(punto.categoria?.icono_nombre) ?? MapPin

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
        <article className="popup-glass">
          <header className="popup-glass__head">
            <span
              className="popup-glass__icon"
              style={
                {
                  '--icon-color': categoria?.color ?? '#0E7C86',
                } as CSSProperties
              }
            >
              <Icono size={18} />
            </span>
            <div className="min-w-0">
              <p className="popup-glass__eyebrow">
                {punto.categoria?.nombre ?? 'Punto de interés'}
              </p>
              <p className="popup-glass__title">{punto.titulo}</p>
            </div>
          </header>

          <div className="popup-glass__details">
            <div className="popup-glass__chips">
              {punto.disponibilidades.length > 0 ? (
                punto.disponibilidades.map((disponibilidad) => {
                  const opcion = buscarDisponibilidad(disponibilidad.nombre)
                  const IconoDisponibilidad = opcion?.Icono

                  return (
                    <span
                      key={disponibilidad.id}
                      className="popup-glass__chip"
                    >
                      {IconoDisponibilidad && (
                        <IconoDisponibilidad size={11} color={opcion?.color} />
                      )}
                      {disponibilidad.nombre}
                    </span>
                  )
                })
              ) : (
                <span className="popup-glass__empty">
                  Sin disponibilidad registrada
                </span>
              )}
            </div>
            <p className="popup-glass__coords">
              {punto.latitud.toFixed(5)}, {punto.longitud.toFixed(5)}
            </p>
          </div>
        </article>
      </Popup>
    </Marker>
  )
}
