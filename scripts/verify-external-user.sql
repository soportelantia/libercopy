-- Verificar si el usuario existe
SELECT usename, usecreatedb, usesuper, userepl, valuntil 
FROM pg_user 
WHERE usename = 'cakephp_external';

-- Ver todos los usuarios disponibles
SELECT usename FROM pg_user ORDER BY usename;

-- Verificar permisos de conexión
SELECT datname, datacl FROM pg_database WHERE datname = 'postgres';
