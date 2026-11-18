import { Compass, MapPinOff } from 'lucide-react'
import { buscarCategoria } from '../../config/categorias'
import type { PuntoInteres } from '../../types/mapa.types'

interface Props {
  puntos: PuntoInteres[]
  cargando: boolean
  onSeleccionar: (punto: PuntoInteres) => void
  hayFiltros: boolean
  onLimpiarFiltros: () => void
}

export function ListaPuntos({
  puntos,
  cargando,
  onSeleccionar,
  hayFiltros,
  onLimpiarFiltros,
}: Props) {
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
          className="mt-4 text-xs font-semibold text-teal hover:underline"
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

          return (
            <li key={punto.id}>
              <button
                type="button"
                onClick={() => onSeleccionar(punto)}
                className="flex w-full gap-3 rounded-xl p-3 text-left transition hover:bg-mist focus-visible:bg-mist"
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
                  <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-ink-soft">
                    {punto.descripcion}
                  </span>
                  <span className="mt-1.5 block font-data text-[10px] text-[#8BA0AA]">
                    {punto.latitud.toFixed(4)}, {punto.longitud.toFixed(4)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
