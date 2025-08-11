-- Añadir campos de código de descuento a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);
