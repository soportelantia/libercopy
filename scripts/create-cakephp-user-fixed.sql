-- Crear el usuario con permisos de conexión
CREATE USER cakephp_external WITH 
    PASSWORD 'TuPasswordSegura123!'
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOINHERIT
    NOREPLICATION;

-- Otorgar permisos de conexión a la base de datos
GRANT CONNECT ON DATABASE postgres TO cakephp_external;

-- Otorgar permisos sobre el esquema public
GRANT USAGE ON SCHEMA public TO cakephp_external;

-- Otorgar permisos sobre todas las tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cakephp_external;

-- Para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cakephp_external;

-- Permisos sobre secuencias (para auto-increment)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cakephp_external;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO cakephp_external;

-- Verificar que el usuario se creó correctamente
SELECT usename, usecreatedb, usesuper FROM pg_user WHERE usename = 'cakephp_external';
