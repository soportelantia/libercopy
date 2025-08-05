-- Verificar la estructura de la tabla order_shipping_addresses
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses' 
ORDER BY ordinal_position;

-- Verificar si hay datos en la tabla
SELECT COUNT(*) as total_shipping_addresses FROM order_shipping_addresses;

-- Mostrar algunos registros de ejemplo
SELECT 
    id,
    order_id,
    recipient_name,
    address_line,
    postal_code,
    municipality,
    province,
    shipping_type,
    created_at
FROM order_shipping_addresses 
ORDER BY created_at DESC 
LIMIT 5;
