-- Añadir columna para almacenar referencias de pago (IDs de transacción)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);

-- Crear índice para búsquedas por referencia de pago
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON orders(payment_reference);

-- Comentario para la columna
COMMENT ON COLUMN orders.payment_reference IS 'ID de transacción o referencia del procesador de pagos';
