-- Añadir campos de detalles de envío a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_company VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_notes TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Crear índice para el número de seguimiento
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;
