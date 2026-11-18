-- Backend de la aplicación: permisos de acceso desde el cliente web.
-- No inserta datos de prueba.

-- Extensión geográfica requerida por el stack.
create extension if not exists postgis with schema extensions;

-- PostgREST debe poder usar el esquema de la aplicación.
grant usage on schema map_selector to anon, authenticated;

-- Categorías: lectura del catálogo y creación bajo demanda desde el formulario.
grant select on map_selector.categorias to anon, authenticated;
grant insert on map_selector.categorias to anon, authenticated;
grant usage on sequence map_selector.categorias_id_seq to anon, authenticated;

-- Puntos de interés: lectura y creación (sin edición ni borrado).
grant select, insert on map_selector.puntos_interes to anon, authenticated;

drop policy if exists "Creación pública de categorías" on map_selector.categorias;
create policy "Creación pública de categorías"
  on map_selector.categorias
  for insert
  to anon, authenticated
  with check (nombre in ('Restaurante', 'Parque', 'Alerta', 'Tienda', 'Servicio'));
