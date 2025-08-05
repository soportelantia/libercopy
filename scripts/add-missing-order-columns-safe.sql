-- Script más seguro para añadir columnas faltantes
BEGIN;

-- Verificar y añadir payment_method
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_method'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_method TEXT;
        RAISE NOTICE 'Added payment_method column';
    ELSE
        RAISE NOTICE 'payment_method column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding payment_method: %', SQLERRM;
END $$;

-- Verificar y añadir payment_reference
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_reference'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_reference TEXT;
        RAISE NOTICE 'Added payment_reference column';
    ELSE
        RAISE NOTICE 'payment_reference column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding payment_reference: %', SQLERRM;
END $$;

-- Verificar y añadir paid_at
DO $$ 
BEGIN
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
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding paid_at: %', SQLERRM;
END $$;

-- Verificar y añadir updated_at
DO $$ 
BEGIN
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
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding updated_at: %', SQLERRM;
END $$;

COMMIT;

-- Mostrar la estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
