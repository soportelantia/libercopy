-- Verificar si existe la tabla users en el esquema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';

-- Si no existe, crear la tabla users o usar auth.users
-- En Supabase, los usuarios están en auth.users, no en public.users

-- Verificar la estructura actual de la tabla orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public';

-- Verificar si existe la foreign key constraint
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'orders'
    AND kcu.column_name = 'user_id';
