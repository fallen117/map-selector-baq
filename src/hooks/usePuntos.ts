import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  actualizarPunto,
  crearPunto,
  eliminarPunto,
  obtenerPuntos,
} from '../services/puntosService'
import type { NuevoPunto, PuntoInteres } from '../types/mapa.types'

export function usePuntos() {
  const [puntos, setPuntos] = useState<PuntoInteres[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [termino, setTermino] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)

  const recargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setPuntos(await obtenerPuntos())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado al cargar.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void recargar()
  }, [recargar])

  const guardarPunto = useCallback(async (nuevo: NuevoPunto) => {
    const creado = await crearPunto(nuevo)
    setPuntos((actuales) => [creado, ...actuales])
    return creado
  }, [])

  const editarPunto = useCallback(async (id: string, nuevo: NuevoPunto) => {
    const actualizado = await actualizarPunto(id, nuevo)
    setPuntos((actuales) =>
      actuales.map((punto) => (punto.id === id ? actualizado : punto)),
    )
    return actualizado
  }, [])

  const borrarPunto = useCallback(async (id: string) => {
    setError(null)
    try {
      await eliminarPunto(id)
      setPuntos((actuales) => actuales.filter((punto) => punto.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el punto.')
      return false
    }
  }, [])

  const limpiarFiltros = useCallback(() => {
    setTermino('')
    setCategoriaActiva(null)
  }, [])

  const puntosFiltrados = useMemo(() => {
    const texto = termino.trim().toLowerCase()

    return puntos.filter((punto) => {
      const coincideTexto =
        !texto ||
        punto.titulo.toLowerCase().includes(texto) ||
        punto.disponibilidades.some((disponibilidad) =>
          disponibilidad.nombre.toLowerCase().includes(texto),
        )

      const coincideCategoria =
        !categoriaActiva || punto.categoria?.nombre === categoriaActiva

      return coincideTexto && coincideCategoria
    })
  }, [puntos, termino, categoriaActiva])

  return {
    puntos,
    puntosFiltrados,
    cargando,
    error,
    termino,
    categoriaActiva,
    setTermino,
    setCategoriaActiva,
    limpiarFiltros,
    recargar,
    guardarPunto,
    editarPunto,
    borrarPunto,
  }
}
