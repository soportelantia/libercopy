-- Añadir nuevos campos de seguimiento de envío a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_company VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_url TEXT;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number) WHERE tracking_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_shipping_company ON orders(shipping_company) WHERE shipping_company IS NOT NULL;

-- Comentarios para documentar los campos
COMMENT ON COLUMN orders.tracking_number IS 'Número de seguimiento del envío';
COMMENT ON COLUMN orders.shipping_company IS 'Empresa de mensajería (Correos, SEUR, MRW, etc.)';
COMMENT ON COLUMN orders.tracking_url IS 'URL para seguimiento del envío';
