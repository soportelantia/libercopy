-- Verificar si la tabla pricing existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing') THEN
        RAISE EXCEPTION 'La tabla pricing no existe. Ejecuta primero create-pricing-table.sql';
    END IF;
END $$;

-- Habilitar RLS en la tabla pricing
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "pricing_select_policy" ON pricing;

-- Crear política para permitir SELECT público (lectura)
CREATE POLICY "pricing_select_policy" 
ON pricing 
FOR SELECT 
TO public 
USING (true);

-- Verificar que las políticas se aplicaron correctamente
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'pricing';

-- Verificar que se pueden leer los datos
SELECT COUNT(*) as total_pricing_records FROM pricing;

-- Mostrar algunos registros de ejemplo
SELECT service_type, option_key, option_value, price, description 
FROM pricing 
ORDER BY service_type, option_key, option_value 
LIMIT 10;
