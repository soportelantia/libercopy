-- Crear tabla de códigos de descuento
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar algunos códigos de descuento de ejemplo
INSERT INTO discount_codes (code, percentage, start_date, end_date, max_uses, current_uses) VALUES
('WELCOME10', 10.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', 100, 0),
('STUDENT15', 15.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', 50, 0),
('SAVE20', 20.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days', 25, 0);

-- Habilitar RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados
CREATE POLICY "Allow read access to discount codes" ON discount_codes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir actualización de uso de códigos
CREATE POLICY "Allow update current_uses" ON discount_codes
  FOR UPDATE USING (auth.role() = 'authenticated');
