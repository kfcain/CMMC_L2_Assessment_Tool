-- CMMC L2 Assessment Tool - Row Level Security Policies
-- These policies ensure multi-tenant data isolation

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Get user's organizations
-- ============================================
CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS SETOF UUID AS $$
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check user role in org
-- ============================================
CREATE OR REPLACE FUNCTION user_has_role(org_id UUID, required_roles user_role[])
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM organization_members
        WHERE organization_id = org_id
        AND user_id = auth.uid()
        AND role = ANY(required_roles)
    )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================

-- Users can view orgs they belong to
CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (id IN (SELECT get_user_org_ids()));

-- Only owners/admins can update org details
CREATE POLICY "Admins can update organizations"
    ON organizations FOR UPDATE
    USING (user_has_role(id, ARRAY['owner', 'admin']::user_role[]));

-- Any authenticated user can create an org (becomes owner)
CREATE POLICY "Authenticated users can create organizations"
    ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only owners can delete orgs
CREATE POLICY "Owners can delete organizations"
    ON organizations FOR DELETE
    USING (user_has_role(id, ARRAY['owner']::user_role[]));

-- ============================================
-- ORGANIZATION MEMBERS POLICIES
-- ============================================

-- Users can view members of their orgs
CREATE POLICY "Users can view org members"
    ON organization_members FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

-- Admins/owners can add members
CREATE POLICY "Admins can add members"
    ON organization_members FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- Admins/owners can update member roles
CREATE POLICY "Admins can update members"
    ON organization_members FOR UPDATE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- Admins/owners can remove members (but not themselves if owner)
CREATE POLICY "Admins can remove members"
    ON organization_members FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- ============================================
-- ASSESSMENTS POLICIES
-- ============================================

-- Users can view assessments in their orgs
CREATE POLICY "Users can view assessments"
    ON assessments FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

-- Assessors and above can create assessments
CREATE POLICY "Assessors can create assessments"
    ON assessments FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin', 'assessor']::user_role[]));

-- Assessors and above can update assessments
CREATE POLICY "Assessors can update assessments"
    ON assessments FOR UPDATE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin', 'assessor']::user_role[]));

-- Only admins/owners can delete assessments
CREATE POLICY "Admins can delete assessments"
    ON assessments FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- ============================================
-- EVIDENCE POLICIES
-- ============================================

-- Users can view evidence in their orgs
CREATE POLICY "Users can view evidence"
    ON evidence FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

-- Assessors and above can upload evidence
CREATE POLICY "Assessors can upload evidence"
    ON evidence FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin', 'assessor']::user_role[]));

-- Assessors and above can update evidence metadata
CREATE POLICY "Assessors can update evidence"
    ON evidence FOR UPDATE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin', 'assessor']::user_role[]));

-- Admins/owners can delete evidence
CREATE POLICY "Admins can delete evidence"
    ON evidence FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- ============================================
-- AUDIT LOG POLICIES
-- ============================================

-- Admins can view audit logs for their orgs
CREATE POLICY "Admins can view audit logs"
    ON audit_log FOR SELECT
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- System inserts audit logs (via service role)
CREATE POLICY "System can insert audit logs"
    ON audit_log FOR INSERT
    WITH CHECK (true);
