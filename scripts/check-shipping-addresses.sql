-- Verificar la estructura de las direcciones de envío en los pedidos
SELECT 
  id,
  shipping_address,
  created_at
FROM orders 
WHERE shipping_address IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 5;

-- También verificar la tabla de direcciones si existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'addresses' 
AND table_schema = 'public';
