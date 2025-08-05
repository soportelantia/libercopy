-- Deshabilitar RLS temporalmente para verificar si es el problema
-- (Solo para debugging, no recomendado en producción)
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- O crear políticas más permisivas para actualizaciones de pago
-- Eliminar políticas existentes que podrían estar causando problemas
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
DROP POLICY IF EXISTS "Service role can update orders" ON orders;

-- Crear política para que los usuarios puedan actualizar sus propios pedidos
CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Crear política para que el service role pueda actualizar cualquier pedido
CREATE POLICY "Service role can update orders" ON orders
    FOR UPDATE USING (auth.role() = 'service_role');

-- Crear política para permitir actualizaciones desde la API
CREATE POLICY "API can update orders" ON orders
    FOR UPDATE USING (true);

-- Verificar que las políticas se crearon correctamente
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'orders';
