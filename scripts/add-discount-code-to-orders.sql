-- Añadir campos de descuento a la tabla orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Crear índice para el código de descuento
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);
