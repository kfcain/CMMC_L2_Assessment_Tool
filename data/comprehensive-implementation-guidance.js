// Comprehensive Implementation Guidance Library
// Covers all 320 CMMC Assessment Objectives across all platforms, stacks, and scenarios
// Version: 1.0.0

/**
 * GUIDANCE STRUCTURE:
 * Each assessment objective can have guidance for multiple platforms/scenarios:
 * - Cloud Platforms: AWS, Azure, GCP, Oracle Cloud, IBM Cloud, DigitalOcean, Linode, etc.
 * - SaaS Platforms: Microsoft 365, Google Workspace, Salesforce, Slack, etc.
 * - Custom Applications: Node.js, Python, Java, .NET, mobile apps, etc.
 * - Databases: PostgreSQL, MySQL, MongoDB, SQL Server, etc.
 * - Network/Infrastructure: VMware, Cisco, Palo Alto, pfSense, etc.
 * - IAM Platforms: Okta, Azure AD, Auth0, Keycloak, etc.
 * - Industry-Specific: Manufacturing, Aerospace, Healthcare, Financial, etc.
 * - Small Business: Budget-conscious, open-source, simplified approaches
 */

const COMPREHENSIVE_GUIDANCE = {
    version: "1.0.0",
    lastUpdated: "2026-02-05",
    
    // Platform categories for filtering
    platformCategories: {
        cloud: {
            name: "Cloud Platforms",
            platforms: ["aws", "azure", "gcp", "oracle", "ibm", "alibaba", "digitalocean", "linode", "vultr", "hetzner"]
        },
        saas: {
            name: "SaaS Applications",
            platforms: ["microsoft365", "google_workspace", "salesforce", "slack", "zoom", "github", "jira", "servicenow"]
        },
        custom_app: {
            name: "Custom Applications",
            stacks: ["nodejs", "python", "java", "dotnet", "php", "ruby", "go", "ios", "android", "electron"]
        },
        database: {
            name: "Databases",
            platforms: ["postgresql", "mysql", "mssql", "oracle_db", "mongodb", "redis", "cassandra", "dynamodb"]
        },
        network: {
            name: "Network & Infrastructure",
            platforms: ["vmware", "hyperv", "proxmox", "cisco", "paloalto", "fortinet", "ubiquiti", "pfsense"]
        },
        iam: {
            name: "Identity & Access Management",
            platforms: ["okta", "azure_ad", "ping", "auth0", "keycloak", "freeipa"]
        },
        security_tools: {
            name: "Security Tools",
            platforms: ["splunk", "elk", "sentinel", "crowdstrike", "sentinelone", "defender", "nessus", "qualys"]
        }
    },
    
    // Industry verticals for specialized guidance
    industries: {
        manufacturing: "Manufacturing & Industrial",
        aerospace: "Aerospace & Defense",
        professional_services: "Professional Services",
        healthcare: "Healthcare",
        financial: "Financial Services",
        technology: "Technology & Software",
        construction: "Construction & Engineering"
    },
    
    // Organization size categories
    orgSizes: {
        small: { name: "Small Business", employees: "1-50", budget: "Limited (<$50k/year)" },
        medium: { name: "Medium Business", employees: "51-500", budget: "Moderate ($50k-$250k/year)" },
        large: { name: "Large Enterprise", employees: "500+", budget: "Substantial ($250k+/year)" }
    },
    
    // Assessment Objective Guidance
    // Organized by control family, then by specific objective
    objectives: {
        
        // ========================================
        // ACCESS CONTROL (AC) - 3.1.x
        // ========================================
        
        "AC.L2-3.1.1": {
            objective: "Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).",
            
            // Cloud Platform Implementations
            cloud: {
                aws: {
                    services: ["IAM", "Organizations", "SSO", "Control Tower"],
                    implementation: {
                        steps: [
                            "Enable AWS Organizations for centralized account management",
                            "Implement AWS SSO (IAM Identity Center) for federated access",
                            "Create IAM policies following least privilege principle",
                            "Use IAM roles instead of long-term access keys",
                            "Enable MFA for all IAM users, especially privileged accounts",
                            "Implement Service Control Policies (SCPs) to restrict actions across accounts",
                            "Use AWS Control Tower for guardrails and compliance"
                        ],
                        terraform_example: `
resource "aws_iam_policy" "cui_access" {
  name = "CUIAccessPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["s3:GetObject", "s3:PutObject"]
      Resource = "arn:aws:s3:::cui-bucket/*"
      Condition = {
        StringEquals = {
          "aws:PrincipalOrgID" = var.org_id
        }
      }
    }]
  })
}`,
                        cli_commands: [
                            "aws iam create-policy --policy-name CUIAccess --policy-document file://policy.json",
                            "aws iam attach-user-policy --user-name john.doe --policy-arn arn:aws:iam::123456789012:policy/CUIAccess",
                            "aws iam enable-mfa-device --user-name john.doe --serial-number arn:aws:iam::123456789012:mfa/john.doe --authentication-code-1 123456 --authentication-code-2 789012"
                        ],
                        verification: [
                            "Review IAM Access Analyzer findings",
                            "Run AWS Config rules for IAM compliance",
                            "Check CloudTrail logs for unauthorized access attempts",
                            "Verify MFA is enabled: aws iam get-account-summary"
                        ],
                        cost_estimate: "$50-200/month (depending on SSO usage)",
                        effort_hours: 8
                    }
                },
                
                azure: {
                    services: ["Azure AD (Entra ID)", "Conditional Access", "PIM", "RBAC"],
                    implementation: {
                        steps: [
                            "Configure Azure AD as identity provider",
                            "Implement Conditional Access policies for device compliance",
                            "Enable Privileged Identity Management (PIM) for just-in-time access",
                            "Use Azure RBAC for resource-level permissions",
                            "Enforce MFA through Conditional Access",
                            "Implement named locations to restrict access by geography",
                            "Use managed identities for Azure resources instead of service principals"
                        ],
                        powershell_example: `
# Create Conditional Access policy requiring MFA
$conditions = New-Object -TypeName Microsoft.Open.MSGraph.Model.ConditionalAccessConditionSet
$conditions.Users = New-Object -TypeName Microsoft.Open.MSGraph.Model.ConditionalAccessUserCondition
$conditions.Users.IncludeUsers = "All"
$conditions.Applications = New-Object -TypeName Microsoft.Open.MSGraph.Model.ConditionalAccessApplicationCondition
$conditions.Applications.IncludeApplications = "All"

$controls = New-Object -TypeName Microsoft.Open.MSGraph.Model.ConditionalAccessGrantControls
$controls.BuiltInControls = "mfa"

New-AzureADMSConditionalAccessPolicy -DisplayName "Require MFA for All Users" -State "Enabled" -Conditions $conditions -GrantControls $controls`,
                        verification: [
                            "Review Azure AD sign-in logs for failed authentication attempts",
                            "Check Conditional Access policy compliance in Azure AD",
                            "Verify PIM activations and approvals",
                            "Run Azure Security Center recommendations"
                        ],
                        cost_estimate: "$6-12/user/month (Azure AD P2 for PIM)",
                        effort_hours: 6
                    }
                },
                
                gcp: {
                    services: ["Cloud Identity", "IAM", "Organization Policies", "VPC Service Controls"],
                    implementation: {
                        steps: [
                            "Set up Cloud Identity for user management",
                            "Implement IAM policies with predefined roles",
                            "Use custom roles for fine-grained access control",
                            "Enable organization policies to enforce security constraints",
                            "Implement VPC Service Controls for perimeter security",
                            "Use service accounts with minimal permissions",
                            "Enable 2-Step Verification for all users"
                        ],
                        gcloud_example: `
# Create custom role for CUI access
gcloud iam roles create cuiDataAccess \\
  --project=my-project \\
  --title="CUI Data Access" \\
  --description="Access to CUI storage buckets" \\
  --permissions=storage.objects.get,storage.objects.list \\
  --stage=GA

# Bind role to user
gcloud projects add-iam-policy-binding my-project \\
  --member=user:john.doe@company.com \\
  --role=projects/my-project/roles/cuiDataAccess`,
                        verification: [
                            "Review IAM policy bindings: gcloud projects get-iam-policy PROJECT_ID",
                            "Check Cloud Audit Logs for access violations",
                            "Verify organization policies are enforced",
                            "Run Security Command Center findings"
                        ],
                        cost_estimate: "$6/user/month (Cloud Identity Premium)",
                        effort_hours: 6
                    }
                },
                
                oracle: {
                    services: ["Identity Domains", "IAM", "Cloud Guard"],
                    implementation: {
                        steps: [
                            "Create Identity Domain for user management",
                            "Configure IAM policies for compartment-based access control",
                            "Implement MFA using Oracle Authenticator or FIDO2",
                            "Use dynamic groups for resource-based policies",
                            "Enable Cloud Guard for threat detection",
                            "Implement federation with external identity providers",
                            "Use service limits to prevent resource abuse"
                        ],
                        oci_cli_example: `
# Create IAM policy for CUI access
oci iam policy create \\
  --compartment-id ocid1.compartment.oc1..xxx \\
  --name CUIAccessPolicy \\
  --description "Policy for CUI data access" \\
  --statements '["Allow group CUIUsers to read buckets in compartment CUI", "Allow group CUIUsers to manage objects in compartment CUI where target.bucket.name='\''cui-data'\''"]'`,
                        verification: [
                            "Review IAM policy statements",
                            "Check audit logs for unauthorized access",
                            "Verify MFA enrollment status",
                            "Review Cloud Guard detector recipes"
                        ],
                        cost_estimate: "$50-150/month",
                        effort_hours: 8
                    }
                },
                
                ibm: {
                    services: ["IBM Cloud IAM", "App ID", "Key Protect"],
                    implementation: {
                        steps: [
                            "Configure IBM Cloud IAM for user and service ID management",
                            "Create access groups for role-based access",
                            "Implement MFA using IBM Security Verify",
                            "Use service IDs with API keys for application access",
                            "Enable context-based restrictions for IP allowlisting",
                            "Implement App ID for application authentication",
                            "Use resource groups for access control boundaries"
                        ],
                        ibmcloud_cli_example: `
# Create access group and policy
ibmcloud iam access-group-create CUIAccessGroup -d "Group for CUI data access"
ibmcloud iam access-group-policy-create CUIAccessGroup \\
  --roles Viewer,Writer \\
  --service-name cloud-object-storage \\
  --resource-group-name CUI-Resources`,
                        verification: [
                            "Review access group memberships and policies",
                            "Check Activity Tracker logs for access events",
                            "Verify MFA is enforced for users",
                            "Review context-based restrictions"
                        ],
                        cost_estimate: "$50-100/month",
                        effort_hours: 7
                    }
                },
                
                digitalocean: {
                    services: ["Teams", "Spaces", "Droplets"],
                    implementation: {
                        steps: [
                            "Create team with role-based permissions",
                            "Enable 2FA for all team members",
                            "Use SSH keys instead of passwords for Droplet access",
                            "Implement Cloud Firewalls to restrict access",
                            "Use Spaces access keys with minimal permissions",
                            "Enable VPC for network isolation",
                            "Implement IP allowlisting for critical resources"
                        ],
                        doctl_example: `
# Create firewall rule allowing only specific IPs
doctl compute firewall create \\
  --name cui-firewall \\
  --inbound-rules "protocol:tcp,ports:22,sources:addresses:203.0.113.0/24" \\
  --outbound-rules "protocol:tcp,ports:all,destinations:addresses:0.0.0.0/0"`,
                        verification: [
                            "Review team member permissions",
                            "Verify 2FA is enabled for all users",
                            "Check firewall rules are properly configured",
                            "Review Droplet access logs"
                        ],
                        cost_estimate: "$12-50/month (team features)",
                        effort_hours: 4
                    }
                }
            },
            
            // SaaS Platform Implementations
            saas: {
                microsoft365: {
                    features: ["Azure AD", "Conditional Access", "Intune", "DLP"],
                    implementation: {
                        steps: [
                            "Configure Azure AD as identity provider for all M365 services",
                            "Create Conditional Access policies requiring compliant devices",
                            "Implement named locations to restrict access by geography",
                            "Enable MFA for all users through Conditional Access",
                            "Use sensitivity labels to classify CUI documents",
                            "Configure DLP policies to prevent CUI exfiltration",
                            "Implement app protection policies in Intune",
                            "Enable audit logging and integrate with SIEM"
                        ],
                        conditional_access_example: {
                            name: "Block access from non-compliant devices",
                            conditions: "All users, All cloud apps, Any device state",
                            grant_controls: "Require device to be marked as compliant",
                            session_controls: "None"
                        },
                        verification: [
                            "Review sign-in logs in Azure AD",
                            "Check Conditional Access policy compliance",
                            "Verify DLP policy matches and incidents",
                            "Review Intune device compliance status"
                        ],
                        cost_estimate: "$20-35/user/month (M365 E3/E5)",
                        effort_hours: 12
                    }
                },
                
                google_workspace: {
                    features: ["Cloud Identity", "Context-Aware Access", "Drive DLP", "Vault"],
                    implementation: {
                        steps: [
                            "Enable 2-Step Verification for all users",
                            "Configure Context-Aware Access policies based on device and location",
                            "Implement Drive DLP rules to detect and protect CUI",
                            "Use Google Vault for retention and eDiscovery",
                            "Enable advanced protection for high-risk users",
                            "Configure security sandbox for email attachments",
                            "Implement organizational units for access control",
                            "Enable audit logging and export to SIEM"
                        ],
                        context_aware_access_example: {
                            name: "Require corporate devices for CUI access",
                            conditions: "Device policy: Corporate owned, Encryption: Required",
                            access_level: "Allow access to Drive, Docs, Sheets",
                            deny_action: "Block access and show custom message"
                        },
                        verification: [
                            "Review security investigation tool for access anomalies",
                            "Check DLP rule matches in Security Center",
                            "Verify 2SV enrollment status",
                            "Review Vault retention policies"
                        ],
                        cost_estimate: "$18-25/user/month (Workspace Enterprise)",
                        effort_hours: 10
                    }
                },
                
                salesforce: {
                    features: ["Shield Platform Encryption", "Event Monitoring", "Field-Level Security"],
                    implementation: {
                        steps: [
                            "Enable Shield Platform Encryption for CUI fields",
                            "Configure field-level security to restrict CUI access",
                            "Implement profile-based permissions for least privilege",
                            "Use permission sets for granular access control",
                            "Enable Event Monitoring for audit trail",
                            "Configure login IP ranges to restrict access",
                            "Implement SSO with MFA through SAML",
                            "Enable transaction security policies for anomaly detection"
                        ],
                        apex_example: `
// Check field-level security before accessing CUI
if (Schema.sObjectType.Account.fields.CUI_Data__c.isAccessible()) {
    Account acc = [SELECT CUI_Data__c FROM Account WHERE Id = :accountId];
    // Process CUI data
} else {
    throw new System.NoAccessException();
}`,
                        verification: [
                            "Review Event Monitoring logs for unauthorized access",
                            "Check field-level security settings",
                            "Verify Shield encryption is enabled for CUI fields",
                            "Review login history and IP restrictions"
                        ],
                        cost_estimate: "$300/org/month (Shield Platform Encryption)",
                        effort_hours: 16
                    }
                }
            },
            
            // Custom Application Development
            custom_app: {
                nodejs: {
                    libraries: ["passport", "express-session", "helmet", "express-rate-limit"],
                    implementation: {
                        steps: [
                            "Implement Passport.js for authentication with multiple strategies",
                            "Use express-session with secure session configuration",
                            "Implement JWT tokens with short expiration times",
                            "Use helmet.js for security headers",
                            "Implement rate limiting to prevent brute force",
                            "Use bcrypt for password hashing (cost factor 12+)",
                            "Implement RBAC middleware for authorization",
                            "Log authentication events to SIEM"
                        ],
                        code_example: `
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

// Passport local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        // Log failed attempt
        await auditLog.create({
          event: 'LOGIN_FAILED',
          username: username,
          ip: req.ip,
          timestamp: new Date()
        });
        return done(null, false, { message: 'Invalid credentials' });
      }
      
      // Check if MFA is required
      if (user.mfaEnabled && !req.session.mfaVerified) {
        return done(null, false, { message: 'MFA required' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// RBAC middleware
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!req.user.roles.includes(role)) {
      // Log unauthorized access attempt
      auditLog.create({
        event: 'UNAUTHORIZED_ACCESS',
        user: req.user.id,
        requiredRole: role,
        ip: req.ip
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Apply to routes
app.post('/login', loginLimiter, passport.authenticate('local'), (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get('/cui-data', requireRole('CUI_ACCESS'), (req, res) => {
  // Handle CUI data access
});`,
                        verification: [
                            "Test authentication with valid/invalid credentials",
                            "Verify rate limiting blocks brute force attempts",
                            "Check audit logs capture authentication events",
                            "Test RBAC prevents unauthorized access"
                        ],
                        effort_hours: 20
                    }
                },
                
                python: {
                    libraries: ["django", "flask-login", "passlib", "python-jose"],
                    implementation: {
                        steps: [
                            "Use Django's built-in authentication or Flask-Login",
                            "Implement password hashing with passlib (argon2 or bcrypt)",
                            "Use python-jose for JWT token management",
                            "Implement decorator-based authorization",
                            "Use Django middleware or Flask before_request for session validation",
                            "Implement CSRF protection",
                            "Log authentication events with structlog",
                            "Implement account lockout after failed attempts"
                        ],
                        code_example: `
from flask import Flask, request, jsonify
from flask_login import LoginManager, login_user, login_required, current_user
from passlib.hash import argon2
from functools import wraps
import structlog

app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)

logger = structlog.get_logger()

# Role-based access control decorator
def require_role(role):
    def decorator(f):
        @wraps(f)
        @login_required
        def decorated_function(*args, **kwargs):
            if role not in current_user.roles:
                logger.warning(
                    "unauthorized_access_attempt",
                    user=current_user.id,
                    required_role=role,
                    ip=request.remote_addr
                )
                return jsonify({"error": "Insufficient permissions"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not argon2.verify(password, user.password_hash):
        logger.warning(
            "login_failed",
            username=username,
            ip=request.remote_addr
        )
        return jsonify({"error": "Invalid credentials"}), 401
    
    login_user(user)
    logger.info(
        "login_successful",
        user=user.id,
        ip=request.remote_addr
    )
    return jsonify({"success": True})

@app.route('/cui-data')
@require_role('CUI_ACCESS')
def get_cui_data():
    # Handle CUI data access
    return jsonify({"data": "sensitive"})`,
                        verification: [
                            "Test authentication flow",
                            "Verify password hashing uses strong algorithm",
                            "Check authorization decorator prevents unauthorized access",
                            "Review logs for authentication events"
                        ],
                        effort_hours: 18
                    }
                }
            },
            
            // Industry-Specific Guidance
            industry_specific: {
                manufacturing: {
                    scenario: "CAD/CAM file access control",
                    implementation: {
                        steps: [
                            "Implement role-based access in PLM system (e.g., Autodesk Vault)",
                            "Configure file-level permissions for engineering drawings",
                            "Use check-in/check-out workflow to prevent concurrent modifications",
                            "Implement approval workflows for design releases",
                            "Restrict access to ITAR-controlled designs to US persons only",
                            "Enable audit logging for all file access and modifications",
                            "Implement watermarking for printed/exported drawings"
                        ],
                        tools: ["Autodesk Vault", "SolidWorks PDM", "Siemens Teamcenter"],
                        verification: [
                            "Review access logs for unauthorized file access",
                            "Verify ITAR restrictions are enforced",
                            "Test approval workflows",
                            "Check watermarks are applied to exports"
                        ]
                    }
                },
                
                aerospace: {
                    scenario: "ITAR-controlled data access",
                    implementation: {
                        steps: [
                            "Verify US person status before granting access",
                            "Implement need-to-know access controls",
                            "Use data classification labels (ITAR, EAR, CUI)",
                            "Restrict foreign national access to ITAR data",
                            "Implement physical and logical separation of ITAR systems",
                            "Enable enhanced logging for ITAR data access",
                            "Implement export control screening for all users"
                        ],
                        compliance_notes: "Must comply with ITAR 22 CFR 120-130 and CMMC",
                        verification: [
                            "Verify US person status documentation",
                            "Check access logs for foreign national access attempts",
                            "Review data classification labels",
                            "Audit export control screening records"
                        ]
                    }
                }
            },
            
            // Small Business Implementation
            small_business: {
                budget_tier: "under_10k",
                recommended_approach: "Use cloud-based IAM with free/low-cost MFA",
                implementation: {
                    steps: [
                        "Use cloud provider's built-in IAM (AWS IAM, Azure AD Free)",
                        "Implement free MFA options (Microsoft Authenticator, Google Authenticator)",
                        "Use JumpCloud for unified directory ($10/user/month)",
                        "Implement password manager (Bitwarden $3/user/month)",
                        "Use cloud provider's free tier for basic access logging",
                        "Implement simple RBAC with predefined roles",
                        "Document access control procedures in simple policy"
                    ],
                    tools: [
                        { name: "JumpCloud", cost: "$10/user/month", purpose: "Unified directory and SSO" },
                        { name: "Bitwarden", cost: "$3/user/month", purpose: "Password management" },
                        { name: "Microsoft Authenticator", cost: "Free", purpose: "MFA" },
                        { name: "AWS IAM", cost: "Free", purpose: "Cloud access control" }
                    ],
                    total_cost_estimate: "$13-15/user/month",
                    effort_hours: 8
                }
            }
        }
        
        // Additional objectives will be added incrementally...
        // This is just the start - showing the comprehensive structure
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE = COMPREHENSIVE_GUIDANCE;
    console.log('[Comprehensive Guidance] Loaded successfully');
}
