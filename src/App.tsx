import { useState } from 'react'
import { PanelLateral } from './components/layout/PanelLateral'
import { MapaPrincipal } from './components/mapa/MapaPrincipal'
import { useMapa } from './hooks/useMapa'
import { usePuntos } from './hooks/usePuntos'
import type { Coordenadas, NuevoPunto, PuntoInteres } from './types/mapa.types'

function App() {
  const datos = usePuntos()
  const mapa = useMapa()
  const [puntoEnEdicion, setPuntoEnEdicion] = useState<PuntoInteres | null>(null)

  async function manejarGuardar(nuevo: NuevoPunto) {
    if (puntoEnEdicion) {
      const actualizado = await datos.editarPunto(puntoEnEdicion.id, nuevo)
      setPuntoEnEdicion(null)
      mapa.resaltarPunto(actualizado.id)
      mapa.volarA(
        { lat: actualizado.latitud, lng: actualizado.longitud },
        15,
      )
      return
    }

    const creado = await datos.guardarPunto(nuevo)
    mapa.limpiarCoordenadas()
    mapa.resaltarPunto(creado.id)
    mapa.volarA({ lat: creado.latitud, lng: creado.longitud }, 15)
  }

  function manejarSeleccionar(punto: PuntoInteres) {
    mapa.resaltarPunto(punto.id)
    mapa.volarA({ lat: punto.latitud, lng: punto.longitud })
  }

  function manejarClicMapa(coordenadas: Coordenadas) {
    setPuntoEnEdicion(null)
    mapa.seleccionarCoordenadas(coordenadas)
  }

  function manejarEditar(punto: PuntoInteres) {
    mapa.limpiarCoordenadas()
    setPuntoEnEdicion(punto)
  }

  async function manejarEliminar(id: string): Promise<boolean> {
    const eliminado = await datos.borrarPunto(id)
    if (!eliminado) return false

    if (puntoEnEdicion?.id === id) setPuntoEnEdicion(null)
    if (mapa.puntoResaltado === id) mapa.resaltarPunto(null)
    return true
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white md:flex-row">
      <PanelLateral
        puntos={datos.puntosFiltrados}
        cargando={datos.cargando}
        error={datos.error}
        termino={datos.termino}
        categoriaActiva={datos.categoriaActiva}
        coordenadasTemporales={mapa.coordenadasTemporales}
        puntoEnEdicion={puntoEnEdicion}
        hayFiltros={Boolean(datos.termino.trim() || datos.categoriaActiva)}
        onTermino={datos.setTermino}
        onCategoria={datos.setCategoriaActiva}
        onLimpiarFiltros={datos.limpiarFiltros}
        onReintentar={() => void datos.recargar()}
        onCancelar={mapa.limpiarCoordenadas}
        onCancelarEdicion={() => setPuntoEnEdicion(null)}
        onGuardar={manejarGuardar}
        onSeleccionar={manejarSeleccionar}
        onEditar={manejarEditar}
        onEliminar={manejarEliminar}
      />

      <main className="relative min-h-0 flex-1">
        <MapaPrincipal
          puntos={datos.puntosFiltrados}
          coordenadasTemporales={mapa.coordenadasTemporales}
          puntoResaltado={mapa.puntoResaltado}
          onClicMapa={manejarClicMapa}
          onMapaListo={mapa.registrarMapa}
          onSeleccionar={manejarSeleccionar}
          onCentrar={mapa.centrarVista}
        />
      </main>
    </div>
  )
}

export default App
