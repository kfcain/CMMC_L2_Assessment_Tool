// NIST 800-171A Rev2 to Rev3 Crosswalk Viewer
// Visual mapping with DoD-defined ODPs (2025)

const Rev3Crosswalk = {
    config: {
        version: "1.0.0"
    },

    // DoD-defined Organization-Defined Parameters (ODPs) - Released 2025
    DOD_ODPS: {
        '3.1.1': { odp: 'system access frequency', value: 'At least annually or upon significant change' },
        '3.1.2': { odp: 'transaction types requiring function separation', value: 'All privileged functions including system configuration, user management, and audit log access' },
        '3.1.5': { odp: 'unsuccessful login attempts', value: '3 consecutive failed attempts' },
        '3.1.5b': { odp: 'time period for lockout', value: 'Minimum 15 minutes or until released by administrator' },
        '3.1.6': { odp: 'time period of inactivity', value: '15 minutes' },
        '3.1.7': { odp: 'cryptographic mechanisms', value: 'FIPS 140-2/140-3 validated cryptographic modules' },
        '3.1.8': { odp: 'unsuccessful remote access attempts', value: '3 consecutive failed attempts within 15 minutes' },
        '3.1.12': { odp: 'remote access session types', value: 'All remote access sessions including VPN, VDI, and remote desktop' },
        '3.1.20': { odp: 'external system connections', value: 'All connections to systems not under organizational control' },
        '3.3.1': { odp: 'auditable events', value: 'Successful and unsuccessful account logon events, account management events, object access, policy change, privilege use, system events, and application events' },
        '3.3.2': { odp: 'audit record content', value: 'User identity, event type, date/time, success/failure, origination, and affected objects' },
        '3.3.8': { odp: 'audit information protection', value: 'Cryptographic protection and access limited to authorized personnel' },
        '3.4.1': { odp: 'baseline configuration documentation', value: 'Hardware, software, firmware versions, and network topology' },
        '3.4.2': { odp: 'configuration change conditions', value: 'Prior to implementation in production environment' },
        '3.4.5': { odp: 'physical and logical access restrictions', value: 'Role-based access with principle of least privilege' },
        '3.4.6': { odp: 'essential capabilities', value: 'Mission-critical functions as defined in system security plan' },
        '3.4.8': { odp: 'software blacklist/allowlist', value: 'Deny-by-default with approved software allowlist' },
        '3.5.3': { odp: 'MFA types', value: 'Something you know + something you have (hardware token or FIDO2)' },
        '3.5.7': { odp: 'password complexity', value: 'Minimum 14 characters, complexity enabled, 60-day maximum age' },
        '3.5.8': { odp: 'password reuse', value: 'Cannot reuse last 24 passwords' },
        '3.6.1': { odp: 'incident handling timeframes', value: 'Detection within 1 hour, containment within 4 hours, reporting within 72 hours' },
        '3.6.2': { odp: 'incident tracking content', value: 'Incident type, date/time, systems affected, actions taken, resolution' },
        '3.7.2': { odp: 'maintenance tools', value: 'Approved maintenance tools list maintained and reviewed quarterly' },
        '3.8.1': { odp: 'media types requiring protection', value: 'All digital and non-digital media containing CUI' },
        '3.8.9': { odp: 'cryptographic mechanisms for media', value: 'FIPS 140-2/140-3 validated AES-256 or equivalent' },
        '3.10.1': { odp: 'physical access devices', value: 'Keys, badges, smart cards, and biometric readers' },
        '3.11.1': { odp: 'risk assessment frequency', value: 'At least annually and upon significant system changes' },
        '3.11.2': { odp: 'vulnerability scanning frequency', value: 'At least monthly for network and quarterly for applications' },
        '3.12.1': { odp: 'security assessment frequency', value: 'At least annually' },
        '3.12.3': { odp: 'continuous monitoring strategy', value: 'Automated continuous monitoring with manual review monthly' },
        '3.13.1': { odp: 'boundary protection devices', value: 'Firewalls, intrusion detection/prevention systems, and proxies at all network boundaries' },
        '3.13.8': { odp: 'mobile code restrictions', value: 'Block unsigned or untrusted mobile code' },
        '3.13.11': { odp: 'cryptographic algorithms', value: 'AES-256, RSA-2048+, SHA-256+, TLS 1.2+' },
        '3.14.1': { odp: 'flaw remediation timeframes', value: 'Critical: 15 days, High: 30 days, Medium: 90 days, Low: 180 days' },
        '3.14.3': { odp: 'security alert sources', value: 'CISA, vendor notifications, NIST NVD, and US-CERT' },
        '3.14.6': { odp: 'malicious code protection locations', value: 'Endpoints, servers, network boundaries, email gateways' },
        '3.14.7': { odp: 'malicious code protection updates', value: 'Signature updates at least daily, scans at least weekly' }
    },

    // Rev2 to Rev3 Control Mapping
    CONTROL_MAPPING: [
        { rev2: '3.1.1', rev3: '03.01.01', status: 'modified', change: 'Enhanced access authorization requirements', newOdps: ['authorized users', 'access frequency'] },
        { rev2: '3.1.2', rev3: '03.01.02', status: 'modified', change: 'Added transaction types ODP', newOdps: ['transaction types'] },
        { rev2: '3.1.3', rev3: '03.01.03', status: 'unchanged', change: 'Minor editorial updates' },
        { rev2: '3.1.4', rev3: '03.01.04', status: 'modified', change: 'Strengthened flow control requirements' },
        { rev2: '3.1.5', rev3: '03.01.05', status: 'modified', change: 'Added specific lockout parameters', newOdps: ['unsuccessful attempts', 'lockout duration'] },
        { rev2: '3.1.6', rev3: '03.01.06', status: 'unchanged', change: 'Session lock requirements maintained' },
        { rev2: '3.1.7', rev3: '03.01.07', status: 'modified', change: 'Clarified privileged function scope' },
        { rev2: '3.1.8', rev3: '03.01.08', status: 'modified', change: 'Enhanced remote access restrictions' },
        { rev2: '3.1.9', rev3: '03.01.09', status: 'unchanged', change: 'Wireless access protection maintained' },
        { rev2: '3.1.10', rev3: '03.01.10', status: 'unchanged', change: 'Session termination requirements' },
        { rev2: '3.1.11', rev3: '03.01.11', status: 'modified', change: 'Added encryption requirements for remote sessions' },
        { rev2: '3.1.12', rev3: '03.01.12', status: 'modified', change: 'Enhanced remote access monitoring', newOdps: ['session types'] },
        { rev2: '3.1.13', rev3: '03.01.13', status: 'modified', change: 'Cryptographic mechanism specifications updated' },
        { rev2: '3.1.14', rev3: '03.01.14', status: 'unchanged', change: 'Wireless access routing maintained' },
        { rev2: '3.1.15', rev3: '03.01.15', status: 'unchanged', change: 'Remote access authorization' },
        { rev2: '3.1.16', rev3: '03.01.16', status: 'modified', change: 'Mobile device connection policies enhanced' },
        { rev2: '3.1.17', rev3: '03.01.17', status: 'unchanged', change: 'CUI on mobile devices' },
        { rev2: '3.1.18', rev3: '03.01.18', status: 'modified', change: 'Mobile device connectivity requirements strengthened' },
        { rev2: '3.1.19', rev3: '03.01.19', status: 'modified', change: 'Added explicit encryption for mobile CUI' },
        { rev2: '3.1.20', rev3: '03.01.20', status: 'modified', change: 'External system connection verification enhanced', newOdps: ['external connections'] },
        { rev2: '3.1.21', rev3: '03.01.21', status: 'unchanged', change: 'Portable storage restrictions' },
        { rev2: '3.1.22', rev3: '03.01.22', status: 'unchanged', change: 'Publicly accessible content' },
        { rev2: '3.2.1', rev3: '03.02.01', status: 'modified', change: 'Role-based training requirements enhanced' },
        { rev2: '3.2.2', rev3: '03.02.02', status: 'modified', change: 'Insider threat awareness added' },
        { rev2: '3.2.3', rev3: '03.02.03', status: 'unchanged', change: 'Security awareness training' },
        { rev2: '3.3.1', rev3: '03.03.01', status: 'modified', change: 'Expanded auditable events', newOdps: ['event types'] },
        { rev2: '3.3.2', rev3: '03.03.02', status: 'modified', change: 'Enhanced audit record content', newOdps: ['record content'] },
        { rev2: '3.3.3', rev3: '03.03.03', status: 'unchanged', change: 'Audit review and analysis' },
        { rev2: '3.3.4', rev3: '03.03.04', status: 'modified', change: 'Alert generation requirements enhanced' },
        { rev2: '3.3.5', rev3: '03.03.05', status: 'unchanged', change: 'Audit correlation' },
        { rev2: '3.3.6', rev3: '03.03.06', status: 'modified', change: 'Audit reduction requirements added' },
        { rev2: '3.3.7', rev3: '03.03.07', status: 'unchanged', change: 'Authoritative time source' },
        { rev2: '3.3.8', rev3: '03.03.08', status: 'modified', change: 'Cryptographic protection for audit logs', newOdps: ['protection mechanisms'] },
        { rev2: '3.3.9', rev3: '03.03.09', status: 'unchanged', change: 'Audit management personnel' },
        { rev2: '3.4.1', rev3: '03.04.01', status: 'modified', change: 'Baseline configuration documentation expanded', newOdps: ['documentation content'] },
        { rev2: '3.4.2', rev3: '03.04.02', status: 'modified', change: 'Change control process enhanced', newOdps: ['change conditions'] },
        { rev2: '3.4.3', rev3: '03.04.03', status: 'unchanged', change: 'Security impact analysis' },
        { rev2: '3.4.4', rev3: '03.04.04', status: 'unchanged', change: 'Access restrictions for changes' },
        { rev2: '3.4.5', rev3: '03.04.05', status: 'modified', change: 'Enhanced access restrictions', newOdps: ['restriction types'] },
        { rev2: '3.4.6', rev3: '03.04.06', status: 'modified', change: 'Essential capabilities defined', newOdps: ['essential capabilities'] },
        { rev2: '3.4.7', rev3: '03.04.07', status: 'modified', change: 'Nonessential functionality restrictions' },
        { rev2: '3.4.8', rev3: '03.04.08', status: 'modified', change: 'Application allowlisting enhanced', newOdps: ['allowlist approach'] },
        { rev2: '3.4.9', rev3: '03.04.09', status: 'unchanged', change: 'User-installed software' },
        { rev2: '3.5.1', rev3: '03.05.01', status: 'modified', change: 'User identification requirements enhanced' },
        { rev2: '3.5.2', rev3: '03.05.02', status: 'modified', change: 'Device identification enhanced' },
        { rev2: '3.5.3', rev3: '03.05.03', status: 'modified', change: 'MFA requirements strengthened', newOdps: ['MFA types'] },
        { rev2: '3.5.4', rev3: '03.05.04', status: 'modified', change: 'Replay-resistant authentication added' },
        { rev2: '3.5.5', rev3: '03.05.05', status: 'unchanged', change: 'Identifier management' },
        { rev2: '3.5.6', rev3: '03.05.06', status: 'unchanged', change: 'Identifier reuse prevention' },
        { rev2: '3.5.7', rev3: '03.05.07', status: 'modified', change: 'Password complexity enhanced', newOdps: ['password requirements'] },
        { rev2: '3.5.8', rev3: '03.05.08', status: 'modified', change: 'Password reuse restrictions', newOdps: ['reuse prohibition'] },
        { rev2: '3.5.9', rev3: '03.05.09', status: 'unchanged', change: 'Temporary passwords' },
        { rev2: '3.5.10', rev3: '03.05.10', status: 'modified', change: 'Cryptographic authenticator protection' },
        { rev2: '3.5.11', rev3: '03.05.11', status: 'unchanged', change: 'Obscured feedback' },
        { rev2: '3.6.1', rev3: '03.06.01', status: 'modified', change: 'Incident handling timeframes defined', newOdps: ['timeframes'] },
        { rev2: '3.6.2', rev3: '03.06.02', status: 'modified', change: 'Incident tracking content expanded', newOdps: ['tracking content'] },
        { rev2: '3.6.3', rev3: '03.06.03', status: 'unchanged', change: 'Incident response testing' },
        { rev2: '3.7.1', rev3: '03.07.01', status: 'unchanged', change: 'System maintenance' },
        { rev2: '3.7.2', rev3: '03.07.02', status: 'modified', change: 'Maintenance tool control enhanced', newOdps: ['tool approval'] },
        { rev2: '3.7.3', rev3: '03.07.03', status: 'unchanged', change: 'Equipment sanitization' },
        { rev2: '3.7.4', rev3: '03.07.04', status: 'unchanged', change: 'Diagnostic media inspection' },
        { rev2: '3.7.5', rev3: '03.07.05', status: 'modified', change: 'Nonlocal maintenance requirements enhanced' },
        { rev2: '3.7.6', rev3: '03.07.06', status: 'unchanged', change: 'Maintenance personnel supervision' },
        { rev2: '3.8.1', rev3: '03.08.01', status: 'modified', change: 'Media protection scope expanded', newOdps: ['media types'] },
        { rev2: '3.8.2', rev3: '03.08.02', status: 'unchanged', change: 'Media access restrictions' },
        { rev2: '3.8.3', rev3: '03.08.03', status: 'modified', change: 'Media sanitization enhanced' },
        { rev2: '3.8.4', rev3: '03.08.04', status: 'unchanged', change: 'Media marking' },
        { rev2: '3.8.5', rev3: '03.08.05', status: 'unchanged', change: 'Media accountability' },
        { rev2: '3.8.6', rev3: '03.08.06', status: 'modified', change: 'Portable storage encryption' },
        { rev2: '3.8.7', rev3: '03.08.07', status: 'unchanged', change: 'Removable media restrictions' },
        { rev2: '3.8.8', rev3: '03.08.08', status: 'unchanged', change: 'Shared system media' },
        { rev2: '3.8.9', rev3: '03.08.09', status: 'modified', change: 'Media encryption requirements', newOdps: ['encryption mechanisms'] },
        { rev2: '3.9.1', rev3: '03.09.01', status: 'unchanged', change: 'Personnel screening' },
        { rev2: '3.9.2', rev3: '03.09.02', status: 'unchanged', change: 'Personnel termination' },
        { rev2: '3.10.1', rev3: '03.10.01', status: 'modified', change: 'Physical access authorization', newOdps: ['access devices'] },
        { rev2: '3.10.2', rev3: '03.10.02', status: 'unchanged', change: 'Physical access protection' },
        { rev2: '3.10.3', rev3: '03.10.03', status: 'unchanged', change: 'Visitor escort' },
        { rev2: '3.10.4', rev3: '03.10.04', status: 'unchanged', change: 'Physical access logs' },
        { rev2: '3.10.5', rev3: '03.10.05', status: 'unchanged', change: 'Physical access devices' },
        { rev2: '3.10.6', rev3: '03.10.06', status: 'unchanged', change: 'Alternate work sites' },
        { rev2: '3.11.1', rev3: '03.11.01', status: 'modified', change: 'Risk assessment frequency defined', newOdps: ['assessment frequency'] },
        { rev2: '3.11.2', rev3: '03.11.02', status: 'modified', change: 'Vulnerability scanning frequency', newOdps: ['scan frequency'] },
        { rev2: '3.11.3', rev3: '03.11.03', status: 'unchanged', change: 'Vulnerability remediation' },
        { rev2: '3.12.1', rev3: '03.12.01', status: 'modified', change: 'Security assessment frequency', newOdps: ['assessment frequency'] },
        { rev2: '3.12.2', rev3: '03.12.02', status: 'unchanged', change: 'Assessment plans' },
        { rev2: '3.12.3', rev3: '03.12.03', status: 'modified', change: 'Continuous monitoring strategy', newOdps: ['monitoring approach'] },
        { rev2: '3.12.4', rev3: '03.12.04', status: 'unchanged', change: 'System security plans' },
        { rev2: '3.13.1', rev3: '03.13.01', status: 'modified', change: 'Boundary protection devices defined', newOdps: ['protection devices'] },
        { rev2: '3.13.2', rev3: '03.13.02', status: 'modified', change: 'Security engineering enhanced' },
        { rev2: '3.13.3', rev3: '03.13.03', status: 'unchanged', change: 'User functionality separation' },
        { rev2: '3.13.4', rev3: '03.13.04', status: 'unchanged', change: 'Shared resource separation' },
        { rev2: '3.13.5', rev3: '03.13.05', status: 'modified', change: 'Publicly accessible subnetworks' },
        { rev2: '3.13.6', rev3: '03.13.06', status: 'unchanged', change: 'Network communication deny-by-default' },
        { rev2: '3.13.7', rev3: '03.13.07', status: 'unchanged', change: 'Split tunneling prevention' },
        { rev2: '3.13.8', rev3: '03.13.08', status: 'modified', change: 'Mobile code restrictions', newOdps: ['mobile code policy'] },
        { rev2: '3.13.9', rev3: '03.13.09', status: 'unchanged', change: 'Voice over IP restrictions' },
        { rev2: '3.13.10', rev3: '03.13.10', status: 'unchanged', change: 'Cryptographic key establishment' },
        { rev2: '3.13.11', rev3: '03.13.11', status: 'modified', change: 'Cryptographic algorithms specified', newOdps: ['algorithms'] },
        { rev2: '3.13.12', rev3: '03.13.12', status: 'unchanged', change: 'Collaborative computing restrictions' },
        { rev2: '3.13.13', rev3: '03.13.13', status: 'unchanged', change: 'Mobile code technologies' },
        { rev2: '3.13.14', rev3: '03.13.14', status: 'unchanged', change: 'VoIP access controls' },
        { rev2: '3.13.15', rev3: '03.13.15', status: 'unchanged', change: 'Authenticity protection' },
        { rev2: '3.13.16', rev3: '03.13.16', status: 'unchanged', change: 'Data at rest protection' },
        { rev2: '3.14.1', rev3: '03.14.01', status: 'modified', change: 'Flaw remediation timeframes', newOdps: ['remediation timeline'] },
        { rev2: '3.14.2', rev3: '03.14.02', status: 'unchanged', change: 'Malicious code protection' },
        { rev2: '3.14.3', rev3: '03.14.03', status: 'modified', change: 'Security alert sources defined', newOdps: ['alert sources'] },
        { rev2: '3.14.4', rev3: '03.14.04', status: 'unchanged', change: 'Protection mechanism updates' },
        { rev2: '3.14.5', rev3: '03.14.05', status: 'unchanged', change: 'Security function verification' },
        { rev2: '3.14.6', rev3: '03.14.06', status: 'modified', change: 'Malicious code protection locations', newOdps: ['protection points'] },
        { rev2: '3.14.7', rev3: '03.14.07', status: 'modified', change: 'Malicious code protection updates', newOdps: ['update frequency'] }
    ],

    // New controls in Rev3 not in Rev2
    NEW_CONTROLS_REV3: [
        { id: '03.15.01', family: 'PL', title: 'Security Planning Policy and Procedures', description: 'Develop, document, and disseminate security planning policy' },
        { id: '03.15.02', family: 'PL', title: 'System Security Plan', description: 'Develop and maintain system security plan' },
        { id: '03.15.03', family: 'PL', title: 'Rules of Behavior', description: 'Establish rules of behavior for users' },
        { id: '03.16.01', family: 'SA', title: 'Supply Chain Risk Management Policy', description: 'Develop supply chain risk management policy' },
        { id: '03.16.02', family: 'SA', title: 'Acquisition Process', description: 'Include security requirements in acquisition process' },
        { id: '03.16.03', family: 'SA', title: 'Supply Chain Protection', description: 'Protect against supply chain threats' },
        { id: '03.17.01', family: 'SR', title: 'Supply Chain Risk Assessment', description: 'Assess supply chain risks' },
        { id: '03.17.02', family: 'SR', title: 'Acquisition Strategies', description: 'Employ acquisition strategies for supply chain protection' }
    ],

    init: function() {
        this.bindEvents();
        console.log('[Rev3Crosswalk] Initialized');
    },

    bindEvents: function() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#open-rev3-crosswalk-btn')) {
                this.showCrosswalkView();
            }
        });
    },

    showCrosswalkView: function() {
        const html = `
        <div class="modal-overlay crosswalk-modal" id="rev3-crosswalk-modal">
            <div class="modal-content modal-fullscreen">
                <div class="modal-header">
                    <div>
                        <h2>NIST 800-171A Rev2 → Rev3 Crosswalk</h2>
                        <span class="modal-subtitle">With DoD-Defined ODPs (2025)</span>
                    </div>
                    <button class="modal-close" onclick="document.getElementById('rev3-crosswalk-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${this.renderCrosswalkContent()}
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        this.attachCrosswalkEvents();
    },

    renderCrosswalkContent: function() {
        const stats = this.calculateStats();
        
        return `
        <div class="crosswalk-container">
            <div class="crosswalk-summary">
                <div class="summary-stat"><span class="stat-value">${stats.total}</span><span class="stat-label">Total Controls</span></div>
                <div class="summary-stat unchanged"><span class="stat-value">${stats.unchanged}</span><span class="stat-label">Unchanged</span></div>
                <div class="summary-stat modified"><span class="stat-value">${stats.modified}</span><span class="stat-label">Modified</span></div>
                <div class="summary-stat new"><span class="stat-value">${this.NEW_CONTROLS_REV3.length}</span><span class="stat-label">New in Rev3</span></div>
            </div>

            <div class="crosswalk-tabs">
                <button class="xwalk-tab active" data-tab="mapping" onclick="Rev3Crosswalk.switchTab('mapping')">Control Mapping</button>
                <button class="xwalk-tab" data-tab="odps" onclick="Rev3Crosswalk.switchTab('odps')">DoD ODPs</button>
                <button class="xwalk-tab" data-tab="new" onclick="Rev3Crosswalk.switchTab('new')">New Controls</button>
            </div>

            <div class="crosswalk-content" id="crosswalk-content">
                ${this.renderMappingTable()}
            </div>
        </div>`;
    },

    calculateStats: function() {
        const total = this.CONTROL_MAPPING.length;
        const unchanged = this.CONTROL_MAPPING.filter(c => c.status === 'unchanged').length;
        const modified = this.CONTROL_MAPPING.filter(c => c.status === 'modified').length;
        return { total, unchanged, modified };
    },

    switchTab: function(tab) {
        document.querySelectorAll('.xwalk-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        const content = document.getElementById('crosswalk-content');
        if (tab === 'mapping') content.innerHTML = this.renderMappingTable();
        else if (tab === 'odps') content.innerHTML = this.renderODPsTable();
        else if (tab === 'new') content.innerHTML = this.renderNewControls();
    },

    renderMappingTable: function() {
        const families = this.groupByFamily();
        
        return `
        <div class="mapping-filters">
            <select id="family-filter" onchange="Rev3Crosswalk.filterByFamily(this.value)">
                <option value="all">All Families</option>
                ${Object.keys(families).map(f => `<option value="${f}">${f}</option>`).join('')}
            </select>
            <select id="status-filter" onchange="Rev3Crosswalk.filterByStatus(this.value)">
                <option value="all">All Status</option>
                <option value="modified">Modified Only</option>
                <option value="unchanged">Unchanged Only</option>
            </select>
        </div>
        <div class="mapping-table-container">
            <table class="crosswalk-table" id="mapping-table">
                <thead>
                    <tr>
                        <th>Rev2 Control</th>
                        <th>Rev3 Control</th>
                        <th>Status</th>
                        <th>Changes</th>
                        <th>New ODPs</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.CONTROL_MAPPING.map(c => this.renderMappingRow(c)).join('')}
                </tbody>
            </table>
        </div>`;
    },

    renderMappingRow: function(control) {
        const statusClass = control.status === 'modified' ? 'status-modified' : 'status-unchanged';
        const odpList = control.newOdps ? control.newOdps.map(o => `<span class="odp-tag">${o}</span>`).join('') : '-';
        
        return `
        <tr class="mapping-row" data-family="${control.rev2.split('.')[1]}" data-status="${control.status}">
            <td><code>${control.rev2}</code></td>
            <td><code>${control.rev3}</code></td>
            <td><span class="status-badge ${statusClass}">${control.status}</span></td>
            <td class="change-desc">${control.change}</td>
            <td class="odp-cell">${odpList}</td>
        </tr>`;
    },

    groupByFamily: function() {
        const families = {};
        this.CONTROL_MAPPING.forEach(c => {
            const fam = c.rev2.split('.')[1];
            const famNames = { '1': 'AC', '2': 'AT', '3': 'AU', '4': 'CM', '5': 'IA', '6': 'IR', '7': 'MA', '8': 'MP', '9': 'PS', '10': 'PE', '11': 'RA', '12': 'CA', '13': 'SC', '14': 'SI' };
            const famName = famNames[fam] || fam;
            if (!families[famName]) families[famName] = [];
            families[famName].push(c);
        });
        return families;
    },

    filterByFamily: function(family) {
        const rows = document.querySelectorAll('.mapping-row');
        const famNum = { 'AC': '1', 'AT': '2', 'AU': '3', 'CM': '4', 'IA': '5', 'IR': '6', 'MA': '7', 'MP': '8', 'PS': '9', 'PE': '10', 'RA': '11', 'CA': '12', 'SC': '13', 'SI': '14' };
        rows.forEach(row => {
            if (family === 'all') row.style.display = '';
            else row.style.display = row.dataset.family === famNum[family] ? '' : 'none';
        });
    },

    filterByStatus: function(status) {
        const rows = document.querySelectorAll('.mapping-row');
        rows.forEach(row => {
            if (status === 'all') row.style.display = '';
            else row.style.display = row.dataset.status === status ? '' : 'none';
        });
    },

    renderODPsTable: function() {
        return `
        <div class="odps-container">
            <div class="odps-intro">
                <h3>DoD-Defined Organization-Defined Parameters (ODPs)</h3>
                <p>These parameters were defined by the DoD in 2025 to provide specific values for CMMC compliance. Organizations must implement these exact values unless a deviation is documented and approved.</p>
            </div>
            <div class="odps-grid">
                ${Object.entries(this.DOD_ODPS).map(([ctrl, data]) => `
                    <div class="odp-card">
                        <div class="odp-header">
                            <code>${ctrl}</code>
                            <span class="odp-name">${data.odp}</span>
                        </div>
                        <div class="odp-value">${data.value}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    renderNewControls: function() {
        return `
        <div class="new-controls-container">
            <div class="new-controls-intro">
                <h3>New Controls in NIST 800-171 Rev3</h3>
                <p>These controls were added in Revision 3 and are not present in Revision 2. Organizations transitioning to Rev3 must implement these additional requirements.</p>
            </div>
            <div class="new-controls-grid">
                ${this.NEW_CONTROLS_REV3.map(c => `
                    <div class="new-control-card">
                        <div class="control-header">
                            <code>${c.id}</code>
                            <span class="control-family">${c.family}</span>
                        </div>
                        <h4>${c.title}</h4>
                        <p>${c.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    attachCrosswalkEvents: function() {
        // Any additional event handling
    },

    // Export crosswalk data
    exportCrosswalk: function() {
        return {
            mapping: this.CONTROL_MAPPING,
            odps: this.DOD_ODPS,
            newControls: this.NEW_CONTROLS_REV3
        };
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => Rev3Crosswalk.init()) : Rev3Crosswalk.init();
}
if (typeof window !== 'undefined') window.Rev3Crosswalk = Rev3Crosswalk;
