-- Agregar columnas faltantes a la tabla existente (si ya existe)
DO $$ 
BEGIN
    -- Agregar address_line si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'address_line') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN address_line TEXT;
    END IF;

    -- Agregar recipient_name si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'recipient_name') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN recipient_name VARCHAR(255);
    END IF;

    -- Agregar postal_code si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'postal_code') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN postal_code VARCHAR(10);
    END IF;

    -- Agregar municipality si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'municipality') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN municipality VARCHAR(255);
    END IF;

    -- Agregar province si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'province') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN province VARCHAR(255);
    END IF;

    -- Agregar phone si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'phone') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN phone VARCHAR(20);
    END IF;

    -- Agregar shipping_type si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'shipping_type') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN shipping_type VARCHAR(50) DEFAULT 'delivery';
    END IF;

    -- Agregar pickup_point_name si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'pickup_point_name') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN pickup_point_name VARCHAR(255);
    END IF;

    -- Agregar pickup_point_address si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'pickup_point_address') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN pickup_point_address TEXT;
    END IF;

END $$;
