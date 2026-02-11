// Comprehensive Implementation Guidance - Nutanix Platform
// Adds Nutanix AHV/Prism Central/Flow guidance across all relevant CMMC L1/L2/L3 controls
// Nutanix services: Prism Central, Prism Element, AHV, Flow Network Security, Security Central,
// Nutanix Files, Nutanix Objects, Nutanix ERA, Nutanix Mine, Nutanix Calm, Xi Leap

const COMPREHENSIVE_GUIDANCE_NUTANIX = {
    objectives: {

        // ═══════════════════════════════════════════════════════════════
        // ACCESS CONTROL (AC)
        // ═══════════════════════════════════════════════════════════════

        "AC.L2-3.1.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security", "Nutanix IAM", "AHV"],
                    implementation: {
                        steps: [
                            "Configure RBAC roles in Prism Central with least-privilege assignments for CUI system administrators",
                            "Enable SAML 2.0 / LDAP integration with corporate IdP for centralized authentication",
                            "Implement Flow Network Security microsegmentation to isolate CUI VM workloads",
                            "Use Prism Central categories to tag CUI VMs and apply category-based policies",
                            "Configure AHV host-level access restrictions for hypervisor management",
                            "Enable audit logging in Prism Central and forward syslog to SIEM"
                        ],
                        cost_estimate: "$0 (included with Nutanix license)",
                        effort_hours: 12,
                        nutanix_cli_example: "nuclei user.create name=cui_admin role=Prism Admin\nnuclei authconfig.update auth_type=SAML idp_metadata_url=https://idp.example.com/metadata",
                        verification: [
                            "Review RBAC role assignments in Prism Central > Administration > Roles",
                            "Verify SAML/LDAP configuration under Authentication settings",
                            "Confirm Flow microsegmentation policies isolate CUI VMs",
                            "Check audit logs show all administrative actions"
                        ],
                        evidence: [
                            "Screenshot of Prism Central RBAC role assignments",
                            "SAML/LDAP authentication configuration export",
                            "Flow Network Security policy rules for CUI isolation",
                            "Syslog forwarding configuration to SIEM"
                        ]
                    }
                }
            }
        },

        "AC.L2-3.1.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security", "AHV"],
                    implementation: {
                        steps: [
                            "Implement Flow microsegmentation to restrict transaction types between CUI and non-CUI VMs",
                            "Configure application-aware policies in Flow to limit protocols (e.g., only HTTPS/SSH to CUI VMs)",
                            "Use Prism Central categories to enforce function-based access (e.g., 'AppTier:Web' vs 'AppTier:DB')",
                            "Restrict AHV console access to authorized administrators only",
                            "Configure Flow service chaining for IDS/IPS inspection of CUI traffic"
                        ],
                        cost_estimate: "$0 (included with Flow license)",
                        effort_hours: 8
                    }
                }
            }
        },

        "AC.L2-3.1.3": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Define Flow security policies that restrict CUI data flows to authorized paths only",
                            "Implement application-centric policies limiting east-west traffic between CUI tiers",
                            "Use Flow visualization to map and validate actual CUI data flows",
                            "Configure Flow to block unauthorized lateral movement between CUI VMs",
                            "Enable Flow logging to capture all CUI traffic flow decisions"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "AC.L2-3.1.4": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Implement separation of duties in Prism Central RBAC (separate roles for VM admin, network admin, security admin)",
                            "Use Flow policies to prevent CUI administrators from modifying network security rules",
                            "Configure distinct Prism Central projects for CUI and non-CUI workloads",
                            "Restrict Prism Element access to infrastructure-only administrators",
                            "Document role separation matrix for Nutanix administrative functions"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "AC.L2-3.1.5": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Enforce least privilege via Prism Central custom RBAC roles (e.g., read-only for auditors)",
                            "Use Prism Central Projects to scope user access to specific CUI clusters/VMs only",
                            "Restrict AHV SSH access to designated infrastructure administrators",
                            "Disable default 'admin' account or enforce strong password + MFA",
                            "Review and prune excessive permissions quarterly"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "AC.L2-3.1.7": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Configure Flow Network Security to prevent CUI VMs from communicating with non-privileged network segments",
                            "Use Prism Central categories to enforce privilege-based VM grouping",
                            "Implement Flow quarantine policies for VMs that violate privilege boundaries",
                            "Restrict Prism Central API access to service accounts with scoped permissions"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "AC.L2-3.1.12": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Configure Prism Central session timeout to 15 minutes of inactivity",
                            "Enable AHV console session timeout for hypervisor management sessions",
                            "Configure automatic VM console disconnect after inactivity period",
                            "Implement session locking for Prism Central web UI"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 2,
                        nutanix_cli_example: "ncli cluster edit-params session-timeout=900"
                    }
                }
            }
        },

        "AC.L2-3.1.13": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Configure Flow VPN policies for remote access to CUI VMs",
                            "Require MFA for all remote Prism Central access via SAML integration",
                            "Implement Flow policies to restrict remote access to specific source IP ranges",
                            "Enable audit logging for all remote management sessions",
                            "Use Nutanix Xi Frame or VDI for remote CUI access instead of direct VM access"
                        ],
                        cost_estimate: "$0-25/user/month (Frame)",
                        effort_hours: 8
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AUDIT & ACCOUNTABILITY (AU)
        // ═══════════════════════════════════════════════════════════════

        "AU.L2-3.3.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Prism Element", "AHV"],
                    implementation: {
                        steps: [
                            "Enable comprehensive audit logging in Prism Central for all administrative actions",
                            "Configure AHV host-level audit logging via rsyslog",
                            "Forward all Nutanix audit logs to centralized SIEM via syslog (TCP/TLS)",
                            "Enable API audit logging for Prism Central v3 API calls",
                            "Configure log retention policies (minimum 1 year for CUI systems)"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6,
                        nutanix_cli_example: "ncli rsyslog-config add-server name=siem ip=10.0.1.50 port=514 network-protocol=TCP\nncli rsyslog-config add-module name=AUDIT log-severity=INFO"
                    }
                }
            }
        },

        "AU.L2-3.3.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Configure Prism Central to log user identity, timestamp, action type, and target resource for all events",
                            "Enable Flow Network Security logging to capture source/destination/protocol for CUI traffic",
                            "Configure AHV to log VM lifecycle events (create, delete, migrate, snapshot)",
                            "Ensure syslog format includes all required audit fields per NIST 800-171"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        "AU.L2-3.3.4": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Prism Element"],
                    implementation: {
                        steps: [
                            "Configure Prism Central alerts for audit log failures or storage capacity warnings",
                            "Set up SNMP traps or email alerts for syslog forwarding failures",
                            "Monitor audit log pipeline health via Prism Central dashboard",
                            "Implement redundant syslog destinations for CUI audit logs"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        "AU.L2-3.3.5": {
            cloud: {
                nutanix: {
                    services: ["Prism Central"],
                    implementation: {
                        steps: [
                            "Correlate Prism Central audit logs with SIEM for cross-platform analysis",
                            "Use Prism Central Analysis dashboard to review audit trends",
                            "Configure SIEM correlation rules for Nutanix-specific events (e.g., unauthorized VM access, policy changes)",
                            "Schedule weekly audit log reviews for CUI infrastructure"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "AU.L2-3.3.8": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Prism Element"],
                    implementation: {
                        steps: [
                            "Restrict audit log access in Prism Central to Security Admin role only",
                            "Configure read-only RBAC for audit reviewers",
                            "Protect syslog forwarding configuration from modification by non-security admins",
                            "Use Nutanix Data-at-Rest Encryption to protect stored audit logs on Nutanix Objects"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CONFIGURATION MANAGEMENT (CM)
        // ═══════════════════════════════════════════════════════════════

        "CM.L2-3.4.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Prism Element", "AHV", "LCM"],
                    implementation: {
                        steps: [
                            "Document baseline configurations for AHV hosts, Prism Central, and CUI VMs",
                            "Use Prism Central categories to tag baseline-compliant VMs",
                            "Configure Nutanix LCM (Life Cycle Manager) for firmware/software version tracking",
                            "Export Prism Central configuration as baseline reference",
                            "Maintain hardware/software inventory via Prism Central asset management"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 10,
                        nutanix_cli_example: "ncli cluster get-params\nncli host list\nncli vm list"
                    }
                }
            }
        },

        "CM.L2-3.4.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security", "LCM"],
                    implementation: {
                        steps: [
                            "Enforce security configuration settings via Prism Central policies",
                            "Use Flow Network Security to enforce network security baselines for CUI VMs",
                            "Configure LCM to alert on firmware/software versions that deviate from baseline",
                            "Implement Prism Central alerts for configuration drift on CUI infrastructure",
                            "Use Nutanix Calm blueprints to enforce standardized VM deployments"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "CM.L2-3.4.3": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "LCM"],
                    implementation: {
                        steps: [
                            "Implement change management process for all Nutanix infrastructure changes",
                            "Use Prism Central audit logs to track all configuration changes",
                            "Require approval workflow for LCM firmware updates on CUI clusters",
                            "Document change requests and approvals before applying updates",
                            "Test changes in non-CUI cluster before applying to CUI infrastructure"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "CM.L2-3.4.5": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Define and document authorized software list for CUI VMs",
                            "Use Prism Central to inventory all running VMs and their applications",
                            "Implement AHV VM placement rules to restrict CUI VMs to dedicated hosts",
                            "Use Nutanix Calm to enforce approved VM images only",
                            "Monitor for unauthorized software via endpoint agents on CUI VMs"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "CM.L2-3.4.6": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Use Flow Network Security to restrict CUI VMs to only essential network services",
                            "Disable unnecessary AHV services on hosts running CUI workloads",
                            "Configure Prism Central to alert on new services/ports detected on CUI VMs",
                            "Restrict IPMI/BMC access to dedicated management network",
                            "Disable unused Nutanix services (e.g., Pulse telemetry if not approved)"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6,
                        nutanix_cli_example: "ncli cluster edit-params enable-pulse=false\nncli cluster edit-params enable-remote-support=false"
                    }
                }
            }
        },

        "CM.L2-3.4.7": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security", "AHV"],
                    implementation: {
                        steps: [
                            "Restrict USB/peripheral passthrough to CUI VMs in AHV settings",
                            "Disable VM console clipboard sharing for CUI VMs",
                            "Use Flow to block CUI VMs from accessing unauthorized external services",
                            "Configure Prism Central to prevent unauthorized VM exports/migrations",
                            "Restrict Nutanix Files share access to authorized CUI users only"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        "CM.L2-3.4.8": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Use Flow application-aware policies to block unauthorized applications on CUI networks",
                            "Configure Prism Central alerts for blacklisted application detection",
                            "Implement deny-by-default Flow policies for CUI VM network access",
                            "Monitor for policy violations via Prism Central and SIEM integration"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // IDENTIFICATION & AUTHENTICATION (IA)
        // ═══════════════════════════════════════════════════════════════

        "IA.L2-3.5.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Configure SAML 2.0 or LDAP integration for all Prism Central users",
                            "Enforce unique user accounts (disable shared/generic accounts)",
                            "Configure AHV SSH key-based authentication with individual keys",
                            "Enable Prism Central API authentication with individual service accounts",
                            "Disable local accounts except for break-glass emergency access"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        "IA.L2-3.5.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Authenticate all devices (AHV hosts, CVMs) via cluster certificates",
                            "Configure Prism Central to validate cluster membership via certificate trust",
                            "Use 802.1X or certificate-based authentication for Nutanix node network ports",
                            "Implement device certificates for API access to Prism Central"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "IA.L2-3.5.3": {
            cloud: {
                nutanix: {
                    services: ["Prism Central"],
                    implementation: {
                        steps: [
                            "Enable MFA for all Prism Central access via SAML IdP integration",
                            "Configure MFA for privileged AHV SSH access (e.g., via PAM module or jump host)",
                            "Require MFA for Prism Central API access for administrative operations",
                            "Document MFA enforcement for all Nutanix management interfaces"
                        ],
                        cost_estimate: "$0 (IdP provides MFA)",
                        effort_hours: 4
                    }
                }
            }
        },

        "IA.L2-3.5.7": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Configure Prism Central password complexity requirements (min 12 chars, mixed case, numbers, special)",
                            "Enforce password history (prevent reuse of last 24 passwords)",
                            "Set maximum password age to 60 days for local accounts",
                            "Configure account lockout after 5 failed attempts",
                            "Use SAML/LDAP to inherit corporate password policies"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 3,
                        nutanix_cli_example: "ncli cluster edit-params password-min-length=12\nncli cluster edit-params password-history-count=24\nncli cluster edit-params max-login-attempts=5"
                    }
                }
            }
        },

        "IA.L2-3.5.10": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Store Prism Central passwords using bcrypt hashing (default behavior)",
                            "Protect AHV SSH keys with passphrase encryption",
                            "Use Nutanix Data-at-Rest Encryption for stored credentials",
                            "Never store plaintext credentials in Calm blueprints or scripts"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 2
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SYSTEM & COMMUNICATIONS PROTECTION (SC)
        // ═══════════════════════════════════════════════════════════════

        "SC.L2-3.13.1": {
            cloud: {
                nutanix: {
                    services: ["Flow Network Security", "Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Deploy Flow Network Security for microsegmentation of CUI workloads",
                            "Implement zone-based security policies (CUI zone, management zone, DMZ)",
                            "Configure Flow visualization to monitor boundary traffic patterns",
                            "Enable Flow logging for all inter-zone traffic decisions",
                            "Implement Flow service chaining with third-party IDS/IPS for deep inspection",
                            "Configure AHV virtual switch isolation for CUI network segments"
                        ],
                        cost_estimate: "$0 (included with Flow license)",
                        effort_hours: 16,
                        nutanix_cli_example: "# Flow policies are configured via Prism Central UI or API\n# Example API call to create isolation policy:\ncurl -X POST https://prism-central:9440/api/nutanix/v3/network_security_rules \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"spec\":{\"name\":\"CUI-Isolation\",\"resources\":{\"app_rule\":{\"action\":\"DENY\"}}}}'",
                        verification: [
                            "Review Flow security policies in Prism Central > Network Security",
                            "Verify microsegmentation rules isolate CUI VMs from non-CUI networks",
                            "Check Flow visualization shows expected traffic patterns",
                            "Confirm logging captures all boundary crossing events"
                        ],
                        evidence: [
                            "Flow Network Security policy export",
                            "Flow visualization traffic map screenshot",
                            "Syslog entries showing Flow policy enforcement",
                            "Network segmentation architecture diagram"
                        ]
                    }
                }
            }
        },

        "SC.L2-3.13.2": {
            cloud: {
                nutanix: {
                    services: ["Flow Network Security", "AHV"],
                    implementation: {
                        steps: [
                            "Create dedicated AHV virtual networks for public-facing VMs",
                            "Implement Flow isolation policies between public and CUI network segments",
                            "Use Flow quarantine for compromised public-facing VMs",
                            "Configure separate Nutanix clusters for DMZ and CUI workloads if required"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "SC.L2-3.13.5": {
            cloud: {
                nutanix: {
                    services: ["Flow Network Security", "AHV"],
                    implementation: {
                        steps: [
                            "Implement Flow default-deny policies for all CUI VM network segments",
                            "Explicitly allow only required traffic flows between CUI VMs",
                            "Configure Flow to deny all traffic not matching an explicit allow rule",
                            "Document all allowed traffic flows in network security baseline"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "SC.L2-3.13.8": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV", "Nutanix Files"],
                    implementation: {
                        steps: [
                            "Enable TLS 1.2+ for all Prism Central web and API communications",
                            "Configure AHV cluster communications to use encrypted channels",
                            "Enable SMB encryption for Nutanix Files shares containing CUI",
                            "Configure Nutanix Objects with HTTPS-only access for CUI data",
                            "Replace default self-signed certificates with CA-signed certificates"
                        ],
                        cost_estimate: "$0-500 (certificates)",
                        effort_hours: 6,
                        nutanix_cli_example: "ncli cluster edit-params enable-ssl=true\n# Install CA-signed certificate:\nncli cluster install-ssl-certificate"
                    }
                }
            }
        },

        "SC.L2-3.13.11": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Enable Nutanix Data-at-Rest Encryption (DARE) with software encryption or external KMS",
                            "Configure FIPS 140-2 validated encryption for CUI data at rest",
                            "Use external KMS (e.g., SafeNet, Vormetric) for key management",
                            "Enable encryption for Nutanix Files and Objects storing CUI",
                            "Verify encryption status via Prism Central security dashboard"
                        ],
                        cost_estimate: "$0 (software) or $5,000+ (external KMS)",
                        effort_hours: 8,
                        nutanix_cli_example: "ncli data-at-rest-encryption enable\nncli data-at-rest-encryption get-status"
                    }
                }
            }
        },

        "SC.L2-3.13.16": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV", "Nutanix Files"],
                    implementation: {
                        steps: [
                            "Enable Data-at-Rest Encryption for all Nutanix storage containing CUI",
                            "Configure Nutanix Files with SMB encryption for CUI file shares",
                            "Use Nutanix Objects with server-side encryption for CUI object storage",
                            "Implement key rotation policies for encryption keys"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SYSTEM & INFORMATION INTEGRITY (SI)
        // ═══════════════════════════════════════════════════════════════

        "SI.L2-3.14.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Security Central", "LCM"],
                    implementation: {
                        steps: [
                            "Use Nutanix Security Central for continuous security posture monitoring",
                            "Configure Prism Central alerts for security-relevant events on CUI infrastructure",
                            "Monitor LCM for available security patches and firmware updates",
                            "Integrate Nutanix alerts with SIEM for correlation with endpoint security events",
                            "Enable Flow Network Security threat detection for CUI network segments"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "SI.L2-3.14.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV", "LCM"],
                    implementation: {
                        steps: [
                            "Deploy antivirus/EDR agents on all CUI VMs (SentinelOne, CrowdStrike, Defender)",
                            "Use LCM to keep AHV hosts patched against known vulnerabilities",
                            "Configure Prism Central to alert on VM integrity violations",
                            "Enable AHV Secure Boot for CUI host integrity verification"
                        ],
                        cost_estimate: "$0 (Nutanix) + EDR licensing",
                        effort_hours: 6
                    }
                }
            }
        },

        "SI.L2-3.14.3": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Security Central"],
                    implementation: {
                        steps: [
                            "Subscribe to Nutanix Security Advisories for vulnerability notifications",
                            "Use Security Central to identify security misconfigurations",
                            "Monitor Nutanix community and support portal for security bulletins",
                            "Configure automated alerts for new Nutanix CVEs affecting CUI infrastructure"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        "SI.L2-3.14.4": {
            cloud: {
                nutanix: {
                    services: ["LCM", "Prism Central"],
                    implementation: {
                        steps: [
                            "Use LCM to apply security patches to AHV, AOS, and firmware within SLA",
                            "Prioritize critical/high CVEs for CUI infrastructure (patch within 14/30 days)",
                            "Test patches on non-CUI cluster before applying to CUI infrastructure",
                            "Document patch management process and maintain patch compliance reports",
                            "Configure LCM auto-inventory to detect available updates"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8,
                        nutanix_cli_example: "# LCM inventory and update via Prism Central UI\n# CLI: lcm_inventory\n# Check current AOS version:\nncli cluster info | grep 'Cluster Version'"
                    }
                }
            }
        },

        "SI.L2-3.14.6": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security", "Security Central"],
                    implementation: {
                        steps: [
                            "Use Flow Network Security to monitor CUI network traffic for anomalies",
                            "Configure Prism Central alerts for unauthorized VM communications",
                            "Integrate Security Central findings with SIEM for threat correlation",
                            "Monitor for unauthorized configuration changes on CUI infrastructure",
                            "Enable Flow visualization to detect unexpected traffic patterns"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "SI.L2-3.14.7": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Flow Network Security"],
                    implementation: {
                        steps: [
                            "Monitor Prism Central for unauthorized access attempts to CUI infrastructure",
                            "Use Flow to detect and alert on unauthorized network scanning of CUI VMs",
                            "Configure SIEM correlation rules for Nutanix-specific attack indicators",
                            "Implement automated Flow quarantine for VMs exhibiting malicious behavior"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // RISK ASSESSMENT (RA)
        // ═══════════════════════════════════════════════════════════════

        "RA.L2-3.11.1": {
            cloud: {
                nutanix: {
                    services: ["Security Central", "Prism Central", "LCM"],
                    implementation: {
                        steps: [
                            "Use Security Central to assess security posture of CUI Nutanix infrastructure",
                            "Review LCM compliance status for firmware and software vulnerabilities",
                            "Assess Flow Network Security policy effectiveness for CUI isolation",
                            "Include Nutanix infrastructure in annual risk assessment scope",
                            "Document Nutanix-specific risks in organizational risk register"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 8
                    }
                }
            }
        },

        "RA.L2-3.11.2": {
            cloud: {
                nutanix: {
                    services: ["Security Central", "LCM", "Prism Central"],
                    implementation: {
                        steps: [
                            "Run Security Central scans to identify misconfigurations on CUI clusters",
                            "Use LCM to identify outdated firmware/software with known CVEs",
                            "Deploy vulnerability scanning agents on CUI VMs (Tenable, Qualys)",
                            "Scan Nutanix management interfaces for vulnerabilities monthly",
                            "Review Nutanix Security Advisories for new vulnerabilities"
                        ],
                        cost_estimate: "$0 (Nutanix) + scanner licensing",
                        effort_hours: 8
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CONTINGENCY PLANNING (CP) / MEDIA PROTECTION (MP)
        // ═══════════════════════════════════════════════════════════════

        "CP.L2-3.12.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Xi Leap", "Nutanix Mine"],
                    implementation: {
                        steps: [
                            "Configure Nutanix protection domains for CUI VM backup schedules",
                            "Implement Xi Leap for disaster recovery of CUI workloads to remote site",
                            "Use Nutanix Mine for integrated backup appliance with CUI data encryption",
                            "Document RTO/RPO for CUI VMs in contingency plan",
                            "Test DR failover quarterly using Xi Leap test failover"
                        ],
                        cost_estimate: "$500-5,000/month (Xi Leap)",
                        effort_hours: 16
                    }
                }
            }
        },

        "CP.L2-3.12.2": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Prism Element"],
                    implementation: {
                        steps: [
                            "Configure protection domains with scheduled snapshots for CUI VMs",
                            "Enable async or sync replication to remote Nutanix cluster",
                            "Configure snapshot retention policies per CUI data classification",
                            "Test snapshot restoration monthly",
                            "Monitor replication health via Prism Central dashboard"
                        ],
                        cost_estimate: "$0 (included with replication license)",
                        effort_hours: 8,
                        nutanix_cli_example: "ncli protection-domain create name=CUI-PD\nncli protection-domain add-vms name=CUI-PD vm-names=cui-vm-01,cui-vm-02\nncli protection-domain set-schedule name=CUI-PD interval=60 retention=24"
                    }
                }
            }
        },

        "CP.L2-3.12.3": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "AHV"],
                    implementation: {
                        steps: [
                            "Enable Data-at-Rest Encryption for all backup/snapshot storage",
                            "Encrypt replication traffic between Nutanix clusters (AES-256)",
                            "Restrict access to protection domain management to backup administrators only",
                            "Use external KMS for backup encryption key management"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 4
                    }
                }
            }
        },

        "MP.L2-3.8.1": {
            cloud: {
                nutanix: {
                    services: ["Prism Central", "Nutanix Files", "Nutanix Objects"],
                    implementation: {
                        steps: [
                            "Enable Data-at-Rest Encryption for all Nutanix storage containing CUI",
                            "Configure Nutanix Files with access controls and encryption for CUI shares",
                            "Use Nutanix Objects with WORM policies for immutable CUI storage",
                            "Implement Prism Central categories to classify and track CUI storage resources"
                        ],
                        cost_estimate: "$0 (included)",
                        effort_hours: 6
                    }
                }
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_NUTANIX };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_NUTANIX = COMPREHENSIVE_GUIDANCE_NUTANIX;
}
