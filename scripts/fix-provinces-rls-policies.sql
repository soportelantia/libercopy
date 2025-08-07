-- Verificar si las tablas existen
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('provinces', 'municipalities');

-- Verificar políticas RLS existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('provinces', 'municipalities');

-- Eliminar políticas existentes si hay problemas
DROP POLICY IF EXISTS "Allow public read access on provinces" ON provinces;
DROP POLICY IF EXISTS "Allow public read access on municipalities" ON municipalities;

-- Recrear políticas más permisivas
CREATE POLICY "Enable read access for all users" ON provinces
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON municipalities
    FOR SELECT USING (true);

-- Verificar que RLS está habilitado
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Verificar datos
SELECT COUNT(*) as total_provinces FROM provinces;
SELECT COUNT(*) as total_municipalities FROM municipalities;
