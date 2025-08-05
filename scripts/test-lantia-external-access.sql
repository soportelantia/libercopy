-- Test de acceso con el usuario lantia_external
-- (Ejecutar después de otorgar permisos)

-- Verificar usuario actual
SELECT 
    current_user as usuario_actual,
    current_database() as base_datos;

-- Test de consulta básica
SELECT COUNT(*) as total_orders FROM orders;

-- Test de consulta con datos
SELECT 
    id,
    status
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Test de JOIN con shipping addresses
SELECT 
    o.id,
    o.status
FROM orders o
LEFT JOIN order_shipping_addresses osa ON o.id = osa.order_id
LIMIT 3;

-- Verificar permisos específicos
SELECT 
    'orders' as tabla,
    has_table_privilege(current_user, 'orders', 'SELECT') as puede_select,
    has_table_privilege(current_user, 'orders', 'INSERT') as puede_insert;
