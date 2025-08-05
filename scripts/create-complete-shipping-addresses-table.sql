-- Crear la tabla order_shipping_addresses con todas las columnas necesarias
CREATE TABLE IF NOT EXISTS order_shipping_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    address_line TEXT NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    municipality VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    shipping_type VARCHAR(50) DEFAULT 'delivery' CHECK (shipping_type IN ('delivery', 'pickup')),
    pickup_point_name VARCHAR(255),
    pickup_point_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_order_shipping_addresses_order_id ON order_shipping_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_order_shipping_addresses_shipping_type ON order_shipping_addresses(shipping_type);

-- Habilitar RLS
ALTER TABLE order_shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Users can view their own shipping addresses" ON order_shipping_addresses
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert shipping addresses for their orders" ON order_shipping_addresses
    FOR INSERT WITH CHECK (
        order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own shipping addresses" ON order_shipping_addresses
    FOR UPDATE USING (
        order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid()
        )
    );
