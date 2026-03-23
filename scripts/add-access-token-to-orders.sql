-- Add access_token column to orders table for secure abandoned cart recovery
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token TEXT;

-- Add unique index so tokens can be efficiently looked up and are collision-safe
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_access_token ON orders(access_token)
  WHERE access_token IS NOT NULL;

-- Also ensure customer_email column exists (idempotent)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, created_at);
