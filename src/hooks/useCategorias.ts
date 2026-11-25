import { useCallback, useEffect, useRef, useState } from 'react'
import { registrarCategoriasPersonalizadas } from '../config/categorias'
import {
  crearCategoriaPersonalizada,
  obtenerCategorias,
  type CategoriaFila,
  type DatosCategoriaPersonalizada,
} from '../services/categoriasService'

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaFila[]>([])
  const referencia = useRef<CategoriaFila[]>([])

  const sincronizar = useCallback((filas: CategoriaFila[]) => {
    referencia.current = filas
    registrarCategoriasPersonalizadas(filas)
    setCategorias(filas)
  }, [])

  useEffect(() => {
    let activo = true

    void obtenerCategorias()
      .then((filas) => {
        if (activo) sincronizar(filas)
      })
      .catch(() => {
        // Si falla la carga, el catálogo predefinido sigue funcionando.
      })

    return () => {
      activo = false
    }
  }, [sincronizar])

  const crear = useCallback(
    async (datos: DatosCategoriaPersonalizada) => {
      const fila = await crearCategoriaPersonalizada(datos)
      sincronizar([...referencia.current, fila])
      return fila
    },
    [sincronizar],
  )

  return { categorias, crear }
}
