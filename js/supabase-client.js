/**
 * CMMC L2 Assessment Tool - Supabase Client
 * Handles authentication, database operations, and file storage
 */

// Configuration - Replace with your Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// File upload constraints
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = [
    // Images
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff',
    // PDFs
    '.pdf',
    // Logs
    '.json', '.yaml', '.yml', '.xml', '.log', '.txt',
    // Office
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    // Archives
    '.zip'
];

const MIME_TYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.yaml': 'application/x-yaml',
    '.yml': 'application/x-yaml',
    '.xml': 'application/xml',
    '.log': 'text/plain',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.zip': 'application/zip'
};

class SupabaseClient {
    constructor() {
        this.client = null;
        this.user = null;
        this.currentOrg = null;
        this.currentAssessment = null;
        this.initialized = false;
    }

    /**
     * Initialize the Supabase client
     */
    async init() {
        if (this.initialized) return;
        
        if (typeof supabase === 'undefined') {
            console.error('Supabase JS library not loaded');
            return;
        }

        this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Check for existing session
        const { data: { session } } = await this.client.auth.getSession();
        if (session) {
            this.user = session.user;
            await this.loadUserOrganizations();
        }

        // Listen for auth changes
        this.client.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.user = session.user;
                await this.loadUserOrganizations();
                this.dispatchEvent('auth:signin', { user: this.user });
            } else if (event === 'SIGNED_OUT') {
                this.user = null;
                this.currentOrg = null;
                this.currentAssessment = null;
                this.dispatchEvent('auth:signout');
            }
        });

        this.initialized = true;
    }

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    /**
     * Sign in with Google OAuth
     */
    async signInWithGoogle() {
        const { data, error } = await this.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        });

        if (error) throw error;
        return data;
    }

    /**
     * Sign out current user
     */
    async signOut() {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.user;
    }

    // ==========================================
    // ORGANIZATIONS
    // ==========================================

    /**
     * Load user's organizations
     */
    async loadUserOrganizations() {
        if (!this.user) return [];

        const { data, error } = await this.client
            .from('organization_members')
            .select(`
                role,
                organization:organizations(*)
            `)
            .eq('user_id', this.user.id);

        if (error) throw error;
        return data;
    }

    /**
     * Create a new organization
     */
    async createOrganization(name, slug) {
        const { data: org, error: orgError } = await this.client
            .from('organizations')
            .insert({ name, slug })
            .select()
            .single();

        if (orgError) throw orgError;

        // Add creator as owner
        const { error: memberError } = await this.client
            .from('organization_members')
            .insert({
                organization_id: org.id,
                user_id: this.user.id,
                role: 'owner'
            });

        if (memberError) throw memberError;

        await this.logAudit('organization.created', 'organization', org.id, { name, slug });
        return org;
    }

    /**
     * Set current organization context
     */
    setCurrentOrganization(org) {
        this.currentOrg = org;
        localStorage.setItem('currentOrgId', org.id);
    }

    /**
     * Invite user to organization
     */
    async inviteMember(email, role = 'viewer') {
        if (!this.currentOrg) throw new Error('No organization selected');

        // Note: In production, you'd send an invitation email
        // For now, we'll just create the membership if user exists
        const { data, error } = await this.client
            .rpc('invite_member', {
                org_id: this.currentOrg.id,
                member_email: email,
                member_role: role
            });

        if (error) throw error;
        
        await this.logAudit('member.invited', 'organization_member', data?.id, { email, role });
        return data;
    }

    // ==========================================
    // ASSESSMENTS
    // ==========================================

    /**
     * Get assessments for current organization
     */
    async getAssessments() {
        if (!this.currentOrg) throw new Error('No organization selected');

        const { data, error } = await this.client
            .from('assessments')
            .select('*')
            .eq('organization_id', this.currentOrg.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    /**
     * Create a new assessment
     */
    async createAssessment(name, description = '') {
        if (!this.currentOrg) throw new Error('No organization selected');

        const { data, error } = await this.client
            .from('assessments')
            .insert({
                organization_id: this.currentOrg.id,
                name,
                description,
                created_by: this.user.id
            })
            .select()
            .single();

        if (error) throw error;
        
        await this.logAudit('assessment.created', 'assessment', data.id, { name });
        return data;
    }

    /**
     * Update assessment data
     */
    async updateAssessment(assessmentId, updates) {
        const { data, error } = await this.client
            .from('assessments')
            .update(updates)
            .eq('id', assessmentId)
            .select()
            .single();

        if (error) throw error;
        
        await this.logAudit('assessment.updated', 'assessment', assessmentId, { fields: Object.keys(updates) });
        return data;
    }

    /**
     * Save full assessment state (from localStorage format)
     */
    async saveAssessmentState(assessmentId, state) {
        return this.updateAssessment(assessmentId, {
            assessment_data: state.assessment || {},
            poam_data: state.poam || {},
            deficiency_data: state.deficiencies || {},
            implementation_data: state.implementation || {}
        });
    }

    /**
     * Load assessment state
     */
    async loadAssessmentState(assessmentId) {
        const { data, error } = await this.client
            .from('assessments')
            .select('*')
            .eq('id', assessmentId)
            .single();

        if (error) throw error;

        this.currentAssessment = data;
        return {
            assessment: data.assessment_data || {},
            poam: data.poam_data || {},
            deficiencies: data.deficiency_data || {},
            implementation: data.implementation_data || {}
        };
    }

    /**
     * Set current assessment context
     */
    setCurrentAssessment(assessment) {
        this.currentAssessment = assessment;
        localStorage.setItem('currentAssessmentId', assessment.id);
    }

    // ==========================================
    // EVIDENCE MANAGEMENT
    // ==========================================

    /**
     * Validate file before upload
     */
    validateFile(file) {
        const errors = [];
        
        // Check size
        if (file.size > MAX_FILE_SIZE) {
            errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 50MB limit`);
        }

        // Check extension
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            errors.push(`File type ${ext} is not allowed`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Upload evidence file for an objective
     */
    async uploadEvidence(controlId, objectiveId, file, description = '') {
        if (!this.currentOrg || !this.currentAssessment) {
            throw new Error('No organization or assessment selected');
        }

        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        // Generate unique file path
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${this.currentOrg.id}/${this.currentAssessment.id}/${controlId}/${timestamp}_${safeFileName}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await this.client.storage
            .from('evidence')
            .upload(filePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Create evidence record
        const { data: evidence, error: dbError } = await this.client
            .from('evidence')
            .insert({
                assessment_id: this.currentAssessment.id,
                organization_id: this.currentOrg.id,
                control_id: controlId,
                objective_id: objectiveId,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                file_type: file.name.split('.').pop().toLowerCase(),
                mime_type: file.type,
                description,
                uploaded_by: this.user.id
            })
            .select()
            .single();

        if (dbError) {
            // Clean up uploaded file on DB error
            await this.client.storage.from('evidence').remove([filePath]);
            throw dbError;
        }

        await this.logAudit('evidence.uploaded', 'evidence', evidence.id, {
            control_id: controlId,
            objective_id: objectiveId,
            file_name: file.name,
            file_size: file.size
        });

        return evidence;
    }

    /**
     * Get evidence for an objective
     */
    async getEvidenceForObjective(controlId, objectiveId) {
        if (!this.currentAssessment) throw new Error('No assessment selected');

        const { data, error } = await this.client
            .from('evidence')
            .select('*')
            .eq('assessment_id', this.currentAssessment.id)
            .eq('control_id', controlId)
            .eq('objective_id', objectiveId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    /**
     * Get all evidence for current assessment
     */
    async getAllEvidence() {
        if (!this.currentAssessment) throw new Error('No assessment selected');

        const { data, error } = await this.client
            .from('evidence')
            .select('*')
            .eq('assessment_id', this.currentAssessment.id)
            .order('control_id', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Get signed URL for secure file download
     */
    async getEvidenceUrl(filePath, expiresIn = 3600) {
        const { data, error } = await this.client.storage
            .from('evidence')
            .createSignedUrl(filePath, expiresIn);

        if (error) throw error;
        return data.signedUrl;
    }

    /**
     * Download evidence file
     */
    async downloadEvidence(evidence) {
        const url = await this.getEvidenceUrl(evidence.file_path);
        
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = evidence.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await this.logAudit('evidence.downloaded', 'evidence', evidence.id, {
            file_name: evidence.file_name
        });
    }

    /**
     * Delete evidence file
     */
    async deleteEvidence(evidenceId) {
        // Get evidence record first
        const { data: evidence, error: fetchError } = await this.client
            .from('evidence')
            .select('*')
            .eq('id', evidenceId)
            .single();

        if (fetchError) throw fetchError;

        // Delete from storage
        const { error: storageError } = await this.client.storage
            .from('evidence')
            .remove([evidence.file_path]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await this.client
            .from('evidence')
            .delete()
            .eq('id', evidenceId);

        if (dbError) throw dbError;

        await this.logAudit('evidence.deleted', 'evidence', evidenceId, {
            file_name: evidence.file_name,
            control_id: evidence.control_id,
            objective_id: evidence.objective_id
        });
    }

    // ==========================================
    // AUDIT LOGGING
    // ==========================================

    /**
     * Log an audit event
     */
    async logAudit(action, resourceType, resourceId, details = {}) {
        try {
            await this.client.from('audit_log').insert({
                organization_id: this.currentOrg?.id,
                user_id: this.user?.id,
                action,
                resource_type: resourceType,
                resource_id: resourceId,
                details
            });
        } catch (e) {
            console.error('Audit log failed:', e);
        }
    }

    /**
     * Get audit logs for current organization
     */
    async getAuditLogs(limit = 100, offset = 0) {
        if (!this.currentOrg) throw new Error('No organization selected');

        const { data, error } = await this.client
            .from('audit_log')
            .select('*')
            .eq('organization_id', this.currentOrg.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * Dispatch custom event
     */
    dispatchEvent(name, detail = {}) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    /**
     * Get file icon based on type
     */
    getFileIcon(fileType) {
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            xls: '📊',
            xlsx: '📊',
            ppt: '📽️',
            pptx: '📽️',
            png: '🖼️',
            jpg: '🖼️',
            jpeg: '🖼️',
            gif: '🖼️',
            json: '📋',
            yaml: '📋',
            yml: '📋',
            xml: '📋',
            log: '📜',
            txt: '📜',
            zip: '📦'
        };
        return icons[fileType] || '📎';
    }
}

// Create global instance
const supabaseClient = new SupabaseClient();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SupabaseClient, supabaseClient };
}
