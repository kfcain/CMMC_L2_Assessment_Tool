-- RBAC (Role-Based Access Control) Migration
-- Adds user roles, organization members, and permissions

-- Create user roles enum
CREATE TYPE user_role AS ENUM (
    'owner',
    'lead_assessor',
    'assessor',
    'viewer',
    'client_contact'
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Create permissions table for granular control
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    resource VARCHAR(100) NOT NULL, -- e.g., 'assessment', 'poam', 'evidence'
    action VARCHAR(50) NOT NULL, -- e.g., 'create', 'read', 'update', 'delete', 'approve'
    allowed BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, resource, action)
);

-- Insert default permissions
INSERT INTO permissions (role, resource, action, allowed) VALUES
-- Owner permissions (full access)
('owner', 'assessment', 'create', true),
('owner', 'assessment', 'read', true),
('owner', 'assessment', 'update', true),
('owner', 'assessment', 'delete', true),
('owner', 'assessment', 'approve', true),
('owner', 'poam', 'create', true),
('owner', 'poam', 'read', true),
('owner', 'poam', 'update', true),
('owner', 'poam', 'delete', true),
('owner', 'poam', 'approve', true),
('owner', 'evidence', 'create', true),
('owner', 'evidence', 'read', true),
('owner', 'evidence', 'update', true),
('owner', 'evidence', 'delete', true),
('owner', 'users', 'invite', true),
('owner', 'users', 'remove', true),
('owner', 'users', 'change_role', true),

-- Lead Assessor permissions
('lead_assessor', 'assessment', 'create', true),
('lead_assessor', 'assessment', 'read', true),
('lead_assessor', 'assessment', 'update', true),
('lead_assessor', 'assessment', 'delete', false),
('lead_assessor', 'assessment', 'approve', true),
('lead_assessor', 'poam', 'create', true),
('lead_assessor', 'poam', 'read', true),
('lead_assessor', 'poam', 'update', true),
('lead_assessor', 'poam', 'delete', false),
('lead_assessor', 'poam', 'approve', true),
('lead_assessor', 'evidence', 'create', true),
('lead_assessor', 'evidence', 'read', true),
('lead_assessor', 'evidence', 'update', true),
('lead_assessor', 'evidence', 'delete', true),
('lead_assessor', 'users', 'invite', true),
('lead_assessor', 'users', 'remove', false),
('lead_assessor', 'users', 'change_role', false),

-- Assessor permissions
('assessor', 'assessment', 'create', false),
('assessor', 'assessment', 'read', true),
('assessor', 'assessment', 'update', true),
('assessor', 'assessment', 'delete', false),
('assessor', 'assessment', 'approve', false),
('assessor', 'poam', 'create', true),
('assessor', 'poam', 'read', true),
('assessor', 'poam', 'update', true),
('assessor', 'poam', 'delete', false),
('assessor', 'poam', 'approve', false),
('assessor', 'evidence', 'create', true),
('assessor', 'evidence', 'read', true),
('assessor', 'evidence', 'update', true),
('assessor', 'evidence', 'delete', false),
('assessor', 'users', 'invite', false),
('assessor', 'users', 'remove', false),
('assessor', 'users', 'change_role', false),

-- Viewer permissions (read-only)
('viewer', 'assessment', 'create', false),
('viewer', 'assessment', 'read', true),
('viewer', 'assessment', 'update', false),
('viewer', 'assessment', 'delete', false),
('viewer', 'assessment', 'approve', false),
('viewer', 'poam', 'create', false),
('viewer', 'poam', 'read', true),
('viewer', 'poam', 'update', false),
('viewer', 'poam', 'delete', false),
('viewer', 'poam', 'approve', false),
('viewer', 'evidence', 'create', false),
('viewer', 'evidence', 'read', true),
('viewer', 'evidence', 'update', false),
('viewer', 'evidence', 'delete', false),
('viewer', 'users', 'invite', false),
('viewer', 'users', 'remove', false),
('viewer', 'users', 'change_role', false),

-- Client Contact permissions
('client_contact', 'assessment', 'create', false),
('client_contact', 'assessment', 'read', true),
('client_contact', 'assessment', 'update', false),
('client_contact', 'assessment', 'delete', false),
('client_contact', 'assessment', 'approve', false),
('client_contact', 'poam', 'create', false),
('client_contact', 'poam', 'read', true),
('client_contact', 'poam', 'update', false),
('client_contact', 'poam', 'delete', false),
('client_contact', 'poam', 'approve', false),
('client_contact', 'evidence', 'create', true),
('client_contact', 'evidence', 'read', true),
('client_contact', 'evidence', 'update', false),
('client_contact', 'evidence', 'delete', false),
('client_contact', 'users', 'invite', false),
('client_contact', 'users', 'remove', false),
('client_contact', 'users', 'change_role', false);

-- Create indexes
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
CREATE INDEX idx_permissions_role ON permissions(role);

-- Create function to check user permission
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_org_id UUID,
    p_resource VARCHAR,
    p_action VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    user_role user_role;
    permission_allowed BOOLEAN;
BEGIN
    -- Get user's role in the organization
    SELECT role INTO user_role
    FROM organization_members
    WHERE user_id = p_user_id AND organization_id = p_org_id;
    
    -- If user is not a member, return false
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check permission
    SELECT allowed INTO permission_allowed
    FROM permissions
    WHERE role = user_role AND resource = p_resource AND action = p_action;
    
    -- Return permission (default to false if not found)
    RETURN COALESCE(permission_allowed, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's role in organization
CREATE OR REPLACE FUNCTION get_user_role(
    p_user_id UUID,
    p_org_id UUID
) RETURNS user_role AS $$
DECLARE
    user_role user_role;
BEGIN
    SELECT role INTO user_role
    FROM organization_members
    WHERE user_id = p_user_id AND organization_id = p_org_id;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for organization_members
CREATE OR REPLACE FUNCTION update_organization_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organization_members_updated_at
    BEFORE UPDATE ON organization_members
    FOR EACH ROW
    EXECUTE FUNCTION update_organization_members_updated_at();

-- Add RLS policies for organization_members
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of organizations they belong to
CREATE POLICY "Users can view org members"
    ON organization_members FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    );

-- Only owners can insert new members
CREATE POLICY "Owners can add members"
    ON organization_members FOR INSERT
    WITH CHECK (
        has_permission(auth.uid(), organization_id, 'users', 'invite')
    );

-- Only owners can update member roles
CREATE POLICY "Owners can update members"
    ON organization_members FOR UPDATE
    USING (
        has_permission(auth.uid(), organization_id, 'users', 'change_role')
    );

-- Only owners can remove members
CREATE POLICY "Owners can delete members"
    ON organization_members FOR DELETE
    USING (
        has_permission(auth.uid(), organization_id, 'users', 'remove')
    );

-- Add RLS policies for permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read permissions (needed for permission checks)
CREATE POLICY "Anyone can read permissions"
    ON permissions FOR SELECT
    USING (true);

-- Only superusers can modify permissions (via SQL)
CREATE POLICY "Only superusers can modify permissions"
    ON permissions FOR ALL
    USING (false);
