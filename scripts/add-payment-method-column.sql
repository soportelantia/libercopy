-- Añadir columna payment_method a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Añadir comentario para documentar la columna
COMMENT ON COLUMN orders.payment_method IS 'Método de pago seleccionado: redsys o paypal';
