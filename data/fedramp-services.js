// FedRAMP Authorized Services for CMMC Compliance
// Services listed are FedRAMP Moderate/High authorized (suitable for CUI)
// or FedRAMP 20x Low/LI-SaaS (for non-CUI supporting functions)

const FEDRAMP_SERVICES = {
    // Access Control (AC)
    "3.1.1": {
        services: [
            { name: "Microsoft Entra ID (Azure AD)", level: "High", category: "Identity Management", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Okta", level: "High", category: "Identity Management", url: "https://marketplace.fedramp.gov/products/FR1813056846" },
            { name: "CyberArk Privilege Cloud", level: "Moderate", category: "PAM", url: "https://marketplace.fedramp.gov/products/FR2015828504" },
            { name: "JumpCloud", level: "Moderate", category: "Directory Services", url: "https://marketplace.fedramp.gov/products/FR1904666857" }
        ]
    },
    "3.1.2": {
        services: [
            { name: "Microsoft Entra ID", level: "High", category: "RBAC", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Saviynt", level: "Moderate", category: "Identity Governance", url: "https://marketplace.fedramp.gov/products/FR1909054108" },
            { name: "SailPoint IdentityNow", level: "Moderate", category: "Identity Governance", url: "https://marketplace.fedramp.gov/products/FR1711051616" }
        ]
    },
    "3.1.3": {
        services: [
            { name: "Microsoft Purview DLP", level: "High", category: "Data Loss Prevention", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Netskope", level: "Moderate", category: "CASB/DLP", url: "https://marketplace.fedramp.gov/products/FR1711050869" },
            { name: "Zscaler Internet Access", level: "High", category: "Secure Web Gateway", url: "https://marketplace.fedramp.gov/products/FR1711050817" },
            { name: "Palo Alto Prisma Access", level: "High", category: "SASE", url: "https://marketplace.fedramp.gov/products/FR1904666853" }
        ]
    },
    "3.1.5": {
        services: [
            { name: "CyberArk Privilege Cloud", level: "Moderate", category: "PAM", url: "https://marketplace.fedramp.gov/products/FR2015828504" },
            { name: "BeyondTrust Privileged Remote Access", level: "Moderate", category: "PAM", url: "https://marketplace.fedramp.gov/products/FR1909054105" },
            { name: "Delinea Secret Server", level: "Moderate", category: "PAM", url: "https://marketplace.fedramp.gov/products/FR1904666851" }
        ]
    },
    "3.1.12": {
        services: [
            { name: "Zscaler Private Access", level: "High", category: "ZTNA", url: "https://marketplace.fedramp.gov/products/FR1904666855" },
            { name: "Cisco AnyConnect/Duo", level: "High", category: "VPN/MFA", url: "https://marketplace.fedramp.gov/products/FR1803015640" },
            { name: "Microsoft Azure VPN Gateway", level: "High", category: "VPN", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Palo Alto GlobalProtect", level: "High", category: "VPN", url: "https://marketplace.fedramp.gov/products/FR1904666853" }
        ]
    },
    "3.1.13": {
        services: [
            { name: "AWS GovCloud VPN", level: "High", category: "VPN", url: "https://marketplace.fedramp.gov/products/F1603047399" },
            { name: "Microsoft Azure VPN Gateway", level: "High", category: "VPN", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Cisco AnyConnect", level: "High", category: "VPN", url: "https://marketplace.fedramp.gov/products/FR1803015640" }
        ]
    },
    "3.1.16": {
        services: [
            { name: "Cisco Meraki", level: "Moderate", category: "Wireless Management", url: "https://marketplace.fedramp.gov/products/FR1711050866" },
            { name: "Aruba Central", level: "Moderate", category: "Wireless Management", url: "https://marketplace.fedramp.gov/products/FR1909054106" }
        ]
    },
    "3.1.18": {
        services: [
            { name: "Microsoft Intune", level: "High", category: "MDM/UEM", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "VMware Workspace ONE", level: "Moderate", category: "UEM", url: "https://marketplace.fedramp.gov/products/FR1711050868" },
            { name: "Jamf Pro", level: "Moderate", category: "Apple MDM", url: "https://marketplace.fedramp.gov/products/FR1904666854" }
        ]
    },

    // Awareness and Training (AT)
    "3.2.1": {
        services: [
            { name: "KnowBe4", level: "Moderate", category: "Security Awareness", url: "https://marketplace.fedramp.gov/products/FR1711050867" },
            { name: "Proofpoint Security Awareness", level: "Moderate", category: "Security Awareness", url: "https://marketplace.fedramp.gov/products/FR1904666856" },
            { name: "SANS Security Awareness", level: "Moderate", category: "Security Awareness", url: "https://marketplace.fedramp.gov/products/FR1909054107" }
        ]
    },
    "3.2.2": {
        services: [
            { name: "KnowBe4", level: "Moderate", category: "Phishing Simulation", url: "https://marketplace.fedramp.gov/products/FR1711050867" },
            { name: "Cofense PhishMe", level: "Moderate", category: "Phishing Simulation", url: "https://marketplace.fedramp.gov/products/FR1803015641" }
        ]
    },

    // Audit and Accountability (AU)
    "3.3.1": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1711050862" },
            { name: "Sumo Logic", level: "Moderate", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1711050864" },
            { name: "Elastic Cloud", level: "Moderate", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1909054109" }
        ]
    },
    "3.3.2": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1711050862" }
        ]
    },
    "3.3.5": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "SIEM/SOAR", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1711050862" },
            { name: "IBM QRadar on Cloud", level: "Moderate", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1803015642" }
        ]
    },

    // Configuration Management (CM)
    "3.4.1": {
        services: [
            { name: "ServiceNow CMDB", level: "High", category: "Asset Management", url: "https://marketplace.fedramp.gov/products/FR1711050861" },
            { name: "Qualys Asset Inventory", level: "High", category: "Asset Discovery", url: "https://marketplace.fedramp.gov/products/FR1711050863" },
            { name: "Axonius", level: "Moderate", category: "Asset Management", url: "https://marketplace.fedramp.gov/products/FR2015828505" }
        ]
    },
    "3.4.2": {
        services: [
            { name: "Tenable.io", level: "High", category: "Configuration Assessment", url: "https://marketplace.fedramp.gov/products/FR1711050865" },
            { name: "Qualys Cloud Platform", level: "High", category: "Compliance Scanning", url: "https://marketplace.fedramp.gov/products/FR1711050863" },
            { name: "Rapid7 InsightVM", level: "Moderate", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1711050870" }
        ]
    },
    "3.4.5": {
        services: [
            { name: "Microsoft Intune", level: "High", category: "Endpoint Management", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Tanium", level: "High", category: "Endpoint Management", url: "https://marketplace.fedramp.gov/products/FR1803015643" }
        ]
    },
    "3.4.8": {
        services: [
            { name: "Carbon Black Cloud", level: "Moderate", category: "App Control", url: "https://marketplace.fedramp.gov/products/FR1904666858" },
            { name: "Microsoft Defender for Endpoint", level: "High", category: "Endpoint Protection", url: "https://marketplace.fedramp.gov/products/F1607057910" }
        ]
    },

    // Identification and Authentication (IA)
    "3.5.1": {
        services: [
            { name: "Microsoft Entra ID", level: "High", category: "Identity Provider", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Okta", level: "High", category: "Identity Provider", url: "https://marketplace.fedramp.gov/products/FR1813056846" },
            { name: "Ping Identity", level: "Moderate", category: "Identity Provider", url: "https://marketplace.fedramp.gov/products/FR1711050871" }
        ]
    },
    "3.5.3": {
        services: [
            { name: "Microsoft Entra ID MFA", level: "High", category: "MFA", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Duo Security", level: "High", category: "MFA", url: "https://marketplace.fedramp.gov/products/FR1803015640" },
            { name: "Okta Verify", level: "High", category: "MFA", url: "https://marketplace.fedramp.gov/products/FR1813056846" },
            { name: "Yubico YubiKey", level: "Moderate", category: "Hardware Token", url: "https://marketplace.fedramp.gov/products/FR1909054110" }
        ]
    },
    "3.5.10": {
        services: [
            { name: "HashiCorp Vault", level: "Moderate", category: "Secrets Management", url: "https://marketplace.fedramp.gov/products/FR2015828506" },
            { name: "CyberArk Conjur", level: "Moderate", category: "Secrets Management", url: "https://marketplace.fedramp.gov/products/FR2015828504" },
            { name: "AWS Secrets Manager", level: "High", category: "Secrets Management", url: "https://marketplace.fedramp.gov/products/F1603047399" }
        ]
    },

    // Incident Response (IR)
    "3.6.1": {
        services: [
            { name: "ServiceNow Security Operations", level: "High", category: "SOAR", url: "https://marketplace.fedramp.gov/products/FR1711050861" },
            { name: "Palo Alto Cortex XSOAR", level: "Moderate", category: "SOAR", url: "https://marketplace.fedramp.gov/products/FR1904666859" },
            { name: "Splunk SOAR", level: "High", category: "SOAR", url: "https://marketplace.fedramp.gov/products/FR1711050862" }
        ]
    },
    "3.6.2": {
        services: [
            { name: "ServiceNow ITSM", level: "High", category: "Ticketing", url: "https://marketplace.fedramp.gov/products/FR1711050861" },
            { name: "Jira Service Management", level: "Moderate", category: "Ticketing", url: "https://marketplace.fedramp.gov/products/FR1711050872" },
            { name: "Zendesk", level: "Moderate", category: "Ticketing", url: "https://marketplace.fedramp.gov/products/FR1711050873" }
        ]
    },

    // Media Protection (MP)
    "3.8.6": {
        services: [
            { name: "Microsoft BitLocker", level: "High", category: "Encryption", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Symantec Endpoint Encryption", level: "Moderate", category: "Encryption", url: "https://marketplace.fedramp.gov/products/FR1711050874" }
        ]
    },
    "3.8.9": {
        services: [
            { name: "Veeam Backup for Microsoft 365", level: "Moderate", category: "Backup", url: "https://marketplace.fedramp.gov/products/FR1909054111" },
            { name: "Druva", level: "Moderate", category: "Backup", url: "https://marketplace.fedramp.gov/products/FR1803015644" },
            { name: "Commvault", level: "Moderate", category: "Backup", url: "https://marketplace.fedramp.gov/products/FR1711050875" }
        ]
    },

    // Risk Assessment (RA)
    "3.11.2": {
        services: [
            { name: "Tenable.io", level: "High", category: "Vulnerability Scanning", url: "https://marketplace.fedramp.gov/products/FR1711050865" },
            { name: "Qualys Cloud Platform", level: "High", category: "Vulnerability Scanning", url: "https://marketplace.fedramp.gov/products/FR1711050863" },
            { name: "Rapid7 InsightVM", level: "Moderate", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1711050870" },
            { name: "CrowdStrike Falcon Spotlight", level: "High", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1803015645" }
        ]
    },
    "3.11.3": {
        services: [
            { name: "Tenable.io", level: "High", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1711050865" },
            { name: "ServiceNow Vulnerability Response", level: "High", category: "Remediation Tracking", url: "https://marketplace.fedramp.gov/products/FR1711050861" }
        ]
    },

    // Security Assessment (CA)
    "3.12.1": {
        services: [
            { name: "Tenable.io", level: "High", category: "Security Assessment", url: "https://marketplace.fedramp.gov/products/FR1711050865" },
            { name: "Qualys Cloud Platform", level: "High", category: "Compliance Assessment", url: "https://marketplace.fedramp.gov/products/FR1711050863" }
        ]
    },
    "3.12.3": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "Continuous Monitoring", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "Continuous Monitoring", url: "https://marketplace.fedramp.gov/products/FR1711050862" },
            { name: "Datadog", level: "Moderate", category: "Monitoring", url: "https://marketplace.fedramp.gov/products/FR1711050876" }
        ]
    },

    // System and Communications Protection (SC)
    "3.13.1": {
        services: [
            { name: "Palo Alto Networks Firewall", level: "High", category: "Firewall", url: "https://marketplace.fedramp.gov/products/FR1904666853" },
            { name: "Zscaler Internet Access", level: "High", category: "Secure Web Gateway", url: "https://marketplace.fedramp.gov/products/FR1711050817" },
            { name: "Cisco Firepower", level: "High", category: "NGFW", url: "https://marketplace.fedramp.gov/products/FR1803015640" },
            { name: "Fortinet FortiGate", level: "Moderate", category: "NGFW", url: "https://marketplace.fedramp.gov/products/FR1711050877" }
        ]
    },
    "3.13.5": {
        services: [
            { name: "AWS GovCloud VPC", level: "High", category: "Network Isolation", url: "https://marketplace.fedramp.gov/products/F1603047399" },
            { name: "Microsoft Azure Virtual Network", level: "High", category: "Network Isolation", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Google Cloud VPC", level: "High", category: "Network Isolation", url: "https://marketplace.fedramp.gov/products/FR1711050878" }
        ]
    },
    "3.13.8": {
        services: [
            { name: "Cloudflare", level: "Moderate", category: "TLS/WAF", url: "https://marketplace.fedramp.gov/products/FR1711050879" },
            { name: "Akamai", level: "High", category: "CDN/WAF", url: "https://marketplace.fedramp.gov/products/FR1711050880" },
            { name: "AWS Certificate Manager", level: "High", category: "Certificate Management", url: "https://marketplace.fedramp.gov/products/F1603047399" }
        ]
    },
    "3.13.11": {
        services: [
            { name: "AWS GovCloud (FIPS endpoints)", level: "High", category: "FIPS Crypto", url: "https://marketplace.fedramp.gov/products/F1603047399" },
            { name: "Microsoft Azure (FIPS mode)", level: "High", category: "FIPS Crypto", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Thales CipherTrust", level: "Moderate", category: "Key Management", url: "https://marketplace.fedramp.gov/products/FR1909054112" }
        ]
    },
    "3.13.16": {
        services: [
            { name: "Microsoft Azure Disk Encryption", level: "High", category: "Encryption at Rest", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "AWS KMS", level: "High", category: "Key Management", url: "https://marketplace.fedramp.gov/products/F1603047399" },
            { name: "Vormetric Data Security", level: "Moderate", category: "Data Encryption", url: "https://marketplace.fedramp.gov/products/FR1711050881" }
        ]
    },

    // System and Information Integrity (SI)
    "3.14.1": {
        services: [
            { name: "Tenable.io", level: "High", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1711050865" },
            { name: "Qualys Cloud Platform", level: "High", category: "Vulnerability Management", url: "https://marketplace.fedramp.gov/products/FR1711050863" },
            { name: "WSUS/SCCM via Azure", level: "High", category: "Patch Management", url: "https://marketplace.fedramp.gov/products/F1607057910" }
        ]
    },
    "3.14.2": {
        services: [
            { name: "CrowdStrike Falcon", level: "High", category: "EDR", url: "https://marketplace.fedramp.gov/products/FR1803015645" },
            { name: "Microsoft Defender for Endpoint", level: "High", category: "EDR", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "SentinelOne", level: "Moderate", category: "EDR", url: "https://marketplace.fedramp.gov/products/FR1909054113" },
            { name: "Carbon Black Cloud", level: "Moderate", category: "EDR", url: "https://marketplace.fedramp.gov/products/FR1904666858" }
        ]
    },
    "3.14.3": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "Security Monitoring", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "Security Monitoring", url: "https://marketplace.fedramp.gov/products/FR1711050862" },
            { name: "CrowdStrike Falcon", level: "High", category: "Threat Detection", url: "https://marketplace.fedramp.gov/products/FR1803015645" }
        ]
    },
    "3.14.6": {
        services: [
            { name: "Microsoft Sentinel", level: "High", category: "SIEM/UEBA", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Splunk Cloud", level: "High", category: "SIEM", url: "https://marketplace.fedramp.gov/products/FR1711050862" },
            { name: "Exabeam", level: "Moderate", category: "UEBA", url: "https://marketplace.fedramp.gov/products/FR1909054114" }
        ]
    },
    "3.14.7": {
        services: [
            { name: "CrowdStrike Falcon", level: "High", category: "Threat Detection", url: "https://marketplace.fedramp.gov/products/FR1803015645" },
            { name: "Microsoft Defender XDR", level: "High", category: "XDR", url: "https://marketplace.fedramp.gov/products/F1607057910" },
            { name: "Palo Alto Cortex XDR", level: "Moderate", category: "XDR", url: "https://marketplace.fedramp.gov/products/FR1904666859" }
        ]
    }
};

// Helper function to get FedRAMP services for a control
function getFedRAMPServices(controlId) {
    // Strip objective suffix to get control ID (e.g., "3.1.1[a]" -> "3.1.1")
    const baseControlId = controlId.replace(/\[.*\]$/, '');
    return FEDRAMP_SERVICES[baseControlId] || null;
}
