-- Migration: Universal Omnivorous Agricultural Quality Engine
-- Additive columns for tracking multi-domain dynamic scores and metadata

-- Note: The instruction mentioned `crop_listings`, but the codebase interacts with `products`. 
-- We'll add these columns to `products`. If `crop_listings` is a separate table/view, the same logic applies.

-- Add domain categorization
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS agricultural_domain VARCHAR DEFAULT 'horticulture';

-- Add score and status fields (they may already exist, but ensuring them additively)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS calculated_quality_score INT DEFAULT 85 CHECK (calculated_quality_score >= 0 AND calculated_quality_score <= 100);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS quality_status_badge VARCHAR DEFAULT 'Healthy';

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS quality_diagnostic_text TEXT DEFAULT 'Legacy listing. Environmental data within regional baseline bounds.';

-- For backwards-compatibility: Update existing rows that have NULL
UPDATE products 
SET 
  agricultural_domain = 'horticulture'
WHERE agricultural_domain IS NULL;

UPDATE products 
SET 
  calculated_quality_score = 85,
  quality_status_badge = 'Healthy',
  quality_diagnostic_text = 'Legacy listing. Environmental data within regional baseline bounds.'
WHERE calculated_quality_score IS NULL;
