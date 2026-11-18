# Mapa de interés · Soledad

Aplicación web para explorar y registrar puntos de interés en un mapa de Soledad (Atlántico). Arquitectura en capas con React + Vite y Supabase como BaaS.

## Arranque local

```bash
npm install
cp .env.example .env.local   # ya incluido en este proyecto
npm run dev
```

Las credenciales en `.env.local` son una clave **publishable** de Supabase (segura para el cliente). La access token administrativa nunca se usa en el frontend.

## Base de datos

Toda la datos de la app viven en el esquema `map_selector` de Supabase:

- `categorias` — catálogo de iconos (se crea una fila solo cuando un usuario guarda un punto con esa categoría).
- `puntos_interes` — puntos georreferenciados, con FK a `categorias`.

No se incluyen datos de prueba. Las tablas arrancan vacías.

### Configuración de Supabase ya aplicada

- El esquema `map_selector` está expuesto en la API (PostgREST `db_schema`).
- La migración `supabase/migrations/0001_backend_acceso.sql` otorga los grants y la política de inserción de categorías; se aplicó también en el proyecto remoto.
- Las categorías se crean bajo demanda desde el frontend, sin datos semilla.

## Estructura

```
src/
├── config/        # Cliente de Supabase, catálogo de categorías y config del mapa
├── types/         # Interfaces TypeScript
├── services/      # Acceso a datos (Supabase), sin React
├── hooks/         #Estado de puntos y del mapa
├── utils/         # Conversión de iconos Lucide → divIcon de Leaflet
├── components/    # layout / mapa / sidebar
└── App.tsx
```

## Permisos actuales

Los Roles `anon`/`authenticated` pueden **leer** ambos tablas y **crear** puntos y categorías del catálogo. No hay edición ni borrado desde la interfaz.
