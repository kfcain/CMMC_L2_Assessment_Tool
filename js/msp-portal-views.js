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
        return `
        <div class="msp-env-setup">
            <div class="msp-intro-banner"><div class="banner-content"><h2>Cloud Environment Setup</h2><p>Configure compliant cloud environments for CMMC clients across Azure Government, AWS GovCloud, and Google Cloud.</p></div></div>
            <div class="msp-env-tabs">
                <button class="env-tab active" data-provider="azure" onclick="MSPPortalViews.switchEnvTab('azure')">🔷 Azure GCC High</button>
                <button class="env-tab" data-provider="aws" onclick="MSPPortalViews.switchEnvTab('aws')">🟠 AWS GovCloud</button>
                <button class="env-tab" data-provider="gcp" onclick="MSPPortalViews.switchEnvTab('gcp')">🔵 Google Cloud</button>
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
        return `
        <div class="env-provider-content">
            <div class="env-section"><h3>Azure Government / GCC High Setup</h3><p>Configure Microsoft Azure Government for CMMC compliance with FedRAMP High authorization.</p></div>
            <div class="env-requirements">
                <h4>Prerequisites</h4>
                <ul class="requirement-list">
                    <li class="req-item"><span class="req-check">✓</span><div><strong>Microsoft 365 GCC High Licensing</strong><p>E3/E5 GCC High licenses for all users handling CUI</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>Azure Government Subscription</strong><p>Separate subscription at portal.azure.us</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>Entra ID P2 (Azure AD Premium P2)</strong><p>Required for Conditional Access, PIM, Identity Protection</p></div></li>
                </ul>
            </div>
            <div class="env-architecture">
                <h4>Multi-Tenant Architecture for MSPs</h4>
                <div class="arch-diagram">
                    <div class="arch-layer msp-layer"><span class="layer-label">MSP Management Tenant</span><div class="arch-components"><span>Azure Lighthouse</span><span>Sentinel (MSSP)</span><span>Defender for Cloud</span></div></div>
                    <div class="arch-connector">↓ Delegated Access ↓</div>
                    <div class="arch-layer client-layer"><span class="layer-label">Client Tenants</span><div class="arch-components"><span>Client A</span><span>Client B</span><span>Client C</span></div></div>
                </div>
            </div>
            <div class="env-checklist">
                <h4>Implementation Checklist</h4>
                <div class="checklist-grid">
                    ${this.renderAzureChecklist()}
                </div>
            </div>
        </div>`;
    },

    renderAzureChecklist: function() {
        const items = [
            { cat: 'Identity', task: 'Configure Entra ID with US-only data residency', critical: true },
            { cat: 'Identity', task: 'Enable MFA for all users (FIDO2 recommended)', critical: true },
            { cat: 'Identity', task: 'Configure Conditional Access policies', critical: true },
            { cat: 'Identity', task: 'Enable Privileged Identity Management (PIM)', critical: false },
            { cat: 'Network', task: 'Deploy Azure Virtual WAN or Hub-Spoke', critical: false },
            { cat: 'Network', task: 'Configure Azure Firewall with threat intel', critical: true },
            { cat: 'Network', task: 'Enable NSG flow logs to Log Analytics', critical: false },
            { cat: 'Security', task: 'Enable Microsoft Defender for Cloud', critical: true },
            { cat: 'Security', task: 'Configure Microsoft Sentinel workspace', critical: true },
            { cat: 'Security', task: 'Enable Defender for Endpoint on all VMs', critical: true },
            { cat: 'Data', task: 'Configure Azure Information Protection labels', critical: true },
            { cat: 'Data', task: 'Enable encryption at rest (customer-managed keys)', critical: false },
            { cat: 'Monitoring', task: 'Configure diagnostic settings for all resources', critical: true },
            { cat: 'Monitoring', task: 'Set up Azure Monitor alerts for security events', critical: false }
        ];
        return items.map(i => `<div class="checklist-item ${i.critical ? 'critical' : ''}"><input type="checkbox"><label><span class="check-cat">${i.cat}</span><span class="check-task">${i.task}</span>${i.critical ? '<span class="critical-badge">Critical</span>' : ''}</label></div>`).join('');
    },

    renderAWSSetup: function() {
        return `
        <div class="env-provider-content">
            <div class="env-section"><h3>AWS GovCloud Setup</h3><p>Configure AWS GovCloud (US) for CMMC compliance with FedRAMP High and DoD IL4/IL5 workloads.</p></div>
            <div class="env-requirements">
                <h4>Prerequisites</h4>
                <ul class="requirement-list">
                    <li class="req-item"><span class="req-check">✓</span><div><strong>GovCloud Account</strong><p>Separate AWS GovCloud (US) account via commercial AWS</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>US Person Verification</strong><p>Account administrators must be US persons</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>AWS Organizations</strong><p>Multi-account strategy with SCPs</p></div></li>
                </ul>
            </div>
            <div class="env-architecture">
                <h4>Landing Zone Architecture</h4>
                <div class="arch-diagram">
                    <div class="arch-layer msp-layer"><span class="layer-label">Management Account</span><div class="arch-components"><span>AWS Organizations</span><span>Security Hub</span><span>CloudTrail Org Trail</span></div></div>
                    <div class="arch-connector">↓ SCPs & Guardrails ↓</div>
                    <div class="arch-layer client-layer"><span class="layer-label">Client OUs</span><div class="arch-components"><span>Client A OU</span><span>Client B OU</span><span>Shared Services</span></div></div>
                </div>
            </div>
            <div class="env-checklist">
                <h4>Implementation Checklist</h4>
                <div class="checklist-grid">
                    ${this.renderAWSChecklist()}
                </div>
            </div>
        </div>`;
    },

    renderAWSChecklist: function() {
        const items = [
            { cat: 'Identity', task: 'Enable AWS IAM Identity Center (SSO)', critical: true },
            { cat: 'Identity', task: 'Configure MFA for all IAM users', critical: true },
            { cat: 'Identity', task: 'Implement least-privilege IAM policies', critical: true },
            { cat: 'Network', task: 'Deploy Transit Gateway for multi-VPC', critical: false },
            { cat: 'Network', task: 'Configure AWS Network Firewall', critical: true },
            { cat: 'Network', task: 'Enable VPC Flow Logs', critical: true },
            { cat: 'Security', task: 'Enable AWS Security Hub', critical: true },
            { cat: 'Security', task: 'Configure GuardDuty for threat detection', critical: true },
            { cat: 'Security', task: 'Enable AWS Config with conformance packs', critical: true },
            { cat: 'Data', task: 'Enable S3 default encryption (SSE-KMS)', critical: true },
            { cat: 'Data', task: 'Configure Macie for CUI classification', critical: false },
            { cat: 'Logging', task: 'Enable CloudTrail in all regions', critical: true },
            { cat: 'Logging', task: 'Configure CloudWatch Logs retention', critical: true }
        ];
        return items.map(i => `<div class="checklist-item ${i.critical ? 'critical' : ''}"><input type="checkbox"><label><span class="check-cat">${i.cat}</span><span class="check-task">${i.task}</span>${i.critical ? '<span class="critical-badge">Critical</span>' : ''}</label></div>`).join('');
    },

    renderGCPSetup: function() {
        return `
        <div class="env-provider-content">
            <div class="env-section"><h3>Google Cloud Setup</h3><p>Configure Google Cloud with Assured Workloads for CMMC compliance (FedRAMP Moderate/High).</p></div>
            <div class="env-requirements">
                <h4>Prerequisites</h4>
                <ul class="requirement-list">
                    <li class="req-item"><span class="req-check">✓</span><div><strong>Assured Workloads</strong><p>FedRAMP High or IL4 compliance regime</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>Organization Resource</strong><p>GCP Organization with Cloud Identity</p></div></li>
                    <li class="req-item"><span class="req-check">✓</span><div><strong>US Region Restriction</strong><p>Resource location policy for US-only</p></div></li>
                </ul>
            </div>
            <div class="env-checklist">
                <h4>Implementation Checklist</h4>
                <div class="checklist-grid">
                    ${this.renderGCPChecklist()}
                </div>
            </div>
        </div>`;
    },

    renderGCPChecklist: function() {
        const items = [
            { cat: 'Identity', task: 'Configure Cloud Identity with 2-Step Verification', critical: true },
            { cat: 'Identity', task: 'Implement BeyondCorp Enterprise', critical: false },
            { cat: 'Security', task: 'Enable Security Command Center Premium', critical: true },
            { cat: 'Security', task: 'Configure Chronicle SIEM/SOAR', critical: false },
            { cat: 'Network', task: 'Deploy VPC Service Controls', critical: true },
            { cat: 'Network', task: 'Configure Cloud Armor WAF', critical: true },
            { cat: 'Data', task: 'Enable CMEK for all storage', critical: true },
            { cat: 'Data', task: 'Configure DLP API for CUI scanning', critical: false },
            { cat: 'Logging', task: 'Enable Cloud Audit Logs', critical: true },
            { cat: 'Logging', task: 'Configure log sinks to BigQuery', critical: false }
        ];
        return items.map(i => `<div class="checklist-item ${i.critical ? 'critical' : ''}"><input type="checkbox"><label><span class="check-cat">${i.cat}</span><span class="check-task">${i.task}</span>${i.critical ? '<span class="critical-badge">Critical</span>' : ''}</label></div>`).join('');
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
                <div class="doc-section"><h3>📋 Policy Templates</h3><ul class="doc-list">
                    <li><a href="#">Access Control Policy</a></li><li><a href="#">Incident Response Plan</a></li><li><a href="#">System Security Plan (SSP)</a></li><li><a href="#">Configuration Management Policy</a></li><li><a href="#">Risk Assessment Procedures</a></li>
                </ul></div>
                <div class="doc-section"><h3>🔧 Technical Guides</h3><ul class="doc-list">
                    <li><a href="#">Azure GCC High Onboarding</a></li><li><a href="#">AWS GovCloud Landing Zone</a></li><li><a href="#">Sentinel CMMC Workbook Setup</a></li><li><a href="#">Conditional Access Policies</a></li><li><a href="#">FIDO2 Key Deployment</a></li>
                </ul></div>
                <div class="doc-section"><h3>📊 Reporting Templates</h3><ul class="doc-list">
                    <li><a href="#">Monthly Compliance Report</a></li><li><a href="#">Executive Dashboard</a></li><li><a href="#">POA&M Template</a></li><li><a href="#">Evidence Collection Checklist</a></li><li><a href="#">C3PAO Preparation Guide</a></li>
                </ul></div>
                <div class="doc-section"><h3>🎓 Training Resources</h3><ul class="doc-list">
                    <li><a href="#">CMMC Overview for Staff</a></li><li><a href="#">Security Awareness Training</a></li><li><a href="#">Phishing Simulation Guide</a></li><li><a href="#">Incident Reporting Procedures</a></li><li><a href="#">CUI Handling Guidelines</a></li>
                </ul></div>
            </div>
        </div>`;
    },

    // Default dashboard passthrough
    dashboard: function(portal) {
        return portal.renderDashboard();
    }
};

if (typeof window !== 'undefined') window.MSPPortalViews = MSPPortalViews;
