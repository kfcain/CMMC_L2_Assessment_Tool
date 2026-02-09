// NIST 800-171A Rev2 to Rev3 Crosswalk Viewer
// Visual mapping with DoD-defined ODPs (2025)

const Rev3Crosswalk = {
    config: {
        version: "1.0.0"
    },

    // DoD-defined Organization-Defined Parameters (ODPs) - Official NIST SP 800-171 Rev 3 Values
    // Source: DoD CUI ODP Attachment A (2025)
    DOD_ODPS: {
        // 03.01.01 System Account Management
        '03.01.01': {
            title: 'System Account Management',
            relatedControls: ['AC-02', 'AC-02(03)', 'AC-02(05)', 'AC-02(13)'],
            odps: [
                { id: '03.01.01.f.02', param: 'inactive account time period', value: 'At most 90 days' },
                { id: '03.01.01.g.01', param: 'notify when accounts no longer required', value: '24 hours' },
                { id: '03.01.01.g.02', param: 'notify when users terminated/transferred', value: '24 hours' },
                { id: '03.01.01.g.03', param: 'notify when need-to-know changes', value: '24 hours' },
                { id: '03.01.01.h.01', param: 'logout after inactivity', value: 'At most 24 hours' },
                { id: '03.01.01.h.02', param: 'logout circumstances', value: 'Work period ends; for privileged users at minimum 4 hours' }
            ]
        },
        // 03.01.05 System Access Authorization
        '03.01.05': {
            title: 'System Access Authorization',
            relatedControls: ['AC-06', 'AC-06(01)', 'AC-06(07)', 'AU-09(04)'],
            odps: [
                { id: '03.01.05.b.01', param: 'security functions', value: 'Establishing system accounts and assigning privileges, configuring access authorizations, configuring settings for events to be audited, establishing vulnerability scanning parameters, establishing intrusion detection parameters, and managing audit information' },
                { id: '03.01.05.b.02', param: 'security-relevant information', value: 'As defined by organizational policy' },
                { id: '03.01.05.c', param: 'privilege review frequency', value: 'At least annually' }
            ]
        },
        // 03.01.06 Least Privilege
        '03.01.06': {
            title: 'Least Privilege',
            relatedControls: ['AC-06', 'AC-06(01)', 'AC-06(02)', 'AC-06(05)', 'AC-06(09)', 'AC-06(10)'],
            odps: [
                { id: '03.01.06.a', param: 'least privilege principle', value: 'Only authorized access necessary to accomplish assigned tasks' }
            ]
        },
        // 03.01.07 Unsuccessful Logon Attempts
        '03.01.07': {
            title: 'Unsuccessful Logon Attempts',
            relatedControls: ['AC-07'],
            odps: [
                { id: '03.01.07.a', param: 'consecutive invalid attempts', value: '3 consecutive failed attempts' },
                { id: '03.01.07.b', param: 'lockout duration', value: 'Minimum 15 minutes or until released by administrator' }
            ]
        },
        // 03.01.10 Session Lock
        '03.01.10': {
            title: 'Session Lock',
            relatedControls: ['AC-11', 'AC-11(01)'],
            odps: [
                { id: '03.01.10.a', param: 'inactivity period', value: '15 minutes' }
            ]
        },
        // 03.03.01 Event Logging
        '03.03.01': {
            title: 'Event Logging',
            relatedControls: ['AU-02', 'AU-03', 'AU-03(01)', 'AU-12'],
            odps: [
                { id: '03.03.01.a', param: 'auditable events', value: 'Successful and unsuccessful account logon events, account management events, object access, policy change, privilege use, system events, and application events' }
            ]
        },
        // 03.03.02 Audit Record Content
        '03.03.02': {
            title: 'Audit Record Content',
            relatedControls: ['AU-03', 'AU-03(01)'],
            odps: [
                { id: '03.03.02.a', param: 'audit record content', value: 'User identity, event type, date/time, success/failure, origination, and identity of affected objects' }
            ]
        },
        // 03.04.01 Baseline Configuration
        '03.04.01': {
            title: 'Baseline Configuration',
            relatedControls: ['CM-02', 'CM-02(07)', 'CM-06'],
            odps: [
                { id: '03.04.01.a', param: 'baseline components', value: 'Hardware, software, firmware versions, and network topology' }
            ]
        },
        // 03.04.06 Least Functionality
        '03.04.06': {
            title: 'Least Functionality',
            relatedControls: ['CM-07', 'CM-07(01)', 'CM-07(02)'],
            odps: [
                { id: '03.04.06.a', param: 'essential capabilities', value: 'Mission-critical functions as defined in system security plan' },
                { id: '03.04.06.b', param: 'prohibited software', value: 'Deny-by-default with approved software allowlist' }
            ]
        },
        // 03.05.03 Authenticator Management
        '03.05.03': {
            title: 'Authenticator Management',
            relatedControls: ['IA-05', 'IA-05(01)', 'IA-05(02)', 'IA-05(06)'],
            odps: [
                { id: '03.05.03.a', param: 'password complexity', value: 'Minimum 14 characters with complexity requirements' },
                { id: '03.05.03.b', param: 'password lifetime', value: 'Maximum 60 days' },
                { id: '03.05.03.c', param: 'password reuse', value: 'Cannot reuse last 24 passwords' }
            ]
        },
        // 03.05.04 Multi-Factor Authentication
        '03.05.04': {
            title: 'Multi-Factor Authentication',
            relatedControls: ['IA-02(01)', 'IA-02(02)', 'IA-02(06)', 'IA-02(08)'],
            odps: [
                { id: '03.05.04.a', param: 'MFA types', value: 'Something you know + something you have (hardware token, PIV, or FIDO2)' }
            ]
        },
        // 03.06.01 Incident Handling
        '03.06.01': {
            title: 'Incident Handling',
            relatedControls: ['IR-04', 'IR-04(01)', 'IR-05', 'IR-06'],
            odps: [
                { id: '03.06.01.a', param: 'detection timeframe', value: 'Within 1 hour of occurrence' },
                { id: '03.06.01.b', param: 'containment timeframe', value: 'Within 4 hours of detection' },
                { id: '03.06.01.c', param: 'reporting timeframe', value: 'Within 72 hours to DIBCAC' }
            ]
        },
        // 03.11.02 Vulnerability Monitoring and Scanning
        '03.11.02': {
            title: 'Vulnerability Monitoring and Scanning',
            relatedControls: ['RA-05', 'RA-05(02)', 'RA-05(05)', 'RA-05(11)'],
            odps: [
                { id: '03.11.02.a', param: 'network scan frequency', value: 'At least monthly' },
                { id: '03.11.02.b', param: 'application scan frequency', value: 'At least quarterly' }
            ]
        },
        // 03.12.01 Security Assessment
        '03.12.01': {
            title: 'Security Assessment',
            relatedControls: ['CA-02', 'CA-02(01)', 'CA-05', 'CA-07'],
            odps: [
                { id: '03.12.01.a', param: 'assessment frequency', value: 'At least annually' }
            ]
        },
        // 03.13.11 CUI Encryption
        '03.13.11': {
            title: 'CUI Encryption',
            relatedControls: ['SC-08', 'SC-08(01)', 'SC-13'],
            odps: [
                { id: '03.13.11.a', param: 'cryptographic algorithms', value: 'AES-256, RSA-2048+, SHA-256+, TLS 1.2+ (FIPS 140-2/140-3 validated)' }
            ]
        },
        // 03.14.01 Flaw Remediation
        '03.14.01': {
            title: 'Flaw Remediation',
            relatedControls: ['SI-02', 'SI-02(02)'],
            odps: [
                { id: '03.14.01.a', param: 'critical remediation', value: '15 calendar days' },
                { id: '03.14.01.b', param: 'high remediation', value: '30 calendar days' },
                { id: '03.14.01.c', param: 'medium remediation', value: '90 calendar days' },
                { id: '03.14.01.d', param: 'low remediation', value: '180 calendar days' }
            ]
        },
        // 03.14.06 Malicious Code Protection
        '03.14.06': {
            title: 'Malicious Code Protection',
            relatedControls: ['SI-03', 'SI-03(01)', 'SI-03(02)'],
            odps: [
                { id: '03.14.06.a', param: 'signature update frequency', value: 'At least daily' },
                { id: '03.14.06.b', param: 'scan frequency', value: 'At least weekly full scan' }
            ]
        }
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
        { id: '03.17.01', family: 'SR', title: 'Supply Chain Risk Management Plan', description: 'Develop, review, update, and protect a plan for managing supply chain risks' },
        { id: '03.17.02', family: 'SR', title: 'Acquisition Strategies, Tools, and Methods', description: 'Develop and implement acquisition strategies to identify, protect against, and mitigate supply chain risks' },
        { id: '03.17.03', family: 'SR', title: 'Supply Chain Requirements and Processes', description: 'Establish processes for identifying and addressing supply chain weaknesses and enforce security requirements' },
        { id: '03.04.12', family: 'CM', title: 'Software Usage Restrictions', description: 'Track, control, and verify the use of software and associated installation policies' },
        { id: '03.05.12', family: 'IA', title: 'Authenticator Management', description: 'Manage system authenticators by verifying identity and protecting authenticator content' },
        { id: '03.06.04', family: 'IR', title: 'Incident Response Training', description: 'Provide incident response training to system users' },
        { id: '03.06.05', family: 'IR', title: 'Incident Response Plan', description: 'Develop, review, update, and protect an incident response plan' },
        { id: '03.10.07', family: 'PE', title: 'Physical Access Control', description: 'Enforce physical access authorizations and maintain access audit logs' },
        { id: '03.10.08', family: 'PE', title: 'Access Control for Transmission', description: 'Control physical access to system distribution and transmission lines' },
        { id: '03.11.04', family: 'RA', title: 'Risk Response', description: 'Respond to findings from security assessments, monitoring, and audits' },
        { id: '03.12.05', family: 'CA', title: 'Information Exchange', description: 'Approve and manage the exchange of CUI between systems using exchange agreements' },
        { id: '03.14.08', family: 'SI', title: 'Information Management and Retention', description: 'Manage and retain CUI in accordance with applicable requirements' }
    ],

    // Family name lookup
    FAM_NAMES: { '1': 'AC', '2': 'AT', '3': 'AU', '4': 'CM', '5': 'IA', '6': 'IR', '7': 'MA', '8': 'MP', '9': 'PS', '10': 'PE', '11': 'RA', '12': 'CA', '13': 'SC', '14': 'SI' },
    FAM_NUMS: { 'AC': '1', 'AT': '2', 'AU': '3', 'CM': '4', 'IA': '5', 'IR': '6', 'MA': '7', 'MP': '8', 'PS': '9', 'PE': '10', 'RA': '11', 'CA': '12', 'SC': '13', 'SI': '14' },
    FAM_FULL: {
        'AC': 'Access Control', 'AT': 'Awareness & Training', 'AU': 'Audit & Accountability',
        'CM': 'Configuration Management', 'IA': 'Identification & Authentication', 'IR': 'Incident Response',
        'MA': 'Maintenance', 'MP': 'Media Protection', 'PE': 'Physical & Environmental Protection',
        'PS': 'Personnel Security', 'RA': 'Risk Assessment', 'CA': 'Security Assessment',
        'SC': 'System & Communications Protection', 'SI': 'System & Information Integrity',
        'PL': 'Planning', 'SA': 'System & Services Acquisition', 'SR': 'Supply Chain Risk Management'
    },

    // Current filter state
    _filter: { status: 'all', family: 'all', showOdps: true },

    init: function() {
        console.log('[Rev3Crosswalk] Initialized');
    },

    // ── Main unified render ──────────────────────────────────────────
    renderView: function() {
        const container = document.getElementById('rev3-crosswalk-content');
        if (!container) return;

        const stats = this.calculateStats();
        this._filter = { status: 'all', family: 'all', showOdps: true };

        // Build withdrawn lookup
        const withdrawnMap = {};
        if (typeof REV2_TO_REV3_MIGRATION !== 'undefined') {
            for (const [rev2Id, m] of Object.entries(REV2_TO_REV3_MIGRATION)) {
                if (m.changeType === 'withdrawn') {
                    if (!withdrawnMap[m.rev3Id]) withdrawnMap[m.rev3Id] = [];
                    withdrawnMap[m.rev3Id].push({ rev2Id, notes: m.notes });
                }
            }
        }

        container.innerHTML = `
            <!-- Sticky header: title + stats + filters -->
            <div class="xwu-header">
                <div class="xwu-title-row">
                    <div>
                        <h2>NIST 800-171 Rev 2 → Rev 3 Crosswalk</h2>
                        <p class="xwu-subtitle">Control mapping with DoD-Defined ODPs (2025)</p>
                    </div>
                </div>
                <div class="xwu-stats">
                    <div class="xwu-stat"><span class="xwu-stat-val">${stats.total}</span><span class="xwu-stat-lbl">Total</span></div>
                    <div class="xwu-stat xwu-stat-unchanged"><span class="xwu-stat-val">${stats.unchanged}</span><span class="xwu-stat-lbl">Unchanged</span></div>
                    <div class="xwu-stat xwu-stat-modified"><span class="xwu-stat-val">${stats.modified}</span><span class="xwu-stat-lbl">Modified</span></div>
                    <div class="xwu-stat xwu-stat-new"><span class="xwu-stat-val">${this.NEW_CONTROLS_REV3.length}</span><span class="xwu-stat-lbl">New in Rev 3</span></div>
                </div>
                <div class="xwu-filters">
                    <div class="xwu-chips" id="xwu-status-chips">
                        <button class="xwu-chip active" data-status="all">All</button>
                        <button class="xwu-chip" data-status="modified">Modified</button>
                        <button class="xwu-chip" data-status="unchanged">Unchanged</button>
                        <button class="xwu-chip" data-status="new">New in Rev 3</button>
                    </div>
                    <select id="xwu-family-filter" class="xwu-select">
                        <option value="all">All Families</option>
                        ${Object.entries(this.FAM_FULL).map(([code, name]) =>
                            `<option value="${code}">${code} — ${name}</option>`
                        ).join('')}
                    </select>
                    <label class="xwu-toggle"><input type="checkbox" id="xwu-show-odps" checked> Show ODPs</label>
                </div>
            </div>

            <!-- Rev2 → Rev3 mapping cards -->
            <section class="xwu-section" id="xwu-mapping-section">
                <div class="xwu-cards" id="xwu-mapping-cards">
                    ${this.CONTROL_MAPPING.map(c => this.renderCard(c, withdrawnMap)).join('')}
                </div>
            </section>

            <!-- New Controls in Rev3 -->
            <section class="xwu-section xwu-new-section" id="xwu-new-section">
                <div class="xwu-section-head">
                    <h3>New Controls Added in Rev 3</h3>
                    <span class="xwu-section-count">${this.NEW_CONTROLS_REV3.length} controls</span>
                </div>
                <p class="xwu-section-desc">These controls are new in Revision 3 and have no Rev 2 equivalent. Organizations transitioning must implement these additional requirements.</p>
                <div class="xwu-new-grid">
                    ${this.NEW_CONTROLS_REV3.map(c => `
                        <div class="xwu-new-card" data-family="${c.family}">
                            <div class="xwu-new-card-head">
                                <code>${c.id}</code>
                                <span class="xwu-fam-badge">${c.family}</span>
                            </div>
                            <h4>${c.title}</h4>
                            <p>${c.description}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- 800-53 → 171 Reference (collapsible) -->
            <section class="xwu-section xwu-ref-section" id="xwu-ref-section">
                <button class="xwu-collapse-btn" id="xwu-ref-toggle">
                    <svg class="xwu-collapse-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                    <h3>NIST 800-53 Rev 5 → 800-171 Rev 3 Reference</h3>
                    <span class="xwu-section-desc-inline">Upstream tailoring mapping</span>
                </button>
                <div class="xwu-ref-body" id="xwu-ref-body" style="display:none">
                    ${this.render53Section()}
                </div>
            </section>
        `;

        this.bindEvents();
    },

    calculateStats: function() {
        const total = this.CONTROL_MAPPING.length;
        const unchanged = this.CONTROL_MAPPING.filter(c => c.status === 'unchanged').length;
        const modified = this.CONTROL_MAPPING.filter(c => c.status === 'modified').length;
        return { total, unchanged, modified };
    },

    // ── Single mapping card ──────────────────────────────────────────
    renderCard: function(control, withdrawnMap) {
        const statusClass = control.status === 'modified' ? 'status-modified' : 'status-unchanged';
        const odpTags = control.newOdps ? control.newOdps.map(o => `<span class="xwu-odp-tag">${o}</span>`).join('') : '';
        const famNum = control.rev2.split('.')[1];

        // ODP detail rows
        const dodOdps = this.DOD_ODPS[control.rev3];
        const r3Odps = (typeof REV3_ODPS !== 'undefined') ? REV3_ODPS[control.rev3] : null;
        let odpHtml = '';
        if (dodOdps && dodOdps.odps && dodOdps.odps.length > 0) {
            odpHtml = `<div class="xwu-odp-detail">
                <div class="xwu-odp-title">${dodOdps.title} — DoD ODPs</div>
                ${dodOdps.odps.map(odp => `<div class="xwu-odp-row">
                    <code>${odp.id}</code>
                    <span class="xwu-odp-param">${odp.param}</span>
                    <span class="xwu-odp-val">${odp.value}</span>
                </div>`).join('')}
            </div>`;
        } else if (r3Odps && r3Odps.parameters && r3Odps.parameters.length > 0) {
            odpHtml = `<div class="xwu-odp-detail">
                ${r3Odps.parameters.map((p, i) => `<div class="xwu-odp-row">
                    <code>${control.rev3}[${i+1}]</code>
                    <span class="xwu-odp-param">${p.description}</span>
                    <span class="xwu-odp-val">${p.suggestedValue}</span>
                </div>`).join('')}
            </div>`;
        }

        // Consolidated controls
        const consolidated = withdrawnMap ? (withdrawnMap[control.rev3] || []) : [];
        let consolidatedHtml = '';
        if (consolidated.length > 0) {
            consolidatedHtml = `<div class="xwu-consolidated">
                <span class="xwu-consol-label">Consolidated from Rev 2:</span>
                ${consolidated.map(w => `<code title="${w.notes}">${w.rev2Id}</code>`).join('')}
            </div>`;
        }

        // Objective count
        let objCount = '';
        if (typeof REV3_FAMILIES !== 'undefined') {
            for (const fam of REV3_FAMILIES) {
                if (!fam.controls) continue;
                const ctrl = fam.controls.find(c => c.id === control.rev3);
                if (ctrl && ctrl.objectives) {
                    objCount = `<span class="xwu-obj-count">${ctrl.objectives.length} obj</span>`;
                    break;
                }
            }
        }

        // 800-53 related controls
        const relatedHtml = dodOdps ? `<span class="xwu-related">${dodOdps.relatedControls.map(rc => `<code>${rc}</code>`).join('')}</span>` : '';

        return `
        <div class="xwu-card" data-family="${famNum}" data-status="${control.status}">
            <div class="xwu-card-top">
                <div class="xwu-card-ids">
                    <code class="xwu-rev2">${control.rev2}</code>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <code class="xwu-rev3">${control.rev3}</code>
                    ${objCount}
                    ${relatedHtml}
                </div>
                <div class="xwu-card-badges">
                    <span class="xwu-status ${statusClass}">${control.status}</span>
                    ${odpTags}
                </div>
            </div>
            <div class="xwu-card-change">${control.change}</div>
            ${consolidatedHtml}
            ${odpHtml}
        </div>`;
    },

    // ── 800-53 → 171 collapsible reference ───────────────────────────
    render53Section: function() {
        if (typeof NIST_800_53_TO_171_MAPPING === 'undefined') {
            return `<p class="xwu-muted">800-53 to 171 mapping data not loaded. This data is lazy-loaded when the Crosswalk Visualizer view is opened.</p>`;
        }
        const grouped = {};
        for (const [ctrl, data] of Object.entries(NIST_800_53_TO_171_MAPPING)) {
            const fam = ctrl.split('-')[0];
            if (!grouped[fam]) grouped[fam] = [];
            grouped[fam].push({ control: ctrl, ...data });
        }
        return `
            <div class="xwu-ref-filter">
                <select id="xwu-53-family" class="xwu-select">
                    <option value="all">All Families</option>
                    ${Object.entries(this.FAM_FULL).map(([c, n]) => `<option value="${c}">${c} — ${n}</option>`).join('')}
                </select>
            </div>
            <div class="xwu-ref-grid" id="xwu-ref-grid">
                ${Object.entries(grouped).map(([fam, ctrls]) => `
                    <div class="xwu-ref-fam" data-family="${fam}">
                        <div class="xwu-ref-fam-head"><code>${fam}</code><span>${this.FAM_FULL[fam] || fam}</span><span class="xwu-ref-count">${ctrls.length}</span></div>
                        ${ctrls.map(c => {
                            const subs = c.subControls ? Object.entries(c.subControls).map(([sid, sd]) =>
                                `<div class="xwu-ref-sub"><code>${sid}</code><span>${sd.title}</span><code class="xwu-ref-171">${sd['171Rev3']}</code></div>`
                            ).join('') : '';
                            return `<div class="xwu-ref-card">
                                <div class="xwu-ref-card-head">
                                    <code>${c.control}</code>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    <code class="xwu-ref-171">${c['171Rev3']}</code>
                                    <span class="xwu-ref-tailoring xwu-ref-tailoring-${c.tailoring.toLowerCase()}">${c.tailoring}</span>
                                </div>
                                <div class="xwu-ref-titles"><span>${c.title}</span><span class="xwu-ref-arrow-sm">→</span><span>${c['171Title']}</span></div>
                                ${c.notes ? `<div class="xwu-ref-notes">${c.notes}</div>` : ''}
                                ${subs ? `<div class="xwu-ref-subs">${subs}</div>` : ''}
                            </div>`;
                        }).join('')}
                    </div>
                `).join('')}
            </div>`;
    },

    // ── Event binding ────────────────────────────────────────────────
    bindEvents: function() {
        // Status filter chips
        document.querySelectorAll('#xwu-status-chips .xwu-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('#xwu-status-chips .xwu-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this._filter.status = chip.dataset.status;
                this.applyFilters();
            });
        });
        // Family filter
        const famSel = document.getElementById('xwu-family-filter');
        if (famSel) famSel.addEventListener('change', () => { this._filter.family = famSel.value; this.applyFilters(); });
        // ODP toggle
        const odpTog = document.getElementById('xwu-show-odps');
        if (odpTog) odpTog.addEventListener('change', () => { this._filter.showOdps = odpTog.checked; this.applyFilters(); });
        // 800-53 reference collapse
        const refToggle = document.getElementById('xwu-ref-toggle');
        if (refToggle) refToggle.addEventListener('click', () => {
            const body = document.getElementById('xwu-ref-body');
            const icon = refToggle.querySelector('.xwu-collapse-icon');
            if (body) {
                const open = body.style.display !== 'none';
                body.style.display = open ? 'none' : '';
                if (icon) icon.style.transform = open ? '' : 'rotate(180deg)';
            }
        });
        // 800-53 family filter
        const ref53Sel = document.getElementById('xwu-53-family');
        if (ref53Sel) ref53Sel.addEventListener('change', () => {
            const val = ref53Sel.value;
            document.querySelectorAll('.xwu-ref-fam').forEach(g => {
                g.style.display = (val === 'all' || g.dataset.family === val) ? '' : 'none';
            });
        });
    },

    // ── Apply combined filters ───────────────────────────────────────
    applyFilters: function() {
        const { status, family, showOdps } = this._filter;
        const isNew = status === 'new';

        // Mapping cards
        document.querySelectorAll('.xwu-card').forEach(card => {
            if (isNew) { card.style.display = 'none'; return; }
            const statusMatch = status === 'all' || card.dataset.status === status;
            const famMatch = family === 'all' || card.dataset.family === this.FAM_NUMS[family];
            card.style.display = (statusMatch && famMatch) ? '' : 'none';
        });

        // Mapping section visibility
        const mappingSec = document.getElementById('xwu-mapping-section');
        if (mappingSec) mappingSec.style.display = isNew ? 'none' : '';

        // New controls section
        const newSec = document.getElementById('xwu-new-section');
        if (newSec) {
            if (status === 'modified' || status === 'unchanged') {
                newSec.style.display = 'none';
            } else {
                newSec.style.display = '';
                // Apply family filter to new control cards too
                document.querySelectorAll('.xwu-new-card').forEach(card => {
                    const famMatch = family === 'all' || card.dataset.family === family;
                    card.style.display = famMatch ? '' : 'none';
                });
            }
        }

        // ODP visibility
        document.querySelectorAll('.xwu-odp-detail').forEach(el => {
            el.style.display = showOdps ? '' : 'none';
        });
    },

    // ── Helpers ──────────────────────────────────────────────────────
    groupByFamily: function() {
        const families = {};
        this.CONTROL_MAPPING.forEach(c => {
            const fam = c.rev2.split('.')[1];
            const famName = this.FAM_NAMES[fam] || fam;
            if (!families[famName]) families[famName] = [];
            families[famName].push(c);
        });
        return families;
    },

    exportCrosswalk: function() {
        return { mapping: this.CONTROL_MAPPING, odps: this.DOD_ODPS, newControls: this.NEW_CONTROLS_REV3 };
    }
};

// Initialize
if (typeof document !== 'undefined') {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => Rev3Crosswalk.init()) : Rev3Crosswalk.init();
}
if (typeof window !== 'undefined') {
    window.Rev3Crosswalk = Rev3Crosswalk;
    console.log('[Rev3Crosswalk] Module registered on window. renderView:', typeof Rev3Crosswalk.renderView, 'CONTROL_MAPPING:', Rev3Crosswalk.CONTROL_MAPPING.length, 'items');
}
