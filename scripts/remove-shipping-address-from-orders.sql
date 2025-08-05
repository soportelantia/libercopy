-- Eliminar la columna shipping_address de la tabla orders ya que ahora usaremos la tabla separada
-- Primero verificamos si la columna existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
    ) THEN
        ALTER TABLE orders DROP COLUMN shipping_address;
    END IF;
END $$;
