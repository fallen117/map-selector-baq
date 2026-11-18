# Base de datos del proyecto

La base de datos de este proyecto es el schema **`map_selector`** de Supabase.

- Proyecto Supabase: `myProject` (`twhkiymjvhnutnwawrzg`), organización `ljrdxlwxecacsgyaihsp`.
- **Toda tabla, consulta, migración y política del proyecto debe vivir en `map_selector`** (calificar siempre como `map_selector.<tabla>`). No crear tablas de la app en `public` ni en otros schemas (`sena`, `t-visor`, etc.).
- Los schemas `public`, `sena` y `t-visor` existen pero no son la BD de esta app.

## Tablas actuales

### `map_selector.categorias`
| Columna | Tipo | Nullable | Default / restricción |
| --- | --- | --- | --- |
| `id` | integer | no | `nextval('map_selector.categorias_id_seq')`, PK |
| `nombre` | varchar | no | UNIQUE |
| `icono_nombre` | varchar | no | — |
| `color_hex` | varchar | no | `'#3B82F6'` |
| `creado_en` | timestamptz | no | `now()` |

### `map_selector.puntos_interes`
| Columna | Tipo | Nullable | Default / restricción |
| --- | --- | --- | --- |
| `id` | uuid | no | `gen_random_uuid()`, PK |
| `titulo` | varchar | no | — |
| `descripcion` | text | no | — |
| `latitud` | double precision | no | CHECK `between -90 and 90` |
| `longitud` | double precision | no | CHECK `between -180 and 180` |
| `categoria_id` | integer | no | FK → `map_selector.categorias(id)` (`puntos_interes_categoria_id_fkey`) |
| `creado_en` | timestamptz | no | `now()` |

Ambas tablas están vacías (0 filas) y tienen RLS habilitado.

## Policies RLS existentes
- `categorias`: `Lectura pública de categorías` (SELECT, rol `public`).
- `puntos_interes`: `Lectura pública de puntos` (SELECT, rol `public`) y `Creación pública de puntos` (INSERT, rol `public`).

## Acceso desde el cliente web (configurado)
- El schema `map_selector` está expuesto en la API de Supabase (`db_schema` de PostgREST = `public,graphql_public,sena,map_selector`).
- Grants activos para `anon` y `authenticated`: `USAGE` en el schema, `SELECT` + `INSERT` en ambas tablas y `USAGE` en la secuencia `categorias_id_seq`.
- Política `Creación pública de categorías`: permite `INSERT` solo para los nombres del catálogo del frontend (Restaurante, Parque, Alerta, Tienda, Servicio).
- Las filas de `categorias` se crean bajo demanda cuando un usuario guarda un punto; el proyecto no incluye datos semilla.
- La app usa únicamente la clave **publishable** en `.env.local`. La access token administrativa reside solo en `.opencode/opencode.jsonc` (moverla a una variable de entorno cuando sea posible).
