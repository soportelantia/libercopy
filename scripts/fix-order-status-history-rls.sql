-- Verificar si la tabla order_status_history existe y tiene RLS habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'order_status_history';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'order_status_history';

-- Crear políticas RLS para order_status_history
-- Los usuarios pueden ver el historial de sus propios pedidos
DROP POLICY IF EXISTS "Users can view their own order status history" ON order_status_history;
CREATE POLICY "Users can view their own order status history" ON order_status_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_status_history.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Los usuarios autenticados pueden insertar historial (para cuando cancelan pedidos)
DROP POLICY IF EXISTS "Users can insert order status history for their orders" ON order_status_history;
CREATE POLICY "Users can insert order status history for their orders" ON order_status_history
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_status_history.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Habilitar RLS en la tabla
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'order_status_history';
