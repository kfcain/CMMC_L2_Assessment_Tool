// User Management Module
// Handles user invitations, role assignments, and team management

const UserManagement = {
    config: {
        version: "1.0.0"
    },

    currentOrg: null,
    members: [],
    pendingInvites: [],

    init: function() {
        this.bindEvents();
        console.log('[UserManagement] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-user-management-btn')) {
                this.showUserManagement();
            }
            if (e.target.closest('#invite-user-btn')) {
                this.showInviteModal();
            }
            if (e.target.closest('.remove-member-btn')) {
                const userId = e.target.closest('.remove-member-btn').dataset.userId;
                this.removeMember(userId);
            }
            if (e.target.closest('.change-role-btn')) {
                const userId = e.target.closest('.change-role-btn').dataset.userId;
                this.showChangeRoleModal(userId);
            }
        });
    },

    async showUserManagement() {
        if (!supabaseClient.isAuthenticated()) {
            this.showToast('Please sign in to manage users', 'error');
            return;
        }

        // Load current organization and members
        await this.loadMembers();

        const html = `
        <div class="modal-overlay user-management-modal" id="user-management-modal">
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <div>
                        <h2>Team Management</h2>
                        <span class="modal-subtitle">${this.currentOrg?.name || 'Organization'}</span>
                    </div>
                    <button class="modal-close" data-action="close-modal" data-modal-id="user-management-modal">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderUserManagementContent()}
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', html);
    },

    renderUserManagementContent: function() {
        const canInvite = this.hasPermission('users', 'invite');
        const canChangeRole = this.hasPermission('users', 'change_role');
        const canRemove = this.hasPermission('users', 'remove');

        return `
        <div class="user-management-container">
            ${canInvite ? `
            <div class="user-management-header">
                <button class="btn-primary" id="invite-user-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Invite User
                </button>
            </div>
            ` : ''}

            <div class="members-section">
                <h3>Team Members (${this.members.length})</h3>
                <div class="members-list">
                    ${this.members.map(member => this.renderMemberCard(member, canChangeRole, canRemove)).join('')}
                </div>
            </div>

            ${this.pendingInvites.length > 0 ? `
            <div class="pending-invites-section">
                <h3>Pending Invites (${this.pendingInvites.length})</h3>
                <div class="invites-list">
                    ${this.pendingInvites.map(invite => this.renderInviteCard(invite)).join('')}
                </div>
            </div>
            ` : ''}

            <div class="roles-info-section">
                <h3>Role Permissions</h3>
                ${this.renderRolesInfo()}
            </div>
        </div>`;
    },

    renderMemberCard: function(member, canChangeRole, canRemove) {
        const isCurrentUser = member.user_id === supabaseClient.user?.id;
        const roleLabel = this.getRoleLabel(member.role);
        const roleBadgeClass = this.getRoleBadgeClass(member.role);

        return `
        <div class="member-card">
            <div class="member-avatar">
                ${member.avatar_url ? 
                    `<img src="${member.avatar_url}" alt="${member.name}">` :
                    `<div class="avatar-placeholder">${member.name?.charAt(0) || 'U'}</div>`
                }
            </div>
            <div class="member-info">
                <div class="member-name">
                    ${member.name || member.email}
                    ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
                </div>
                <div class="member-email">${member.email}</div>
                <div class="member-meta">
                    Joined ${this.formatDate(member.created_at)}
                </div>
            </div>
            <div class="member-role">
                <span class="role-badge ${roleBadgeClass}">${roleLabel}</span>
            </div>
            <div class="member-actions">
                ${!isCurrentUser && canChangeRole ? `
                    <button class="btn-icon change-role-btn" data-user-id="${member.user_id}" title="Change role">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                ` : ''}
                ${!isCurrentUser && canRemove ? `
                    <button class="btn-icon btn-danger remove-member-btn" data-user-id="${member.user_id}" title="Remove member">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
        </div>`;
    },

    renderInviteCard: function(invite) {
        return `
        <div class="invite-card">
            <div class="invite-email">${invite.email}</div>
            <div class="invite-role">
                <span class="role-badge ${this.getRoleBadgeClass(invite.role)}">${this.getRoleLabel(invite.role)}</span>
            </div>
            <div class="invite-meta">
                Invited ${this.formatDate(invite.invited_at)} by ${invite.invited_by_name}
            </div>
            <button class="btn-icon btn-danger" data-action="um-cancel-invite" data-param="${invite.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>`;
    },

    renderRolesInfo: function() {
        const roles = [
            { name: 'Owner', permissions: ['Full access', 'Manage users', 'Delete assessments', 'Billing'] },
            { name: 'Lead Assessor', permissions: ['Edit assessments', 'Approve POA&Ms', 'Invite users', 'Manage evidence'] },
            { name: 'Assessor', permissions: ['Edit assigned controls', 'Create POA&Ms', 'Upload evidence'] },
            { name: 'Viewer', permissions: ['Read-only access', 'View reports', 'Download evidence'] },
            { name: 'Client Contact', permissions: ['View progress', 'Upload evidence', 'View POA&Ms'] }
        ];

        return `
        <div class="roles-grid">
            ${roles.map(role => `
                <div class="role-info-card">
                    <h4>${role.name}</h4>
                    <ul>
                        ${role.permissions.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>`;
    },

    async loadMembers() {
        if (!supabaseClient.currentOrg) return;

        this.currentOrg = supabaseClient.currentOrg;

        try {
            const { data: members, error } = await supabaseClient.client
                .from('organization_members')
                .select(`
                    *,
                    user:user_id (
                        id,
                        email,
                        user_metadata
                    )
                `)
                .eq('organization_id', this.currentOrg.id)
                .not('accepted_at', 'is', null);

            if (error) throw error;

            this.members = members.map(m => ({
                user_id: m.user_id,
                email: m.user.email,
                name: m.user.user_metadata?.full_name || m.user.user_metadata?.name,
                avatar_url: m.user.user_metadata?.avatar_url,
                role: m.role,
                created_at: m.created_at
            }));

            // Load pending invites
            const { data: invites, error: invitesError } = await supabaseClient.client
                .from('organization_members')
                .select('*')
                .eq('organization_id', this.currentOrg.id)
                .is('accepted_at', null);

            if (!invitesError) {
                this.pendingInvites = invites;
            }
        } catch (error) {
            console.error('[UserManagement] Error loading members:', error);
        }
    },

    hasPermission: function(resource, action) {
        // Check if current user has permission
        const userRole = this.members.find(m => m.user_id === supabaseClient.user?.id)?.role;
        if (!userRole) return false;

        // Owner has all permissions
        if (userRole === 'owner') return true;

        // Check specific permissions (simplified - should query permissions table)
        const permissions = {
            lead_assessor: {
                users: { invite: true, change_role: false, remove: false }
            },
            assessor: {
                users: { invite: false, change_role: false, remove: false }
            },
            viewer: {
                users: { invite: false, change_role: false, remove: false }
            },
            client_contact: {
                users: { invite: false, change_role: false, remove: false }
            }
        };

        return permissions[userRole]?.[resource]?.[action] || false;
    },

    getRoleLabel: function(role) {
        const labels = {
            owner: 'Owner',
            lead_assessor: 'Lead Assessor',
            assessor: 'Assessor',
            viewer: 'Viewer',
            client_contact: 'Client Contact'
        };
        return labels[role] || role;
    },

    getRoleBadgeClass: function(role) {
        const classes = {
            owner: 'role-owner',
            lead_assessor: 'role-lead',
            assessor: 'role-assessor',
            viewer: 'role-viewer',
            client_contact: 'role-client'
        };
        return classes[role] || '';
    },

    formatDate: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString();
    },

    showToast: function(message, type = 'info') {
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(message, type);
        } else {
            console.log(`[UserManagement] ${type}: ${message}`);
        }
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? 
        document.addEventListener('DOMContentLoaded', () => UserManagement.init()) : 
        UserManagement.init();
}

if (typeof window !== 'undefined') {
    window.UserManagement = UserManagement;
}
