-- quality_migration.sql
-- Additive migration for Universal Adaptive Crop Quality Engine

-- Add columns to the existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS calculated_quality_score INT DEFAULT 85 CHECK (calculated_quality_score >= 0 AND calculated_quality_score <= 100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS quality_status_badge VARCHAR DEFAULT 'Healthy';
ALTER TABLE products ADD COLUMN IF NOT EXISTS quality_diagnostic_text TEXT DEFAULT 'Legacy listing. Environmental data within regional baseline bounds.';

-- Optional: Since the user requested crop_category, and 'category' already exists, we will add crop_category to be strictly additive per the user's prompt, but we can also copy over values if needed.
ALTER TABLE products ADD COLUMN IF NOT EXISTS crop_category VARCHAR;

-- Copy existing categories over to crop_category for fallback compatibility
UPDATE products SET crop_category = category WHERE crop_category IS NULL;
