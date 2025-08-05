-- En Supabase, los usuarios están en auth.users
-- Vamos a crear una foreign key constraint que referencie auth.users

-- Primero, verificar que user_id es UUID y coincide con auth.users.id
ALTER TABLE orders 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Crear la foreign key constraint hacia auth.users
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Crear un índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
