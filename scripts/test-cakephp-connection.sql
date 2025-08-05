-- Test básico de conexión (ejecutar como cakephp_external)
SELECT 
    'Conexión exitosa' as status,
    current_user as usuario_actual,
    current_database() as base_datos,
    version() as postgres_version;

-- Test de consulta a una tabla específica
SELECT COUNT(*) as total_orders FROM orders;

-- Test de consulta con JOIN
SELECT 
    o.id,
    o.status
FROM orders o
LEFT JOIN order_shipping_addresses osa ON o.id = osa.order_id
LIMIT 3;

-- Verificar que podemos insertar (test)
-- NOTA: Esto es solo para probar, puedes comentarlo si no quieres insertar datos de prueba
/*
INSERT INTO orders (status, total_amount, created_at, updated_at) 
VALUES ('test', 0.00, NOW(), NOW()) 
RETURNING id, status;
*/
