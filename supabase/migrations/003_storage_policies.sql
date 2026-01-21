-- CMMC L2 Assessment Tool - Storage Bucket and Policies
-- Configure secure file storage for evidence

-- ============================================
-- CREATE EVIDENCE STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'evidence',
    'evidence',
    false,
    52428800,  -- 50MB in bytes
    ARRAY[
        -- Images/Screenshots
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff',
        -- PDFs
        'application/pdf',
        -- Log files
        'application/json',
        'application/x-yaml',
        'text/yaml',
        'application/xml',
        'text/xml',
        'text/plain',
        'text/x-log',
        -- Microsoft Office
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        -- Archives (for bulk evidence)
        'application/zip',
        'application/x-zip-compressed'
    ]
) ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- File path format: {org_id}/{assessment_id}/{control_id}/{filename}

-- Users can view files from their organizations
CREATE POLICY "Users can view org evidence files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'evidence'
    AND (storage.foldername(name))[1]::uuid IN (SELECT get_user_org_ids())
);

-- Assessors can upload files to their organizations
CREATE POLICY "Assessors can upload evidence files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'evidence'
    AND user_has_role((storage.foldername(name))[1]::uuid, ARRAY['owner', 'admin', 'assessor']::user_role[])
);

-- Assessors can update their uploaded files
CREATE POLICY "Assessors can update evidence files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'evidence'
    AND user_has_role((storage.foldername(name))[1]::uuid, ARRAY['owner', 'admin', 'assessor']::user_role[])
);

-- Admins can delete evidence files
CREATE POLICY "Admins can delete evidence files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'evidence'
    AND user_has_role((storage.foldername(name))[1]::uuid, ARRAY['owner', 'admin']::user_role[])
);
