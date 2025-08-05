-- Verificar que la tabla tiene todas las columnas necesarias
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar constraints
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'order_shipping_addresses' 
AND table_schema = 'public';

-- Verificar políticas RLS
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'order_shipping_addresses';
