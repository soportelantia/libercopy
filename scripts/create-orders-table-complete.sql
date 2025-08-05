-- Crear tabla orders completa con todas las columnas necesarias
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_payment',
    shipping_address JSONB,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propios pedidos
CREATE POLICY IF NOT EXISTS "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan crear sus propios pedidos
CREATE POLICY IF NOT EXISTS "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar sus propios pedidos
CREATE POLICY IF NOT EXISTS "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);
