-- Hacer todas las columnas nullable excepto las esenciales
ALTER TABLE order_shipping_addresses ALTER COLUMN city DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN address_line_1 DROP NOT NULL;

-- Agregar columnas que podrían faltar
DO $$ 
BEGIN
    -- Agregar city si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'city') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN city VARCHAR(255);
    END IF;

    -- Agregar state si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'state') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN state VARCHAR(255);
    END IF;

    -- Agregar country si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'country') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN country VARCHAR(255) DEFAULT 'España';
    END IF;
END $$;

-- Hacer todas las columnas nullable
ALTER TABLE order_shipping_addresses ALTER COLUMN city DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN state DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN country DROP NOT NULL;
