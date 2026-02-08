// Comprehensive Implementation Guidance - Part 5
// Final L1/L2 CMMC Assessment Objectives: SC (System & Communications Protection), SI (System & Information Integrity), SA (System & Services Acquisition)

const COMPREHENSIVE_GUIDANCE_PART5 = {
    objectives: {
        
        "SC.L2-3.13.1": {
            objective: "Monitor, control, and protect communications at the external boundaries and key internal boundaries of organizational systems.",
            summary: "Firewall, IDS/IPS, network segmentation, DMZ",
            cloud: {
                aws: {"services":["Security Groups","Network ACLs","WAF","Network Firewall"],"implementation":{"steps":["Configure Security Groups for stateful firewall","Use Network ACLs for subnet-level filtering","Deploy AWS WAF for application protection","Use AWS Network Firewall for deep packet inspection","Enable VPC Flow Logs","Implement network segmentation with VPCs","Monitor with GuardDuty"],"cost_estimate":"$100-500/month","effort_hours":16}},
                azure: {"services":["NSG","Firewall","WAF","DDoS Protection"],"implementation":{"steps":["Configure NSGs for network filtering","Deploy Azure Firewall for centralized protection","Use Application Gateway WAF","Enable DDoS Protection","Enable NSG Flow Logs","Implement network segmentation with VNets","Monitor with Sentinel"],"cost_estimate":"$200-800/month","effort_hours":16}},
                gcp: {"services":["Firewall Rules","Cloud Armor","Cloud IDS"],"implementation":{"steps":["Configure VPC firewall rules","Deploy Cloud Armor for DDoS protection","Use Cloud IDS for intrusion detection","Enable VPC Flow Logs","Implement network segmentation","Monitor with Security Command Center"],"cost_estimate":"$150-600/month","effort_hours":16}}
            },
            network: {
                firewall: {"implementation":{"steps":["Deploy next-gen firewall (Palo Alto, Fortinet)","Configure firewall rules (deny by default)","Enable IDS/IPS","Create DMZ for public-facing systems","Segment internal networks","Monitor firewall logs"],"cost_estimate":"$5000-20000 (hardware)","effort_hours":24}}
            },
            small_business: {
                approach: "Use cloud provider firewalls, configure security groups, enable logging, segment networks",
                cost_estimate: "$100-300/month",
                effort_hours: 12
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.2": {
            objective: "Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.",
            summary: "DMZ, separate VPC/VNet for public systems, no direct access to internal",
            cloud: {
                aws: {"implementation":{"steps":["Create separate VPC for public-facing systems","Use public subnets for load balancers","Use private subnets for application servers","Use NAT Gateway for outbound traffic","Implement VPC peering for controlled access","Use Transit Gateway for hub-spoke architecture"],"cost_estimate":"$50-200/month","effort_hours":12}},
                azure: {"implementation":{"steps":["Create separate VNet for public-facing systems","Use public subnets for Application Gateway","Use private subnets for VMs","Use NAT Gateway for outbound traffic","Implement VNet peering for controlled access","Use Azure Firewall between VNets"],"cost_estimate":"$100-300/month","effort_hours":12}},
                gcp: {"implementation":{"steps":["Create separate VPC for public-facing systems","Use external load balancers in public subnet","Use internal instances in private subnet","Use Cloud NAT for outbound traffic","Implement VPC peering for controlled access"],"cost_estimate":"$50-200/month","effort_hours":12}}
            },
            network: {
                general: {"implementation":{"steps":["Create DMZ network segment","Place web servers in DMZ","Use firewall between DMZ and internal network","Allow only necessary ports from DMZ to internal","Monitor DMZ traffic"],"effort_hours":16}}
            },
            small_business: {
                approach: "Use separate cloud VPC/VNet for public systems, restrict access to internal systems",
                cost_estimate: "$50-150/month",
                effort_hours: 8
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.3": {
            objective: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
            summary: "Default deny firewall rules, whitelist approach",
            cloud: {
                aws: {"implementation":{"steps":["Configure Security Groups with no inbound rules by default","Add specific allow rules only","Use Network ACLs with explicit deny rules","Document all firewall exceptions","Review firewall rules quarterly"],"cost_estimate":"$0","effort_hours":8}},
                azure: {"implementation":{"steps":["Configure NSGs with deny all inbound by default","Add specific allow rules only","Use Azure Firewall with deny all policy","Document all firewall exceptions","Review firewall rules quarterly"],"cost_estimate":"$0","effort_hours":8}},
                gcp: {"implementation":{"steps":["Configure VPC firewall with implicit deny","Add specific allow rules only","Document all firewall exceptions","Review firewall rules quarterly"],"cost_estimate":"$0","effort_hours":8}}
            },
            network: {
                general: {"implementation":{"steps":["Configure firewall with default deny policy","Create explicit allow rules for required traffic","Document business justification for each rule","Review firewall rules quarterly","Remove unused rules"],"effort_hours":8}}
            },
            small_business: {
                approach: "Configure cloud firewall with default deny, add only necessary allow rules, document exceptions",
                cost_estimate: "$0",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.4": {
            objective: "Prevent unauthorized and unintended information transfer via shared system resources.",
            summary: "Resource isolation, prevent data leakage between tenants/users",
            cloud: {
                aws: {"implementation":{"steps":["Use separate AWS accounts for different environments","Enable AWS Organizations for account isolation","Use IAM policies to prevent cross-account access","Enable S3 Block Public Access","Use VPC endpoints for private access","Enable CloudTrail for all accounts"],"cost_estimate":"$0-50/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use separate subscriptions for different environments","Use Entra ID for identity isolation","Use RBAC to prevent cross-subscription access","Disable public access to storage","Use Private Endpoints","Enable Activity Log for all subscriptions"],"cost_estimate":"$0-50/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use separate projects for different environments","Use Cloud Identity for identity isolation","Use IAM to prevent cross-project access","Disable public access to storage","Use Private Google Access"],"cost_estimate":"$0-50/month","effort_hours":8}}
            },
            operating_system: {
                general: {"implementation":{"steps":["Use separate user accounts for different users","Implement file permissions to prevent unauthorized access","Use encryption for sensitive data","Clear memory after use","Disable unnecessary shared resources"],"effort_hours":6}}
            },
            small_business: {
                approach: "Use separate cloud accounts/subscriptions for different environments, implement access controls",
                cost_estimate: "$0",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.5": {
            objective: "Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.",
            summary: "TLS 1.2+ for all communications, VPN, encrypted channels",
            cloud: {
                aws: {"implementation":{"steps":["Enforce TLS 1.2+ for all services","Use HTTPS for all web applications","Enable encryption in transit for S3","Use VPN or Direct Connect for hybrid connectivity","Enable encryption for RDS connections","Use AWS Certificate Manager for TLS certificates"],"cost_estimate":"$10-100/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Enforce TLS 1.2+ for all services","Use HTTPS for all web applications","Enable encryption in transit for Storage","Use VPN or ExpressRoute for hybrid connectivity","Enable encryption for SQL connections","Use Azure Key Vault for certificate management"],"cost_estimate":"$10-100/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Enforce TLS 1.2+ for all services","Use HTTPS for all web applications","Enable encryption in transit for Cloud Storage","Use Cloud VPN for hybrid connectivity","Enable encryption for Cloud SQL connections"],"cost_estimate":"$10-100/month","effort_hours":8}}
            },
            network: {
                general: {"implementation":{"steps":["Deploy VPN for remote access","Use TLS 1.2+ for all web applications","Use SSH for remote administration","Disable insecure protocols (Telnet, FTP, HTTP)","Use encrypted email (S/MIME, PGP)"],"effort_hours":8}}
            },
            small_business: {
                approach: "Use HTTPS for all websites, deploy VPN for remote access, enforce TLS 1.2+",
                cost_estimate: "$50-200/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.6": {
            objective: "Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).",
            summary: "Terminate network connections at end of session or after period of inactivity",
            cloud: {
                aws: {"implementation":{"steps":["Configure session timeout for AWS SSO (2 hours)","Use Systems Manager Session Manager with timeout","Configure RDS connection timeout","Set application session timeout (30 minutes)","Monitor idle sessions"],"cost_estimate":"$0","effort_hours":6}},
                azure: {"implementation":{"steps":["Configure session timeout for Entra ID (2 hours)","Use Conditional Access for session controls","Configure SQL connection timeout","Set application session timeout (30 minutes)","Monitor idle sessions"],"cost_estimate":"$0","effort_hours":6}},
                gcp: {"implementation":{"steps":["Configure session timeout for Cloud Identity","Configure Cloud SQL connection timeout","Set application session timeout (30 minutes)","Monitor idle sessions"],"cost_estimate":"$0","effort_hours":6}}
            },
            network: {
                general: {"implementation":{"steps":["Configure VPN session timeout (2 hours)","Configure SSH timeout (15 minutes idle)","Configure RDP timeout (15 minutes idle)","Configure firewall session timeout","Monitor and terminate idle sessions"],"effort_hours":6}}
            },
            small_business: {
                approach: "Configure VPN timeout (2 hours), set application session timeout (30 minutes), configure SSH/RDP timeout",
                cost_estimate: "$0",
                effort_hours: 3
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.7": {
            objective: "Use cryptographic mechanisms to protect the confidentiality of remote access sessions.",
            summary: "VPN with encryption, SSH, TLS for remote access",
            cloud: {
                aws: {"implementation":{"steps":["Use AWS Client VPN with AES-256 encryption","Use Systems Manager Session Manager (encrypted)","Require TLS 1.2+ for all remote access","Use AWS SSO with SAML","Monitor remote access with CloudTrail"],"cost_estimate":"$50-300/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use Azure VPN Gateway with IKEv2/IPsec","Use Azure Bastion (encrypted)","Require TLS 1.2+ for all remote access","Use Entra ID with SAML","Monitor remote access with Activity Log"],"cost_estimate":"$140-400/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use Cloud VPN with IKEv2/IPsec","Use Identity-Aware Proxy (encrypted)","Require TLS 1.2+ for all remote access","Monitor remote access with Cloud Audit Logs"],"cost_estimate":"$50-200/month","effort_hours":8}}
            },
            network: {
                general: {"implementation":{"steps":["Deploy VPN with AES-256 encryption","Use SSH for remote administration","Disable Telnet and unencrypted protocols","Use RDP with NLA and TLS","Monitor remote access logs"],"effort_hours":8}}
            },
            small_business: {
                approach: "Deploy VPN with encryption, use SSH for Linux, use RDP with NLA for Windows",
                cost_estimate: "$50-200/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.8": {
            objective: "Implement cryptographic mechanisms to protect the confidentiality of CUI at rest.",
            summary: "Encrypt all CUI at rest - drives, databases, backups",
            cloud: {
                aws: {"services":["KMS","S3","EBS","RDS"],"implementation":{"steps":["Enable S3 encryption at rest (SSE-S3 or SSE-KMS)","Enable EBS encryption for all volumes","Enable RDS encryption","Use AWS Backup with encryption","Use KMS for key management","Rotate encryption keys annually"],"cost_estimate":"$10-100/month","effort_hours":8}},
                azure: {"services":["Key Vault","Storage","Disk Encryption"],"implementation":{"steps":["Enable Storage encryption at rest","Use Azure Disk Encryption for VMs","Enable SQL Database encryption (TDE)","Use Azure Backup with encryption","Use Key Vault for key management","Rotate encryption keys annually"],"cost_estimate":"$10-100/month","effort_hours":8}},
                gcp: {"services":["KMS","Cloud Storage","Compute Engine"],"implementation":{"steps":["Enable Cloud Storage encryption at rest (default)","Enable disk encryption for Compute Engine","Enable Cloud SQL encryption","Use Cloud Backup with encryption","Use Cloud KMS for key management","Rotate encryption keys annually"],"cost_estimate":"$10-100/month","effort_hours":8}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable BitLocker on all drives","Use TPM for key storage","Store recovery keys in Entra ID","Enable BitLocker for removable drives","Monitor BitLocker status"],"effort_hours":6}},
                linux: {"implementation":{"steps":["Use LUKS for full disk encryption","Encrypt data partitions","Store keys securely","Enable encryption for removable drives"],"effort_hours":6}}
            },
            small_business: {
                approach: "Enable BitLocker on all Windows computers, enable cloud storage encryption, encrypt databases",
                cost_estimate: "$0",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.9": {
            objective: "Terminate network connections associated with communications sessions at the end of the sessions or after a defined period of inactivity.",
            summary: "Session timeout, idle timeout, automatic logoff",
            implementation: {
                general: {"steps":["Configure session timeout (2 hours)","Configure idle timeout (15 minutes)","Implement automatic logoff","Clear session data on timeout","Notify users before timeout","Document timeout policies"],"effort_hours":6}
            },
            cloud: {
                aws: {"implementation":{"steps":["Configure AWS SSO session duration (2 hours)","Set application session timeout","Configure RDS connection timeout","Use Lambda to terminate idle sessions","Monitor session duration"],"cost_estimate":"$5-20/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Configure Entra ID session lifetime (2 hours)","Use Conditional Access for session controls","Set application session timeout","Configure SQL connection timeout","Monitor session duration"],"cost_estimate":"$0-10/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Configure Cloud Identity session duration","Set application session timeout","Configure Cloud SQL connection timeout","Monitor session duration"],"cost_estimate":"$0-10/month","effort_hours":6}}
            },
            small_business: {
                approach: "Configure session timeout in applications (30 minutes), set VPN timeout (2 hours), configure SSH/RDP timeout (15 minutes)",
                cost_estimate: "$0",
                effort_hours: 3
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.10": {
            objective: "Establish and manage cryptographic keys for cryptography employed in organizational systems.",
            summary: "Key management, key rotation, key storage in HSM/KMS",
            cloud: {
                aws: {"services":["KMS","CloudHSM"],"implementation":{"steps":["Use AWS KMS for key management","Create customer-managed keys (CMK)","Enable automatic key rotation (annual)","Use CloudHSM for FIPS 140-2 Level 3","Implement key access policies","Monitor key usage with CloudTrail","Document key management procedures"],"cost_estimate":"$1-50/month (KMS), $1000+/month (CloudHSM)","effort_hours":12}},
                azure: {"services":["Key Vault","Managed HSM"],"implementation":{"steps":["Use Azure Key Vault for key management","Create customer-managed keys","Enable automatic key rotation (annual)","Use Managed HSM for FIPS 140-2 Level 3","Implement key access policies","Monitor key usage with Activity Log","Document key management procedures"],"cost_estimate":"$1-50/month (Key Vault), $1000+/month (Managed HSM)","effort_hours":12}},
                gcp: {"services":["Cloud KMS","Cloud HSM"],"implementation":{"steps":["Use Cloud KMS for key management","Create customer-managed keys (CMEK)","Enable automatic key rotation (annual)","Use Cloud HSM for FIPS 140-2 Level 3","Implement key access policies","Monitor key usage with Cloud Audit Logs","Document key management procedures"],"cost_estimate":"$1-50/month (KMS), $1000+/month (HSM)","effort_hours":12}}
            },
            small_business: {
                approach: "Use cloud provider KMS for key management, enable automatic key rotation, document key management procedures",
                cost_estimate: "$1-20/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.11": {
            objective: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.",
            summary: "Use FIPS 140-2 validated encryption modules",
            cloud: {
                aws: {"implementation":{"steps":["Use FIPS endpoints for AWS services","Enable FIPS mode for S3","Use CloudHSM for FIPS 140-2 Level 3","Use FIPS-validated TLS libraries","Document FIPS compliance","Use AWS GovCloud for full FIPS compliance"],"cost_estimate":"$0-1000+/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use Azure Government for FIPS compliance","Enable FIPS mode for services","Use Managed HSM for FIPS 140-2 Level 3","Use FIPS-validated TLS libraries","Document FIPS compliance"],"cost_estimate":"$0-1000+/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use FIPS-validated encryption","Use Cloud HSM for FIPS 140-2 Level 3","Use FIPS-validated TLS libraries","Document FIPS compliance"],"cost_estimate":"$0-1000+/month","effort_hours":8}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable FIPS mode via Group Policy","Use BitLocker with FIPS compliance","Use FIPS-validated cryptographic providers","Test applications for FIPS compatibility"],"effort_hours":6}},
                linux: {"implementation":{"steps":["Use FIPS-validated OpenSSL","Enable FIPS mode in kernel","Use FIPS-validated LUKS encryption","Test applications for FIPS compatibility"],"effort_hours":8}}
            },
            small_business: {
                approach: "Use cloud provider FIPS-validated encryption, enable FIPS mode on Windows, document FIPS compliance",
                cost_estimate: "$0-100/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.12": {
            objective: "Prohibit remote activation of collaborative computing devices and provide indication of devices in use to users present at the device.",
            summary: "Disable webcam/microphone remote activation, LED indicator when in use",
            implementation: {
                general: {"steps":["Disable remote activation of webcams/microphones","Use physical camera covers","Require user consent for camera/microphone access","Display indicator when camera/microphone active","Disable camera/microphone when not needed","Use Group Policy to control camera access"],"effort_hours":4}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use WorkSpaces with camera/microphone controls","Disable remote activation via policy","Monitor device usage","Document camera/microphone policies"],"cost_estimate":"$0","effort_hours":3}},
                azure: {"implementation":{"steps":["Use Azure Virtual Desktop with device controls","Use Intune to control camera/microphone access","Disable remote activation via policy","Monitor device usage"],"cost_estimate":"$0","effort_hours":3}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Use Group Policy to disable camera/microphone","Require user consent for camera access","Use Windows privacy settings","Disable camera when not in use"],"effort_hours":2}},
                macos: {"implementation":{"steps":["Use System Preferences to control camera/microphone","Require user consent for camera access","Monitor camera usage with LED indicator"],"effort_hours":2}}
            },
            small_business: {
                approach: "Use physical camera covers, configure Windows privacy settings to require consent, disable camera when not needed",
                cost_estimate: "$10-50 (camera covers)",
                effort_hours: 2
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.13": {
            objective: "Control and monitor the use of mobile code.",
            summary: "Restrict JavaScript, ActiveX, Java applets, control mobile code execution",
            implementation: {
                general: {"steps":["Define acceptable mobile code (JavaScript, Java)","Restrict mobile code execution","Use browser security settings","Disable ActiveX controls","Use Content Security Policy (CSP)","Monitor mobile code usage","Scan mobile code for malware"],"effort_hours":6}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use WAF to filter mobile code","Implement CSP headers in CloudFront","Monitor mobile code with GuardDuty","Use Lambda@Edge for code inspection"],"cost_estimate":"$10-100/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Use Application Gateway WAF to filter mobile code","Implement CSP headers","Monitor mobile code with Defender","Use Azure Front Door for code inspection"],"cost_estimate":"$50-200/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Use Cloud Armor to filter mobile code","Implement CSP headers in Cloud CDN","Monitor mobile code with Security Command Center"],"cost_estimate":"$10-100/month","effort_hours":6}}
            },
            small_business: {
                approach: "Configure browser security settings, disable ActiveX, implement Content Security Policy on websites",
                cost_estimate: "$0",
                effort_hours: 3
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.14": {
            objective: "Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.",
            summary: "Secure VoIP, encrypt VoIP traffic, monitor VoIP usage",
            implementation: {
                general: {"steps":["Use encrypted VoIP (SRTP)","Implement VoIP firewall rules","Use VoIP-aware firewall","Monitor VoIP traffic","Use strong authentication for VoIP","Disable unnecessary VoIP features","Document VoIP security policy"],"effort_hours":8}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use Amazon Chime with encryption","Configure Security Groups for VoIP ports","Monitor VoIP traffic with VPC Flow Logs","Use AWS Connect for secure contact center"],"cost_estimate":"$50-500/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Use Microsoft Teams with encryption","Configure NSGs for VoIP ports","Monitor VoIP traffic with NSG Flow Logs","Use Azure Communication Services"],"cost_estimate":"$0-200/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Use Google Meet with encryption","Configure firewall rules for VoIP","Monitor VoIP traffic with VPC Flow Logs"],"cost_estimate":"$0-100/month","effort_hours":6}}
            },
            small_business: {
                approach: "Use Microsoft Teams or Zoom with encryption, configure firewall for VoIP, monitor VoIP usage",
                cost_estimate: "$0-50/user/month",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.15": {
            objective: "Protect the authenticity of communications sessions.",
            summary: "Use digital signatures, certificates, prevent session hijacking",
            cloud: {
                aws: {"implementation":{"steps":["Use TLS with certificate validation","Use AWS Certificate Manager for certificates","Implement mutual TLS (mTLS)","Use session tokens with signatures","Monitor for session hijacking with GuardDuty"],"cost_estimate":"$0-50/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Use TLS with certificate validation","Use Azure Key Vault for certificates","Implement mutual TLS (mTLS)","Use session tokens with signatures","Monitor for session hijacking with Sentinel"],"cost_estimate":"$0-50/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use TLS with certificate validation","Use Certificate Manager for certificates","Implement mutual TLS (mTLS)","Use session tokens with signatures","Monitor for session hijacking"],"cost_estimate":"$0-50/month","effort_hours":8}}
            },
            network: {
                general: {"implementation":{"steps":["Use TLS 1.2+ with certificate validation","Implement certificate pinning","Use IPsec for VPN","Monitor for man-in-the-middle attacks","Use DNSSEC"],"effort_hours":8}}
            },
            small_business: {
                approach: "Use HTTPS with valid certificates, implement certificate validation, use VPN with IPsec",
                cost_estimate: "$0-100/year (certificates)",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SC.L2-3.13.16": {
            objective: "Protect the confidentiality of CUI at rest.",
            summary: "Encrypt all CUI at rest - same as SC.L2-3.13.8",
            cloud: {
                aws: {"implementation":{"steps":["Enable encryption for all services storing CUI","Use KMS for key management","Enable S3/EBS/RDS encryption","Encrypt backups","Rotate keys annually"],"cost_estimate":"$10-100/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Enable encryption for all services storing CUI","Use Key Vault for key management","Enable Storage/Disk/SQL encryption","Encrypt backups","Rotate keys annually"],"cost_estimate":"$10-100/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Enable encryption for all services storing CUI","Use Cloud KMS for key management","Enable Storage/Disk/SQL encryption","Encrypt backups","Rotate keys annually"],"cost_estimate":"$10-100/month","effort_hours":6}}
            },
            small_business: {
                approach: "Enable BitLocker, enable cloud storage encryption, encrypt databases, encrypt backups",
                cost_estimate: "$0",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["PAN-OS","SSL Decryption","Zone Protection","DoS Protection"],
                    implementation: {"steps":["Implement SSL/TLS Decryption for encrypted CUI traffic inspection","Configure Zone Protection profiles for CUI network zones","Enable DoS Protection for CUI-facing services","Implement URL Filtering to block malicious destinations","Configure Data Filtering to prevent CUI exfiltration","Enable DNS Security to block C2 communications","Implement IPSec VPN for encrypted CUI data in transit"],"cost_estimate":"$3,000-15,000/year","effort_hours":14}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Firewall Control","Device Control"],
                    implementation: {"steps":["Enable Firewall Control for host-based firewall rules on CUI endpoints","Configure endpoint network isolation for compromised systems","Monitor for unauthorized network connections from CUI endpoints","Enable Device Control to prevent data exfiltration via removable media","Use Deep Visibility to monitor CUI endpoint communications","Configure STAR rules for unauthorized communication detection"],"cost_estimate":"$5-12/endpoint/month","effort_hours":8}
                }
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Scripting","Monitoring","Patch Management"],"implementation":{"steps":["Verify Windows Firewall and host-based firewall configurations via scripting","Monitor TLS/SSL certificate expiration on CUI systems","Enforce encryption policies via scripting (BitLocker, FileVault)","Audit network configuration settings on CUI endpoints","Alert on firewall policy changes on CUI systems"],"cost_estimate":"$3-5/endpoint/month","effort_hours":6}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Scan for weak TLS/SSL configurations on CUI systems","Audit encryption settings across CUI assets","Scan for open ports and unnecessary services","Verify firewall rules and network segmentation","Generate communications protection compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":8}}
            }
        }
        
        ,
        
        "SI.L2-3.14.1": {
            objective: "Identify, report, and correct information and information system flaws in a timely manner.",
            summary: "Patch management, vulnerability tracking, timely remediation",
            cloud: {
                aws: {"services":["Systems Manager","Inspector"],"implementation":{"steps":["Use Systems Manager Patch Manager for automated patching","Enable Amazon Inspector for vulnerability detection","Create maintenance windows for patching","Track vulnerabilities in ticketing system","Patch critical vulnerabilities within 30 days","Document patch exceptions in POA&M"],"cost_estimate":"$20-100/month","effort_hours":12}},
                azure: {"services":["Update Management","Defender"],"implementation":{"steps":["Use Azure Update Management for patching","Enable Defender for Cloud vulnerability assessment","Create maintenance schedules","Track vulnerabilities in Azure DevOps","Patch critical vulnerabilities within 30 days","Document patch exceptions"],"cost_estimate":"$20-80/month","effort_hours":12}},
                gcp: {"services":["OS Config","Security Command Center"],"implementation":{"steps":["Use OS Config for patch management","Enable Security Command Center vulnerability scanning","Create maintenance windows","Track vulnerabilities in ticketing system","Patch critical vulnerabilities within 30 days","Document patch exceptions"],"cost_estimate":"$20-80/month","effort_hours":12}}
            },
            small_business: {
                approach: "Enable automatic updates for Windows/cloud systems, manually patch critical vulnerabilities within 30 days, track in Excel",
                cost_estimate: "$0",
                effort_hours: 8
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.2": {
            objective: "Provide protection from malicious code at designated locations within organizational information systems.",
            summary: "Antivirus/EDR on all endpoints, email filtering, web filtering",
            cloud: {
                aws: {"services":["GuardDuty","Macie"],"implementation":{"steps":["Enable Amazon GuardDuty for threat detection","Use Amazon Macie for data protection","Deploy third-party antivirus (CrowdStrike, Trend Micro)","Scan S3 uploads for malware","Enable email filtering with WorkMail","Monitor with Security Hub"],"cost_estimate":"$100-500/month","effort_hours":12}},
                azure: {"services":["Defender for Endpoint","Defender for Cloud"],"implementation":{"steps":["Deploy Microsoft Defender for Endpoint","Enable Defender for Cloud","Use Defender for Office 365 for email filtering","Scan storage uploads for malware","Enable real-time protection","Monitor with Sentinel"],"cost_estimate":"$100-400/month","effort_hours":12}},
                gcp: {"services":["Security Command Center","Google SecOps"],"implementation":{"steps":["Enable Security Command Center","Deploy third-party antivirus","Scan Cloud Storage uploads for malware","Use Gmail advanced protection","Monitor with Google SecOps"],"cost_estimate":"$100-400/month","effort_hours":12}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable Windows Defender","Configure real-time protection","Enable cloud-delivered protection","Schedule daily scans","Update virus definitions automatically","Enable tamper protection"],"effort_hours":4}},
                macos: {"implementation":{"steps":["Enable XProtect","Use third-party antivirus (Malwarebytes, Sophos)","Enable Gatekeeper","Scan downloads automatically"],"effort_hours":4}}
            },
            small_business: {
                approach: "Enable Windows Defender on all computers, use Microsoft 365 email filtering, enable automatic updates",
                cost_estimate: "$0-50/user/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.3": {
            objective: "Monitor information system security alerts and advisories and take action in response.",
            summary: "Subscribe to security alerts, review daily, patch promptly",
            implementation: {
                general: {"steps":["Subscribe to US-CERT alerts","Subscribe to vendor security bulletins (Microsoft, AWS, etc.)","Review security alerts daily","Assess impact to organization","Prioritize response based on risk","Patch or mitigate within defined timeframes","Document response actions"],"effort_hours":8}
            },
            cloud: {
                aws: {"implementation":{"steps":["Subscribe to AWS Security Bulletins","Enable Security Hub for centralized alerts","Configure SNS notifications for critical findings","Review GuardDuty findings daily","Subscribe to CVE feeds","Document response actions"],"cost_estimate":"$10-50/month","effort_hours":6}},
                azure: {"implementation":{"steps":["Subscribe to Microsoft Defender for Cloud alerts","Enable Defender for Cloud recommendations","Configure Action Groups for notifications","Review security alerts daily","Subscribe to Microsoft Security Response Center","Document response actions"],"cost_estimate":"$10-40/month","effort_hours":6}},
                gcp: {"implementation":{"steps":["Subscribe to Google Cloud security bulletins","Enable Security Command Center notifications","Configure Pub/Sub for alerts","Review security findings daily","Subscribe to CVE feeds","Document response actions"],"cost_estimate":"$10-40/month","effort_hours":6}}
            },
            small_business: {
                approach: "Subscribe to US-CERT alerts, review Microsoft/cloud provider security bulletins weekly, patch critical vulnerabilities promptly",
                cost_estimate: "$0",
                effort_hours: 4
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.4": {
            objective: "Update malicious code protection mechanisms when new releases are available.",
            summary: "Automatic antivirus updates, daily signature updates",
            cloud: {
                aws: {"implementation":{"steps":["Enable automatic updates for GuardDuty threat intelligence","Update third-party antivirus automatically","Enable automatic updates for WAF rules","Monitor update status"],"cost_estimate":"$0","effort_hours":3}},
                azure: {"implementation":{"steps":["Enable automatic updates for Defender","Update virus definitions automatically","Enable automatic updates for WAF rules","Monitor update status with Policy"],"cost_estimate":"$0","effort_hours":3}},
                gcp: {"implementation":{"steps":["Enable automatic updates for Security Command Center","Update third-party antivirus automatically","Enable automatic updates for Cloud Armor rules","Monitor update status"],"cost_estimate":"$0","effort_hours":3}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable automatic Windows Defender updates","Configure update schedule (daily)","Enable cloud-delivered protection","Monitor update status with Group Policy"],"effort_hours":2}},
                linux: {"implementation":{"steps":["Enable automatic ClamAV updates","Configure freshclam for daily updates","Monitor update status"],"effort_hours":2}}
            },
            small_business: {
                approach: "Enable automatic antivirus updates on all computers, verify updates are current weekly",
                cost_estimate: "$0",
                effort_hours: 2
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.5": {
            objective: "Perform periodic scans of organizational information systems and real-time scans of files from external sources as files are downloaded, opened, or executed.",
            summary: "Weekly system scans, real-time scanning, scan downloads",
            cloud: {
                aws: {"implementation":{"steps":["Enable GuardDuty for continuous monitoring","Use Inspector for weekly vulnerability scans","Scan S3 uploads in real-time with Lambda","Enable Macie for data scanning","Monitor scan results"],"cost_estimate":"$50-300/month","effort_hours":8}},
                azure: {"implementation":{"steps":["Enable Defender for Endpoint real-time scanning","Schedule weekly vulnerability scans","Scan storage uploads with Defender for Storage","Enable Defender for Cloud Apps","Monitor scan results"],"cost_estimate":"$50-250/month","effort_hours":8}},
                gcp: {"implementation":{"steps":["Enable Security Command Center continuous scanning","Schedule weekly vulnerability scans","Scan Cloud Storage uploads with Cloud Functions","Monitor scan results"],"cost_estimate":"$50-250/month","effort_hours":8}}
            },
            operating_system: {
                windows: {"implementation":{"steps":["Enable Windows Defender real-time protection","Schedule weekly full scans","Scan downloads automatically","Scan USB drives on insertion","Review scan results"],"effort_hours":3}},
                linux: {"implementation":{"steps":["Enable ClamAV real-time scanning","Schedule weekly full scans with cron","Scan downloads automatically","Review scan results"],"effort_hours":3}}
            },
            small_business: {
                approach: "Enable Windows Defender real-time protection, schedule weekly scans, scan all downloads automatically",
                cost_estimate: "$0",
                effort_hours: 3
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.6": {
            objective: "Monitor organizational information systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.",
            summary: "SIEM, IDS/IPS, network monitoring, log analysis",
            cloud: {
                aws: {"services":["GuardDuty","Security Hub","VPC Flow Logs"],"implementation":{"steps":["Enable GuardDuty for threat detection","Enable VPC Flow Logs for all VPCs","Use Security Hub for centralized monitoring","Deploy AWS Network Firewall with IDS","Create CloudWatch dashboards","Set up automated alerts","Review findings daily"],"cost_estimate":"$200-1000/month","effort_hours":20}},
                azure: {"services":["Sentinel","Defender","NSG Flow Logs"],"implementation":{"steps":["Deploy Microsoft Sentinel as SIEM","Enable Defender for Cloud","Enable NSG Flow Logs","Create analytics rules for threat detection","Create Azure Monitor dashboards","Set up automated alerts","Review findings daily"],"cost_estimate":"$300-1500/month","effort_hours":20}},
                gcp: {"services":["Google SecOps","Security Command Center","VPC Flow Logs"],"implementation":{"steps":["Deploy Google SecOps SIEM","Enable Security Command Center Premium","Enable VPC Flow Logs","Create detection rules","Create Cloud Monitoring dashboards","Set up automated alerts","Review findings daily"],"cost_estimate":"$500-2000/month","effort_hours":20}}
            },
            small_business: {
                approach: "Use cloud provider security monitoring, enable logging, review security dashboards weekly, set up email alerts for critical findings",
                cost_estimate: "$50-300/month",
                effort_hours: 12
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SI.L2-3.14.7": {
            objective: "Identify unauthorized use of organizational information systems.",
            summary: "User behavior analytics, anomaly detection, audit log review",
            cloud: {
                aws: {"services":["GuardDuty","CloudTrail","Detective"],"implementation":{"steps":["Enable GuardDuty for anomaly detection","Use CloudTrail for all API activity","Use Amazon Detective for investigation","Create CloudWatch alarms for suspicious activity","Monitor for unauthorized access attempts","Review CloudTrail logs weekly","Investigate anomalies"],"cost_estimate":"$100-500/month","effort_hours":12}},
                azure: {"services":["Sentinel","Entra ID Identity Protection"],"implementation":{"steps":["Deploy Sentinel with UEBA","Enable Entra ID Identity Protection","Monitor Activity Logs for suspicious activity","Create analytics rules for unauthorized use","Review sign-in logs daily","Investigate anomalies"],"cost_estimate":"$200-800/month","effort_hours":12}},
                gcp: {"services":["Google SecOps","Cloud Audit Logs"],"implementation":{"steps":["Deploy Google SecOps with threat detection","Enable Cloud Audit Logs for all services","Monitor for suspicious activity","Create detection rules for unauthorized use","Review audit logs weekly","Investigate anomalies"],"cost_estimate":"$200-800/month","effort_hours":12}}
            },
            small_business: {
                approach: "Review cloud provider audit logs weekly, monitor for failed login attempts, investigate suspicious activity",
                cost_estimate: "$0-100/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {
                    services: ["Threat Prevention","WildFire","DNS Security","URL Filtering"],
                    implementation: {"steps":["Enable Threat Prevention (IPS, Anti-Spyware, AV) on all CUI zone policies","Configure WildFire for zero-day malware analysis on CUI traffic","Enable DNS Security to block C2 communications","Implement URL Filtering to block malicious and phishing sites","Configure automated signature updates (daily)","Set up alerts for critical threat events on CUI segments","Review Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}
                }
            },
            xdr_edr: {
                sentinelone: {
                    services: ["Singularity XDR","Static AI","Behavioral AI","Storyline"],
                    implementation: {"steps":["Deploy SentinelOne with Protect mode on all CUI endpoints","Configure Static AI and Behavioral AI for maximum detection","Enable automated remediation: Kill, Quarantine, Remediate, Rollback","Configure real-time file integrity monitoring via Deep Visibility","Set up STAR rules for CUI-specific integrity monitoring","Enable Storyline for attack chain visualization","Monitor for fileless attacks on CUI systems"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}
                }
            },
            rmm: {
                ninjaone: {
                    services: ["NinjaOne Patch Management","Monitoring","Scripting"],
                    implementation: {"steps":["Configure automated patching with critical patches within 48 hours","Monitor antivirus/EDR status on CUI endpoints and alert on disabled protection","Use scripting to verify system integrity (file hashes, registry, services)","Monitor for unauthorized software installations on CUI systems","Alert on system integrity violations","Schedule automated integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}
                }
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus","Tenable.cs"],"implementation":{"steps":["Run weekly vulnerability scans on all CUI systems","Scan for malware indicators and suspicious configurations","Audit system integrity settings (AIDE, Tripwire)","Monitor for new critical vulnerabilities affecting CUI systems","Use Tenable.cs for container integrity scanning","Track remediation SLAs: critical <15 days, high <30 days"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.1": {
            objective: "Require that developers and integrators of organizational information systems, system components, or information system services create and implement a security assessment plan.",
            summary: "Security assessment plan for custom applications, security testing",
            implementation: {
                general: {"steps":["Create security assessment plan template","Require security assessment for all custom development","Include security requirements in RFP","Conduct security code review","Perform penetration testing","Document security test results","Require remediation of findings before deployment"],"effort_hours":16}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use AWS CodeGuru for code security review","Implement security testing in CI/CD pipeline","Use AWS Inspector for application scanning","Document security assessment plan","Require security sign-off before production deployment"],"cost_estimate":"$50-300/month","effort_hours":12}},
                azure: {"implementation":{"steps":["Use Azure DevOps security scanning","Implement security testing in CI/CD pipeline","Use Defender for DevOps","Document security assessment plan","Require security sign-off before production deployment"],"cost_estimate":"$50-250/month","effort_hours":12}},
                gcp: {"implementation":{"steps":["Use Cloud Build with security scanning","Implement security testing in CI/CD pipeline","Use Container Analysis for image scanning","Document security assessment plan","Require security sign-off before production deployment"],"cost_estimate":"$50-250/month","effort_hours":12}}
            },
            small_business: {
                approach: "Create security requirements document, conduct security testing before deployment, document test results",
                cost_estimate: "$0-5000 (consultant)",
                effort_hours: 12
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.2": {
            objective: "Require that developers and integrators of organizational information systems, system components, or information system services employ a system development life cycle process that incorporates information security considerations.",
            summary: "Secure SDLC, security requirements, security testing in development",
            implementation: {
                general: {"steps":["Implement secure SDLC methodology","Include security requirements in design phase","Conduct threat modeling","Perform security code reviews","Conduct security testing","Perform penetration testing","Document security in system documentation","Train developers on secure coding"],"effort_hours":24}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use AWS Well-Architected Framework","Implement security in CI/CD pipeline","Use CodeGuru for security review","Use Inspector for vulnerability scanning","Document security in architecture diagrams","Train developers on AWS security best practices"],"cost_estimate":"$50-300/month","effort_hours":16}},
                azure: {"implementation":{"steps":["Use Azure Well-Architected Framework","Implement security in CI/CD pipeline","Use Defender for DevOps","Use Security Center recommendations","Document security in architecture diagrams","Train developers on Azure security best practices"],"cost_estimate":"$50-250/month","effort_hours":16}},
                gcp: {"implementation":{"steps":["Use Google Cloud Architecture Framework","Implement security in CI/CD pipeline","Use Container Analysis","Use Security Command Center","Document security in architecture diagrams","Train developers on GCP security best practices"],"cost_estimate":"$50-250/month","effort_hours":16}}
            },
            small_business: {
                approach: "Implement basic secure SDLC, include security requirements in development, conduct security testing before deployment",
                cost_estimate: "$0-2000 (training)",
                effort_hours: 12
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.3": {
            objective: "Require the developer of the information system, system component, or information system service to produce a plan for the continuous monitoring of security control effectiveness that contains the required level of detail.",
            summary: "Continuous monitoring plan, security metrics, ongoing assessment",
            implementation: {
                general: {"steps":["Create continuous monitoring plan","Define security metrics to monitor","Establish monitoring frequency","Define alerting thresholds","Document monitoring procedures","Assign monitoring responsibilities","Review monitoring plan annually"],"effort_hours":12}
            },
            cloud: {
                aws: {"implementation":{"steps":["Document continuous monitoring plan","Use Security Hub for continuous monitoring","Use Config for compliance monitoring","Create CloudWatch dashboards for security metrics","Set up automated alerts","Review monitoring effectiveness quarterly"],"cost_estimate":"$100-500/month","effort_hours":10}},
                azure: {"implementation":{"steps":["Document continuous monitoring plan","Use Sentinel for continuous monitoring","Use Azure Policy for compliance monitoring","Create Azure Monitor dashboards","Set up automated alerts","Review monitoring effectiveness quarterly"],"cost_estimate":"$200-800/month","effort_hours":10}},
                gcp: {"implementation":{"steps":["Document continuous monitoring plan","Use Security Command Center for continuous monitoring","Use organization policies for compliance","Create Cloud Monitoring dashboards","Set up automated alerts","Review monitoring effectiveness quarterly"],"cost_estimate":"$200-600/month","effort_hours":10}}
            },
            small_business: {
                approach: "Document monitoring plan, use cloud provider security dashboards, review security metrics monthly",
                cost_estimate: "$0-200/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.4": {
            objective: "Require the developer of the information system, system component, or information system service to perform configuration management during system, component, or service development, implementation, and operation.",
            summary: "Configuration management, version control, change tracking",
            implementation: {
                general: {"steps":["Implement configuration management process","Use version control (Git)","Track all configuration changes","Require change approval","Document configuration baselines","Maintain configuration documentation","Review configuration changes"],"effort_hours":12}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use GitHub or CodeCatalyst for version control","Use CodePipeline for CI/CD","Use Config for configuration tracking","Implement infrastructure as code (CloudFormation, Terraform)","Track changes in Git","Require pull request approval","Document configuration management procedures"],"cost_estimate":"$10-100/month","effort_hours":10}},
                azure: {"implementation":{"steps":["Use Azure Repos for version control","Use Azure Pipelines for CI/CD","Use Azure Policy for configuration tracking","Implement infrastructure as code (ARM templates, Terraform)","Track changes in Git","Require pull request approval","Document configuration management procedures"],"cost_estimate":"$10-80/month","effort_hours":10}},
                gcp: {"implementation":{"steps":["Use GitHub or GitLab for version control","Use Cloud Build for CI/CD","Use Config Connector for configuration tracking","Implement infrastructure as code with Terraform","Track changes in Git","Require pull request approval","Document configuration management procedures"],"cost_estimate":"$10-80/month","effort_hours":10}}
            },
            small_business: {
                approach: "Use Git for version control, track configuration changes, require approval for production changes",
                cost_estimate: "$0-20/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.5": {
            objective: "Require the developer of the information system, system component, or information system service to document, manage, and ensure the integrity of changes to the system, component, or service.",
            summary: "Change management, change documentation, integrity verification",
            implementation: {
                general: {"steps":["Document change management process","Require change tickets for all changes","Document change details (what, why, who, when)","Require change approval","Test changes before production","Verify change integrity","Document rollback procedures","Review changes in CAB"],"effort_hours":12}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use ServiceNow/Jira for change management","Track changes in CloudTrail","Use CodePipeline for automated deployments","Implement blue/green deployments","Verify change integrity with checksums","Document rollback procedures","Review changes in CAB meetings"],"cost_estimate":"$0-100/month","effort_hours":10}},
                azure: {"implementation":{"steps":["Use Azure DevOps for change management","Track changes in Activity Log","Use Azure Pipelines for automated deployments","Implement blue/green deployments","Verify change integrity","Document rollback procedures","Review changes in CAB meetings"],"cost_estimate":"$0-80/month","effort_hours":10}},
                gcp: {"implementation":{"steps":["Use Jira/ServiceNow for change management","Track changes in Cloud Audit Logs","Use Cloud Build for automated deployments","Implement blue/green deployments","Verify change integrity","Document rollback procedures","Review changes in CAB meetings"],"cost_estimate":"$0-100/month","effort_hours":10}}
            },
            small_business: {
                approach: "Document all changes in ticketing system, require approval, test before production, document rollback procedures",
                cost_estimate: "$0-50/month",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.6": {
            objective: "Require the developer of the information system, system component, or information system service to reduce attack surfaces to a minimum.",
            summary: "Minimize attack surface, disable unnecessary features, least functionality",
            implementation: {
                general: {"steps":["Disable unnecessary services and features","Remove unused code and libraries","Minimize exposed ports and protocols","Use minimal base images","Implement least privilege","Remove default accounts","Disable unnecessary APIs","Document attack surface reduction measures"],"effort_hours":12}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use minimal AMIs","Disable unused AWS services","Use Security Groups with minimal ports","Remove unnecessary IAM permissions","Use VPC endpoints (no internet gateway)","Implement least privilege","Document attack surface"],"cost_estimate":"$0","effort_hours":8}},
                azure: {"implementation":{"steps":["Use minimal VM images","Disable unused Azure services","Use NSGs with minimal ports","Remove unnecessary RBAC assignments","Use Private Endpoints","Implement least privilege","Document attack surface"],"cost_estimate":"$0","effort_hours":8}},
                gcp: {"implementation":{"steps":["Use minimal VM images (Container-Optimized OS)","Disable unused GCP APIs","Use firewall rules with minimal ports","Remove unnecessary IAM bindings","Use Private Google Access","Implement least privilege","Document attack surface"],"cost_estimate":"$0","effort_hours":8}}
            },
            small_business: {
                approach: "Use minimal OS installations, disable unnecessary services, close unused ports, remove default accounts",
                cost_estimate: "$0",
                effort_hours: 6
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
        }
        
        ,
        
        "SA.L2-3.14.7": {
            objective: "Require the developer of the information system, system component, or information system service to employ tools for analyzing the security of code.",
            summary: "Static code analysis, security scanning, vulnerability testing",
            implementation: {
                general: {"steps":["Implement static code analysis (SAST)","Implement dynamic code analysis (DAST)","Use dependency scanning","Scan for secrets in code","Integrate security scanning in CI/CD","Require remediation of critical findings","Document security scanning procedures"],"effort_hours":12}
            },
            cloud: {
                aws: {"implementation":{"steps":["Use CodeGuru for code security review","Use Inspector for application scanning","Implement security scanning in CodePipeline","Use third-party tools (Snyk, Checkmarx)","Scan for secrets with tools like git-secrets","Require security gates in CI/CD"],"cost_estimate":"$100-500/month","effort_hours":10}},
                azure: {"implementation":{"steps":["Use Defender for DevOps","Implement security scanning in Azure Pipelines","Use third-party tools (Snyk, Checkmarx)","Scan for secrets with Azure Key Vault","Require security gates in CI/CD","Document security scanning procedures"],"cost_estimate":"$100-400/month","effort_hours":10}},
                gcp: {"implementation":{"steps":["Use Container Analysis for image scanning","Implement security scanning in Cloud Build","Use third-party tools (Snyk, Checkmarx)","Scan for secrets","Require security gates in CI/CD","Document security scanning procedures"],"cost_estimate":"$100-400/month","effort_hours":10}}
            },
            small_business: {
                approach: "Use free security scanning tools (SonarQube, OWASP ZAP), scan code before deployment, fix critical vulnerabilities",
                cost_estimate: "$0-200/month",
                effort_hours: 8
            },
            firewalls: {
                paloalto: {"services":["Threat Prevention","WildFire","DNS Security","URL Filtering"],"implementation":{"steps":["Enable Threat Prevention on all CUI zone policies","Configure WildFire for zero-day analysis on CUI traffic","Enable DNS Security to block malicious domains","Implement URL Filtering for malicious site blocking","Configure automated signature updates","Monitor Threat logs for indicators of compromise"],"cost_estimate":"$3,000-15,000/year","effort_hours":12}}
            },
            xdr_edr: {
                sentinelone: {"services":["Singularity XDR","Static AI","Behavioral AI"],"implementation":{"steps":["Deploy SentinelOne with Protect mode on CUI endpoints","Configure maximum detection sensitivity for CUI systems","Enable automated remediation and rollback","Monitor for fileless and living-off-the-land attacks","Set up STAR rules for CUI-specific detections"],"cost_estimate":"$5-12/endpoint/month","effort_hours":10}}
            },
            rmm: {
                ninjaone: {"services":["NinjaOne Patch Management","Monitoring"],"implementation":{"steps":["Configure automated patching for CUI systems","Monitor security software status on CUI endpoints","Alert on disabled protection or integrity violations","Schedule integrity verification scripts"],"cost_estimate":"$3-5/endpoint/month","effort_hours":8}}
            },
            vuln_mgmt: {
                tenable: {"services":["Tenable.io","Nessus"],"implementation":{"steps":["Run vulnerability scans on CUI systems weekly","Monitor for critical vulnerabilities","Track remediation SLAs","Generate integrity compliance reports"],"cost_estimate":"$30-65/asset/year","effort_hours":10}}
            }
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
