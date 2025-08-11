-- Create discount codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active discount codes (for validation)
CREATE POLICY "Allow public read access to active discount codes" ON discount_codes
  FOR SELECT USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

-- Allow service role full access
CREATE POLICY "Allow service role full access to discount codes" ON discount_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active_dates ON discount_codes(is_active, start_date, end_date);

-- Insert some sample discount codes
INSERT INTO discount_codes (code, percentage, start_date, end_date, is_active, max_uses) VALUES
('WELCOME10', 10.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true, 100),
('STUDENT15', 15.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', true, 50),
('SAVE20', 20.00, NOW() - INTERVAL '1 day', NOW() + INTERVAL '15 days', true, 25);
