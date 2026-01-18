-- Migration: Create updates table
-- Description: Stores admin-published updates for client dashboards

CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES client_companies(id) ON DELETE CASCADE,
    is_global BOOLEAN DEFAULT false,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    update_type VARCHAR(50) DEFAULT 'general' CHECK (update_type IN ('general', 'status', 'deliverable', 'announcement', 'urgent')),
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for company filtering and chronological display
CREATE INDEX IF NOT EXISTS idx_updates_company ON updates(company_id);
CREATE INDEX IF NOT EXISTS idx_updates_global ON updates(is_global) WHERE is_global = true;
CREATE INDEX IF NOT EXISTS idx_updates_published ON updates(published_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_updates_updated_at
    BEFORE UPDATE ON updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
