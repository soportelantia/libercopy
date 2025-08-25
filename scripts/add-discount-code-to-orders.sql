-- Añadir campos de descuento a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2);

-- Crear índice para el código de descuento
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code);

-- Añadir constraint para asegurar que si hay discount_code, también hay percentage y amount
ALTER TABLE orders 
ADD CONSTRAINT check_discount_consistency 
CHECK (
  (discount_code IS NULL AND discount_percentage IS NULL AND discount_amount IS NULL) OR
  (discount_code IS NOT NULL AND discount_percentage IS NOT NULL AND discount_amount IS NOT NULL)
);
