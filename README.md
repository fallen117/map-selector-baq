# Mapa de interés · Soledad

Aplicación web para explorar, consultar y registrar puntos de interés en el mapa de Soledad (Atlántico, Colombia). La interfaz combina un panel lateral de consulta con un mapa interactivo principal, y toda la información se persiste en Supabase.

## Funcionalidades

- **Mapa base interactivo:** renderiza Leaflet con capas de OpenStreetMap y ocupa el área principal de la pantalla.
- **Delimitación geográfica:** la vista se centra en Soledad y restringe el desplazamiento y el zoom mínimo a los límites del área metropolitana, mediante `maxBounds`.
- **Carga de puntos existentes:** al abrir la app se consultan todos los puntos de interés guardados y se muestran sobre el mapa con su icono descriptivo.
- **Captura de coordenadas por clic:** al hacer clic en una ubicación válida se obtienen latitud y longitud y se coloca un marcador temporal de referencia.
- **Creación de puntos:** el clic abre un formulario en el panel lateral para ingresar título, descripción y seleccionar un icono de un catálogo predefinido.
- **Validación y persistencia:** los campos obligatorios se validan antes de guardar; el registro se envía a PostgreSQL y el mapa se actualiza sin recargar la página. El marcador temporal se reemplaza por el definitivo.
- **Consulta de detalles:** al hacer clic en cualquier marcador se despliega un popup con el icono, el título en negrita y la descripción completa.
- **Listado lateral:** las tarjetas de los puntos guardados permiten localizarlos en el mapa y abrir su información.
- **Búsqueda y filtrado:** búsqueda por texto sobre título y descripción, además de filtros por categoría/icono; el listado y los marcadores se sincronizan con los filtros activos.
- **Navegación rápida:** control de zoom, botón «Centrar vista» y vuelo suave (`flyTo`) hacia un punto seleccionado.
- **Manejo de errores:** si falla la conexión con Supabase se muestra una notificación limpia con opción de reintento, sin perder lo escrito en el formulario.

## Características

- Separación estricta entre la lógica del mapa (Leaflet), el acceso a datos (Supabase) y la interfaz (React), organizada en capas por funcionalidad.
- Arquitectura BaaS: no existe un servidor propio; la API REST, la autenticación y la base de datos son gestionadas por Supabase.
- Todos los datos de la aplicación viven en el esquema `map_selector`, con las tablas `categorias` y `puntos_interes` relacionadas por clave foránea.
- Row Level Security activo: los roles `anon` y `authenticated` pueden leer y crear puntos y categorías del catálogo; no hay edición ni borrado desde la interfaz.
- Las categorías se crean bajo demanda cuando un usuario guarda un punto, por lo que la base de datos no requiere datos semilla.
- Diseño adaptable con disposición 30% panel / 70% mapa en escritorio y apilado en pantallas pequeñas, con foco visible y respeto a `prefers-reduced-motion`.

## Stack tecnológico

### Frontend

- React 18 + Vite + TypeScript
- React-Leaflet y Leaflet, con capas de OpenStreetMap
- Tailwind CSS v4
- Lucide React (iconografía de interfaz y marcadores)
- Cliente JavaScript de Supabase

### Backend

- Supabase como Backend-as-a-Service: API PostgREST, roles `anon`/`authenticated` y Row Level Security
- PostgreSQL con extensión PostGIS
- Esquema `map_selector`: `categorias` (catálogo de iconos) y `puntos_interes` (georreferenciados, con FK a `categorias`)
