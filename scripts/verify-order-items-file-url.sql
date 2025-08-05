-- Verificar la estructura de la tabla order_items y los datos actuales
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar los últimos order_items creados
SELECT 
  id,
  order_id,
  file_name,
  file_url,
  file_size,
  page_count,
  created_at
FROM order_items 
ORDER BY created_at DESC 
LIMIT 10;
