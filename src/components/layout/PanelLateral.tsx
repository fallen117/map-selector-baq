import { Crosshair, MapPinned, RefreshCw, TriangleAlert } from 'lucide-react'
import { CIUDAD } from '../../config/mapaConfig'
import type { Coordenadas, NuevoPunto, PuntoInteres } from '../../types/mapa.types'
import { FiltrosCategoria } from '../sidebar/FiltrosCategoria'
import { FormularioPunto } from '../sidebar/FormularioPunto'
import { ListaPuntos } from '../sidebar/ListaPuntos'

interface Props {
  puntos: PuntoInteres[]
  cargando: boolean
  error: string | null
  termino: string
  categoriaActiva: string | null
  coordenadasTemporales: Coordenadas | null
  puntoEnEdicion: PuntoInteres | null
  hayFiltros: boolean
  onTermino: (valor: string) => void
  onCategoria: (nombre: string | null) => void
  onLimpiarFiltros: () => void
  onReintentar: () => void
  onCancelar: () => void
  onCancelarEdicion: () => void
  onGuardar: (nuevo: NuevoPunto) => Promise<void>
  onSeleccionar: (punto: PuntoInteres) => void
  onEditar: (punto: PuntoInteres) => void
  onEliminar: (id: string) => Promise<boolean>
}

export function PanelLateral({
  puntos,
  cargando,
  error,
  termino,
  categoriaActiva,
  coordenadasTemporales,
  puntoEnEdicion,
  hayFiltros,
  onTermino,
  onCategoria,
  onLimpiarFiltros,
  onReintentar,
  onCancelar,
  onCancelarEdicion,
  onGuardar,
  onSeleccionar,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <aside className="z-20 flex h-[45vh] w-full shrink-0 flex-col border-b border-[#E6ECEE] bg-white md:h-full md:w-[30%] md:min-w-[320px] md:max-w-[460px] md:border-b-0 md:border-r">
      <header className="px-6 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white">
            <MapPinned size={20} />
          </div>
          <div>
            <p className="font-display text-xl font-bold leading-none tracking-tight">
              {CIUDAD.nombre}
            </p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {CIUDAD.subtitulo}
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-soft">{CIUDAD.region}</p>
      </header>

      <FiltrosCategoria
        termino={termino}
        onTermino={onTermino}
        categoriaActiva={categoriaActiva}
        onCategoria={onCategoria}
      />

      <div className="panel-scroll flex-1 overflow-y-auto px-6 py-5">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3">
            <div className="flex gap-2 text-red-700">
              <TriangleAlert size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">No se pudo conectar con la base de datos</p>
                <p className="mt-1 text-[11px] break-words">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onReintentar}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-red-700 hover:underline"
            >
              <RefreshCw size={12} /> Reintentar
            </button>
          </div>
        )}

        {coordenadasTemporales ? (
          <FormularioPunto
            key="nuevo"
            coordenadas={coordenadasTemporales}
            onCancelar={onCancelar}
            onGuardar={onGuardar}
          />
        ) : puntoEnEdicion ? (
          <FormularioPunto
            key={puntoEnEdicion.id}
            coordenadas={{
              lat: puntoEnEdicion.latitud,
              lng: puntoEnEdicion.longitud,
            }}
            punto={puntoEnEdicion}
            onCancelar={onCancelarEdicion}
            onGuardar={onGuardar}
          />
        ) : (
          <ListaPuntos
            puntos={puntos}
            cargando={cargando}
            onSeleccionar={onSeleccionar}
            onEditar={onEditar}
            onEliminar={onEliminar}
            hayFiltros={hayFiltros}
            onLimpiarFiltros={onLimpiarFiltros}
          />
        )}
      </div>

      <footer className="border-t border-[#E6ECEE] px-6 py-4">
        <div className="flex gap-2.5 rounded-xl bg-mist p-3 text-[11px] leading-relaxed text-ink-soft">
          <Crosshair size={15} className="mt-0.5 shrink-0 text-teal" />
          <p>Haz clic en el mapa para colocar un marcador y agregar un punto.</p>
        </div>
      </footer>
    </aside>
  )
}
