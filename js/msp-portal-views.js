// MSP Portal Views - Extended view renderers for MSP Command Center

const MSPPortalViews = {
    // ==================== CLIENTS VIEW ====================
    clients: function(portal) {
        return `
        <div class="msp-clients-view">
            <div class="msp-view-header">
                <div class="msp-search-bar"><input type="search" placeholder="Search clients..." class="msp-search-input"></div>
                <button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${portal.getIcon('user-plus')} Add Client</button>
            </div>
            <div class="msp-client-grid">
                ${portal.state.clients.length > 0 ? portal.state.clients.map(c => this.renderClientCard(c, portal)).join('') : this.renderEmptyClients(portal)}
            </div>
        </div>`;
    },

    renderClientCard: function(client, portal) {
        return `
        <div class="msp-client-card" data-client-id="${client.id}">
            <div class="client-card-header">
                <div class="client-info"><h4>${client.name}</h4><span class="client-industry">${client.industry || 'Defense'}</span></div>
                <span class="level-badge large">L${client.assessmentLevel}</span>
            </div>
            <div class="client-card-metrics">
                <div class="metric"><span class="metric-value ${client.sprsScore >= 70 ? 'good' : 'warning'}">${client.sprsScore ?? '--'}</span><span class="metric-label">SPRS</span></div>
                <div class="metric"><span class="metric-value">${client.completionPercent || 0}%</span><span class="metric-label">Complete</span></div>
                <div class="metric"><span class="metric-value">${client.poamCount || 0}</span><span class="metric-label">POA&M</span></div>
            </div>
            <div class="client-card-progress"><div class="progress-bar"><div class="progress-fill" style="width:${client.completionPercent||0}%"></div></div></div>
            <div class="client-card-actions">
                <button class="msp-btn-secondary" onclick="MSPPortal.openClientProject('${client.id}')">${portal.getIcon('calendar')} Project</button>
                <button class="msp-btn-icon" onclick="MSPPortal.editClient('${client.id}')">${portal.getIcon('edit')}</button>
            </div>
        </div>`;
    },

    renderEmptyClients: function(portal) {
        return `<div class="msp-empty-state full-width"><div class="empty-icon">${portal.getIcon('users')}</div><h3>No Clients Yet</h3><p>Add your first client to start managing CMMC assessments</p><button class="msp-btn-primary" onclick="MSPPortal.showAddClientModal()">${portal.getIcon('user-plus')} Add First Client</button></div>`;
    },

    // ==================== PROJECTS VIEW ====================
    projects: function(portal) {
        return `
        <div class="msp-projects-view">
            <div class="msp-view-header">
                <div class="msp-tabs">
                    <button class="msp-tab active" data-tab="all">All Projects</button>
                    <button class="msp-tab" data-tab="timeline">Timeline</button>
                </div>
            </div>
            <div class="msp-projects-content">${this.renderAllProjects(portal)}</div>
        </div>`;
    },

    renderAllProjects: function(portal) {
        if (portal.state.clients.length === 0) return `<div class="msp-empty-state"><div class="empty-icon">${portal.getIcon('calendar')}</div><h3>No Projects</h3><p>Add clients to create project plans</p></div>`;
        return `<div class="projects-list">${portal.state.clients.map(c => this.renderProjectCard(c, portal)).join('')}</div>`;
    },

    renderProjectCard: function(client, portal) {
        const project = portal.state.projectPlans[client.id] || { progress: 0, totalTasks: 0, completedTasks: 0 };
        return `
        <div class="project-card">
            <div class="project-header"><div class="project-info"><h4>${client.name}</h4><span>CMMC Level ${client.assessmentLevel}</span></div><div class="project-progress-ring" style="--progress:${project.progress||0}"><span>${project.progress||0}%</span></div></div>
            <div class="project-timeline"><div class="timeline-bar"><div class="timeline-progress" style="width:${project.progress||0}%"></div></div><div class="timeline-labels"><span>Start</span><span>${client.nextAssessment ? new Date(client.nextAssessment).toLocaleDateString() : 'TBD'}</span></div></div>
            <div class="project-actions"><button class="msp-btn-secondary" onclick="MSPPortal.openProjectPlanner('${client.id}')">${portal.getIcon('edit')} Manage</button></div>
        </div>`;
    },

    // ==================== EVIDENCE VIEW ====================
    evidence: function(portal) {
        if (typeof EvidenceBuilder !== 'undefined') return EvidenceBuilder.renderEvidenceBuilder();
        return '<div class="msp-loading">Loading Evidence Builder...</div>';
    },

    // ==================== REPORTS VIEW ====================
    reports: function(portal) {
        return `
        <div class="msp-reports-view">
            <div class="reports-grid">
                <div class="report-card" onclick="MSPPortal.generateReport('executive')"><div class="report-icon">${portal.getIcon('file-text')}</div><h4>Executive Summary</h4><p>High-level compliance status</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('gap')"><div class="report-icon">${portal.getIcon('activity')}</div><h4>Gap Analysis</h4><p>Detailed findings & remediation</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('c3pao')"><div class="report-icon">${portal.getIcon('check-circle')}</div><h4>C3PAO Readiness</h4><p>Pre-assessment checklist</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('ssp')"><div class="report-icon">${portal.getIcon('book')}</div><h4>SSP Appendix</h4><p>Implementation statements</p></div>
                <div class="report-card" onclick="MSPPortal.exportPortfolio()"><div class="report-icon">${portal.getIcon('users')}</div><h4>Portfolio Summary</h4><p>All clients overview</p></div>
                <div class="report-card" onclick="MSPPortal.generateReport('poam')"><div class="report-icon">${portal.getIcon('list')}</div><h4>POA&M Report</h4><p>Plan of Action & Milestones</p></div>
            </div>
        </div>`;
    },

    // ==================== ENVIRONMENT SETUP VIEW ====================
    'env-setup': function(portal) {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA : null;
        return `
        <div class="msp-env-setup">
            <div class="msp-intro-banner">
                <h2>Cloud Environment Setup for CMMC</h2>
                <p>Configure FedRAMP High-authorized cloud environments for CMMC Level 2/3 compliance. Each provider requires specific configurations for CUI handling.</p>
            </div>
            <div class="msp-env-tabs">
                <button class="env-tab active" data-provider="azure" onclick="MSPPortalViews.switchEnvTab('azure')">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span>Azure GCC High</span>
                </button>
                <button class="env-tab" data-provider="aws" onclick="MSPPortalViews.switchEnvTab('aws')">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    <span>AWS GovCloud</span>
                </button>
                <button class="env-tab" data-provider="gcp" onclick="MSPPortalViews.switchEnvTab('gcp')">
                    <svg class="env-tab-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>GCP Assured Workloads</span>
                </button>
            </div>
            <div class="msp-env-content" id="env-content">${this.renderAzureSetup()}</div>
        </div>`;
    },

    switchEnvTab: function(provider) {
        document.querySelectorAll('.env-tab').forEach(t => t.classList.toggle('active', t.dataset.provider === provider));
        const content = document.getElementById('env-content');
        if (provider === 'azure') content.innerHTML = this.renderAzureSetup();
        else if (provider === 'aws') content.innerHTML = this.renderAWSSetup();
        else if (provider === 'gcp') content.innerHTML = this.renderGCPSetup();
    },

    renderAzureSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.azure : null;
        const overview = data?.overview || {};
        const licensing = data?.licensing || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'Azure Government / GCC High'}</h3>
                <p>${overview.description || 'Configure Microsoft Azure Government for CMMC compliance.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || []).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="${overview.portalUrl || 'https://portal.azure.us'}" target="_blank" class="env-link">Azure Gov Portal ↗</a>
                    <a href="${overview.entraUrl || 'https://entra.microsoft.us'}" target="_blank" class="env-link">Entra Admin Center ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Required Licensing</h3></div>
                <div class="msp-card-body">
                    <div class="licensing-grid">
                        ${(licensing.tiers || [
                            { name: 'M365 GCC High E5', required: true, notes: 'Recommended for full security stack' },
                            { name: 'Entra ID P2', required: true, notes: 'Conditional Access, PIM, Identity Protection' },
                            { name: 'Defender for Endpoint P2', required: true, notes: 'EDR for CMMC SI controls' },
                            { name: 'Microsoft Purview', required: true, notes: 'DLP, sensitivity labels, eDiscovery' }
                        ]).map(t => `
                            <div class="license-item ${t.required ? 'required' : ''}">
                                <div class="license-name">${t.name}</div>
                                <div class="license-notes">${t.notes}</div>
                                ${t.required ? '<span class="req-badge">Required</span>' : '<span class="opt-badge">Optional</span>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>MSP Multi-Tenant Architecture (Azure Lighthouse)</h3></div>
                <div class="msp-card-body">
                    <div class="arch-diagram">
                        <div class="arch-layer msp-layer">
                            <span class="layer-label">MSP Management Tenant</span>
                            <div class="arch-components">
                                <span>Azure Lighthouse</span><span>Sentinel MSSP</span><span>Defender for Cloud</span><span>Intune Multi-tenant</span>
                            </div>
                        </div>
                        <div class="arch-connector">↓ Delegated Resource Management (No credentials stored) ↓</div>
                        <div class="arch-layer client-layer">
                            <span class="layer-label">Client GCC High Tenants</span>
                            <div class="arch-components">
                                <span>Client A (M365 + Azure)</span><span>Client B (M365 + Azure)</span><span>Client C (M365 only)</span>
                            </div>
                        </div>
                    </div>
                    <p class="arch-note"><strong>Key Benefits:</strong> Manage client resources without storing credentials in client tenants. All MSP actions are audited in client's Azure Activity Log.</p>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultAzureChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultAzureChecklist: function() {
        return [
            { name: 'Identity Foundation', items: [
                { task: 'Provision M365 GCC High tenant', critical: true, effort: '1-2 weeks' },
                { task: 'Configure Entra ID with US-only data residency', critical: true, effort: '1 day' },
                { task: 'Enable MFA for all users (FIDO2 security keys preferred)', critical: true, effort: '1-2 days' },
                { task: 'Configure Conditional Access baseline policies', critical: true, effort: '1 day' },
                { task: 'Enable Privileged Identity Management (PIM) for all admin roles', critical: true, effort: '4-8 hours' },
                { task: 'Configure Identity Protection risk-based policies', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Network Security', items: [
                { task: 'Deploy Hub-Spoke or Virtual WAN topology', critical: true, effort: '1-2 days' },
                { task: 'Configure Azure Firewall Premium with threat intelligence', critical: true, effort: '4-8 hours' },
                { task: 'Enable DDoS Protection Standard on hub VNet', critical: false, effort: '1 hour' },
                { task: 'Configure NSGs with deny-by-default rules', critical: true, effort: '2-4 hours' },
                { task: 'Enable NSG flow logs to Log Analytics', critical: true, effort: '2-4 hours' },
                { task: 'Deploy Azure Bastion for secure VM access', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Security & Monitoring', items: [
                { task: 'Enable all Defender for Cloud plans', critical: true, effort: '2-4 hours' },
                { task: 'Deploy Microsoft Sentinel workspace', critical: true, effort: '4-8 hours' },
                { task: 'Connect all data sources to Sentinel', critical: true, effort: '1 day' },
                { task: 'Enable CMMC analytics rules from Content Hub', critical: true, effort: '2-4 hours' },
                { task: 'Configure diagnostic settings for all resources', critical: true, effort: '4-8 hours' },
                { task: 'Deploy Defender for Endpoint on all endpoints', critical: true, effort: '1 day' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Configure sensitivity labels in Microsoft Purview', critical: true, effort: '1 day' },
                { task: 'Deploy DLP policies for CUI protection', critical: true, effort: '1-2 days' },
                { task: 'Configure Azure Information Protection scanner', critical: false, effort: '4-8 hours' },
                { task: 'Enable customer-managed keys for storage', critical: false, effort: '4-8 hours' },
                { task: 'Configure Key Vault with soft delete and purge protection', critical: true, effort: '2-4 hours' }
            ]}
        ];
    },

    renderChecklistFromData: function(categories) {
        return categories.map(cat => `
            <div class="checklist-category">
                <h4>${cat.name}</h4>
                <div class="checklist-grid">
                    ${cat.items.map(i => `
                        <div class="checklist-item ${i.critical ? 'critical' : ''}">
                            <input type="checkbox" id="chk-${i.task.replace(/[^a-z0-9]/gi, '')}">
                            <label for="chk-${i.task.replace(/[^a-z0-9]/gi, '')}">
                                <span class="check-task">${i.task}</span>
                                ${i.effort ? `<span class="check-effort">${i.effort}</span>` : ''}
                                ${i.critical ? '<span class="critical-badge">Critical</span>' : ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    renderAWSSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.aws : null;
        const overview = data?.overview || {};
        const landingZone = data?.landingZone || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'AWS GovCloud (US)'}</h3>
                <p>${overview.description || 'Configure AWS GovCloud for CMMC compliance with FedRAMP High authorization.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || [
                        'Isolated regions: us-gov-west-1 (Oregon), us-gov-east-1 (Ohio)',
                        'US persons only for root account access',
                        'Separate AWS partition (aws-us-gov)',
                        'Linked to commercial AWS for billing'
                    ]).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="${overview.consoleUrl || 'https://console.amazonaws-us-gov.com'}" target="_blank" class="env-link">GovCloud Console ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Landing Zone Architecture</h3></div>
                <div class="msp-card-body">
                    <div class="landing-zone-diagram">
                        <div class="lz-account management">
                            <span class="lz-label">Management Account</span>
                            <div class="lz-services">Organizations • Billing • SCPs</div>
                        </div>
                        <div class="lz-row">
                            <div class="lz-account security">
                                <span class="lz-label">Log Archive</span>
                                <div class="lz-services">CloudTrail • Config Logs</div>
                            </div>
                            <div class="lz-account security">
                                <span class="lz-label">Security Tooling</span>
                                <div class="lz-services">Security Hub • GuardDuty</div>
                            </div>
                            <div class="lz-account shared">
                                <span class="lz-label">Shared Services</span>
                                <div class="lz-services">Transit GW • Directory</div>
                            </div>
                        </div>
                        <div class="lz-connector">↓ SCPs & Guardrails ↓</div>
                        <div class="lz-row">
                            <div class="lz-account workload">
                                <span class="lz-label">Client A OU</span>
                                <div class="lz-services">Prod • Dev • Sandbox</div>
                            </div>
                            <div class="lz-account workload">
                                <span class="lz-label">Client B OU</span>
                                <div class="lz-services">Prod • Dev • Sandbox</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Service Control Policy Example</h3></div>
                <div class="msp-card-body">
                    <pre class="code-block"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyNonGovCloudRegions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["us-gov-west-1", "us-gov-east-1"]
      }
    }
  }]
}</code></pre>
                    <p class="code-note">This SCP prevents resources from being created outside GovCloud regions.</p>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultAWSChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultAWSChecklist: function() {
        return [
            { name: 'Account Setup', items: [
                { task: 'Create GovCloud account via commercial AWS', critical: true, effort: '1-2 days' },
                { task: 'Complete US person verification', critical: true, effort: '1 week' },
                { task: 'Enable AWS Organizations', critical: true, effort: '1 day' },
                { task: 'Create organizational units (Security, Workloads)', critical: true, effort: '2-4 hours' },
                { task: 'Deploy service control policies (SCPs)', critical: true, effort: '4-8 hours' }
            ]},
            { name: 'Identity Foundation', items: [
                { task: 'Enable IAM Identity Center', critical: true, effort: '4-8 hours' },
                { task: 'Integrate with external IdP (Okta, Azure AD)', critical: true, effort: '1 day' },
                { task: 'Configure MFA for all users', critical: true, effort: '2-4 hours' },
                { task: 'Create permission sets with least privilege', critical: true, effort: '1 day' },
                { task: 'Enable IAM Access Analyzer', critical: false, effort: '1 hour' }
            ]},
            { name: 'Security Services', items: [
                { task: 'Enable Security Hub with NIST 800-171 standard', critical: true, effort: '2-4 hours' },
                { task: 'Enable GuardDuty in all accounts', critical: true, effort: '2-4 hours' },
                { task: 'Configure AWS Config with conformance packs', critical: true, effort: '4-8 hours' },
                { task: 'Deploy AWS Network Firewall', critical: true, effort: '1 day' },
                { task: 'Create organization CloudTrail', critical: true, effort: '2-4 hours' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Enable default S3 encryption (SSE-KMS)', critical: true, effort: '2-4 hours' },
                { task: 'Create KMS keys per data classification', critical: true, effort: '2-4 hours' },
                { task: 'Enable S3 Block Public Access at account level', critical: true, effort: '1 hour' },
                { task: 'Enable EBS encryption by default', critical: true, effort: '1 hour' }
            ]}
        ];
    },

    renderGCPSetup: function() {
        const data = typeof MSP_PORTAL_DATA !== 'undefined' ? MSP_PORTAL_DATA.gcp : null;
        const overview = data?.overview || {};
        const checklist = data?.checklist || {};
        
        return `
        <div class="env-provider-content">
            <div class="env-section">
                <h3>${overview.title || 'Google Cloud - Assured Workloads'}</h3>
                <p>${overview.description || 'Configure Google Cloud with Assured Workloads for CMMC compliance.'}</p>
                <div class="env-key-points">
                    ${(overview.keyPoints || [
                        'Assured Workloads enforces compliance controls at folder level',
                        'US-only data residency via organization policies',
                        'FedRAMP Moderate, High, and IL4 regimes available',
                        'Premium support tier required for compliance'
                    ]).map(p => `<div class="key-point">• ${p}</div>`).join('')}
                </div>
                <div class="env-links">
                    <a href="https://console.cloud.google.com" target="_blank" class="env-link">GCP Console ↗</a>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Assured Workloads Compliance Regimes</h3></div>
                <div class="msp-card-body">
                    <table class="msp-table">
                        <thead>
                            <tr><th>Regime</th><th>Services Available</th><th>Restrictions</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><span class="status-badge success">FedRAMP Moderate</span></td>
                                <td>Most GCP services</td>
                                <td>US regions, access transparency</td>
                            </tr>
                            <tr>
                                <td><span class="status-badge warning">FedRAMP High</span></td>
                                <td>Subset of services</td>
                                <td>US regions, personnel controls, CMEK required</td>
                            </tr>
                            <tr>
                                <td><span class="status-badge danger">IL4</span></td>
                                <td>Limited (Compute, GKE, Storage, BigQuery)</td>
                                <td>Strictest controls, dedicated infrastructure</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="msp-card">
                <div class="msp-card-header"><h3>Create Assured Workloads Folder</h3></div>
                <div class="msp-card-body">
                    <pre class="code-block"><code># Create Assured Workloads folder for FedRAMP High
gcloud assured workloads create \\
  --organization=ORGANIZATION_ID \\
  --location=us \\
  --display-name="CUI-Workloads" \\
  --compliance-regime=FEDRAMP_HIGH \\
  --billing-account=BILLING_ACCOUNT_ID</code></pre>
                </div>
            </div>
            
            <div class="msp-card full-width">
                <div class="msp-card-header"><h3>Implementation Checklist</h3></div>
                <div class="msp-card-body">
                    ${this.renderChecklistFromData(checklist.categories || this.getDefaultGCPChecklist())}
                </div>
            </div>
        </div>`;
    },

    getDefaultGCPChecklist: function() {
        return [
            { name: 'Organization Setup', items: [
                { task: 'Create GCP Organization with Cloud Identity', critical: true, effort: '1 day' },
                { task: 'Enable Assured Workloads for organization', critical: true, effort: '1 day' },
                { task: 'Create Assured Workloads folder (FedRAMP High)', critical: true, effort: '2-4 hours' },
                { task: 'Configure resource location restriction (US only)', critical: true, effort: '1 hour' }
            ]},
            { name: 'Identity & Access', items: [
                { task: 'Enable 2-Step Verification for all users', critical: true, effort: '2-4 hours' },
                { task: 'Require security keys for admin accounts', critical: true, effort: '4-8 hours' },
                { task: 'Configure IAM roles with least privilege', critical: true, effort: '1 day' },
                { task: 'Set up BeyondCorp Enterprise (if applicable)', critical: false, effort: '1-2 days' }
            ]},
            { name: 'Security & Monitoring', items: [
                { task: 'Enable Security Command Center Premium', critical: true, effort: '2-4 hours' },
                { task: 'Configure Cloud Audit Logs', critical: true, effort: '2-4 hours' },
                { task: 'Set up log sinks to BigQuery/Cloud Storage', critical: true, effort: '4-8 hours' },
                { task: 'Enable VPC Service Controls', critical: true, effort: '4-8 hours' },
                { task: 'Configure Cloud Armor WAF', critical: true, effort: '4-8 hours' }
            ]},
            { name: 'Data Protection', items: [
                { task: 'Enable CMEK for all storage services', critical: true, effort: '4-8 hours' },
                { task: 'Configure DLP API for data scanning', critical: false, effort: '1 day' },
                { task: 'Enable VPC Flow Logs', critical: true, effort: '2-4 hours' }
            ]}
        ];
    },

    // ==================== ARCHITECTURE VIEW ====================
    architecture: function(portal) {
        return `
        <div class="msp-architecture-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Multi-Tenant Architecture</h2><p>Design patterns for managing multiple CMMC clients with proper isolation and shared services.</p></div></div>
            <div class="arch-principles">
                <h3>Core Principles</h3>
                <div class="principles-grid">
                    <div class="principle-card"><div class="principle-icon">🔒</div><h4>Tenant Isolation</h4><p>Complete separation of client data, identities, and resources. No shared CUI storage.</p></div>
                    <div class="principle-card"><div class="principle-icon">🎛️</div><h4>Centralized Management</h4><p>Single pane of glass for MSP operations while maintaining client boundaries.</p></div>
                    <div class="principle-card"><div class="principle-icon">📊</div><h4>Unified Monitoring</h4><p>Aggregate security telemetry without mixing client data.</p></div>
                    <div class="principle-card"><div class="principle-icon">⚡</div><h4>Scalable Onboarding</h4><p>Repeatable templates and automation for consistent deployments.</p></div>
                </div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Reference Architecture</h3></div><div class="msp-card-body">${this.renderReferenceArch()}</div></div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Anti-Patterns to Avoid</h3></div><div class="msp-card-body">${this.renderAntiPatterns()}</div></div>
        </div>`;
    },

    renderReferenceArch: function() {
        return `
        <div class="reference-arch">
            <div class="arch-row msp-row"><div class="arch-box msp-tenant"><h4>MSP Management Tenant</h4><div class="arch-services"><span>Azure Lighthouse</span><span>Sentinel Multi-workspace</span><span>Defender for Cloud</span><span>Intune Multi-tenant</span><span>Automation Accounts</span></div></div></div>
            <div class="arch-connections"><div class="connection-line" data-label="Delegated Admin"></div></div>
            <div class="arch-row clients-row">
                <div class="arch-box client-tenant"><h4>Client A (GCC High)</h4><div class="arch-services"><span>M365 GCC High</span><span>Azure Gov Sub</span><span>Log Analytics</span></div></div>
                <div class="arch-box client-tenant"><h4>Client B (GCC High)</h4><div class="arch-services"><span>M365 GCC High</span><span>Azure Gov Sub</span><span>Log Analytics</span></div></div>
                <div class="arch-box client-tenant"><h4>Client C (Commercial)</h4><div class="arch-services"><span>M365 E5</span><span>Azure Commercial</span><span>Log Analytics</span></div></div>
            </div>
        </div>`;
    },

    renderAntiPatterns: function() {
        return `
        <div class="anti-patterns-list">
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Shared CUI Storage</h5><p>Never store multiple clients' CUI in the same storage account, even with folder separation.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Single Admin Accounts</h5><p>Don't use the same admin account across client tenants. Use dedicated accounts with PIM.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Merged Log Analytics</h5><p>Client logs must remain in separate workspaces. Use Sentinel cross-workspace queries for SOC.</p></div></div>
            <div class="anti-pattern"><span class="anti-icon">❌</span><div><h5>Shared VDI Pools</h5><p>Different clients cannot share VDI session host pools when processing CUI.</p></div></div>
        </div>`;
    },

    // ==================== ENCLAVES VIEW ====================
    enclaves: function(portal) {
        return `
        <div class="msp-enclaves-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Enclave Design Patterns</h2><p>Isolated environments for CUI processing with defense-in-depth security controls.</p></div></div>
            <div class="enclave-types">
                <h3>Enclave Architecture Options</h3>
                <div class="enclave-grid">
                    <div class="enclave-card"><h4>🏢 Dedicated Tenant</h4><p><strong>Best for:</strong> Larger clients, strict isolation requirements</p><ul><li>Separate M365/Azure tenant</li><li>Complete data sovereignty</li><li>Independent security policies</li><li>Higher cost, maximum isolation</li></ul></div>
                    <div class="enclave-card"><h4>🔐 Virtual Enclave</h4><p><strong>Best for:</strong> Mid-size clients, cost-conscious</p><ul><li>Isolated subscription/resource groups</li><li>Network-level segmentation</li><li>Shared identity infrastructure</li><li>Balanced cost/isolation</li></ul></div>
                    <div class="enclave-card"><h4>💻 VDI Enclave</h4><p><strong>Best for:</strong> BYOD, contractors, remote access</p><ul><li>Isolated VDI session pools</li><li>No data on endpoints</li><li>Session-based isolation</li><li>Most flexible access</li></ul></div>
                </div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>Enclave Security Controls</h3></div><div class="msp-card-body">${this.renderEnclaveControls()}</div></div>
        </div>`;
    },

    renderEnclaveControls: function() {
        return `
        <div class="enclave-controls-grid">
            <div class="control-section"><h4>🌐 Network Boundary</h4><ul><li>Dedicated VNet/VPC per enclave</li><li>Azure Firewall / AWS Network Firewall</li><li>No direct internet egress from CUI systems</li><li>Private endpoints for all PaaS services</li><li>NSG/Security Group deny-by-default</li></ul></div>
            <div class="control-section"><h4>🔑 Identity Boundary</h4><ul><li>Conditional Access: compliant device + MFA</li><li>Privileged Identity Management (JIT)</li><li>No shared service accounts</li><li>Certificate-based auth for admins</li><li>Break-glass procedures documented</li></ul></div>
            <div class="control-section"><h4>💾 Data Boundary</h4><ul><li>Customer-managed encryption keys</li><li>DLP policies blocking external sharing</li><li>Sensitivity labels on all CUI</li><li>No USB/removable media</li><li>Watermarking on documents</li></ul></div>
            <div class="control-section"><h4>📊 Monitoring Boundary</h4><ul><li>Dedicated Log Analytics workspace</li><li>All traffic logged (NSG flow logs)</li><li>UEBA for anomaly detection</li><li>Real-time alerting to SOC</li><li>90-day hot / 1-year cold retention</li></ul></div>
        </div>`;
    },

    // ==================== VDI VIEW ====================
    vdi: function(portal) {
        return `
        <div class="msp-vdi-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Virtual Desktop Infrastructure</h2><p>Deploy secure VDI solutions for CUI processing with proper isolation and compliance controls.</p></div></div>
            <div class="vdi-options-grid">
                <div class="vdi-option-card"><h4>Azure Virtual Desktop</h4><span class="vdi-rec">Recommended for M365</span><ul><li>Native GCC High support</li><li>M365 integration (Office, Teams)</li><li>FSLogix profile containers</li><li>Azure AD Join support</li></ul></div>
                <div class="vdi-option-card"><h4>Amazon WorkSpaces</h4><span class="vdi-rec">Best for AWS-centric</span><ul><li>GovCloud availability</li><li>PCoIP/WSP protocols</li><li>Directory Service integration</li><li>Bring-your-own-license</li></ul></div>
                <div class="vdi-option-card"><h4>Citrix DaaS</h4><span class="vdi-rec">Enterprise feature-rich</span><ul><li>Multi-cloud support</li><li>Advanced HDX protocol</li><li>FedRAMP authorized</li><li>Enhanced security controls</li></ul></div>
            </div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>VDI Security Requirements for CMMC</h3></div><div class="msp-card-body">${this.renderVDISecurityReqs()}</div></div>
            <div class="msp-card full-width"><div class="msp-card-header"><h3>MSP VDI Architecture Pattern</h3></div><div class="msp-card-body">${this.renderVDIArchPattern()}</div></div>
        </div>`;
    },

    renderVDISecurityReqs: function() {
        return `
        <div class="security-reqs-grid">
            <div class="sec-req"><span class="req-icon">🔐</span><h5>Authentication</h5><ul><li>MFA required for all VDI access</li><li>Certificate-based auth preferred</li><li>Session timeout ≤15 minutes</li></ul></div>
            <div class="sec-req"><span class="req-icon">🖥️</span><h5>Endpoint</h5><ul><li>No CUI on local devices</li><li>Clipboard/drive redirection disabled</li><li>Watermarking enabled</li></ul></div>
            <div class="sec-req"><span class="req-icon">🔒</span><h5>Data Protection</h5><ul><li>Encryption in transit (TLS 1.2+)</li><li>Encrypted profile disks</li><li>DLP policies enforced</li></ul></div>
            <div class="sec-req"><span class="req-icon">📊</span><h5>Monitoring</h5><ul><li>Session recording (optional)</li><li>User activity logging</li><li>Anomaly detection</li></ul></div>
        </div>`;
    },

    renderVDIArchPattern: function() {
        return `
        <div class="vdi-arch-diagram">
            <div class="vdi-layer users"><span class="layer-title">End Users</span><div class="layer-items"><span>Thin Clients</span><span>Managed Laptops</span><span>BYOD (restricted)</span></div></div>
            <div class="vdi-connector">↓ MFA + Conditional Access ↓</div>
            <div class="vdi-layer gateway"><span class="layer-title">Gateway Layer</span><div class="layer-items"><span>AVD Gateway</span><span>RD Web Access</span><span>Load Balancer</span></div></div>
            <div class="vdi-connector">↓ Encrypted Session ↓</div>
            <div class="vdi-layer hosts"><span class="layer-title">Session Hosts</span><div class="layer-items"><span>CUI Pool (Isolated)</span><span>Standard Pool</span><span>Personal Desktops</span></div></div>
            <div class="vdi-connector">↓ Private Endpoints ↓</div>
            <div class="vdi-layer backend"><span class="layer-title">Backend Services</span><div class="layer-items"><span>File Shares (CUI)</span><span>Profile Storage</span><span>Domain Services</span></div></div>
        </div>`;
    },

    // ==================== SIEM VIEW ====================
    siem: function(portal) {
        return `
        <div class="msp-siem-view">
            <div class="msp-intro-banner security"><div class="banner-content"><h2>SIEM & MSSP Operations Center</h2><p>Centralized security operations for monitoring and protecting all client environments.</p></div></div>
            <div class="siem-dashboard-grid">
                <div class="msp-card"><div class="msp-card-header"><h3>MSSP Architecture</h3></div><div class="msp-card-body">${this.renderMSSPArchitecture()}</div></div>
                <div class="msp-card"><div class="msp-card-header"><h3>SIEM Platform Comparison</h3></div><div class="msp-card-body">${this.renderSIEMComparison()}</div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>CMMC Logging Requirements</h3></div><div class="msp-card-body">${this.renderLoggingReqs()}</div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>MSP Backend Operations</h3></div><div class="msp-card-body">${this.renderMSPBackendOps()}</div></div>
            </div>
        </div>`;
    },

    renderMSSPArchitecture: function() {
        return `
        <div class="mssp-arch-diagram">
            <div class="mssp-tier central"><h4>MSSP SOC</h4><ul><li>24/7 Monitoring</li><li>Threat Intelligence</li><li>Incident Response</li><li>Compliance Reporting</li></ul></div>
            <div class="mssp-connectors"><div class="connector-line"></div></div>
            <div class="mssp-tier siem"><h4>Central SIEM</h4><div class="siem-options"><span class="siem-badge sentinel">Sentinel</span><span class="siem-badge splunk">Splunk</span><span class="siem-badge chronicle">Chronicle</span></div></div>
            <div class="mssp-connectors multi"><div class="connector-line"></div></div>
            <div class="mssp-tier clients"><h4>Client Data Sources</h4><div class="client-sources"><span>Endpoint Logs</span><span>Network Flows</span><span>Cloud Audit</span><span>Identity Events</span></div></div>
        </div>`;
    },

    renderSIEMComparison: function() {
        return `
        <table class="msp-comparison-table">
            <thead><tr><th>Feature</th><th>Sentinel</th><th>Splunk</th><th>Chronicle</th></tr></thead>
            <tbody>
                <tr><td>FedRAMP</td><td class="good">High (GCC High)</td><td class="good">High (GovCloud)</td><td class="moderate">Moderate</td></tr>
                <tr><td>Multi-Tenant</td><td class="good">Native (Lighthouse)</td><td class="moderate">Via Apps</td><td class="good">Native</td></tr>
                <tr><td>CMMC Mapping</td><td class="good">Built-in</td><td class="moderate">Add-on</td><td class="moderate">Custom</td></tr>
                <tr><td>Cost Model</td><td>Per GB ingested</td><td>Per GB indexed</td><td>Per GB ingested</td></tr>
                <tr><td>Best For</td><td>M365/Azure</td><td>On-prem heavy</td><td>GCP environments</td></tr>
            </tbody>
        </table>`;
    },

    renderLoggingReqs: function() {
        const reqs = [
            { ctrl: '3.3.1', title: 'Create audit records', logs: ['Authentication events', 'Authorization decisions', 'System events'] },
            { ctrl: '3.3.2', title: 'Unique user attribution', logs: ['User session logs', 'Service account activity', 'Privileged operations'] },
            { ctrl: '3.3.4', title: 'Alert on failure', logs: ['Audit processing failures', 'Log storage alerts', 'Agent health'] },
            { ctrl: '3.3.5', title: 'Correlate audit review', logs: ['Cross-system correlation', 'Timeline analysis', 'Entity behavior'] }
        ];
        return `<div class="logging-requirements">${reqs.map(r => `<div class="logging-req-card"><div class="req-header"><span class="req-control">${r.ctrl}</span><span class="req-title">${r.title}</span></div><div class="req-logs">${r.logs.map(l => `<span class="log-tag">${l}</span>`).join('')}</div></div>`).join('')}</div>`;
    },

    renderMSPBackendOps: function() {
        return `
        <div class="backend-ops-grid">
            <div class="ops-category"><h4>🔒 Access Separation</h4><ul><li>Dedicated admin accounts per client</li><li>Just-in-time access via PIM</li><li>Separate credentials for CUI environments</li><li>Break-glass procedures documented</li></ul></div>
            <div class="ops-category"><h4>💾 Data Isolation</h4><ul><li>Separate Log Analytics workspaces</li><li>Client-specific encryption keys</li><li>Network segmentation per client</li><li>No shared storage for CUI</li></ul></div>
            <div class="ops-category"><h4>⏰ Retention & Compliance</h4><ul><li>Minimum 1-year log retention</li><li>Immutable audit trails</li><li>Regular compliance audits</li><li>Evidence preservation workflows</li></ul></div>
            <div class="ops-category"><h4>🚨 Incident Response</h4><ul><li>Client-specific IR playbooks</li><li>Escalation procedures</li><li>Breach notification templates</li><li>Forensic preservation process</li></ul></div>
        </div>`;
    },

    // ==================== AUTOMATION VIEW ====================
    automation: function(portal) {
        return `
        <div class="msp-automation-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Automation & Compliance</h2><p>Automate compliance monitoring, remediation, and reporting across client environments.</p></div></div>
            <div class="automation-sections">
                <div class="msp-card"><div class="msp-card-header"><h3>Compliance as Code</h3></div><div class="msp-card-body">
                    <div class="automation-tools">
                        <div class="tool-card"><h4>Azure Policy</h4><p>Built-in CMMC initiative with 180+ policies</p><code>Microsoft.Authorization/policyAssignments</code></div>
                        <div class="tool-card"><h4>AWS Config</h4><p>Conformance packs for NIST 800-171</p><code>aws configservice put-conformance-pack</code></div>
                        <div class="tool-card"><h4>Terraform</h4><p>Infrastructure as Code with compliance modules</p><code>module "cmmc_baseline" { ... }</code></div>
                    </div>
                </div></div>
                <div class="msp-card"><div class="msp-card-header"><h3>Continuous Monitoring</h3></div><div class="msp-card-body">
                    <ul class="monitoring-list">
                        <li><strong>Defender for Cloud Secure Score</strong> - Real-time posture assessment</li>
                        <li><strong>AWS Security Hub</strong> - NIST 800-171 findings</li>
                        <li><strong>Sentinel Workbooks</strong> - CMMC compliance dashboards</li>
                        <li><strong>Custom KQL/SPL Queries</strong> - Control-specific evidence</li>
                    </ul>
                </div></div>
                <div class="msp-card full-width"><div class="msp-card-header"><h3>Automation Scripts</h3></div><div class="msp-card-body">${this.renderAutomationScripts()}</div></div>
            </div>
        </div>`;
    },

    renderAutomationScripts: function() {
        return `
        <div class="scripts-grid">
            <div class="script-card"><h5>Enable MFA for All Users</h5><pre><code># Azure AD / Entra ID
Connect-MgGraph -Scopes "Policy.ReadWrite.ConditionalAccess"
New-MgIdentityConditionalAccessPolicy -DisplayName "Require MFA" \\
  -State "enabled" -Conditions @{...} -GrantControls @{...}</code></pre></div>
            <div class="script-card"><h5>Configure Audit Logging</h5><pre><code># Enable unified audit log
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true

# Azure Activity Logs to Log Analytics
az monitor diagnostic-settings create --resource /subscriptions/{id} \\
  --workspace {workspace-id} --logs '[{"category":"Administrative","enabled":true}]'</code></pre></div>
            <div class="script-card"><h5>Deploy Security Baseline</h5><pre><code># Intune Security Baseline
$baseline = Get-MgDeviceManagementIntent -Filter "displayName eq 'CMMC Baseline'"
New-MgDeviceManagementIntentAssignment -DeviceManagementIntentId $baseline.Id \\
  -Target @{"@odata.type"="#microsoft.graph.allDevicesAssignmentTarget"}</code></pre></div>
        </div>`;
    },

    // ==================== DOCUMENTATION VIEW ====================
    documentation: function(portal) {
        return `
        <div class="msp-documentation-view">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Best Practices & Documentation</h2><p>Reference guides, templates, and procedures for CMMC compliance management.</p></div></div>
            <div class="docs-grid">
                <div class="doc-section"><h3>📋 Official CMMC Resources</h3><ul class="doc-list">
                    <li><a href="https://dodcio.defense.gov/CMMC/" target="_blank" rel="noopener">CMMC Model Overview ↗</a></li>
                    <li><a href="https://cyberab.org/" target="_blank" rel="noopener">Cyber AB (Accreditation Body) ↗</a></li>
                    <li><a href="https://cyberab.org/Marketplace" target="_blank" rel="noopener">CMMC Marketplace ↗</a></li>
                    <li><a href="https://www.acq.osd.mil/cmmc/" target="_blank" rel="noopener">DoD CMMC Program Office ↗</a></li>
                    <li><a href="https://sam.gov" target="_blank" rel="noopener">SAM.gov Registration ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>📚 NIST Publications</h3><ul class="doc-list">
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final" target="_blank" rel="noopener">NIST SP 800-171 Rev 2 ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-171a/final" target="_blank" rel="noopener">NIST SP 800-171A (Assessment) ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-172/final" target="_blank" rel="noopener">NIST SP 800-172 (Enhanced) ↗</a></li>
                    <li><a href="https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final" target="_blank" rel="noopener">NIST SP 800-53 Rev 5 ↗</a></li>
                    <li><a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener">NIST Cybersecurity Framework ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>☁️ Cloud Provider Resources</h3><ul class="doc-list">
                    <li><a href="https://portal.azure.us" target="_blank" rel="noopener">Azure Government Portal ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc" target="_blank" rel="noopener">Azure CMMC Documentation ↗</a></li>
                    <li><a href="https://console.amazonaws-us-gov.com" target="_blank" rel="noopener">AWS GovCloud Console ↗</a></li>
                    <li><a href="https://aws.amazon.com/compliance/cmmc/" target="_blank" rel="noopener">AWS CMMC Compliance ↗</a></li>
                    <li><a href="https://cloud.google.com/security/compliance/fedramp" target="_blank" rel="noopener">GCP FedRAMP Compliance ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>🛡️ FedRAMP & DoD Resources</h3><ul class="doc-list">
                    <li><a href="https://marketplace.fedramp.gov/" target="_blank" rel="noopener">FedRAMP Marketplace ↗</a></li>
                    <li><a href="https://www.fedramp.gov/baselines/" target="_blank" rel="noopener">FedRAMP Baselines ↗</a></li>
                    <li><a href="https://public.cyber.mil/dccs/" target="_blank" rel="noopener">DoD Cloud Computing SRG ↗</a></li>
                    <li><a href="https://public.cyber.mil/stigs/" target="_blank" rel="noopener">DISA STIGs ↗</a></li>
                    <li><a href="https://www.cisa.gov/resources-tools/resources/cisa-zero-trust-maturity-model" target="_blank" rel="noopener">CISA Zero Trust Model ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>� Technical Guides</h3><ul class="doc-list">
                    <li><a href="https://learn.microsoft.com/en-us/azure/azure-government/documentation-government-get-started-connect-with-portal" target="_blank" rel="noopener">Azure Gov Getting Started ↗</a></li>
                    <li><a href="https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/getting-started.html" target="_blank" rel="noopener">AWS GovCloud Getting Started ↗</a></li>
                    <li><a href="https://cloud.google.com/assured-workloads/docs" target="_blank" rel="noopener">GCP Assured Workloads Docs ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/azure/sentinel/cmmc-guide" target="_blank" rel="noopener">Sentinel CMMC Workbook ↗</a></li>
                    <li><a href="https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview" target="_blank" rel="noopener">Conditional Access Overview ↗</a></li>
                </ul></div>
                <div class="doc-section"><h3>🎓 Training & Certification</h3><ul class="doc-list">
                    <li><a href="https://cyberab.org/Training" target="_blank" rel="noopener">Cyber AB Training Programs ↗</a></li>
                    <li><a href="https://www.comptia.org/certifications/security" target="_blank" rel="noopener">CompTIA Security+ ↗</a></li>
                    <li><a href="https://www.isc2.org/Certifications/CISSP" target="_blank" rel="noopener">ISC2 CISSP ↗</a></li>
                    <li><a href="https://csrc.nist.gov/projects/olir" target="_blank" rel="noopener">NIST OLIR Training ↗</a></li>
                    <li><a href="https://niccs.cisa.gov/" target="_blank" rel="noopener">NICCS Training Catalog ↗</a></li>
                </ul></div>
            </div>
            <div class="msp-card full-width" style="margin-top: 20px;">
                <div class="msp-card-header"><h3>📥 In-App Tools</h3></div>
                <div class="msp-card-body">
                    <div class="in-app-tools-grid">
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('sprs');">
                            ${portal.getIcon('bar-chart')}<span>SPRS Calculator</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('crosswalk');">
                            ${portal.getIcon('layers')}<span>Framework Crosswalk</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.closePortal(); window.app.switchView('impl-planner');">
                            ${portal.getIcon('calendar')}<span>Implementation Planner</span>
                        </button>
                        <button class="msp-tool-btn" onclick="MSPPortal.switchView('reports');">
                            ${portal.getIcon('file-text')}<span>Generate Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    // Default dashboard passthrough
    dashboard: function(portal) {
        return portal.renderDashboard();
    }
};

if (typeof window !== 'undefined') window.MSPPortalViews = MSPPortalViews;
