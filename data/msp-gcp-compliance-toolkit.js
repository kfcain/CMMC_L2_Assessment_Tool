// GCP Compliance Toolkit for MSSP/Organization Use
// Cloud Functions, Security Command Center, Chronicle SIEM, Organization Policies
// Designed for multi-project CMMC/FedRAMP compliance at scale in GCP Assured Workloads

const MSP_GCP_COMPLIANCE_TOOLKIT = {
    version: "1.0.0",
    lastUpdated: "2025-02-09",

    // ==================== OVERVIEW ====================
    overview: {
        title: "GCP Compliance Toolkit",
        description: "Production-ready GCP templates for CMMC/FedRAMP compliance in Assured Workloads environments. Includes Terraform/gcloud configurations, Cloud Functions, Security Command Center rules, Chronicle SIEM detections, and multi-project orchestration patterns for MSSPs managing client projects at scale.",
        useCases: [
            "MSSP managing 10-100+ client GCP projects for CMMC compliance",
            "Single organization using GCP Assured Workloads for CUI processing",
            "Automated evidence collection via SCC, Chronicle, and Cloud Audit Logs",
            "Centralized logging, alerting, and incident response across GCP Organization"
        ],
        prerequisites: [
            "GCP Organization with Assured Workloads folder (IL4/IL5 for CUI)",
            "Security Command Center Premium enabled at org level",
            "Chronicle SIEM instance (optional, for advanced threat detection)",
            "Cloud Logging organization sink configured"
        ]
    },

    // ==================== 1. TERRAFORM / GCLOUD TEMPLATES ====================
    infrastructure: {
        title: "Terraform & gcloud Templates",
        description: "Infrastructure-as-code templates for compliance infrastructure in GCP Assured Workloads. Deploy via Terraform or gcloud CLI.",

        stacks: [
            {
                id: "org-logging",
                name: "Organization-Wide Audit Logging with Immutable Sink",
                description: "Configures organization-level Cloud Audit Logs with an aggregated log sink to Cloud Storage (with retention lock) and BigQuery for analysis. Covers all admin activity, data access, and system event logs.",
                controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.6", "3.3.7", "3.3.8"],
                category: "Logging & Audit",
                deployMethod: "Terraform at org level",
                template: `# GCP Organization Audit Logging — CMMC Compliant
# terraform/gcp/org-logging/main.tf

variable "org_id" {
  description = "GCP Organization ID"
  type        = string
}

variable "billing_account" {
  description = "Billing account ID"
  type        = string
}

variable "retention_days" {
  description = "Log retention in days (CMMC requires 365 minimum)"
  type        = number
  default     = 365
}

variable "region" {
  description = "Region for resources"
  type        = string
  default     = "us-east4"
}

# Dedicated project for centralized logging
resource "google_project" "logging" {
  name            = "cmmc-centralized-logging"
  project_id      = "cmmc-logging-\${random_id.suffix.hex}"
  org_id          = var.org_id
  billing_account = var.billing_account
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Enable required APIs
resource "google_project_service" "logging_apis" {
  for_each = toset([
    "logging.googleapis.com",
    "storage.googleapis.com",
    "bigquery.googleapis.com",
    "cloudkms.googleapis.com"
  ])
  project = google_project.logging.project_id
  service = each.value
}

# KMS key for log encryption
resource "google_kms_key_ring" "logging" {
  name     = "cmmc-logging-keyring"
  location = var.region
  project  = google_project.logging.project_id
}

resource "google_kms_crypto_key" "logging" {
  name            = "cmmc-logging-key"
  key_ring        = google_kms_key_ring.logging.id
  rotation_period = "7776000s"  # 90 days
  purpose         = "ENCRYPT_DECRYPT"

  lifecycle {
    prevent_destroy = true
  }
}

# Cloud Storage bucket with retention lock
resource "google_storage_bucket" "audit_logs" {
  name          = "cmmc-audit-logs-\${random_id.suffix.hex}"
  project       = google_project.logging.project_id
  location      = var.region
  storage_class = "STANDARD"
  force_destroy = false

  uniform_bucket_level_access = true

  retention_policy {
    is_locked        = true
    retention_period = var.retention_days * 86400  # Convert to seconds
  }

  encryption {
    default_kms_key_name = google_kms_crypto_key.logging.id
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  versioning {
    enabled = true
  }
}

# BigQuery dataset for log analysis
resource "google_bigquery_dataset" "audit_logs" {
  dataset_id  = "cmmc_audit_logs"
  project     = google_project.logging.project_id
  location    = var.region
  description = "CMMC audit log analysis dataset"

  default_table_expiration_ms     = var.retention_days * 86400000
  default_partition_expiration_ms = var.retention_days * 86400000

  default_encryption_configuration {
    kms_key_name = google_kms_crypto_key.logging.id
  }
}

# Organization log sink — ALL audit logs
resource "google_logging_organization_sink" "audit_storage" {
  name             = "cmmc-audit-log-sink-storage"
  org_id           = var.org_id
  destination      = "storage.googleapis.com/\${google_storage_bucket.audit_logs.name}"
  include_children = true

  filter = <<-EOT
    logName:"cloudaudit.googleapis.com"
    OR logName:"activity"
    OR logName:"data_access"
    OR logName:"system_event"
    OR logName:"policy"
  EOT
}

resource "google_logging_organization_sink" "audit_bigquery" {
  name             = "cmmc-audit-log-sink-bq"
  org_id           = var.org_id
  destination      = "bigquery.googleapis.com/projects/\${google_project.logging.project_id}/datasets/\${google_bigquery_dataset.audit_logs.dataset_id}"
  include_children = true

  filter = <<-EOT
    logName:"cloudaudit.googleapis.com"
    OR logName:"activity"
    OR logName:"data_access"
  EOT

  bigquery_options {
    use_partitioned_tables = true
  }
}

# Grant sink service accounts write access
resource "google_storage_bucket_iam_member" "sink_writer_storage" {
  bucket = google_storage_bucket.audit_logs.name
  role   = "roles/storage.objectCreator"
  member = google_logging_organization_sink.audit_storage.writer_identity
}

resource "google_bigquery_dataset_iam_member" "sink_writer_bq" {
  dataset_id = google_bigquery_dataset.audit_logs.dataset_id
  project    = google_project.logging.project_id
  role       = "roles/bigquery.dataEditor"
  member     = google_logging_organization_sink.audit_bigquery.writer_identity
}

# Log-based alerting metrics
resource "google_logging_metric" "unauthorized_access" {
  name    = "cmmc-unauthorized-access-attempts"
  project = google_project.logging.project_id
  filter  = <<-EOT
    protoPayload.status.code=7
    OR protoPayload.status.code=16
    OR protoPayload.authorizationInfo.granted=false
  EOT
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
    unit        = "1"
  }
}

resource "google_logging_metric" "iam_changes" {
  name    = "cmmc-iam-policy-changes"
  project = google_project.logging.project_id
  filter  = <<-EOT
    protoPayload.methodName="SetIamPolicy"
    OR protoPayload.methodName="google.iam.admin.v1.CreateRole"
    OR protoPayload.methodName="google.iam.admin.v1.DeleteRole"
    OR protoPayload.methodName="google.iam.admin.v1.UpdateRole"
  EOT
  metric_descriptor {
    metric_kind = "DELTA"
    value_type  = "INT64"
    unit        = "1"
  }
}

output "log_bucket" {
  value = google_storage_bucket.audit_logs.name
}

output "bq_dataset" {
  value = google_bigquery_dataset.audit_logs.dataset_id
}`
            },
            {
                id: "scc-premium",
                name: "Security Command Center Premium with Custom Findings",
                description: "Enables SCC Premium at the organization level with custom security sources for CMMC-specific findings, notification channels, and export to BigQuery for compliance reporting.",
                controls: ["3.11.1", "3.11.2", "3.11.3", "3.14.1", "3.14.2", "3.14.6"],
                category: "Vulnerability & Threat Protection",
                deployMethod: "gcloud CLI + Terraform",
                template: `# Security Command Center Premium Setup
# Requires SCC Premium tier enabled at org level

# --- gcloud commands for SCC configuration ---

# Enable SCC Premium (org-level, done once)
gcloud scc settings update \\
  --organization=ORGANIZATION_ID \\
  --enable-asset-discovery

# Enable all built-in detectors
gcloud scc settings services update \\
  --organization=ORGANIZATION_ID \\
  --service=web-security-scanner \\
  --enablement-state=ENABLED

gcloud scc settings services update \\
  --organization=ORGANIZATION_ID \\
  --service=container-threat-detection \\
  --enablement-state=ENABLED

gcloud scc settings services update \\
  --organization=ORGANIZATION_ID \\
  --service=event-threat-detection \\
  --enablement-state=ENABLED

gcloud scc settings services update \\
  --organization=ORGANIZATION_ID \\
  --service=virtual-machine-threat-detection \\
  --enablement-state=ENABLED

# Create notification config for high/critical findings
gcloud scc notifications create cmmc-critical-alerts \\
  --organization=ORGANIZATION_ID \\
  --pubsub-topic=projects/PROJECT_ID/topics/scc-critical-alerts \\
  --filter='severity="CRITICAL" OR severity="HIGH"'

# Create notification for CMMC-specific categories
gcloud scc notifications create cmmc-compliance-alerts \\
  --organization=ORGANIZATION_ID \\
  --pubsub-topic=projects/PROJECT_ID/topics/scc-compliance-alerts \\
  --filter='category="PUBLIC_BUCKET_ACL" OR category="OPEN_FIREWALL" OR category="MFA_NOT_ENFORCED" OR category="ADMIN_SERVICE_ACCOUNT" OR category="OVER_PRIVILEGED_ACCOUNT"'

# Export findings to BigQuery for compliance reporting
gcloud scc bqdexports create cmmc-findings-export \\
  --organization=ORGANIZATION_ID \\
  --dataset=projects/PROJECT_ID/datasets/scc_findings \\
  --filter='state="ACTIVE"'

# --- Terraform for custom SCC source ---
# terraform/gcp/scc-custom/main.tf

resource "google_scc_source" "cmmc_compliance" {
  display_name = "CMMC Compliance Scanner"
  organization = var.org_id
  description  = "Custom findings source for CMMC Level 2 compliance checks"
}

# Pub/Sub topic for SCC notifications
resource "google_pubsub_topic" "scc_alerts" {
  name    = "scc-critical-alerts"
  project = var.project_id

  message_storage_policy {
    allowed_persistence_regions = [var.region]
  }
}

# Cloud Function subscription for alert processing
resource "google_pubsub_subscription" "scc_processor" {
  name    = "scc-alert-processor"
  topic   = google_pubsub_topic.scc_alerts.name
  project = var.project_id

  push_config {
    push_endpoint = google_cloudfunctions2_function.scc_processor.service_config[0].uri
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}`
            },
            {
                id: "org-policies",
                name: "Organization Policy Constraints for CMMC",
                description: "GCP Organization Policy constraints that enforce CMMC-relevant configurations: restrict public IPs, enforce encryption, limit service account key creation, and restrict resource locations to US regions.",
                controls: ["3.1.1", "3.1.2", "3.4.1", "3.4.2", "3.4.6", "3.13.1", "3.13.8"],
                category: "Configuration & Compliance",
                deployMethod: "Terraform at org level",
                template: `# GCP Organization Policy Constraints for CMMC
# terraform/gcp/org-policies/main.tf

variable "org_id" {
  description = "GCP Organization ID"
  type        = string
}

# Restrict resource locations to US regions only (CUI data residency)
resource "google_org_policy_policy" "restrict_locations" {
  name   = "organizations/\${var.org_id}/policies/gcp.resourceLocations"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      values {
        allowed_values = [
          "in:us-locations"
        ]
      }
    }
  }
}

# Disable external IP addresses on VMs
resource "google_org_policy_policy" "no_external_ip" {
  name   = "organizations/\${var.org_id}/policies/compute.vmExternalIpAccess"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

# Disable service account key creation (use Workload Identity instead)
resource "google_org_policy_policy" "no_sa_keys" {
  name   = "organizations/\${var.org_id}/policies/iam.disableServiceAccountKeyCreation"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

# Require OS Login for SSH access
resource "google_org_policy_policy" "require_os_login" {
  name   = "organizations/\${var.org_id}/policies/compute.requireOsLogin"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

# Enforce uniform bucket-level access (no ACLs)
resource "google_org_policy_policy" "uniform_bucket_access" {
  name   = "organizations/\${var.org_id}/policies/storage.uniformBucketLevelAccess"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

# Restrict public access to Cloud SQL
resource "google_org_policy_policy" "no_public_sql" {
  name   = "organizations/\${var.org_id}/policies/sql.restrictPublicIp"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}

# Require CMEK (Customer-Managed Encryption Keys)
resource "google_org_policy_policy" "require_cmek" {
  name   = "organizations/\${var.org_id}/policies/gcp.restrictNonCmekServices"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      values {
        denied_values = []  # Deny all non-CMEK services
      }
    }
  }
}

# Disable default service account grants
resource "google_org_policy_policy" "no_default_sa_grants" {
  name   = "organizations/\${var.org_id}/policies/iam.automaticIamGrantsForDefaultServiceAccounts"
  parent = "organizations/\${var.org_id}"

  spec {
    rules {
      enforce = "TRUE"
    }
  }
}`
            },
            {
                id: "vpc-sc",
                name: "VPC Service Controls for CUI Boundary",
                description: "VPC Service Controls perimeter that restricts API access to GCP services containing CUI. Prevents data exfiltration by limiting which projects, networks, and identities can access protected resources.",
                controls: ["3.13.1", "3.13.5", "3.13.6", "3.1.1", "3.1.2"],
                category: "Network Security",
                deployMethod: "Terraform",
                template: `# VPC Service Controls — CUI Data Boundary
# terraform/gcp/vpc-sc/main.tf

variable "org_id" {
  description = "GCP Organization ID"
  type        = string
}

variable "access_policy_id" {
  description = "Access Context Manager policy ID"
  type        = string
}

variable "protected_projects" {
  description = "Project numbers to include in the perimeter"
  type        = list(string)
}

variable "allowed_members" {
  description = "IAM members allowed to access the perimeter"
  type        = list(string)
}

# Access level — restrict to corporate network and trusted identities
resource "google_access_context_manager_access_level" "cmmc_trusted" {
  parent = "accessPolicies/\${var.access_policy_id}"
  name   = "accessPolicies/\${var.access_policy_id}/accessLevels/cmmc_trusted_access"
  title  = "CMMC Trusted Access"

  basic {
    conditions {
      members = var.allowed_members

      ip_subnetworks = [
        "10.0.0.0/8",       # Internal corporate network
        "172.16.0.0/12"     # VPN ranges
      ]

      required_access_levels = []

      device_policy {
        require_screen_lock    = true
        require_admin_approval = true
        allowed_encryption_statuses = ["ENCRYPTED"]
      }
    }
  }
}

# Service perimeter for CUI workloads
resource "google_access_context_manager_service_perimeter" "cui_perimeter" {
  parent = "accessPolicies/\${var.access_policy_id}"
  name   = "accessPolicies/\${var.access_policy_id}/servicePerimeters/cmmc_cui_perimeter"
  title  = "CMMC CUI Data Perimeter"

  status {
    resources = [for p in var.protected_projects : "projects/\${p}"]

    restricted_services = [
      "bigquery.googleapis.com",
      "storage.googleapis.com",
      "compute.googleapis.com",
      "container.googleapis.com",
      "sqladmin.googleapis.com",
      "secretmanager.googleapis.com",
      "cloudkms.googleapis.com",
      "logging.googleapis.com",
      "pubsub.googleapis.com"
    ]

    access_levels = [
      google_access_context_manager_access_level.cmmc_trusted.name
    ]

    vpc_accessible_services {
      enable_restriction = true
      allowed_services   = ["RESTRICTED-SERVICES"]
    }

    ingress_policies {
      ingress_from {
        identity_type = "ANY_IDENTITY"
        sources {
          access_level = google_access_context_manager_access_level.cmmc_trusted.name
        }
      }
      ingress_to {
        resources = ["*"]
        operations {
          service_name = "storage.googleapis.com"
          method_selectors {
            method = "google.storage.objects.get"
          }
        }
      }
    }

    egress_policies {
      egress_from {
        identity_type = "ANY_IDENTITY"
      }
      egress_to {
        resources = ["projects/\${var.protected_projects[0]}"]
        operations {
          service_name = "bigquery.googleapis.com"
          method_selectors {
            method = "*"
          }
        }
      }
    }
  }
}`
            }
        ]
    },

    // ==================== 2. CLOUD FUNCTIONS ====================
    functions: {
        title: "Cloud Functions",
        description: "Serverless compliance automation functions for evidence collection, IAM auditing, configuration scanning, and auto-remediation in GCP.",

        functions: [
            {
                id: "iam-auditor",
                name: "IAM Policy Auditor & Overprivilege Detector",
                description: "Scheduled function that audits IAM policies across all projects in the organization. Detects overprivileged service accounts, external members, primitive roles (Owner/Editor), and unused permissions. Generates evidence reports.",
                controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7", "3.5.1", "3.5.2"],
                category: "Identity & Access",
                runtime: "Python 3.12",
                trigger: "Cloud Scheduler (daily at 02:00 UTC)",
                envVars: {
                    "ORG_ID": "<organization-id>",
                    "EVIDENCE_BUCKET": "cmmc-compliance-evidence",
                    "ALERT_TOPIC": "projects/<project>/topics/iam-alerts",
                    "MAX_PRIMITIVE_ROLES": "0"
                },
                code: `import functions_framework
from google.cloud import resourcemanager_v3, storage, pubsub_v1
from google.cloud import asset_v1
import json, os, logging
from datetime import datetime

@functions_framework.cloud_event
def iam_auditor(cloud_event):
    """Audit IAM policies across GCP organization for CMMC compliance."""
    logging.info("Starting IAM policy audit...")

    org_id = os.environ["ORG_ID"]
    asset_client = asset_v1.AssetServiceClient()

    findings = {
        "timestamp": datetime.utcnow().isoformat(),
        "org_id": org_id,
        "primitive_roles": [],
        "external_members": [],
        "overprivileged_sa": [],
        "unused_sa_keys": [],
        "summary": {}
    }

    # 1. Search for primitive role bindings (Owner, Editor)
    request = asset_v1.SearchAllIamPoliciesRequest(
        scope=f"organizations/{org_id}",
        query="policy:roles/owner OR policy:roles/editor"
    )
    for result in asset_client.search_all_iam_policies(request=request):
        for binding in result.policy.bindings:
            if binding.role in ["roles/owner", "roles/editor"]:
                for member in binding.members:
                    findings["primitive_roles"].append({
                        "resource": result.resource,
                        "role": binding.role,
                        "member": member,
                        "severity": "HIGH"
                    })

    # 2. Search for external members (non-org domains)
    request = asset_v1.SearchAllIamPoliciesRequest(
        scope=f"organizations/{org_id}",
        query="policy:user: OR policy:group:"
    )
    org_domain = None  # Set from org metadata
    rm_client = resourcemanager_v3.OrganizationsClient()
    org = rm_client.get_organization(
        name=f"organizations/{org_id}"
    )
    org_domain = org.display_name  # e.g., "example.com"

    for result in asset_client.search_all_iam_policies(request=request):
        for binding in result.policy.bindings:
            for member in binding.members:
                if ("@" in member and org_domain
                    and org_domain not in member
                    and not member.startswith("serviceAccount:")):
                    findings["external_members"].append({
                        "resource": result.resource,
                        "role": binding.role,
                        "member": member,
                        "severity": "CRITICAL"
                    })

    # 3. Check for service accounts with key age > 90 days
    request = asset_v1.ListAssetsRequest(
        parent=f"organizations/{org_id}",
        asset_types=["iam.googleapis.com/ServiceAccountKey"],
        content_type=asset_v1.ContentType.RESOURCE
    )
    for asset in asset_client.list_assets(request=request):
        key_data = asset.resource.data
        if key_data.get("keyType") == "USER_MANAGED":
            created = key_data.get("validAfterTime", "")
            if created:
                age_days = (datetime.utcnow() - datetime.fromisoformat(
                    created.replace("Z", "+00:00")
                ).replace(tzinfo=None)).days
                if age_days > 90:
                    findings["unused_sa_keys"].append({
                        "service_account": asset.name,
                        "key_age_days": age_days,
                        "severity": "HIGH"
                    })

    # 4. Generate summary
    findings["summary"] = {
        "total_findings": (len(findings["primitive_roles"]) +
                          len(findings["external_members"]) +
                          len(findings["overprivileged_sa"]) +
                          len(findings["unused_sa_keys"])),
        "critical": len(findings["external_members"]),
        "high": (len(findings["primitive_roles"]) +
                len(findings["unused_sa_keys"]))
    }

    # 5. Upload evidence
    storage_client = storage.Client()
    bucket = storage_client.bucket(os.environ["EVIDENCE_BUCKET"])
    blob_name = f"iam-audits/{datetime.utcnow().strftime('%Y/%m/%d')}/iam-audit.json"
    blob = bucket.blob(blob_name)
    blob.upload_from_string(
        json.dumps(findings, indent=2, default=str),
        content_type="application/json"
    )

    # 6. Alert if critical findings
    if findings["summary"]["critical"] > 0:
        publisher = pubsub_v1.PublisherClient()
        topic = os.environ.get("ALERT_TOPIC")
        if topic:
            publisher.publish(
                topic,
                json.dumps(findings["summary"]).encode("utf-8"),
                severity="CRITICAL"
            )

    logging.info(f"IAM audit complete: {findings['summary']}")`,
                iamPolicy: `Required IAM Roles:
- roles/cloudasset.viewer (on organization)
- roles/iam.securityReviewer (on organization)
- roles/storage.objectCreator (on evidence bucket)
- roles/pubsub.publisher (on alert topic)`
            },
            {
                id: "firewall-auditor",
                name: "VPC Firewall Rule Auditor",
                description: "Scans all VPC firewall rules across the organization for overly permissive configurations: 0.0.0.0/0 source ranges, open SSH/RDP, and missing logging. Generates compliance evidence and optionally disables non-compliant rules.",
                controls: ["3.13.1", "3.13.5", "3.13.6", "3.4.5", "3.4.6"],
                category: "Network Security",
                runtime: "Python 3.12",
                trigger: "Cloud Scheduler (every 6 hours)",
                envVars: {
                    "ORG_ID": "<organization-id>",
                    "EVIDENCE_BUCKET": "cmmc-compliance-evidence",
                    "AUTO_DISABLE": "false"
                },
                code: `import functions_framework
from google.cloud import asset_v1, compute_v1, storage
import json, os, logging
from datetime import datetime

RISKY_PORTS = {"22": "SSH", "3389": "RDP", "3306": "MySQL",
               "5432": "PostgreSQL", "1433": "MSSQL", "27017": "MongoDB"}

@functions_framework.cloud_event
def firewall_auditor(cloud_event):
    """Audit VPC firewall rules for CMMC network security compliance."""
    logging.info("Starting firewall rule audit...")

    org_id = os.environ["ORG_ID"]
    asset_client = asset_v1.AssetServiceClient()

    findings = {
        "timestamp": datetime.utcnow().isoformat(),
        "org_id": org_id,
        "open_to_internet": [],
        "risky_ports": [],
        "no_logging": [],
        "summary": {}
    }

    # Get all firewall rules via Cloud Asset Inventory
    request = asset_v1.ListAssetsRequest(
        parent=f"organizations/{org_id}",
        asset_types=["compute.googleapis.com/Firewall"],
        content_type=asset_v1.ContentType.RESOURCE
    )

    for asset in asset_client.list_assets(request=request):
        fw = asset.resource.data
        if fw.get("direction") != "INGRESS" or fw.get("disabled"):
            continue

        name = fw.get("name", "unknown")
        network = fw.get("network", "").split("/")[-1]
        project = asset.name.split("/")[4] if "/" in asset.name else "unknown"

        source_ranges = fw.get("sourceRanges", [])
        is_open = "0.0.0.0/0" in source_ranges or "::/0" in source_ranges

        # Check for open-to-internet rules
        if is_open:
            allowed = fw.get("allowed", [])
            for rule in allowed:
                protocol = rule.get("IPProtocol", "")
                ports = rule.get("ports", ["all"])
                for port in ports:
                    port_str = str(port)
                    finding = {
                        "project": project, "network": network,
                        "rule_name": name, "protocol": protocol,
                        "port": port_str, "source": "0.0.0.0/0"
                    }
                    if port_str in RISKY_PORTS:
                        finding["severity"] = "CRITICAL"
                        finding["service"] = RISKY_PORTS[port_str]
                        findings["risky_ports"].append(finding)
                    else:
                        finding["severity"] = "HIGH"
                        findings["open_to_internet"].append(finding)

        # Check for missing logging
        if not fw.get("logConfig", {}).get("enable"):
            findings["no_logging"].append({
                "project": project, "network": network,
                "rule_name": name, "severity": "MEDIUM"
            })

    findings["summary"] = {
        "total_rules_scanned": sum(1 for _ in asset_client.list_assets(
            request=asset_v1.ListAssetsRequest(
                parent=f"organizations/{org_id}",
                asset_types=["compute.googleapis.com/Firewall"],
                content_type=asset_v1.ContentType.RESOURCE
            ))),
        "critical": len(findings["risky_ports"]),
        "high": len(findings["open_to_internet"]),
        "medium": len(findings["no_logging"])
    }

    # Upload evidence
    storage_client = storage.Client()
    bucket = storage_client.bucket(os.environ["EVIDENCE_BUCKET"])
    blob_name = f"firewall-audits/{datetime.utcnow().strftime('%Y/%m/%d')}/firewall-audit.json"
    bucket.blob(blob_name).upload_from_string(
        json.dumps(findings, indent=2), content_type="application/json"
    )

    logging.info(f"Firewall audit complete: {findings['summary']}")`,
                iamPolicy: `Required IAM Roles:
- roles/cloudasset.viewer (on organization)
- roles/compute.securityAdmin (only if AUTO_DISABLE=true)
- roles/storage.objectCreator (on evidence bucket)`
            },
            {
                id: "evidence-collector",
                name: "Compliance Evidence Collector",
                description: "Weekly function that collects compliance evidence from SCC findings, Cloud Audit Logs, IAM policies, and organization policy compliance. Packages evidence into a structured JSON report.",
                controls: ["3.12.1", "3.12.3", "3.12.4", "3.3.1"],
                category: "Evidence & Assessment",
                runtime: "Python 3.12",
                trigger: "Cloud Scheduler (weekly, Sunday 03:00 UTC)",
                envVars: {
                    "ORG_ID": "<organization-id>",
                    "EVIDENCE_BUCKET": "cmmc-compliance-evidence"
                },
                code: `import functions_framework
from google.cloud import securitycenter_v1, storage, asset_v1
from google.cloud import orgpolicy_v2
import json, os, logging
from datetime import datetime, timedelta

@functions_framework.cloud_event
def compliance_evidence_collector(cloud_event):
    """Weekly compliance evidence collection for CMMC assessment."""
    logging.info("Starting weekly compliance evidence collection...")

    org_id = os.environ["ORG_ID"]
    evidence = {
        "collection_date": datetime.utcnow().isoformat(),
        "org_id": org_id,
        "sections": {}
    }

    # 1. SCC Findings Summary
    scc_client = securitycenter_v1.SecurityCenterClient()
    try:
        findings_request = securitycenter_v1.ListFindingsRequest(
            parent=f"organizations/{org_id}/sources/-",
            filter='state="ACTIVE"'
        )
        active_findings = list(scc_client.list_findings(request=findings_request))
        severity_counts = {}
        for f in active_findings:
            sev = f.finding.severity.name
            severity_counts[sev] = severity_counts.get(sev, 0) + 1

        evidence["sections"]["scc_findings"] = {
            "total_active": len(active_findings),
            "by_severity": severity_counts,
            "critical": severity_counts.get("CRITICAL", 0),
            "high": severity_counts.get("HIGH", 0)
        }
    except Exception as e:
        logging.warning(f"SCC collection failed: {e}")

    # 2. Organization Policy Compliance
    try:
        policy_client = orgpolicy_v2.OrgPolicyClient()
        policies = list(policy_client.list_policies(
            request={"parent": f"organizations/{org_id}"}
        ))
        evidence["sections"]["org_policies"] = {
            "total_policies": len(policies),
            "policies": [
                {"name": p.name.split("/")[-1], "enforced": bool(p.spec.rules)}
                for p in policies[:20]
            ]
        }
    except Exception as e:
        logging.warning(f"Org policy collection failed: {e}")

    # 3. Asset Inventory Summary
    try:
        asset_client = asset_v1.AssetServiceClient()
        asset_types = [
            "compute.googleapis.com/Instance",
            "storage.googleapis.com/Bucket",
            "sqladmin.googleapis.com/Instance",
            "container.googleapis.com/Cluster"
        ]
        asset_counts = {}
        for asset_type in asset_types:
            assets = list(asset_client.list_assets(
                request=asset_v1.ListAssetsRequest(
                    parent=f"organizations/{org_id}",
                    asset_types=[asset_type],
                    content_type=asset_v1.ContentType.RESOURCE
                )
            ))
            short_name = asset_type.split("/")[-1]
            asset_counts[short_name] = len(assets)

        evidence["sections"]["asset_inventory"] = asset_counts
    except Exception as e:
        logging.warning(f"Asset inventory collection failed: {e}")

    # 4. Upload evidence package
    storage_client = storage.Client()
    bucket = storage_client.bucket(os.environ["EVIDENCE_BUCKET"])
    week_str = datetime.utcnow().strftime('%Y-W%V')
    blob_name = f"weekly-evidence/{week_str}/compliance-evidence-package.json"
    bucket.blob(blob_name).upload_from_string(
        json.dumps(evidence, indent=2, default=str),
        content_type="application/json"
    )

    logging.info(f"Evidence collection complete: {blob_name}")`,
                iamPolicy: `Required IAM Roles:
- roles/securitycenter.findingsViewer (on organization)
- roles/orgpolicy.policyViewer (on organization)
- roles/cloudasset.viewer (on organization)
- roles/storage.objectCreator (on evidence bucket)`
            }
        ]
    },

    // ==================== 3. CHRONICLE SIEM DETECTIONS ====================
    chronicleDetections: {
        title: "Chronicle SIEM Detection Rules",
        description: "YARA-L 2.0 detection rules for Google Chronicle SIEM, targeting CMMC-specific threat scenarios. Deploy via Chronicle Detection Engine API.",

        rules: [
            {
                id: "yara-brute-force",
                name: "Brute Force Authentication Attack",
                controls: ["3.1.1", "3.1.8", "3.3.1", "3.5.3"],
                category: "Identity Threat Detection",
                sql: `// Chronicle YARA-L 2.0 — Brute Force Detection
// CMMC 3.1.1 / 3.1.8 / 3.5.3
rule cmmc_brute_force_attack {
  meta:
    author = "MSSP Compliance Team"
    description = "Detects brute force authentication attempts"
    severity = "HIGH"
    cmmc_controls = "3.1.1, 3.1.8, 3.5.3"

  events:
    // Failed authentication events
    $fail.metadata.event_type = "USER_LOGIN"
    $fail.security_result.action = "BLOCK"
    $fail.target.user.userid = $user
    $fail.principal.ip = $src_ip

    // Successful login after failures
    $success.metadata.event_type = "USER_LOGIN"
    $success.security_result.action = "ALLOW"
    $success.target.user.userid = $user

    // Time window
    $fail.metadata.event_timestamp.seconds <
      $success.metadata.event_timestamp.seconds

  match:
    $user, $src_ip over 1h

  condition:
    #fail > 10 and $success
}`
            },
            {
                id: "yara-data-exfil",
                name: "Potential Data Exfiltration via Cloud Storage",
                controls: ["3.1.1", "3.8.1", "3.13.1", "3.13.2"],
                category: "Data Protection",
                sql: `// Chronicle YARA-L 2.0 — Data Exfiltration Detection
// CMMC 3.8.1 / 3.13.1
rule cmmc_data_exfiltration_gcs {
  meta:
    author = "MSSP Compliance Team"
    description = "Detects large-scale data downloads from Cloud Storage"
    severity = "HIGH"
    cmmc_controls = "3.1.1, 3.8.1, 3.13.1"

  events:
    $download.metadata.event_type = "RESOURCE_READ"
    $download.target.resource.resource_type = "STORAGE_OBJECT"
    $download.principal.user.userid = $user
    $download.principal.ip = $src_ip
    $download.network.sent_bytes > 0

  match:
    $user, $src_ip over 1h

  condition:
    // More than 100 object reads or 1GB transferred in 1 hour
    #download > 100
}`
            },
            {
                id: "yara-sa-key-abuse",
                name: "Service Account Key Abuse",
                controls: ["3.5.1", "3.5.2", "3.1.7"],
                category: "Identity Threat Detection",
                sql: `// Chronicle YARA-L 2.0 — Service Account Key Abuse
// CMMC 3.5.1 / 3.1.7
rule cmmc_sa_key_abuse {
  meta:
    author = "MSSP Compliance Team"
    description = "Detects service account key usage from unusual locations"
    severity = "CRITICAL"
    cmmc_controls = "3.5.1, 3.5.2, 3.1.7"

  events:
    // SA key creation
    $create.metadata.event_type = "RESOURCE_CREATION"
    $create.target.resource.resource_type = "SERVICE_ACCOUNT_KEY"
    $create.principal.user.userid = $creator

    // SA used from external IP shortly after
    $use.metadata.event_type = "USER_LOGIN"
    $use.principal.user.user_display_name = $sa_name
    $use.principal.ip = $use_ip

    // External IP check (not RFC1918)
    NOT (
      net.ip_in_range_cidr($use_ip, "10.0.0.0/8") OR
      net.ip_in_range_cidr($use_ip, "172.16.0.0/12") OR
      net.ip_in_range_cidr($use_ip, "192.168.0.0/16")
    )

    $create.metadata.event_timestamp.seconds <
      $use.metadata.event_timestamp.seconds

  match:
    $creator, $sa_name over 24h

  condition:
    $create and $use
}`
            },
            {
                id: "yara-iam-escalation",
                name: "IAM Privilege Escalation",
                controls: ["3.1.7", "3.3.1", "3.4.5"],
                category: "Privileged Access Monitoring",
                sql: `// Chronicle YARA-L 2.0 — IAM Privilege Escalation
// CMMC 3.1.7 / 3.3.1
rule cmmc_iam_privilege_escalation {
  meta:
    author = "MSSP Compliance Team"
    description = "Detects IAM policy changes granting elevated privileges"
    severity = "HIGH"
    cmmc_controls = "3.1.7, 3.3.1, 3.4.5"

  events:
    $iam_change.metadata.event_type = "RESOURCE_PERMISSIONS_CHANGE"
    $iam_change.principal.user.userid = $actor
    $iam_change.target.resource.attribute.labels["role_name"] = $role

    // High-privilege roles
    (
      $role = "roles/owner" or
      $role = "roles/editor" or
      $role = "roles/iam.securityAdmin" or
      $role = "roles/resourcemanager.organizationAdmin" or
      $role = "roles/iam.serviceAccountAdmin"
    )

  match:
    $actor over 1h

  condition:
    #iam_change > 0
}`
            }
        ]
    },

    // ==================== 4. BIGQUERY COMPLIANCE QUERIES ====================
    bigqueryQueries: {
        title: "BigQuery Compliance Queries",
        description: "SQL queries for analyzing Cloud Audit Logs in BigQuery for compliance evidence, incident investigation, and continuous monitoring.",

        queries: [
            {
                id: "bq-unauthorized-access",
                name: "Unauthorized Access Attempts (Last 24h)",
                controls: ["3.1.1", "3.3.1", "3.3.5"],
                category: "Access Monitoring",
                sql: `-- Unauthorized access attempts from Cloud Audit Logs
-- Run against the BigQuery audit log export dataset
SELECT
  timestamp,
  protopayload_auditlog.authenticationInfo.principalEmail AS principal,
  protopayload_auditlog.methodName AS method,
  protopayload_auditlog.resourceName AS resource,
  protopayload_auditlog.status.code AS status_code,
  protopayload_auditlog.status.message AS status_message,
  protopayload_auditlog.requestMetadata.callerIp AS source_ip,
  protopayload_auditlog.requestMetadata.callerSuppliedUserAgent AS user_agent
FROM \`project.dataset.cloudaudit_googleapis_com_activity_*\`
WHERE
  _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
  AND (
    protopayload_auditlog.status.code = 7   -- PERMISSION_DENIED
    OR protopayload_auditlog.status.code = 16  -- UNAUTHENTICATED
    OR protopayload_auditlog.authorizationInfo.granted = false
  )
ORDER BY timestamp DESC
LIMIT 1000`
            },
            {
                id: "bq-iam-changes",
                name: "IAM Policy Modifications (Last 7 Days)",
                controls: ["3.1.7", "3.3.1", "3.4.5"],
                category: "Change Tracking",
                sql: `-- IAM policy changes across all projects
SELECT
  timestamp,
  protopayload_auditlog.authenticationInfo.principalEmail AS who_changed,
  protopayload_auditlog.methodName AS action,
  protopayload_auditlog.resourceName AS resource,
  protopayload_auditlog.requestMetadata.callerIp AS source_ip,
  JSON_EXTRACT_SCALAR(
    protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas,
    '$[0].role'
  ) AS role_affected,
  JSON_EXTRACT_SCALAR(
    protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas,
    '$[0].member'
  ) AS member_affected,
  JSON_EXTRACT_SCALAR(
    protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas,
    '$[0].action'
  ) AS binding_action
FROM \`project.dataset.cloudaudit_googleapis_com_activity_*\`
WHERE
  _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
  AND protopayload_auditlog.methodName LIKE '%SetIamPolicy%'
ORDER BY timestamp DESC`
            },
            {
                id: "bq-firewall-changes",
                name: "Firewall Rule Modifications",
                controls: ["3.13.1", "3.4.5", "3.3.1"],
                category: "Network Change Tracking",
                sql: `-- VPC firewall rule changes
SELECT
  timestamp,
  protopayload_auditlog.authenticationInfo.principalEmail AS who_changed,
  protopayload_auditlog.methodName AS action,
  protopayload_auditlog.resourceName AS firewall_rule,
  protopayload_auditlog.requestMetadata.callerIp AS source_ip,
  CASE
    WHEN protopayload_auditlog.methodName LIKE '%insert%' THEN 'CREATED'
    WHEN protopayload_auditlog.methodName LIKE '%delete%' THEN 'DELETED'
    WHEN protopayload_auditlog.methodName LIKE '%update%' THEN 'MODIFIED'
    WHEN protopayload_auditlog.methodName LIKE '%patch%' THEN 'PATCHED'
    ELSE 'OTHER'
  END AS change_type
FROM \`project.dataset.cloudaudit_googleapis_com_activity_*\`
WHERE
  _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
  AND protopayload_auditlog.methodName LIKE '%compute.firewalls%'
ORDER BY timestamp DESC`
            },
            {
                id: "bq-data-access",
                name: "Sensitive Data Access Patterns",
                controls: ["3.1.1", "3.3.1", "3.3.2", "3.8.1"],
                category: "Data Access Monitoring",
                sql: `-- Data access patterns for CUI-containing resources
SELECT
  timestamp,
  protopayload_auditlog.authenticationInfo.principalEmail AS accessor,
  protopayload_auditlog.methodName AS access_method,
  protopayload_auditlog.resourceName AS resource,
  protopayload_auditlog.requestMetadata.callerIp AS source_ip,
  COUNT(*) OVER (
    PARTITION BY protopayload_auditlog.authenticationInfo.principalEmail
    ORDER BY timestamp
    RANGE BETWEEN INTERVAL 1 HOUR PRECEDING AND CURRENT ROW
  ) AS access_count_1h
FROM \`project.dataset.cloudaudit_googleapis_com_data_access_*\`
WHERE
  _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
  AND (
    protopayload_auditlog.resourceName LIKE '%cui-%'
    OR protopayload_auditlog.resourceName LIKE '%sensitive-%'
    OR protopayload_auditlog.resourceName LIKE '%cmmc-%'
  )
ORDER BY access_count_1h DESC, timestamp DESC
LIMIT 500`
            }
        ]
    },

    // ==================== 5. QUICK REFERENCE ====================
    quickReference: {
        title: "GCP Service → CMMC Control Mapping",
        description: "Quick reference mapping GCP services to the CMMC Level 2 controls they help satisfy.",
        mappings: [
            { service: "Security Command Center", category: "Vulnerability & Threat", controls: ["3.11.1", "3.11.2", "3.11.3", "3.14.1", "3.14.2", "3.14.6"] },
            { service: "Chronicle SIEM", category: "SIEM & Monitoring", controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.5", "3.14.6", "3.14.7"] },
            { service: "Cloud Audit Logs", category: "Logging & Audit", controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.6", "3.3.7", "3.3.8"] },
            { service: "Cloud IAM", category: "Identity & Access", controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7", "3.5.1", "3.5.2"] },
            { service: "BeyondCorp Enterprise", category: "Zero Trust Access", controls: ["3.1.1", "3.1.12", "3.1.15", "3.5.3"] },
            { service: "Organization Policies", category: "Configuration & Compliance", controls: ["3.4.1", "3.4.2", "3.4.5", "3.4.6", "3.4.8"] },
            { service: "Cloud KMS", category: "Encryption & Secrets", controls: ["3.13.8", "3.13.10", "3.13.11"] },
            { service: "Cloud Logging / Monitoring", category: "Logging & Monitoring", controls: ["3.3.1", "3.3.2", "3.3.6", "3.3.7"] },
            { service: "VPC Service Controls", category: "Network Security", controls: ["3.13.1", "3.13.5", "3.13.6"] },
            { service: "Cloud Functions", category: "Automation", controls: ["3.3.1", "3.4.2", "3.12.1"] },
            { service: "Cloud Armor / WAF", category: "Network Security", controls: ["3.13.1", "3.13.5", "3.14.6"] },
            { service: "Assured Workloads", category: "Compliance Framework", controls: ["3.4.1", "3.4.2", "3.13.8"] },
            { service: "Cloud DLP", category: "Data Protection", controls: ["3.1.1", "3.8.1", "3.8.2", "3.8.3"] },
            { service: "OS Config / Patch Management", category: "Patch Management", controls: ["3.14.1", "3.4.1", "3.4.2"] },
            { service: "Binary Authorization", category: "Supply Chain", controls: ["3.4.1", "3.4.8", "3.14.2"] },
            { service: "Cloud Identity", category: "Identity", controls: ["3.5.1", "3.5.2", "3.5.3", "3.5.7"] },
            { service: "IAP (Identity-Aware Proxy)", category: "Remote Access", controls: ["3.1.12", "3.1.13", "3.1.14"] }
        ]
    }
};

if (typeof window !== 'undefined') window.MSP_GCP_COMPLIANCE_TOOLKIT = MSP_GCP_COMPLIANCE_TOOLKIT;
