// CMMC Level 3 Assessment View - NIST 800-172A Enhanced Controls
// Displays enhanced security requirements with technology guidance and automation

const CMMCL3Assessment = {
    config: {
        version: "1.0.0",
        name: "CMMC Level 3 Assessment"
    },

    // Enhanced controls data structure with implementation guidance
    ENHANCED_CONTROLS: {
        'AC': {
            name: 'Access Control',
            controls: [
                {
                    id: '3.1.2e',
                    title: 'Controlled Access Based on Dynamic Attributes',
                    objectives: [
                        'Employ attribute-based access control using dynamic attributes',
                        'Include security attributes, geographic location, time of day, and mission requirements',
                        'Automatically adjust access permissions based on context'
                    ],
                    technologies: {
                        azure: ['Conditional Access with Named Locations', 'Entra ID Identity Protection', 'Microsoft Defender for Cloud Apps'],
                        aws: ['IAM Access Analyzer', 'AWS Organizations SCPs', 'Lake Formation'],
                        gcp: ['BeyondCorp Enterprise', 'Context-Aware Access', 'VPC Service Controls']
                    },
                    automation: ['ABAC policy engines', 'Real-time risk scoring', 'Continuous access evaluation'],
                    evidence: ['ABAC policy configurations', 'Access decision logs', 'Attribute assignment records']
                },
                {
                    id: '3.1.3e',
                    title: 'Employ Secure Information Transfer',
                    objectives: [
                        'Employ automated mechanisms to enforce information flow restrictions',
                        'Prevent unauthorized information transfer between system components',
                        'Implement cross-domain solutions where required'
                    ],
                    technologies: {
                        azure: ['Azure Information Protection', 'Microsoft Purview DLP', 'Azure Firewall Premium'],
                        aws: ['AWS Network Firewall', 'Amazon Macie', 'AWS Transfer Family'],
                        gcp: ['Cloud DLP', 'VPC Service Controls', 'Private Service Connect']
                    },
                    automation: ['DLP rule automation', 'Content inspection pipelines', 'Cross-domain transfer logging'],
                    evidence: ['DLP policy configurations', 'Transfer logs', 'Data classification reports']
                }
            ]
        },
        'AT': {
            name: 'Awareness and Training',
            controls: [
                {
                    id: '3.2.1e',
                    title: 'Practical Exercises in Security Training',
                    objectives: [
                        'Include practical exercises in security awareness training',
                        'Provide hands-on experience with security tools and procedures',
                        'Conduct realistic scenarios for incident response'
                    ],
                    technologies: {
                        azure: ['Microsoft Attack Simulator', 'Microsoft Defender XDR', 'Secure Score Actions'],
                        aws: ['AWS Security Hub Workshops', 'Amazon Detective Labs', 'GuardDuty Findings'],
                        gcp: ['Chronicle Security Operations Labs', 'Assured Workloads Training', 'Security Command Center']
                    },
                    automation: ['Automated phishing simulations', 'Tabletop exercise scheduling', 'Training completion tracking'],
                    evidence: ['Exercise completion records', 'Simulation results', 'Skills assessment reports']
                },
                {
                    id: '3.2.2e',
                    title: 'Advanced Threat Awareness',
                    objectives: [
                        'Provide threat awareness training specific to APT tactics',
                        'Include social engineering recognition',
                        'Cover supply chain threat indicators'
                    ],
                    technologies: {
                        azure: ['Microsoft Threat Intelligence', 'Defender Threat Analytics', 'Security Copilot'],
                        aws: ['AWS Threat Intelligence', 'Amazon Detective', 'Security Lake'],
                        gcp: ['Chronicle Threat Intelligence', 'VirusTotal Enterprise', 'Mandiant Advantage']
                    },
                    automation: ['Threat brief automation', 'IOC distribution', 'Training module updates'],
                    evidence: ['Training materials', 'Attendance records', 'Knowledge assessments']
                }
            ]
        },
        'AU': {
            name: 'Audit and Accountability',
            controls: [
                {
                    id: '3.3.1e',
                    title: 'Privileged Function Auditing',
                    objectives: [
                        'Audit the execution of privileged functions',
                        'Capture full command-line arguments and parameters',
                        'Log all security-relevant events for privileged users'
                    ],
                    technologies: {
                        azure: ['Microsoft Sentinel', 'Azure Monitor', 'Defender for Endpoint EDR'],
                        aws: ['CloudTrail with data events', 'CloudWatch Logs Insights', 'AWS Security Lake'],
                        gcp: ['Cloud Audit Logs', 'Chronicle SIEM', 'Security Command Center Premium']
                    },
                    automation: ['Real-time log ingestion', 'Privileged command detection', 'Anomaly alerting'],
                    evidence: ['Privileged action logs', 'Command history', 'Alert configurations']
                },
                {
                    id: '3.3.2e',
                    title: 'Cross-Organizational Audit Correlation',
                    objectives: [
                        'Correlate audit records across organizational boundaries',
                        'Enable investigation of distributed attacks',
                        'Maintain chain of custody for audit data'
                    ],
                    technologies: {
                        azure: ['Sentinel Multi-workspace', 'Azure Lighthouse', 'Microsoft Graph Security API'],
                        aws: ['Security Lake cross-account', 'Organizations CloudTrail', 'Detective cross-account'],
                        gcp: ['Chronicle unified logs', 'Organization-level logging', 'BigQuery audit export']
                    },
                    automation: ['Cross-tenant log aggregation', 'Federated search', 'Correlation rule engines'],
                    evidence: ['Cross-org correlation reports', 'Investigation timelines', 'Data sharing agreements']
                }
            ]
        },
        'CM': {
            name: 'Configuration Management',
            controls: [
                {
                    id: '3.4.1e',
                    title: 'Dual Authorization for Changes',
                    objectives: [
                        'Employ dual authorization for critical system changes',
                        'Implement separation of duties for configuration changes',
                        'Require approval workflows for production modifications'
                    ],
                    technologies: {
                        azure: ['Azure DevOps Approvals', 'Privileged Identity Management', 'Azure Policy'],
                        aws: ['AWS Systems Manager Change Manager', 'Service Catalog', 'Control Tower'],
                        gcp: ['Cloud Build Approvals', 'Deployment Manager', 'Config Controller']
                    },
                    automation: ['GitOps workflows', 'Approval automation', 'Change tracking pipelines'],
                    evidence: ['Change request records', 'Approval logs', 'Dual authorization evidence']
                },
                {
                    id: '3.4.2e',
                    title: 'Automated Configuration Monitoring',
                    objectives: [
                        'Employ automated mechanisms to detect unauthorized changes',
                        'Alert on configuration drift from baseline',
                        'Automatically remediate non-compliant configurations'
                    ],
                    technologies: {
                        azure: ['Azure Policy (DeployIfNotExists)', 'Defender for Cloud', 'Azure Automanage'],
                        aws: ['AWS Config Rules', 'Systems Manager State Manager', 'Security Hub auto-remediation'],
                        gcp: ['Security Health Analytics', 'Assured Workloads', 'Organization Policy Service']
                    },
                    automation: ['Continuous configuration assessment', 'Drift detection', 'Auto-remediation playbooks'],
                    evidence: ['Configuration compliance reports', 'Drift alerts', 'Remediation logs']
                }
            ]
        },
        'IA': {
            name: 'Identification and Authentication',
            controls: [
                {
                    id: '3.5.1e',
                    title: 'Bidirectional Authentication',
                    objectives: [
                        'Implement bidirectional authentication between systems',
                        'Authenticate both client and server in communications',
                        'Use cryptographic mechanisms for mutual authentication'
                    ],
                    technologies: {
                        azure: ['Mutual TLS (mTLS)', 'Entra ID Certificate-based Auth', 'Service Fabric mTLS'],
                        aws: ['ACM Private CA for mTLS', 'API Gateway mutual TLS', 'App Mesh mTLS'],
                        gcp: ['Cloud Service Mesh mTLS', 'Certificate Authority Service', 'Traffic Director']
                    },
                    automation: ['Certificate lifecycle automation', 'mTLS enforcement policies', 'Authentication monitoring'],
                    evidence: ['mTLS configurations', 'Certificate inventories', 'Authentication logs']
                },
                {
                    id: '3.5.2e',
                    title: 'Replay-Resistant Authentication',
                    objectives: [
                        'Implement replay-resistant authentication mechanisms',
                        'Use time-sensitive authentication tokens',
                        'Protect against credential replay attacks'
                    ],
                    technologies: {
                        azure: ['FIDO2 Security Keys', 'Windows Hello for Business', 'Entra ID Passwordless'],
                        aws: ['AWS MFA with hardware tokens', 'Cognito Advanced Security', 'IAM Roles Anywhere'],
                        gcp: ['Titan Security Keys', 'Identity Platform', 'BeyondCorp Remote Access']
                    },
                    automation: ['Token expiration enforcement', 'Nonce validation', 'Session binding'],
                    evidence: ['Authentication method inventory', 'Token configurations', 'Replay attempt logs']
                }
            ]
        },
        'IR': {
            name: 'Incident Response',
            controls: [
                {
                    id: '3.6.1e',
                    title: 'Security Operations Center',
                    objectives: [
                        'Establish a security operations center capability',
                        'Provide 24x7 monitoring and response',
                        'Integrate threat intelligence into operations'
                    ],
                    technologies: {
                        azure: ['Microsoft Sentinel SOAR', 'Defender XDR', 'Security Copilot'],
                        aws: ['AWS Security Hub', 'Amazon Detective', 'AWS Incident Manager'],
                        gcp: ['Chronicle SOAR', 'Security Command Center', 'Mandiant Services']
                    },
                    automation: ['SOAR playbooks', 'Automated triage', 'Threat intel integration'],
                    evidence: ['SOC operational procedures', 'Staffing schedules', 'Response metrics']
                },
                {
                    id: '3.6.2e',
                    title: 'Cyber Incident Response Team',
                    objectives: [
                        'Establish and maintain a cyber incident response team',
                        'Define roles and responsibilities for incident handling',
                        'Conduct regular incident response exercises'
                    ],
                    technologies: {
                        azure: ['Microsoft Defender Portal', 'Azure Sentinel Workbooks', 'Logic Apps'],
                        aws: ['AWS Incident Manager', 'Systems Manager OpsCenter', 'EventBridge'],
                        gcp: ['Chronicle Investigation', 'Security Command Center Findings', 'Cloud Functions']
                    },
                    automation: ['Incident workflow automation', 'Communication templates', 'Evidence collection'],
                    evidence: ['Team charter', 'Contact lists', 'Exercise reports']
                }
            ]
        },
        'RA': {
            name: 'Risk Assessment',
            controls: [
                {
                    id: '3.11.1e',
                    title: 'Threat Hunting',
                    objectives: [
                        'Conduct proactive threat hunting activities',
                        'Use threat intelligence to guide hunting operations',
                        'Document and share hunting findings'
                    ],
                    technologies: {
                        azure: ['Microsoft Sentinel Hunting', 'Defender Advanced Hunting', 'KQL Queries'],
                        aws: ['Amazon Detective', 'CloudTrail Lake', 'Athena Security Analytics'],
                        gcp: ['Chronicle Hunting', 'BigQuery Security Analytics', 'Looker Dashboards']
                    },
                    automation: ['Scheduled hunting queries', 'IOC correlation', 'Finding documentation'],
                    evidence: ['Hunting playbooks', 'Hunt reports', 'IOC findings']
                },
                {
                    id: '3.11.2e',
                    title: 'Penetration Testing',
                    objectives: [
                        'Conduct penetration testing on organizational systems',
                        'Test both external and internal attack surfaces',
                        'Remediate findings within defined timeframes'
                    ],
                    technologies: {
                        azure: ['Microsoft Attack Simulation', 'Azure Red Team Tools', 'Defender Vulnerability'],
                        aws: ['AWS Inspector', 'Third-party pen testing', 'AWS Marketplace tools'],
                        gcp: ['Web Security Scanner', 'Container Analysis', 'Third-party assessments']
                    },
                    automation: ['Automated vulnerability scanning', 'Finding tracking', 'Remediation workflows'],
                    evidence: ['Penetration test reports', 'Remediation plans', 'Retest results']
                }
            ]
        },
        'SC': {
            name: 'System and Communications Protection',
            controls: [
                {
                    id: '3.13.1e',
                    title: 'Network Segmentation',
                    objectives: [
                        'Segment networks to isolate system components',
                        'Implement micro-segmentation for critical assets',
                        'Control traffic flows between segments'
                    ],
                    technologies: {
                        azure: ['Azure Firewall Premium', 'NSG Application Security Groups', 'Azure Private Link'],
                        aws: ['AWS Network Firewall', 'Security Groups', 'PrivateLink'],
                        gcp: ['VPC Service Controls', 'Firewall Policies', 'Private Google Access']
                    },
                    automation: ['Micro-segmentation policies', 'Traffic flow analysis', 'Policy enforcement'],
                    evidence: ['Network diagrams', 'Firewall rules', 'Traffic flow logs']
                },
                {
                    id: '3.13.2e',
                    title: 'Secure Software Development',
                    objectives: [
                        'Apply secure software development practices',
                        'Implement security testing throughout SDLC',
                        'Use software composition analysis'
                    ],
                    technologies: {
                        azure: ['GitHub Advanced Security', 'Azure DevOps Security', 'Microsoft Defender for DevOps'],
                        aws: ['CodeGuru Security', 'Inspector SBOM', 'CodePipeline Security'],
                        gcp: ['Artifact Analysis', 'Binary Authorization', 'Cloud Build Security']
                    },
                    automation: ['SAST/DAST automation', 'SCA scanning', 'Security gate enforcement'],
                    evidence: ['SDLC documentation', 'Security scan results', 'SBOM reports']
                },
                {
                    id: '3.13.3e',
                    title: 'Hardware Security',
                    objectives: [
                        'Protect system hardware from unauthorized access',
                        'Use tamper-evident mechanisms',
                        'Implement hardware-based security roots of trust'
                    ],
                    technologies: {
                        azure: ['Azure Confidential Computing', 'TPM-based attestation', 'Azure Dedicated HSM'],
                        aws: ['AWS Nitro Enclaves', 'CloudHSM', 'Nitro TPM'],
                        gcp: ['Confidential VMs', 'Cloud HSM', 'Shielded VMs']
                    },
                    automation: ['Attestation verification', 'Hardware inventory', 'Tamper detection'],
                    evidence: ['Hardware security configurations', 'Attestation logs', 'Physical security records']
                }
            ]
        },
        'SI': {
            name: 'System and Information Integrity',
            controls: [
                {
                    id: '3.14.1e',
                    title: 'Advanced Malware Protection',
                    objectives: [
                        'Employ advanced malware protection mechanisms',
                        'Use behavioral analysis and sandboxing',
                        'Integrate endpoint detection and response'
                    ],
                    technologies: {
                        azure: ['Microsoft Defender for Endpoint', 'Defender Antivirus', 'Defender for Cloud'],
                        aws: ['GuardDuty Malware Protection', 'Inspector', 'Security Hub'],
                        gcp: ['Chronicle EDR', 'VirusTotal Enterprise', 'Security Command Center']
                    },
                    automation: ['Real-time scanning', 'Behavioral detection', 'Automated response'],
                    evidence: ['EDR configurations', 'Detection logs', 'Response records']
                },
                {
                    id: '3.14.2e',
                    title: 'Threat Intelligence Integration',
                    objectives: [
                        'Integrate threat intelligence into security operations',
                        'Correlate threat data with internal telemetry',
                        'Share threat information with partners'
                    ],
                    technologies: {
                        azure: ['Microsoft Threat Intelligence', 'Sentinel TI Connectors', 'MSTIC'],
                        aws: ['AWS Threat Intelligence', 'Security Lake', 'Partner Intelligence'],
                        gcp: ['Chronicle Threat Intel', 'VirusTotal', 'Mandiant Threat Intelligence']
                    },
                    automation: ['IOC ingestion', 'Threat correlation', 'Intelligence sharing'],
                    evidence: ['TI feed configurations', 'Correlation rules', 'Sharing agreements']
                },
                {
                    id: '3.14.3e',
                    title: 'System Integrity Verification',
                    objectives: [
                        'Verify integrity of critical system components',
                        'Detect unauthorized modifications',
                        'Implement secure boot and measured launch'
                    ],
                    technologies: {
                        azure: ['Azure Attestation', 'Secure Boot', 'vTPM'],
                        aws: ['Nitro Attestation', 'EC2 Instance Identity', 'Systems Manager Inventory'],
                        gcp: ['Shielded VM Integrity', 'Binary Authorization', 'Container Analysis']
                    },
                    automation: ['Boot integrity checking', 'File integrity monitoring', 'Attestation validation'],
                    evidence: ['Integrity monitoring configs', 'Boot logs', 'Attestation reports']
                }
            ]
        }
    },

    init: function() {
        this.bindEvents();
        console.log('[CMMCL3Assessment] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#show-l3-assessment-btn')) {
                this.showL3AssessmentView();
            }
        });
    },

    showL3AssessmentView: function() {
        const html = `
        <div class="modal-overlay l3-assessment-modal" id="l3-assessment-modal">
            <div class="modal-content modal-fullscreen">
                <div class="modal-header l3-header">
                    <div>
                        <h2>CMMC Level 3 Assessment</h2>
                        <span class="modal-subtitle">NIST SP 800-172A Enhanced Security Requirements</span>
                    </div>
                    <button class="modal-close" data-action="close-modal" data-modal-id="l3-assessment-modal">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderL3Content()}
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        this.attachL3Events();
    },

    renderL3Content: function() {
        const stats = this.calculateStats();
        
        return `
        <div class="l3-assessment-container">
            <div class="l3-warning-banner">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <strong>CMMC Level 3 Requirements</strong>
                    <p>Level 3 certification requires all Level 2 controls PLUS these enhanced requirements from NIST 800-172A. Assessment is performed by DIBCAC, not C3PAOs.</p>
                </div>
            </div>

            <div class="l3-summary-stats">
                <div class="l3-stat"><span class="stat-value">${stats.totalFamilies}</span><span class="stat-label">Control Families</span></div>
                <div class="l3-stat"><span class="stat-value">${stats.totalControls}</span><span class="stat-label">Enhanced Controls</span></div>
                <div class="l3-stat"><span class="stat-value">${stats.totalObjectives}</span><span class="stat-label">Assessment Objectives</span></div>
            </div>

            <div class="l3-family-nav">
                ${Object.entries(this.ENHANCED_CONTROLS).map(([id, fam]) => 
                    `<button class="family-nav-btn" data-family="${id}" data-action="l3-scroll-family" data-param="${id}">${id}<span class="family-count">${fam.controls.length}</span></button>`
                ).join('')}
            </div>

            <div class="l3-controls-container">
                ${this.renderAllFamilies()}
            </div>
        </div>`;
    },

    calculateStats: function() {
        let totalControls = 0;
        let totalObjectives = 0;
        Object.values(this.ENHANCED_CONTROLS).forEach(fam => {
            totalControls += fam.controls.length;
            fam.controls.forEach(ctrl => {
                totalObjectives += ctrl.objectives.length;
            });
        });
        return {
            totalFamilies: Object.keys(this.ENHANCED_CONTROLS).length,
            totalControls,
            totalObjectives
        };
    },

    renderAllFamilies: function() {
        return Object.entries(this.ENHANCED_CONTROLS).map(([id, family]) => `
            <div class="l3-family-section" id="family-${id}">
                <div class="family-header" data-action="l3-toggle-family" data-param="${id}">
                    <h3><span class="family-id">${id}</span>${family.name}</h3>
                    <div class="family-header-right">
                        <span class="control-count">${family.controls.length} Enhanced Controls</span>
                        <svg class="family-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>
                <div class="family-controls" id="family-controls-${id}">
                    ${family.controls.map(ctrl => this.renderControl(ctrl)).join('')}
                </div>
            </div>
        `).join('');
    },

    toggleFamily: function(familyId) {
        const header = document.querySelector(`#family-${familyId} .family-header`);
        const controls = document.getElementById(`family-controls-${familyId}`);
        if (header && controls) {
            header.classList.toggle('expanded');
            controls.classList.toggle('expanded');
            this.saveL3DropdownState('family', familyId, header.classList.contains('expanded'));
        }
    },

    getL3DropdownState: function() {
        const saved = localStorage.getItem('nist-l3-dropdown-state');
        return saved ? JSON.parse(saved) : { families: {}, objectives: {} };
    },

    saveL3DropdownState: function(type, id, isExpanded) {
        const state = this.getL3DropdownState();
        if (type === 'family') {
            state.families[id] = isExpanded;
        } else if (type === 'objective') {
            state.objectives[id] = isExpanded;
        }
        localStorage.setItem('nist-l3-dropdown-state', JSON.stringify(state));
    },

    renderControl: function(control) {
        return `
        <div class="l3-control-card" data-control="${control.id}">
            <div class="control-header-row">
                <div class="control-id-title">
                    <code class="control-id">${control.id}</code>
                    <h4 class="control-title">${control.title}</h4>
                </div>
            </div>
            <div class="control-objectives-list">
                ${control.objectives.map((obj, i) => this.renderObjective(control, obj, i)).join('')}
            </div>
        </div>`;
    },

    renderObjective: function(control, objective, index) {
        const objId = `${control.id}[${String.fromCharCode(97 + index)}]`;
        const guidancePlaceholderId = `l3-guidance-${control.id}-${index}`;
        return `
        <div class="l3-objective-item" data-objective="${objId}">
            <div class="objective-header" data-action="l3-toggle-objective">
                <div class="objective-info">
                    <span class="obj-marker">${objId}</span>
                    <span class="objective-text">${objective}</span>
                </div>
                <svg class="objective-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div class="objective-guidance collapsed">
                <div id="${guidancePlaceholderId}" class="l3-comprehensive-guidance-slot" data-objective-id="${objId}"></div>
                <div class="guidance-section automation">
                    <h6>Automation Mechanisms</h6>
                    <div class="automation-tags">${control.automation.map(a => `<span class="auto-tag">${a}</span>`).join('')}</div>
                </div>
                <div class="guidance-section evidence">
                    <h6>Evidence Requirements</h6>
                    <div class="evidence-tags">${control.evidence.map(e => `<span class="evidence-tag">${e}</span>`).join('')}</div>
                </div>
            </div>
        </div>`;
    },

    toggleObjective: function(header) {
        const guidance = header.nextElementSibling;
        const objectiveItem = header.closest('.l3-objective-item');
        const objId = objectiveItem?.dataset.objective;
        header.classList.toggle('expanded');
        guidance.classList.toggle('collapsed');
        if (objId) {
            this.saveL3DropdownState('objective', objId, header.classList.contains('expanded'));
        }
    },

    scrollToFamily: function(familyId) {
        const el = document.getElementById(`family-${familyId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelectorAll('.family-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.family === familyId));
        }
    },

    attachL3Events: function() {
        // Populate comprehensive guidance into each objective slot
        if (typeof ComprehensiveGuidanceUI !== 'undefined') {
            document.querySelectorAll('.l3-comprehensive-guidance-slot').forEach(slot => {
                const objId = slot.dataset.objectiveId;
                if (objId) {
                    ComprehensiveGuidanceUI.renderGuidance(objId, slot);
                }
            });
        }
    },

    // Get control by ID
    getControl: function(controlId) {
        for (const family of Object.values(this.ENHANCED_CONTROLS)) {
            const ctrl = family.controls.find(c => c.id === controlId);
            if (ctrl) return ctrl;
        }
        return null;
    },

    // Export all L3 data
    exportL3Data: function() {
        return this.ENHANCED_CONTROLS;
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => CMMCL3Assessment.init()) : CMMCL3Assessment.init();
}
if (typeof window !== 'undefined') window.CMMCL3Assessment = CMMCL3Assessment;
