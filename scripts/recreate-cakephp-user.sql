-- Eliminar usuario si existe (para empezar limpio)
DROP USER IF EXISTS cakephp_external;

-- Crear el usuario correctamente
CREATE USER cakephp_external WITH 
    PASSWORD 'CakePhp2024!Secure'
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT  -- Cambiar a INHERIT para mejor compatibilidad
    NOREPLICATION
    CONNECTION LIMIT -1;

-- Otorgar permisos básicos
GRANT CONNECT ON DATABASE postgres TO cakephp_external;
GRANT USAGE ON SCHEMA public TO cakephp_external;

-- Otorgar permisos sobre tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cakephp_external;

-- Para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cakephp_external;

-- Permisos sobre secuencias
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cakephp_external;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO cakephp_external;

-- Verificar que se creó correctamente
SELECT rolname, rolcanlogin, rolconnlimit 
FROM pg_roles 
WHERE rolname = 'cakephp_external';

-- Mostrar mensaje de confirmación
SELECT 'Usuario cakephp_external creado exitosamente' as status;
