-- Verificar si la tabla order_shipping_addresses existe
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
ORDER BY ordinal_position;

-- Verificar las políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'order_shipping_addresses';

-- Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'order_shipping_addresses';
