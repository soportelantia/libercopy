-- Verificar si la tabla ya existe antes de crearla
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_status_history') THEN
        -- Crear tabla de historial de estados del pedido
        CREATE TABLE public.order_status_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL,
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID REFERENCES auth.users(id)
        );

        -- Crear índice para mejorar el rendimiento
        CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
        CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at);

        -- Insertar historial inicial para pedidos existentes
        INSERT INTO order_status_history (order_id, status, created_at)
        SELECT id, status, created_at
        FROM orders;
    END IF;
END
$$;
