-- Eliminar políticas existentes si hay alguna
DROP POLICY IF EXISTS "Enable insert for service role" ON order_status_history;
DROP POLICY IF EXISTS "Enable read for users" ON order_status_history;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON order_status_history;

-- Habilitar RLS en la tabla
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Política para permitir que el service role (API callbacks) inserte registros
CREATE POLICY "Enable insert for service role"
ON order_status_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para permitir que los usuarios lean su propio historial
CREATE POLICY "Enable read for users"
ON order_status_history
FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Verificar que la tabla existe y tiene los permisos correctos
SELECT 
  tablename, 
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'order_status_history';
