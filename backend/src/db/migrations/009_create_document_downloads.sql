-- Migration: Create document_downloads table
-- Description: Tracks document download history

CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    downloaded_by UUID NOT NULL,
    downloaded_by_type VARCHAR(20) NOT NULL CHECK (downloaded_by_type IN ('admin', 'client')),
    ip_address VARCHAR(45),
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for document download history
CREATE INDEX IF NOT EXISTS idx_document_downloads_document ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_user ON document_downloads(downloaded_by, downloaded_by_type);
