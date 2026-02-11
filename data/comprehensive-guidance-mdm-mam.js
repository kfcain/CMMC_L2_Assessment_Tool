// Comprehensive Implementation Guidance - MDM/MAM Configuration Profiles
// Provides JSON config profile examples for:
//   MDM (Mobile Device Management) - Corporate-owned device-level policies
//   MAM (Mobile Application Management) - BYOD application-level policies
// Platforms: iOS/iPadOS, Android, Windows, Linux (where applicable)
// Aligned with CIS Benchmarks + CMMC L2 requirements

const COMPREHENSIVE_GUIDANCE_MDM_MAM = {
    objectives: {

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.1 — Authorized Access Control
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.1": {
            mobile_profiles: {
                description: "Enforce authorized access to CUI on mobile devices via MDM device policies and MAM app protection policies.",
                mdm_corporate: {
                    description: "Device-level enrollment and compliance policy for corporate-owned devices",
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-AccessControl",
                            profile_type: "com.apple.configuration.managed",
                            payload: {
                                PayloadType: "Configuration",
                                PayloadDisplayName: "CMMC Corporate Access Control - iOS",
                                PayloadDescription: "Enforces device enrollment, passcode, and access restrictions for CUI access on corporate iOS devices",
                                PayloadContent: [
                                    {
                                        PayloadType: "com.apple.mobiledevice.passwordpolicy",
                                        allowSimple: false,
                                        forcePIN: true,
                                        maxPINAgeInDays: 60,
                                        minLength: 6,
                                        minComplexChars: 1,
                                        maxFailedAttempts: 10,
                                        maxGracePeriod: 0,
                                        requireAlphanumeric: true
                                    },
                                    {
                                        PayloadType: "com.apple.MCX.restrictions",
                                        allowCamera: true,
                                        allowScreenShot: false,
                                        allowCloudDocumentSync: false,
                                        allowManagedAppsCloudSync: false,
                                        forceAirDropUnmanaged: true,
                                        allowOpenFromManagedToUnmanaged: false,
                                        allowOpenFromUnmanagedToManaged: false,
                                        allowUSBRestrictedMode: true
                                    }
                                ]
                            },
                            cis_benchmark: "CIS Apple iOS 17 Benchmark v1.1.0 - Level 1",
                            cmmc_alignment: "Restricts device access, enforces strong authentication, prevents CUI leakage via managed open-in"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-AccessControl",
                            profile_type: "android.work.managed_device",
                            payload: {
                                policyName: "CMMC Corporate Access Control - Android",
                                policyType: "fully_managed_device",
                                passwordRequirements: {
                                    passwordMinimumLength: 6,
                                    passwordQuality: "COMPLEX",
                                    passwordMinimumLetters: 1,
                                    passwordMinimumNumeric: 1,
                                    passwordMinimumSymbols: 1,
                                    passwordExpirationTimeout: "5184000s",
                                    passwordHistoryLength: 12,
                                    maximumFailedPasswordsForWipe: 10
                                },
                                statusReportingSettings: {
                                    applicationReportsEnabled: true,
                                    deviceSettingsEnabled: true,
                                    networkInfoEnabled: true
                                },
                                advancedSecurityOverrides: {
                                    untrustedAppsPolicy: "DISALLOW_INSTALL",
                                    developerSettings: "DEVELOPER_SETTINGS_DISABLED",
                                    personalAppsThatCanReadWorkNotifications: []
                                }
                            },
                            cis_benchmark: "CIS Google Android 14 Benchmark v1.0.0 - Level 1",
                            cmmc_alignment: "Enforces device-level authentication, restricts untrusted apps, enables compliance reporting"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-AccessControl",
                            profile_type: "windows.mdm.policy",
                            payload: {
                                policyName: "CMMC Corporate Access Control - Windows",
                                DeviceLock: {
                                    DevicePasswordEnabled: true,
                                    MinDevicePasswordLength: 12,
                                    AlphanumericDevicePasswordRequired: true,
                                    DevicePasswordExpiration: 60,
                                    DevicePasswordHistory: 24,
                                    MaxDevicePasswordFailedAttempts: 5,
                                    MaxInactivityTimeDeviceLock: 900
                                },
                                WindowsDefenderApplicationGuard: {
                                    AllowWindowsDefenderApplicationGuard: 1,
                                    ClipboardSettings: 0,
                                    PrintingSettings: 0,
                                    BlockNonEnterpriseContent: 1
                                },
                                BitLocker: {
                                    RequireDeviceEncryption: true,
                                    EncryptionMethod: "XTS_AES_256"
                                }
                            },
                            cis_benchmark: "CIS Microsoft Windows 11 Enterprise Benchmark v3.0.0 - Level 1",
                            cmmc_alignment: "Enforces strong passwords, screen lock, BitLocker encryption, Application Guard isolation"
                        }
                    }
                },
                mam_byod: {
                    description: "Application-level protection policy for BYOD — protects CUI within managed apps without controlling the entire device",
                    platforms: {
                        ios: {
                            profile_name: "CMMC-BYOD-iOS-AppProtection",
                            profile_type: "intune.mam.ios",
                            payload: {
                                policyName: "CMMC BYOD App Protection - iOS",
                                policyType: "app_protection_policy",
                                targetApps: ["com.microsoft.outlook", "com.microsoft.teams", "com.microsoft.sharepoint"],
                                dataProtection: {
                                    allowBackup: false,
                                    allowCutCopyPaste: "managedAppsOnly",
                                    allowSaveAs: "managedLocationsOnly",
                                    allowScreenCapture: false,
                                    allowCloudStorage: ["onedrive_business", "sharepoint"],
                                    encryptAppData: true,
                                    disableContactSync: true,
                                    disablePrinting: true
                                },
                                accessRequirements: {
                                    pinRequired: true,
                                    pinMinLength: 6,
                                    pinType: "numeric",
                                    biometricAuth: true,
                                    simplePin: false,
                                    pinExpirationDays: 90,
                                    recheck_minutes_active: 30,
                                    recheck_minutes_inactive: 60,
                                    offlineGracePeriodMinutes: 720
                                },
                                conditionalLaunch: {
                                    maxOsVersion: "18.0",
                                    minOsVersion: "16.0",
                                    jailbreakDetection: "block",
                                    maxPinRetries: 5,
                                    offlineWipeDays: 30,
                                    disabledAccountAction: "wipeData"
                                }
                            },
                            cmmc_alignment: "Protects CUI in managed apps without full device control; prevents data leakage to personal apps; enforces app-level PIN and encryption"
                        },
                        android: {
                            profile_name: "CMMC-BYOD-Android-AppProtection",
                            profile_type: "intune.mam.android",
                            payload: {
                                policyName: "CMMC BYOD App Protection - Android",
                                policyType: "app_protection_policy",
                                targetApps: ["com.microsoft.outlook", "com.microsoft.teams", "com.microsoft.sharepoint"],
                                dataProtection: {
                                    allowBackup: false,
                                    allowCutCopyPaste: "managedAppsOnly",
                                    allowSaveAs: "managedLocationsOnly",
                                    allowScreenCapture: false,
                                    allowCloudStorage: ["onedrive_business", "sharepoint"],
                                    encryptAppData: true,
                                    disableContactSync: true,
                                    disablePrinting: true,
                                    blockThirdPartyKeyboard: true
                                },
                                accessRequirements: {
                                    pinRequired: true,
                                    pinMinLength: 6,
                                    pinType: "numeric",
                                    biometricAuth: true,
                                    simplePin: false,
                                    recheck_minutes_active: 30,
                                    recheck_minutes_inactive: 60,
                                    offlineGracePeriodMinutes: 720
                                },
                                conditionalLaunch: {
                                    minOsVersion: "13.0",
                                    rootDetection: "block",
                                    safetyNetAttestation: "basicIntegrityAndDeviceCertification",
                                    maxPinRetries: 5,
                                    offlineWipeDays: 30,
                                    disabledAccountAction: "wipeData"
                                }
                            },
                            cmmc_alignment: "Protects CUI in work profile apps; blocks rooted devices; enforces app-level encryption and PIN; prevents data leakage to personal apps"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.3 — Control CUI Flow
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.3": {
            mobile_profiles: {
                description: "Control the flow of CUI between managed and unmanaged apps/locations on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-DataFlow",
                            payload: {
                                PayloadContent: [
                                    {
                                        PayloadType: "com.apple.MCX.restrictions",
                                        allowOpenFromManagedToUnmanaged: false,
                                        allowOpenFromUnmanagedToManaged: false,
                                        forceAirDropUnmanaged: true,
                                        allowManagedAppsCloudSync: false,
                                        allowCloudDocumentSync: false,
                                        allowActivityContinuation: false,
                                        allowClipboardManagedToUnmanaged: false
                                    }
                                ]
                            },
                            cmmc_alignment: "Prevents CUI from flowing between managed (corporate) and unmanaged (personal) apps via open-in, AirDrop, clipboard, and cloud sync"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-DataFlow",
                            payload: {
                                crossProfilePolicies: {
                                    crossProfileCopyPaste: "CROSS_PROFILE_COPY_PASTE_DISALLOWED",
                                    crossProfileDataSharing: "CROSS_PROFILE_DATA_SHARING_DISALLOWED",
                                    showWorkContactsInPersonalProfile: "DISALLOWED",
                                    workProfileWidgetsDefault: "DISALLOWED"
                                },
                                personalUsagePolicies: {
                                    personalApplications: [],
                                    cameraDisabled: false,
                                    screenCaptureDisabled: true
                                }
                            },
                            cmmc_alignment: "Enforces work profile isolation; blocks cross-profile copy/paste and data sharing; prevents CUI leakage to personal profile"
                        }
                    }
                },
                mam_byod: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-BYOD-iOS-DataFlow",
                            payload: {
                                dataProtection: {
                                    allowCutCopyPaste: "managedAppsOnly",
                                    allowSaveAs: "managedLocationsOnly",
                                    allowCloudStorage: ["onedrive_business"],
                                    receiveDataFromOtherApps: "managedApps",
                                    sendDataToOtherApps: "managedApps",
                                    allowThirdPartyKeyboard: false
                                }
                            },
                            cmmc_alignment: "App-level data flow control: CUI can only move between managed apps and approved cloud locations"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.12 — Session Lock
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.12": {
            mobile_profiles: {
                description: "Enforce automatic session lock on mobile devices after inactivity.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-SessionLock",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.mobiledevice.passwordpolicy",
                                    maxInactivity: 5,
                                    maxGracePeriod: 0,
                                    forcePIN: true
                                }]
                            },
                            cis_benchmark: "CIS Apple iOS 17 - 2.1.1 Ensure 'Auto-Lock' is set to '5 minutes or less'",
                            cmmc_alignment: "Auto-lock after 5 minutes of inactivity; immediate passcode required on wake"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-SessionLock",
                            payload: {
                                passwordRequirements: {
                                    maximumTimeToLock: "300000",
                                    passwordQuality: "COMPLEX"
                                }
                            },
                            cis_benchmark: "CIS Android 14 - 1.2 Ensure screen lock timeout is 5 minutes or less",
                            cmmc_alignment: "Device locks after 5 minutes; complex password required to unlock"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-SessionLock",
                            payload: {
                                DeviceLock: {
                                    MaxInactivityTimeDeviceLock: 300,
                                    DevicePasswordEnabled: true
                                },
                                LocalPoliciesSecurityOptions: {
                                    InteractiveLogon_MachineInactivityLimit: 300
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 2.3.7.3 Interactive logon: Machine inactivity limit = 300 seconds",
                            cmmc_alignment: "Screen lock after 5 minutes of inactivity on Windows endpoints"
                        },
                        linux: {
                            profile_name: "CMMC-Corp-Linux-SessionLock",
                            payload: {
                                gsettings: {
                                    "org.gnome.desktop.session": { "idle-delay": 300 },
                                    "org.gnome.desktop.screensaver": { "lock-enabled": true, "lock-delay": 0 }
                                },
                                tmux_conf: "set-option -g lock-after-time 300\nset-option -g lock-command 'vlock -a'"
                            },
                            cis_benchmark: "CIS Ubuntu 22.04 LTS - 1.8.4 Ensure GNOME screen lock is enabled",
                            cmmc_alignment: "GNOME screensaver locks after 5 minutes; terminal sessions lock via tmux/vlock"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.13 — Remote Access
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.13": {
            mobile_profiles: {
                description: "Enforce VPN and conditional access for remote CUI access from mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-RemoteAccess",
                            payload: {
                                PayloadContent: [
                                    {
                                        PayloadType: "com.apple.vpn.managed",
                                        VPNType: "IKEv2",
                                        OnDemandEnabled: 1,
                                        OnDemandRules: [
                                            { Action: "Connect", InterfaceTypeMatch: "WiFi" },
                                            { Action: "Connect", InterfaceTypeMatch: "Cellular" }
                                        ],
                                        AlwaysOn: true
                                    },
                                    {
                                        PayloadType: "com.apple.wifi.managed",
                                        AutoJoin: false,
                                        CaptiveBypass: false,
                                        DisableAssociationMACRandomization: false
                                    }
                                ]
                            },
                            cmmc_alignment: "Always-on VPN for corporate iOS devices; all CUI traffic encrypted in transit"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-RemoteAccess",
                            payload: {
                                alwaysOnVpnPackage: {
                                    packageName: "com.example.vpn",
                                    lockdownEnabled: true
                                },
                                networkConfiguration: {
                                    openNetworkConfiguration: {
                                        Type: "UnencryptedConfiguration",
                                        NetworkConfigurations: [{
                                            Type: "VPN",
                                            VPN: {
                                                Type: "IKEv2",
                                                AutoConnect: true
                                            }
                                        }]
                                    }
                                }
                            },
                            cmmc_alignment: "Always-on VPN with lockdown; no network access without VPN connection"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-RemoteAccess",
                            payload: {
                                VPNv2: {
                                    ProfileName: "CMMC-AlwaysOnVPN",
                                    AlwaysOn: true,
                                    DeviceTunnel: true,
                                    NativeProfile: {
                                        NativeProtocolType: "IKEv2",
                                        Authentication: { MachineMethod: "Certificate" },
                                        RoutingPolicyType: "ForceTunnel"
                                    },
                                    DomainNameInformation: [{
                                        DomainName: ".corp.example.com",
                                        AutoTrigger: true
                                    }]
                                }
                            },
                            cmmc_alignment: "Windows Always On VPN with device tunnel; certificate-based auth; force tunnel for all CUI traffic"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.18 — Mobile Device Connection
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.18": {
            mobile_profiles: {
                description: "Control connection of mobile devices to organizational systems containing CUI. Enforce enrollment, compliance checks, and conditional access before granting access.",
                mdm_corporate: {
                    description: "Corporate device enrollment and compliance gate — device must be enrolled and compliant before accessing CUI resources",
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-DeviceCompliance",
                            profile_type: "com.apple.configuration.managed",
                            payload: {
                                PayloadDisplayName: "CMMC Corporate Device Compliance - iOS",
                                compliancePolicy: {
                                    requireDeviceEnrollment: true,
                                    requireSupervised: true,
                                    minimumOsVersion: "16.0",
                                    requirePasscode: true,
                                    requireEncryption: true,
                                    jailbreakDetection: "block",
                                    requireManagedEmail: true,
                                    allowedApps: "managedAppsOnly"
                                },
                                conditionalAccess: {
                                    requireCompliantDevice: true,
                                    requireMFA: true,
                                    blockNonCompliant: true,
                                    gracePeriodHours: 24
                                }
                            },
                            cis_benchmark: "CIS Apple iOS 17 Benchmark v1.1.0 - Level 2 (Supervised)",
                            cmmc_alignment: "Only supervised, enrolled, compliant iOS devices can connect to CUI systems; jailbreak detection blocks compromised devices"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-DeviceCompliance",
                            profile_type: "android.work.fully_managed",
                            payload: {
                                policyName: "CMMC Corporate Device Compliance - Android",
                                compliancePolicy: {
                                    requireDeviceEnrollment: true,
                                    minimumApiLevel: 33,
                                    securityPatchMinimumDate: "auto_rolling_30_days",
                                    requireEncryption: true,
                                    rootDetection: "block",
                                    safetyNetAttestation: "HARDWARE_BACKED",
                                    requireGooglePlayProtect: true,
                                    allowUnknownSources: false
                                },
                                conditionalAccess: {
                                    requireCompliantDevice: true,
                                    requireMFA: true,
                                    blockNonCompliant: true,
                                    gracePeriodHours: 24
                                }
                            },
                            cis_benchmark: "CIS Google Android 14 Benchmark v1.0.0 - Level 2",
                            cmmc_alignment: "Fully managed Android devices must pass SafetyNet, be encrypted, patched, and enrolled before CUI access"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-DeviceCompliance",
                            profile_type: "windows.mdm.compliance",
                            payload: {
                                policyName: "CMMC Corporate Device Compliance - Windows",
                                compliancePolicy: {
                                    requireBitLocker: true,
                                    requireSecureBoot: true,
                                    requireTPM: true,
                                    requireCodeIntegrity: true,
                                    requireAntiVirus: true,
                                    requireAntiSpyware: true,
                                    requireFirewall: true,
                                    minimumOsVersion: "10.0.22621",
                                    requireDeviceEnrollment: true,
                                    passwordRequired: true,
                                    passwordMinLength: 12
                                },
                                conditionalAccess: {
                                    requireCompliantDevice: true,
                                    requireHybridAzureADJoin: true,
                                    requireMFA: true,
                                    blockNonCompliant: true
                                }
                            },
                            cis_benchmark: "CIS Microsoft Windows 11 Enterprise Benchmark v3.0.0 - Level 1",
                            cmmc_alignment: "Windows devices must be enrolled, BitLocker-encrypted, Secure Boot enabled, TPM present, AV active, and compliant before CUI access"
                        },
                        linux: {
                            profile_name: "CMMC-Corp-Linux-DeviceCompliance",
                            profile_type: "linux.mdm.compliance",
                            payload: {
                                policyName: "CMMC Corporate Device Compliance - Linux",
                                compliancePolicy: {
                                    requireDiskEncryption: true,
                                    encryptionType: "LUKS2",
                                    requireFirewall: true,
                                    firewallType: "ufw_or_firewalld",
                                    requireEDR: true,
                                    minimumKernelVersion: "5.15",
                                    requireSELinuxOrAppArmor: true,
                                    requireSSHKeyAuth: true,
                                    disableRootSSH: true
                                },
                                conditionalAccess: {
                                    requireCertificateAuth: true,
                                    requireMFA: true,
                                    blockNonCompliant: true
                                }
                            },
                            cis_benchmark: "CIS Ubuntu 22.04 LTS Benchmark v2.0.0 - Level 1",
                            cmmc_alignment: "Linux endpoints must have LUKS encryption, firewall, EDR, SELinux/AppArmor, and SSH key auth before CUI access"
                        }
                    }
                },
                mam_byod: {
                    description: "BYOD app protection — CUI is protected at the application level without requiring full device enrollment",
                    platforms: {
                        ios: {
                            profile_name: "CMMC-BYOD-iOS-ConnectionControl",
                            profile_type: "intune.mam.ios",
                            payload: {
                                policyName: "CMMC BYOD Connection Control - iOS",
                                conditionalLaunch: {
                                    minOsVersion: "16.0",
                                    jailbreakDetection: "wipeData",
                                    maxPinRetries: 5,
                                    offlineGracePeriodMinutes: 720,
                                    offlineWipeDays: 30,
                                    requireAppIntegrity: true
                                },
                                accessRequirements: {
                                    pinRequired: true,
                                    biometricAuth: true,
                                    recheck_minutes_active: 30,
                                    requireManagedBrowser: true
                                },
                                dataProtection: {
                                    encryptAppData: true,
                                    allowBackup: false,
                                    allowScreenCapture: false,
                                    allowCutCopyPaste: "managedAppsOnly"
                                }
                            },
                            cmmc_alignment: "BYOD iOS: CUI protected in managed apps; jailbreak wipes corporate data; app PIN + biometric required; no data leakage to personal apps"
                        },
                        android: {
                            profile_name: "CMMC-BYOD-Android-ConnectionControl",
                            profile_type: "intune.mam.android",
                            payload: {
                                policyName: "CMMC BYOD Connection Control - Android",
                                conditionalLaunch: {
                                    minOsVersion: "13.0",
                                    rootDetection: "wipeData",
                                    safetyNetAttestation: "basicIntegrityAndDeviceCertification",
                                    maxPinRetries: 5,
                                    offlineWipeDays: 30,
                                    requireAppIntegrity: true
                                },
                                accessRequirements: {
                                    pinRequired: true,
                                    biometricAuth: true,
                                    recheck_minutes_active: 30,
                                    requireManagedBrowser: true,
                                    blockThirdPartyKeyboard: true
                                },
                                dataProtection: {
                                    encryptAppData: true,
                                    allowBackup: false,
                                    allowScreenCapture: false,
                                    allowCutCopyPaste: "managedAppsOnly"
                                }
                            },
                            cmmc_alignment: "BYOD Android: CUI in work profile; root detection wipes corporate data; SafetyNet attestation required; third-party keyboards blocked"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // AC.L2-3.1.19 — Encrypt CUI on Mobile Devices
        // ═══════════════════════════════════════════════════════════════
        "AC.L2-3.1.19": {
            mobile_profiles: {
                description: "Encrypt CUI on mobile devices and mobile computing platforms.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-Encryption",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.mobiledevice.passwordpolicy",
                                    forcePIN: true,
                                    _note: "iOS devices with passcode enabled have hardware AES-256 encryption active by default (Data Protection Class A)"
                                }],
                                complianceCheck: {
                                    requireEncryption: true,
                                    encryptionType: "hardware_aes256",
                                    requirePasscode: true
                                }
                            },
                            cis_benchmark: "CIS Apple iOS 17 - 2.1.1 (passcode enables Data Protection encryption)",
                            cmmc_alignment: "iOS hardware encryption (AES-256) is always on when passcode is set; verify via compliance policy"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-Encryption",
                            payload: {
                                encryptionPolicy: {
                                    storageEncryption: { requireEncryption: true },
                                    _note: "Android 10+ devices use file-based encryption (FBE) by default"
                                },
                                advancedSecurityOverrides: {
                                    commonCriteriaMode: "COMMON_CRITERIA_MODE_ENABLED"
                                }
                            },
                            cis_benchmark: "CIS Android 14 - 1.1 Ensure device encryption is enabled",
                            cmmc_alignment: "Android file-based encryption enforced; Common Criteria mode enables FIPS-validated crypto"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-Encryption",
                            payload: {
                                BitLocker: {
                                    RequireDeviceEncryption: true,
                                    AllowStandardUserEncryption: true,
                                    EncryptionMethodByDriveType: {
                                        OperatingSystemDrives: { EncryptionMethod: "XTS_AES_256", RequireStartupAuthentication: true },
                                        FixedDataDrives: { EncryptionMethod: "XTS_AES_256", RequireEncryption: true },
                                        RemovableDataDrives: { EncryptionMethod: "AES_CBC_256", RequireEncryption: true }
                                    },
                                    SystemDrivesRecoveryOptions: {
                                        RecoveryKeyRotation: true,
                                        BackupToAAD: true
                                    }
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.10.9 BitLocker Drive Encryption",
                            cmmc_alignment: "BitLocker XTS-AES-256 for OS and fixed drives; AES-CBC-256 for removable; recovery keys backed to Azure AD"
                        },
                        linux: {
                            profile_name: "CMMC-Corp-Linux-Encryption",
                            payload: {
                                diskEncryption: {
                                    type: "LUKS2",
                                    cipher: "aes-xts-plain64",
                                    keySize: 512,
                                    requireAtInstall: true,
                                    _note: "LUKS2 with AES-XTS-256 provides FIPS 140-2 compliant full-disk encryption"
                                },
                                verificationCommand: "cryptsetup luksDump /dev/sda3 | grep cipher"
                            },
                            cis_benchmark: "CIS Ubuntu 22.04 - 1.4.1 Ensure LUKS encryption is configured",
                            cmmc_alignment: "LUKS2 full-disk encryption with AES-XTS-256; verified at enrollment"
                        }
                    }
                },
                mam_byod: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-BYOD-iOS-AppEncryption",
                            payload: {
                                dataProtection: {
                                    encryptAppData: true,
                                    _note: "Intune MAM encrypts app data using AES-128 at the app container level, separate from device encryption"
                                }
                            },
                            cmmc_alignment: "App-level encryption for CUI data within managed apps; independent of device encryption status"
                        },
                        android: {
                            profile_name: "CMMC-BYOD-Android-AppEncryption",
                            payload: {
                                dataProtection: {
                                    encryptAppData: true,
                                    _note: "Work profile provides encrypted container; Intune adds app-level encryption layer"
                                }
                            },
                            cmmc_alignment: "Work profile encryption + app-level encryption for CUI data in managed apps"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CM.L2-3.4.1 — Baseline Configuration
        // ═══════════════════════════════════════════════════════════════
        "CM.L2-3.4.1": {
            mobile_profiles: {
                description: "Establish and maintain baseline configurations for mobile devices accessing CUI.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-Baseline",
                            payload: {
                                PayloadDisplayName: "CMMC iOS Baseline Configuration",
                                PayloadContent: [
                                    {
                                        PayloadType: "com.apple.MCX.restrictions",
                                        allowAppInstallation: false,
                                        allowAppRemoval: false,
                                        allowAutoUnlock: false,
                                        allowDiagnosticSubmission: false,
                                        allowEnablingRestrictions: false,
                                        allowEraseContentAndSettings: false,
                                        allowInAppPurchases: false,
                                        allowModifyingAccountSettings: false,
                                        allowConfigurationProfileInstallation: false,
                                        forceAutomaticDateAndTime: true,
                                        forceEncryptedBackup: true
                                    },
                                    {
                                        PayloadType: "com.apple.applicationaccess",
                                        allowListedAppBundleIDs: [
                                            "com.microsoft.outlook",
                                            "com.microsoft.teams",
                                            "com.microsoft.sharepoint",
                                            "com.microsoft.authenticator"
                                        ]
                                    }
                                ]
                            },
                            cis_benchmark: "CIS Apple iOS 17 Benchmark v1.1.0 - Level 2 (Supervised)",
                            cmmc_alignment: "Locked-down iOS baseline: no user app installs, no profile changes, forced encrypted backups, app allowlist"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-Baseline",
                            payload: {
                                policyName: "CMMC Android Baseline Configuration",
                                applications: {
                                    installType: "BLOCKED",
                                    defaultPermissionPolicy: "DENY",
                                    allowedApplications: [
                                        { packageName: "com.microsoft.outlook", installType: "FORCE_INSTALLED" },
                                        { packageName: "com.microsoft.teams", installType: "FORCE_INSTALLED" },
                                        { packageName: "com.microsoft.authenticator", installType: "FORCE_INSTALLED" }
                                    ]
                                },
                                systemUpdate: { type: "WINDOWED", startMinutes: 120, endMinutes: 300 },
                                factoryResetDisabled: true,
                                addUserDisabled: true,
                                modifyAccountsDisabled: true,
                                autoDateAndTimeZone: "AUTO_DATE_AND_TIME_ZONE_ENFORCED"
                            },
                            cis_benchmark: "CIS Google Android 14 Benchmark v1.0.0 - Level 2",
                            cmmc_alignment: "Locked-down Android baseline: blocked app installs, forced updates in maintenance window, factory reset disabled"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-Baseline",
                            payload: {
                                policyName: "CMMC Windows Baseline Configuration",
                                WindowsUpdate: {
                                    AutoUpdateMode: "AutoInstallAndRebootAtMaintenanceTime",
                                    ActiveHoursStart: 8,
                                    ActiveHoursEnd: 17,
                                    DeferQualityUpdatesPeriodInDays: 7,
                                    DeferFeatureUpdatesPeriodInDays: 30
                                },
                                Defender: {
                                    RealTimeMonitoring: true,
                                    CloudProtection: true,
                                    SubmitSamplesConsent: "SendSafeSamples",
                                    AttackSurfaceReductionRules: "Enable"
                                },
                                Firewall: {
                                    EnableFirewall_DomainProfile: true,
                                    EnableFirewall_PrivateProfile: true,
                                    EnableFirewall_PublicProfile: true,
                                    DefaultInboundAction_PublicProfile: "Block"
                                }
                            },
                            cis_benchmark: "CIS Microsoft Windows 11 Enterprise Benchmark v3.0.0 - Level 1",
                            cmmc_alignment: "Windows baseline: auto-updates, Defender real-time protection, ASR rules, firewall enabled on all profiles"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CM.L2-3.4.2 — Security Configuration Enforcement
        // ═══════════════════════════════════════════════════════════════
        "CM.L2-3.4.2": {
            mobile_profiles: {
                description: "Enforce security configuration settings on mobile devices and remediate non-compliance.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-ConfigEnforcement",
                            payload: {
                                complianceActions: {
                                    nonCompliantActions: [
                                        { daysAfterNonCompliance: 0, action: "pushNotification", message: "Your device is non-compliant. Please update settings." },
                                        { daysAfterNonCompliance: 1, action: "markNonCompliant" },
                                        { daysAfterNonCompliance: 3, action: "blockAccess" },
                                        { daysAfterNonCompliance: 14, action: "retireDevice" }
                                    ]
                                }
                            },
                            cmmc_alignment: "Graduated compliance enforcement: notify → mark → block → retire for non-compliant iOS devices"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-ConfigEnforcement",
                            payload: {
                                complianceActions: {
                                    nonCompliantActions: [
                                        { daysAfterNonCompliance: 0, action: "pushNotification" },
                                        { daysAfterNonCompliance: 1, action: "markNonCompliant" },
                                        { daysAfterNonCompliance: 3, action: "blockAccess" },
                                        { daysAfterNonCompliance: 14, action: "wipeDevice" }
                                    ]
                                }
                            },
                            cmmc_alignment: "Graduated compliance enforcement for Android; wipe after 14 days non-compliant"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CM.L2-3.4.6 — Least Functionality
        // ═══════════════════════════════════════════════════════════════
        "CM.L2-3.4.6": {
            mobile_profiles: {
                description: "Restrict mobile devices to essential functions only for CUI access.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-LeastFunction",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.MCX.restrictions",
                                    allowSafari: false,
                                    allowVideoConferencing: false,
                                    allowGameCenter: false,
                                    allowBookstore: false,
                                    allowNews: false,
                                    allowPodcasts: false,
                                    allowMusicService: false,
                                    allowRadioService: false,
                                    allowSiri: false,
                                    allowSiriServerLogging: false,
                                    allowSpotlightInternetResults: false,
                                    allowCloudPrivateRelay: false,
                                    allowNFC: false,
                                    allowPersonalHotspot: false
                                }]
                            },
                            cis_benchmark: "CIS Apple iOS 17 - Multiple Level 2 restrictions",
                            cmmc_alignment: "Disable non-essential iOS services: Safari, Siri, Game Center, NFC, personal hotspot for CUI-dedicated devices"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-LeastFunction",
                            payload: {
                                kioskCustomization: {
                                    statusBar: "STATUS_BAR_DISABLED",
                                    systemNavigation: "HOME_BUTTON_ONLY"
                                },
                                advancedSecurityOverrides: {
                                    untrustedAppsPolicy: "DISALLOW_INSTALL",
                                    developerSettings: "DEVELOPER_SETTINGS_DISABLED"
                                },
                                bluetoothDisabled: false,
                                nfcDisabled: true,
                                tetheringConfigDisabled: true,
                                usbFileTransferDisabled: true,
                                shareLocationDisabled: true
                            },
                            cmmc_alignment: "Disable non-essential Android features: NFC, tethering, USB file transfer, location sharing"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // CM.L2-3.4.7 — Restrict Nonessential Programs/Functions
        // ═══════════════════════════════════════════════════════════════
        "CM.L2-3.4.7": {
            mobile_profiles: {
                description: "Restrict or disable nonessential programs, functions, ports, protocols, and services on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-RestrictPrograms",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.MCX.restrictions",
                                    allowAppInstallation: false,
                                    allowUSBRestrictedMode: true,
                                    allowAirDrop: false,
                                    allowBluetoothModification: false,
                                    allowVPNCreation: false,
                                    allowWallpaperModification: false
                                }]
                            },
                            cmmc_alignment: "Block app installation, AirDrop, Bluetooth changes, VPN creation on CUI iOS devices"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-RestrictPrograms",
                            payload: {
                                ApplicationControl: {
                                    AppLockerPolicy: {
                                        RuleCollections: [
                                            {
                                                Type: "Exe",
                                                EnforcementMode: "Enabled",
                                                Rules: [
                                                    { Action: "Allow", Publisher: "O=MICROSOFT CORPORATION" },
                                                    { Action: "Allow", Path: "%PROGRAMFILES%\\Approved\\*" },
                                                    { Action: "Deny", Path: "*" }
                                                ]
                                            }
                                        ]
                                    }
                                },
                                RemovableStorage: {
                                    DenyAllAccess: true,
                                    AllowReadAccess: false,
                                    AllowWriteAccess: false
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.10.80 Windows Defender Application Control",
                            cmmc_alignment: "AppLocker allowlist for executables; block all removable storage; only approved software runs"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // IA.L2-3.5.3 — Multifactor Authentication
        // ═══════════════════════════════════════════════════════════════
        "IA.L2-3.5.3": {
            mobile_profiles: {
                description: "Use multifactor authentication for local and network access on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-MFA",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.mobiledevice.passwordpolicy",
                                    forcePIN: true,
                                    allowSimple: false,
                                    requireAlphanumeric: true,
                                    minLength: 6,
                                    _note: "Device passcode + biometric (Face ID/Touch ID) = two factors. Conditional Access enforces MFA for cloud app access."
                                }],
                                conditionalAccessPolicy: {
                                    grantControls: {
                                        requireMFA: true,
                                        requireCompliantDevice: true,
                                        requireApprovedClientApp: true
                                    }
                                }
                            },
                            cmmc_alignment: "Device biometric + passcode for local access; Conditional Access MFA for network/cloud access to CUI"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-MFA",
                            payload: {
                                passwordRequirements: {
                                    passwordQuality: "COMPLEX",
                                    passwordMinimumLength: 6,
                                    requirePasswordUnlock: "REQUIRE_EVERY_DAY"
                                },
                                conditionalAccessPolicy: {
                                    grantControls: {
                                        requireMFA: true,
                                        requireCompliantDevice: true,
                                        requireApprovedClientApp: true
                                    }
                                }
                            },
                            cmmc_alignment: "Complex device password + biometric for local; Conditional Access MFA for CUI cloud resources"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SC.L2-3.13.8 — CUI in Transit
        // ═══════════════════════════════════════════════════════════════
        "SC.L2-3.13.8": {
            mobile_profiles: {
                description: "Implement cryptographic mechanisms to protect CUI during transmission on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-TransitEncryption",
                            payload: {
                                PayloadContent: [
                                    {
                                        PayloadType: "com.apple.vpn.managed",
                                        VPNType: "IKEv2",
                                        IKEv2: {
                                            EncryptionAlgorithm: "AES-256-GCM",
                                            IntegrityAlgorithm: "SHA2-256",
                                            DiffieHellmanGroup: 20
                                        }
                                    },
                                    {
                                        PayloadType: "com.apple.wifi.managed",
                                        EncryptionType: "WPA3",
                                        TLSMinimumVersion: "1.2"
                                    }
                                ]
                            },
                            cmmc_alignment: "IKEv2 VPN with AES-256-GCM; WPA3 WiFi; TLS 1.2 minimum for all CUI in transit"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-TransitEncryption",
                            payload: {
                                TLS: {
                                    MinimumVersion: "1.2",
                                    DisableSSL3: true,
                                    DisableTLS10: true,
                                    DisableTLS11: true,
                                    CipherSuites: [
                                        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                                        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                                        "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"
                                    ]
                                },
                                SMB: {
                                    RequireEncryption: true,
                                    MinimumVersion: "3.1.1"
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.4.1 Ensure TLS 1.2 is minimum",
                            cmmc_alignment: "TLS 1.2+ only; disable legacy SSL/TLS; FIPS-approved cipher suites; SMB 3.1.1 encryption"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SI.L2-3.14.2 — Malicious Code Protection
        // ═══════════════════════════════════════════════════════════════
        "SI.L2-3.14.2": {
            mobile_profiles: {
                description: "Provide protection from malicious code on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-MalwareProtection",
                            payload: {
                                compliancePolicy: {
                                    jailbreakDetection: "block",
                                    requireManagedAppsOnly: true,
                                    requireAppStoreOnly: true,
                                    _note: "iOS sandboxing + App Store review + jailbreak detection provides malware protection. Deploy MTD (Mobile Threat Defense) for advanced protection."
                                },
                                mobileThreatDefense: {
                                    provider: "Microsoft Defender for Endpoint",
                                    maxAllowedThreatLevel: "low",
                                    blockOnHighThreat: true
                                }
                            },
                            cmmc_alignment: "Jailbreak detection + App Store only + MTD integration for comprehensive iOS malware protection"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-MalwareProtection",
                            payload: {
                                advancedSecurityOverrides: {
                                    untrustedAppsPolicy: "DISALLOW_INSTALL",
                                    googlePlayProtectVerifyApps: "VERIFY_APPS_ENFORCED"
                                },
                                mobileThreatDefense: {
                                    provider: "Microsoft Defender for Endpoint",
                                    maxAllowedThreatLevel: "low",
                                    blockOnHighThreat: true
                                }
                            },
                            cmmc_alignment: "Google Play Protect + no sideloading + MTD for Android malware protection"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-MalwareProtection",
                            payload: {
                                Defender: {
                                    RealTimeMonitoring: true,
                                    BehaviorMonitoring: true,
                                    CloudProtection: true,
                                    CloudBlockLevel: "HighPlus",
                                    PUAProtection: "Enabled",
                                    SubmitSamplesConsent: "SendSafeSamples",
                                    SignatureUpdateInterval: 4,
                                    AttackSurfaceReductionRules: {
                                        BlockExecutableContentFromEmail: "Block",
                                        BlockOfficeChildProcess: "Block",
                                        BlockAdobeReaderChildProcess: "Block",
                                        BlockWin32APIFromOfficeMacro: "Block",
                                        BlockCredentialStealingFromLSASS: "Block",
                                        BlockUntrustedUnsignedProcessesFromUSB: "Block",
                                        BlockPersistenceThroughWMI: "Block"
                                    }
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.10.43 Microsoft Defender Antivirus",
                            cmmc_alignment: "Defender real-time + behavior + cloud protection; ASR rules block common attack vectors; 4-hour signature updates"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // SI.L2-3.14.4 — Update Malicious Code Protection
        // ═══════════════════════════════════════════════════════════════
        "SI.L2-3.14.4": {
            mobile_profiles: {
                description: "Update malicious code protection mechanisms on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-Updates",
                            payload: {
                                softwareUpdate: {
                                    AutomaticOSUpdatesEnabled: true,
                                    AutomaticAppUpdatesEnabled: true,
                                    CriticalUpdateInstall: true,
                                    enforcedSoftwareUpdateDelay: 3,
                                    _note: "iOS auto-updates ensure latest security patches; 3-day delay for testing"
                                }
                            },
                            cis_benchmark: "CIS Apple iOS 17 - 3.1 Ensure automatic updates are enabled",
                            cmmc_alignment: "Automatic OS and app updates with 3-day delay for enterprise testing"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-Updates",
                            payload: {
                                systemUpdate: {
                                    type: "WINDOWED",
                                    startMinutes: 120,
                                    endMinutes: 300,
                                    freezePeriods: []
                                },
                                autoUpdateMode: "AUTO_UPDATE_HIGH_PRIORITY"
                            },
                            cmmc_alignment: "Android system updates in maintenance window (2-5 AM); high-priority app auto-updates"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-Updates",
                            payload: {
                                WindowsUpdate: {
                                    AutoUpdateMode: "AutoInstallAndRebootAtMaintenanceTime",
                                    ScheduledInstallDay: 0,
                                    ScheduledInstallTime: 3,
                                    DeferQualityUpdatesPeriodInDays: 3,
                                    DeferFeatureUpdatesPeriodInDays: 30,
                                    PauseQualityUpdatesStartTime: "",
                                    UpdateServiceUrl: ""
                                },
                                DefenderSignatureUpdate: {
                                    SignatureUpdateInterval: 4,
                                    SignatureUpdateFallbackOrder: "MicrosoftUpdateServer|MMPC"
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.10.92 Windows Update",
                            cmmc_alignment: "Auto-install updates at 3 AM; 3-day quality update deferral; 4-hour Defender signature updates"
                        }
                    }
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // MP.L2-3.8.7 — Removable Media on Mobile
        // ═══════════════════════════════════════════════════════════════
        "MP.L2-3.8.7": {
            mobile_profiles: {
                description: "Control the use of removable media and external storage on mobile devices.",
                mdm_corporate: {
                    platforms: {
                        ios: {
                            profile_name: "CMMC-Corp-iOS-RemovableMedia",
                            payload: {
                                PayloadContent: [{
                                    PayloadType: "com.apple.MCX.restrictions",
                                    allowUSBRestrictedMode: true,
                                    allowFilesUSBDriveAccess: false,
                                    allowFilesNetworkDriveAccess: false,
                                    _note: "iOS inherently restricts USB access; USB Restricted Mode adds time-based lockout"
                                }]
                            },
                            cmmc_alignment: "USB Restricted Mode enabled; no Files app access to USB or network drives"
                        },
                        android: {
                            profile_name: "CMMC-Corp-Android-RemovableMedia",
                            payload: {
                                usbFileTransferDisabled: true,
                                mountPhysicalMediaDisabled: true,
                                usbDataSignalingDisabled: true
                            },
                            cmmc_alignment: "Block USB file transfer, physical media mounting, and USB data signaling on Android"
                        },
                        windows: {
                            profile_name: "CMMC-Corp-Windows-RemovableMedia",
                            payload: {
                                RemovableStorage: {
                                    DenyAllAccess: true,
                                    DenyReadAccess: true,
                                    DenyWriteAccess: true,
                                    DenyExecuteAccess: true
                                },
                                WPDDevices: {
                                    DenyReadAccess: true,
                                    DenyWriteAccess: true
                                }
                            },
                            cis_benchmark: "CIS Windows 11 - 18.10.87 Removable Storage Access",
                            cmmc_alignment: "Block all removable storage access (read/write/execute) and WPD devices on Windows"
                        }
                    }
                }
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_MDM_MAM };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_MDM_MAM = COMPREHENSIVE_GUIDANCE_MDM_MAM;
}
