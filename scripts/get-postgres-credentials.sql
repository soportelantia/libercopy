-- Para obtener información del usuario postgres
SELECT 
    'postgres' as username,
    'Usar la contraseña principal de Supabase' as password_note,
    'aws-0-us-east-1.pooler.supabase.com' as host,
    5432 as port,
    'postgres' as database;

-- Verificar que postgres puede conectarse
SELECT current_user, current_database(), 'Conexión OK' as status;
