-- Agregar todas las columnas faltantes a la tabla orders
BEGIN;

-- Agregar subtotal si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'subtotal'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added subtotal column';
    ELSE
        RAISE NOTICE 'subtotal column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding subtotal: %', SQLERRM;
END $$;

-- Agregar shipping_cost si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_cost'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10,2) DEFAULT 0;
        RAISE NOTICE 'Added shipping_cost column';
    ELSE
        RAISE NOTICE 'shipping_cost column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding shipping_cost: %', SQLERRM;
END $$;

-- Agregar total si no existe (renombrar total_amount si existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'total'
        AND table_schema = 'public'
    ) THEN
        -- Verificar si existe total_amount y renombrarlo
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' 
            AND column_name = 'total_amount'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE orders RENAME COLUMN total_amount TO total;
            RAISE NOTICE 'Renamed total_amount to total';
        ELSE
            ALTER TABLE orders ADD COLUMN total DECIMAL(10,2) DEFAULT 0;
            RAISE NOTICE 'Added total column';
        END IF;
    ELSE
        RAISE NOTICE 'total column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding total: %', SQLERRM;
END $$;

-- Agregar status si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'status'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
        RAISE NOTICE 'Added status column';
    ELSE
        RAISE NOTICE 'status column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding status: %', SQLERRM;
END $$;

-- Agregar payment_method si no existe
DO $$ 
BEGIN
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
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding payment_method: %', SQLERRM;
END $$;

-- Agregar created_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'created_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added created_at column';
    ELSE
        RAISE NOTICE 'created_at column already exists';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error adding created_at: %', SQLERRM;
END $$;

-- Agregar updated_at si no existe
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
