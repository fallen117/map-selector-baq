import { useState, type FormEvent } from 'react'
import { ArrowLeft, Check, LoaderCircle, Save } from 'lucide-react'
import { buscarCategoria, CATEGORIAS } from '../../config/categorias'
import { DISPONIBILIDADES } from '../../config/disponibilidad'
import type { Coordenadas, NuevoPunto, PuntoInteres } from '../../types/mapa.types'

interface Props {
  coordenadas: Coordenadas
  punto?: PuntoInteres | null
  onCancelar: () => void
  onGuardar: (nuevo: NuevoPunto) => Promise<void>
}

export function FormularioPunto({
  coordenadas,
  punto,
  onCancelar,
  onGuardar,
}: Props) {
  const editando = Boolean(punto)

  const [titulo, setTitulo] = useState(punto?.titulo ?? '')
  const [seleccionadas, setSeleccionadas] = useState<string[]>(
    punto?.disponibilidades.map((disponibilidad) => disponibilidad.nombre) ?? [],
  )
  const [categoria, setCategoria] = useState(
    buscarCategoria(punto?.categoria?.nombre) ?? CATEGORIAS[0],
  )
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intentado, setIntentado] = useState(false)

  const tituloVacio = !titulo.trim()
  const sinDisponibilidad = seleccionadas.length === 0

  function alternarDisponibilidad(nombre: string) {
    setSeleccionadas((actuales) =>
      actuales.includes(nombre)
        ? actuales.filter((item) => item !== nombre)
        : [...actuales, nombre],
    )
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setIntentado(true)
    setError(null)

    if (tituloVacio || sinDisponibilidad || guardando) return

    setGuardando(true)
    try {
      await onGuardar({
        titulo,
        latitud: coordenadas.lat,
        longitud: coordenadas.lng,
        categoria,
        disponibilidades: DISPONIBILIDADES.filter((opcion) =>
          seleccionadas.includes(opcion.nombre),
        ).map((opcion) => opcion.nombre),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el punto.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <button
        type="button"
        onClick={onCancelar}
        className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition hover:text-teal active:text-onyx"
      >
        <ArrowLeft size={14} /> Volver a la lista
      </button>

      <h2 className="font-display text-lg font-bold tracking-tight">
        {editando ? 'Editar punto' : 'Nuevo punto'}
      </h2>
      <p className="mt-1 text-xs text-ink-soft">
        {editando
          ? 'Actualiza la información de este lugar.'
          : 'Ubicación seleccionada en el mapa.'}
      </p>
      <p className="mt-2 w-fit rounded-md bg-mist px-2 py-1 font-data text-[11px] text-ink-soft transition hover:bg-onyx/10 hover:text-ink">
        {coordenadas.lat.toFixed(5)}, {coordenadas.lng.toFixed(5)}
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="titulo" className="text-xs font-semibold">
            Título
          </label>
          <input
            id="titulo"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            placeholder="Ej. Parque de la paz"
            className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none ${
              intentado && tituloVacio
                ? 'border-red-400 bg-red-50/40'
                : 'border-[#DCE6E9] focus:border-teal'
            }`}
          />
          {intentado && tituloVacio && (
            <p className="mt-1 text-[11px] text-red-600">Escribe un título.</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold">Disponibilidad</span>
            <span className="font-data text-[10px] text-ink-soft">
              {seleccionadas.length} seleccionada
              {seleccionadas.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">
            Selecciona una o varias opciones.
          </p>

          <div
            className={`mt-2 space-y-2 rounded-xl border p-2 ${
              intentado && sinDisponibilidad
                ? 'border-red-400 bg-red-50/40'
                : 'border-[#DCE6E9]'
            }`}
          >
            {DISPONIBILIDADES.map((opcion) => {
              const activa = seleccionadas.includes(opcion.nombre)
              const Icono = opcion.Icono

              return (
                <button
                  key={opcion.nombre}
                  type="button"
                  onClick={() => alternarDisponibilidad(opcion.nombre)}
                  aria-pressed={activa}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition ${
                    activa
                      ? 'border-teal bg-teal/5 text-ink'
                      : 'border-transparent text-ink-soft hover:bg-mist active:bg-onyx active:text-white'
                  }`}
                >
                  <Icono size={16} color={opcion.color} />
                  <span className="flex-1">{opcion.nombre}</span>
                  <span
                    className={`grid h-4 w-4 place-items-center rounded border ${
                      activa ? 'border-teal bg-teal text-white' : 'border-[#C8D6DB]'
                    }`}
                  >
                    {activa && <Check size={11} strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>

          {intentado && sinDisponibilidad && (
            <p className="mt-1 text-[11px] text-red-600">
              Selecciona al menos una disponibilidad.
            </p>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold">Icono descriptivo</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CATEGORIAS.map((opcion) => {
              const activa = opcion.nombre === categoria.nombre
              const Icono = opcion.Icono

              return (
                <button
                  key={opcion.nombre}
                  type="button"
                  onClick={() => setCategoria(opcion)}
                  aria-pressed={activa}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-semibold transition ${
                    activa
                      ? 'border-teal bg-teal/5 text-ink'
                      : 'border-[#DCE6E9] text-ink-soft hover:bg-mist active:bg-onyx active:text-white'
                  }`}
                >
                  <Icono size={18} color={opcion.color} />
                  {opcion.nombre}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          disabled={guardando}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b6972] active:bg-onyx disabled:opacity-60"
        >
          {guardando ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {guardando
            ? 'Guardando...'
            : editando
              ? 'Guardar cambios'
              : 'Guardar punto'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="rounded-xl border border-[#DCE6E9] px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-mist active:bg-onyx active:text-white disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
