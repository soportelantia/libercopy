-- Add discount code fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Add foreign key constraint (optional, allows for referential integrity)
-- ALTER TABLE orders 
-- ADD CONSTRAINT fk_orders_discount_code 
-- FOREIGN KEY (discount_code) REFERENCES discount_codes(code);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);
