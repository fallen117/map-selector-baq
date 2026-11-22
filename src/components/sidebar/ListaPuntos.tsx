import { useState } from 'react'
import { Compass, LoaderCircle, MapPinOff, Pencil, Trash2 } from 'lucide-react'
import { buscarCategoria } from '../../config/categorias'
import { buscarDisponibilidad } from '../../config/disponibilidad'
import type { PuntoInteres } from '../../types/mapa.types'

interface Props {
  puntos: PuntoInteres[]
  cargando: boolean
  onSeleccionar: (punto: PuntoInteres) => void
  onEditar: (punto: PuntoInteres) => void
  onEliminar: (id: string) => Promise<boolean>
  hayFiltros: boolean
  onLimpiarFiltros: () => void
}

export function ListaPuntos({
  puntos,
  cargando,
  onSeleccionar,
  onEditar,
  onEliminar,
  hayFiltros,
  onLimpiarFiltros,
}: Props) {
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null)
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  if (cargando) {
    return (
      <div className="space-y-3" aria-label="Cargando puntos">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex animate-pulse gap-3 rounded-xl p-3">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-mist" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/5 rounded bg-mist" />
              <div className="h-2.5 w-full rounded bg-mist" />
              <div className="h-2.5 w-3/4 rounded bg-mist" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (puntos.length === 0 && hayFiltros) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D3E0E4] p-8 text-center">
        <MapPinOff size={26} className="mx-auto text-ink-soft" />
        <p className="mt-3 font-display text-sm font-semibold">Sin resultados</p>
        <p className="mt-1 text-xs text-ink-soft">
          No hay puntos que coincidan con la búsqueda.
        </p>
        <button
          type="button"
          onClick={onLimpiarFiltros}
          className="mt-4 rounded-md text-xs font-semibold text-teal hover:underline active:bg-onyx active:text-white"
        >
          Limpiar filtros
        </button>
      </div>
    )
  }

  if (puntos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D3E0E4] p-8 text-center">
        <Compass size={28} className="mx-auto text-teal" />
        <p className="mt-3 font-display text-base font-semibold">
          El mapa está esperando su primer punto
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          Haz clic en cualquier lugar del mapa para registrar un sitio de interés.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-2 font-data text-[10px] uppercase tracking-[0.16em] text-ink-soft">
        {puntos.length} {puntos.length === 1 ? 'lugar registrado' : 'lugares registrados'}
      </p>

      <ul className="space-y-1">
        {puntos.map((punto) => {
          const categoria = buscarCategoria(punto.categoria?.nombre)
          const Icono = categoria?.Icono ?? Compass
          const color = categoria?.color ?? '#0E7C86'
          const confirmando = confirmandoId === punto.id
          const eliminando = eliminandoId === punto.id

          return (
            <li key={punto.id} className="rounded-xl transition hover:bg-mist/70 active:bg-onyx/5">
              <div className="flex items-start gap-1 p-2">
                <button
                  type="button"
                  onClick={() => onSeleccionar(punto)}
                  className="flex min-w-0 flex-1 gap-3 rounded-lg p-1 text-left"
                >
                  <span
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    <Icono size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold">
                      {punto.titulo}
                    </span>
                    {punto.disponibilidades.length > 0 ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {punto.disponibilidades.map((disponibilidad) => {
                          const opcion = buscarDisponibilidad(
                            disponibilidad.nombre,
                          )
                          const IconoDisponibilidad = opcion?.Icono

                          return (
                            <span
                              key={disponibilidad.id}
                              className="inline-flex items-center gap-1 rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft transition hover:bg-onyx/10 hover:text-ink"
                            >
                              {IconoDisponibilidad && (
                                <IconoDisponibilidad
                                  size={11}
                                  color={opcion?.color}
                                />
                              )}
                              {disponibilidad.nombre}
                            </span>
                          )
                        })}
                      </span>
                    ) : (
                      <span className="mt-0.5 block text-[11px] text-ink-soft">
                        Sin disponibilidad registrada
                      </span>
                    )}
                    <span className="mt-1.5 block font-data text-[10px] text-[#8BA0AA]">
                      {punto.latitud.toFixed(4)}, {punto.longitud.toFixed(4)}
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onEditar(punto)}
                    aria-label={`Editar ${punto.titulo}`}
                    title="Editar punto"
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-white hover:text-teal active:bg-onyx active:text-white"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmandoId(punto.id)}
                    aria-label={`Eliminar ${punto.titulo}`}
                    title="Eliminar punto"
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-red-50 hover:text-red-600 active:bg-onyx active:text-white"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {confirmando && (
                <div className="mx-2 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-[11px] font-semibold text-red-800">
                    ¿Eliminar este punto?
                  </p>
                  <p className="mt-0.5 text-[10px] text-red-700">
                    La acción se guardará en la base de datos.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={eliminando}
                      onClick={async () => {
                        setEliminandoId(punto.id)
                        await onEliminar(punto.id)
                        setEliminandoId(null)
                        setConfirmandoId(null)
                      }}
                      className="rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      {eliminando ? (
                        <LoaderCircle size={12} className="animate-spin" />
                      ) : (
                        'Eliminar'
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={eliminando}
                      onClick={() => setConfirmandoId(null)}
                      className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-red-800 hover:underline active:bg-onyx active:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
