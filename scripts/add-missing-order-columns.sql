-- Añadir columnas que podrían faltar en la tabla orders
DO $$ 
BEGIN
    -- Añadir payment_method si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_method'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50);
        RAISE NOTICE 'Added payment_method column';
    ELSE
        RAISE NOTICE 'payment_method column already exists';
    END IF;

    -- Añadir payment_reference si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_reference'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(255);
        RAISE NOTICE 'Added payment_reference column';
    ELSE
        RAISE NOTICE 'payment_reference column already exists';
    END IF;

    -- Añadir paid_at si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'paid_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN paid_at TIMESTAMPTZ;
        RAISE NOTICE 'Added paid_at column';
    ELSE
        RAISE NOTICE 'paid_at column already exists';
    END IF;

    -- Añadir updated_at si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'updated_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at);
