// NIST SP 800-53 Rev 5 to SP 800-171 Rev 3 Official Mapping
// Source: sp800-171r3-ipd-cui-overlay.csv
// Tailoring Decisions: CUI = Applicable, NCO = Not Carried Over, NFO = Not Federally Oriented, FED = Federal Only

const NIST_800_53_TO_171_MAPPING = {
    // Access Control (AC) Family
    'AC-02': {
        title: 'Account Management',
        '171Rev3': '03.01.01',
        '171Title': 'Account Management',
        tailoring: 'CUI',
        subControls: {
            'AC-02(03)': { '171Rev3': '03.01.01f', title: 'Disable Accounts', tailoring: 'CUI' },
            'AC-02(05)': { '171Rev3': '03.01.23', title: 'Inactivity Logout', tailoring: 'CUI' },
            'AC-02(13)': { '171Rev3': '03.01.01g', title: 'Disable Accounts for High-risk Individuals', tailoring: 'CUI' }
        }
    },
    'AC-03': {
        title: 'Access Enforcement',
        '171Rev3': '03.01.02',
        '171Title': 'Access Enforcement',
        tailoring: 'CUI',
        notes: 'Tailored to address CUI instead of all information'
    },
    'AC-04': {
        title: 'Information Flow Enforcement',
        '171Rev3': '03.01.03',
        '171Title': 'Flow Enforcement',
        tailoring: 'CUI'
    },
    'AC-05': {
        title: 'Separation of Duties',
        '171Rev3': '03.01.04',
        '171Title': 'Separation of Duties',
        tailoring: 'CUI'
    },
    'AC-06': {
        title: 'Least Privilege',
        '171Rev3': '03.01.05',
        '171Title': 'Least Privilege',
        tailoring: 'CUI',
        subControls: {
            'AC-06(01)': { '171Rev3': '03.01.05b', title: 'Authorize Access to Security Functions', tailoring: 'CUI' },
            'AC-06(02)': { '171Rev3': '03.01.06b', title: 'Non-privileged Access for Nonsecurity Functions', tailoring: 'CUI' },
            'AC-06(05)': { '171Rev3': '03.01.06a', title: 'Privileged Accounts', tailoring: 'CUI' },
            'AC-06(07)': { '171Rev3': '03.01.05c', title: 'Review of User Privileges', tailoring: 'CUI' },
            'AC-06(09)': { '171Rev3': '03.01.07b', title: 'Log Use of Privileged Functions', tailoring: 'CUI' },
            'AC-06(10)': { '171Rev3': '03.01.07a', title: 'Prohibit Non-privileged Users from Executing Privileged Functions', tailoring: 'CUI' }
        }
    },
    'AC-07': {
        title: 'Unsuccessful Logon Attempts',
        '171Rev3': '03.01.08',
        '171Title': 'Unsuccessful Logon Attempts',
        tailoring: 'CUI'
    },
    'AC-08': {
        title: 'System Use Notification',
        '171Rev3': '03.01.09',
        '171Title': 'System Use Notification',
        tailoring: 'CUI',
        notes: 'Changed to CUI rules instead of federal requirements'
    },
    'AC-11': {
        title: 'Device Lock',
        '171Rev3': '03.01.10',
        '171Title': 'Device Lock',
        tailoring: 'CUI',
        subControls: {
            'AC-11(01)': { '171Rev3': '03.01.10c', title: 'Pattern-hiding Displays', tailoring: 'CUI' }
        }
    },
    'AC-12': {
        title: 'Session Termination',
        '171Rev3': '03.01.11',
        '171Title': 'Session Termination',
        tailoring: 'CUI'
    },
    'AC-17': {
        title: 'Remote Access',
        '171Rev3': '03.01.12',
        '171Title': 'Remote Access',
        tailoring: 'CUI',
        subControls: {
            'AC-17(01)': { '171Rev3': '03.01.12b', title: 'Monitoring and Control', tailoring: 'CUI' },
            'AC-17(02)': { '171Rev3': '03.01.12e', title: 'Protection of Confidentiality and Integrity Using Encryption', tailoring: 'CUI' },
            'AC-17(03)': { '171Rev3': '03.01.12c', title: 'Managed Access Control Points', tailoring: 'CUI' },
            'AC-17(04)': { '171Rev3': '03.01.12d', title: 'Privileged Commands and Access', tailoring: 'CUI' }
        }
    },
    'AC-18': {
        title: 'Wireless Access',
        '171Rev3': '03.01.16',
        '171Title': 'Wireless Access',
        tailoring: 'CUI',
        subControls: {
            'AC-18(01)': { '171Rev3': '03.01.16c', title: 'Authentication and Encryption', tailoring: 'CUI' },
            'AC-18(03)': { '171Rev3': '03.01.16d', title: 'Disable Wireless Networking', tailoring: 'CUI' }
        }
    },
    'AC-19': {
        title: 'Access Control for Mobile Devices',
        '171Rev3': '03.01.18',
        '171Title': 'Access Control for Mobile Devices',
        tailoring: 'CUI',
        subControls: {
            'AC-19(05)': { '171Rev3': '03.01.18c', title: 'Full Device or Container-based Encryption', tailoring: 'CUI' }
        }
    },
    'AC-20': {
        title: 'Use of External Systems',
        '171Rev3': '03.01.20',
        '171Title': 'Use of External Systems',
        tailoring: 'CUI',
        subControls: {
            'AC-20(01)': { '171Rev3': '03.01.21', title: 'Limits on Authorized Use', tailoring: 'CUI' },
            'AC-20(02)': { '171Rev3': '03.01.21b', title: 'Portable Storage Devices — Restricted Use', tailoring: 'CUI' }
        }
    },
    'AC-22': {
        title: 'Publicly Accessible Content',
        '171Rev3': '03.01.22',
        '171Title': 'Publicly Accessible Content',
        tailoring: 'CUI'
    },

    // Awareness and Training (AT) Family
    'AT-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'AT-02': {
        title: 'Literacy Training and Awareness',
        '171Rev3': '03.02.01',
        '171Title': 'Literacy Training and Awareness',
        tailoring: 'CUI',
        subControls: {
            'AT-02(02)': { '171Rev3': '03.02.03', title: 'Insider Threat', tailoring: 'CUI' },
            'AT-02(03)': { '171Rev3': '03.02.03', title: 'Social Engineering and Mining', tailoring: 'CUI' }
        }
    },
    'AT-03': {
        title: 'Role-based Training',
        '171Rev3': '03.02.02',
        '171Title': 'Role-Based Training',
        tailoring: 'CUI'
    },

    // Audit and Accountability (AU) Family
    'AU-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'AU-02': {
        title: 'Event Logging',
        '171Rev3': '03.03.01',
        '171Title': 'Event Logging',
        tailoring: 'CUI'
    },
    'AU-03': {
        title: 'Content of Audit Records',
        '171Rev3': '03.03.02',
        '171Title': 'Audit Record Content',
        tailoring: 'CUI',
        subControls: {
            'AU-03(01)': { '171Rev3': '03.03.02', title: 'Additional Audit Information', tailoring: 'CUI' }
        }
    },
    'AU-05': {
        title: 'Response to Audit Logging Process Failures',
        '171Rev3': '03.03.04',
        '171Title': 'Response to Audit Logging Process Failures',
        tailoring: 'CUI'
    },
    'AU-06': {
        title: 'Audit Record Review, Analysis, and Reporting',
        '171Rev3': '03.03.05',
        '171Title': 'Audit Record Review, Analysis, and Reporting',
        tailoring: 'CUI',
        subControls: {
            'AU-06(03)': { '171Rev3': '03.03.05c', title: 'Correlate Audit Record Repositories', tailoring: 'CUI' }
        }
    },
    'AU-07': {
        title: 'Audit Record Reduction and Report Generation',
        '171Rev3': '03.03.06',
        '171Title': 'Audit Record Reduction and Report Generation',
        tailoring: 'CUI'
    },
    'AU-08': {
        title: 'Time Stamps',
        '171Rev3': '03.03.07',
        '171Title': 'Time Stamps',
        tailoring: 'CUI'
    },
    'AU-09': {
        title: 'Protection of Audit Information',
        '171Rev3': '03.03.08',
        '171Title': 'Protection of Audit Information',
        tailoring: 'CUI',
        subControls: {
            'AU-09(04)': { '171Rev3': '03.03.09', title: 'Access by Subset of Privileged Users', tailoring: 'CUI' }
        }
    },
    'AU-11': {
        title: 'Audit Record Retention',
        '171Rev3': '03.03.03b',
        '171Title': 'Audit Records',
        tailoring: 'CUI'
    },
    'AU-12': {
        title: 'Audit Record Generation',
        '171Rev3': '03.03.03a',
        '171Title': 'Audit Records',
        tailoring: 'CUI'
    },

    // Configuration Management (CM) Family
    'CM-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'CM-02': {
        title: 'Baseline Configuration',
        '171Rev3': '03.04.01',
        '171Title': 'Baseline Configuration',
        tailoring: 'CUI',
        subControls: {
            'CM-02(07)': { '171Rev3': '03.04.01', title: 'Configure Systems and Components for High-Risk Areas', tailoring: 'CUI' }
        }
    },
    'CM-03': {
        title: 'Configuration Change Control',
        '171Rev3': '03.04.03',
        '171Title': 'Configuration Change Control',
        tailoring: 'CUI'
    },
    'CM-04': {
        title: 'Impact Analyses',
        '171Rev3': '03.04.04',
        '171Title': 'Impact Analyses',
        tailoring: 'CUI'
    },
    'CM-05': {
        title: 'Access Restrictions for Change',
        '171Rev3': '03.04.05',
        '171Title': 'Access Restrictions for Change',
        tailoring: 'CUI'
    },
    'CM-06': {
        title: 'Configuration Settings',
        '171Rev3': '03.04.02',
        '171Title': 'Configuration Settings',
        tailoring: 'CUI'
    },
    'CM-07': {
        title: 'Least Functionality',
        '171Rev3': '03.04.06',
        '171Title': 'Least Functionality',
        tailoring: 'CUI',
        subControls: {
            'CM-07(01)': { '171Rev3': '03.04.06', title: 'Periodic Review', tailoring: 'CUI' },
            'CM-07(02)': { '171Rev3': '03.04.08', title: 'Prevent Program Execution', tailoring: 'CUI' }
        }
    },
    'CM-08': {
        title: 'System Component Inventory',
        '171Rev3': '03.04.10',
        '171Title': 'System Component Inventory',
        tailoring: 'CUI',
        subControls: {
            'CM-08(01)': { '171Rev3': '03.04.10', title: 'Updates During Installation and Removal', tailoring: 'CUI' }
        }
    },

    // Identification and Authentication (IA) Family
    'IA-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'IA-02': {
        title: 'Identification and Authentication (Organizational Users)',
        '171Rev3': '03.05.01',
        '171Title': 'User Identification and Authentication',
        tailoring: 'CUI',
        subControls: {
            'IA-02(01)': { '171Rev3': '03.05.03', title: 'Multi-Factor Authentication to Privileged Accounts', tailoring: 'CUI' },
            'IA-02(02)': { '171Rev3': '03.05.03', title: 'Multi-Factor Authentication to Non-Privileged Accounts', tailoring: 'CUI' },
            'IA-02(06)': { '171Rev3': '03.05.03', title: 'Access to Accounts — Separate Device', tailoring: 'CUI' },
            'IA-02(08)': { '171Rev3': '03.05.04', title: 'Access to Accounts — Replay Resistant', tailoring: 'CUI' }
        }
    },
    'IA-03': {
        title: 'Device Identification and Authentication',
        '171Rev3': '03.05.02',
        '171Title': 'Device Identification and Authentication',
        tailoring: 'CUI'
    },
    'IA-04': {
        title: 'Identifier Management',
        '171Rev3': '03.05.05',
        '171Title': 'Identifier Management',
        tailoring: 'CUI'
    },
    'IA-05': {
        title: 'Authenticator Management',
        '171Rev3': '03.05.07',
        '171Title': 'Authenticator Management',
        tailoring: 'CUI',
        subControls: {
            'IA-05(01)': { '171Rev3': '03.05.07', title: 'Password-Based Authentication', tailoring: 'CUI' },
            'IA-05(02)': { '171Rev3': '03.05.08', title: 'PKI-Based Authentication', tailoring: 'CUI' },
            'IA-05(06)': { '171Rev3': '03.05.09', title: 'Protection of Authenticators', tailoring: 'CUI' }
        }
    },
    'IA-06': {
        title: 'Authentication Feedback',
        '171Rev3': '03.05.10',
        '171Title': 'Authentication Feedback',
        tailoring: 'CUI'
    },
    'IA-07': {
        title: 'Cryptographic Module Authentication',
        '171Rev3': '03.05.11',
        '171Title': 'Cryptographic Module Authentication',
        tailoring: 'CUI'
    },
    'IA-08': {
        title: 'Identification and Authentication (Non-Organizational Users)',
        '171Rev3': '03.05.06',
        '171Title': 'Non-Organizational User Identification and Authentication',
        tailoring: 'CUI'
    },
    'IA-11': {
        title: 'Re-authentication',
        '171Rev3': '03.05.12',
        '171Title': 'Re-authentication',
        tailoring: 'CUI'
    },

    // Incident Response (IR) Family
    'IR-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'IR-02': {
        title: 'Incident Response Training',
        '171Rev3': '03.06.03',
        '171Title': 'Incident Response Training',
        tailoring: 'CUI'
    },
    'IR-04': {
        title: 'Incident Handling',
        '171Rev3': '03.06.01',
        '171Title': 'Incident Handling',
        tailoring: 'CUI',
        subControls: {
            'IR-04(01)': { '171Rev3': '03.06.01', title: 'Automated Incident Handling Processes', tailoring: 'CUI' }
        }
    },
    'IR-05': {
        title: 'Incident Monitoring',
        '171Rev3': '03.06.02',
        '171Title': 'Incident Monitoring',
        tailoring: 'CUI'
    },
    'IR-06': {
        title: 'Incident Reporting',
        '171Rev3': '03.06.02',
        '171Title': 'Incident Reporting',
        tailoring: 'CUI'
    },

    // Maintenance (MA) Family
    'MA-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'MA-02': {
        title: 'Controlled Maintenance',
        '171Rev3': '03.07.01',
        '171Title': 'Controlled Maintenance',
        tailoring: 'CUI'
    },
    'MA-03': {
        title: 'Maintenance Tools',
        '171Rev3': '03.07.02',
        '171Title': 'Maintenance Tools',
        tailoring: 'CUI',
        subControls: {
            'MA-03(01)': { '171Rev3': '03.07.02', title: 'Inspect Tools', tailoring: 'CUI' },
            'MA-03(02)': { '171Rev3': '03.07.02', title: 'Inspect Media', tailoring: 'CUI' }
        }
    },
    'MA-04': {
        title: 'Nonlocal Maintenance',
        '171Rev3': '03.07.05',
        '171Title': 'Nonlocal Maintenance',
        tailoring: 'CUI'
    },
    'MA-05': {
        title: 'Maintenance Personnel',
        '171Rev3': '03.07.06',
        '171Title': 'Maintenance Personnel',
        tailoring: 'CUI'
    },

    // Media Protection (MP) Family
    'MP-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'MP-02': {
        title: 'Media Access',
        '171Rev3': '03.08.01',
        '171Title': 'Media Access',
        tailoring: 'CUI'
    },
    'MP-03': {
        title: 'Media Marking',
        '171Rev3': '03.08.02',
        '171Title': 'Media Marking',
        tailoring: 'CUI'
    },
    'MP-04': {
        title: 'Media Storage',
        '171Rev3': '03.08.03',
        '171Title': 'Media Storage',
        tailoring: 'CUI'
    },
    'MP-05': {
        title: 'Media Transport',
        '171Rev3': '03.08.04',
        '171Title': 'Media Transport',
        tailoring: 'CUI'
    },
    'MP-06': {
        title: 'Media Sanitization',
        '171Rev3': '03.08.05',
        '171Title': 'Media Sanitization',
        tailoring: 'CUI'
    },
    'MP-07': {
        title: 'Media Use',
        '171Rev3': '03.08.06',
        '171Title': 'Media Use',
        tailoring: 'CUI'
    },

    // Physical and Environmental Protection (PE) Family
    'PE-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'PE-02': {
        title: 'Physical Access Authorizations',
        '171Rev3': '03.10.01',
        '171Title': 'Physical Access Authorizations',
        tailoring: 'CUI'
    },
    'PE-03': {
        title: 'Physical Access Control',
        '171Rev3': '03.10.02',
        '171Title': 'Physical Access Control',
        tailoring: 'CUI'
    },
    'PE-05': {
        title: 'Access Control for Output Devices',
        '171Rev3': '03.10.05',
        '171Title': 'Access Control for Output Devices',
        tailoring: 'CUI'
    },
    'PE-06': {
        title: 'Monitoring Physical Access',
        '171Rev3': '03.10.03',
        '171Title': 'Monitoring Physical Access',
        tailoring: 'CUI'
    },

    // Risk Assessment (RA) Family
    'RA-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'RA-03': {
        title: 'Risk Assessment',
        '171Rev3': '03.11.01',
        '171Title': 'Risk Assessment',
        tailoring: 'CUI'
    },
    'RA-05': {
        title: 'Vulnerability Monitoring and Scanning',
        '171Rev3': '03.11.02',
        '171Title': 'Vulnerability Monitoring and Scanning',
        tailoring: 'CUI',
        subControls: {
            'RA-05(02)': { '171Rev3': '03.11.02', title: 'Update Vulnerabilities to Be Scanned', tailoring: 'CUI' },
            'RA-05(05)': { '171Rev3': '03.11.02', title: 'Privileged Access', tailoring: 'CUI' },
            'RA-05(11)': { '171Rev3': '03.11.02', title: 'Public Disclosure Program', tailoring: 'CUI' }
        }
    },

    // Security Assessment and Authorization (CA) Family
    'CA-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'CA-02': {
        title: 'Control Assessments',
        '171Rev3': '03.12.01',
        '171Title': 'Security Assessment',
        tailoring: 'CUI',
        subControls: {
            'CA-02(01)': { '171Rev3': '03.12.01', title: 'Independent Assessors', tailoring: 'CUI' }
        }
    },
    'CA-03': {
        title: 'Information Exchange',
        '171Rev3': '03.12.05',
        '171Title': 'Information Exchange',
        tailoring: 'CUI'
    },
    'CA-05': {
        title: 'Plan of Action and Milestones',
        '171Rev3': '03.12.02',
        '171Title': 'Plan of Action and Milestones',
        tailoring: 'CUI'
    },
    'CA-07': {
        title: 'Continuous Monitoring',
        '171Rev3': '03.12.03',
        '171Title': 'Continuous Monitoring',
        tailoring: 'CUI'
    },
    'CA-09': {
        title: 'Internal System Connections',
        '171Rev3': '03.12.06',
        '171Title': 'Internal System Connections',
        tailoring: 'CUI'
    },

    // System and Communications Protection (SC) Family
    'SC-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'SC-05': {
        title: 'Denial-of-Service Protection',
        '171Rev3': '03.13.01',
        '171Title': 'Denial-of-Service Protection',
        tailoring: 'CUI'
    },
    'SC-07': {
        title: 'Boundary Protection',
        '171Rev3': '03.13.05',
        '171Title': 'Boundary Protection',
        tailoring: 'CUI',
        subControls: {
            'SC-07(05)': { '171Rev3': '03.13.06', title: 'Deny by Default — Allow by Exception', tailoring: 'CUI' },
            'SC-07(07)': { '171Rev3': '03.13.12', title: 'Split Tunneling for Remote Devices', tailoring: 'CUI' }
        }
    },
    'SC-08': {
        title: 'Transmission Confidentiality and Integrity',
        '171Rev3': '03.13.08',
        '171Title': 'Transmission Confidentiality and Integrity',
        tailoring: 'CUI',
        subControls: {
            'SC-08(01)': { '171Rev3': '03.13.08', title: 'Cryptographic Protection', tailoring: 'CUI' }
        }
    },
    'SC-10': {
        title: 'Network Disconnect',
        '171Rev3': '03.13.09',
        '171Title': 'Network Disconnect',
        tailoring: 'CUI'
    },
    'SC-12': {
        title: 'Cryptographic Key Establishment and Management',
        '171Rev3': '03.13.10',
        '171Title': 'Cryptographic Key Management',
        tailoring: 'CUI'
    },
    'SC-13': {
        title: 'Cryptographic Protection',
        '171Rev3': '03.13.11',
        '171Title': 'Cryptographic Protection',
        tailoring: 'CUI'
    },
    'SC-15': {
        title: 'Collaborative Computing Devices and Applications',
        '171Rev3': '03.13.13',
        '171Title': 'Collaborative Computing Devices',
        tailoring: 'CUI'
    },
    'SC-28': {
        title: 'Protection of Information at Rest',
        '171Rev3': '03.13.16',
        '171Title': 'Protection of CUI at Rest',
        tailoring: 'CUI'
    },

    // System and Information Integrity (SI) Family
    'SI-01': {
        title: 'Policy and Procedures',
        '171Rev3': '03.15.01',
        '171Title': 'Policy and Procedures',
        tailoring: 'CUI'
    },
    'SI-02': {
        title: 'Flaw Remediation',
        '171Rev3': '03.14.01',
        '171Title': 'Flaw Remediation',
        tailoring: 'CUI',
        subControls: {
            'SI-02(02)': { '171Rev3': '03.14.01', title: 'Automated Flaw Remediation Status', tailoring: 'CUI' }
        }
    },
    'SI-03': {
        title: 'Malicious Code Protection',
        '171Rev3': '03.14.02',
        '171Title': 'Malicious Code Protection',
        tailoring: 'CUI',
        subControls: {
            'SI-03(01)': { '171Rev3': '03.14.02', title: 'Central Management', tailoring: 'CUI' },
            'SI-03(02)': { '171Rev3': '03.14.02', title: 'Automatic Updates', tailoring: 'CUI' }
        }
    },
    'SI-04': {
        title: 'System Monitoring',
        '171Rev3': '03.14.06',
        '171Title': 'System Monitoring',
        tailoring: 'CUI'
    },
    'SI-05': {
        title: 'Security Alerts, Advisories, and Directives',
        '171Rev3': '03.14.03',
        '171Title': 'Security Alerts and Advisories',
        tailoring: 'CUI'
    },
    'SI-07': {
        title: 'Software, Firmware, and Information Integrity',
        '171Rev3': '03.14.04',
        '171Title': 'System and Software Integrity',
        tailoring: 'CUI'
    }
};

// Helper function to get 171 Rev3 control from 800-53 control
function get171FromA53(control53) {
    const baseControl = control53.split('(')[0];
    const mapping = NIST_800_53_TO_171_MAPPING[baseControl];
    if (!mapping) return null;
    
    // Check if it's a sub-control
    if (control53.includes('(') && mapping.subControls && mapping.subControls[control53]) {
        return mapping.subControls[control53];
    }
    
    return mapping;
}

// Helper function to get all 800-53 controls that map to a 171 Rev3 control
function get53From171(control171) {
    const results = [];
    for (const [ctrl53, data] of Object.entries(NIST_800_53_TO_171_MAPPING)) {
        if (data['171Rev3'] === control171 || data['171Rev3'].startsWith(control171)) {
            results.push({ control: ctrl53, ...data });
        }
        if (data.subControls) {
            for (const [subCtrl, subData] of Object.entries(data.subControls)) {
                if (subData['171Rev3'] === control171 || subData['171Rev3'].startsWith(control171)) {
                    results.push({ control: subCtrl, ...subData });
                }
            }
        }
    }
    return results;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NIST_800_53_TO_171_MAPPING, get171FromA53, get53From171 };
}
