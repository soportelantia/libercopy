-- Verificar si la tabla existe y qué columnas tiene
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Si no existe, mostrar todas las tablas que contienen 'shipping' o 'address'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%shipping%' OR table_name LIKE '%address%');
