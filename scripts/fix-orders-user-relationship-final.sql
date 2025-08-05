-- Verificar la estructura actual de la tabla orders
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar si existe la foreign key constraint hacia auth.users
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

-- Si no existe la foreign key, crearla
DO $$
BEGIN
    -- Verificar si la constraint ya existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_orders_user_id' 
        AND table_name = 'orders'
    ) THEN
        -- Asegurar que user_id es UUID
        ALTER TABLE orders ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
        
        -- Crear la foreign key constraint hacia auth.users
        ALTER TABLE orders 
        ADD CONSTRAINT fk_orders_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint created successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Crear índice si no existe
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Verificar que las políticas RLS estén correctas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'orders';

-- Mostrar algunos pedidos de ejemplo para verificar
SELECT id, user_id, status, total, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
