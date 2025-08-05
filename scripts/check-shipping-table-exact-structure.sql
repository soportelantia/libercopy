-- Ver la estructura exacta de la tabla order_shipping_addresses
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
ORDER BY ordinal_position;

-- Ver específicamente las columnas NOT NULL
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
AND is_nullable = 'NO';

-- Ver constraints
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'order_shipping_addresses';
