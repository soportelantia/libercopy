-- Script simplificado para arreglar RLS
BEGIN;

-- Eliminar políticas existentes que podrían causar problemas
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Service role can update orders" ON orders;
DROP POLICY IF EXISTS "API can update orders" ON orders;

-- Crear una política simple que permita actualizaciones
CREATE POLICY "Allow order updates" ON orders
    FOR UPDATE USING (true);

-- Verificar que se creó la política
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'orders';

COMMIT;
