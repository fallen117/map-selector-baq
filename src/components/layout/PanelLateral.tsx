import { useState } from 'react'
import { Crosshair, Plus, RefreshCw, Sparkles, TriangleAlert } from 'lucide-react'
import LightPillar from '../LightPillar'
import type { CategoriaCatalogo } from '../../config/categorias'
import { RUTAS_IMAGENES } from '../../config/imagenes'
import { CIUDAD } from '../../config/mapaConfig'
import type { Coordenadas, NuevoPunto, PuntoInteres } from '../../types/mapa.types'
import { FiltrosCategoria } from '../sidebar/FiltrosCategoria'
import { FormularioPunto } from '../sidebar/FormularioPunto'
import { ListaPuntos } from '../sidebar/ListaPuntos'

interface Props {
  puntos: PuntoInteres[]
  categorias: CategoriaCatalogo[]
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
  onAbrirPersonalizado: () => void
  onSeleccionar: (punto: PuntoInteres) => void
  onEditar: (punto: PuntoInteres) => void
  onEliminar: (id: string) => Promise<boolean>
}

export function PanelLateral({
  puntos,
  categorias,
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
  onAbrirPersonalizado,
  onSeleccionar,
  onEditar,
  onEliminar,
}: Props) {
  const [logoCristal, setLogoCristal] = useState(false)

  return (
    <aside className="z-20 flex h-[45vh] w-full shrink-0 flex-col border-b border-[#E6ECEE] bg-white md:h-full md:w-[30%] md:min-w-[320px] md:max-w-[460px] md:border-b-0 md:border-r">
      <header className="relative isolate min-h-[150px] overflow-hidden bg-[#050505] px-6 pb-6 pt-7 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <LightPillar
            topColor="#000000"
            bottomColor="#242424"
            intensity={1.2}
            glowAmount={0.004}
            bloom={0.7}
            pillarWidth={5}
            pillarHeight={0.26}
            pillarRotation={-90}
            rotationSpeed={0.3}
            interactive
            clickPulse={false}
            intro
            quality="high"
            resolution={1.54}
            mixBlendMode="screen"
            twist={0.35}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.68) 44%, rgba(0,0,0,0.28) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex h-14 items-center gap-3">
            <button
              type="button"
              onClick={() => setLogoCristal((valor) => !valor)}
              aria-pressed={logoCristal}
              aria-label={
                logoCristal
                  ? 'Restaurar fondo del logo'
                  : 'Activar efecto cristalino del logo'
              }
              data-glass={logoCristal ? 'true' : 'false'}
              className="logo-glass flex h-full shrink-0 cursor-pointer items-center overflow-hidden rounded-xl border-0 py-0 px-1.5"
            >
              <img
                src={RUTAS_IMAGENES.logoAplicacion}
                alt={`Logo de ${CIUDAD.nombre}`}
                className="relative z-10 h-full w-auto max-w-[120px] object-contain"
              />
            </button>
            <div>
              <p className="font-display text-xl font-bold leading-none tracking-tight text-white">
                {CIUDAD.nombre}
              </p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                {CIUDAD.subtitulo}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/60">{CIUDAD.region}</p>
        </div>
      </header>

      <div className="mt-4">
        <FiltrosCategoria
          categorias={categorias}
          termino={termino}
          onTermino={onTermino}
          categoriaActiva={categoriaActiva}
          onCategoria={onCategoria}
        />
        <div className="px-6 pb-3">
          <button
            type="button"
            onClick={onAbrirPersonalizado}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#C8D6DB] bg-white/70 px-3 py-2 text-xs font-semibold text-ink-soft transition hover:border-teal hover:bg-teal/5 hover:text-teal active:bg-onyx active:text-white"
          >
            <Plus size={14} />
            Crear POI personalizado
            <Sparkles size={12} className="text-teal" />
          </button>
        </div>
      </div>

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
              className="mt-3 flex items-center gap-1.5 rounded-md text-[11px] font-semibold text-red-700 hover:underline active:bg-onyx active:text-white"
            >
              <RefreshCw size={12} /> Reintentar
            </button>
          </div>
        )}

        {coordenadasTemporales ? (
          <FormularioPunto
            key="nuevo"
            categorias={categorias}
            coordenadas={coordenadasTemporales}
            onCancelar={onCancelar}
            onGuardar={onGuardar}
          />
        ) : puntoEnEdicion ? (
          <FormularioPunto
            key={puntoEnEdicion.id}
            categorias={categorias}
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
