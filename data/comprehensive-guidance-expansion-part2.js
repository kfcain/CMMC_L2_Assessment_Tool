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
        
        // Additional objectives will continue to be added...
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
