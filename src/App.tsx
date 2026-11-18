import { PanelLateral } from './components/layout/PanelLateral'
import { MapaPrincipal } from './components/mapa/MapaPrincipal'
import { useMapa } from './hooks/useMapa'
import { usePuntos } from './hooks/usePuntos'
import type { NuevoPunto, PuntoInteres } from './types/mapa.types'

function App() {
  const datos = usePuntos()
  const mapa = useMapa()

  async function manejarGuardar(nuevo: NuevoPunto) {
    const creado = await datos.guardarPunto(nuevo)
    mapa.limpiarCoordenadas()
    mapa.resaltarPunto(creado.id)
    mapa.volarA({ lat: creado.latitud, lng: creado.longitud }, 15)
  }

  function manejarSeleccionar(punto: PuntoInteres) {
    mapa.resaltarPunto(punto.id)
    mapa.volarA({ lat: punto.latitud, lng: punto.longitud })
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
        hayFiltros={Boolean(datos.termino.trim() || datos.categoriaActiva)}
        onTermino={datos.setTermino}
        onCategoria={datos.setCategoriaActiva}
        onLimpiarFiltros={datos.limpiarFiltros}
        onReintentar={() => void datos.recargar()}
        onCancelar={mapa.limpiarCoordenadas}
        onGuardar={manejarGuardar}
        onSeleccionar={manejarSeleccionar}
      />

      <main className="relative min-h-0 flex-1">
        <MapaPrincipal
          puntos={datos.puntosFiltrados}
          coordenadasTemporales={mapa.coordenadasTemporales}
          puntoResaltado={mapa.puntoResaltado}
          onClicMapa={mapa.seleccionarCoordenadas}
          onMapaListo={mapa.registrarMapa}
          onSeleccionar={manejarSeleccionar}
          onCentrar={mapa.centrarVista}
        />
      </main>
    </div>
  )
}

export default App
