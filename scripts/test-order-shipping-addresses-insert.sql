-- Script de prueba para verificar que podemos insertar datos
-- NOTA: Este script es solo para testing, no ejecutar en producción

-- Primero, verificar que tenemos pedidos existentes
SELECT id, user_id, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Intentar insertar una dirección de prueba (reemplaza el order_id con uno real)
-- IMPORTANTE: Reemplaza 'tu-order-id-aqui' con un ID real de la tabla orders
/*
INSERT INTO order_shipping_addresses (
    order_id,
    recipient_name,
    address_line_1,
    city,
    province,
    postal_code,
    country,
    phone,
    email
) VALUES (
    'tu-order-id-aqui',  -- Reemplaza con un order_id real
    'Test Cliente',
    'Calle Test 123',
    'Madrid',
    'Madrid',
    '28001',
    'España',
    '123456789',
    'test@example.com'
);
*/

-- Verificar que se insertó correctamente
SELECT * FROM order_shipping_addresses ORDER BY created_at DESC LIMIT 5;
