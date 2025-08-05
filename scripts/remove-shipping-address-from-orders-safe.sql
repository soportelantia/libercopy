-- Verificar si la columna shipping_address existe en la tabla orders
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'shipping_address';

-- Eliminar la columna shipping_address de la tabla orders si existe
DO $$ 
BEGIN
    -- Verificar si la columna existe antes de intentar eliminarla
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
        AND table_schema = 'public'
    ) THEN
        -- Eliminar la columna
        ALTER TABLE orders DROP COLUMN shipping_address;
        RAISE NOTICE 'Columna shipping_address eliminada de la tabla orders';
    ELSE
        RAISE NOTICE 'La columna shipping_address no existe en la tabla orders';
    END IF;
END $$;

-- Verificar que la columna se eliminó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'shipping_address';
