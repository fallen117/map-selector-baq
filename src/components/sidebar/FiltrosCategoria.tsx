import { Search } from 'lucide-react'
import { CATEGORIAS } from '../../config/categorias'

interface Props {
  termino: string
  onTermino: (valor: string) => void
  categoriaActiva: string | null
  onCategoria: (nombre: string | null) => void
}

export function FiltrosCategoria({
  termino,
  onTermino,
  categoriaActiva,
  onCategoria,
}: Props) {
  return (
    <div className="border-b border-[#E6ECEE] px-6 pb-4">
      <label className="relative block">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          value={termino}
          onChange={(evento) => onTermino(evento.target.value)}
          placeholder="Buscar punto o calle..."
          aria-label="Buscar puntos"
          className="w-full rounded-xl border border-[#DCE6E9] bg-mist/60 py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-[#8BA0AA] hover:border-onyx/25 focus:border-teal focus:bg-white focus:outline-none"
        />
      </label>

      <div className="panel-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onCategoria(null)}
          aria-pressed={categoriaActiva === null}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            categoriaActiva === null
              ? 'bg-ink text-white'
              : 'bg-mist text-ink-soft hover:bg-[#E1EAEC] active:bg-onyx active:text-white'
          }`}
        >
          Todas
        </button>

        {CATEGORIAS.map((categoria) => {
          const activa = categoriaActiva === categoria.nombre
          const Icono = categoria.Icono

          return (
            <button
              key={categoria.nombre}
              type="button"
              onClick={() => onCategoria(activa ? null : categoria.nombre)}
              aria-pressed={activa}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                activa
                  ? 'border-transparent text-white'
                  : 'border-[#DCE6E9] bg-white text-ink-soft hover:bg-mist active:bg-onyx active:text-white'
              }`}
              style={activa ? { backgroundColor: categoria.color } : undefined}
            >
              <Icono size={14} color={activa ? '#ffffff' : categoria.color} />
              {categoria.nombre}
            </button>
          )
        })}
      </div>
    </div>
  )
}
