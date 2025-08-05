-- Eliminar la tabla si existe para empezar limpio
DROP TABLE IF EXISTS order_shipping_addresses CASCADE;

-- Crear tabla para guardar las direcciones de envío de los pedidos de forma estática
CREATE TABLE order_shipping_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    address_line_1 VARCHAR(500) NOT NULL,
    address_line_2 VARCHAR(500),
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'España',
    phone VARCHAR(50),
    email VARCHAR(255),
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_order_shipping_addresses_order_id ON order_shipping_addresses(order_id);
CREATE INDEX idx_order_shipping_addresses_created_at ON order_shipping_addresses(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE order_shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view own order shipping addresses" ON order_shipping_addresses;
DROP POLICY IF EXISTS "Users can create own order shipping addresses" ON order_shipping_addresses;
DROP POLICY IF EXISTS "Users can update own order shipping addresses" ON order_shipping_addresses;

-- Política para que los usuarios solo vean las direcciones de sus propios pedidos
CREATE POLICY "Users can view own order shipping addresses" ON order_shipping_addresses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_shipping_addresses.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Política para que los usuarios puedan crear direcciones de envío para sus propios pedidos
CREATE POLICY "Users can create own order shipping addresses" ON order_shipping_addresses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_shipping_addresses.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Política para que los usuarios puedan actualizar direcciones de envío de sus propios pedidos
CREATE POLICY "Users can update own order shipping addresses" ON order_shipping_addresses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_shipping_addresses.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_order_shipping_addresses_updated_at 
    BEFORE UPDATE ON order_shipping_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'order_shipping_addresses'
ORDER BY ordinal_position;
