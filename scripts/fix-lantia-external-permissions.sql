-- Verificar el usuario actual y sus permisos
SELECT 
    r.rolname,
    r.rolcanlogin,
    r.rolsuper,
    ARRAY(SELECT b.rolname FROM pg_catalog.pg_auth_members m 
          JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid) 
          WHERE m.member = r.oid) as memberof
FROM pg_catalog.pg_roles r 
WHERE r.rolname LIKE '%lantia_external%';

-- Otorgar permisos básicos de conexión y esquema
GRANT CONNECT ON DATABASE postgres TO "lantia_external";
GRANT USAGE ON SCHEMA public TO "lantia_external";

-- Otorgar permisos sobre TODAS las tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "lantia_external";

-- Para tablas que se creen en el futuro
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "lantia_external";

-- Permisos sobre secuencias (para IDs auto-incrementales)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "lantia_external";
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO "lantia_external";

-- Permisos específicos sobre las tablas principales de tu e-commerce
GRANT ALL PRIVILEGES ON TABLE orders TO "lantia_external";
GRANT ALL PRIVILEGES ON TABLE order_items TO "lantia_external";
GRANT ALL PRIVILEGES ON TABLE order_shipping_addresses TO "lantia_external";

-- Verificar permisos específicos después de otorgarlos
SELECT 
    schemaname,
    tablename,
    has_table_privilege('lantia_external', schemaname||'.'||tablename, 'SELECT') as can_select,
    has_table_privilege('lantia_external', schemaname||'.'||tablename, 'INSERT') as can_insert,
    has_table_privilege('lantia_external', schemaname||'.'||tablename, 'UPDATE') as can_update,
    has_table_privilege('lantia_external', schemaname||'.'||tablename, 'DELETE') as can_delete
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'order_items', 'order_shipping_addresses')
ORDER BY tablename;

-- Mensaje de confirmación
SELECT 'Permisos otorgados a lantia_external' as status;
