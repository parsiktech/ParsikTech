-- Migration: Create client_companies table
-- Description: Stores client company information

CREATE TABLE IF NOT EXISTS client_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    internal_notes TEXT,
    owner_email VARCHAR(255),
    owner_name VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_client_companies_status ON client_companies(status);

-- Trigger for updated_at
CREATE TRIGGER update_client_companies_updated_at
    BEFORE UPDATE ON client_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
