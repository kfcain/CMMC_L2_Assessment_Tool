# Multi-Tenant Evidence & API Integration Architecture

> **Status:** Draft — Private Alpha Planning  
> **Last Updated:** 2026-02-08  
> **Author:** Architecture Decision Record

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Tenant Model & Data Isolation](#3-tenant-model--data-isolation)
4. [Authentication & Identity](#4-authentication--identity)
5. [Storage Model](#5-storage-model)
6. [Encryption Scheme](#6-encryption-scheme)
7. [Cloud API Integration Matrix](#7-cloud-api-integration-matrix)
8. [Evidence Collection Automation](#8-evidence-collection-automation)
9. [Supabase Schema Extensions](#9-supabase-schema-extensions)
10. [Security Controls](#10-security-controls)
11. [Phased Rollout Plan](#11-phased-rollout-plan)
12. [Cost Analysis](#12-cost-analysis)
13. [Open Questions & Risks](#13-open-questions--risks)

---

## 1. Executive Summary

### Goal

Enable organizations (tenants) to:
- Upload and manage compliance evidence (documents, screenshots, certs, diagrams)
- Connect their own cloud environments (Azure/GCC High, AWS/GovCloud, Google Cloud) via secure API integrations
- Automate evidence collection from connected cloud services
- Maintain full data sovereignty — their CUI never leaves their control

### Architecture Decision: Hybrid (Option C)

| Layer | Technology | What It Stores |
|-------|-----------|----------------|
| **Auth & Identity** | Supabase Auth | User accounts, sessions, MFA tokens, OAuth tokens |
| **Metadata & Config** | Supabase Postgres (RLS) | Tenant config, API connection metadata, assessment state, control mappings, audit logs |
| **Evidence Storage** | BYOS (Bring Your Own Storage) | User's own Azure Blob / AWS S3 / GCS bucket — OR — Supabase Storage (for tenants without their own cloud) |
| **API Integrations** | Client-side OAuth + optional Edge Function proxy | Direct browser-to-cloud API calls using tenant's own OAuth tokens |
| **Encryption** | Web Crypto API (client-side) | API credentials and sensitive metadata encrypted before storage |

### Why This Architecture

- **$0 infrastructure cost** until significant scale (Supabase free tier)
- **Zero CUI liability** — evidence stays in the tenant's own cloud boundary
- **Compliance-friendly** — tenant's data stays within their FedRAMP/GovCloud authorized boundary
- **Already built** — extends existing Supabase schema (orgs, RLS, RBAC, evidence, audit log)
- **Private by default** — invite-only via Supabase Auth, no public registration

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side)                        │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────────┐ │
│  │  Assessment   │  │  Evidence    │  │  Cloud API Connector      │ │
│  │  Tool UI      │  │  Manager     │  │  (MSAL.js / AWS SDK /     │ │
│  │              │  │              │  │   Google Identity)         │ │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬─────────────────┘ │
│         │                 │                     │                   │
│  ┌──────┴─────────────────┴─────────────────────┴─────────────────┐ │
│  │              Web Crypto API (AES-256-GCM)                      │ │
│  │         Client-side encryption of sensitive fields             │ │
│  └──────┬─────────────────┬─────────────────────┬─────────────────┘ │
└─────────┼─────────────────┼─────────────────────┼───────────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────┐ ┌──────────────┐  ┌───────────────────────────────┐
│  Supabase Auth  │ │  Supabase    │  │  Tenant's Own Cloud           │
│  + MFA          │ │  Postgres    │  │                               │
│  + OAuth/SAML   │ │  (RLS)       │  │  ┌─────────┐ ┌─────────────┐ │
│                 │ │              │  │  │ Azure   │ │ AWS         │ │
│  Sessions,      │ │  Metadata,   │  │  │ Blob /  │ │ S3 /        │ │
│  Tokens         │ │  Config,     │  │  │ GCC High│ │ GovCloud    │ │
│                 │ │  Audit Log   │  │  └─────────┘ └─────────────┘ │
│                 │ │              │  │  ┌─────────────────────────┐  │
│                 │ │              │  │  │ Google Cloud Storage    │  │
│                 │ │              │  │  └─────────────────────────┘  │
└─────────────────┘ └──────────────┘  └───────────────────────────────┘

Optional CORS Proxy (only when needed):
┌──────────────────────────────────┐
│  Supabase Edge Function          │
│  - Stateless relay               │
│  - No data storage               │
│  - Validates tenant JWT          │
│  - Forwards to cloud API         │
│  - 500K free invocations/mo      │
└──────────────────────────────────┘
```

---

## 3. Tenant Model & Data Isolation

### Existing Foundation

The current schema already provides multi-tenancy:

| Table | Tenant Scope | RLS Policy |
|-------|-------------|------------|
| `organizations` | IS the tenant | Members-only SELECT |
| `organization_members` | Links users → tenants | Members-only SELECT, owner/admin CRUD |
| `assessments` | Scoped to `organization_id` | Members-only SELECT, assessor+ CRUD |
| `evidence` | Scoped to `organization_id` | Members-only SELECT, assessor+ CRUD |
| `audit_log` | Scoped to `organization_id` | Admin+ SELECT, system INSERT |
| `user_profiles` | Per-user (cross-tenant) | Own-profile only |
| `permissions` | Global role definitions | Public SELECT |

### New Tables Needed

```
cloud_connections          — API connection configs per tenant
├── organization_id (FK)   — tenant isolation
├── provider               — 'azure', 'aws', 'gcp', 'gcc-high', 'govcloud'
├── display_name           — user-friendly label
├── config_encrypted       — AES-256-GCM encrypted JSON blob (client IDs, tenant IDs, etc.)
├── token_encrypted        — AES-256-GCM encrypted OAuth refresh token
├── scopes                 — granted API scopes (JSONB array)
├── status                 — 'active', 'expired', 'revoked', 'error'
├── last_synced_at         — last successful API call
├── created_by             — user who set up the connection
└── RLS: members SELECT, owner/admin CRUD

evidence_storage_config    — BYOS bucket config per tenant
├── organization_id (FK)   — tenant isolation
├── provider               — 'azure-blob', 'aws-s3', 'gcs', 'supabase'
├── bucket_name            — e.g., 'my-cmmc-evidence'
├── region                 — e.g., 'us-gov-virginia', 'us-east-1'
├── config_encrypted       — AES-256-GCM encrypted connection string / SAS token / IAM role ARN
├── is_primary             — which bucket to use for new uploads
├── verified               — connection test passed
└── RLS: members SELECT, owner/admin CRUD

evidence_snapshots         — automated evidence collection results
├── organization_id (FK)
├── cloud_connection_id (FK)
├── control_id             — CMMC control this evidence supports
├── snapshot_type          — 'config-export', 'policy-screenshot', 'log-extract', 'api-response'
├── data_encrypted         — AES-256-GCM encrypted snapshot content (JSON)
├── storage_path           — path in BYOS bucket (if file was stored)
├── collected_at
├── expires_at             — evidence freshness window
└── RLS: members SELECT, assessor+ INSERT
```

### Isolation Guarantees

1. **Database level:** Supabase RLS enforces `organization_id IN (SELECT get_user_org_ids())` on every query
2. **Storage level:** BYOS means each tenant's evidence is in their own cloud account — physically separate
3. **API level:** Each tenant's OAuth tokens are encrypted with a key derived from their org, decrypted only in their browser
4. **Network level:** API calls go directly from the user's browser to their cloud — never through our infrastructure

---

## 4. Authentication & Identity

### Auth Providers (Supabase Auth)

| Provider | Use Case | Free Tier | Setup |
|----------|----------|-----------|-------|
| **Email + Password** | Default for all users | 50K MAU | Built-in |
| **TOTP MFA** | Required for admin/owner roles | Included | Built-in, enforce via app logic |
| **Google OAuth** | Already implemented | Included | Already configured |
| **Microsoft Entra ID (Azure AD)** | GCC High / Azure Gov orgs | Included | Register app in Azure AD, configure in Supabase |
| **SAML SSO** | Enterprise orgs with IdP | Pro plan ($25/mo) | Configure per-org IdP |
| **Magic Link** | Passwordless invite flow | Included | Built-in |

### Auth Flow: Invite-Only Private Alpha

```
1. Admin creates organization in Supabase dashboard (or via app)
2. Admin invites user by email → Supabase sends magic link
3. User clicks link → creates account → auto-joined to org
4. User sets up MFA (TOTP) → required for assessor+ roles
5. User can then:
   a. Access assessments within their org
   b. Connect cloud APIs (owner/admin only)
   c. Upload evidence
   d. View automated evidence snapshots
```

### MFA Enforcement Strategy

```javascript
// Enforce MFA for sensitive operations
async function requireMFA(operation) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.[0];
    
    if (!totp) {
        // Redirect to MFA enrollment
        throw new Error('MFA enrollment required for this operation');
    }
    
    if (totp.status !== 'verified') {
        // Challenge user for TOTP code
        const { data: challenge } = await supabase.auth.mfa.challenge({ factorId: totp.id });
        // Show TOTP input modal, verify with:
        // await supabase.auth.mfa.verify({ factorId: totp.id, challengeId: challenge.id, code: userInput });
    }
}
```

### Operations Requiring MFA

| Operation | MFA Required | Role Required |
|-----------|-------------|---------------|
| Connect cloud API | Yes | owner, admin |
| View/export API credentials | Yes | owner |
| Delete evidence | Yes | admin, owner |
| Invite members | Yes | owner, lead_assessor |
| Change member roles | Yes | owner |
| Export assessment data | Yes | assessor+ |
| Upload evidence | No (session auth sufficient) | assessor+ |
| View assessments | No | viewer+ |

### Entra ID (Azure AD) OAuth Configuration

For organizations using GCC High / Azure Government:

```
Azure AD App Registration:
- Redirect URI: https://<supabase-project>.supabase.co/auth/v1/callback
- Supported account types: Single tenant (org's own directory)
- API Permissions:
  - Microsoft Graph: User.Read (delegated)
  - For API integrations (separate consent):
    - SecurityEvents.Read.All
    - Policy.Read.All
    - DeviceManagementConfiguration.Read.All
    - etc. (see Section 7)

Supabase Auth Config:
- Provider: Azure
- Client ID: <from app registration>
- Client Secret: <from app registration>  
- Azure Tenant: <org's tenant ID>
- For GCC High: authority URL = https://login.microsoftonline.us
```

---

## 5. Storage Model

### Three-Tier Storage Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 1: Browser Local                     │
│  localStorage / IndexedDB                                   │
│  ─────────────────────────────────────────────────────────  │
│  • Assessment state (current session)                       │
│  • UI preferences, theme, last-viewed control               │
│  • Cached API responses (TTL-based)                         │
│  • Draft evidence descriptions                              │
│  • Limit: ~5-50MB depending on browser                      │
│  • Encrypted: No (non-sensitive display data)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  TIER 2: Supabase Postgres                   │
│  Structured metadata (RLS-protected)                        │
│  ─────────────────────────────────────────────────────────  │
│  • Organization config, member roles                        │
│  • Assessment data (JSONB — statuses, POA&M, deficiencies)  │
│  • Evidence metadata (file name, path, control mapping)     │
│  • Cloud connection configs (encrypted blobs)               │
│  • Evidence snapshot metadata                               │
│  • Audit log entries                                        │
│  • Limit: 500MB free tier                                   │
│  • Encrypted: Sensitive fields AES-256-GCM before storage   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  TIER 3: Evidence Files                       │
│  BYOS (Bring Your Own Storage) — OR — Supabase Storage      │
│  ─────────────────────────────────────────────────────────  │
│  Option A: Tenant's own cloud bucket                        │
│    • Azure Blob (Commercial / GCC High / Gov)               │
│    • AWS S3 (Commercial / GovCloud)                         │
│    • Google Cloud Storage                                   │
│    • Tenant controls encryption, retention, access           │
│    • App writes via SAS token / pre-signed URL / SA key     │
│                                                             │
│  Option B: Supabase Storage (fallback for small tenants)    │
│    • Existing 'evidence' bucket with RLS                    │
│    • 1GB free, $25/mo for 100GB                             │
│    • Files scanned via Edge Function (already built)        │
│                                                             │
│  File path format:                                          │
│    {org_id}/{assessment_id}/{control_id}/{timestamp}_{file} │
└─────────────────────────────────────────────────────────────┘
```

### BYOS Connection Flow

```
1. Owner navigates to Settings → Evidence Storage
2. Selects provider (Azure Blob / S3 / GCS)
3. Enters:
   - Azure: Storage account name + SAS token (or Managed Identity if using Azure)
   - AWS: Bucket name + region + IAM access key/secret (or assume-role ARN)
   - GCS: Bucket name + service account JSON key
4. App encrypts credentials client-side (AES-256-GCM)
5. Stores encrypted blob in `evidence_storage_config` table
6. App tests connection by writing/reading a small test file
7. If verified, marks as primary storage
8. All subsequent evidence uploads go to tenant's bucket
```

### Upload Flow (BYOS)

```
1. User selects file for upload
2. Client validates file (size, type)
3. Client retrieves encrypted storage config from Supabase
4. Client decrypts config in browser (Web Crypto API)
5. Client generates pre-signed upload URL:
   - Azure: SAS URL with write permission
   - AWS: S3 pre-signed PUT URL
   - GCS: Signed URL with write scope
6. Client uploads file directly to tenant's bucket (browser → cloud)
7. Client creates evidence metadata record in Supabase Postgres
8. Audit log entry created
```

---

## 6. Encryption Scheme

### Key Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│  User Password / Auth Session                                │
│  └─► PBKDF2 (100K iterations, SHA-256)                       │
│      └─► Organization Encryption Key (OEK)                   │
│          ├─► Encrypts: cloud_connections.config_encrypted     │
│          ├─► Encrypts: cloud_connections.token_encrypted      │
│          ├─► Encrypts: evidence_storage_config.config_encrypted│
│          └─► Encrypts: evidence_snapshots.data_encrypted      │
└──────────────────────────────────────────────────────────────┘
```

### Key Derivation

```javascript
// Derive organization encryption key from user's auth session
async function deriveOrgKey(userSession, orgId) {
    const encoder = new TextEncoder();
    
    // Import the user's access token as key material
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(userSession.access_token),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    
    // Derive AES-256-GCM key using org ID as salt
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(`cmmc-org-${orgId}`),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}
```

### Encrypt/Decrypt Operations

```javascript
async function encryptField(key, plaintext) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(JSON.stringify(plaintext))
    );
    
    // Store as: base64(iv) + '.' + base64(ciphertext)
    return btoa(String.fromCharCode(...iv)) + '.' + 
           btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
}

async function decryptField(key, encrypted) {
    const [ivB64, ctB64] = encrypted.split('.');
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0));
    
    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
    );
    
    return JSON.parse(new TextDecoder().decode(plaintext));
}
```

### What Gets Encrypted

| Field | Encrypted? | Where Decrypted |
|-------|-----------|-----------------|
| Cloud API client IDs | Yes (AES-256-GCM) | Browser only |
| Cloud API client secrets | Yes (AES-256-GCM) | Browser only |
| OAuth refresh tokens | Yes (AES-256-GCM) | Browser only |
| Storage bucket credentials (SAS/keys) | Yes (AES-256-GCM) | Browser only |
| Evidence snapshot data | Yes (AES-256-GCM) | Browser only |
| Assessment data (statuses, POA&M) | No (protected by RLS) | N/A |
| Evidence file metadata | No (protected by RLS) | N/A |
| Evidence files themselves | Tenant's responsibility (their bucket, their encryption) | N/A |
| Audit log entries | No (protected by RLS) | N/A |

### Key Rotation

- Keys are derived from the user's session token, which rotates on each login
- If a user's session is compromised, revoking the session invalidates the derived key
- Organization-level key rotation: admin can trigger re-encryption of all connection configs
- Supabase handles session token rotation automatically

---

## 7. Cloud API Integration Matrix

### Microsoft Azure / GCC High / Azure Government

| API | Endpoint | CORS | Auth Method | Data Returned | CMMC Controls |
|-----|----------|------|-------------|---------------|---------------|
| **Microsoft Graph — Users & Groups** | `graph.microsoft.com/v1.0/users` | ✅ Yes | MSAL.js (delegated) | User list, group memberships, MFA status | AC.L2-3.1.1, AC.L2-3.1.2, IA.L2-3.5.1 |
| **Microsoft Graph — Conditional Access** | `graph.microsoft.com/v1.0/identity/conditionalAccessPolicies` | ✅ Yes | MSAL.js (delegated) | CA policies, enforcement status | AC.L2-3.1.1, AC.L2-3.1.3 |
| **Microsoft Graph — Security Alerts** | `graph.microsoft.com/v1.0/security/alerts_v2` | ✅ Yes | MSAL.js (delegated) | Defender alerts, severity, status | SI.L2-3.14.1, SI.L2-3.14.2 |
| **Microsoft Graph — Secure Score** | `graph.microsoft.com/v1.0/security/secureScores` | ✅ Yes | MSAL.js (delegated) | Tenant security score, control scores | CA.L2-3.12.1 |
| **Microsoft Graph — Device Compliance** | `graph.microsoft.com/v1.0/deviceManagement/managedDevices` | ✅ Yes | MSAL.js (delegated) | Device compliance state, OS, encryption | CM.L2-3.4.1, SC.L2-3.13.11 |
| **Microsoft Graph — Audit Logs** | `graph.microsoft.com/v1.0/auditLogs/signIns` | ✅ Yes | MSAL.js (delegated) | Sign-in logs, location, risk level | AU.L2-3.3.1, AU.L2-3.3.2 |
| **Microsoft Graph — Mail Transport Rules** | `graph.microsoft.com/v1.0/admin/exchangeOnline/transportRules` | ✅ Yes | MSAL.js (delegated) | Email flow rules, DLP policies | SC.L2-3.13.1 |
| **Microsoft Graph — SharePoint/OneDrive** | `graph.microsoft.com/v1.0/sites` | ✅ Yes | MSAL.js (delegated) | Site configs, sharing settings | AC.L2-3.1.3, MP.L2-3.8.2 |
| **Azure Resource Manager** | `management.azure.com` | ⚠️ Partial | MSAL.js (delegated) | Resource groups, NSGs, Key Vaults | SC.L2-3.13.1, SC.L2-3.13.11 |
| **Azure Policy Compliance** | `management.azure.com/.../policyStates` | ⚠️ Partial | MSAL.js (delegated) | Policy compliance state per resource | CM.L2-3.4.2 |

**GCC High / Azure Gov differences:**
- Authority URL: `https://login.microsoftonline.us` (instead of `.com`)
- Graph endpoint: `https://graph.microsoft.us` (instead of `.com`)
- ARM endpoint: `https://management.usgovcloudapi.net`
- MSAL.js supports these via `cloudDiscoveryMetadata` config

### AWS / GovCloud

| API | Endpoint | CORS | Auth Method | Data Returned | CMMC Controls |
|-----|----------|------|-------------|---------------|---------------|
| **IAM — Users & Policies** | `iam.amazonaws.com` | ❌ No | SigV4 | Users, roles, policies, MFA devices | AC.L2-3.1.1, IA.L2-3.5.1 |
| **CloudTrail — Audit Logs** | `cloudtrail.{region}.amazonaws.com` | ❌ No | SigV4 | API call history, who did what | AU.L2-3.3.1, AU.L2-3.3.2 |
| **Config — Compliance** | `config.{region}.amazonaws.com` | ❌ No | SigV4 | Config rule compliance, resource inventory | CM.L2-3.4.1, CM.L2-3.4.2 |
| **Security Hub** | `securityhub.{region}.amazonaws.com` | ❌ No | SigV4 | Findings, compliance standards | SI.L2-3.14.1, CA.L2-3.12.1 |
| **GuardDuty** | `guardduty.{region}.amazonaws.com` | ❌ No | SigV4 | Threat findings | SI.L2-3.14.2, SI.L2-3.14.6 |
| **S3 — Bucket Policies** | `s3.{region}.amazonaws.com` | ✅ Yes (configurable) | SigV4 | Bucket ACLs, encryption, versioning | SC.L2-3.13.11, MP.L2-3.8.9 |
| **EC2 — Security Groups** | `ec2.{region}.amazonaws.com` | ❌ No | SigV4 | SG rules, VPC configs, flow logs | SC.L2-3.13.1, SC.L2-3.13.6 |
| **KMS — Key Management** | `kms.{region}.amazonaws.com` | ❌ No | SigV4 | Key policies, rotation status | SC.L2-3.13.11 |

**AWS CORS Problem:** Most AWS APIs do **not** support browser CORS. Solutions:
1. **Supabase Edge Function proxy** (recommended) — stateless relay, validates JWT, forwards SigV4-signed request
2. **AWS SDK for JS v3** — works for S3 (CORS-enabled) but not for IAM, CloudTrail, etc.
3. **Lambda + API Gateway** — tenant deploys in their own account, we call their endpoint

**GovCloud differences:**
- Region: `us-gov-west-1` or `us-gov-east-1`
- Endpoints: `*.us-gov.amazonaws.com`
- Separate IAM partition: `arn:aws-us-gov:...`
- Requires separate GovCloud account

### Google Cloud / Google Workspace

| API | Endpoint | CORS | Auth Method | Data Returned | CMMC Controls |
|-----|----------|------|-------------|---------------|---------------|
| **Admin SDK — Users** | `admin.googleapis.com/admin/directory/v1/users` | ✅ Yes | Google Identity Services | User list, 2FA status, org units | AC.L2-3.1.1, IA.L2-3.5.1 |
| **Admin SDK — Security** | `admin.googleapis.com` | ✅ Yes | Google Identity Services | Login audit, token audit | AU.L2-3.3.1 |
| **Gmail — Settings** | `gmail.googleapis.com` | ✅ Yes | Google Identity Services | Mail routing, DLP rules | SC.L2-3.13.1 |
| **Drive — Sharing** | `www.googleapis.com/drive/v3` | ✅ Yes | Google Identity Services | File sharing settings, external access | AC.L2-3.1.3, MP.L2-3.8.2 |
| **Cloud Resource Manager** | `cloudresourcemanager.googleapis.com` | ✅ Yes | Google Identity Services | Projects, IAM policies | AC.L2-3.1.1 |
| **Cloud Asset Inventory** | `cloudasset.googleapis.com` | ✅ Yes | Google Identity Services | Full resource inventory | CM.L2-3.4.1 |
| **Security Command Center** | `securitycenter.googleapis.com` | ✅ Yes | Google Identity Services | Findings, vulnerabilities | SI.L2-3.14.1 |
| **Cloud Logging** | `logging.googleapis.com` | ✅ Yes | Google Identity Services | Audit logs, access logs | AU.L2-3.3.1, AU.L2-3.3.2 |

**Google advantage:** All APIs support CORS — no proxy needed.

### CORS Proxy Strategy (for AWS APIs)

```
Supabase Edge Function: /functions/v1/cloud-proxy

Request:
POST /functions/v1/cloud-proxy
Authorization: Bearer <supabase-jwt>
Content-Type: application/json

{
    "connection_id": "uuid-of-cloud-connection",
    "provider": "aws",
    "service": "iam",
    "action": "ListUsers",
    "params": {}
}

Edge Function Logic:
1. Validate Supabase JWT
2. Look up cloud_connections record (verify user has access via RLS)
3. Decrypt credentials using server-side key (Edge Function env var)
4. Sign AWS request with SigV4
5. Forward to AWS API
6. Return response to browser
7. Log API call in audit_log

Security:
- Edge Function has its own encryption key for server-side decryption
- This is the ONLY case where credentials are decrypted server-side
- Edge Function is stateless — no data persisted
- Rate limited per tenant
- All calls audit-logged
```

---

## 8. Evidence Collection Automation

### Automated Evidence Types

| Evidence Type | Source | Collection Method | Freshness |
|---------------|--------|-------------------|-----------|
| **User & MFA Inventory** | Azure AD / AWS IAM / Google Admin | API pull → JSON snapshot | Daily |
| **Conditional Access Policies** | Azure AD | API pull → JSON snapshot | Weekly |
| **Security Score / Secure Score** | Microsoft / AWS Security Hub | API pull → score + breakdown | Daily |
| **Device Compliance Report** | Intune / AWS Config | API pull → compliance summary | Daily |
| **Audit Log Export** | All providers | API pull → filtered log entries | Daily |
| **Network Security Rules** | Azure NSG / AWS SG / GCP Firewall | API pull → rule export | Weekly |
| **Encryption Status** | Azure Key Vault / AWS KMS / GCP KMS | API pull → key inventory | Weekly |
| **Policy Compliance** | Azure Policy / AWS Config Rules | API pull → compliance % | Daily |
| **Vulnerability Findings** | Defender / Security Hub / SCC | API pull → finding summary | Daily |
| **Data Loss Prevention** | Exchange / Gmail rules | API pull → DLP policy export | Weekly |

### Collection Scheduler

Since we can't run server-side cron jobs on the free tier, evidence collection is triggered:

1. **On-demand:** User clicks "Collect Evidence" for a specific control
2. **On-login:** When user opens the app, stale evidence (>24h) is refreshed in background
3. **Manual schedule:** User can set a reminder to collect evidence (browser notification)
4. **Future (Pro tier):** Supabase Edge Function cron job for automated daily collection

### Evidence-to-Control Mapping

```javascript
// Maps cloud API calls to CMMC controls they provide evidence for
const EVIDENCE_COLLECTION_MAP = {
    'AC.L2-3.1.1': {
        title: 'Authorized Access Control',
        collectors: [
            {
                provider: 'azure',
                api: 'graph/users',
                description: 'Export user list with roles and MFA status',
                scopes: ['User.Read.All', 'Directory.Read.All']
            },
            {
                provider: 'aws',
                api: 'iam/ListUsers',
                description: 'Export IAM users with MFA devices',
                scopes: ['iam:ListUsers', 'iam:ListMFADevices']
            },
            {
                provider: 'gcp',
                api: 'admin/directory/users',
                description: 'Export Workspace users with 2FA status',
                scopes: ['admin.directory.user.readonly']
            }
        ]
    },
    // ... mapped for all 110 CMMC L2 controls
};
```

---

## 9. Supabase Schema Extensions

### Migration 007: Cloud Connections & BYOS

```sql
-- Migration 007: Cloud API Connections and BYOS Storage

-- Cloud provider enum
CREATE TYPE cloud_provider AS ENUM (
    'azure', 'azure-gcc-high', 'azure-gov',
    'aws', 'aws-govcloud',
    'gcp', 'google-workspace'
);

-- Storage provider enum  
CREATE TYPE storage_provider AS ENUM (
    'azure-blob', 'aws-s3', 'gcs', 'supabase'
);

-- Cloud API Connections
CREATE TABLE cloud_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider cloud_provider NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    config_encrypted TEXT NOT NULL,        -- AES-256-GCM encrypted JSON
    token_encrypted TEXT,                  -- AES-256-GCM encrypted OAuth refresh token
    scopes JSONB DEFAULT '[]'::jsonb,      -- granted API scopes
    status VARCHAR(20) DEFAULT 'active',   -- active, expired, revoked, error
    last_synced_at TIMESTAMPTZ,
    last_error TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence Storage Configuration (BYOS)
CREATE TABLE evidence_storage_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider storage_provider NOT NULL,
    bucket_name VARCHAR(255),
    region VARCHAR(50),
    config_encrypted TEXT NOT NULL,        -- AES-256-GCM encrypted connection details
    is_primary BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, provider, bucket_name)
);

-- Evidence Snapshots (automated collection results)
CREATE TABLE evidence_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    cloud_connection_id UUID REFERENCES cloud_connections(id) ON DELETE SET NULL,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    control_id VARCHAR(20) NOT NULL,
    objective_id VARCHAR(30),
    snapshot_type VARCHAR(50) NOT NULL,    -- config-export, policy-screenshot, log-extract, api-response
    title VARCHAR(255),
    data_encrypted TEXT,                   -- AES-256-GCM encrypted snapshot content
    storage_path TEXT,                     -- path in BYOS bucket (if file stored)
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,               -- evidence freshness window
    collected_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cloud_connections_org ON cloud_connections(organization_id);
CREATE INDEX idx_cloud_connections_provider ON cloud_connections(provider);
CREATE INDEX idx_evidence_storage_org ON evidence_storage_config(organization_id);
CREATE INDEX idx_evidence_snapshots_org ON evidence_snapshots(organization_id);
CREATE INDEX idx_evidence_snapshots_control ON evidence_snapshots(control_id);
CREATE INDEX idx_evidence_snapshots_collected ON evidence_snapshots(collected_at DESC);

-- Triggers
CREATE TRIGGER update_cloud_connections_updated_at
    BEFORE UPDATE ON cloud_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_evidence_storage_updated_at
    BEFORE UPDATE ON evidence_storage_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE cloud_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_storage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_snapshots ENABLE ROW LEVEL SECURITY;

-- Cloud Connections: members can view, owner/admin can manage
CREATE POLICY "Members can view cloud connections"
    ON cloud_connections FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Admins can manage cloud connections"
    ON cloud_connections FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

CREATE POLICY "Admins can update cloud connections"
    ON cloud_connections FOR UPDATE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

CREATE POLICY "Admins can delete cloud connections"
    ON cloud_connections FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- Evidence Storage Config: same pattern
CREATE POLICY "Members can view storage config"
    ON evidence_storage_config FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Admins can manage storage config"
    ON evidence_storage_config FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

CREATE POLICY "Admins can update storage config"
    ON evidence_storage_config FOR UPDATE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

CREATE POLICY "Admins can delete storage config"
    ON evidence_storage_config FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- Evidence Snapshots: members can view, assessor+ can create
CREATE POLICY "Members can view evidence snapshots"
    ON evidence_snapshots FOR SELECT
    USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY "Assessors can create evidence snapshots"
    ON evidence_snapshots FOR INSERT
    WITH CHECK (user_has_role(organization_id, ARRAY['owner', 'admin', 'assessor', 'lead_assessor']::user_role[]));

CREATE POLICY "Admins can delete evidence snapshots"
    ON evidence_snapshots FOR DELETE
    USING (user_has_role(organization_id, ARRAY['owner', 'admin']::user_role[]));

-- Update permissions table with new resources
INSERT INTO permissions (role, resource, action, allowed) VALUES
('owner', 'cloud_connection', 'create', true),
('owner', 'cloud_connection', 'read', true),
('owner', 'cloud_connection', 'update', true),
('owner', 'cloud_connection', 'delete', true),
('lead_assessor', 'cloud_connection', 'read', true),
('assessor', 'cloud_connection', 'read', true),
('viewer', 'cloud_connection', 'read', false),
('client_contact', 'cloud_connection', 'read', false),

('owner', 'storage_config', 'create', true),
('owner', 'storage_config', 'read', true),
('owner', 'storage_config', 'update', true),
('owner', 'storage_config', 'delete', true),
('lead_assessor', 'storage_config', 'read', true),
('assessor', 'storage_config', 'read', false),

('owner', 'evidence_snapshot', 'create', true),
('owner', 'evidence_snapshot', 'read', true),
('owner', 'evidence_snapshot', 'delete', true),
('lead_assessor', 'evidence_snapshot', 'create', true),
('lead_assessor', 'evidence_snapshot', 'read', true),
('assessor', 'evidence_snapshot', 'create', true),
('assessor', 'evidence_snapshot', 'read', true),
('viewer', 'evidence_snapshot', 'read', true),
('client_contact', 'evidence_snapshot', 'read', true)
ON CONFLICT (role, resource, action) DO NOTHING;
```

---

## 10. Security Controls

### Data Protection Summary

| Threat | Mitigation |
|--------|-----------|
| **Unauthorized access to tenant data** | Supabase RLS enforces org-scoped access on every DB query |
| **Credential theft from database** | All API credentials encrypted client-side (AES-256-GCM) before storage; Supabase never sees plaintext |
| **Session hijacking** | Supabase Auth JWT with short expiry + refresh tokens; MFA required for sensitive ops |
| **Cross-tenant data leak** | RLS + BYOS (physical storage isolation); no shared evidence bucket |
| **Man-in-the-middle** | All connections TLS 1.2+; Supabase enforces HTTPS; cloud APIs enforce HTTPS |
| **Insider threat (us)** | We never see plaintext credentials or evidence files; BYOS means evidence is in tenant's cloud |
| **Compromised Edge Function** | Stateless proxy; no persistent storage; audit-logged; rate-limited |
| **Stale evidence** | `expires_at` field on snapshots; UI warns when evidence is older than policy window |
| **File-based attacks** | Existing file scanning via Edge Function (migration 005); quarantine infected files |
| **Audit trail tampering** | `audit_log` table is append-only (no UPDATE/DELETE policies for non-service roles) |

### Content Security Policy Updates

When cloud API integrations are enabled, the CSP `connect-src` in `index.html` will need:

```html
connect-src 'self'
    https://*.supabase.co
    https://graph.microsoft.com        <!-- Microsoft Graph (Commercial) -->
    https://graph.microsoft.us         <!-- Microsoft Graph (GCC High/Gov) -->
    https://login.microsoftonline.com  <!-- Azure AD (Commercial) -->
    https://login.microsoftonline.us   <!-- Azure AD (GCC High/Gov) -->
    https://management.azure.com       <!-- Azure Resource Manager -->
    https://management.usgovcloudapi.net <!-- Azure Gov Resource Manager -->
    https://*.amazonaws.com            <!-- AWS APIs (via proxy for non-CORS) -->
    https://*.googleapis.com           <!-- Google APIs -->
    https://accounts.google.com        <!-- Google OAuth -->
    https://cdn.sheetjs.com
    https://cdn.jsdelivr.net
    https://ethanolivertroy.github.io;
```

**Note:** AWS API domains should only be added if using direct browser calls (S3). For non-CORS AWS APIs, calls go through the Supabase Edge Function proxy, which is already covered by `https://*.supabase.co`.

---

## 11. Phased Rollout Plan

### Phase 0: Foundation (Current State) ✅

- [x] Supabase schema: orgs, members, assessments, evidence, audit log, RBAC
- [x] SupabaseClient class with auth, CRUD, file upload, scanning
- [x] Evidence UI with login overlay, org/assessment selectors
- [x] Collaboration module with realtime presence
- [x] RLS policies for tenant isolation
- [x] File scanning Edge Function

### Phase 1: Private Alpha — Auth & Tenant Hardening

**Goal:** Invite-only access with MFA, polished tenant management

- [ ] Disable public registration in Supabase Auth settings
- [ ] Implement magic-link invite flow (owner invites by email)
- [ ] Add MFA enrollment UI (TOTP setup with QR code)
- [ ] Enforce MFA for owner/admin/lead_assessor roles
- [ ] Add Entra ID (Azure AD) as OAuth provider in Supabase
- [ ] Build tenant settings page (org name, logo, member management)
- [ ] Add role management UI (change roles, remove members)
- [ ] Audit log viewer in app

### Phase 2: Private Alpha — BYOS & Evidence Storage

**Goal:** Tenants can connect their own cloud storage for evidence

- [ ] Run migration 007 (cloud_connections, evidence_storage_config, evidence_snapshots)
- [ ] Build client-side encryption module (Web Crypto API wrapper)
- [ ] Build BYOS setup wizard (Azure Blob, S3, GCS)
- [ ] Implement connection verification (test write/read)
- [ ] Modify evidence upload flow to support BYOS
- [ ] Add storage provider indicator in evidence list
- [ ] Build evidence snapshot viewer

### Phase 3: Private Alpha — Cloud API Connectors

**Goal:** Connect to Azure/AWS/GCP and pull configuration data

- [ ] Build Azure connector (MSAL.js OAuth flow + Graph API calls)
- [ ] Build Google connector (Google Identity Services + Admin SDK)
- [ ] Build Supabase Edge Function proxy for AWS APIs
- [ ] Build AWS connector (SigV4 signing + proxy calls)
- [ ] Implement evidence collection map (API → CMMC control mapping)
- [ ] Build "Collect Evidence" button per control
- [ ] Build evidence freshness indicators

### Phase 4: Private Beta — Automation & Polish

**Goal:** Automated evidence collection, dashboard integration

- [ ] Background evidence refresh on login (stale > 24h)
- [ ] Evidence collection dashboard (what's fresh, what's stale, what's missing)
- [ ] Integration with Command Center (evidence coverage metrics)
- [ ] Export evidence package (zip of all evidence for an assessment)
- [ ] SAML SSO support (Supabase Pro tier)
- [ ] Rate limiting and usage monitoring

### Phase 5: Public Launch

**Goal:** Self-service registration, pricing tiers, documentation

- [ ] Enable public registration with email verification
- [ ] Implement usage-based pricing tiers
- [ ] Build onboarding wizard
- [ ] Write user documentation
- [ ] Security audit / pen test
- [ ] SOC 2 Type I preparation (if needed)

---

## 12. Cost Analysis

### Free Tier (Phases 1-3)

| Component | Limit | Expected Usage | Cost |
|-----------|-------|---------------|------|
| Supabase Auth | 50K MAU | <100 users | $0 |
| Supabase Postgres | 500MB | ~50MB (metadata only) | $0 |
| Supabase Storage | 1GB | 0 (BYOS) or <1GB (fallback) | $0 |
| Supabase Edge Functions | 500K invocations/mo | <10K (AWS proxy) | $0 |
| Supabase Realtime | 200 concurrent | <20 | $0 |
| **Total** | | | **$0/mo** |

### Pro Tier (Phase 4+, if needed)

| Component | Limit | Cost |
|-----------|-------|------|
| Supabase Pro | 100K MAU, 8GB DB, 100GB storage | $25/mo |
| SAML SSO add-on | Included in Pro | $0 |
| Edge Functions | 2M invocations/mo | Included |
| **Total** | | **$25/mo** |

### Tenant Costs (their responsibility)

| Provider | Evidence Storage | API Calls |
|----------|-----------------|-----------|
| Azure Blob (Hot) | ~$0.02/GB/mo | Included in their subscription |
| AWS S3 Standard | ~$0.023/GB/mo | Included in their subscription |
| GCS Standard | ~$0.02/GB/mo | Included in their subscription |

Typical tenant evidence: 1-10GB → **$0.02-$0.23/mo** on their bill.

---

## 13. Open Questions & Risks

### Open Questions

1. **Key escrow:** If a user loses access, how do we recover encrypted connection configs? Options:
   - Owner can re-encrypt with a recovery key stored in a secure vault
   - Multiple owners can each decrypt (shared key derivation)
   - Accept that losing all owners = re-setup connections

2. **Edge Function for AWS:** Should we build a generic proxy or per-service functions? Generic is simpler but harder to validate inputs.

3. **Evidence retention:** Should we enforce minimum retention periods? CMMC requires evidence to be available for assessment — typically 3 years.

4. **Offline mode:** Should the app work fully offline with sync-on-reconnect? Current localStorage approach supports this, but cloud API calls obviously require connectivity.

5. **Multi-cloud tenants:** Some orgs use Azure + AWS + GCP. The schema supports this (multiple `cloud_connections` per org), but the UI needs to handle it gracefully.

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| AWS CORS blocking prevents direct browser calls | High | Medium | Edge Function proxy already planned |
| GCC High OAuth requires special app registration | Medium | High | Document setup process clearly; test with real GCC High tenant |
| Client-side encryption key loss | Low | High | Key derived from session; re-auth regenerates; connection re-setup is fallback |
| Supabase free tier limits hit | Low (early) | Medium | Monitor usage; upgrade to Pro ($25/mo) when needed |
| Cloud provider API rate limits | Medium | Low | Implement exponential backoff; cache responses; batch requests |
| User stores CUI in Supabase Storage instead of BYOS | Medium | High | Default to BYOS; warn users; add CUI classification labels |

---

## Appendix A: File Structure (Planned)

```
js/
├── supabase-client.js          # Existing — extend with cloud connection methods
├── evidence-ui.js              # Existing — extend with BYOS upload flow
├── collaboration.js            # Existing — no changes needed
├── crypto-utils.js             # NEW — Web Crypto API wrapper (encrypt/decrypt/deriveKey)
├── cloud-connector.js          # NEW — Base class for cloud API integrations
├── connectors/
│   ├── azure-connector.js      # NEW — MSAL.js + Graph API + ARM
│   ├── aws-connector.js        # NEW — SigV4 + Edge Function proxy
│   └── gcp-connector.js        # NEW — Google Identity + Admin SDK
├── evidence-collector.js       # NEW — Automated evidence collection orchestrator
├── byos-manager.js             # NEW — BYOS setup, verification, upload routing
└── tenant-settings.js          # NEW — Org settings, member management, MFA enforcement

supabase/
├── migrations/
│   ├── 001-006                 # Existing
│   └── 007_cloud_connections.sql  # NEW — cloud_connections, evidence_storage_config, evidence_snapshots
└── functions/
    ├── scan-file/              # Existing
    └── cloud-proxy/            # NEW — Stateless AWS API proxy
        └── index.ts
```

---

## Appendix B: MSAL.js Integration Example

```javascript
// Azure AD / Entra ID OAuth flow for Graph API access
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: '<from-tenant-cloud-connection>',
        authority: 'https://login.microsoftonline.com/<tenant-id>',
        // For GCC High:
        // authority: 'https://login.microsoftonline.us/<tenant-id>',
        redirectUri: window.location.origin
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Request token for Graph API
async function getGraphToken() {
    const request = {
        scopes: ['User.Read.All', 'SecurityEvents.Read.All']
    };
    
    try {
        // Try silent token acquisition first
        const response = await msalInstance.acquireTokenSilent(request);
        return response.accessToken;
    } catch (e) {
        // Fall back to interactive
        const response = await msalInstance.acquireTokenPopup(request);
        return response.accessToken;
    }
}

// Call Graph API
async function getUsers() {
    const token = await getGraphToken();
    const response = await fetch('https://graph.microsoft.us/v1.0/users?$select=displayName,mail,accountEnabled', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}
```
