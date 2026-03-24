-- Add customer_email column to orders table for abandoned cart recovery
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'orders'
          AND column_name = 'customer_email'
          AND table_schema = 'public'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_email TEXT;
        RAISE NOTICE 'Added customer_email column to orders';
    ELSE
        RAISE NOTICE 'customer_email column already exists';
    END IF;
END $$;

-- Ensure RLS policy allows service role to insert orders with null user_id
-- (service role bypasses RLS by default, so no additional policy needed)

-- Add index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Add index on status for abandoned cart queries
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
