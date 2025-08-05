-- Test simple sin cambiar roles
SELECT 'Conexión exitosa' as status, current_user as usuario_actual, current_database() as base_datos;

-- Verificar permisos sobre una tabla específica
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasinserts,
    hasselects,
    hasupdates,
    hasdeletes
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'order_items', 'order_shipping_addresses')
LIMIT 5;

-- Test de una consulta simple
SELECT COUNT(*) as total_orders FROM orders;
