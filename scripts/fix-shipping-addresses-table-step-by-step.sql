-- Paso 1: Crear la tabla básica si no existe
CREATE TABLE IF NOT EXISTS order_shipping_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 2: Agregar la referencia foreign key si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_shipping_addresses_order_id_fkey'
        AND table_name = 'order_shipping_addresses'
    ) THEN
        ALTER TABLE order_shipping_addresses 
        ADD CONSTRAINT order_shipping_addresses_order_id_fkey 
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Paso 3: Agregar todas las columnas necesarias una por una
DO $$ 
BEGIN
    -- recipient_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'recipient_name') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN recipient_name VARCHAR(255);
    END IF;

    -- address_line
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'address_line') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN address_line TEXT;
    END IF;

    -- postal_code
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'postal_code') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN postal_code VARCHAR(10);
    END IF;

    -- municipality
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'municipality') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN municipality VARCHAR(255);
    END IF;

    -- province
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'province') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN province VARCHAR(255);
    END IF;

    -- phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'phone') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN phone VARCHAR(20);
    END IF;

    -- shipping_type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'shipping_type') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN shipping_type VARCHAR(50) DEFAULT 'delivery';
    END IF;

    -- pickup_point_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'pickup_point_name') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN pickup_point_name VARCHAR(255);
    END IF;

    -- pickup_point_address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'order_shipping_addresses' 
                   AND column_name = 'pickup_point_address') THEN
        ALTER TABLE order_shipping_addresses ADD COLUMN pickup_point_address TEXT;
    END IF;
END $$;

-- Paso 4: Agregar el CHECK constraint para shipping_type si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_shipping_addresses_shipping_type_check'
        AND table_name = 'order_shipping_addresses'
    ) THEN
        ALTER TABLE order_shipping_addresses 
        ADD CONSTRAINT order_shipping_addresses_shipping_type_check 
        CHECK (shipping_type IN ('delivery', 'pickup'));
    END IF;
END $$;

-- Paso 5: Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_order_shipping_addresses_order_id ON order_shipping_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_order_shipping_addresses_shipping_type ON order_shipping_addresses(shipping_type);

-- Paso 6: Habilitar RLS
ALTER TABLE order_shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Paso 7: Crear políticas RLS si no existen
DO $$
BEGIN
    -- Política para SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_shipping_addresses' 
        AND policyname = 'Users can view their own shipping addresses'
    ) THEN
        CREATE POLICY "Users can view their own shipping addresses" ON order_shipping_addresses
            FOR SELECT USING (
                order_id IN (
                    SELECT id FROM orders WHERE user_id = auth.uid()
                )
            );
    END IF;

    -- Política para INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_shipping_addresses' 
        AND policyname = 'Users can insert shipping addresses for their orders'
    ) THEN
        CREATE POLICY "Users can insert shipping addresses for their orders" ON order_shipping_addresses
            FOR INSERT WITH CHECK (
                order_id IN (
                    SELECT id FROM orders WHERE user_id = auth.uid()
                )
            );
    END IF;

    -- Política para UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_shipping_addresses' 
        AND policyname = 'Users can update their own shipping addresses'
    ) THEN
        CREATE POLICY "Users can update their own shipping addresses" ON order_shipping_addresses
            FOR UPDATE USING (
                order_id IN (
                    SELECT id FROM orders WHERE user_id = auth.uid()
                )
            );
    END IF;
END $$;
