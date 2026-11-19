-- Edición y eliminación de puntos de interés desde el cliente web.

grant update, delete on map_selector.puntos_interes to anon, authenticated;

drop policy if exists "Edición pública de puntos" on map_selector.puntos_interes;
create policy "Edición pública de puntos"
  on map_selector.puntos_interes
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Eliminación pública de puntos" on map_selector.puntos_interes;
create policy "Eliminación pública de puntos"
  on map_selector.puntos_interes
  for delete
  to anon, authenticated
  using (true);
