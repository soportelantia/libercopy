-- Verificar que la tabla orders existe y mostrar su estructura básica
\d orders;

-- O si el comando anterior no funciona, usar esta consulta:
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar algunos registros
SELECT 
    id,
    status,
    total_amount,
    created_at
FROM orders 
LIMIT 3;
