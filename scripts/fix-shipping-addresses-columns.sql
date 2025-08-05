-- Arreglar la tabla order_shipping_addresses
DO $$ 
BEGIN
    -- Si existe address_line_1, agregar address_line como alias o renombrar
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'order_shipping_addresses' 
               AND column_name = 'address_line_1') THEN
        
        -- Si no existe address_line, agregarla
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'order_shipping_addresses' 
                       AND column_name = 'address_line') THEN
            ALTER TABLE order_shipping_addresses ADD COLUMN address_line TEXT;
        END IF;
        
        -- Hacer address_line_1 nullable si no lo es
        ALTER TABLE order_shipping_addresses ALTER COLUMN address_line_1 DROP NOT NULL;
    END IF;

    -- Asegurar que todas las columnas necesarias existen y son nullable
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'recipient_name') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN recipient_name VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'postal_code') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN postal_code VARCHAR(10);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'municipality') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN municipality VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'province') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN province VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'phone') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN phone VARCHAR(20);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'shipping_type') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN shipping_type VARCHAR(50) DEFAULT 'delivery';
    END IF;
END $$;

-- Hacer todas las columnas nullable para evitar errores de NOT NULL
ALTER TABLE order_shipping_addresses ALTER COLUMN recipient_name DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN postal_code DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN municipality DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN province DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE order_shipping_addresses ALTER COLUMN shipping_type DROP NOT NULL;
