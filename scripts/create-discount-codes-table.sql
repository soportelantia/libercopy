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

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_dates ON discount_codes(start_date, end_date);

-- Habilitar RLS
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de códigos activos
CREATE POLICY "Allow public read of active discount codes" ON discount_codes
  FOR SELECT USING (is_active = true AND start_date <= NOW() AND end_date >= NOW());

-- Política para permitir acceso completo al service role
CREATE POLICY "Allow service role full access" ON discount_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Insertar códigos de ejemplo
INSERT INTO discount_codes (code, percentage, start_date, end_date, max_uses, is_active) VALUES
  ('WELCOME10', 10.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', 100, true),
  ('STUDENT15', 15.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', 200, true),
  ('SAVE20', 20.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days', 50, true)
ON CONFLICT (code) DO NOTHING;
