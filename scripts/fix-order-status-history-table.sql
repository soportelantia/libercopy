-- Arreglar la tabla order_status_history
DO $$ 
BEGIN
    -- Agregar la columna notes si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_status_history' 
                   AND column_name = 'notes') THEN
        ALTER TABLE order_status_history ADD COLUMN notes TEXT;
    END IF;

    -- Asegurar que otras columnas necesarias existen
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_status_history' 
                   AND column_name = 'order_id') THEN
        ALTER TABLE order_status_history ADD COLUMN order_id UUID NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_status_history' 
                   AND column_name = 'status') THEN
        ALTER TABLE order_status_history ADD COLUMN status VARCHAR(50) NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_status_history' 
                   AND column_name = 'created_at') THEN
        ALTER TABLE order_status_history ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;
