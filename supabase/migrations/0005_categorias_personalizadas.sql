-- Los POI personalizados se guardan como categorías creadas por el usuario.
-- La política anterior solo admitía una lista fija de nombres, por lo que un
-- nombre escrito en la modal era rechazado por RLS. Ahora se permite cualquier
-- nombre no vacío (hasta 60 caracteres, el tamaño de la columna) con icono.

drop policy if exists "Creación pública de categorías" on map_selector.categorias;

create policy "Creación pública de categorías"
  on map_selector.categorias
  for insert
  to anon, authenticated
  with check (
    length(btrim(nombre)) between 1 and 60
    and length(btrim(icono_nombre)) > 0
  );
