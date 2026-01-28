-- Create table for Redsys/Bizum order mapping
-- This table maps Redsys order numbers to internal order IDs

CREATE TABLE IF NOT EXISTS redsys_order_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  redsys_order_number VARCHAR(12) NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_redsys_order_mapping_order_number 
  ON redsys_order_mapping(redsys_order_number);

CREATE INDEX IF NOT EXISTS idx_redsys_order_mapping_order_id 
  ON redsys_order_mapping(order_id);

-- Add comment to table
COMMENT ON TABLE redsys_order_mapping IS 'Maps Redsys order numbers to internal order UUIDs for payment tracking';
COMMENT ON COLUMN redsys_order_mapping.redsys_order_number IS 'Redsys order number (12 digits, starts with 3)';
COMMENT ON COLUMN redsys_order_mapping.order_id IS 'Reference to internal order UUID';

-- Enable Row Level Security
ALTER TABLE redsys_order_mapping ENABLE ROW LEVEL SECURITY;

-- Create policy: Service role can do everything
CREATE POLICY "Service role can manage all mappings"
  ON redsys_order_mapping
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create policy: Authenticated users can view their own order mappings
CREATE POLICY "Users can view their own order mappings"
  ON redsys_order_mapping
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = redsys_order_mapping.order_id
      AND orders.user_id = auth.uid()
    )
  );
