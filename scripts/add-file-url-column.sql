-- Añadir columna file_url a la tabla order_items si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'file_url'
    ) THEN
        ALTER TABLE order_items ADD COLUMN file_url TEXT;
        COMMENT ON COLUMN order_items.file_url IS 'URL del archivo en Google Cloud Storage';
    END IF;
END $$;
