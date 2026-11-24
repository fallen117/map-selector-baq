-- El catálogo del frontend incluye "Parqueadero" como categoría.
-- La política anterior solo permitía los nombres del catálogo antiguo, por lo que
-- al guardar un punto de ese tipo fallaba el INSERT en map_selector.categorias.

drop policy if exists "Creación pública de categorías" on map_selector.categorias;

create policy "Creación pública de categorías"
  on map_selector.categorias
  for insert
  to anon, authenticated
  with check (
    nombre in (
      'Restaurante',
      'Parque',
      'Alerta',
      'Tienda',
      'Servicio',
      'Parqueadero'
    )
  );
