-- ============================================================
-- Migration: abandoned cart 3-step email sequence
-- Idempotent: all statements use IF NOT EXISTS / DO NOTHING
-- ============================================================

-- 1. New columns on orders
-- abandoned_email_step  : last step sent (0 = none, 1, 2, 3)
-- abandoned_last_email_at : timestamp of the last step sent
-- abandoned_discount_code : discount code generated for this recovery flow
-- abandoned_flow_finished_at : when step 3 was sent (flow complete)
-- recovered_at           : when the order went to 'completed' after the flow started

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS abandoned_email_step      integer      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS abandoned_last_email_at   timestamptz  NULL,
  ADD COLUMN IF NOT EXISTS abandoned_discount_code   varchar(50)  NULL,
  ADD COLUMN IF NOT EXISTS abandoned_flow_finished_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS recovered_at              timestamptz  NULL;

-- 2. Keep sent_abandoned_at for backward compatibility (already exists, no-op)
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS sent_abandoned_at timestamptz NULL;

-- 3. Indexes for efficient cron queries
-- Index: pending orders not yet at step 3 and not yet finished
CREATE INDEX IF NOT EXISTS idx_orders_abandoned_cron
  ON orders (status, abandoned_email_step, created_at)
  WHERE status = 'pending';

-- Index: recovery lookup (orders that started the sequence)
CREATE INDEX IF NOT EXISTS idx_orders_abandoned_step
  ON orders (abandoned_email_step)
  WHERE abandoned_email_step > 0;

-- Index: discount_codes lookup by code (probably already unique index, but add if missing)
CREATE INDEX IF NOT EXISTS idx_discount_codes_code
  ON discount_codes (code);

-- Index: discount_codes active lookup
CREATE INDEX IF NOT EXISTS idx_discount_codes_active
  ON discount_codes (is_active, end_date);
