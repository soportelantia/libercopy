-- Verificar estructura real de order_shipping_addresses
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
ORDER BY ordinal_position;

-- Verificar estructura real de order_status_history
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_status_history'
ORDER BY ordinal_position;

-- Verificar constraints NOT NULL en order_shipping_addresses
SELECT column_name, is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
AND is_nullable = 'NO';
