import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Check, LoaderCircle, Search, Sparkles, X } from 'lucide-react'
import {
  colorParaNombre,
  PALETA_CATEGORIAS,
} from '../../config/categorias'
import { ICONOS_PERSONALIZABLES } from '../../config/iconos'
import type { DatosCategoriaPersonalizada } from '../../services/categoriasService'

interface Props {
  abierto: boolean
  nombresExistentes: string[]
  onCerrar: () => void
  onCrear: (datos: DatosCategoriaPersonalizada) => Promise<void>
}

export function ModalCategoriaPersonalizada({
  abierto,
  nombresExistentes,
  onCerrar,
  onCrear,
}: Props) {
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('MapPin')
  const [color, setColor] = useState(() => colorParaNombre(''))
  const [busquedaIcono, setBusquedaIcono] = useState('')
  const [intentado, setIntentado] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const entradaNombre = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!abierto) return

    setNombre('')
    setIcono('MapPin')
    setColor(colorParaNombre(''))
    setBusquedaIcono('')
    setIntentado(false)
    setError(null)
    entradaNombre.current?.focus()
  }, [abierto])

  useEffect(() => {
    if (!abierto) return

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && !guardando) onCerrar()
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [abierto, guardando, onCerrar])

  const iconosFiltrados = useMemo(() => {
    const texto = busquedaIcono.trim().toLowerCase()
    if (!texto) return ICONOS_PERSONALIZABLES
    return ICONOS_PERSONALIZABLES.filter(
      (opcion) =>
        opcion.etiqueta.toLowerCase().includes(texto) ||
        opcion.nombre.toLowerCase().includes(texto),
    )
  }, [busquedaIcono])

  const seleccion = ICONOS_PERSONALIZABLES.find(
    (opcion) => opcion.nombre === icono,
  )
  const IconoSeleccionado = seleccion?.Icono

  const nombreNormalizado = nombre.trim()
  const nombreVacio = !nombreNormalizado
  const nombreLargo = nombreNormalizado.length > 60
  const duplicado = nombresExistentes.some(
    (existente) => existente.toLowerCase() === nombreNormalizado.toLowerCase(),
  )

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setIntentado(true)
    setError(null)

    if (nombreVacio || nombreLargo || duplicado || guardando) return

    setGuardando(true)
    try {
      await onCrear({ nombre: nombreNormalizado, icono, color })
      onCerrar()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo crear el POI personalizado.',
      )
    } finally {
      setGuardando(false)
    }
  }

  if (!abierto) return null

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar creación de POI personalizado"
        onClick={() => !guardando && onCerrar()}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/55 backdrop-blur-sm"
      />

      <form
        onSubmit={manejarEnvio}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-personalizado"
        className="relative flex max-h-[calc(100%-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(6,6,6,0.35)] backdrop-blur-xl"
      >
        <header className="flex items-start gap-3 border-b border-[#E6ECEE] px-5 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
            <Sparkles size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="titulo-modal-personalizado"
              className="font-display text-base font-bold tracking-tight"
            >
              Crear POI personalizado
            </h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">
              Elige un nombre y un icono. Podrás usarlo al registrar puntos en el
              mapa y filtrar por él.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-mist hover:text-ink active:bg-onyx active:text-white disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </header>

        <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label htmlFor="nombre-personalizado" className="text-xs font-semibold">
              Nombre del POI
            </label>
            <input
              ref={entradaNombre}
              id="nombre-personalizado"
              value={nombre}
              maxLength={61}
              onChange={(evento) => setNombre(evento.target.value)}
              placeholder="Ej. Centro cultural"
              aria-invalid={intentado && (nombreVacio || nombreLargo || duplicado)}
              className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none ${
                intentado && (nombreVacio || nombreLargo || duplicado)
                  ? 'border-red-400 bg-red-50/40'
                  : 'border-[#DCE6E9] focus:border-teal'
              }`}
            />
            {intentado && nombreVacio && (
              <p className="mt-1 text-[11px] text-red-600">Escribe un nombre.</p>
            )}
            {intentado && nombreLargo && (
              <p className="mt-1 text-[11px] text-red-600">
                El nombre no puede superar los 60 caracteres.
              </p>
            )}
            {intentado && duplicado && (
              <p className="mt-1 text-[11px] text-red-600">
                Ya existe un POI con ese nombre.
              </p>
            )}
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold">Color</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PALETA_CATEGORIAS.map((opcion) => {
                const activa = color === opcion
                return (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setColor(opcion)}
                    aria-label={`Color ${opcion}`}
                    aria-pressed={activa}
                    className={`grid h-7 w-7 place-items-center rounded-full border-2 transition active:scale-95 ${
                      activa ? 'border-ink' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: opcion }}
                  >
                    {activa && <Check size={13} className="text-white" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">Icono</span>
              <span className="font-data text-[10px] text-ink-soft">
                {iconosFiltrados.length} disponibles
              </span>
            </div>
            <label className="relative mt-2 block">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                type="search"
                value={busquedaIcono}
                onChange={(evento) => setBusquedaIcono(evento.target.value)}
                placeholder="Buscar icono..."
                aria-label="Buscar icono"
                className="w-full rounded-xl border border-[#DCE6E9] bg-mist/60 py-2 pl-9 pr-3 text-xs focus:border-teal focus:bg-white focus:outline-none"
              />
            </label>

            {IconoSeleccionado && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#DCE6E9] bg-mist/50 px-3 py-2">
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg text-white"
                  style={{ backgroundColor: color }}
                >
                  <IconoSeleccionado size={17} />
                </span>
                <span className="text-[11px] text-ink-soft">
                  Seleccionado:{' '}
                  <strong className="text-ink">{seleccion?.etiqueta}</strong>
                </span>
              </div>
            )}

            {iconosFiltrados.length === 0 ? (
              <p className="mt-4 text-center text-xs text-ink-soft">
                No hay iconos que coincidan con la búsqueda.
              </p>
            ) : (
              <div className="panel-scroll mt-3 grid max-h-52 grid-cols-6 gap-1.5 overflow-y-auto rounded-xl border border-[#DCE6E9] p-2 sm:grid-cols-8">
                {iconosFiltrados.map((opcion) => {
                  const Icono = opcion.Icono
                  const activa = icono === opcion.nombre

                  return (
                    <button
                      key={opcion.nombre}
                      type="button"
                      onClick={() => setIcono(opcion.nombre)}
                      title={opcion.etiqueta}
                      aria-label={opcion.etiqueta}
                      aria-pressed={activa}
                      className={`grid aspect-square place-items-center rounded-lg border transition ${
                        activa
                          ? 'border-teal bg-teal/10 text-teal'
                          : 'border-transparent text-ink-soft hover:bg-mist hover:text-ink active:bg-onyx active:text-white'
                      }`}
                    >
                      <Icono size={18} />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </p>
          )}
        </div>

        <footer className="flex gap-2 border-t border-[#E6ECEE] px-5 py-4">
          <button
            type="submit"
            disabled={guardando}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b6972] active:bg-onyx disabled:opacity-60"
          >
            {guardando ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {guardando ? 'Creando...' : 'Crear POI'}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="rounded-xl border border-[#DCE6E9] px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-mist active:bg-onyx active:text-white disabled:opacity-60"
          >
            Cancelar
          </button>
        </footer>
      </form>
    </div>
  )
}
