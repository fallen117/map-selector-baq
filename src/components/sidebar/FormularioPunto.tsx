import { useState, type FormEvent } from 'react'
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react'
import { CATEGORIAS } from '../../config/categorias'
import type { Coordenadas, NuevoPunto } from '../../types/mapa.types'

interface Props {
  coordenadas: Coordenadas
  onCancelar: () => void
  onGuardar: (nuevo: NuevoPunto) => Promise<void>
}

export function FormularioPunto({ coordenadas, onCancelar, onGuardar }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intentado, setIntentado] = useState(false)

  const tituloVacio = !titulo.trim()
  const descripcionVacia = !descripcion.trim()

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setIntentado(true)
    setError(null)

    if (tituloVacio || descripcionVacia || guardando) return

    setGuardando(true)
    try {
      await onGuardar({ titulo, descripcion, latitud: coordenadas.lat, longitud: coordenadas.lng, categoria })
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
        className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition hover:text-teal"
      >
        <ArrowLeft size={14} /> Volver a la lista
      </button>

      <h2 className="font-display text-lg font-bold tracking-tight">Nuevo punto</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Ubicación seleccionada en el mapa.
      </p>
      <p className="mt-2 w-fit rounded-md bg-mist px-2 py-1 font-data text-[11px] text-ink-soft">
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
          <label htmlFor="descripcion" className="text-xs font-semibold">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            rows={3}
            placeholder="¿Qué encontrarás en este lugar?"
            className={`mt-1.5 w-full resize-none rounded-xl border px-3 py-2.5 text-sm focus:outline-none ${
              intentado && descripcionVacia
                ? 'border-red-400 bg-red-50/40'
                : 'border-[#DCE6E9] focus:border-teal'
            }`}
          />
          {intentado && descripcionVacia && (
            <p className="mt-1 text-[11px] text-red-600">Agrega una descripción.</p>
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
                      : 'border-[#DCE6E9] text-ink-soft hover:bg-mist'
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b6972] disabled:opacity-60"
        >
          {guardando ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {guardando ? 'Guardando...' : 'Guardar punto'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="rounded-xl border border-[#DCE6E9] px-4 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-mist disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
