-- Verificar la estructura actual de la tabla orders
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar las políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- Verificar si RLS está habilitado (versión simplificada)
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'orders';

-- Verificar que la tabla orders existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'orders'
) as orders_table_exists;

-- Contar registros en la tabla orders
SELECT COUNT(*) as total_orders FROM orders;

-- Mostrar algunos pedidos de ejemplo (sin datos sensibles)
SELECT 
    id,
    status,
    total_amount,
    created_at,
    CASE WHEN user_id IS NOT NULL THEN 'HAS_USER_ID' ELSE 'NO_USER_ID' END as user_id_status
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
