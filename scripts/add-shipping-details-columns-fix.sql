-- Verificar si las columnas ya existen antes de añadirlas
DO $$
BEGIN
    -- Verificar y añadir columna shipping_company
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_company'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_company VARCHAR(100);
    END IF;

    -- Verificar y añadir columna tracking_number
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'tracking_number'
    ) THEN
        ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(100);
    END IF;

    -- Verificar y añadir columna shipping_notes
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_notes'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_notes TEXT;
    END IF;

    -- Verificar y añadir columna estimated_delivery_date
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'estimated_delivery_date'
    ) THEN
        ALTER TABLE orders ADD COLUMN estimated_delivery_date TIMESTAMP WITH TIME ZONE;
    END IF;
END
$$;
