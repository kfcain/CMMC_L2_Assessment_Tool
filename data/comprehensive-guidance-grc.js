// GRC & Compliance Platform Implementation Guidance
// Covers: Drata, Vanta, Secureframe, IntelliGRC
// FedRAMP baseline tags included per control

const COMPREHENSIVE_GUIDANCE_GRC = {
    // ── Access Control ──
    'AC.L2-3.1.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Access Reviews', 'Drata Personnel Management', 'Drata Policy Center'],
                implementation: {
                    steps: [
                        'Connect identity provider (Okta, Entra ID, Google Workspace) to Drata via native integration',
                        'Enable automated access review workflows in Drata Access Reviews module',
                        'Map AC-3.1.1 control to Drata control framework and assign owner',
                        'Configure automated evidence collection for user access lists and role assignments',
                        'Set up continuous monitoring alerts for access changes outside approved processes'
                    ],
                    verification: [
                        'Confirm IdP integration syncs user roster and group memberships',
                        'Verify automated access review schedules are active and assigned to reviewers',
                        'Check that evidence artifacts auto-populate in the AC-3.1.1 control card'
                    ],
                    cost_estimate: '$5,000-15,000/yr (Drata platform)'
                }
            },
            vanta: {
                services: ['Vanta Access Reviews', 'Vanta Trust Center', 'Vanta Integrations'],
                implementation: {
                    steps: [
                        'Connect identity provider to Vanta via pre-built integration (Okta, Azure AD, Google)',
                        'Enable Vanta Access Reviews with quarterly review cadence',
                        'Map NIST 800-171 AC.3.1.1 to Vanta control and assign control owner',
                        'Configure automated evidence collection for access provisioning/deprovisioning',
                        'Set up Vanta monitors for unauthorized access attempts and privilege escalation'
                    ],
                    verification: [
                        'Verify IdP integration shows all users and their access levels',
                        'Confirm access review tasks are generated and assigned on schedule',
                        'Check Vanta dashboard shows AC.3.1.1 control status as passing'
                    ],
                    cost_estimate: '$5,000-20,000/yr (Vanta platform)'
                }
            },
            secureframe: {
                services: ['Secureframe Access Reviews', 'Secureframe Compliance Dashboard', 'Secureframe Integrations'],
                implementation: {
                    steps: [
                        'Connect identity provider to Secureframe via integration marketplace',
                        'Enable automated personnel tracking and access review workflows',
                        'Map NIST 800-171 3.1.1 control requirement and assign owner',
                        'Configure continuous monitoring for access control policy compliance',
                        'Set up automated evidence collection for user access matrices'
                    ],
                    verification: [
                        'Verify integration pulls current user roster and access levels',
                        'Confirm access review workflows are scheduled and assigned',
                        'Check control dashboard shows 3.1.1 mapped and evidence collected'
                    ],
                    cost_estimate: '$8,000-25,000/yr (Secureframe platform)'
                }
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Evidence Library', 'IntelliGRC Risk Register'],
                implementation: {
                    steps: [
                        'Import NIST 800-171 control framework into IntelliGRC control library',
                        'Map AC.3.1.1 to organizational policies and assign control owner',
                        'Configure evidence collection tasks for access control documentation',
                        'Link access review artifacts from IdP or manual uploads to the control',
                        'Set up assessment scheduling for periodic access control reviews'
                    ],
                    verification: [
                        'Verify NIST 800-171 framework is imported with all objectives',
                        'Confirm AC.3.1.1 has assigned owner and linked evidence',
                        'Check assessment schedule includes access control review cycles'
                    ],
                    cost_estimate: '$3,000-10,000/yr (IntelliGRC platform)'
                }
            }
        }
    },
    'AC.L2-3.1.2': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Access Reviews', 'Drata Automated Evidence'],
                implementation: {
                    steps: [
                        'Configure Drata to monitor transaction and function-level access controls',
                        'Map AC-3.1.2 to Drata control framework with separation of duties requirements',
                        'Enable automated evidence collection for role-based access control (RBAC) configurations',
                        'Set up alerts for privilege escalation or unauthorized function access'
                    ],
                    verification: ['Verify RBAC evidence is auto-collected from connected systems', 'Confirm separation of duties policies are documented and linked']
                }
            },
            vanta: {
                services: ['Vanta Access Reviews', 'Vanta Monitors'],
                implementation: {
                    steps: [
                        'Configure Vanta monitors for transaction-level access controls',
                        'Map AC.3.1.2 and assign control owner with SoD requirements',
                        'Enable automated evidence for RBAC configurations across connected platforms',
                        'Set up continuous monitoring for function-level access violations'
                    ],
                    verification: ['Verify monitors detect unauthorized function access', 'Confirm RBAC evidence populates automatically']
                }
            },
            secureframe: {
                services: ['Secureframe Compliance Dashboard', 'Secureframe Monitors'],
                implementation: {
                    steps: [
                        'Map NIST 800-171 3.1.2 in Secureframe with transaction control requirements',
                        'Configure automated monitoring for RBAC and SoD compliance',
                        'Enable evidence collection for function-level access configurations'
                    ],
                    verification: ['Verify control mapping includes SoD requirements', 'Confirm automated evidence collection is active']
                }
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Evidence Library'],
                implementation: {
                    steps: [
                        'Map AC.3.1.2 in IntelliGRC with transaction and function control requirements',
                        'Link RBAC documentation and SoD matrices as evidence artifacts',
                        'Schedule periodic reviews of function-level access controls'
                    ],
                    verification: ['Verify control has linked evidence for RBAC and SoD', 'Confirm review schedule is active']
                }
            }
        }
    },
    'AC.L2-3.1.5': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Access Reviews', 'Drata Personnel Management'],
                implementation: {
                    steps: [
                        'Configure Drata to enforce least privilege through IdP integration monitoring',
                        'Map AC-3.1.5 and document least privilege policy in Drata Policy Center',
                        'Enable automated alerts for excessive permissions or privilege creep',
                        'Set up quarterly access reviews focused on privilege minimization'
                    ],
                    verification: ['Verify least privilege policy is published and acknowledged', 'Confirm access reviews flag excessive permissions']
                }
            },
            vanta: {
                services: ['Vanta Access Reviews', 'Vanta Policy Management'],
                implementation: {
                    steps: [
                        'Map AC.3.1.5 in Vanta with least privilege requirements',
                        'Configure Vanta monitors to detect over-provisioned accounts',
                        'Enable automated access reviews with least privilege focus',
                        'Document least privilege policy in Vanta Policy Center'
                    ],
                    verification: ['Verify monitors detect over-provisioned accounts', 'Confirm policy is published and tracked']
                }
            },
            secureframe: {
                services: ['Secureframe Access Reviews', 'Secureframe Policy Management'],
                implementation: {
                    steps: [
                        'Map 3.1.5 in Secureframe with least privilege requirements',
                        'Configure automated monitoring for privilege creep detection',
                        'Enable periodic access reviews with least privilege validation'
                    ],
                    verification: ['Verify privilege creep monitoring is active', 'Confirm access reviews include least privilege checks']
                }
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Policy Library'],
                implementation: {
                    steps: [
                        'Map AC.3.1.5 with least privilege requirements in IntelliGRC',
                        'Link least privilege policy documentation as evidence',
                        'Schedule periodic privilege reviews and link results'
                    ],
                    verification: ['Verify control has linked least privilege policy', 'Confirm review schedule is active']
                }
            }
        }
    },
    'AC.L2-3.1.7': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Access Reviews', 'Drata Automated Evidence'],
                implementation: {
                    steps: [
                        'Configure Drata to monitor privileged function usage via SIEM/IdP integration',
                        'Map AC-3.1.7 with privileged access management requirements',
                        'Enable automated evidence collection for PAM tool configurations',
                        'Set up alerts for unauthorized privileged function execution'
                    ],
                    verification: ['Verify PAM evidence is auto-collected', 'Confirm privileged function monitoring alerts are active']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Access Reviews'],
                implementation: {
                    steps: [
                        'Map AC.3.1.7 in Vanta with privileged function control requirements',
                        'Configure monitors for privileged account usage and JIT access',
                        'Enable automated evidence for PAM configurations'
                    ],
                    verification: ['Verify privileged access monitors are active', 'Confirm PAM evidence populates']
                }
            },
            secureframe: {
                services: ['Secureframe Monitors', 'Secureframe Compliance Dashboard'],
                implementation: {
                    steps: [
                        'Map 3.1.7 in Secureframe with privileged function requirements',
                        'Configure monitoring for privileged account activity',
                        'Enable evidence collection for PAM tool configurations'
                    ],
                    verification: ['Verify privileged function monitoring is active', 'Confirm evidence collection for PAM']
                }
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: [
                        'Map AC.3.1.7 with privileged function requirements',
                        'Link PAM documentation and audit logs as evidence',
                        'Schedule periodic privileged access reviews'
                    ],
                    verification: ['Verify PAM evidence is linked', 'Confirm review schedule is active']
                }
            }
        }
    },

    // ── Awareness & Training ──
    'AT.L2-3.2.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Security Awareness Training', 'Drata Personnel Management'],
                implementation: {
                    steps: [
                        'Enable Drata built-in security awareness training module or connect KnowBe4/Ninjio integration',
                        'Assign training to all personnel with system access',
                        'Map AT-3.2.1 control and configure automated training completion tracking',
                        'Set up automated reminders for overdue training assignments',
                        'Configure evidence auto-collection for training completion records'
                    ],
                    verification: ['Verify training assignments are active for all personnel', 'Confirm completion tracking shows current status', 'Check automated reminders are configured for overdue training']
                }
            },
            vanta: {
                services: ['Vanta Security Training', 'Vanta Personnel Management'],
                implementation: {
                    steps: [
                        'Enable Vanta built-in security awareness training or connect third-party training provider',
                        'Assign training to all employees and contractors',
                        'Map AT.3.2.1 and configure automated completion tracking',
                        'Set up Vanta monitors for training compliance gaps'
                    ],
                    verification: ['Verify all personnel have active training assignments', 'Confirm monitors flag training compliance gaps']
                }
            },
            secureframe: {
                services: ['Secureframe Training', 'Secureframe Personnel'],
                implementation: {
                    steps: [
                        'Enable Secureframe security awareness training module',
                        'Assign training to all personnel and configure annual recurrence',
                        'Map 3.2.1 control and enable automated evidence collection'
                    ],
                    verification: ['Verify training is assigned to all personnel', 'Confirm annual recurrence is configured']
                }
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Evidence Library'],
                implementation: {
                    steps: [
                        'Map AT.3.2.1 in IntelliGRC control library',
                        'Link training completion records from LMS as evidence artifacts',
                        'Schedule annual training review assessments'
                    ],
                    verification: ['Verify training evidence is linked to control', 'Confirm assessment schedule includes training reviews']
                }
            }
        }
    },
    'AT.L2-3.2.2': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Security Awareness Training', 'Drata Personnel Management'],
                implementation: {
                    steps: [
                        'Configure role-based training tracks in Drata for privileged users and security personnel',
                        'Map AT-3.2.2 with role-specific training requirements',
                        'Enable automated tracking of role-based training completion',
                        'Set up evidence collection for specialized training records'
                    ],
                    verification: ['Verify role-based training tracks are configured', 'Confirm privileged users have specialized training assigned']
                }
            },
            vanta: {
                services: ['Vanta Security Training', 'Vanta Personnel Management'],
                implementation: {
                    steps: [
                        'Configure role-based training assignments in Vanta',
                        'Map AT.3.2.2 with role-specific requirements',
                        'Enable monitors for role-based training compliance'
                    ],
                    verification: ['Verify role-based training is assigned', 'Confirm monitors track compliance']
                }
            },
            secureframe: {
                services: ['Secureframe Training', 'Secureframe Personnel'],
                implementation: {
                    steps: ['Map 3.2.2 with role-based training requirements', 'Configure specialized training tracks for security roles', 'Enable automated evidence collection']
                },
                verification: ['Verify role-based training tracks exist', 'Confirm evidence collection is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map AT.3.2.2 with role-based training requirements', 'Link role-specific training records as evidence', 'Schedule periodic training compliance reviews']
                },
                verification: ['Verify role-based training evidence is linked']
            }
        }
    },

    // ── Audit & Accountability ──
    'AU.L2-3.3.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Automated Evidence', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect SIEM/log management platform to Drata (Splunk, Sentinel, Chronicle)',
                        'Map AU-3.3.1 and configure automated evidence collection for audit log configurations',
                        'Enable continuous monitoring for audit logging coverage gaps',
                        'Set up alerts for systems not forwarding logs to central SIEM'
                    ],
                    verification: ['Verify SIEM integration is active and collecting evidence', 'Confirm audit logging coverage monitors are enabled']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Integrations'],
                implementation: {
                    steps: [
                        'Connect log management platform to Vanta',
                        'Map AU.3.3.1 and enable automated audit log monitoring',
                        'Configure Vanta monitors for audit logging compliance',
                        'Enable evidence collection for log retention and configuration'
                    ],
                    verification: ['Verify log management integration is active', 'Confirm audit monitors are enabled']
                }
            },
            secureframe: {
                services: ['Secureframe Monitors', 'Secureframe Integrations'],
                implementation: {
                    steps: ['Connect SIEM to Secureframe', 'Map 3.3.1 and enable audit log monitoring', 'Configure evidence collection for log configurations']
                },
                verification: ['Verify SIEM integration is active', 'Confirm audit monitors are enabled']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Evidence Library'],
                implementation: {
                    steps: ['Map AU.3.3.1 in IntelliGRC', 'Link audit log configuration evidence', 'Schedule periodic audit log reviews']
                },
                verification: ['Verify audit log evidence is linked', 'Confirm review schedule is active']
            }
        }
    },

    // ── Configuration Management ──
    'CM.L2-3.4.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Asset Inventory', 'Drata Automated Evidence', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect endpoint management tools (Intune, Jamf, NinjaOne) to Drata',
                        'Map CM-3.4.1 and enable automated asset inventory tracking',
                        'Configure baseline configuration monitoring via connected tools',
                        'Set up alerts for configuration drift from approved baselines'
                    ],
                    verification: ['Verify asset inventory integration is active', 'Confirm baseline configuration monitoring is enabled']
                }
            },
            vanta: {
                services: ['Vanta Asset Inventory', 'Vanta Monitors'],
                implementation: {
                    steps: [
                        'Connect endpoint management to Vanta for asset inventory',
                        'Map CM.3.4.1 and enable configuration baseline monitoring',
                        'Configure Vanta monitors for configuration drift detection'
                    ],
                    verification: ['Verify asset inventory is populated', 'Confirm configuration monitors are active']
                }
            },
            secureframe: {
                services: ['Secureframe Asset Management', 'Secureframe Monitors'],
                implementation: {
                    steps: ['Connect endpoint tools to Secureframe', 'Map 3.4.1 with baseline configuration requirements', 'Enable configuration monitoring']
                },
                verification: ['Verify asset management integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map CM.3.4.1 in IntelliGRC', 'Link baseline configuration documentation', 'Schedule periodic configuration reviews']
                },
                verification: ['Verify configuration evidence is linked']
            }
        }
    },
    'CM.L2-3.4.2': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Asset Inventory', 'Drata Change Management'],
                implementation: {
                    steps: [
                        'Configure Drata to track security configuration settings across systems',
                        'Map CM-3.4.2 with configuration enforcement requirements',
                        'Enable automated evidence for security configuration compliance',
                        'Connect vulnerability scanner to validate configuration hardening'
                    ],
                    verification: ['Verify configuration tracking is active', 'Confirm vulnerability scanner integration validates hardening']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Asset Inventory'],
                implementation: {
                    steps: ['Map CM.3.4.2 and configure security settings monitoring', 'Enable automated evidence for configuration enforcement', 'Connect vulnerability scanner for validation']
                },
                verification: ['Verify security settings monitors are active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Map 3.4.2 with configuration enforcement requirements', 'Enable automated monitoring and evidence collection']
                },
                verification: ['Verify configuration enforcement monitoring is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map CM.3.4.2 in IntelliGRC', 'Link configuration hardening evidence', 'Schedule periodic configuration audits']
                },
                verification: ['Verify configuration evidence is linked']
            }
        }
    },

    // ── Identification & Authentication ──
    'IA.L2-3.5.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Personnel Management', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect IdP (Okta, Entra ID) to Drata for user identification tracking',
                        'Map IA-3.5.1 and enable automated user identification monitoring',
                        'Configure evidence collection for user provisioning/deprovisioning workflows',
                        'Set up monitors for shared or generic account usage'
                    ],
                    verification: ['Verify IdP integration tracks all user identities', 'Confirm monitors detect shared/generic accounts']
                }
            },
            vanta: {
                services: ['Vanta Personnel Management', 'Vanta Monitors'],
                implementation: {
                    steps: ['Connect IdP to Vanta', 'Map IA.3.5.1 and enable user identification monitoring', 'Configure monitors for shared account detection']
                },
                verification: ['Verify user identification monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Personnel', 'Secureframe Monitors'],
                implementation: {
                    steps: ['Connect IdP to Secureframe', 'Map 3.5.1 with user identification requirements', 'Enable shared account detection']
                },
                verification: ['Verify IdP integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map IA.3.5.1 in IntelliGRC', 'Link user identification documentation', 'Schedule periodic identity reviews']
                },
                verification: ['Verify identity evidence is linked']
            }
        }
    },
    'IA.L2-3.5.3': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata MFA Monitoring', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect IdP to Drata and enable MFA enrollment monitoring',
                        'Map IA-3.5.3 with MFA requirements for all users',
                        'Configure automated alerts for users without MFA enabled',
                        'Enable evidence collection for MFA configuration and enrollment rates'
                    ],
                    verification: ['Verify MFA monitoring shows enrollment rates', 'Confirm alerts fire for users without MFA']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Personnel Management'],
                implementation: {
                    steps: ['Connect IdP and enable MFA monitoring in Vanta', 'Map IA.3.5.3 with MFA requirements', 'Configure monitors for MFA compliance gaps']
                },
                verification: ['Verify MFA monitors are active', 'Confirm non-MFA users are flagged']
                }
            ,
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Connect IdP and enable MFA monitoring', 'Map 3.5.3 with MFA requirements', 'Configure automated MFA compliance checks']
                },
                verification: ['Verify MFA monitoring is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map IA.3.5.3 in IntelliGRC', 'Link MFA configuration evidence', 'Schedule periodic MFA compliance reviews']
                },
                verification: ['Verify MFA evidence is linked']
            }
        }
    },

    // ── Incident Response ──
    'IR.L2-3.6.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Incident Management', 'Drata Policy Center'],
                implementation: {
                    steps: [
                        'Configure Drata incident management module with incident response workflow',
                        'Map IR-3.6.1 and link incident response plan document',
                        'Enable automated evidence collection for incident handling procedures',
                        'Connect ticketing system (Jira, ServiceNow) for incident tracking'
                    ],
                    verification: ['Verify incident management workflow is configured', 'Confirm IR plan is linked as evidence']
                }
            },
            vanta: {
                services: ['Vanta Policy Management', 'Vanta Monitors'],
                implementation: {
                    steps: ['Map IR.3.6.1 and link incident response plan', 'Configure incident tracking integration', 'Enable evidence collection for IR procedures']
                },
                verification: ['Verify IR plan is linked', 'Confirm incident tracking is configured']
            },
            secureframe: {
                services: ['Secureframe Policy Management'],
                implementation: {
                    steps: ['Map 3.6.1 and link IR plan', 'Configure incident tracking', 'Enable evidence collection']
                },
                verification: ['Verify IR plan is linked and current']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management', 'IntelliGRC Policy Library'],
                implementation: {
                    steps: ['Map IR.3.6.1 in IntelliGRC', 'Link IR plan and procedures', 'Schedule periodic IR plan reviews']
                },
                verification: ['Verify IR plan evidence is linked']
            }
        }
    },

    // ── Maintenance ──
    'MA.L2-3.7.1': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Asset Inventory', 'Drata Automated Evidence'],
                implementation: {
                    steps: [
                        'Connect RMM/patch management tool to Drata for maintenance tracking',
                        'Map MA-3.7.1 and enable automated patch compliance monitoring',
                        'Configure evidence collection for maintenance records and patch status'
                    ],
                    verification: ['Verify RMM integration tracks maintenance activities', 'Confirm patch compliance evidence is collected']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Asset Inventory'],
                implementation: {
                    steps: ['Connect RMM to Vanta', 'Map MA.3.7.1 and enable maintenance monitoring', 'Configure patch compliance evidence collection']
                },
                verification: ['Verify maintenance monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Connect RMM to Secureframe', 'Map 3.7.1 with maintenance requirements', 'Enable patch compliance monitoring']
                },
                verification: ['Verify RMM integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map MA.3.7.1 in IntelliGRC', 'Link maintenance records and patch reports', 'Schedule periodic maintenance reviews']
                },
                verification: ['Verify maintenance evidence is linked']
            }
        }
    },

    // ── Media Protection ──
    'MP.L2-3.8.1': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Policy Center', 'Drata Automated Evidence'],
                implementation: {
                    steps: [
                        'Map MP-3.8.1 and link media protection policy in Drata Policy Center',
                        'Configure evidence collection for media handling procedures',
                        'Enable monitoring for removable media policy compliance via endpoint tools'
                    ],
                    verification: ['Verify media protection policy is published', 'Confirm endpoint monitoring covers removable media']
                }
            },
            vanta: {
                services: ['Vanta Policy Management', 'Vanta Monitors'],
                implementation: {
                    steps: ['Map MP.3.8.1 and link media protection policy', 'Configure endpoint monitoring for media controls', 'Enable evidence collection']
                },
                verification: ['Verify media policy is linked', 'Confirm endpoint monitors are active']
            },
            secureframe: {
                services: ['Secureframe Policy Management'],
                implementation: {
                    steps: ['Map 3.8.1 and link media protection policy', 'Enable evidence collection for media handling']
                },
                verification: ['Verify media policy is linked']
            },
            intelligrc: {
                services: ['IntelliGRC Policy Library'],
                implementation: {
                    steps: ['Map MP.3.8.1 in IntelliGRC', 'Link media protection policy and procedures']
                },
                verification: ['Verify media policy evidence is linked']
            }
        }
    },

    // ── Personnel Security ──
    'PS.L2-3.9.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Personnel Management', 'Drata Background Checks'],
                implementation: {
                    steps: [
                        'Enable Drata personnel management with background check tracking',
                        'Map PS-3.9.1 and configure automated personnel screening evidence',
                        'Set up onboarding/offboarding workflow tracking',
                        'Configure alerts for personnel changes requiring access revocation'
                    ],
                    verification: ['Verify personnel tracking includes background check status', 'Confirm onboarding/offboarding workflows are active']
                }
            },
            vanta: {
                services: ['Vanta Personnel Management'],
                implementation: {
                    steps: ['Enable Vanta personnel tracking', 'Map PS.3.9.1 with screening requirements', 'Configure background check evidence collection']
                },
                verification: ['Verify personnel tracking is active']
            },
            secureframe: {
                services: ['Secureframe Personnel'],
                implementation: {
                    steps: ['Enable personnel management', 'Map 3.9.1 with screening requirements', 'Configure background check tracking']
                },
                verification: ['Verify personnel screening tracking is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map PS.3.9.1 in IntelliGRC', 'Link personnel screening records', 'Schedule periodic personnel reviews']
                },
                verification: ['Verify personnel screening evidence is linked']
            }
        }
    },

    // ── Risk Assessment ──
    'RA.L2-3.11.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Risk Management', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Enable Drata Risk Management module and create risk register',
                        'Connect vulnerability scanner (Tenable, Qualys) for automated risk data',
                        'Map RA-3.11.1 and configure risk assessment workflow',
                        'Set up automated risk scoring based on vulnerability and threat data',
                        'Configure periodic risk assessment scheduling'
                    ],
                    verification: ['Verify risk register is populated', 'Confirm vulnerability scanner integration feeds risk data', 'Check risk assessment schedule is active']
                }
            },
            vanta: {
                services: ['Vanta Risk Management', 'Vanta Monitors'],
                implementation: {
                    steps: [
                        'Enable Vanta Risk Management and create risk register',
                        'Connect vulnerability scanner for automated risk data',
                        'Map RA.3.11.1 and configure risk assessment workflows',
                        'Enable continuous risk monitoring'
                    ],
                    verification: ['Verify risk register is populated', 'Confirm risk monitoring is active']
                }
            },
            secureframe: {
                services: ['Secureframe Risk Management'],
                implementation: {
                    steps: ['Enable risk management module', 'Map 3.11.1 with risk assessment requirements', 'Connect vulnerability scanner', 'Configure risk assessment scheduling']
                },
                verification: ['Verify risk register is populated', 'Confirm vulnerability integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Risk Register', 'IntelliGRC Assessment Module'],
                implementation: {
                    steps: [
                        'Map RA.3.11.1 in IntelliGRC',
                        'Create risk register with organizational risk categories',
                        'Configure risk assessment methodology and scoring criteria',
                        'Schedule periodic risk assessments and link results'
                    ],
                    verification: ['Verify risk register is created', 'Confirm assessment schedule is active']
                }
            }
        }
    },
    'RA.L2-3.11.2': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Vulnerability Management', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect vulnerability scanner (Tenable, Qualys, Rapid7) to Drata',
                        'Map RA-3.11.2 and enable automated vulnerability scan evidence collection',
                        'Configure monitors for scan coverage and remediation SLAs',
                        'Set up alerts for critical/high vulnerabilities exceeding remediation timelines'
                    ],
                    verification: ['Verify vulnerability scanner integration is active', 'Confirm scan coverage monitors are enabled']
                }
            },
            vanta: {
                services: ['Vanta Vulnerability Monitoring', 'Vanta Integrations'],
                implementation: {
                    steps: ['Connect vulnerability scanner to Vanta', 'Map RA.3.11.2 and enable scan monitoring', 'Configure remediation SLA tracking']
                },
                verification: ['Verify vulnerability monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Vulnerability Management'],
                implementation: {
                    steps: ['Connect vulnerability scanner', 'Map 3.11.2 with scanning requirements', 'Enable scan evidence collection']
                },
                verification: ['Verify vulnerability scanner integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map RA.3.11.2 in IntelliGRC', 'Link vulnerability scan reports as evidence', 'Schedule periodic scan reviews']
                },
                verification: ['Verify scan evidence is linked']
            }
        }
    },

    // ── Security Assessment ──
    'CA.L2-3.12.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Compliance Dashboard', 'Drata Automated Testing'],
                implementation: {
                    steps: [
                        'Configure Drata compliance dashboard for NIST 800-171 framework',
                        'Map CA-3.12.1 and enable automated control testing',
                        'Set up continuous compliance monitoring across all mapped controls',
                        'Configure assessment readiness reports for C3PAO preparation'
                    ],
                    verification: ['Verify NIST 800-171 framework is mapped', 'Confirm automated testing is active', 'Check readiness reports are generating']
                }
            },
            vanta: {
                services: ['Vanta Compliance Dashboard', 'Vanta Automated Testing'],
                implementation: {
                    steps: ['Configure Vanta for NIST 800-171 compliance', 'Map CA.3.12.1 and enable automated testing', 'Set up continuous compliance monitoring']
                },
                verification: ['Verify NIST 800-171 is configured', 'Confirm automated testing is active']
            },
            secureframe: {
                services: ['Secureframe Compliance Dashboard'],
                implementation: {
                    steps: ['Configure Secureframe for NIST 800-171', 'Map 3.12.1 with assessment requirements', 'Enable automated compliance testing']
                },
                verification: ['Verify NIST 800-171 framework is configured']
            },
            intelligrc: {
                services: ['IntelliGRC Assessment Module', 'IntelliGRC Control Management'],
                implementation: {
                    steps: [
                        'Configure IntelliGRC for NIST 800-171 assessment',
                        'Map CA.3.12.1 with assessment methodology',
                        'Schedule periodic security assessments',
                        'Configure assessment reports and evidence tracking'
                    ],
                    verification: ['Verify assessment module is configured', 'Confirm assessment schedule is active']
                }
            }
        }
    },

    // ── System & Communications Protection ──
    'SC.L2-3.13.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Automated Evidence', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect network/firewall tools to Drata for boundary protection evidence',
                        'Map SC-3.13.1 and enable automated evidence for network segmentation',
                        'Configure monitors for boundary protection compliance'
                    ],
                    verification: ['Verify network tool integration is active', 'Confirm boundary protection evidence is collected']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Integrations'],
                implementation: {
                    steps: ['Connect network tools to Vanta', 'Map SC.3.13.1 and enable boundary monitoring', 'Configure evidence collection']
                },
                verification: ['Verify network monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Connect network tools', 'Map 3.13.1 with boundary protection requirements', 'Enable monitoring']
                },
                verification: ['Verify network tool integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map SC.3.13.1 in IntelliGRC', 'Link network architecture and firewall rule evidence', 'Schedule periodic boundary reviews']
                },
                verification: ['Verify boundary protection evidence is linked']
            }
        }
    },
    'SC.L2-3.13.8': {
        fedrampBaseline: ['Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Automated Evidence'],
                implementation: {
                    steps: [
                        'Map SC-3.13.8 and configure evidence collection for encryption-in-transit configurations',
                        'Connect cloud platforms to verify TLS/encryption settings',
                        'Enable monitors for unencrypted data transmission'
                    ],
                    verification: ['Verify encryption evidence is collected', 'Confirm monitors detect unencrypted transmissions']
                }
            },
            vanta: {
                services: ['Vanta Monitors'],
                implementation: {
                    steps: ['Map SC.3.13.8 and enable encryption monitoring', 'Configure evidence for TLS configurations']
                },
                verification: ['Verify encryption monitors are active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Map 3.13.8 with encryption requirements', 'Enable encryption monitoring']
                },
                verification: ['Verify encryption monitoring is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map SC.3.13.8 in IntelliGRC', 'Link encryption configuration evidence']
                },
                verification: ['Verify encryption evidence is linked']
            }
        }
    },

    // ── System & Information Integrity ──
    'SI.L2-3.14.1': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Vulnerability Management', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect patch management tool (NinjaOne, Intune, WSUS) to Drata',
                        'Map SI-3.14.1 and enable automated patch compliance monitoring',
                        'Configure evidence collection for patch deployment records',
                        'Set up alerts for critical patches not deployed within SLA'
                    ],
                    verification: ['Verify patch management integration is active', 'Confirm patch compliance monitors are enabled']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Integrations'],
                implementation: {
                    steps: ['Connect patch management to Vanta', 'Map SI.3.14.1 and enable patch monitoring', 'Configure SLA tracking for critical patches']
                },
                verification: ['Verify patch monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Connect patch management tool', 'Map 3.14.1 with flaw remediation requirements', 'Enable patch compliance monitoring']
                },
                verification: ['Verify patch management integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map SI.3.14.1 in IntelliGRC', 'Link patch management reports as evidence', 'Schedule periodic patch compliance reviews']
                },
                verification: ['Verify patch evidence is linked']
            }
        }
    },
    'SI.L2-3.14.2': {
        fedrampBaseline: ['Low', 'Moderate', 'High'],
        objectives: {
            drata: {
                services: ['Drata Automated Evidence', 'Drata Integrations'],
                implementation: {
                    steps: [
                        'Connect EDR/XDR platform (SentinelOne, CrowdStrike) to Drata',
                        'Map SI-3.14.2 and enable malware protection monitoring',
                        'Configure evidence collection for antimalware deployment and update status',
                        'Set up alerts for endpoints without active protection'
                    ],
                    verification: ['Verify EDR integration is active', 'Confirm malware protection monitors are enabled']
                }
            },
            vanta: {
                services: ['Vanta Monitors', 'Vanta Integrations'],
                implementation: {
                    steps: ['Connect EDR to Vanta', 'Map SI.3.14.2 and enable malware monitoring', 'Configure endpoint protection compliance checks']
                },
                verification: ['Verify EDR monitoring is active']
            },
            secureframe: {
                services: ['Secureframe Monitors'],
                implementation: {
                    steps: ['Connect EDR platform', 'Map 3.14.2 with malware protection requirements', 'Enable endpoint protection monitoring']
                },
                verification: ['Verify EDR integration is active']
            },
            intelligrc: {
                services: ['IntelliGRC Control Management'],
                implementation: {
                    steps: ['Map SI.3.14.2 in IntelliGRC', 'Link EDR deployment and status evidence', 'Schedule periodic malware protection reviews']
                },
                verification: ['Verify EDR evidence is linked']
            }
        }
    }
};

// FedRAMP Baseline Mapping for all NIST 800-171 controls
// Used by the UI to display FedRAMP baseline tags on each control
const FEDRAMP_BASELINE_MAP = {
    // Access Control
    '3.1.1': ['Low', 'Moderate', 'High'], '3.1.2': ['Low', 'Moderate', 'High'],
    '3.1.3': ['Moderate', 'High'], '3.1.4': ['Moderate', 'High'],
    '3.1.5': ['Moderate', 'High'], '3.1.6': ['Moderate', 'High'],
    '3.1.7': ['Moderate', 'High'], '3.1.8': ['Moderate', 'High'],
    '3.1.9': ['Moderate', 'High'], '3.1.10': ['Moderate', 'High'],
    '3.1.11': ['Moderate', 'High'], '3.1.12': ['Moderate', 'High'],
    '3.1.13': ['Moderate', 'High'], '3.1.14': ['Moderate', 'High'],
    '3.1.15': ['Moderate', 'High'], '3.1.16': ['Moderate', 'High'],
    '3.1.17': ['Moderate', 'High'], '3.1.18': ['Moderate', 'High'],
    '3.1.19': ['Moderate', 'High'], '3.1.20': ['Moderate', 'High'],
    '3.1.21': ['Moderate', 'High'], '3.1.22': ['Moderate', 'High'],
    // Awareness & Training
    '3.2.1': ['Low', 'Moderate', 'High'], '3.2.2': ['Moderate', 'High'],
    '3.2.3': ['Moderate', 'High'],
    // Audit & Accountability
    '3.3.1': ['Low', 'Moderate', 'High'], '3.3.2': ['Low', 'Moderate', 'High'],
    '3.3.3': ['Moderate', 'High'], '3.3.4': ['Moderate', 'High'],
    '3.3.5': ['Moderate', 'High'], '3.3.6': ['Moderate', 'High'],
    '3.3.7': ['Moderate', 'High'], '3.3.8': ['Moderate', 'High'],
    '3.3.9': ['Moderate', 'High'],
    // Configuration Management
    '3.4.1': ['Low', 'Moderate', 'High'], '3.4.2': ['Low', 'Moderate', 'High'],
    '3.4.3': ['Moderate', 'High'], '3.4.4': ['Moderate', 'High'],
    '3.4.5': ['Moderate', 'High'], '3.4.6': ['Moderate', 'High'],
    '3.4.7': ['Moderate', 'High'], '3.4.8': ['Moderate', 'High'],
    '3.4.9': ['Moderate', 'High'],
    // Identification & Authentication
    '3.5.1': ['Low', 'Moderate', 'High'], '3.5.2': ['Low', 'Moderate', 'High'],
    '3.5.3': ['Low', 'Moderate', 'High'], '3.5.4': ['Moderate', 'High'],
    '3.5.5': ['Moderate', 'High'], '3.5.6': ['Moderate', 'High'],
    '3.5.7': ['Moderate', 'High'], '3.5.8': ['Moderate', 'High'],
    '3.5.9': ['Moderate', 'High'], '3.5.10': ['Moderate', 'High'],
    '3.5.11': ['Moderate', 'High'],
    // Incident Response
    '3.6.1': ['Low', 'Moderate', 'High'], '3.6.2': ['Low', 'Moderate', 'High'],
    '3.6.3': ['Moderate', 'High'],
    // Maintenance
    '3.7.1': ['Moderate', 'High'], '3.7.2': ['Moderate', 'High'],
    '3.7.3': ['Moderate', 'High'], '3.7.4': ['Moderate', 'High'],
    '3.7.5': ['Moderate', 'High'], '3.7.6': ['Moderate', 'High'],
    // Media Protection
    '3.8.1': ['Moderate', 'High'], '3.8.2': ['Moderate', 'High'],
    '3.8.3': ['Moderate', 'High'], '3.8.4': ['Moderate', 'High'],
    '3.8.5': ['Moderate', 'High'], '3.8.6': ['Moderate', 'High'],
    '3.8.7': ['Moderate', 'High'], '3.8.8': ['Moderate', 'High'],
    '3.8.9': ['Moderate', 'High'],
    // Personnel Security
    '3.9.1': ['Low', 'Moderate', 'High'], '3.9.2': ['Low', 'Moderate', 'High'],
    // Physical Protection
    '3.10.1': ['Low', 'Moderate', 'High'], '3.10.2': ['Low', 'Moderate', 'High'],
    '3.10.3': ['Moderate', 'High'], '3.10.4': ['Moderate', 'High'],
    '3.10.5': ['Moderate', 'High'], '3.10.6': ['Moderate', 'High'],
    // Risk Assessment
    '3.11.1': ['Low', 'Moderate', 'High'], '3.11.2': ['Low', 'Moderate', 'High'],
    '3.11.3': ['Moderate', 'High'],
    // Security Assessment
    '3.12.1': ['Low', 'Moderate', 'High'], '3.12.2': ['Moderate', 'High'],
    '3.12.3': ['Moderate', 'High'], '3.12.4': ['Moderate', 'High'],
    // System & Communications Protection
    '3.13.1': ['Low', 'Moderate', 'High'], '3.13.2': ['Moderate', 'High'],
    '3.13.3': ['Moderate', 'High'], '3.13.4': ['Moderate', 'High'],
    '3.13.5': ['Moderate', 'High'], '3.13.6': ['Moderate', 'High'],
    '3.13.7': ['Moderate', 'High'], '3.13.8': ['Moderate', 'High'],
    '3.13.9': ['Moderate', 'High'], '3.13.10': ['Moderate', 'High'],
    '3.13.11': ['Moderate', 'High'], '3.13.12': ['Moderate', 'High'],
    '3.13.13': ['Moderate', 'High'], '3.13.14': ['Moderate', 'High'],
    '3.13.15': ['Moderate', 'High'], '3.13.16': ['Moderate', 'High'],
    // System & Information Integrity
    '3.14.1': ['Low', 'Moderate', 'High'], '3.14.2': ['Low', 'Moderate', 'High'],
    '3.14.3': ['Moderate', 'High'], '3.14.4': ['Moderate', 'High'],
    '3.14.5': ['Moderate', 'High'], '3.14.6': ['Moderate', 'High'],
    '3.14.7': ['Moderate', 'High']
};

// FedRAMP 20x Low baseline — simplified controls
const FEDRAMP_20X_LOW_CONTROLS = [
    '3.1.1', '3.1.2', '3.2.1', '3.3.1', '3.3.2', '3.4.1', '3.4.2',
    '3.5.1', '3.5.2', '3.5.3', '3.6.1', '3.6.2', '3.9.1', '3.9.2',
    '3.10.1', '3.10.2', '3.11.1', '3.11.2', '3.12.1', '3.13.1',
    '3.14.1', '3.14.2'
];

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_GRC = COMPREHENSIVE_GUIDANCE_GRC;
    window.FEDRAMP_BASELINE_MAP = FEDRAMP_BASELINE_MAP;
    window.FEDRAMP_20X_LOW_CONTROLS = FEDRAMP_20X_LOW_CONTROLS;
}
