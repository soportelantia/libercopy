-- Otorgar permisos necesarios para la tabla order_shipping_addresses
-- Esto es especialmente importante si hay problemas de permisos

-- Otorgar permisos básicos a usuarios autenticados
GRANT SELECT, INSERT, UPDATE ON order_shipping_addresses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON order_shipping_addresses TO anon;

-- Otorgar permisos en la secuencia si existe
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verificar permisos
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'order_shipping_addresses';
