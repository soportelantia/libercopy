-- Verificar la estructura completa de la tabla order_items
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar constraints NOT NULL
SELECT 
    column_name,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
    AND table_schema = 'public'
    AND is_nullable = 'NO'
ORDER BY column_name;
