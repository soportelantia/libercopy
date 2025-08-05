-- Ver todos los usuarios/roles existentes
SELECT rolname, rolsuper, rolcreaterole, rolcreatedb, rolcanlogin, rolconnlimit
FROM pg_roles 
ORDER BY rolname;

-- Ver específicamente si existe nuestro usuario
SELECT rolname, rolcanlogin, rolconnlimit, rolvaliduntil
FROM pg_roles 
WHERE rolname = 'cakephp_external';

-- Ver permisos sobre la base de datos postgres
SELECT datname, datacl 
FROM pg_database 
WHERE datname = 'postgres';
