-- Hacer que algunos campos de order_items no sean obligatorios
-- para evitar errores al crear pedidos

ALTER TABLE order_items 
ALTER COLUMN orientation DROP NOT NULL;

ALTER TABLE order_items 
ALTER COLUMN print_form DROP NOT NULL;

ALTER TABLE order_items 
ALTER COLUMN file_size DROP NOT NULL;

-- Agregar valores por defecto para campos comunes
ALTER TABLE order_items 
ALTER COLUMN orientation SET DEFAULT 'portrait';

ALTER TABLE order_items 
ALTER COLUMN print_form SET DEFAULT 'single_sided';

ALTER TABLE order_items 
ALTER COLUMN file_size SET DEFAULT 0;

-- Verificar la estructura actualizada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
    AND table_schema = 'public'
    AND column_name IN ('orientation', 'print_form', 'file_size')
ORDER BY column_name;
