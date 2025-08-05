-- Crear tabla de historial de estados del pedido
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Insertar historial inicial para pedidos existentes
INSERT INTO order_status_history (order_id, status, created_at)
SELECT id, status, created_at
FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_status_history WHERE order_id = orders.id
);
