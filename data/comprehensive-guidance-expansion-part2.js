// Comprehensive Implementation Guidance Library - Part 2
// Continuing expansion of all 320 CMMC Assessment Objectives
// Version: 1.0.0

/**
 * This file extends comprehensive-implementation-guidance.js with additional objectives
 * Focus: Complete Access Control family and begin other critical families
 */

const COMPREHENSIVE_GUIDANCE_PART2 = {
    version: "1.0.0",
    lastUpdated: "2026-02-05",
    
    objectives: {
        
        // ========================================
        // ACCESS CONTROL (AC) - Continued
        // ========================================
        
        "AC.L2-3.1.2": {
            objective: "Limit system access to the types of transactions and functions that authorized users are permitted to execute.",
            
            cloud: {
                aws: {
                    services: ["IAM Policies", "AWS Organizations SCPs", "Resource-based policies"],
                    implementation: {
                        steps: [
                            "Create fine-grained IAM policies limiting actions per user role",
                            "Use IAM policy conditions to restrict actions based on context",
                            "Implement Service Control Policies (SCPs) to prevent dangerous actions",
                            "Use resource-based policies to restrict access to specific resources",
                            "Enable CloudTrail to log all API calls for audit",
                            "Use IAM Access Analyzer to identify overly permissive policies",
                            "Implement permission boundaries for delegated administration"
                        ],
                        policy_example: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadOnlyCUIData",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::cui-bucket",
        "arn:aws:s3:::cui-bucket/*"
      ],
      "Condition": {
        "StringEquals": {
          "s3:ExistingObjectTag/Classification": "CUI"
        }
      }
    },
    {
      "Sid": "DenyDeleteOperations",
      "Effect": "Deny",
      "Action": [
        "s3:DeleteObject",
        "s3:DeleteBucket"
      ],
      "Resource": "*"
    }
  ]
}`,
                        verification: [
                            "Test user can only perform allowed actions",
                            "Verify denied actions are blocked",
                            "Review CloudTrail for unauthorized attempts",
                            "Run IAM Access Analyzer to check for issues"
                        ],
                        cost_estimate: "Included with AWS",
                        effort_hours: 6
                    }
                },
                
                azure: {
                    services: ["Azure RBAC", "Custom Roles", "Deny Assignments"],
                    implementation: {
                        steps: [
                            "Create custom Azure RBAC roles with specific action permissions",
                            "Use built-in roles as templates and customize",
                            "Implement deny assignments for critical operations",
                            "Use Azure Policy to enforce allowed operations",
                            "Enable Activity Log for all management operations",
                            "Use Azure AD Privileged Identity Management for time-bound access",
                            "Implement resource locks to prevent deletion"
                        ],
                        custom_role_example: `{
  "Name": "CUI Data Reader",
  "IsCustom": true,
  "Description": "Can read CUI data but not modify or delete",
  "Actions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/read",
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
  ],
  "NotActions": [
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write",
    "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete"
  ],
  "AssignableScopes": [
    "/subscriptions/{subscription-id}/resourceGroups/cui-resources"
  ]
}`,
                        verification: [
                            "Test custom role permissions",
                            "Verify deny assignments block critical operations",
                            "Review Activity Log for unauthorized attempts",
                            "Check Azure Policy compliance"
                        ],
                        cost_estimate: "Included with Azure",
                        effort_hours: 6
                    }
                },
                
                gcp: {
                    services: ["IAM Custom Roles", "Organization Policies", "VPC Service Controls"],
                    implementation: {
                        steps: [
                            "Create custom IAM roles with specific permissions",
                            "Use predefined roles as starting point",
                            "Implement organization policies to restrict operations",
                            "Use VPC Service Controls for perimeter security",
                            "Enable Cloud Audit Logs for all admin activity",
                            "Use IAM Recommender to identify excessive permissions",
                            "Implement resource hierarchy for inheritance"
                        ],
                        custom_role_yaml: `title: "CUI Data Reader"
description: "Read-only access to CUI storage"
stage: "GA"
includedPermissions:
- storage.buckets.get
- storage.buckets.list
- storage.objects.get
- storage.objects.list
excludedPermissions:
- storage.objects.create
- storage.objects.delete
- storage.objects.update`,
                        verification: [
                            "Test custom role permissions: gcloud projects get-iam-policy",
                            "Verify organization policies block restricted operations",
                            "Review Cloud Audit Logs",
                            "Check IAM Recommender suggestions"
                        ],
                        cost_estimate: "Included with GCP",
                        effort_hours: 6
                    }
                }
            },
            
            containers: {
                kubernetes: {
                    features: ["RBAC Roles", "Admission Controllers", "Pod Security Policies"],
                    implementation: {
                        steps: [
                            "Define Roles with specific verbs (get, list, watch vs create, update, delete)",
                            "Use ClusterRoles for cluster-wide permissions",
                            "Implement admission controllers to validate requests",
                            "Use OPA Gatekeeper for policy enforcement",
                            "Enable audit logging for all API requests",
                            "Implement resource quotas to limit resource consumption"
                        ],
                        role_example: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cui-data-reader
  namespace: cui-workloads
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list", "watch"]
  # Explicitly deny write operations by omission
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list"]
  # Can view but not modify deployments`,
                        verification: [
                            "Test role permissions: kubectl auth can-i create secrets --as=user -n cui-workloads",
                            "Verify admission controllers block unauthorized operations",
                            "Review audit logs for denied requests"
                        ],
                        effort_hours: 8
                    }
                }
            },
            
            saas: {
                salesforce: {
                    features: ["Profiles", "Permission Sets", "Field-Level Security"],
                    implementation: {
                        steps: [
                            "Create profiles with minimal object and field permissions",
                            "Use permission sets for additive permissions",
                            "Implement field-level security to restrict sensitive fields",
                            "Use validation rules to enforce business logic",
                            "Enable Setup Audit Trail to track permission changes",
                            "Implement record-level security with sharing rules",
                            "Use permission set groups for complex scenarios"
                        ],
                        verification: [
                            "Test user can only perform allowed operations",
                            "Verify field-level security hides sensitive data",
                            "Review Setup Audit Trail for permission changes",
                            "Check Event Monitoring for unauthorized access attempts"
                        ],
                        effort_hours: 12
                    }
                },
                
                microsoft365: {
                    features: ["SharePoint Permissions", "Exchange Permissions", "Teams Permissions"],
                    implementation: {
                        steps: [
                            "Configure SharePoint permission levels (Read, Contribute, Edit)",
                            "Use Exchange RBAC for mailbox permissions",
                            "Implement Teams channel permissions",
                            "Use sensitivity labels to restrict actions on documents",
                            "Enable audit logging for all permission changes",
                            "Implement DLP policies to prevent unauthorized actions"
                        ],
                        verification: [
                            "Test users can only perform allowed SharePoint operations",
                            "Verify Exchange permissions are correct",
                            "Review audit logs for unauthorized attempts",
                            "Check DLP policy violations"
                        ],
                        effort_hours: 10
                    }
                }
            },
            
            custom_app: {
                java: {
                    libraries: ["Spring Security", "Apache Shiro", "JAAS"],
                    implementation: {
                        steps: [
                            "Use Spring Security method-level security annotations",
                            "Implement custom AccessDecisionVoter for fine-grained control",
                            "Use @PreAuthorize and @PostAuthorize annotations",
                            "Implement role hierarchy for permission inheritance",
                            "Log all authorization decisions",
                            "Use Spring Security ACLs for object-level security"
                        ],
                        code_example: `@Service
public class CUIDataService {
    
    @PreAuthorize("hasRole('CUI_READER')")
    public CUIData readData(Long id) {
        return cuiRepository.findById(id);
    }
    
    @PreAuthorize("hasRole('CUI_WRITER') and #data.owner == authentication.name")
    public void updateData(CUIData data) {
        cuiRepository.save(data);
    }
    
    @PreAuthorize("hasRole('CUI_ADMIN')")
    public void deleteData(Long id) {
        auditLogger.log("DELETE_ATTEMPT", id, SecurityContextHolder.getContext().getAuthentication().getName());
        cuiRepository.deleteById(id);
    }
    
    @PostAuthorize("returnObject.classification != 'TOP_SECRET' or hasRole('TS_CLEARANCE')")
    public CUIData getDataWithPostCheck(Long id) {
        return cuiRepository.findById(id);
    }
}

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
        hierarchy.setHierarchy("ROLE_CUI_ADMIN > ROLE_CUI_WRITER > ROLE_CUI_READER");
        return hierarchy;
    }
}`,
                        verification: [
                            "Test method-level security with different roles",
                            "Verify role hierarchy works correctly",
                            "Check audit logs for authorization decisions",
                            "Test @PostAuthorize filters results correctly"
                        ],
                        effort_hours: 16
                    }
                },
                
                dotnet: {
                    libraries: ["ASP.NET Core Authorization", "Policy-based authorization"],
                    implementation: {
                        steps: [
                            "Implement policy-based authorization",
                            "Use [Authorize] attribute with policies",
                            "Create custom authorization handlers",
                            "Implement resource-based authorization",
                            "Log all authorization decisions",
                            "Use claims-based authorization for fine-grained control"
                        ],
                        code_example: `// Startup.cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddAuthorization(options =>
    {
        options.AddPolicy("CUIReader", policy =>
            policy.RequireRole("CUIReader"));
        
        options.AddPolicy("CUIWriter", policy =>
            policy.RequireRole("CUIWriter")
                  .RequireClaim("Department", "Engineering", "Security"));
        
        options.AddPolicy("CUIAdmin", policy =>
            policy.RequireRole("CUIAdmin")
                  .Requirements.Add(new MFARequirement()));
    });
    
    services.AddSingleton<IAuthorizationHandler, MFAHandler>();
}

// Controller
[ApiController]
[Route("api/[controller]")]
public class CUIDataController : ControllerBase
{
    private readonly IAuthorizationService _authorizationService;
    
    [HttpGet("{id}")]
    [Authorize(Policy = "CUIReader")]
    public async Task<IActionResult> GetData(int id)
    {
        var data = await _dataService.GetDataAsync(id);
        
        // Resource-based authorization
        var authResult = await _authorizationService.AuthorizeAsync(
            User, data, "CanViewCUIData");
        
        if (!authResult.Succeeded)
        {
            _logger.LogWarning("Unauthorized access attempt to CUI data {Id} by {User}", 
                id, User.Identity.Name);
            return Forbid();
        }
        
        return Ok(data);
    }
    
    [HttpPut("{id}")]
    [Authorize(Policy = "CUIWriter")]
    public async Task<IActionResult> UpdateData(int id, CUIData data)
    {
        _logger.LogInformation("CUI data update by {User}", User.Identity.Name);
        await _dataService.UpdateAsync(data);
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    [Authorize(Policy = "CUIAdmin")]
    public async Task<IActionResult> DeleteData(int id)
    {
        _logger.LogWarning("CUI data deletion by {User}", User.Identity.Name);
        await _dataService.DeleteAsync(id);
        return NoContent();
    }
}`,
                        verification: [
                            "Test policy-based authorization with different users",
                            "Verify resource-based authorization works",
                            "Check logs for authorization decisions",
                            "Test custom authorization handlers"
                        ],
                        effort_hours: 14
                    }
                }
            },
            
            database: {
                postgresql: {
                    features: ["Row-Level Security", "Column Privileges", "Roles"],
                    implementation: {
                        steps: [
                            "Create database roles for different access levels",
                            "Grant specific privileges (SELECT, INSERT, UPDATE, DELETE) per role",
                            "Implement Row-Level Security (RLS) policies",
                            "Use column-level privileges for sensitive fields",
                            "Enable pgAudit for detailed logging",
                            "Use SECURITY DEFINER functions for controlled operations"
                        ],
                        sql_example: `-- Create roles
CREATE ROLE cui_reader;
CREATE ROLE cui_writer;
CREATE ROLE cui_admin;

-- Grant table-level privileges
GRANT SELECT ON cui_data TO cui_reader;
GRANT SELECT, INSERT, UPDATE ON cui_data TO cui_writer;
GRANT ALL PRIVILEGES ON cui_data TO cui_admin;

-- Column-level privileges (hide sensitive columns from readers)
REVOKE SELECT ON cui_data(ssn, classified_info) FROM cui_reader;

-- Enable Row-Level Security
ALTER TABLE cui_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - users can only see their own department's data
CREATE POLICY cui_department_isolation ON cui_data
    FOR SELECT
    TO cui_reader, cui_writer
    USING (department = current_setting('app.current_department'));

-- Policy for admins - can see all data
CREATE POLICY cui_admin_all ON cui_data
    FOR ALL
    TO cui_admin
    USING (true);

-- Audit logging with pgAudit
ALTER SYSTEM SET pgaudit.log = 'write, ddl, role';
ALTER SYSTEM SET pgaudit.log_relation = on;`,
                        verification: [
                            "Test role permissions: SET ROLE cui_reader; SELECT * FROM cui_data;",
                            "Verify RLS policies filter data correctly",
                            "Check pgAudit logs for all operations",
                            "Test column-level security hides sensitive fields"
                        ],
                        effort_hours: 10
                    }
                },
                
                mongodb: {
                    features: ["Role-Based Access Control", "Field-Level Redaction"],
                    implementation: {
                        steps: [
                            "Create custom roles with specific privileges",
                            "Use built-in roles as templates",
                            "Implement field-level redaction for sensitive data",
                            "Enable audit logging for all database operations",
                            "Use views to restrict data access",
                            "Implement client-side field-level encryption"
                        ],
                        javascript_example: `// Create custom role
db.createRole({
  role: "cuiReader",
  privileges: [
    {
      resource: { db: "cui_database", collection: "cui_data" },
      actions: ["find", "listCollections"]
    }
  ],
  roles: []
});

db.createRole({
  role: "cuiWriter",
  privileges: [
    {
      resource: { db: "cui_database", collection: "cui_data" },
      actions: ["find", "insert", "update"]
    }
  ],
  roles: []
});

// Create user with role
db.createUser({
  user: "cui_app_user",
  pwd: "secure_password",
  roles: [{ role: "cuiWriter", db: "cui_database" }]
});

// Field-level redaction view
db.createView(
  "cui_data_redacted",
  "cui_data",
  [
    {
      $redact: {
        $cond: {
          if: { $eq: ["$classification", "SECRET"] },
          then: "$$PRUNE",
          else: "$$DESCEND"
        }
      }
    },
    {
      $project: {
        ssn: 0,  // Hide SSN field
        classified_notes: 0  // Hide classified notes
      }
    }
  ]
);`,
                        verification: [
                            "Test role permissions with different users",
                            "Verify field-level redaction works",
                            "Check audit logs for all operations",
                            "Test views restrict data access"
                        ],
                        effort_hours: 12
                    }
                }
            },
            
            small_business: {
                budget_tier: "under_5k",
                recommended_approach: "Use cloud provider's built-in RBAC with predefined roles",
                implementation: {
                    steps: [
                        "Use AWS IAM managed policies or Azure built-in roles",
                        "Avoid custom policies initially - use least privilege predefined roles",
                        "Document which roles can perform which operations",
                        "Use cloud provider's free audit logging",
                        "Implement simple approval workflow for sensitive operations",
                        "Review permissions quarterly"
                    ],
                    tools: [
                        { name: "AWS IAM", cost: "Free", purpose: "Built-in RBAC" },
                        { name: "Azure RBAC", cost: "Free", purpose: "Built-in roles" },
                        { name: "CloudTrail/Activity Log", cost: "Free tier", purpose: "Audit logging" }
                    ],
                    total_cost_estimate: "$0-50/month",
                    effort_hours: 4
                }
            }
        },
        
        // ========================================
        // AUDIT & ACCOUNTABILITY (AU) - 3.3.x
        // ========================================
        
        "AU.L2-3.3.1": {
            objective: "Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.",
            
            cloud: {
                aws: {
                    services: ["CloudTrail", "CloudWatch Logs", "S3", "Athena"],
                    implementation: {
                        steps: [
                            "Enable CloudTrail in all regions with management and data events",
                            "Configure CloudTrail to log to S3 bucket with encryption",
                            "Enable CloudTrail log file validation",
                            "Set up CloudWatch Logs for real-time monitoring",
                            "Implement S3 lifecycle policies for log retention (7 years for CUI)",
                            "Use S3 Object Lock for WORM (Write Once Read Many) compliance",
                            "Configure Athena for log analysis",
                            "Enable VPC Flow Logs for network traffic",
                            "Enable S3 access logging",
                            "Enable RDS/Aurora audit logging"
                        ],
                        terraform_example: `resource "aws_cloudtrail" "cui_trail" {
  name                          = "cui-audit-trail"
  s3_bucket_name                = aws_s3_bucket.audit_logs.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  
  event_selector {
    read_write_type           = "All"
    include_management_events = true
    
    data_resource {
      type   = "AWS::S3::Object"
      values = ["arn:aws:s3:::cui-bucket/*"]
    }
  }
  
  insight_selector {
    insight_type = "ApiCallRateInsight"
  }
}

resource "aws_s3_bucket" "audit_logs" {
  bucket = "cui-audit-logs-${data.aws_caller_identity.current.account_id}"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = aws_kms_key.audit_logs.arn
      }
    }
  }
  
  lifecycle_rule {
    enabled = true
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 2555  # 7 years
    }
  }
  
  object_lock_configuration {
    object_lock_enabled = "Enabled"
    
    rule {
      default_retention {
        mode = "GOVERNANCE"
        days = 2555
      }
    }
  }
}`,
                        verification: [
                            "Verify CloudTrail is logging: aws cloudtrail get-trail-status",
                            "Check log files are encrypted and validated",
                            "Test log retention policies",
                            "Query logs with Athena to verify completeness"
                        ],
                        cost_estimate: "$50-200/month (depending on log volume)",
                        effort_hours: 8
                    }
                },
                
                azure: {
                    services: ["Activity Log", "Diagnostic Settings", "Log Analytics", "Storage Account"],
                    implementation: {
                        steps: [
                            "Enable Activity Log for all subscriptions",
                            "Configure Diagnostic Settings for all resources",
                            "Send logs to Log Analytics workspace",
                            "Archive logs to Storage Account with immutability",
                            "Enable Azure Monitor for comprehensive logging",
                            "Configure log retention (7 years for CUI)",
                            "Enable NSG Flow Logs for network traffic",
                            "Enable Azure AD audit logs",
                            "Configure alerts for suspicious activity"
                        ],
                        azure_cli_example: `# Create Log Analytics workspace
az monitor log-analytics workspace create \\
  --resource-group cui-rg \\
  --workspace-name cui-logs \\
  --retention-time 2555  # 7 years

# Create storage account for archive
az storage account create \\
  --name cuilogsarchive \\
  --resource-group cui-rg \\
  --sku Standard_GRS \\
  --encryption-services blob \\
  --https-only true

# Enable immutability
az storage account blob-service-properties update \\
  --account-name cuilogsarchive \\
  --enable-versioning true

# Configure diagnostic settings for subscription
az monitor diagnostic-settings subscription create \\
  --name cui-subscription-logs \\
  --location eastus \\
  --workspace cui-logs \\
  --storage-account cuilogsarchive \\
  --logs '[{"category": "Administrative", "enabled": true}, 
          {"category": "Security", "enabled": true},
          {"category": "Alert", "enabled": true}]'`,
                        verification: [
                            "Check Activity Log is collecting events",
                            "Verify logs are flowing to Log Analytics",
                            "Test log queries in Log Analytics",
                            "Verify archive storage has immutability enabled"
                        ],
                        cost_estimate: "$100-300/month (depending on log volume)",
                        effort_hours: 8
                    }
                },
                
                gcp: {
                    services: ["Cloud Audit Logs", "Cloud Logging", "Cloud Storage", "BigQuery"],
                    implementation: {
                        steps: [
                            "Enable Admin Activity audit logs (enabled by default)",
                            "Enable Data Access audit logs for CUI resources",
                            "Enable System Event audit logs",
                            "Configure log sinks to Cloud Storage for long-term retention",
                            "Use bucket lock for WORM compliance",
                            "Set up log sinks to BigQuery for analysis",
                            "Configure VPC Flow Logs",
                            "Enable Cloud DNS logging",
                            "Set retention period (7 years for CUI)"
                        ],
                        gcloud_example: `# Enable Data Access logs
gcloud logging settings update \\
  --organization=ORGANIZATION_ID \\
  --enable-data-access-logs

# Create log sink to Cloud Storage
gcloud logging sinks create cui-audit-sink \\
  storage.googleapis.com/cui-audit-logs \\
  --log-filter='resource.type="gce_instance" OR 
                resource.type="gcs_bucket" OR
                protoPayload.serviceName="storage.googleapis.com"'

# Create bucket with retention policy
gsutil mb -c STANDARD -l us-central1 gs://cui-audit-logs
gsutil retention set 7y gs://cui-audit-logs
gsutil retention lock gs://cui-audit-logs

# Enable VPC Flow Logs
gcloud compute networks subnets update cui-subnet \\
  --region=us-central1 \\
  --enable-flow-logs \\
  --logging-aggregation-interval=interval-5-sec \\
  --logging-flow-sampling=1.0`,
                        verification: [
                            "Check audit logs are being generated: gcloud logging read",
                            "Verify log sink is working",
                            "Test bucket retention policy",
                            "Query logs in BigQuery"
                        ],
                        cost_estimate: "$75-250/month (depending on log volume)",
                        effort_hours: 8
                    }
                }
            },
            
            containers: {
                kubernetes: {
                    features: ["Audit Logging", "Audit Policy", "Log Aggregation"],
                    implementation: {
                        steps: [
                            "Enable Kubernetes audit logging on API server",
                            "Configure audit policy to log all requests",
                            "Send audit logs to external SIEM or log aggregator",
                            "Enable container runtime logging",
                            "Use Fluentd/Fluent Bit for log collection",
                            "Store logs in centralized location (S3, Cloud Storage, etc.)",
                            "Implement log retention (7 years for CUI)",
                            "Enable audit logging for admission controllers"
                        ],
                        audit_policy_yaml: `apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log all requests at RequestResponse level
  - level: RequestResponse
    verbs: ["create", "update", "patch", "delete"]
    
  # Log metadata for read operations
  - level: Metadata
    verbs: ["get", "list", "watch"]
    
  # Log requests to CUI namespace at RequestResponse level
  - level: RequestResponse
    namespaces: ["cui-workloads"]
    
  # Don't log health checks
  - level: None
    users: ["system:kube-proxy"]
    verbs: ["watch"]
    resources:
      - group: ""
        resources: ["endpoints", "services"]`,
                        kube_apiserver_flags: `--audit-log-path=/var/log/kubernetes/audit.log
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
--audit-log-maxage=2555  # 7 years
--audit-log-maxbackup=100
--audit-log-maxsize=100`,
                        verification: [
                            "Check audit logs are being generated: tail -f /var/log/kubernetes/audit.log",
                            "Verify audit policy is applied",
                            "Test log aggregation to SIEM",
                            "Verify log retention settings"
                        ],
                        effort_hours: 12
                    }
                }
            },
            
            saas: {
                microsoft365: {
                    features: ["Unified Audit Log", "Mailbox Audit", "SharePoint Audit"],
                    implementation: {
                        steps: [
                            "Enable Unified Audit Logging for all users",
                            "Enable mailbox auditing for all mailboxes",
                            "Enable SharePoint audit logging",
                            "Configure audit log retention (7 years with E5 or add-on)",
                            "Export audit logs to SIEM for long-term storage",
                            "Enable Teams audit logging",
                            "Configure alerts for suspicious activities",
                            "Use Microsoft Purview for compliance management"
                        ],
                        powershell_example: `# Enable Unified Audit Log
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true

# Enable mailbox auditing for all users
Get-Mailbox -ResultSize Unlimited | Set-Mailbox -AuditEnabled $true

# Configure audit log retention (requires E5)
Set-AdminAuditLogConfig -AuditLogAgeLimit 2555.00:00:00  # 7 years

# Enable SharePoint audit
Set-SPOTenant -EnableAudit $true

# Create audit log search
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-90) \\
  -EndDate (Get-Date) \\
  -RecordType SharePointFileOperation \\
  -ResultSize 5000`,
                        verification: [
                            "Verify audit logging is enabled: Get-AdminAuditLogConfig",
                            "Check mailbox audit is enabled for all users",
                            "Test audit log search functionality",
                            "Verify logs are being exported to SIEM"
                        ],
                        cost_estimate: "$12/user/month (E5 license for extended retention)",
                        effort_hours: 6
                    }
                },
                
                salesforce: {
                    features: ["Event Monitoring", "Setup Audit Trail", "Field Audit Trail"],
                    implementation: {
                        steps: [
                            "Enable Event Monitoring (requires add-on)",
                            "Configure Setup Audit Trail retention",
                            "Enable Field Audit Trail for sensitive fields",
                            "Set up Event Log Files for download",
                            "Export event logs to external SIEM",
                            "Enable Login Forensics",
                            "Configure Transaction Security policies",
                            "Implement real-time event monitoring"
                        ],
                        apex_example: `// Query Event Log Files
List<EventLogFile> logs = [
    SELECT Id, EventType, LogDate, LogFile, Interval
    FROM EventLogFile
    WHERE EventType = 'Login'
    AND LogDate = TODAY
    ORDER BY CreatedDate DESC
];

// Download and process logs
for(EventLogFile log : logs) {
    String logContent = log.LogFile.toString();
    // Send to SIEM or process
}

// Enable Field History Tracking
// Setup > Object Manager > [Object] > Fields & Relationships > Set History Tracking`,
                        verification: [
                            "Verify Event Monitoring is enabled",
                            "Check Setup Audit Trail is logging changes",
                            "Test Field Audit Trail on sensitive fields",
                            "Verify logs are being exported"
                        ],
                        cost_estimate: "$2,500/month (Event Monitoring add-on)",
                        effort_hours: 10
                    }
                }
            },
            
            security_tools: {
                splunk: {
                    features: ["Universal Forwarder", "Index Management", "Retention Policies"],
                    implementation: {
                        steps: [
                            "Deploy Splunk Universal Forwarders on all systems",
                            "Configure inputs.conf for log collection",
                            "Create indexes for different log types",
                            "Configure index retention (7 years for CUI)",
                            "Implement RBAC for log access",
                            "Set up frozen archive to S3/Azure Blob",
                            "Configure summary indexing for long-term analysis",
                            "Enable audit logging for Splunk itself"
                        ],
                        inputs_conf: `[monitor:///var/log/audit/audit.log]
disabled = false
index = cui_audit
sourcetype = linux_audit

[monitor:///var/log/secure]
disabled = false
index = cui_auth
sourcetype = linux_secure

[aws:cloudtrail]
aws_account = 123456789012
aws_region = us-east-1
index = cui_aws
sourcetype = aws:cloudtrail`,
                        indexes_conf: `[cui_audit]
homePath = $SPLUNK_DB/cui_audit/db
coldPath = $SPLUNK_DB/cui_audit/colddb
thawedPath = $SPLUNK_DB/cui_audit/thaweddb
maxTotalDataSizeMB = 500000
frozenTimePeriodInSecs = 220752000  # 7 years
coldToFrozenDir = /mnt/frozen/cui_audit`,
                        verification: [
                            "Verify forwarders are sending data: index=_internal source=*metrics.log",
                            "Check index retention settings",
                            "Test frozen archive is working",
                            "Verify RBAC restricts log access"
                        ],
                        cost_estimate: "$150-500/GB/year",
                        effort_hours: 16
                    }
                },
                
                elk: {
                    features: ["Beats", "Logstash", "Elasticsearch", "Kibana"],
                    implementation: {
                        steps: [
                            "Deploy Filebeat/Auditbeat on all systems",
                            "Configure Logstash pipelines for log parsing",
                            "Set up Elasticsearch indexes with ILM policies",
                            "Configure index lifecycle (7 years retention)",
                            "Implement Elasticsearch security (authentication, RBAC)",
                            "Set up snapshot repository for backups",
                            "Configure Kibana for log visualization",
                            "Enable audit logging for Elasticsearch"
                        ],
                        filebeat_yml: `filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/audit/audit.log
  fields:
    log_type: audit
    classification: cui

- type: log
  enabled: true
  paths:
    - /var/log/secure
  fields:
    log_type: authentication
    classification: cui

output.elasticsearch:
  hosts: ["https://elasticsearch:9200"]
  username: "filebeat_writer"
  password: "${FILEBEAT_PASSWORD}"
  index: "cui-logs-%{+yyyy.MM.dd}"
  ssl.certificate_authorities: ["/etc/pki/ca.crt"]`,
                        ilm_policy: `PUT _ilm/policy/cui-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "30d"
          }
        }
      },
      "warm": {
        "min_age": "90d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "min_age": "365d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "2555d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}`,
                        verification: [
                            "Verify Beats are sending data: GET _cat/indices",
                            "Check ILM policy is applied",
                            "Test snapshot repository",
                            "Verify RBAC is configured"
                        ],
                        cost_estimate: "$50-200/month (self-hosted) or $95-175/month (Elastic Cloud)",
                        effort_hours: 20
                    }
                }
            },
            
            small_business: {
                budget_tier: "under_2k",
                recommended_approach: "Use cloud provider's native logging with free tier",
                implementation: {
                    steps: [
                        "Enable CloudTrail/Activity Log/Cloud Audit Logs (free tier)",
                        "Use cloud provider's log retention (configure 7 years)",
                        "Export logs to low-cost storage (S3 Glacier, Azure Cool Blob)",
                        "Use free log analysis tools (CloudWatch Insights, Log Analytics)",
                        "Set up basic alerts for critical events",
                        "Document log locations and retention policies"
                    ],
                    tools: [
                        { name: "AWS CloudTrail", cost: "Free (management events)", purpose: "Audit logging" },
                        { name: "S3 Glacier Deep Archive", cost: "$1/TB/month", purpose: "Long-term storage" },
                        { name: "CloudWatch Logs Insights", cost: "Pay per query", purpose: "Log analysis" }
                    ],
                    total_cost_estimate: "$10-50/month",
                    effort_hours: 4
                }
            }
        }
        
        ,
        
        "AC.L2-3.1.3": {
            objective: "Control the flow of CUI in accordance with approved authorizations.",
            
            cloud: {
                aws: {
                    services: ["VPC", "Security Groups", "NACLs", "PrivateLink", "Transit Gateway", "Resource Access Manager"],
                    implementation: {
                        steps: [
                            "Design VPC architecture with public/private/isolated subnets",
                            "Implement Security Groups for stateful firewall rules",
                            "Use Network ACLs for subnet-level access control",
                            "Enable VPC Flow Logs to monitor traffic patterns",
                            "Use AWS PrivateLink for private connectivity to services",
                            "Implement Transit Gateway for multi-VPC routing control",
                            "Use Resource Access Manager for controlled cross-account sharing",
                            "Tag all resources with data classification (CUI, Public, etc.)",
                            "Implement S3 bucket policies to control data flow",
                            "Use AWS Organizations SCPs to prevent unauthorized data transfers"
                        ],
                        terraform_example: `# VPC with CUI isolation
resource "aws_vpc" "cui_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name           = "CUI-VPC"
    Classification = "CUI"
  }
}

# Private subnet for CUI workloads
resource "aws_subnet" "cui_private" {
  vpc_id            = aws_vpc.cui_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  
  tags = {
    Name           = "CUI-Private-Subnet"
    Classification = "CUI"
  }
}

# Security group for CUI application tier
resource "aws_security_group" "cui_app" {
  name        = "cui-app-sg"
  description = "Security group for CUI applications"
  vpc_id      = aws_vpc.cui_vpc.id
  
  # Allow inbound only from authorized sources
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.cui_alb.id]
    description     = "HTTPS from ALB only"
  }
  
  # Allow outbound only to authorized destinations
  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.cui_db.id]
    description     = "PostgreSQL to CUI database only"
  }
  
  tags = {
    Name           = "CUI-App-SG"
    Classification = "CUI"
  }
}

# S3 bucket policy to control CUI data flow
resource "aws_s3_bucket_policy" "cui_bucket_policy" {
  bucket = aws_s3_bucket.cui_data.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyUnencryptedObjectUploads"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:PutObject"
        Resource = "\${aws_s3_bucket.cui_data.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "aws:kms"
          }
        }
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.cui_data.arn,
          "\${aws_s3_bucket.cui_data.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      },
      {
        Sid    = "AllowOnlyFromCUIVPC"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.cui_data.arn,
          "\${aws_s3_bucket.cui_data.arn}/*"
        ]
        Condition = {
          StringNotEquals = {
            "aws:SourceVpc" = aws_vpc.cui_vpc.id
          }
        }
      }
    ]
  })
}

# VPC Flow Logs
resource "aws_flow_log" "cui_vpc_flow_log" {
  vpc_id          = aws_vpc.cui_vpc.id
  traffic_type    = "ALL"
  iam_role_arn    = aws_iam_role.flow_log_role.arn
  log_destination = aws_cloudwatch_log_group.flow_log.arn
  
  tags = {
    Name = "CUI-VPC-Flow-Logs"
  }
}`,
                        verification: [
                            "Review VPC Flow Logs for unauthorized traffic patterns",
                            "Test Security Group rules block unauthorized access",
                            "Verify S3 bucket policies prevent unauthorized data transfers",
                            "Check CloudTrail for any policy violations",
                            "Use AWS Config to verify resource compliance"
                        ],
                        cost_estimate: "$50-150/month (VPC, Flow Logs, data transfer)",
                        effort_hours: 16
                    }
                },
                
                azure: {
                    services: ["Virtual Network", "NSGs", "Azure Firewall", "Private Link", "Azure Policy"],
                    implementation: {
                        steps: [
                            "Design VNet with subnet segmentation for CUI workloads",
                            "Implement Network Security Groups (NSGs) for traffic control",
                            "Deploy Azure Firewall for centralized network security",
                            "Use Private Endpoints for secure service connectivity",
                            "Enable NSG Flow Logs for traffic monitoring",
                            "Implement Azure Policy to enforce network controls",
                            "Use Service Endpoints for Azure service access control",
                            "Configure Storage Account network rules to restrict access",
                            "Implement Azure Front Door for global traffic management",
                            "Use Azure DDoS Protection for CUI resources"
                        ],
                        azure_cli_example: `# Create VNet for CUI workloads
az network vnet create \\
  --resource-group cui-rg \\
  --name cui-vnet \\
  --address-prefix 10.0.0.0/16 \\
  --subnet-name cui-app-subnet \\
  --subnet-prefix 10.0.1.0/24 \\
  --tags Classification=CUI

# Create NSG for CUI application tier
az network nsg create \\
  --resource-group cui-rg \\
  --name cui-app-nsg \\
  --tags Classification=CUI

# Add inbound rule - allow HTTPS from authorized sources only
az network nsg rule create \\
  --resource-group cui-rg \\
  --nsg-name cui-app-nsg \\
  --name AllowHTTPSFromAGW \\
  --priority 100 \\
  --source-address-prefixes 10.0.0.0/24 \\
  --destination-port-ranges 443 \\
  --protocol Tcp \\
  --access Allow \\
  --direction Inbound

# Add outbound rule - allow database access only
az network nsg rule create \\
  --resource-group cui-rg \\
  --nsg-name cui-app-nsg \\
  --name AllowDatabaseAccess \\
  --priority 100 \\
  --destination-address-prefixes 10.0.2.0/24 \\
  --destination-port-ranges 5432 \\
  --protocol Tcp \\
  --access Allow \\
  --direction Outbound

# Deny all other outbound traffic
az network nsg rule create \\
  --resource-group cui-rg \\
  --nsg-name cui-app-nsg \\
  --name DenyAllOutbound \\
  --priority 4096 \\
  --access Deny \\
  --direction Outbound

# Enable NSG Flow Logs
az network watcher flow-log create \\
  --resource-group cui-rg \\
  --name cui-app-nsg-flow-log \\
  --nsg cui-app-nsg \\
  --storage-account cuistorage \\
  --enabled true \\
  --retention 90

# Configure Storage Account network rules
az storage account network-rule add \\
  --resource-group cui-rg \\
  --account-name cuistorage \\
  --vnet-name cui-vnet \\
  --subnet cui-app-subnet

az storage account update \\
  --resource-group cui-rg \\
  --name cuistorage \\
  --default-action Deny`,
                        verification: [
                            "Review NSG Flow Logs for traffic patterns",
                            "Test NSG rules block unauthorized access",
                            "Verify Storage Account network rules",
                            "Check Azure Policy compliance",
                            "Review Azure Monitor for network alerts"
                        ],
                        cost_estimate: "$100-300/month (VNet, NSG Flow Logs, Azure Firewall)",
                        effort_hours: 16
                    }
                },
                
                gcp: {
                    services: ["VPC", "Firewall Rules", "Cloud Armor", "Private Service Connect", "VPC Service Controls"],
                    implementation: {
                        steps: [
                            "Create VPC with custom subnets for CUI workloads",
                            "Implement hierarchical firewall rules",
                            "Use VPC Service Controls to create security perimeters",
                            "Enable VPC Flow Logs for traffic monitoring",
                            "Implement Private Service Connect for Google services",
                            "Use Cloud Armor for DDoS protection and WAF",
                            "Configure Cloud Storage bucket IAM and ACLs",
                            "Implement Organization Policies for network controls",
                            "Use Cloud NAT for controlled outbound access",
                            "Enable Packet Mirroring for traffic inspection"
                        ],
                        gcloud_example: `# Create VPC for CUI workloads
gcloud compute networks create cui-vpc \\
  --subnet-mode=custom \\
  --bgp-routing-mode=regional

# Create subnet for CUI applications
gcloud compute networks subnets create cui-app-subnet \\
  --network=cui-vpc \\
  --region=us-central1 \\
  --range=10.0.1.0/24 \\
  --enable-flow-logs \\
  --logging-aggregation-interval=interval-5-sec

# Create firewall rule - allow HTTPS from load balancer only
gcloud compute firewall-rules create cui-allow-lb-to-app \\
  --network=cui-vpc \\
  --action=ALLOW \\
  --rules=tcp:443 \\
  --source-ranges=10.0.0.0/24 \\
  --target-tags=cui-app \\
  --priority=1000

# Create firewall rule - allow database access only
gcloud compute firewall-rules create cui-allow-app-to-db \\
  --network=cui-vpc \\
  --action=ALLOW \\
  --rules=tcp:5432 \\
  --source-tags=cui-app \\
  --target-tags=cui-db \\
  --priority=1000

# Deny all other traffic (implicit deny, but explicit for clarity)
gcloud compute firewall-rules create cui-deny-all \\
  --network=cui-vpc \\
  --action=DENY \\
  --rules=all \\
  --priority=65534

# Create VPC Service Controls perimeter
gcloud access-context-manager perimeters create cui_perimeter \\
  --title="CUI Data Perimeter" \\
  --resources=projects/PROJECT_NUMBER \\
  --restricted-services=storage.googleapis.com,bigquery.googleapis.com \\
  --policy=POLICY_ID

# Configure Cloud Storage bucket with network restrictions
gsutil iam ch -d allUsers:objectViewer gs://cui-bucket
gsutil iam ch serviceAccount:cui-app@project.iam.gserviceaccount.com:objectViewer gs://cui-bucket`,
                        verification: [
                            "Review VPC Flow Logs for traffic patterns",
                            "Test firewall rules block unauthorized access",
                            "Verify VPC Service Controls perimeter",
                            "Check Organization Policy compliance",
                            "Review Cloud Logging for network events"
                        ],
                        cost_estimate: "$75-200/month (VPC, Flow Logs, Cloud Armor)",
                        effort_hours: 16
                    }
                }
            },
            
            containers: {
                kubernetes: {
                    features: ["NetworkPolicies", "Ingress Controllers", "Service Mesh", "Calico/Cilium"],
                    implementation: {
                        steps: [
                            "Implement NetworkPolicies for pod-to-pod traffic control",
                            "Use namespace isolation for CUI workloads",
                            "Deploy service mesh (Istio/Linkerd) for fine-grained traffic control",
                            "Configure Ingress controllers with TLS termination",
                            "Use Calico or Cilium for advanced network policies",
                            "Implement egress gateways to control outbound traffic",
                            "Enable mTLS between services",
                            "Use network policy logging for audit",
                            "Implement DNS policies to control name resolution"
                        ],
                        yaml_example: `# NetworkPolicy - Default deny all traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: cui-workloads
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
# NetworkPolicy - Allow CUI app to database only
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cui-app-to-db
  namespace: cui-workloads
spec:
  podSelector:
    matchLabels:
      app: cui-application
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: cui-database
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    - podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
---
# NetworkPolicy - Allow ingress from authorized sources
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cui-app-ingress
  namespace: cui-workloads
spec:
  podSelector:
    matchLabels:
      app: cui-application
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 8080
---
# Cilium NetworkPolicy with L7 controls
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: cui-app-l7-policy
  namespace: cui-workloads
spec:
  endpointSelector:
    matchLabels:
      app: cui-application
  egress:
  - toEndpoints:
    - matchLabels:
        app: cui-api
    toPorts:
    - ports:
      - port: "443"
        protocol: TCP
      rules:
        http:
        - method: "GET"
          path: "/api/cui/.*"
        - method: "POST"
          path: "/api/cui/.*"`,
                        verification: [
                            "Test NetworkPolicies block unauthorized pod communication",
                            "Verify egress controls prevent data exfiltration",
                            "Check service mesh mTLS is enforced",
                            "Review network policy logs for violations"
                        ],
                        effort_hours: 20
                    }
                }
            },
            
            saas: {
                microsoft365: {
                    features: ["DLP Policies", "Information Barriers", "Sensitivity Labels", "Conditional Access"],
                    implementation: {
                        steps: [
                            "Create DLP policies to prevent CUI data exfiltration",
                            "Implement sensitivity labels for CUI classification",
                            "Configure Information Barriers to restrict communication",
                            "Use Conditional Access to control data flow by location/device",
                            "Enable Azure Information Protection for document tracking",
                            "Configure Exchange mail flow rules to control CUI emails",
                            "Implement SharePoint site permissions for CUI content",
                            "Use Microsoft Cloud App Security for shadow IT control",
                            "Enable audit logging for all data access"
                        ],
                        powershell_example: `# Create DLP policy to prevent CUI exfiltration
New-DlpCompliancePolicy -Name "CUI Protection Policy" \\
  -ExchangeLocation All \\
  -SharePointLocation All \\
  -OneDriveLocation All \\
  -TeamsLocation All \\
  -Mode Enforce

New-DlpComplianceRule -Name "Block CUI External Sharing" \\
  -Policy "CUI Protection Policy" \\
  -ContentContainsSensitiveInformation @{Name="U.S. Social Security Number (SSN)"} \\
  -BlockAccess $true \\
  -NotifyUser Owner \\
  -NotifyEmailCustomText "This content contains CUI and cannot be shared externally"

# Create sensitivity label for CUI
New-Label -Name "CUI" \\
  -DisplayName "Controlled Unclassified Information" \\
  -Tooltip "For CUI data - restricted sharing" \\
  -EncryptionEnabled $true \\
  -EncryptionProtectionType Template \\
  -EncryptionRightsDefinitions "domain\\CUI-Users:VIEW,EDIT"

# Configure mail flow rule to prevent CUI external emails
New-TransportRule -Name "Block CUI External Email" \\
  -SubjectOrBodyContainsWords "CUI","Controlled Unclassified" \\
  -SentToScope NotInOrganization \\
  -RejectMessageReasonText "CUI content cannot be sent to external recipients" \\
  -RejectMessageEnhancedStatusCode "5.7.1"`,
                        verification: [
                            "Test DLP policies block unauthorized sharing",
                            "Verify sensitivity labels are applied correctly",
                            "Check mail flow rules prevent CUI external emails",
                            "Review DLP policy matches and incidents"
                        ],
                        cost_estimate: "$12-35/user/month (E3/E5 for DLP)",
                        effort_hours: 12
                    }
                }
            },
            
            network: {
                paloalto: {
                    features: ["Security Policies", "App-ID", "User-ID", "URL Filtering", "Data Filtering"],
                    implementation: {
                        steps: [
                            "Create security zones for CUI network segments",
                            "Implement security policies based on App-ID and User-ID",
                            "Configure URL filtering to block unauthorized destinations",
                            "Use Data Filtering profiles to prevent CUI exfiltration",
                            "Enable SSL/TLS decryption for traffic inspection",
                            "Implement zone protection profiles",
                            "Configure logging for all security policy actions",
                            "Use Panorama for centralized policy management",
                            "Implement WildFire for advanced threat prevention"
                        ],
                        cli_example: `# Create security zones
set zone cui-trust network layer3 ethernet1/1
set zone cui-dmz network layer3 ethernet1/2
set zone cui-untrust network layer3 ethernet1/3

# Create security policy - CUI app to database
set rulebase security rules cui-app-to-db from cui-trust
set rulebase security rules cui-app-to-db to cui-dmz
set rulebase security rules cui-app-to-db source 10.0.1.0/24
set rulebase security rules cui-app-to-db destination 10.0.2.0/24
set rulebase security rules cui-app-to-db application postgres
set rulebase security rules cui-app-to-db service application-default
set rulebase security rules cui-app-to-db action allow
set rulebase security rules cui-app-to-db log-end yes

# Create data filtering profile to prevent SSN exfiltration
set profiles data-filtering cui-data-filter rules ssn-block data-pattern predefined-pattern social-security-numbers
set profiles data-filtering cui-data-filter rules ssn-block application any
set profiles data-filtering cui-data-filter rules ssn-block file-type any
set profiles data-filtering cui-data-filter rules ssn-block direction both
set profiles data-filtering cui-data-filter rules ssn-block alert-threshold 1
set profiles data-filtering cui-data-filter rules ssn-block block-threshold 1
set profiles data-filtering cui-data-filter rules ssn-block action block

# Apply data filtering to security policy
set rulebase security rules cui-outbound-policy profile-setting profiles data-filtering cui-data-filter`,
                        verification: [
                            "Review traffic logs for policy violations",
                            "Test data filtering blocks CUI exfiltration",
                            "Verify App-ID correctly identifies applications",
                            "Check URL filtering blocks unauthorized sites"
                        ],
                        cost_estimate: "$3,000-10,000 (hardware) + $1,000-3,000/year (subscriptions)",
                        effort_hours: 24
                    }
                },
                
                cisco: {
                    features: ["ASA/Firepower", "Access Control Lists", "Zone-Based Firewall", "Cisco ISE"],
                    implementation: {
                        steps: [
                            "Configure security zones for CUI network segments",
                            "Implement Access Control Lists (ACLs) for traffic filtering",
                            "Use Cisco ISE for identity-based network access control",
                            "Configure zone-based firewall policies",
                            "Implement TrustSec for software-defined segmentation",
                            "Enable NetFlow for traffic monitoring",
                            "Configure logging to syslog/SIEM",
                            "Implement Cisco Umbrella for DNS security",
                            "Use Firepower for next-gen firewall capabilities"
                        ],
                        cli_example: `! Configure security zones
zone security cui-inside
zone security cui-dmz
zone security cui-outside

! Configure zone-pair and policy
zone-pair security cui-inside-to-dmz source cui-inside destination cui-dmz
 service-policy type inspect cui-policy

! Create class-map for CUI application traffic
class-map type inspect match-all cui-app-traffic
 match protocol tcp
 match access-group name cui-app-acl

! Create policy-map
policy-map type inspect cui-policy
 class type inspect cui-app-traffic
  inspect
  log
 class class-default
  drop
  log

! Configure ACL for CUI application
ip access-list extended cui-app-acl
 permit tcp 10.0.1.0 0.0.0.255 10.0.2.0 0.0.0.255 eq 5432
 deny ip any any log

! Configure logging
logging trap informational
logging host 10.0.100.10 transport udp port 514`,
                        verification: [
                            "Review firewall logs for policy violations",
                            "Test ACLs block unauthorized traffic",
                            "Verify zone-based policies are enforced",
                            "Check NetFlow data for traffic patterns"
                        ],
                        cost_estimate: "$2,000-8,000 (hardware) + $500-2,000/year (SmartNet)",
                        effort_hours: 20
                    }
                }
            },
            
            small_business: {
                budget_tier: "under_3k",
                recommended_approach: "Use cloud provider network controls with basic firewall",
                implementation: {
                    steps: [
                        "Use cloud provider's VPC/VNet with security groups",
                        "Implement subnet segmentation for CUI workloads",
                        "Configure security group rules to allow only necessary traffic",
                        "Enable flow logs (use free tier where available)",
                        "Use pfSense or OPNsense for on-premises firewall (free)",
                        "Implement basic DLP in Microsoft 365 (E3 license)",
                        "Document all network flows and approved paths",
                        "Review logs monthly for unauthorized traffic"
                    ],
                    tools: [
                        { name: "AWS VPC/Security Groups", cost: "Free", purpose: "Network segmentation" },
                        { name: "pfSense", cost: "Free (open source)", purpose: "On-premises firewall" },
                        { name: "Microsoft 365 E3", cost: "$36/user/month", purpose: "Basic DLP" },
                        { name: "CloudWatch/Azure Monitor", cost: "$5-20/month", purpose: "Log monitoring" }
                    ],
                    total_cost_estimate: "$50-100/month + M365 licenses",
                    effort_hours: 12
                }
            }
        }
        
        ,
        
        "AC.L2-3.1.4": {
            objective: "Separate the duties of individuals to reduce the risk of malevolent activity without collusion.",
            
            cloud: {
                aws: {
                    services: ["IAM", "Organizations", "SCP", "Control Tower", "CloudTrail", "Config"],
                    implementation: {
                        steps: [
                            "Define roles with mutually exclusive permissions (e.g., developer vs. production deployer)",
                            "Use IAM policies to enforce separation (deny production access to developers)",
                            "Implement AWS Organizations SCPs to prevent privilege escalation",
                            "Create separate AWS accounts for dev/staging/production",
                            "Use IAM permission boundaries to limit maximum permissions",
                            "Require multi-person approval for critical actions (AWS Config rules)",
                            "Enable CloudTrail to audit all privileged actions",
                            "Use AWS Control Tower for guardrails across accounts",
                            "Implement break-glass procedures with monitoring",
                            "Use AWS SSO with group-based access control"
                        ],
                        terraform_example: `# IAM policy for developers - can create but not deploy to production
resource "aws_iam_policy" "developer_policy" {
  name        = "DeveloperPolicy"
  description = "Developers can develop but not deploy to production"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowDevelopmentAccess"
        Effect = "Allow"
        Action = [
          "ec2:*",
          "s3:*",
          "rds:*",
          "lambda:*"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:RequestedRegion" = "us-east-1"
          }
          StringLike = {
            "aws:ResourceTag/Environment" = ["dev", "staging"]
          }
        }
      },
      {
        Sid    = "DenyProductionAccess"
        Effect = "Deny"
        Action = "*"
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Environment" = "production"
          }
        }
      },
      {
        Sid    = "DenyIAMModification"
        Effect = "Deny"
        Action = [
          "iam:CreateUser",
          "iam:DeleteUser",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:AttachUserPolicy",
          "iam:AttachRolePolicy",
          "iam:PutUserPolicy",
          "iam:PutRolePolicy"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM policy for deployers - can deploy but not develop
resource "aws_iam_policy" "deployer_policy" {
  name        = "DeployerPolicy"
  description = "Deployers can deploy to production but not modify code"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowProductionDeployment"
        Effect = "Allow"
        Action = [
          "ecs:UpdateService",
          "ecs:RegisterTaskDefinition",
          "lambda:UpdateFunctionCode",
          "lambda:PublishVersion",
          "codedeploy:CreateDeployment",
          "codedeploy:GetDeployment"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:ResourceTag/Environment" = "production"
          }
        }
      },
      {
        Sid    = "DenyCodeModification"
        Effect = "Deny"
        Action = [
          "codecommit:*",
          "lambda:CreateFunction",
          "lambda:DeleteFunction",
          "ec2:RunInstances",
          "ec2:TerminateInstances"
        ]
        Resource = "*"
      },
      {
        Sid    = "DenyIAMModification"
        Effect = "Deny"
        Action = "iam:*"
        Resource = "*"
      }
    ]
  })
}

# IAM policy for security team - can audit but not modify
resource "aws_iam_policy" "security_auditor_policy" {
  name        = "SecurityAuditorPolicy"
  description = "Security team can audit but not modify resources"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowReadOnlyAccess"
        Effect = "Allow"
        Action = [
          "cloudtrail:LookupEvents",
          "cloudtrail:GetTrailStatus",
          "config:Describe*",
          "config:Get*",
          "config:List*",
          "guardduty:Get*",
          "guardduty:List*",
          "securityhub:Get*",
          "securityhub:List*",
          "access-analyzer:List*",
          "iam:Get*",
          "iam:List*",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = "*"
      },
      {
        Sid    = "DenyModification"
        Effect = "Deny"
        Action = [
          "*:Create*",
          "*:Delete*",
          "*:Update*",
          "*:Put*",
          "*:Modify*"
        ]
        Resource = "*"
      }
    ]
  })
}

# Permission boundary to prevent privilege escalation
resource "aws_iam_policy" "permission_boundary" {
  name        = "MaxPermissionBoundary"
  description = "Maximum permissions any user can have"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyPrivilegeEscalation"
        Effect = "Deny"
        Action = [
          "iam:CreatePolicyVersion",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:SetDefaultPolicyVersion",
          "iam:PassRole"
        ]
        Resource = "*"
      },
      {
        Sid    = "DenyOrganizationChanges"
        Effect = "Deny"
        Action = "organizations:*"
        Resource = "*"
      }
    ]
  })
}

# Attach permission boundary to all users
resource "aws_iam_user" "developer" {
  name                 = "developer-user"
  permissions_boundary = aws_iam_policy.permission_boundary.arn
  
  tags = {
    Role = "Developer"
  }
}`,
                        verification: [
                            "Test developers cannot access production resources",
                            "Test deployers cannot modify code repositories",
                            "Test security auditors cannot modify resources",
                            "Review CloudTrail for any privilege escalation attempts",
                            "Use AWS IAM Access Analyzer to identify overly permissive policies"
                        ],
                        cost_estimate: "$0-50/month (IAM is free, CloudTrail/Config costs)",
                        effort_hours: 20
                    }
                },
                
                azure: {
                    services: ["Azure RBAC", "Azure AD PIM", "Management Groups", "Azure Policy", "Activity Log"],
                    implementation: {
                        steps: [
                            "Define custom RBAC roles with separation of duties",
                            "Use Azure AD Privileged Identity Management (PIM) for just-in-time access",
                            "Implement Management Groups for organizational hierarchy",
                            "Create separate subscriptions for dev/staging/production",
                            "Use Azure Policy to enforce separation controls",
                            "Require approval workflows for privileged role activation",
                            "Enable Activity Log for all privileged actions",
                            "Implement Conditional Access for sensitive operations",
                            "Use Azure AD access reviews for periodic validation",
                            "Configure alerts for privilege escalation attempts"
                        ],
                        azure_cli_example: `# Create custom role for developers - no production access
az role definition create --role-definition '{
  "Name": "Developer Role",
  "Description": "Developers can work in dev/staging but not production",
  "Actions": [
    "Microsoft.Compute/*",
    "Microsoft.Storage/*",
    "Microsoft.Web/*",
    "Microsoft.Sql/servers/databases/read"
  ],
  "NotActions": [
    "Microsoft.Authorization/*/Write",
    "Microsoft.Authorization/*/Delete"
  ],
  "AssignableScopes": [
    "/subscriptions/DEV_SUBSCRIPTION_ID",
    "/subscriptions/STAGING_SUBSCRIPTION_ID"
  ]
}'

# Create custom role for deployers - production deployment only
az role definition create --role-definition '{
  "Name": "Production Deployer Role",
  "Description": "Can deploy to production but not modify code",
  "Actions": [
    "Microsoft.Web/sites/publish/Action",
    "Microsoft.Web/sites/config/write",
    "Microsoft.ContainerRegistry/registries/pull/read",
    "Microsoft.ContainerService/managedClusters/write"
  ],
  "NotActions": [
    "Microsoft.Resources/deployments/write",
    "Microsoft.Compute/virtualMachines/write",
    "Microsoft.Authorization/*/Write"
  ],
  "AssignableScopes": [
    "/subscriptions/PROD_SUBSCRIPTION_ID"
  ]
}'

# Create custom role for security auditors - read-only
az role definition create --role-definition '{
  "Name": "Security Auditor Role",
  "Description": "Read-only access for security auditing",
  "Actions": [
    "*/read",
    "Microsoft.Security/*/read",
    "Microsoft.SecurityInsights/*/read"
  ],
  "NotActions": [
    "*/write",
    "*/delete"
  ],
  "AssignableScopes": [
    "/subscriptions/ALL_SUBSCRIPTION_IDS"
  ]
}'

# Configure PIM for just-in-time privileged access
az ad sp create-for-rbac --name "PIM-Admin" --role "Privileged Role Administrator"

# Assign role with PIM (requires approval)
az role assignment create \\
  --assignee user@domain.com \\
  --role "Production Deployer Role" \\
  --scope /subscriptions/PROD_SUBSCRIPTION_ID \\
  --description "Requires manager approval for activation"

# Create Azure Policy to deny production access to developers
az policy definition create --name 'DenyDeveloperProductionAccess' \\
  --mode All \\
  --rules '{
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Compute/virtualMachines"
        },
        {
          "field": "tags.Environment",
          "equals": "Production"
        }
      ]
    },
    "then": {
      "effect": "deny"
    }
  }' \\
  --params '{}'

# Assign policy to subscription
az policy assignment create \\
  --name 'EnforceSeparationOfDuties' \\
  --policy 'DenyDeveloperProductionAccess' \\
  --scope /subscriptions/SUBSCRIPTION_ID`,
                        verification: [
                            "Test developers cannot access production subscription",
                            "Test deployers cannot modify development resources",
                            "Verify PIM requires approval for privileged roles",
                            "Review Activity Log for privilege escalation attempts",
                            "Use Azure AD access reviews to validate role assignments"
                        ],
                        cost_estimate: "$6-16/user/month (Azure AD P2 for PIM)",
                        effort_hours: 20
                    }
                },
                
                gcp: {
                    services: ["IAM", "Organization Policies", "Resource Manager", "Cloud Audit Logs", "VPC Service Controls"],
                    implementation: {
                        steps: [
                            "Define custom IAM roles with separation of duties",
                            "Use separate GCP projects for dev/staging/production",
                            "Implement Organization Policies to enforce constraints",
                            "Use IAM Conditions for context-aware access control",
                            "Enable Cloud Audit Logs for all privileged actions",
                            "Implement VPC Service Controls for data perimeter",
                            "Use Resource Manager hierarchy for inheritance",
                            "Configure IAM recommender to identify over-privileged accounts",
                            "Implement break-glass procedures with monitoring",
                            "Use Workload Identity for service-to-service auth"
                        ],
                        gcloud_example: `# Create custom role for developers
gcloud iam roles create developer_role \\
  --project=PROJECT_ID \\
  --title="Developer Role" \\
  --description="Developers can work in dev/staging only" \\
  --permissions=compute.instances.create,compute.instances.delete,storage.buckets.create,storage.objects.create \\
  --stage=GA

# Create custom role for deployers
gcloud iam roles create deployer_role \\
  --project=PROJECT_ID \\
  --title="Production Deployer Role" \\
  --description="Can deploy to production but not develop" \\
  --permissions=run.services.update,cloudfunctions.functions.update,container.clusters.update \\
  --stage=GA

# Create custom role for security auditors
gcloud iam roles create security_auditor_role \\
  --project=PROJECT_ID \\
  --title="Security Auditor Role" \\
  --description="Read-only access for auditing" \\
  --permissions=logging.logEntries.list,monitoring.timeSeries.list,cloudaudit.logs.read \\
  --stage=GA

# Assign developer role to dev project only
gcloud projects add-iam-policy-binding dev-project-id \\
  --member=user:developer@domain.com \\
  --role=projects/PROJECT_ID/roles/developer_role

# Assign deployer role to production project only
gcloud projects add-iam-policy-binding prod-project-id \\
  --member=user:deployer@domain.com \\
  --role=projects/PROJECT_ID/roles/deployer_role

# Assign auditor role to all projects
gcloud organizations add-iam-policy-binding ORGANIZATION_ID \\
  --member=user:auditor@domain.com \\
  --role=projects/PROJECT_ID/roles/security_auditor_role

# Create Organization Policy to restrict project creation
gcloud resource-manager org-policies set-policy \\
  --organization=ORGANIZATION_ID \\
  policy.yaml

# policy.yaml content:
# constraint: constraints/resourcemanager.allowedProjectCreators
# listPolicy:
#   allowedValues:
#     - user:admin@domain.com

# Use IAM Conditions for time-based access
gcloud projects add-iam-policy-binding prod-project-id \\
  --member=user:deployer@domain.com \\
  --role=roles/run.admin \\
  --condition='expression=request.time < timestamp("2024-12-31T23:59:59Z"),title=Temporary Access,description=Access expires end of year'`,
                        verification: [
                            "Test developers cannot access production project",
                            "Test deployers cannot create new resources",
                            "Verify IAM conditions enforce time/location restrictions",
                            "Review Cloud Audit Logs for privilege escalation",
                            "Use IAM recommender to identify excessive permissions"
                        ],
                        cost_estimate: "$0-50/month (IAM is free, Audit Logs costs)",
                        effort_hours: 18
                    }
                }
            },
            
            database: {
                postgresql: {
                    features: ["Database Roles", "Row-Level Security", "Schema Separation", "Audit Logging"],
                    implementation: {
                        steps: [
                            "Create separate database roles for different functions",
                            "Use schema-level permissions to separate duties",
                            "Implement row-level security (RLS) for data access control",
                            "Enable pgAudit extension for comprehensive logging",
                            "Separate read-only and read-write roles",
                            "Implement stored procedures for controlled data modification",
                            "Use GRANT/REVOKE to enforce least privilege",
                            "Create separate roles for backup/restore operations",
                            "Implement connection pooling with role-based routing"
                        ],
                        sql_example: `-- Create separate roles for different duties
CREATE ROLE app_developer LOGIN PASSWORD 'secure_password';
CREATE ROLE app_deployer LOGIN PASSWORD 'secure_password';
CREATE ROLE data_analyst LOGIN PASSWORD 'secure_password';
CREATE ROLE dba_admin LOGIN PASSWORD 'secure_password';
CREATE ROLE security_auditor LOGIN PASSWORD 'secure_password';

-- Developer role - can create/modify in dev schema only
GRANT CONNECT ON DATABASE cui_app TO app_developer;
GRANT USAGE ON SCHEMA dev TO app_developer;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dev TO app_developer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dev TO app_developer;
ALTER DEFAULT PRIVILEGES IN SCHEMA dev GRANT ALL ON TABLES TO app_developer;

-- Deployer role - can deploy to production but not modify schema
GRANT CONNECT ON DATABASE cui_app TO app_deployer;
GRANT USAGE ON SCHEMA production TO app_deployer;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA production TO app_deployer;
-- Explicitly deny DDL operations
REVOKE CREATE ON SCHEMA production FROM app_deployer;

-- Data analyst role - read-only access to production
GRANT CONNECT ON DATABASE cui_app TO data_analyst;
GRANT USAGE ON SCHEMA production TO data_analyst;
GRANT SELECT ON ALL TABLES IN SCHEMA production TO data_analyst;
ALTER DEFAULT PRIVILEGES IN SCHEMA production GRANT SELECT ON TABLES TO data_analyst;

-- Security auditor role - can read logs and metadata only
GRANT CONNECT ON DATABASE cui_app TO security_auditor;
GRANT SELECT ON pg_catalog.pg_stat_activity TO security_auditor;
GRANT SELECT ON pg_catalog.pg_stat_statements TO security_auditor;
-- Grant access to audit log table
GRANT SELECT ON audit.logged_actions TO security_auditor;

-- DBA admin role - full access but logged
GRANT ALL PRIVILEGES ON DATABASE cui_app TO dba_admin;
-- Enable logging for DBA actions
ALTER ROLE dba_admin SET log_statement = 'all';

-- Implement row-level security for sensitive data
ALTER TABLE production.customer_data ENABLE ROW LEVEL SECURITY;

-- Policy: developers can only see test data
CREATE POLICY developer_policy ON production.customer_data
  FOR ALL
  TO app_developer
  USING (data_classification = 'test');

-- Policy: analysts can see non-CUI data only
CREATE POLICY analyst_policy ON production.customer_data
  FOR SELECT
  TO data_analyst
  USING (data_classification != 'CUI');

-- Policy: deployers can modify but not delete
CREATE POLICY deployer_policy ON production.customer_data
  FOR UPDATE
  TO app_deployer
  USING (true)
  WITH CHECK (true);

-- Enable pgAudit extension
CREATE EXTENSION IF NOT EXISTS pgaudit;

-- Configure audit logging for all roles
ALTER SYSTEM SET pgaudit.log = 'write, ddl, role';
ALTER SYSTEM SET pgaudit.log_catalog = 'off';
ALTER SYSTEM SET pgaudit.log_parameter = 'on';
ALTER SYSTEM SET pgaudit.log_relation = 'on';

-- Create audit log table
CREATE SCHEMA IF NOT EXISTS audit;
CREATE TABLE audit.logged_actions (
  event_id BIGSERIAL PRIMARY KEY,
  schema_name TEXT,
  table_name TEXT,
  user_name TEXT,
  action TEXT,
  original_data JSONB,
  new_data JSONB,
  query TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit.logged_actions (
    schema_name, table_name, user_name, action, 
    original_data, new_data, query
  ) VALUES (
    TG_TABLE_SCHEMA, TG_TABLE_NAME, SESSION_USER, TG_OP,
    row_to_json(OLD), row_to_json(NEW), current_query()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON production.customer_data
  FOR EACH ROW EXECUTE FUNCTION audit.log_changes();`,
                        verification: [
                            "Test developers cannot access production schema",
                            "Test deployers cannot perform DDL operations",
                            "Verify row-level security policies are enforced",
                            "Review audit logs for all privileged operations",
                            "Test that analysts have read-only access"
                        ],
                        effort_hours: 16
                    }
                },
                
                mysql: {
                    features: ["User Privileges", "Database Separation", "Audit Plugin", "Roles"],
                    implementation: {
                        steps: [
                            "Create separate MySQL users for different functions",
                            "Use database-level privileges for separation",
                            "Enable MySQL Enterprise Audit or MariaDB audit plugin",
                            "Implement roles (MySQL 8.0+) for grouped permissions",
                            "Separate read-only and read-write users",
                            "Use views to restrict data access",
                            "Implement stored procedures for controlled operations",
                            "Enable binary logging for change tracking"
                        ],
                        sql_example: `-- Create roles for separation of duties (MySQL 8.0+)
CREATE ROLE 'app_developer';
CREATE ROLE 'app_deployer';
CREATE ROLE 'data_analyst';
CREATE ROLE 'dba_admin';
CREATE ROLE 'security_auditor';

-- Developer role - dev database only
GRANT ALL PRIVILEGES ON cui_dev.* TO 'app_developer';
GRANT SELECT, INSERT, UPDATE, DELETE ON cui_staging.* TO 'app_developer';

-- Deployer role - can deploy but not modify structure
GRANT SELECT, INSERT, UPDATE, DELETE ON cui_production.* TO 'app_deployer';
REVOKE CREATE, DROP, ALTER ON cui_production.* FROM 'app_deployer';

-- Data analyst role - read-only
GRANT SELECT ON cui_production.* TO 'data_analyst';

-- Security auditor role - audit logs only
GRANT SELECT ON mysql.general_log TO 'security_auditor';
GRANT SELECT ON mysql.slow_log TO 'security_auditor';
GRANT SELECT ON audit_log.* TO 'security_auditor';

-- DBA admin role - full access
GRANT ALL PRIVILEGES ON *.* TO 'dba_admin' WITH GRANT OPTION;

-- Create users and assign roles
CREATE USER 'dev_user'@'%' IDENTIFIED BY 'secure_password';
GRANT 'app_developer' TO 'dev_user'@'%';
SET DEFAULT ROLE 'app_developer' TO 'dev_user'@'%';

CREATE USER 'deploy_user'@'%' IDENTIFIED BY 'secure_password';
GRANT 'app_deployer' TO 'deploy_user'@'%';
SET DEFAULT ROLE 'app_deployer' TO 'deploy_user'@'%';

-- Enable audit logging (MySQL Enterprise Audit)
INSTALL PLUGIN audit_log SONAME 'audit_log.so';
SET GLOBAL audit_log_policy = 'ALL';
SET GLOBAL audit_log_format = 'JSON';

-- Create audit log table for custom logging
CREATE DATABASE IF NOT EXISTS audit_log;
CREATE TABLE audit_log.user_actions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(255),
  host VARCHAR(255),
  query_text TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user),
  INDEX idx_timestamp (timestamp)
);`,
                        verification: [
                            "Test developers cannot access production database",
                            "Test deployers cannot perform DDL operations",
                            "Verify audit plugin logs all privileged actions",
                            "Review role assignments for proper separation",
                            "Test that analysts have read-only access"
                        ],
                        effort_hours: 14
                    }
                }
            },
            
            application: {
                nodejs: {
                    features: ["RBAC Middleware", "Permission Checks", "Audit Logging", "Separation in Code"],
                    implementation: {
                        steps: [
                            "Implement role-based access control (RBAC) middleware",
                            "Create separate service accounts for different functions",
                            "Use environment-specific configuration files",
                            "Implement approval workflows for critical operations",
                            "Separate read and write API endpoints",
                            "Use different database connections for different roles",
                            "Implement audit logging for all privileged actions",
                            "Use feature flags to control access to sensitive features"
                        ],
                        code_example: `// rbac-middleware.js - Role-based access control
const roles = {
  developer: {
    permissions: ['read:dev', 'write:dev', 'read:staging'],
    environments: ['development', 'staging']
  },
  deployer: {
    permissions: ['deploy:production', 'read:production'],
    environments: ['production'],
    requiresApproval: true
  },
  analyst: {
    permissions: ['read:production', 'read:staging', 'read:dev'],
    environments: ['development', 'staging', 'production']
  },
  admin: {
    permissions: ['*'],
    environments: ['*'],
    requiresMFA: true
  }
};

// Middleware to check role permissions
function checkPermission(requiredPermission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const roleConfig = roles[userRole];
    
    if (!roleConfig) {
      return res.status(403).json({ error: 'Invalid role' });
    }
    
    // Check if user has required permission
    const hasPermission = roleConfig.permissions.includes('*') ||
                         roleConfig.permissions.includes(requiredPermission);
    
    if (!hasPermission) {
      auditLog({
        user: req.user.email,
        action: 'permission_denied',
        permission: requiredPermission,
        timestamp: new Date()
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    // Check environment access
    const currentEnv = process.env.NODE_ENV;
    const hasEnvAccess = roleConfig.environments.includes('*') ||
                        roleConfig.environments.includes(currentEnv);
    
    if (!hasEnvAccess) {
      auditLog({
        user: req.user.email,
        action: 'environment_access_denied',
        environment: currentEnv,
        timestamp: new Date()
      });
      return res.status(403).json({ error: 'Environment access denied' });
    }
    
    // Check if approval is required
    if (roleConfig.requiresApproval && !req.approvalToken) {
      return res.status(403).json({ 
        error: 'Approval required',
        approvalUrl: '/api/request-approval'
      });
    }
    
    // Log successful access
    auditLog({
      user: req.user.email,
      action: 'permission_granted',
      permission: requiredPermission,
      environment: currentEnv,
      timestamp: new Date()
    });
    
    next();
  };
}

// Separation of duties in API routes
const express = require('express');
const router = express.Router();

// Developer routes - dev/staging only
router.post('/api/dev/deploy', 
  checkPermission('write:dev'),
  async (req, res) => {
    // Deploy to development
  }
);

// Deployer routes - production deployment with approval
router.post('/api/production/deploy',
  checkPermission('deploy:production'),
  requireApproval(),
  async (req, res) => {
    // Deploy to production
    auditLog({
      user: req.user.email,
      action: 'production_deployment',
      details: req.body,
      approver: req.approvalToken.approver,
      timestamp: new Date()
    });
  }
);

// Analyst routes - read-only
router.get('/api/data/query',
  checkPermission('read:production'),
  async (req, res) => {
    // Read-only data access
  }
);

// Approval workflow middleware
function requireApproval() {
  return async (req, res, next) => {
    const approvalToken = req.headers['x-approval-token'];
    
    if (!approvalToken) {
      return res.status(403).json({
        error: 'Approval required',
        message: 'This action requires manager approval'
      });
    }
    
    // Verify approval token
    const approval = await verifyApprovalToken(approvalToken);
    
    if (!approval.valid) {
      return res.status(403).json({ error: 'Invalid approval token' });
    }
    
    req.approvalToken = approval;
    next();
  };
}

// Audit logging function
async function auditLog(entry) {
  const db = require('./db');
  await db.query(
    'INSERT INTO audit_log (user_email, action, details, timestamp) VALUES ($1, $2, $3, $4)',
    [entry.user, entry.action, JSON.stringify(entry), entry.timestamp]
  );
}

module.exports = { checkPermission, requireApproval };`,
                        verification: [
                            "Test developers cannot deploy to production",
                            "Test deployers cannot modify code",
                            "Verify approval workflow for critical actions",
                            "Review audit logs for all privileged operations",
                            "Test role-based access control enforcement"
                        ],
                        effort_hours: 24
                    }
                }
            },
            
            small_business: {
                budget_tier: "under_2k",
                recommended_approach: "Use cloud provider IAM with separate accounts/projects",
                implementation: {
                    steps: [
                        "Create separate AWS/Azure/GCP accounts for dev and production",
                        "Use built-in IAM roles (no custom development needed)",
                        "Implement simple approval process (email/Slack)",
                        "Use separate database users with different privileges",
                        "Enable cloud provider audit logging (free tier)",
                        "Document separation of duties in policy",
                        "Use GitHub branch protection for code approval",
                        "Implement 2-person rule for production changes"
                    ],
                    tools: [
                        { name: "AWS Organizations (free)", cost: "$0", purpose: "Separate accounts" },
                        { name: "GitHub branch protection", cost: "$0", purpose: "Code approval" },
                        { name: "CloudTrail/Activity Log", cost: "$0-10/month", purpose: "Audit logging" },
                        { name: "Slack/Email", cost: "$0", purpose: "Approval workflow" }
                    ],
                    total_cost_estimate: "$0-20/month",
                    effort_hours: 8
                }
            }
        }
        
        ,
        
        "AC.L2-3.1.5": {
            objective: "Employ the principle of least privilege, including for specific security functions and privileged accounts.",
            summary: "Just-in-time access, minimal permissions, zero standing privileges",
            
            cloud: {
                aws: { services: ["IAM", "SSO", "STS", "Secrets Manager"], implementation: { steps: ["Use IAM roles instead of long-term credentials", "Implement permission boundaries", "Use AWS SSO with time-limited sessions", "Enable MFA for privileged access", "Use STS AssumeRole for temporary credentials", "Implement just-in-time access with approval", "Remove unused permissions with Access Analyzer", "Use service-specific roles (not *:*)"], cost_estimate: "$0-20/month", effort_hours: 12 }},
                azure: { services: ["Azure AD PIM", "RBAC", "Managed Identities"], implementation: { steps: ["Use Managed Identities for Azure resources", "Implement PIM for just-in-time privileged access", "Use custom RBAC roles with minimal permissions", "Enable MFA for all privileged roles", "Set maximum role assignment duration", "Require approval for privileged role activation", "Use access reviews to remove unused permissions"], cost_estimate: "$6-16/user/month (Azure AD P2)", effort_hours: 12 }},
                gcp: { services: ["IAM", "Workload Identity", "VPC Service Controls"], implementation: { steps: ["Use Workload Identity for GKE workloads", "Implement custom IAM roles with minimal permissions", "Use IAM Conditions for context-aware access", "Enable just-in-time access with time-based conditions", "Use service accounts with minimal scopes", "Implement IAM recommender to remove excess permissions"], cost_estimate: "$0-15/month", effort_hours: 10 }}
            },
            database: {
                postgresql: { implementation: { steps: ["Grant minimal table/column permissions", "Use row-level security for data filtering", "Revoke PUBLIC schema permissions", "Use SECURITY DEFINER functions sparingly", "Implement connection pooling with role mapping"], effort_hours: 8 }},
                mysql: { implementation: { steps: ["Grant specific privileges (not ALL)", "Use database/table-level grants", "Revoke unnecessary SUPER privilege", "Limit GRANT OPTION usage", "Use roles for grouped permissions"], effort_hours: 6 }}
            },
            small_business: { approach: "Use cloud provider managed identities and built-in least privilege roles", cost_estimate: "$0-10/month", effort_hours: 6 }
        }
        
        ,
        
        "AC.L2-3.1.6": {
            objective: "Use non-privileged accounts or roles when accessing nonsecurity functions.",
            summary: "Separate admin and user accounts, no daily use of privileged accounts",
            
            cloud: {
                aws: { implementation: { steps: ["Require separate IAM users for admin vs daily work", "Use AWS SSO with separate permission sets", "Disable root account for daily use", "Implement break-glass procedures for emergencies", "Monitor privileged account usage with CloudTrail"], effort_hours: 6 }},
                azure: { implementation: { steps: ["Require separate accounts for admin tasks", "Use PIM for temporary admin elevation", "Disable global admin for daily use", "Implement Conditional Access for admin accounts", "Monitor admin account sign-ins"], effort_hours: 6 }},
                gcp: { implementation: { steps: ["Use separate accounts for admin vs user tasks", "Implement organization policies to restrict admin usage", "Monitor admin activity with Cloud Audit Logs", "Use IAM conditions to limit admin access"], effort_hours: 6 }}
            },
            application: {
                general: { implementation: { steps: ["Implement role-based UI (hide admin features from regular users)", "Require re-authentication for privileged operations", "Log all privileged function usage", "Use separate service accounts for different app tiers"], effort_hours: 8 }}
            },
            small_business: { approach: "Use separate email accounts for admin access, require MFA for admin accounts", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AC.L2-3.1.7": {
            objective: "Prevent non-privileged users from executing privileged functions.",
            summary: "Technical controls to block privilege escalation",
            
            cloud: {
                aws: { implementation: { steps: ["Use SCPs to deny privilege escalation actions", "Implement permission boundaries", "Deny iam:PassRole for non-admin users", "Use AWS Config rules to detect privilege escalation", "Monitor for unauthorized privilege usage"], effort_hours: 10 }},
                azure: { implementation: { steps: ["Use Azure Policy to deny privileged operations", "Implement RBAC with NotActions for dangerous permissions", "Enable PIM approval workflows", "Monitor for privilege escalation with Sentinel"], effort_hours: 10 }},
                gcp: { implementation: { steps: ["Use organization policies to restrict privileged actions", "Implement IAM deny policies", "Monitor for setIamPolicy calls", "Use VPC Service Controls to prevent data exfiltration"], effort_hours: 8 }}
            },
            operating_system: {
                linux: { implementation: { steps: ["Remove sudo access for regular users", "Use sudoers with specific command restrictions", "Disable SUID/SGID on unnecessary binaries", "Implement AppArmor/SELinux mandatory access control", "Monitor /var/log/auth.log for sudo usage"], effort_hours: 6 }},
                windows: { implementation: { steps: ["Remove local admin rights", "Use Windows Defender Application Control", "Implement UAC with admin approval mode", "Disable unnecessary privileged groups", "Monitor Security event log 4672 (privileged logon)"], effort_hours: 6 }}
            },
            small_business: { approach: "Remove admin rights from daily user accounts, use separate admin accounts only when needed", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "AC.L2-3.1.8": {
            objective: "Limit unsuccessful logon attempts.",
            summary: "Account lockout policies to prevent brute force attacks",
            
            cloud: {
                aws: { implementation: { steps: ["Configure AWS Cognito account lockout (5 attempts)", "Use AWS WAF rate limiting for login endpoints", "Implement CloudWatch alarms for failed login attempts", "Use AWS SSO with lockout policies", "Enable MFA to reduce brute force risk"], effort_hours: 6 }},
                azure: { implementation: { steps: ["Configure Azure AD Smart Lockout (10 attempts, 60s lockout)", "Use Conditional Access to block suspicious sign-ins", "Enable Azure AD Identity Protection risk policies", "Implement MFA to mitigate brute force", "Monitor sign-in logs for failed attempts"], effort_hours: 6 }},
                gcp: { implementation: { steps: ["Configure Cloud Identity account lockout", "Use Cloud Armor rate limiting for web apps", "Implement reCAPTCHA Enterprise for login forms", "Monitor Cloud Audit Logs for failed authentication"], effort_hours: 6 }}
            },
            application: {
                nodejs: { implementation: { steps: ["Implement express-rate-limit middleware", "Use bcrypt with progressive delays", "Lock accounts after 5 failed attempts", "Implement CAPTCHA after 3 failed attempts", "Log all failed login attempts"], effort_hours: 8 }},
                database: { implementation: { steps: ["Configure pg_hba.conf connection limits", "Implement failed login tracking table", "Use connection pooler with rate limiting", "Monitor authentication failures"], effort_hours: 6 }}
            },
            small_business: { approach: "Enable account lockout in Microsoft 365 (5 attempts, 30 min lockout) and cloud provider settings", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AC.L2-3.1.9": {
            objective: "Provide privacy and security notices consistent with applicable CUI rules.",
            summary: "Login banners, consent notices, privacy statements",
            
            implementation: {
                general: {
                    steps: [
                        "Display system use notification before login",
                        "Include consent to monitoring statement",
                        "Reference applicable CUI rules (32 CFR Part 2002)",
                        "Display privacy act statement if collecting PII",
                        "Require acknowledgment before access",
                        "Include notice in remote access (VPN, RDP)",
                        "Post physical security notices at entry points",
                        "Update notices when CUI rules change"
                    ],
                    banner_template: "WARNING: This system processes Controlled Unclassified Information (CUI) and is for authorized use only. By accessing this system, you consent to monitoring and recording. Unauthorized access or misuse may result in criminal and/or civil penalties. All activities are logged and monitored. CUI must be handled in accordance with 32 CFR Part 2002 and NIST SP 800-171.",
                    effort_hours: 4
                }
            },
            
            cloud: {
                aws: { implementation: { steps: ["Add login banner to AWS Console via IAM policy", "Configure SSH banner in EC2 instances (/etc/issue.net)", "Display banner in AWS WorkSpaces", "Include notice in AWS SSO login page"], effort_hours: 3 }},
                azure: { implementation: { steps: ["Configure Azure AD sign-in page branding with notice", "Add banner to Azure Virtual Desktop", "Configure SSH banner in Azure VMs", "Include notice in Azure AD B2C user flows"], effort_hours: 3 }},
                windows: { implementation: { steps: ["Configure Group Policy: Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options", "Set 'Interactive logon: Message text for users attempting to log on'", "Set 'Interactive logon: Message title for users attempting to log on'"], effort_hours: 2 }},
                linux: { implementation: { steps: ["Edit /etc/issue (console login banner)", "Edit /etc/issue.net (SSH login banner)", "Edit /etc/motd (message of the day)", "Configure SSH: Banner /etc/issue.net in /etc/ssh/sshd_config"], effort_hours: 2 }}
            },
            
            small_business: { approach: "Add login banner to Microsoft 365, website login pages, and VPN", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AC.L2-3.1.10": {
            objective: "Use session lock with pattern-hiding displays to prevent access and viewing of data after a period of inactivity.",
            summary: "Auto-lock screens after 15 minutes of inactivity",
            
            cloud: {
                aws: { implementation: { steps: ["Configure AWS WorkSpaces session timeout (15 min)", "Set CloudShell timeout", "Configure EC2 instance screen lock via Group Policy/config management", "Use AWS SSO session timeout (12 hours max)"], effort_hours: 4 }},
                azure: { implementation: { steps: ["Configure Azure Virtual Desktop session timeout (15 min)", "Set Azure AD session timeout (12 hours)", "Configure Intune screen lock policy (15 min)", "Use Conditional Access session controls"], effort_hours: 4 }},
                gcp: { implementation: { steps: ["Configure Cloud Identity session timeout", "Set Chrome OS screen lock (15 min)", "Configure Compute Engine instance screen lock", "Use Cloud Identity session controls"], effort_hours: 4 }}
            },
            
            operating_system: {
                windows: { implementation: { steps: ["Group Policy: Computer Configuration > Policies > Windows Settings > Security Settings > Local Policies > Security Options", "Set 'Interactive logon: Machine inactivity limit' to 900 seconds (15 min)", "Enable 'Screen saver timeout' to 900 seconds", "Require password on wake"], effort_hours: 2 }},
                macos: { implementation: { steps: ["System Preferences > Security & Privacy > General", "Set 'Require password after sleep or screen saver begins' to 'immediately'", "System Preferences > Desktop & Screen Saver", "Set 'Start after' to 15 minutes", "Use MDM to enforce settings"], effort_hours: 2 }},
                linux: { implementation: { steps: ["Configure GNOME: gsettings set org.gnome.desktop.session idle-delay 900", "Configure screen lock: gsettings set org.gnome.desktop.screensaver lock-enabled true", "Configure lock delay: gsettings set org.gnome.desktop.screensaver lock-delay 0", "For servers: Configure TMOUT=900 in /etc/profile"], effort_hours: 2 }}
            },
            
            mobile: {
                ios: { implementation: { steps: ["MDM policy: Auto-Lock after 5 minutes", "Require passcode immediately", "Use Intune/Jamf to enforce"], effort_hours: 2 }},
                android: { implementation: { steps: ["MDM policy: Screen timeout 5 minutes", "Require lock screen security", "Use Intune/Google Workspace to enforce"], effort_hours: 2 }}
            },
            
            small_business: { approach: "Configure Windows/Mac screen lock via local policy, enforce on mobile devices via Microsoft 365/Google Workspace MDM", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "AC.L2-3.1.11": {
            objective: "Terminate (automatically) a user session after a defined condition.",
            summary: "Auto-logout after inactivity or max session duration",
            cloud: {
                aws: { implementation: { steps: ["Configure AWS SSO session timeout (12 hours max)", "Set CloudFront signed cookie expiration", "Configure ALB session stickiness timeout", "Use Lambda@Edge for custom session validation", "Set EC2 instance idle timeout"], cost_estimate: "$0-5/month", effort_hours: 4 }},
                azure: { implementation: { steps: ["Configure Azure AD session timeout (12 hours)", "Set Conditional Access session controls", "Configure App Service session timeout", "Use Azure Front Door session affinity timeout", "Set AVD idle session timeout (15 min)"], cost_estimate: "$0", effort_hours: 4 }},
                gcp: { implementation: { steps: ["Configure Cloud Identity session timeout", "Set Cloud IAP session duration", "Configure App Engine session timeout", "Use Cloud Load Balancer session affinity timeout"], cost_estimate: "$0", effort_hours: 4 }}
            },
            application: {
                nodejs: { implementation: { steps: ["Use express-session with maxAge and rolling: false", "Implement absolute timeout (12 hours)", "Implement idle timeout (15 minutes)", "Clear session on logout", "Use Redis for distributed session store"], effort_hours: 6 }},
                general: { implementation: { steps: ["Set session timeout in web.config/application properties", "Implement both idle and absolute timeouts", "Clear server-side session data on timeout", "Redirect to login page on timeout", "Display warning before timeout"], effort_hours: 6 }}
            },
            small_business: { approach: "Configure session timeout in Microsoft 365 (12 hours), web apps (15 min idle)", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AC.L2-3.1.12": {
            objective: "Monitor and control remote access sessions.",
            summary: "VPN logging, remote desktop monitoring, privileged access tracking",
            cloud: {
                aws: { services: ["VPC", "Client VPN", "Systems Manager", "CloudTrail"], implementation: { steps: ["Deploy AWS Client VPN with MFA", "Enable VPN connection logging to CloudWatch", "Use Systems Manager Session Manager for audited SSH/RDP", "Configure VPC Flow Logs for remote access traffic", "Set up CloudTrail for API access monitoring", "Implement AWS SSO for centralized remote access"], cost_estimate: "$50-200/month (VPN endpoints)", effort_hours: 10 }},
                azure: { services: ["VPN Gateway", "Bastion", "Azure AD", "Monitor"], implementation: { steps: ["Deploy Azure VPN Gateway with P2S VPN", "Enable Azure Bastion for RDP/SSH without public IPs", "Configure Azure AD Conditional Access for remote access", "Enable NSG Flow Logs", "Use Azure Monitor for VPN connection logs", "Implement Just-in-Time VM access"], cost_estimate: "$140-400/month (Bastion + VPN)", effort_hours: 10 }},
                gcp: { services: ["Cloud VPN", "IAP", "Cloud Logging"], implementation: { steps: ["Deploy Cloud VPN with Cloud Identity", "Use Identity-Aware Proxy for TCP forwarding", "Enable VPN tunnel logging", "Configure VPC Flow Logs", "Use Cloud Logging for access monitoring"], cost_estimate: "$50-150/month", effort_hours: 8 }}
            },
            network: {
                paloalto: { implementation: { steps: ["Enable GlobalProtect VPN logging", "Configure User-ID for user tracking", "Set up syslog forwarding to SIEM", "Enable session monitoring in ACC", "Configure alerts for suspicious remote access"], effort_hours: 6 }},
                cisco: { implementation: { steps: ["Configure AnyConnect VPN with RADIUS/TACACS+", "Enable VPN session logging", "Configure ISE for posture assessment", "Set up syslog to SIEM", "Enable NetFlow for traffic analysis"], effort_hours: 6 }}
            },
            small_business: { approach: "Use Microsoft 365 sign-in logs, Windows RDP logging (Event ID 4624), VPN provider logs", cost_estimate: "$0-50/month", effort_hours: 4 }
        }
        
        ,
        
        "AC.L2-3.1.13": {
            objective: "Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.",
            summary: "TLS 1.2+, VPN encryption, encrypted remote desktop",
            cloud: {
                aws: { implementation: { steps: ["Enforce TLS 1.2+ on ALB/CloudFront", "Use AWS Client VPN with AES-256-GCM", "Configure Systems Manager Session Manager with KMS encryption", "Enable RDP encryption on EC2 Windows instances", "Use AWS Certificate Manager for TLS certificates"], cost_estimate: "$0-10/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Enforce TLS 1.2+ on Application Gateway/Front Door", "Use Azure VPN Gateway with IKEv2 and AES-256", "Configure Azure Bastion (always encrypted)", "Enable RDP encryption on Azure VMs", "Use Azure Key Vault for certificate management"], cost_estimate: "$0", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Enforce TLS 1.2+ on Cloud Load Balancer", "Use Cloud VPN with IKEv2 and AES-256-GCM", "Configure IAP TCP forwarding (always encrypted)", "Enable RDP encryption on Compute Engine", "Use Certificate Manager for TLS"], cost_estimate: "$0", effort_hours: 6 }}
            },
            network: {
                general: { implementation: { steps: ["Configure VPN with AES-256 encryption", "Enforce TLS 1.2+ on web servers", "Disable SSLv3, TLS 1.0, TLS 1.1", "Use strong cipher suites only", "Implement perfect forward secrecy (PFS)"], effort_hours: 4 }}
            },
            small_business: { approach: "Use built-in VPN encryption (IKEv2/IPsec), enforce TLS 1.2+ on websites, use encrypted RDP", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "AC.L2-3.1.14": {
            objective: "Route remote access via managed access control points.",
            summary: "VPN gateway, bastion hosts, no direct internet access to internal systems",
            cloud: {
                aws: { implementation: { steps: ["Deploy AWS Client VPN as single entry point", "Use Systems Manager Session Manager (no direct SSH/RDP)", "Remove public IPs from internal EC2 instances", "Use Transit Gateway for hub-and-spoke VPN", "Configure Security Groups to allow access only from VPN CIDR"], cost_estimate: "$75-250/month", effort_hours: 12 }},
                azure: { implementation: { steps: ["Deploy Azure Bastion for all RDP/SSH access", "Use Azure VPN Gateway as single entry point", "Remove public IPs from internal VMs", "Configure NSGs to allow access only from VPN/Bastion", "Use Azure Firewall for outbound traffic control"], cost_estimate: "$140-500/month", effort_hours: 12 }},
                gcp: { implementation: { steps: ["Use Identity-Aware Proxy for all remote access", "Deploy Cloud VPN as single entry point", "Remove external IPs from internal VMs", "Configure firewall rules to allow access only from IAP/VPN", "Use Private Google Access for API access"], cost_estimate: "$50-200/month", effort_hours: 10 }}
            },
            network: {
                general: { implementation: { steps: ["Deploy VPN concentrator as single entry point", "Configure firewall to block direct internet access to internal systems", "Use jump box/bastion host for administrative access", "Implement network segmentation", "Monitor for unauthorized access attempts"], effort_hours: 10 }}
            },
            small_business: { approach: "Use VPN as single entry point, remove public IPs from internal systems, use cloud provider bastion services", cost_estimate: "$50-150/month", effort_hours: 6 }
        }
        
        ,
        
        "AC.L2-3.1.15": {
            objective: "Authorize remote execution of privileged commands and remote access to security-relevant information.",
            summary: "Approval workflow for privileged remote access, audit all privileged sessions",
            cloud: {
                aws: { implementation: { steps: ["Use AWS SSO with approval workflow for privileged roles", "Implement Step Functions for approval automation", "Use Systems Manager Session Manager with session logging", "Configure SNS notifications for privileged access requests", "Store session logs in S3 with Glacier for long-term retention"], cost_estimate: "$10-30/month", effort_hours: 12 }},
                azure: { implementation: { steps: ["Use Azure AD PIM with approval workflow", "Configure multi-approver requirements for privileged roles", "Enable PIM audit logs to Log Analytics", "Use Azure Bastion with session recording", "Set up alerts for privileged access activation"], cost_estimate: "$6-16/user/month (Azure AD P2)", effort_hours: 12 }},
                gcp: { implementation: { steps: ["Implement custom approval workflow with Cloud Functions", "Use IAM Conditions for time-based access", "Enable Cloud Audit Logs for privileged access", "Use Cloud Logging for session monitoring", "Set up Pub/Sub notifications for privileged access"], cost_estimate: "$10-25/month", effort_hours: 14 }}
            },
            application: {
                general: { implementation: { steps: ["Implement approval workflow for privileged operations", "Require manager approval for sensitive data access", "Log all privileged command executions", "Use ticketing system integration (ServiceNow, Jira)", "Implement time-limited access tokens"], effort_hours: 16 }}
            },
            small_business: { approach: "Use email approval for privileged access, document all approvals, use cloud provider PIM features", cost_estimate: "$0-20/month", effort_hours: 8 }
        }
        
        ,
        
        "AC.L2-3.1.16": {
            objective: "Authorize wireless access prior to allowing such connections.",
            summary: "WPA3-Enterprise, 802.1X authentication, MAC address filtering",
            cloud: {
                aws: { implementation: { steps: ["Use AWS Managed Microsoft AD for RADIUS authentication", "Deploy EC2-based RADIUS server with FreeRADIUS", "Configure AWS Certificate Manager for 802.1X certificates", "Use AWS IoT Device Management for IoT device authentication"], cost_estimate: "$50-150/month", effort_hours: 10 }},
                azure: { implementation: { steps: ["Use Azure AD with NPS extension for RADIUS", "Deploy Network Policy Server on Azure VM", "Configure certificate-based 802.1X authentication", "Use Azure AD Conditional Access for wireless access control"], cost_estimate: "$50-120/month", effort_hours: 10 }},
                gcp: { implementation: { steps: ["Deploy Cloud Identity for user authentication", "Use Compute Engine for RADIUS server", "Configure certificate-based 802.1X", "Use Cloud Identity for wireless access control"], cost_estimate: "$50-100/month", effort_hours: 10 }}
            },
            network: {
                general: { implementation: { steps: ["Configure WPA3-Enterprise on wireless access points", "Deploy RADIUS server (FreeRADIUS, Cisco ISE, ClearPass)", "Implement 802.1X authentication with certificates or username/password", "Configure MAC address filtering as secondary control", "Separate guest and corporate wireless networks", "Disable WPS, WEP, WPA1"], effort_hours: 12 }}
            },
            small_business: { approach: "Use WPA3-Personal with strong passphrase, separate guest network, MAC filtering, cloud RADIUS (JumpCloud, Okta)", cost_estimate: "$0-50/month", effort_hours: 6 }
        }
        
        ,
        
        "AC.L2-3.1.17": {
            objective: "Protect wireless access using authentication and encryption.",
            summary: "WPA3, AES encryption, disable legacy protocols",
            network: {
                general: { implementation: { steps: ["Configure WPA3-Enterprise (802.1X) or WPA3-Personal", "Use AES-256 encryption (CCMP)", "Disable WEP, WPA1, TKIP", "Enable Management Frame Protection (802.11w)", "Configure strong RADIUS shared secret (32+ characters)", "Use EAP-TLS for certificate-based authentication", "Implement wireless IDS/IPS"], effort_hours: 8 }}
            },
            cloud: {
                aws: { implementation: { steps: ["Use AWS Certificate Manager for 802.1X certificates", "Deploy RADIUS server with strong encryption", "Configure CloudWatch monitoring for wireless authentication failures"], cost_estimate: "$10-30/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Use Azure AD for RADIUS authentication", "Deploy NPS with strong encryption settings", "Configure Azure Monitor for wireless access logs"], cost_estimate: "$10-25/month", effort_hours: 6 }}
            },
            small_business: { approach: "Use WPA3-Personal with 20+ character passphrase, rotate quarterly, separate guest network", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AC.L2-3.1.18": {
            objective: "Control connection of mobile devices.",
            summary: "MDM enrollment, device compliance, conditional access",
            saas: {
                microsoft365: { services: ["Intune", "Conditional Access"], implementation: { steps: ["Enroll devices in Microsoft Intune", "Configure device compliance policies (encryption, PIN, OS version)", "Implement Conditional Access to require compliant devices", "Configure app protection policies for mobile apps", "Enable remote wipe capability", "Block jailbroken/rooted devices"], cost_estimate: "$6-14/user/month (Intune)", effort_hours: 10 }},
                google_workspace: { services: ["Endpoint Management"], implementation: { steps: ["Enroll devices in Google Endpoint Management", "Configure device policies (encryption, screen lock)", "Implement Context-Aware Access", "Configure mobile app management", "Enable remote wipe", "Block rooted devices"], cost_estimate: "$6-18/user/month (Enterprise)", effort_hours: 10 }}
            },
            cloud: {
                aws: { implementation: { steps: ["Use AWS WorkSpaces for mobile access (BYOD alternative)", "Implement device certificates for authentication", "Use AWS Device Farm for testing"], cost_estimate: "$25-75/user/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use Intune for MDM", "Configure Conditional Access device policies", "Implement Azure AD device registration", "Use Azure Virtual Desktop for BYOD"], cost_estimate: "$6-14/user/month", effort_hours: 8 }}
            },
            small_business: { approach: "Use Microsoft 365 Basic Mobility (free) or Google Workspace device management, require device enrollment", cost_estimate: "$0-10/user/month", effort_hours: 6 }
        }
        
        ,
        
        "AC.L2-3.1.19": {
            objective: "Encrypt CUI on mobile devices and mobile computing platforms.",
            summary: "Full disk encryption, BitLocker, FileVault, encrypted containers",
            mobile: {
                ios: { implementation: { steps: ["Enable Data Protection (enabled by default on iOS 8+)", "Require device passcode (6+ digits)", "Use MDM to enforce encryption", "Configure passcode complexity requirements", "Enable Find My iPhone for remote wipe"], effort_hours: 2 }},
                android: { implementation: { steps: ["Enable full disk encryption (Settings > Security > Encrypt device)", "Require screen lock PIN/password", "Use MDM to enforce encryption", "Configure encryption for SD cards", "Enable remote wipe via MDM"], effort_hours: 2 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Enable BitLocker on all drives", "Use TPM 2.0 for key storage", "Store recovery keys in Azure AD or on-premises AD", "Configure Group Policy to enforce BitLocker", "Enable BitLocker To Go for removable drives"], effort_hours: 4 }},
                macos: { implementation: { steps: ["Enable FileVault full disk encryption", "Store recovery key in institutional key escrow or iCloud", "Use MDM to enforce FileVault", "Configure firmware password"], effort_hours: 3 }},
                linux: { implementation: { steps: ["Use LUKS for full disk encryption during installation", "Configure encrypted /home partition", "Store encryption keys securely", "Use TPM if available"], effort_hours: 4 }}
            },
            small_business: { approach: "Enable BitLocker (Windows Pro+), FileVault (macOS), device encryption (iOS/Android), enforce via MDM", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "AC.L2-3.1.20": {
            objective: "Verify and control/limit connections to and use of external information systems.",
            summary: "Whitelist external connections, monitor data transfers, DLP",
            cloud: {
                aws: { services: ["VPC", "Security Groups", "GuardDuty", "Macie"], implementation: { steps: ["Use VPC endpoints for AWS service access (no internet)", "Configure Security Groups to whitelist external IPs", "Enable VPC Flow Logs for connection monitoring", "Use AWS GuardDuty for threat detection", "Implement AWS Macie for data exfiltration detection", "Use AWS Firewall Manager for centralized rules"], cost_estimate: "$50-200/month", effort_hours: 12 }},
                azure: { services: ["Virtual Network", "NSG", "Firewall", "Sentinel"], implementation: { steps: ["Use Private Endpoints for Azure services", "Configure NSGs to whitelist external connections", "Deploy Azure Firewall with application rules", "Enable NSG Flow Logs", "Use Azure Sentinel for connection monitoring", "Implement Microsoft Defender for Cloud"], cost_estimate: "$100-400/month", effort_hours: 12 }},
                gcp: { services: ["VPC", "Cloud Firewall", "VPC Service Controls"], implementation: { steps: ["Use Private Google Access for API access", "Configure VPC firewall rules to whitelist external IPs", "Enable VPC Flow Logs", "Use VPC Service Controls for perimeter security", "Implement Cloud Armor for web app protection"], cost_estimate: "$50-200/month", effort_hours: 10 }}
            },
            network: {
                general: { implementation: { steps: ["Configure firewall to whitelist external connections", "Implement web proxy with URL filtering", "Deploy DLP solution to monitor data transfers", "Use DNS filtering to block malicious domains", "Monitor outbound connections with SIEM"], effort_hours: 14 }}
            },
            small_business: { approach: "Use cloud provider firewall rules, DNS filtering (Cloudflare, Quad9), monitor unusual outbound traffic", cost_estimate: "$0-50/month", effort_hours: 6 }
        }
        
        ,
        
        "AC.L2-3.1.21": {
            objective: "Limit use of portable storage devices on external systems.",
            summary: "Disable USB ports, BitLocker To Go, DLP for removable media",
            operating_system: {
                windows: { implementation: { steps: ["Use Group Policy to disable USB storage devices", "Configure BitLocker To Go for approved USB drives", "Use Windows Defender Application Control to allow only approved devices", "Implement Device Guard", "Monitor USB device usage with Event ID 6416"], effort_hours: 6 }},
                macos: { implementation: { steps: ["Use MDM to disable external storage", "Configure kernel extensions to block USB storage", "Use Jamf or Intune for device control", "Monitor USB connections"], effort_hours: 6 }},
                linux: { implementation: { steps: ["Blacklist USB storage kernel modules (usb-storage)", "Use udev rules to block USB storage devices", "Configure SELinux/AppArmor policies", "Monitor /var/log/messages for USB events"], effort_hours: 6 }}
            },
            saas: {
                microsoft365: { implementation: { steps: ["Configure Intune device compliance to block USB storage", "Use Endpoint DLP to control removable media", "Implement Conditional Access based on device compliance", "Monitor USB usage with Defender for Endpoint"], cost_estimate: "$0 (included in E5)", effort_hours: 6 }}
            },
            small_business: { approach: "Use Group Policy to disable USB storage, whitelist approved devices by serial number, use BitLocker To Go", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "AC.L2-3.1.22": {
            objective: "Control CUI posted or processed on publicly accessible information systems.",
            summary: "DLP for public websites, content review, access controls on public-facing systems",
            cloud: {
                aws: { services: ["Macie", "GuardDuty", "WAF"], implementation: { steps: ["Use AWS Macie to scan S3 buckets for CUI", "Configure S3 Block Public Access", "Implement AWS WAF to protect public websites", "Use CloudFront with signed URLs for controlled access", "Enable S3 versioning and MFA Delete", "Monitor CloudTrail for public access changes"], cost_estimate: "$50-200/month", effort_hours: 10 }},
                azure: { services: ["Purview", "Storage", "Front Door"], implementation: { steps: ["Use Microsoft Purview DLP for Azure Storage", "Configure storage accounts to disallow public access", "Implement Azure Front Door with WAF", "Use SAS tokens for time-limited access", "Enable storage analytics logging", "Monitor Activity Log for public access changes"], cost_estimate: "$50-200/month", effort_hours: 10 }},
                gcp: { services: ["DLP", "Cloud Storage", "Cloud Armor"], implementation: { steps: ["Use Cloud DLP to scan Cloud Storage for CUI", "Configure bucket-level IAM to prevent public access", "Implement Cloud Armor for web protection", "Use signed URLs for controlled access", "Enable Cloud Storage audit logs", "Monitor Cloud Logging for public access"], cost_estimate: "$50-200/month", effort_hours: 10 }}
            },
            application: {
                general: { implementation: { steps: ["Implement content review workflow before publishing", "Use DLP to scan content for CUI markers", "Require authentication for CUI access", "Implement role-based publishing permissions", "Monitor public-facing systems for unauthorized CUI", "Use watermarking for controlled documents"], effort_hours: 12 }}
            },
            small_business: { approach: "Manual review before publishing, use cloud storage private by default, implement access controls on public websites", cost_estimate: "$0-50/month", effort_hours: 6 }
        }
        
        ,
        
        "AU.L2-3.3.2": {
            objective: "Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.",
            summary: "Individual user accounts, no shared accounts, audit logging with user attribution",
            cloud: {
                aws: { services: ["IAM", "CloudTrail", "CloudWatch"], implementation: { steps: ["Disable root account for daily use", "Create individual IAM users (no shared accounts)", "Enable CloudTrail for all API activity", "Use IAM Access Analyzer to identify shared credentials", "Configure CloudWatch Logs for application logging with user context", "Tag resources with owner information"], cost_estimate: "$10-50/month", effort_hours: 6 }},
                azure: { services: ["Azure AD", "Activity Log", "Monitor"], implementation: { steps: ["Require individual Azure AD accounts", "Disable shared admin accounts", "Enable Azure Activity Log for all operations", "Use Azure AD sign-in logs for user tracking", "Configure diagnostic settings to Log Analytics", "Implement user attribution in application logs"], cost_estimate: "$5-30/month", effort_hours: 6 }},
                gcp: { services: ["Cloud Identity", "Cloud Audit Logs", "Cloud Logging"], implementation: { steps: ["Require individual Google accounts", "Disable shared service accounts for user access", "Enable Cloud Audit Logs (Admin, Data, System)", "Use Cloud Identity for user tracking", "Configure log sinks to Cloud Logging", "Implement user context in application logs"], cost_estimate: "$10-40/month", effort_hours: 6 }}
            },
            database: {
                postgresql: { implementation: { steps: ["Create individual database roles (no shared accounts)", "Enable pgAudit extension", "Configure log_statement = 'all' or 'mod'", "Set log_line_prefix to include username and session ID", "Use application-level user tracking for connection pooling"], effort_hours: 4 }},
                mysql: { implementation: { steps: ["Create individual MySQL users", "Enable general query log or audit plugin", "Configure log format to include user information", "Use application-level tracking for pooled connections", "Monitor mysql.general_log table"], effort_hours: 4 }}
            },
            small_business: { approach: "Require individual user accounts in Microsoft 365/Google Workspace, disable shared mailboxes for CUI access, enable audit logging", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "AU.L2-3.3.3": {
            objective: "Review and update logged events.",
            summary: "Quarterly review of audit log configuration, update based on incidents",
            implementation: {
                general: {
                    steps: [
                        "Document current audit log configuration",
                        "Review quarterly or after security incidents",
                        "Identify gaps in logging coverage",
                        "Add logging for new systems/applications",
                        "Remove unnecessary logging to reduce noise",
                        "Update SIEM correlation rules",
                        "Document changes in audit policy",
                        "Train SOC team on new log sources"
                    ],
                    effort_hours: 8
                }
            },
            cloud: {
                aws: { implementation: { steps: ["Review CloudTrail event selectors quarterly", "Update S3 data events based on CUI storage changes", "Review CloudWatch Log Groups for completeness", "Add logging for new AWS services", "Update AWS Config rules", "Review GuardDuty findings for logging gaps"], cost_estimate: "$0", effort_hours: 4 }},
                azure: { implementation: { steps: ["Review diagnostic settings quarterly", "Update Activity Log categories", "Review Log Analytics workspace retention", "Add logging for new Azure resources", "Update Azure Policy for logging enforcement", "Review Sentinel data connectors"], cost_estimate: "$0", effort_hours: 4 }},
                gcp: { implementation: { steps: ["Review Cloud Audit Logs configuration quarterly", "Update log sinks and filters", "Review Cloud Logging retention policies", "Add logging for new GCP services", "Update organization policies for logging", "Review Security Command Center findings"], cost_estimate: "$0", effort_hours: 4 }}
            },
            small_business: { approach: "Review Microsoft 365 audit log configuration quarterly, add new log sources as systems are added", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "AU.L2-3.3.4": {
            objective: "Alert in the event of an audit logging process failure.",
            summary: "Monitor log pipeline health, alert on logging failures",
            cloud: {
                aws: { services: ["CloudWatch", "SNS", "EventBridge"], implementation: { steps: ["Create CloudWatch alarm for CloudTrail logging failures", "Monitor S3 bucket for log delivery", "Set up EventBridge rule for CloudTrail StopLogging events", "Configure SNS topic for alert notifications", "Monitor CloudWatch Logs agent status", "Use AWS Config to detect disabled logging"], cost_estimate: "$5-20/month", effort_hours: 6 }},
                azure: { services: ["Monitor", "Action Groups", "Service Health"], implementation: { steps: ["Create Azure Monitor alert for Activity Log failures", "Monitor Log Analytics workspace ingestion", "Set up Action Group for alert notifications", "Configure Service Health alerts for logging service issues", "Monitor diagnostic settings compliance", "Use Azure Policy to detect disabled logging"], cost_estimate: "$5-15/month", effort_hours: 6 }},
                gcp: { services: ["Cloud Monitoring", "Cloud Logging", "Pub/Sub"], implementation: { steps: ["Create Cloud Monitoring alert for Audit Log failures", "Monitor log sink delivery", "Set up Pub/Sub notifications for logging errors", "Configure alerting policies for log volume drops", "Monitor Cloud Logging API errors", "Use organization policies to prevent logging disablement"], cost_estimate: "$5-20/month", effort_hours: 6 }}
            },
            application: {
                general: { implementation: { steps: ["Implement health check for logging framework", "Monitor log file rotation and disk space", "Alert on logging exceptions", "Monitor SIEM ingestion rate", "Set up dead letter queue for failed log shipments", "Test logging failure scenarios"], effort_hours: 8 }}
            },
            small_business: { approach: "Set up email alerts for Microsoft 365 audit log failures, monitor log retention settings", cost_estimate: "$0", effort_hours: 3 }
        }
        
        ,
        
        "AU.L2-3.3.5": {
            objective: "Correlate audit record review, analysis, and reporting processes for investigation and response to indications of unlawful, unauthorized, suspicious, or unusual activity.",
            summary: "SIEM correlation rules, automated alerting, incident investigation workflows",
            cloud: {
                aws: { services: ["Security Hub", "GuardDuty", "Detective", "Athena"], implementation: { steps: ["Enable AWS Security Hub for centralized findings", "Configure GuardDuty for threat detection", "Use Amazon Detective for investigation", "Create Athena queries for log analysis", "Set up EventBridge rules for automated response", "Integrate with incident response platform"], cost_estimate: "$100-500/month", effort_hours: 20 }},
                azure: { services: ["Sentinel", "Defender for Cloud", "Log Analytics"], implementation: { steps: ["Deploy Microsoft Sentinel as SIEM", "Enable Defender for Cloud for threat detection", "Create KQL queries for correlation", "Configure analytics rules for automated alerting", "Set up playbooks for automated response", "Integrate with incident management system"], cost_estimate: "$200-800/month", effort_hours: 20 }},
                gcp: { services: ["Chronicle", "Security Command Center", "BigQuery"], implementation: { steps: ["Use Chronicle SIEM for log correlation", "Enable Security Command Center Premium", "Create BigQuery queries for analysis", "Configure detection rules", "Set up Cloud Functions for automated response", "Integrate with ticketing system"], cost_estimate: "$500-2000/month", effort_hours: 20 }}
            },
            siem: {
                splunk: { implementation: { steps: ["Configure log ingestion from all sources", "Create correlation searches for suspicious activity", "Set up notable events and alerts", "Build investigation dashboards", "Implement automated response actions", "Integrate with SOAR platform"], effort_hours: 24 }},
                elastic: { implementation: { steps: ["Deploy Elastic SIEM", "Configure Beats for log collection", "Create detection rules", "Build investigation timelines", "Set up alerting workflows", "Integrate with case management"], effort_hours: 20 }}
            },
            small_business: { approach: "Use cloud provider native SIEM (Azure Sentinel, AWS Security Hub), configure basic correlation rules, integrate with email/Slack for alerts", cost_estimate: "$50-200/month", effort_hours: 12 }
        }
        
        ,
        
        "AU.L2-3.3.6": {
            objective: "Provide audit record reduction and report generation to support on-demand analysis and reporting.",
            summary: "Log aggregation, filtering, reporting dashboards",
            cloud: {
                aws: { services: ["Athena", "QuickSight", "CloudWatch Insights"], implementation: { steps: ["Use Athena to query CloudTrail logs in S3", "Create saved queries for common investigations", "Build QuickSight dashboards for audit reporting", "Use CloudWatch Logs Insights for real-time analysis", "Implement log filtering and aggregation", "Schedule automated reports"], cost_estimate: "$50-200/month", effort_hours: 12 }},
                azure: { services: ["Log Analytics", "Workbooks", "Power BI"], implementation: { steps: ["Use KQL queries in Log Analytics", "Create saved queries for investigations", "Build Azure Workbooks for visualization", "Use Power BI for executive reporting", "Implement log filtering and summarization", "Schedule automated reports"], cost_estimate: "$50-150/month", effort_hours: 12 }},
                gcp: { services: ["BigQuery", "Data Studio", "Cloud Logging"], implementation: { steps: ["Export logs to BigQuery for analysis", "Create SQL queries for investigations", "Build Data Studio dashboards", "Use Cloud Logging filters for reduction", "Implement log aggregation", "Schedule automated reports"], cost_estimate: "$50-200/month", effort_hours: 12 }}
            },
            siem: {
                general: { implementation: { steps: ["Create saved searches for common queries", "Build executive dashboards", "Implement role-based report access", "Configure scheduled report delivery", "Use log filtering to reduce noise", "Create investigation templates"], effort_hours: 10 }}
            },
            small_business: { approach: "Use cloud provider log query tools, create basic dashboards, export to Excel for reporting", cost_estimate: "$0-50/month", effort_hours: 6 }
        }
        
        ,
        
        "AU.L2-3.3.7": {
            objective: "Provide a system capability that compares and synchronizes internal system clocks with an authoritative source to generate time stamps for audit records.",
            summary: "NTP configuration, time synchronization monitoring",
            cloud: {
                aws: { implementation: { steps: ["Use Amazon Time Sync Service (169.254.169.123)", "Configure NTP on EC2 instances to use AWS time", "Enable CloudWatch time drift monitoring", "Use AWS Systems Manager for time sync compliance", "Configure chrony or ntpd with AWS NTP"], cost_estimate: "$0", effort_hours: 3 }},
                azure: { implementation: { steps: ["Use Azure time service (time.windows.com)", "Configure VMs to sync with Azure time", "Enable Azure Monitor for time drift", "Use Azure Policy to enforce time sync", "Configure Windows Time service or chrony"], cost_estimate: "$0", effort_hours: 3 }},
                gcp: { implementation: { steps: ["Use Google Cloud NTP (metadata.google.internal)", "Configure VMs to sync with GCP time", "Enable Cloud Monitoring for time drift", "Use OS Config for time sync enforcement", "Configure chrony with GCP NTP"], cost_estimate: "$0", effort_hours: 3 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Configure Windows Time service", "Set NTP server: w32tm /config /manualpeerlist:time.nist.gov /syncfromflags:manual /reliable:yes /update", "Enable time sync monitoring", "Use Group Policy to enforce time settings"], effort_hours: 2 }},
                linux: { implementation: { steps: ["Install and configure chrony or ntpd", "Configure NTP servers (time.nist.gov, pool.ntp.org)", "Enable chronyd service: systemctl enable chronyd", "Monitor time drift: timedatectl status", "Use configuration management for enforcement"], effort_hours: 2 }}
            },
            network: {
                general: { implementation: { steps: ["Configure network devices to use NTP", "Set NTP servers (time.nist.gov, USNO time servers)", "Enable NTP authentication", "Monitor time synchronization status", "Use stratum 1 or 2 time sources"], effort_hours: 3 }}
            },
            small_business: { approach: "Use default cloud provider time sync, configure Windows Time service to sync with time.nist.gov", cost_estimate: "$0", effort_hours: 1 }
        }
        
        ,
        
        "AU.L2-3.3.8": {
            objective: "Protect audit information and audit logging tools from unauthorized access, modification, and deletion.",
            summary: "Immutable logs, separate audit accounts, write-once storage",
            cloud: {
                aws: { services: ["S3", "CloudTrail", "IAM", "KMS"], implementation: { steps: ["Enable S3 Object Lock for CloudTrail logs (WORM)", "Use S3 Bucket Policies to restrict access", "Enable S3 versioning and MFA Delete", "Encrypt logs with KMS", "Use separate AWS account for log storage", "Enable CloudTrail log file validation", "Restrict IAM permissions for log access"], cost_estimate: "$20-100/month", effort_hours: 8 }},
                azure: { services: ["Storage", "Activity Log", "RBAC", "Key Vault"], implementation: { steps: ["Enable immutable blob storage for logs", "Use Azure RBAC to restrict log access", "Enable soft delete and versioning", "Encrypt logs with customer-managed keys", "Use separate subscription for log storage", "Enable Activity Log integrity monitoring", "Restrict access with Conditional Access"], cost_estimate: "$20-80/month", effort_hours: 8 }},
                gcp: { services: ["Cloud Storage", "Cloud Audit Logs", "IAM"], implementation: { steps: ["Enable bucket retention policies for logs", "Use IAM to restrict log access", "Enable object versioning", "Encrypt logs with CMEK", "Use separate project for log storage", "Enable Cloud Audit Logs for log access", "Use VPC Service Controls for log perimeter"], cost_estimate: "$20-100/month", effort_hours: 8 }}
            },
            siem: {
                general: { implementation: { steps: ["Use separate admin accounts for SIEM access", "Enable SIEM audit logging", "Restrict log deletion permissions", "Implement log forwarding to secondary storage", "Use write-once storage for archived logs", "Monitor SIEM configuration changes"], effort_hours: 6 }}
            },
            small_business: { approach: "Use cloud provider immutable storage, restrict log access to admin accounts only, enable MFA for log access", cost_estimate: "$10-30/month", effort_hours: 4 }
        }
        
        ,
        
        "AU.L2-3.3.9": {
            objective: "Limit management of audit logging functionality to a subset of privileged users.",
            summary: "Separate audit admin role, least privilege for log management",
            cloud: {
                aws: { implementation: { steps: ["Create dedicated IAM role for audit administrators", "Use IAM policy to restrict CloudTrail management", "Separate log read access from log management", "Enable MFA for audit admin role", "Use AWS Organizations SCP to prevent logging disablement", "Monitor IAM policy changes with CloudTrail"], cost_estimate: "$0", effort_hours: 6 }},
                azure: { implementation: { steps: ["Create custom RBAC role for audit administrators", "Assign Security Reader role for log viewing", "Restrict Activity Log configuration to audit admins", "Enable PIM for audit admin role activation", "Use Azure Policy to prevent logging disablement", "Monitor RBAC changes with Activity Log"], cost_estimate: "$0", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Create custom IAM role for audit administrators", "Use Logging Admin role for log management", "Separate Logs Viewer role for read access", "Enable IAM Conditions for time-based access", "Use organization policies to prevent logging disablement", "Monitor IAM changes with Cloud Audit Logs"], cost_estimate: "$0", effort_hours: 6 }}
            },
            siem: {
                general: { implementation: { steps: ["Create separate SIEM admin role", "Restrict log source configuration to admins", "Implement approval workflow for logging changes", "Use MFA for SIEM admin access", "Monitor SIEM configuration changes", "Document audit admin procedures"], effort_hours: 4 }}
            },
            small_business: { approach: "Assign audit admin role to 1-2 trusted users, require MFA, document who has audit admin access", cost_estimate: "$0", effort_hours: 2 }
        }
        
        ,
        
        "CM.L2-3.4.1": {
            objective: "Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.",
            summary: "Configuration baselines, system inventory, change tracking",
            cloud: {
                aws: { services: ["Config", "Systems Manager", "Service Catalog"], implementation: { steps: ["Enable AWS Config for all regions", "Create configuration baselines with Systems Manager", "Use AWS Config rules for compliance checking", "Maintain inventory with Systems Manager Inventory", "Use Service Catalog for approved configurations", "Tag all resources with owner and environment", "Document baseline configurations"], cost_estimate: "$50-200/month", effort_hours: 16 }},
                azure: { services: ["Policy", "Automation", "Resource Graph"], implementation: { steps: ["Deploy Azure Policy for configuration enforcement", "Use Azure Automation State Configuration (DSC)", "Enable Azure Resource Graph for inventory", "Create configuration baselines with Azure Automanage", "Use Azure Blueprints for approved configurations", "Tag all resources with metadata", "Document baselines"], cost_estimate: "$50-150/month", effort_hours: 16 }},
                gcp: { services: ["Asset Inventory", "Config Connector", "Deployment Manager"], implementation: { steps: ["Use Cloud Asset Inventory for resource tracking", "Deploy Config Connector for Kubernetes", "Create configuration baselines with Deployment Manager", "Use organization policies for enforcement", "Label all resources with metadata", "Document baselines"], cost_estimate: "$30-100/month", effort_hours: 14 }}
            },
            tools: {
                ansible: { implementation: { steps: ["Create Ansible playbooks for baseline configs", "Use Ansible Tower/AWX for inventory", "Implement configuration drift detection", "Store playbooks in Git", "Document baseline"], effort_hours: 12 }},
                terraform: { implementation: { steps: ["Define infrastructure as code in Terraform", "Use Terraform state for inventory", "Implement drift detection with Terraform plan", "Store configs in Git", "Document baseline"], effort_hours: 12 }}
            },
            small_business: { approach: "Document baseline configurations in Excel/SharePoint, use cloud provider native inventory tools, maintain hardware/software list", cost_estimate: "$0-20/month", effort_hours: 8 }
        }
        
        ,
        
        "CM.L2-3.4.2": {
            objective: "Establish and enforce security configuration settings for information technology products employed in organizational systems.",
            summary: "Security hardening, CIS benchmarks, configuration policies",
            cloud: {
                aws: { services: ["Config", "Systems Manager", "Security Hub"], implementation: { steps: ["Use AWS Config conformance packs (CIS benchmarks)", "Deploy Systems Manager baselines for patching", "Enable Security Hub security standards", "Use AWS Managed Config rules", "Implement EC2 Image Builder for hardened AMIs", "Enforce IMDSv2 on EC2"], cost_estimate: "$50-150/month", effort_hours: 14 }},
                azure: { services: ["Policy", "Security Center", "Defender"], implementation: { steps: ["Deploy Azure Policy with CIS benchmark initiative", "Enable Microsoft Defender for Cloud", "Use Azure Security Baseline for VMs", "Implement Azure Automanage", "Enforce TLS 1.2+ on all services", "Enable Just-in-Time VM access"], cost_estimate: "$100-300/month", effort_hours: 14 }},
                gcp: { services: ["Security Command Center", "OS Config", "Policy"], implementation: { steps: ["Enable Security Command Center Premium", "Use OS Config for security patch management", "Deploy organization policies", "Use CIS GCP Foundation Benchmark", "Implement Shielded VMs", "Enforce OS Login"], cost_estimate: "$200-500/month", effort_hours: 14 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Apply CIS Windows Server benchmark via GPO", "Use Microsoft Security Compliance Toolkit", "Enable Windows Defender", "Disable SMBv1", "Configure Windows Firewall", "Enable BitLocker"], effort_hours: 10 }},
                linux: { implementation: { steps: ["Apply CIS Linux benchmark", "Use OpenSCAP for compliance scanning", "Configure SELinux/AppArmor", "Disable unnecessary services", "Configure iptables/firewalld", "Enable automatic security updates"], effort_hours: 10 }}
            },
            small_business: { approach: "Use cloud provider security baselines, apply Windows security baseline via GPO, document security settings", cost_estimate: "$0-50/month", effort_hours: 8 }
        }
        
        ,
        
        "CM.L2-3.4.3": {
            objective: "Track, review, approve or disapprove, and log changes to organizational systems.",
            summary: "Change management process, approval workflow, change logging",
            cloud: {
                aws: { services: ["Config", "CloudTrail", "Systems Manager"], implementation: { steps: ["Enable AWS Config change tracking", "Use CloudTrail for change logging", "Implement change approval via ServiceNow/Jira", "Use Systems Manager Change Manager", "Require MFA for production changes", "Tag changes with ticket numbers", "Review changes in CAB meetings"], cost_estimate: "$20-80/month", effort_hours: 12 }},
                azure: { services: ["Activity Log", "DevOps", "Automation"], implementation: { steps: ["Enable Azure Activity Log", "Use Azure DevOps for change approval", "Implement Azure Automation Change Tracking", "Require PIM activation for privileged changes", "Tag changes with work item IDs", "Review changes in CAB", "Use Azure Policy to prevent unauthorized changes"], cost_estimate: "$20-60/month", effort_hours: 12 }},
                gcp: { services: ["Cloud Audit Logs", "Cloud Build", "Resource Manager"], implementation: { steps: ["Enable Cloud Audit Logs", "Use Cloud Build with approval gates", "Implement change approval via Jira/ServiceNow", "Require IAM approval for privileged changes", "Label changes with ticket numbers", "Review changes in CAB", "Use organization policies"], cost_estimate: "$20-70/month", effort_hours: 12 }}
            },
            small_business: { approach: "Use email approval for changes, document changes in Excel/SharePoint, hold monthly change review meetings", cost_estimate: "$0", effort_hours: 6 }
        }
        
        ,
        
        "CM.L2-3.4.4": {
            objective: "Analyze the security impact of changes prior to implementation.",
            summary: "Security impact assessment, pre-change testing, risk analysis",
            cloud: {
                aws: { implementation: { steps: ["Use AWS Config rules to test changes", "Run Security Hub checks before deployment", "Use CloudFormation ChangeSet for preview", "Test in dev/staging", "Review IAM changes with Access Analyzer", "Document security impact"], cost_estimate: "$10-30/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use Azure Policy What-If for impact analysis", "Run Defender for Cloud assessment", "Test in dev/staging subscription", "Review RBAC changes", "Use Azure Blueprints", "Document security impact"], cost_estimate: "$10-25/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use Policy Analyzer", "Run Security Command Center scan", "Test in dev/staging project", "Review IAM changes with Policy Troubleshooter", "Use Deployment Manager preview", "Document security impact"], cost_estimate: "$10-30/month", effort_hours: 8 }}
            },
            small_business: { approach: "Use security checklist for changes, test in non-production environment, document security impact in change request", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "CM.L2-3.4.5": {
            objective: "Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.",
            summary: "Change access controls, production access restrictions, approval gates",
            cloud: {
                aws: { implementation: { steps: ["Use IAM policies to restrict production access", "Require MFA for production changes", "Implement approval workflow with Step Functions", "Use Organizations SCPs to enforce restrictions", "Restrict console access to approved IPs", "Use Systems Manager Session Manager", "Document access requirements"], cost_estimate: "$10-30/month", effort_hours: 10 }},
                azure: { implementation: { steps: ["Use Azure RBAC to restrict production access", "Require PIM activation for privileged changes", "Implement approval workflow with Logic Apps", "Use Conditional Access to restrict by location", "Require MFA for production access", "Use Azure Bastion", "Document access requirements"], cost_estimate: "$10-25/month", effort_hours: 10 }},
                gcp: { implementation: { steps: ["Use IAM to restrict production access", "Require approval for privileged role activation", "Implement approval workflow with Cloud Functions", "Use VPC Service Controls", "Require MFA", "Use IAP", "Document access requirements"], cost_estimate: "$10-30/month", effort_hours: 10 }}
            },
            small_business: { approach: "Restrict production access to 2-3 admins, require MFA, document who has production access", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "CM.L2-3.4.6": {
            objective: "Employ the principle of least functionality by configuring organizational systems to provide only essential capabilities.",
            summary: "Disable unnecessary services, remove unused software, minimal attack surface",
            cloud: {
                aws: { implementation: { steps: ["Use minimal AMIs (Amazon Linux 2 Minimal)", "Disable unused AWS services via SCPs", "Remove unnecessary IAM permissions", "Use VPC endpoints (no internet gateway where possible)", "Disable unused EC2 metadata", "Remove default VPC", "Inventory installed software"], cost_estimate: "$0-20/month", effort_hours: 8 }},
                azure: { implementation: { steps: ["Use minimal VM images", "Disable unused Azure services via Policy", "Remove unnecessary RBAC assignments", "Use Private Endpoints", "Disable unused VM extensions", "Remove default resources", "Use Azure Arc for inventory"], cost_estimate: "$0-20/month", effort_hours: 8 }},
                gcp: { implementation: { steps: ["Use minimal VM images (Container-Optimized OS)", "Disable unused GCP APIs", "Remove unnecessary IAM bindings", "Use Private Google Access", "Disable unused VM metadata", "Remove default networks", "Use OS Config for inventory"], cost_estimate: "$0-20/month", effort_hours: 8 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Disable unnecessary Windows features", "Remove unused applications", "Disable unnecessary services", "Use Server Core where possible", "Disable SMBv1", "Remove default shares"], effort_hours: 6 }},
                linux: { implementation: { steps: ["Use minimal Linux distribution", "Remove unnecessary packages", "Disable unnecessary services", "Use systemd to disable unused services", "Remove unnecessary kernel modules", "Disable unused network protocols"], effort_hours: 6 }}
            },
            small_business: { approach: "Remove unused applications, disable unnecessary Windows services, use minimal cloud VM images", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "CM.L2-3.4.7": {
            objective: "Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.",
            summary: "Firewall rules, port restrictions, application whitelisting",
            cloud: {
                aws: { services: ["Security Groups", "Network ACLs", "WAF"], implementation: { steps: ["Configure Security Groups with minimal ports (443, 22 from bastion only)", "Use Network ACLs for subnet restrictions", "Deploy AWS WAF", "Use VPC Flow Logs to identify unused ports", "Implement Systems Manager Session Manager (disable SSH/RDP)", "Use Network Firewall"], cost_estimate: "$50-200/month", effort_hours: 10 }},
                azure: { services: ["NSG", "Firewall", "Application Gateway"], implementation: { steps: ["Configure NSGs with minimal ports", "Deploy Azure Firewall with application rules", "Use Application Gateway WAF", "Enable NSG Flow Logs", "Use Azure Bastion (no RDP/SSH ports)", "Implement Just-in-Time VM access"], cost_estimate: "$140-400/month", effort_hours: 10 }},
                gcp: { services: ["Firewall Rules", "Cloud Armor", "Cloud NAT"], implementation: { steps: ["Configure VPC firewall rules with minimal ports", "Use Cloud Armor for filtering", "Enable VPC Flow Logs", "Use IAP for TCP forwarding (no SSH/RDP ports)", "Implement Cloud NAT for outbound-only"], cost_estimate: "$50-150/month", effort_hours: 10 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Configure Windows Firewall to block unused ports", "Use Windows Defender Application Control", "Disable unnecessary protocols (NetBIOS, LLMNR)", "Use AppLocker", "Disable PowerShell v2"], effort_hours: 8 }},
                linux: { implementation: { steps: ["Configure iptables/firewalld to block unused ports", "Use SELinux/AppArmor", "Disable unnecessary protocols", "Use fail2ban", "Implement application whitelisting with fapolicyd"], effort_hours: 8 }}
            },
            small_business: { approach: "Configure firewall to allow only necessary ports (443, 80), use cloud provider security groups, disable unused services", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "CM.L2-3.4.8": {
            objective: "Apply deny-by-exception (blacklist) policy to prevent the use of unauthorized software or deny-all, permit-by-exception (whitelisting) policy to allow the execution of authorized software.",
            summary: "Application whitelisting, software restriction policies",
            cloud: {
                aws: { implementation: { steps: ["Use Systems Manager to inventory software", "Implement approved software list", "Use Config rules to detect unauthorized software", "Deploy EC2 Image Builder with approved software only", "Use AppStream for application delivery"], cost_estimate: "$20-80/month", effort_hours: 12 }},
                azure: { implementation: { steps: ["Use Defender for Endpoint for software inventory", "Implement Intune app deployment policies", "Use Azure Policy to detect unauthorized software", "Deploy Windows Virtual Desktop with approved apps", "Use Azure AD application proxy"], cost_estimate: "$50-150/month", effort_hours: 12 }},
                gcp: { implementation: { steps: ["Use OS Config for software inventory", "Implement approved software list", "Use organization policies to restrict installation", "Deploy Container-Optimized OS", "Use Chrome Enterprise"], cost_estimate: "$20-60/month", effort_hours: 10 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Deploy Windows Defender Application Control (WDAC)", "Use AppLocker for whitelisting", "Configure Software Restriction Policies via GPO", "Create whitelist of approved executables", "Block execution from temp folders", "Monitor blocked applications"], effort_hours: 14 }},
                linux: { implementation: { steps: ["Use fapolicyd for whitelisting", "Configure SELinux/AppArmor policies", "Use rpm/dpkg to maintain approved packages", "Block execution from /tmp with noexec", "Monitor unauthorized software with auditd"], effort_hours: 12 }}
            },
            small_business: { approach: "Use Windows AppLocker to whitelist approved applications, maintain list of approved software, block admin rights", cost_estimate: "$0", effort_hours: 8 }
        }
        
        ,
        
        "CM.L2-3.4.9": {
            objective: "Control and monitor user-installed software.",
            summary: "Prevent user software installation, monitor for unauthorized software",
            cloud: {
                aws: { implementation: { steps: ["Remove admin rights from user IAM roles", "Use Systems Manager to monitor software changes", "Deploy Config rule to detect new software", "Use EC2 instance profiles with minimal permissions", "Implement AppStream for application delivery", "Alert on unauthorized software"], cost_estimate: "$20-60/month", effort_hours: 10 }},
                azure: { implementation: { steps: ["Remove local admin rights via Intune", "Use Defender for Endpoint to monitor software", "Deploy Azure Policy to detect new software", "Implement Conditional Access to block non-compliant devices", "Use Azure Virtual Desktop", "Alert on unauthorized software"], cost_estimate: "$50-120/month", effort_hours: 10 }},
                gcp: { implementation: { steps: ["Remove admin permissions from user accounts", "Use OS Config to monitor software changes", "Deploy organization policies to restrict installations", "Use Chrome Enterprise", "Implement Cloud Monitoring alerts"], cost_estimate: "$20-50/month", effort_hours: 8 }}
            },
            operating_system: {
                windows: { implementation: { steps: ["Remove local admin rights from users", "Use Group Policy to prevent software installation", "Deploy Microsoft Endpoint Manager", "Use AppLocker to block user-installed software", "Monitor Event ID 11707 (software installation)", "Implement SCCM/Intune"], effort_hours: 10 }},
                macos: { implementation: { steps: ["Remove admin rights from users", "Use Jamf or Intune for software management", "Implement Gatekeeper to block unsigned apps", "Monitor software changes with osquery", "Use MDM to deploy approved software"], effort_hours: 10 }}
            },
            small_business: { approach: "Remove admin rights from users, use Group Policy to block installations, monitor with Windows Event Logs", cost_estimate: "$0", effort_hours: 6 }
        }
        
        // Continue with IA.L2-3.5.1 through 3.5.11 in next batch...
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_PART2 };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_PART2 = COMPREHENSIVE_GUIDANCE_PART2;
    console.log('[Comprehensive Guidance Part 2] Loaded successfully');
}
