// Comprehensive Implementation Guidance - Part 5
// Final L1/L2 CMMC Assessment Objectives: SC (System & Communications Protection), SI (System & Information Integrity), SA (System & Services Acquisition)

const COMPREHENSIVE_GUIDANCE_PART5 = {
    objectives: {
        
        "SC.L2-3.13.1": {
            objective: "Monitor, control, and protect communications at the external boundaries and key internal boundaries of organizational systems.",
            summary: "Firewall, IDS/IPS, network segmentation, DMZ",
            cloud: {
                aws: { services: ["Security Groups", "Network ACLs", "WAF", "Network Firewall"], implementation: { steps: ["Configure Security Groups for stateful firewall", "Use Network ACLs for subnet-level filtering", "Deploy AWS WAF for application protection", "Use AWS Network Firewall for deep packet inspection", "Enable VPC Flow Logs", "Implement network segmentation with VPCs", "Monitor with GuardDuty"], cost_estimate: "$100-500/month", effort_hours: 16 }},
                azure: { services: ["NSG", "Firewall", "WAF", "DDoS Protection"], implementation: { steps: ["Configure NSGs for network filtering", "Deploy Azure Firewall for centralized protection", "Use Application Gateway WAF", "Enable DDoS Protection", "Enable NSG Flow Logs", "Implement network segmentation with VNets", "Monitor with Sentinel"], cost_estimate: "$200-800/month", effort_hours: 16 }},
                gcp: { services: ["Firewall Rules", "Cloud Armor", "Cloud IDS"], implementation: { steps: ["Configure VPC firewall rules", "Deploy Cloud Armor for DDoS protection", "Use Cloud IDS for intrusion detection", "Enable VPC Flow Logs", "Implement network segmentation", "Monitor with Security Command Center"], cost_estimate: "$150-600/month", effort_hours: 16 }}
            },
            network: {
                firewall: { implementation: { steps: ["Deploy next-gen firewall (Palo Alto, Fortinet)", "Configure firewall rules (deny by default)", "Enable IDS/IPS", "Create DMZ for public-facing systems", "Segment internal networks", "Monitor firewall logs"], cost_estimate: "$5000-20000 (hardware)", effort_hours: 24 }}
            },
            small_business: { approach: "Use cloud provider firewalls, configure security groups, enable logging, segment networks", cost_estimate: "$100-300/month", effort_hours: 12 }
        }
        
        ,
        
        "SC.L2-3.13.2": {
            objective: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
            summary: "DMZ, separate VPC/VNet for public systems, no direct access to internal",
            cloud: {
                aws: { implementation: { steps: ["Create separate VPC for public-facing systems", "Use public subnets for load balancers", "Use private subnets for application servers", "Use NAT Gateway for outbound traffic", "Implement VPC peering for controlled access", "Use Transit Gateway for hub-spoke architecture"], cost_estimate: "$50-200/month", effort_hours: 12 }},
                azure: { implementation: { steps: ["Create separate VNet for public-facing systems", "Use public subnets for Application Gateway", "Use private subnets for VMs", "Use NAT Gateway for outbound traffic", "Implement VNet peering for controlled access", "Use Azure Firewall between VNets"], cost_estimate: "$100-300/month", effort_hours: 12 }},
                gcp: { implementation: { steps: ["Create separate VPC for public-facing systems", "Use external load balancers in public subnet", "Use internal instances in private subnet", "Use Cloud NAT for outbound traffic", "Implement VPC peering for controlled access"], cost_estimate: "$50-200/month", effort_hours: 12 }}
            },
            network: {
                general: { implementation: { steps: ["Create DMZ network segment", "Place web servers in DMZ", "Use firewall between DMZ and internal network", "Allow only necessary ports from DMZ to internal", "Monitor DMZ traffic"], effort_hours: 16 }}
            },
            small_business: { approach: "Use separate cloud VPC/VNet for public systems, restrict access to internal systems", cost_estimate: "$50-150/month", effort_hours: 8 }
        }
        
        ,
        
        "SC.L2-3.13.3": {
            objective: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
            summary: "Default deny firewall rules, whitelist approach",
            cloud: {
                aws: { implementation: { steps: ["Configure Security Groups with no inbound rules by default", "Add specific allow rules only", "Use Network ACLs with explicit deny rules", "Document all firewall exceptions", "Review firewall rules quarterly"], cost_estimate: "$0", effort_hours: 8 }},
                azure: { implementation: { steps: ["Configure NSGs with deny all inbound by default", "Add specific allow rules only", "Use Azure Firewall with deny all policy", "Document all firewall exceptions", "Review firewall rules quarterly"], cost_estimate: "$0", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Configure VPC firewall with implicit deny", "Add specific allow rules only", "Document all firewall exceptions", "Review firewall rules quarterly"], cost_estimate: "$0", effort_hours: 8 }}
            },
            network: {
                general: { implementation: { steps: ["Configure firewall with default deny policy", "Create explicit allow rules for required traffic", "Document business justification for each rule", "Review firewall rules quarterly", "Remove unused rules"], effort_hours: 8 }}
            },
            small_business: { approach: "Configure cloud firewall with default deny, add only necessary allow rules, document exceptions", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "SC.L2-3.13.4": {
            objective: "Prevent unauthorized and unintended information transfer via shared system resources.",
            summary: "Resource isolation, prevent data leakage between tenants/users",
            cloud: {
                aws: { implementation: { steps: ["Use separate AWS accounts for different environments", "Enable AWS Organizations for account isolation", "Use IAM policies to prevent cross-account access", "Enable S3 Block Public Access", "Use VPC endpoints for private access", "Enable CloudTrail for all accounts"], cost_estimate: "$0-50/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use separate subscriptions for different environments", "Use Azure AD for identity isolation", "Use RBAC to prevent cross-subscription access", "Disable public access to storage", "Use Private Endpoints", "Enable Activity Log for all subscriptions"], cost_estimate: "$0-50/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use separate projects for different environments", "Use Cloud Identity for identity isolation", "Use IAM to prevent cross-project access", "Disable public access to storage", "Use Private Google Access"], cost_estimate: "$0-50/month", effort_hours: 8 }}
            },
            operating_system: {
                general: { implementation: { steps: ["Use separate user accounts for different users", "Implement file permissions to prevent unauthorized access", "Use encryption for sensitive data", "Clear memory after use", "Disable unnecessary shared resources"], effort_hours: 6 }}
            },
            small_business: { approach: "Use separate cloud accounts/subscriptions for different environments, implement access controls", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "SC.L2-3.13.5": {
            objective: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.",
            summary: "TLS 1.2+ for all communications, VPN, encrypted channels",
            cloud: {
                aws: { implementation: { steps: ["Enforce TLS 1.2+ for all services", "Use HTTPS for all web applications", "Enable encryption in transit for S3", "Use VPN or Direct Connect for hybrid connectivity", "Enable encryption for RDS connections", "Use AWS Certificate Manager for TLS certificates"], cost_estimate: "$10-100/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Enforce TLS 1.2+ for all services", "Use HTTPS for all web applications", "Enable encryption in transit for Storage", "Use VPN or ExpressRoute for hybrid connectivity", "Enable encryption for SQL connections", "Use Azure Key Vault for certificate management"], cost_estimate: "$10-100/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Enforce TLS 1.2+ for all services", "Use HTTPS for all web applications", "Enable encryption in transit for Cloud Storage", "Use Cloud VPN for hybrid connectivity", "Enable encryption for Cloud SQL connections"], cost_estimate: "$10-100/month", effort_hours: 8 }}
            },
            network: {
                general: { implementation: { steps: ["Deploy VPN for remote access", "Use TLS 1.2+ for all web applications", "Use SSH for remote administration", "Disable insecure protocols (Telnet, FTP, HTTP)", "Use encrypted email (S/MIME, PGP)"], effort_hours: 8 }}
            },
            small_business: { approach: "Use HTTPS for all websites, deploy VPN for remote access, enforce TLS 1.2+", cost_estimate: "$50-200/month", effort_hours: 6 }
        }
        
        ,
        
        "SC.L2-3.13.6": {
            objective: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
            summary: "Terminate network connections at end of session or after period of inactivity",
            cloud: {
                aws: { implementation: { steps: ["Configure session timeout for AWS SSO (2 hours)", "Use Systems Manager Session Manager with timeout", "Configure RDS connection timeout", "Set application session timeout (30 minutes)", "Monitor idle sessions"], cost_estimate: "$0", effort_hours: 6 }},
                azure: { implementation: { steps: ["Configure session timeout for Azure AD (2 hours)", "Use Conditional Access for session controls", "Configure SQL connection timeout", "Set application session timeout (30 minutes)", "Monitor idle sessions"], cost_estimate: "$0", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Configure session timeout for Cloud Identity", "Configure Cloud SQL connection timeout", "Set application session timeout (30 minutes)", "Monitor idle sessions"], cost_estimate: "$0", effort_hours: 6 }}
            },
            network: {
                general: { implementation: { steps: ["Configure VPN session timeout (2 hours)", "Configure SSH timeout (15 minutes idle)", "Configure RDP timeout (15 minutes idle)", "Configure firewall session timeout", "Monitor and terminate idle sessions"], effort_hours: 6 }}
            },
            small_business: { approach: "Configure VPN timeout (2 hours), set application session timeout (30 minutes), configure SSH/RDP timeout", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "SC.L2-3.13.7": {
            objective: "Use cryptographic mechanisms to protect the confidentiality of remote access sessions.",
            summary: "VPN with encryption, SSH, TLS for remote access",
            cloud: {
                aws: { implementation: { steps: ["Use AWS Client VPN with AES-256 encryption", "Use Systems Manager Session Manager (encrypted)", "Require TLS 1.2+ for all remote access", "Use AWS SSO with SAML", "Monitor remote access with CloudTrail"], cost_estimate: "$50-300/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use Azure VPN Gateway with IKEv2/IPsec", "Use Azure Bastion (encrypted)", "Require TLS 1.2+ for all remote access", "Use Azure AD with SAML", "Monitor remote access with Activity Log"], cost_estimate: "$140-400/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use Cloud VPN with IKEv2/IPsec", "Use Identity-Aware Proxy (encrypted)", "Require TLS 1.2+ for all remote access", "Monitor remote access with Cloud Audit Logs"], cost_estimate: "$50-200/month", effort_hours: 8 }}
            },
            network: {
                general: { implementation: { steps: ["Deploy VPN with AES-256 encryption", "Use SSH for remote administration", "Disable Telnet and unencrypted protocols", "Use RDP with NLA and TLS", "Monitor remote access logs"], effort_hours: 8 }}
            },
            small_business: { approach: "Deploy VPN with encryption, use SSH for Linux, use RDP with NLA for Windows", cost_estimate: "$50-200/month", effort_hours: 6 }
        }
        
        ,
        
        "SC.L2-3.13.8": {
            objective: "Implement cryptographic mechanisms to protect the confidentiality of CUI at rest.",
            summary: "Encrypt all CUI at rest - drives, databases, backups",
            cloud: {
                aws: { services: ["KMS", "S3", "EBS", "RDS"], implementation: { steps: ["Enable S3 encryption at rest (SSE-S3 or SSE-KMS)", "Enable EBS encryption for all volumes", "Enable RDS encryption", "Use AWS Backup with encryption", "Use KMS for key management", "Rotate encryption keys annually"], cost_estimate: "$10-100/month", effort_hours: 8 }},
                azure: { services: ["Key Vault", "Storage", "Disk Encryption"], implementation: { steps: ["Enable Storage encryption at rest", "Use Azure Disk Encryption for VMs", "Enable SQL Database encryption (TDE)", "Use Azure Backup with encryption", "Use Key Vault for key management", "Rotate encryption keys annually"], cost_estimate: "$10-100/month", effort_hours: 8 }},
                gcp: { services: ["KMS", "Cloud Storage", "Compute Engine"], implementation: { steps: ["Enable Cloud Storage encryption at rest (default)", "Enable disk encryption for Compute Engine", "Enable Cloud SQL encryption", "Use Cloud Backup with encryption", "Use Cloud KMS for key management", "Rotate encryption keys annually"], cost_estimate: "$10-100/month", effort_hours: 8 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Enable BitLocker on all drives", "Use TPM for key storage", "Store recovery keys in Azure AD", "Enable BitLocker for removable drives", "Monitor BitLocker status"], effort_hours: 6 }},
                linux: { implementation: { steps: ["Use LUKS for full disk encryption", "Encrypt data partitions", "Store keys securely", "Enable encryption for removable drives"], effort_hours: 6 }}
            },
            small_business: { approach: "Enable BitLocker on all Windows computers, enable cloud storage encryption, encrypt databases", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "SC.L2-3.13.9": {
            objective: "Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.",
            summary: "Session timeout, idle timeout, automatic logoff",
            implementation: {
                general: { steps: ["Configure session timeout (2 hours)", "Configure idle timeout (15 minutes)", "Implement automatic logoff", "Clear session data on timeout", "Notify users before timeout", "Document timeout policies"], effort_hours: 6 }
            },
            cloud: {
                aws: { implementation: { steps: ["Configure AWS SSO session duration (2 hours)", "Set application session timeout", "Configure RDS connection timeout", "Use Lambda to terminate idle sessions", "Monitor session duration"], cost_estimate: "$5-20/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Configure Azure AD session lifetime (2 hours)", "Use Conditional Access for session controls", "Set application session timeout", "Configure SQL connection timeout", "Monitor session duration"], cost_estimate: "$0-10/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Configure Cloud Identity session duration", "Set application session timeout", "Configure Cloud SQL connection timeout", "Monitor session duration"], cost_estimate: "$0-10/month", effort_hours: 6 }}
            },
            small_business: { approach: "Configure session timeout in applications (30 minutes), set VPN timeout (2 hours), configure SSH/RDP timeout (15 minutes)", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "SC.L2-3.13.10": {
            objective: "Establish and manage cryptographic keys for cryptography employed in organizational systems.",
            summary: "Key management, key rotation, key storage in HSM/KMS",
            cloud: {
                aws: { services: ["KMS", "CloudHSM"], implementation: { steps: ["Use AWS KMS for key management", "Create customer-managed keys (CMK)", "Enable automatic key rotation (annual)", "Use CloudHSM for FIPS 140-2 Level 3", "Implement key access policies", "Monitor key usage with CloudTrail", "Document key management procedures"], cost_estimate: "$1-50/month (KMS), $1000+/month (CloudHSM)", effort_hours: 12 }},
                azure: { services: ["Key Vault", "Managed HSM"], implementation: { steps: ["Use Azure Key Vault for key management", "Create customer-managed keys", "Enable automatic key rotation (annual)", "Use Managed HSM for FIPS 140-2 Level 3", "Implement key access policies", "Monitor key usage with Activity Log", "Document key management procedures"], cost_estimate: "$1-50/month (Key Vault), $1000+/month (Managed HSM)", effort_hours: 12 }},
                gcp: { services: ["Cloud KMS", "Cloud HSM"], implementation: { steps: ["Use Cloud KMS for key management", "Create customer-managed keys (CMEK)", "Enable automatic key rotation (annual)", "Use Cloud HSM for FIPS 140-2 Level 3", "Implement key access policies", "Monitor key usage with Cloud Audit Logs", "Document key management procedures"], cost_estimate: "$1-50/month (KMS), $1000+/month (HSM)", effort_hours: 12 }}
            },
            small_business: { approach: "Use cloud provider KMS for key management, enable automatic key rotation, document key management procedures", cost_estimate: "$1-20/month", effort_hours: 6 }
        }
        
        ,
        
        "SC.L2-3.13.11": {
            objective: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.",
            summary: "Use FIPS 140-2 validated encryption modules",
            cloud: {
                aws: { implementation: { steps: ["Use FIPS endpoints for AWS services", "Enable FIPS mode for S3", "Use CloudHSM for FIPS 140-2 Level 3", "Use FIPS-validated TLS libraries", "Document FIPS compliance", "Use AWS GovCloud for full FIPS compliance"], cost_estimate: "$0-1000+/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use Azure Government for FIPS compliance", "Enable FIPS mode for services", "Use Managed HSM for FIPS 140-2 Level 3", "Use FIPS-validated TLS libraries", "Document FIPS compliance"], cost_estimate: "$0-1000+/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use FIPS-validated encryption", "Use Cloud HSM for FIPS 140-2 Level 3", "Use FIPS-validated TLS libraries", "Document FIPS compliance"], cost_estimate: "$0-1000+/month", effort_hours: 8 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Enable FIPS mode via Group Policy", "Use BitLocker with FIPS compliance", "Use FIPS-validated cryptographic providers", "Test applications for FIPS compatibility"], effort_hours: 6 }},
                linux: { implementation: { steps: ["Use FIPS-validated OpenSSL", "Enable FIPS mode in kernel", "Use FIPS-validated LUKS encryption", "Test applications for FIPS compatibility"], effort_hours: 8 }}
            },
            small_business: { approach: "Use cloud provider FIPS-validated encryption, enable FIPS mode on Windows, document FIPS compliance", cost_estimate: "$0-100/month", effort_hours: 6 }
        }
        
        ,
        
        "SC.L2-3.13.12": {
            objective: "Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.",
            summary: "Disable webcam/microphone remote activation, LED indicator when in use",
            implementation: {
                general: { steps: ["Disable remote activation of webcams/microphones", "Use physical camera covers", "Require user consent for camera/microphone access", "Display indicator when camera/microphone active", "Disable camera/microphone when not needed", "Use Group Policy to control camera access"], effort_hours: 4 }
            },
            cloud: {
                aws: { implementation: { steps: ["Use WorkSpaces with camera/microphone controls", "Disable remote activation via policy", "Monitor device usage", "Document camera/microphone policies"], cost_estimate: "$0", effort_hours: 3 }},
                azure: { implementation: { steps: ["Use Azure Virtual Desktop with device controls", "Use Intune to control camera/microphone access", "Disable remote activation via policy", "Monitor device usage"], cost_estimate: "$0", effort_hours: 3 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Use Group Policy to disable camera/microphone", "Require user consent for camera access", "Use Windows privacy settings", "Disable camera when not in use"], effort_hours: 2 }},
                macos: { implementation: { steps: ["Use System Preferences to control camera/microphone", "Require user consent for camera access", "Monitor camera usage with LED indicator"], effort_hours: 2 }}
            },
            small_business: { approach: "Use physical camera covers, configure Windows privacy settings to require consent, disable camera when not needed", cost_estimate: "$10-50 (camera covers)", effort_hours: 2 }
        }
        
        ,
        
        "SC.L2-3.13.13": {
            objective: "Control and monitor the use of mobile code.",
            summary: "Restrict JavaScript, ActiveX, Java applets, control mobile code execution",
            implementation: {
                general: { steps: ["Define acceptable mobile code (JavaScript, Java)", "Restrict mobile code execution", "Use browser security settings", "Disable ActiveX controls", "Use Content Security Policy (CSP)", "Monitor mobile code usage", "Scan mobile code for malware"], effort_hours: 6 }
            },
            cloud: {
                aws: { implementation: { steps: ["Use WAF to filter mobile code", "Implement CSP headers in CloudFront", "Monitor mobile code with GuardDuty", "Use Lambda@Edge for code inspection"], cost_estimate: "$10-100/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Use Application Gateway WAF to filter mobile code", "Implement CSP headers", "Monitor mobile code with Defender", "Use Azure Front Door for code inspection"], cost_estimate: "$50-200/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Use Cloud Armor to filter mobile code", "Implement CSP headers in Cloud CDN", "Monitor mobile code with Security Command Center"], cost_estimate: "$10-100/month", effort_hours: 6 }}
            },
            small_business: { approach: "Configure browser security settings, disable ActiveX, implement Content Security Policy on websites", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "SC.L2-3.13.14": {
            objective: "Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.",
            summary: "Secure VoIP, encrypt VoIP traffic, monitor VoIP usage",
            implementation: {
                general: { steps: ["Use encrypted VoIP (SRTP)", "Implement VoIP firewall rules", "Use VoIP-aware firewall", "Monitor VoIP traffic", "Use strong authentication for VoIP", "Disable unnecessary VoIP features", "Document VoIP security policy"], effort_hours: 8 }
            },
            cloud: {
                aws: { implementation: { steps: ["Use Amazon Chime with encryption", "Configure Security Groups for VoIP ports", "Monitor VoIP traffic with VPC Flow Logs", "Use AWS Connect for secure contact center"], cost_estimate: "$50-500/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Use Microsoft Teams with encryption", "Configure NSGs for VoIP ports", "Monitor VoIP traffic with NSG Flow Logs", "Use Azure Communication Services"], cost_estimate: "$0-200/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Use Google Meet with encryption", "Configure firewall rules for VoIP", "Monitor VoIP traffic with VPC Flow Logs"], cost_estimate: "$0-100/month", effort_hours: 6 }}
            },
            small_business: { approach: "Use Microsoft Teams or Zoom with encryption, configure firewall for VoIP, monitor VoIP usage", cost_estimate: "$0-50/user/month", effort_hours: 4 }
        }
        
        ,
        
        "SC.L2-3.13.15": {
            objective: "Protect the authenticity of communications sessions.",
            summary: "Use digital signatures, certificates, prevent session hijacking",
            cloud: {
                aws: { implementation: { steps: ["Use TLS with certificate validation", "Use AWS Certificate Manager for certificates", "Implement mutual TLS (mTLS)", "Use session tokens with signatures", "Monitor for session hijacking with GuardDuty"], cost_estimate: "$0-50/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use TLS with certificate validation", "Use Azure Key Vault for certificates", "Implement mutual TLS (mTLS)", "Use session tokens with signatures", "Monitor for session hijacking with Sentinel"], cost_estimate: "$0-50/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use TLS with certificate validation", "Use Certificate Manager for certificates", "Implement mutual TLS (mTLS)", "Use session tokens with signatures", "Monitor for session hijacking"], cost_estimate: "$0-50/month", effort_hours: 8 }}
            },
            network: {
                general: { implementation: { steps: ["Use TLS 1.2+ with certificate validation", "Implement certificate pinning", "Use IPsec for VPN", "Monitor for man-in-the-middle attacks", "Use DNSSEC"], effort_hours: 8 }}
            },
            small_business: { approach: "Use HTTPS with valid certificates, implement certificate validation, use VPN with IPsec", cost_estimate: "$0-100/year (certificates)", effort_hours: 4 }
        }
        
        ,
        
        "SC.L2-3.13.16": {
            objective: "Protect the confidentiality of CUI at rest.",
            summary: "Encrypt all CUI at rest - same as SC.L2-3.13.8",
            cloud: {
                aws: { implementation: { steps: ["Enable encryption for all services storing CUI", "Use KMS for key management", "Enable S3/EBS/RDS encryption", "Encrypt backups", "Rotate keys annually"], cost_estimate: "$10-100/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Enable encryption for all services storing CUI", "Use Key Vault for key management", "Enable Storage/Disk/SQL encryption", "Encrypt backups", "Rotate keys annually"], cost_estimate: "$10-100/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Enable encryption for all services storing CUI", "Use Cloud KMS for key management", "Enable Storage/Disk/SQL encryption", "Encrypt backups", "Rotate keys annually"], cost_estimate: "$10-100/month", effort_hours: 6 }}
            },
            small_business: { approach: "Enable BitLocker, enable cloud storage encryption, encrypt databases, encrypt backups", cost_estimate: "$0", effort_hours: 4 }
        }
        
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_PART5 };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_PART5 = COMPREHENSIVE_GUIDANCE_PART5;
}
