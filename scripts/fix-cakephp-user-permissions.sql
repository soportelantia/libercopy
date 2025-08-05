-- Verificar permisos actuales del usuario
SELECT 
    r.rolname,
    r.rolcanlogin,
    ARRAY(SELECT b.rolname FROM pg_catalog.pg_auth_members m 
          JOIN pg_catalog.pg_roles b ON (m.roleid = b.oid) 
          WHERE m.member = r.oid) as memberof
FROM pg_catalog.pg_roles r 
WHERE r.rolname = 'cakephp_external';

-- Resetear la contraseña por si acaso
ALTER USER cakephp_external WITH PASSWORD 'CakePhp2024!Secure';

-- Asegurar permisos básicos
GRANT CONNECT ON DATABASE postgres TO cakephp_external;
GRANT USAGE ON SCHEMA public TO cakephp_external;

-- Otorgar permisos específicos sobre todas las tablas
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cakephp_external;

-- Para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cakephp_external;

-- Permisos sobre secuencias (importante para IDs auto-incrementales)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cakephp_external;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO cakephp_external;

-- Verificar permisos específicos sobre las tablas principales
SELECT 
    schemaname,
    tablename,
    tableowner,
    has_table_privilege('cakephp_external', schemaname||'.'||tablename, 'SELECT') as can_select,
    has_table_privilege('cakephp_external', schemaname||'.'||tablename, 'INSERT') as can_insert,
    has_table_privilege('cakephp_external', schemaname||'.'||tablename, 'UPDATE') as can_update,
    has_table_privilege('cakephp_external', schemaname||'.'||tablename, 'DELETE') as can_delete
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'order_items', 'order_shipping_addresses')
ORDER BY tablename;

-- Mensaje de confirmación
SELECT 'Permisos actualizados para cakephp_external' as status;
