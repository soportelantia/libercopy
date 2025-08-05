-- Crear tabla para guardar las direcciones de envío de los pedidos de forma estática
CREATE TABLE IF NOT EXISTS order_shipping_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    address_line_1 VARCHAR(500) NOT NULL,
    address_line_2 VARCHAR(500),
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'España',
    phone VARCHAR(50),
    email VARCHAR(255),
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_order_shipping_addresses_order_id ON order_shipping_addresses(order_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE order_shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean las direcciones de sus propios pedidos
CREATE POLICY IF NOT EXISTS "Users can view own order shipping addresses" ON order_shipping_addresses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_shipping_addresses.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Política para que los usuarios puedan crear direcciones de envío para sus propios pedidos
CREATE POLICY IF NOT EXISTS "Users can create own order shipping addresses" ON order_shipping_addresses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_shipping_addresses.order_id 
            AND orders.user_id = auth.uid()
        )
    );
