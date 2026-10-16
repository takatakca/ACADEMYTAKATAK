-- Academy one-time exam ticket consumption.
-- Requires 001..005 and approved migration / backup before activation.
-- Tickets are HMAC-signed and the nonce is checked within the same transaction
-- as the scored attempt. Unique constraint protects against concurrent replay.
ALTER TABLE academy_exam_attempt
  ADD COLUMN IF NOT EXISTS ticket_nonce UUID;
CREATE UNIQUE INDEX IF NOT EXISTS academy_exam_attempt_ticket_once_idx
  ON academy_exam_attempt(ticket_nonce) WHERE ticket_nonce IS NOT NULL;
-- Older exam attempts legitimately have NULL tickets; new sessions always supply UUID.
