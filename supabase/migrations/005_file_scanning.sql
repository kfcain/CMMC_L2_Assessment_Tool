-- CMMC L2 Assessment Tool - File Scanning Support
-- Tracks file scan status and results

-- ============================================
-- FILE SCAN STATUS ENUM
-- ============================================
CREATE TYPE scan_status AS ENUM ('pending', 'scanning', 'clean', 'infected', 'error');

-- ============================================
-- ADD SCAN COLUMNS TO EVIDENCE TABLE
-- ============================================
ALTER TABLE evidence 
ADD COLUMN scan_status scan_status DEFAULT 'pending',
ADD COLUMN scan_result JSONB DEFAULT NULL,
ADD COLUMN scanned_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN quarantined BOOLEAN DEFAULT FALSE;

-- Index for finding unscanned files
CREATE INDEX idx_evidence_scan_status ON evidence(scan_status) WHERE scan_status = 'pending';

-- ============================================
-- FILE SCAN QUEUE TABLE
-- For edge function to process
-- ============================================
CREATE TABLE file_scan_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ DEFAULT NULL
);

-- Index for queue processing
CREATE INDEX idx_scan_queue_pending ON file_scan_queue(created_at) 
WHERE processed_at IS NULL AND attempts < max_attempts;

-- Enable RLS (only system can access)
ALTER TABLE file_scan_queue ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCTION: Queue file for scanning
-- ============================================
CREATE OR REPLACE FUNCTION queue_file_for_scan()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO file_scan_queue (evidence_id, file_path, file_size, mime_type)
    VALUES (NEW.id, NEW.file_path, NEW.file_size, NEW.mime_type);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to queue new uploads
CREATE TRIGGER on_evidence_uploaded
    AFTER INSERT ON evidence
    FOR EACH ROW EXECUTE FUNCTION queue_file_for_scan();

-- ============================================
-- FUNCTION: Update evidence scan status
-- ============================================
CREATE OR REPLACE FUNCTION update_scan_status(
    p_evidence_id UUID,
    p_status scan_status,
    p_result JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE evidence
    SET 
        scan_status = p_status,
        scan_result = p_result,
        scanned_at = NOW(),
        quarantined = (p_status = 'infected')
    WHERE id = p_evidence_id;
    
    -- Log the scan result
    INSERT INTO audit_log (
        organization_id,
        action,
        resource_type,
        resource_id,
        details
    )
    SELECT 
        organization_id,
        'evidence.scanned',
        'evidence',
        id,
        jsonb_build_object('status', p_status, 'result', p_result)
    FROM evidence
    WHERE id = p_evidence_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VIEW: Quarantined files for admin review
-- ============================================
CREATE VIEW quarantined_files AS
SELECT 
    e.*,
    a.name as assessment_name,
    o.name as organization_name,
    up.email as uploaded_by_email
FROM evidence e
JOIN assessments a ON e.assessment_id = a.id
JOIN organizations o ON e.organization_id = o.id
LEFT JOIN user_profiles up ON e.uploaded_by = up.id
WHERE e.quarantined = TRUE;
