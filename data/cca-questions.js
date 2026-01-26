// CMMC Lead CCA Assessor Questions
// Sample questions a Lead Certified CMMC Assessor would ask an Organization Seeking Certification (OSC)

const CCA_QUESTIONS = {
    // Access Control (AC) - Key objectives
    "3.1.1[a]": {
        questions: [
            "Can you show me the list of authorized users for systems processing CUI?",
            "How do you determine who is authorized to access CUI systems?",
            "Walk me through your user provisioning process for a new employee."
        ],
        evidenceRequests: ["User access list with authorization dates", "Access request and approval workflows", "HR onboarding procedures"]
    },
    "3.1.1[b]": {
        questions: ["How do you define processes authorized to act on behalf of users?", "What service accounts access CUI systems?"],
        evidenceRequests: ["Service account inventory", "Automated process documentation"]
    },
    "3.1.1[c]": {
        questions: ["What devices are authorized to connect to your CUI environment?", "How do you maintain an inventory of authorized devices?"],
        evidenceRequests: ["Device inventory/asset management records", "MDM enrollment list", "NAC logs"]
    },
    "3.1.1[d]": {
        questions: ["Show me how you limit system access to authorized users only.", "What technical controls prevent unauthorized access?"],
        evidenceRequests: ["Authentication system configuration", "Access control policy enforcement"]
    },
    "3.1.1[e]": {
        questions: ["How do you restrict access to only authorized processes?", "How do you prevent unauthorized scripts from accessing CUI?"],
        evidenceRequests: ["Application whitelisting configuration", "Service account permissions"]
    },
    "3.1.1[f]": {
        questions: ["How do you ensure only authorized devices can access CUI systems?", "Show me your device compliance policies."],
        evidenceRequests: ["Device compliance policy configuration", "Conditional access rules"]
    },
    "3.1.2[a]": {
        questions: ["How do you define what transactions each user is authorized to perform?", "Where is your RBAC documented?"],
        evidenceRequests: ["RBAC matrix or role definitions", "Job function to access mapping"]
    },
    "3.1.2[b]": {
        questions: ["Show me how you enforce authorized transactions.", "What prevents a user from performing unauthorized actions?"],
        evidenceRequests: ["Access control configuration", "Permission denied logs"]
    },
    "3.1.3[a]": {
        questions: ["How do you control the flow of CUI within your environment?", "Show me how you segment CUI from non-CUI systems."],
        evidenceRequests: ["Network segmentation diagrams", "Data flow diagrams for CUI", "DLP policies"]
    },
    "3.1.3[b]": {
        questions: ["What controls prevent CUI from leaving your authorized boundary?", "How do you monitor for unauthorized data exfiltration?"],
        evidenceRequests: ["Firewall egress rules", "DLP alerts and blocking evidence"]
    },
    "3.1.3[c]": {
        questions: ["What are the designated sources and destinations for CUI?", "How do you identify authorized CUI flow paths?"],
        evidenceRequests: ["CUI data flow documentation", "Authorized interconnection agreements"]
    },
    "3.1.3[d]": {
        questions: ["Who authorizes CUI flow between systems?", "Show me authorization records for CUI flows."],
        evidenceRequests: ["CUI flow authorization records", "Data sharing agreements"]
    },
    "3.1.3[e]": {
        questions: ["How do you technically enforce CUI flow authorizations?", "What prevents unauthorized CUI transfers?"],
        evidenceRequests: ["DLP enforcement configuration", "Network ACLs for CUI segments"]
    },
    "3.1.4[a]": {
        questions: ["What duties have you identified as requiring separation?", "Show me your separation of duties policy."],
        evidenceRequests: ["Separation of duties matrix", "Conflicting roles documentation"]
    },
    "3.1.4[b]": {
        questions: ["How are separated duties assigned to different individuals?", "Show me role assignments."],
        evidenceRequests: ["Role assignment records", "Organizational chart with separated duties"]
    },
    "3.1.4[c]": {
        questions: ["How do you ensure access privileges support separation of duties?", "Can the same person approve and execute transactions?"],
        evidenceRequests: ["Access privilege matrix", "Dual control configurations"]
    },
    "3.1.5[a]": {
        questions: ["What is your policy for least privilege?", "How do you identify privileged accounts?"],
        evidenceRequests: ["Least privilege policy", "Privileged account inventory"]
    },
    "3.1.5[b]": {
        questions: ["How do you authorize access to privileged accounts?", "Show me privileged access request process."],
        evidenceRequests: ["Privileged access request forms", "PAM solution configuration"]
    },
    "3.1.5[c]": {
        questions: ["What security functions have you identified?", "Show me your security function inventory."],
        evidenceRequests: ["Security function inventory", "Critical system function list"]
    },
    "3.1.5[d]": {
        questions: ["How do you authorize access to security functions?", "Who can modify security settings?"],
        evidenceRequests: ["Security function access list", "Admin role assignments"]
    },
    "3.1.6[a]": {
        questions: ["What are your nonsecurity functions?", "How do you identify nonsecurity functions?"],
        evidenceRequests: ["Nonsecurity function inventory", "Standard user activities list"]
    },
    "3.1.6[b]": {
        questions: ["Do users use non-privileged accounts for daily work?", "Show me that admins use separate accounts."],
        evidenceRequests: ["Separate admin/user account evidence", "Privileged access management logs"]
    },
    "3.1.7[a]": {
        questions: ["What privileged functions have you defined?", "Show me your privileged function inventory."],
        evidenceRequests: ["Privileged function list", "Admin capability documentation"]
    },
    "3.1.7[b]": {
        questions: ["How do you define non-privileged users?", "What distinguishes a standard user from privileged?"],
        evidenceRequests: ["User role definitions", "Non-privileged user criteria"]
    },
    "3.1.7[c]": {
        questions: ["How do you prevent non-privileged users from executing privileged functions?"],
        evidenceRequests: ["UAC or sudo configuration", "Failed privilege escalation logs"]
    },
    "3.1.7[d]": {
        questions: ["Do you capture the execution of privileged functions in audit logs?", "Show me audit logs capturing privileged actions."],
        evidenceRequests: ["Audit log samples", "SIEM alerts for privileged functions"]
    },
    "3.1.8[a]": {
        questions: ["How do you define means of limiting unsuccessful logon attempts?", "What is your lockout threshold?"],
        evidenceRequests: ["Account lockout policy", "Lockout threshold documentation"]
    },
    "3.1.8[b]": {
        questions: ["How do you implement the defined lockout mechanism?", "Show me lockout configuration."],
        evidenceRequests: ["Account lockout configuration screenshots", "Failed login attempt logs"]
    },
    "3.1.9[a]": {
        questions: ["What privacy and security notices do you display?", "How do you identify required CUI notices?"],
        evidenceRequests: ["CUI banner/notice policy", "CUI category marking requirements"]
    },
    "3.1.9[b]": {
        questions: ["Show me the privacy and security notices displayed on systems.", "Where are notices displayed?"],
        evidenceRequests: ["Login banner screenshots", "System warning message configuration"]
    },
    "3.1.10[a]": {
        questions: ["What is your defined period of inactivity for session lock?", "How did you determine this threshold?"],
        evidenceRequests: ["Session lock policy", "Inactivity timeout documentation"]
    },
    "3.1.10[b]": {
        questions: ["How do you implement session lock after inactivity?", "Show me the session lock configuration."],
        evidenceRequests: ["Screen lock policy configuration", "Group policy/MDM settings"]
    },
    "3.1.10[c]": {
        questions: ["How do you hide previously visible information after session lock?", "Show me the pattern-hiding display."],
        evidenceRequests: ["Screen saver configuration", "Lock screen settings"]
    },
    "3.1.11[a]": {
        questions: ["What conditions require session termination?", "When do you automatically terminate sessions?"],
        evidenceRequests: ["Session termination policy", "Defined termination conditions"]
    },
    "3.1.11[b]": {
        questions: ["How do you automatically terminate sessions?", "Show me session termination configuration."],
        evidenceRequests: ["Session timeout configuration", "Automatic logoff settings"]
    },
    "3.1.12[a]": {
        questions: ["Are remote access sessions permitted?", "What remote access methods are authorized?"],
        evidenceRequests: ["Remote access policy", "Approved remote access methods"]
    },
    "3.1.12[b]": {
        questions: ["What types of remote access are permitted?", "Show me your remote access types documentation."],
        evidenceRequests: ["Remote access types inventory", "Authorized connection methods"]
    },
    "3.1.12[c]": {
        questions: ["How do you control remote access sessions?", "What prevents unauthorized remote access?"],
        evidenceRequests: ["VPN configuration", "Remote access gateway logs"]
    },
    "3.1.12[d]": {
        questions: ["How do you monitor remote access sessions?", "Show me remote access monitoring."],
        evidenceRequests: ["Remote access monitoring logs", "VPN session audit trails"]
    },
    "3.1.13[a]": {
        questions: ["What cryptographic mechanisms protect remote access?", "Show me encryption configuration."],
        evidenceRequests: ["VPN encryption settings", "TLS configuration documentation"]
    },
    "3.1.13[b]": {
        questions: ["How do you implement encryption for remote access?", "Show me the encryption in use."],
        evidenceRequests: ["VPN cryptographic configuration", "Remote access encryption evidence"]
    },
    "3.1.14[a]": {
        questions: ["What are your managed access control points?", "Show me network access control points."],
        evidenceRequests: ["Network diagram with access control points", "VPN gateway inventory"]
    },
    "3.1.14[b]": {
        questions: ["How do you route remote access through managed points?", "Can users bypass access control points?"],
        evidenceRequests: ["Remote access routing configuration", "Split tunnel prevention"]
    },
    "3.1.15[a]": {
        questions: ["What privileged commands are authorized for remote execution?", "Show me authorized privileged remote commands."],
        evidenceRequests: ["Authorized privileged remote commands list", "Remote admin procedures"]
    },
    "3.1.15[b]": {
        questions: ["What security-relevant information can be accessed remotely?", "Show me authorization for remote security access."],
        evidenceRequests: ["Remote security information access list", "Authorized remote security functions"]
    },
    "3.1.15[c]": {
        questions: ["How do you authorize remote privileged command execution?", "Show me approval process."],
        evidenceRequests: ["Remote privileged access approval records", "Just-in-time admin access logs"]
    },
    "3.1.15[d]": {
        questions: ["How do you authorize remote access to security information?", "Who approves this access?"],
        evidenceRequests: ["Security information remote access approvals", "Remote admin session logs"]
    },
    "3.1.16[a]": {
        questions: ["What wireless access points exist in your environment?", "Show me your wireless infrastructure inventory."],
        evidenceRequests: ["Wireless access point inventory", "Wireless network documentation"]
    },
    "3.1.16[b]": {
        questions: ["How do you authorize wireless access?", "What is your wireless access approval process?"],
        evidenceRequests: ["Wireless access authorization process", "Wireless onboarding procedures"]
    },
    "3.1.17[a]": {
        questions: ["How do you protect wireless access using authentication?", "What wireless authentication do you use?"],
        evidenceRequests: ["Wireless authentication configuration (WPA2/WPA3-Enterprise)", "802.1X configuration"]
    },
    "3.1.17[b]": {
        questions: ["How do you protect wireless access using encryption?", "Show me wireless encryption settings."],
        evidenceRequests: ["Wireless encryption configuration", "AES encryption evidence"]
    },
    "3.1.18[a]": {
        questions: ["How do you control mobile device connections?", "What MDM solution do you use?"],
        evidenceRequests: ["MDM policy configuration", "Mobile device connection requirements"]
    },
    "3.1.18[b]": {
        questions: ["How do you encrypt CUI on mobile devices?", "Show me mobile encryption configuration."],
        evidenceRequests: ["Mobile device encryption policy", "Device encryption status reports"]
    },
    "3.1.19[a]": {
        questions: ["How do you encrypt CUI on mobile devices?", "What mobile encryption is used?"],
        evidenceRequests: ["Mobile device encryption configuration", "Full device encryption evidence"]
    },
    "3.1.20[a]": {
        questions: ["How do you verify and control external system connections?", "What external connections exist?"],
        evidenceRequests: ["External system connection inventory", "Interconnection security agreements"]
    },
    "3.1.20[b]": {
        questions: ["How do you control the use of external systems?", "What policies govern external system use?"],
        evidenceRequests: ["External system use policy", "Authorized external system list"]
    },
    "3.1.21[a]": {
        questions: ["How do you limit portable storage use?", "What is your USB policy?"],
        evidenceRequests: ["Portable storage policy", "USB device control configuration"]
    },
    "3.1.21[b]": {
        questions: ["How do you control CUI on portable storage?", "What encryption is required?"],
        evidenceRequests: ["Portable storage encryption requirements", "Approved encrypted USB list"]
    },
    "3.1.22[a]": {
        questions: ["How do you control CUI posted on publicly accessible systems?", "What review process exists?"],
        evidenceRequests: ["Public posting policy", "Content review procedures"]
    },

    // Awareness and Training (AT)
    "3.2.1[a]": {
        questions: ["How do you ensure managers are aware of security risks?", "What security training do managers receive?"],
        evidenceRequests: ["Manager security training curriculum", "Training completion records"]
    },
    "3.2.1[b]": {
        questions: ["How do you ensure users are aware of security policies?", "What training covers organizational policies?"],
        evidenceRequests: ["Security policy training materials", "User acknowledgment records"]
    },
    "3.2.2[a]": {
        questions: ["What role-based security training do you provide?", "How does training differ by role?"],
        evidenceRequests: ["Role-based training matrix", "Training curriculum by job function"]
    },
    "3.2.2[b]": {
        questions: ["How do you train users to recognize security threats?", "Show me phishing awareness training."],
        evidenceRequests: ["Security awareness training materials", "Phishing simulation results"]
    },
    "3.2.3[a]": {
        questions: ["Do you provide insider threat awareness training?", "What does the insider threat training cover?"],
        evidenceRequests: ["Insider threat training materials", "Training completion records"]
    },
    "3.2.3[b]": {
        questions: ["How do you recognize and report insider threats?", "What are the reporting procedures?"],
        evidenceRequests: ["Insider threat reporting procedures", "Indicator recognition training"]
    },

    // Audit and Accountability (AU)
    "3.3.1[a]": {
        questions: ["What events do you audit?", "Show me your audit event list."],
        evidenceRequests: ["Audit event categories", "Logging policy"]
    },
    "3.3.1[b]": {
        questions: ["What content is captured in audit records?", "Do logs include who, what, when, where?"],
        evidenceRequests: ["Audit log samples with full content", "Log field definitions"]
    },
    "3.3.2[a]": {
        questions: ["Can you trace actions to individual users?", "How do you ensure user accountability?"],
        evidenceRequests: ["User-attributed audit logs", "Individual accountability policy"]
    },
    "3.3.3[a]": {
        questions: ["Do you review and update audited events?", "How often do you reassess what to log?"],
        evidenceRequests: ["Audit event review process", "Logging policy updates"]
    },
    "3.3.4[a]": {
        questions: ["Do you alert on audit logging failures?", "What happens if logging stops?"],
        evidenceRequests: ["Audit failure alerting configuration", "Log health monitoring"]
    },
    "3.3.5[a]": {
        questions: ["How do you correlate audit information?", "Do you use a SIEM?"],
        evidenceRequests: ["SIEM correlation rules", "Cross-system log aggregation"]
    },
    "3.3.6[a]": {
        questions: ["How do you reduce audit records for analysis?", "What log summarization do you perform?"],
        evidenceRequests: ["Audit reduction tools", "Log analysis dashboards"]
    },
    "3.3.6[b]": {
        questions: ["How do you generate audit reports?", "Show me sample audit reports."],
        evidenceRequests: ["Audit report samples", "Reporting procedures"]
    },
    "3.3.7[a]": {
        questions: ["How do you synchronize system clocks?", "What time source do you use?"],
        evidenceRequests: ["NTP configuration", "Time synchronization settings"]
    },
    "3.3.8[a]": {
        questions: ["How do you protect audit information from unauthorized access?", "Who can access audit logs?"],
        evidenceRequests: ["Log access permissions", "Role-based access to logs"]
    },
    "3.3.8[b]": {
        questions: ["How do you protect audit logs from modification?", "Are logs immutable?"],
        evidenceRequests: ["Log integrity protection", "Write-once log storage"]
    },
    "3.3.9[a]": {
        questions: ["How do you limit audit log management to authorized individuals?", "Who can modify logging settings?"],
        evidenceRequests: ["Audit management access list", "SIEM admin role assignments"]
    },

    // Configuration Management (CM)
    "3.4.1[a]": {
        questions: ["Do you maintain baseline configurations?", "Show me your baseline documentation."],
        evidenceRequests: ["Baseline configuration documents", "Hardening standards"]
    },
    "3.4.1[b]": {
        questions: ["Do you maintain inventories of systems?", "Show me your asset inventory."],
        evidenceRequests: ["Asset inventory", "CMDB or inventory system"]
    },
    "3.4.2[a]": {
        questions: ["How do you establish security configuration settings?", "What standards do you follow (CIS, DISA STIGs)?"],
        evidenceRequests: ["Security configuration standards", "CIS/STIG implementation"]
    },
    "3.4.2[b]": {
        questions: ["How do you implement security configuration settings?", "Show me configuration deployment."],
        evidenceRequests: ["Configuration deployment evidence", "GPO or MDM policies"]
    },
    "3.4.2[c]": {
        questions: ["How do you enforce security configuration settings?", "What tools enforce configurations?"],
        evidenceRequests: ["Configuration enforcement tools", "Compliance scan results"]
    },
    "3.4.2[d]": {
        questions: ["How do you monitor security configuration settings?", "Show me configuration drift detection."],
        evidenceRequests: ["Configuration monitoring tools", "Drift alert evidence"]
    },
    "3.4.3[a]": {
        questions: ["How do you track changes to organizational systems?", "Show me your change management process."],
        evidenceRequests: ["Change management procedures", "Change request tickets"]
    },
    "3.4.3[b]": {
        questions: ["How do you analyze changes for security impact?", "Show me security impact assessments."],
        evidenceRequests: ["Security impact analysis process", "Change approval with security review"]
    },
    "3.4.4[a]": {
        questions: ["How do you analyze changes before implementation?", "What is your change analysis process?"],
        evidenceRequests: ["Pre-implementation change analysis", "Test environment validation"]
    },
    "3.4.5[a]": {
        questions: ["How do you define physical and logical access restrictions for changes?", "Who can make system changes?"],
        evidenceRequests: ["Change access restrictions policy", "Admin access for changes"]
    },
    "3.4.5[b]": {
        questions: ["How do you document access restrictions for changes?", "Show me change authorization records."],
        evidenceRequests: ["Change authorization documentation", "Access approval for changes"]
    },
    "3.4.5[c]": {
        questions: ["How do you approve access restrictions for changes?", "Who approves change access?"],
        evidenceRequests: ["Change access approval process", "CAB meeting minutes"]
    },
    "3.4.5[d]": {
        questions: ["How do you enforce access restrictions for changes?", "Show me technical enforcement."],
        evidenceRequests: ["Change management system access controls", "Deployment pipeline restrictions"]
    },
    "3.4.6[a]": {
        questions: ["Do you employ least functionality?", "How do you disable unnecessary functions?"],
        evidenceRequests: ["Least functionality policy", "Disabled services documentation"]
    },
    "3.4.6[b]": {
        questions: ["How do you prohibit unauthorized software?", "What software is prohibited?"],
        evidenceRequests: ["Prohibited software policy", "Software restriction policies"]
    },
    "3.4.7[a]": {
        questions: ["How do you restrict nonessential programs?", "What programs are restricted?"],
        evidenceRequests: ["Nonessential program restrictions", "Application control policies"]
    },
    "3.4.7[b]": {
        questions: ["How do you restrict nonessential functions?", "What functions are disabled?"],
        evidenceRequests: ["Function restriction evidence", "Disabled features list"]
    },
    "3.4.7[c]": {
        questions: ["How do you restrict nonessential ports?", "Show me port restriction configuration."],
        evidenceRequests: ["Port restriction policies", "Firewall rules for unused ports"]
    },
    "3.4.7[d]": {
        questions: ["How do you restrict nonessential protocols?", "What protocols are disabled?"],
        evidenceRequests: ["Protocol restriction configuration", "Disabled protocol list"]
    },
    "3.4.7[e]": {
        questions: ["How do you restrict nonessential services?", "What services are disabled?"],
        evidenceRequests: ["Service restriction configuration", "Disabled services list"]
    },
    "3.4.8[a]": {
        questions: ["How do you apply deny-by-exception for unauthorized software?", "What is your application whitelisting approach?"],
        evidenceRequests: ["Application whitelist policy", "Approved software list"]
    },
    "3.4.8[b]": {
        questions: ["How do you implement deny-by-exception technically?", "Show me application control."],
        evidenceRequests: ["Application control configuration", "AppLocker or equivalent"]
    },
    "3.4.9[a]": {
        questions: ["How do you control user-installed software?", "Can users install software?"],
        evidenceRequests: ["User software installation policy", "Local admin restrictions"]
    },

    // Identification and Authentication (IA)
    "3.5.1[a]": {
        questions: ["How do you identify system users?", "What identifiers are used?"],
        evidenceRequests: ["User identification policy", "Naming conventions"]
    },
    "3.5.1[b]": {
        questions: ["How do you identify processes acting on behalf of users?", "Show me service account identification."],
        evidenceRequests: ["Service account naming conventions", "Process identification standards"]
    },
    "3.5.1[c]": {
        questions: ["How do you identify devices?", "Show me device identification methods."],
        evidenceRequests: ["Device naming conventions", "Asset tagging procedures"]
    },
    "3.5.2[a]": {
        questions: ["How do you authenticate users?", "What authentication mechanisms do you use?"],
        evidenceRequests: ["Authentication mechanism documentation", "MFA configuration"]
    },
    "3.5.2[b]": {
        questions: ["How do you authenticate processes?", "Show me service account authentication."],
        evidenceRequests: ["Service account authentication", "API key management"]
    },
    "3.5.2[c]": {
        questions: ["How do you authenticate devices?", "Show me device authentication methods."],
        evidenceRequests: ["Device certificate authentication", "802.1X configuration"]
    },
    "3.5.3[a]": {
        questions: ["Do you use multi-factor authentication for local access?", "What MFA is required?"],
        evidenceRequests: ["MFA policy for local access", "MFA configuration screenshots"]
    },
    "3.5.3[b]": {
        questions: ["Do you use multi-factor authentication for network access?", "Show me network MFA configuration."],
        evidenceRequests: ["MFA policy for network access", "Conditional access MFA rules"]
    },
    "3.5.4[a]": {
        questions: ["Do you use replay-resistant authentication?", "What prevents replay attacks?"],
        evidenceRequests: ["Replay-resistant authentication mechanisms", "Challenge-response or token-based auth"]
    },
    "3.5.5[a]": {
        questions: ["How do you prevent identifier reuse?", "What is your identifier lifecycle?"],
        evidenceRequests: ["Identifier reuse prevention policy", "Unique identifier assignment"]
    },
    "3.5.6[a]": {
        questions: ["How do you disable identifiers after inactivity?", "What is your inactivity threshold?"],
        evidenceRequests: ["Inactive account policy", "Account disable automation"]
    },
    "3.5.7[a]": {
        questions: ["What is your minimum password complexity?", "Show me password policy configuration."],
        evidenceRequests: ["Password complexity policy", "Minimum length and character requirements"]
    },
    "3.5.7[b]": {
        questions: ["How do you enforce password complexity?", "Show me technical enforcement."],
        evidenceRequests: ["Password policy enforcement configuration", "AD/Azure AD password policy"]
    },
    "3.5.8[a]": {
        questions: ["How do you prohibit password reuse?", "How many passwords are remembered?"],
        evidenceRequests: ["Password history policy", "Reuse prevention configuration"]
    },
    "3.5.9[a]": {
        questions: ["Do you allow temporary passwords?", "How are temporary passwords handled?"],
        evidenceRequests: ["Temporary password policy", "First-login password change requirement"]
    },
    "3.5.10[a]": {
        questions: ["How do you store passwords?", "Are passwords encrypted or hashed?"],
        evidenceRequests: ["Password storage mechanism", "Hashing algorithm used"]
    },
    "3.5.10[b]": {
        questions: ["How do you transmit passwords securely?", "Is password transmission encrypted?"],
        evidenceRequests: ["Password transmission encryption", "TLS for authentication"]
    },
    "3.5.11[a]": {
        questions: ["Do you obscure passwords during entry?", "How are passwords masked?"],
        evidenceRequests: ["Password masking configuration", "UI password field settings"]
    },

    // Incident Response (IR)
    "3.6.1[a]": {
        questions: ["Do you have an incident response capability?", "Show me your incident response plan."],
        evidenceRequests: ["Incident response plan", "IR capability documentation"]
    },
    "3.6.1[b]": {
        questions: ["What preparation activities do you perform for incident response?", "How do you prepare for incidents?"],
        evidenceRequests: ["IR preparation procedures", "IR training records"]
    },
    "3.6.1[c]": {
        questions: ["How do you detect incidents?", "What detection mechanisms exist?"],
        evidenceRequests: ["Incident detection procedures", "SIEM alerting configuration"]
    },
    "3.6.1[d]": {
        questions: ["How do you analyze potential incidents?", "Show me your analysis process."],
        evidenceRequests: ["Incident analysis procedures", "Triage process documentation"]
    },
    "3.6.1[e]": {
        questions: ["How do you contain incidents?", "What containment strategies do you use?"],
        evidenceRequests: ["Containment procedures", "Isolation playbooks"]
    },
    "3.6.1[f]": {
        questions: ["How do you recover from incidents?", "Show me recovery procedures."],
        evidenceRequests: ["Recovery procedures", "System restoration documentation"]
    },
    "3.6.1[g]": {
        questions: ["What post-incident activities do you perform?", "Do you conduct lessons learned?"],
        evidenceRequests: ["Post-incident review process", "After-action reports"]
    },
    "3.6.2[a]": {
        questions: ["How do you track incidents?", "What ticketing system do you use?"],
        evidenceRequests: ["Incident tracking system", "Incident log/database"]
    },
    "3.6.2[b]": {
        questions: ["How do you document incidents?", "Show me incident documentation examples."],
        evidenceRequests: ["Incident documentation samples", "Incident report templates"]
    },
    "3.6.2[c]": {
        questions: ["How do you report incidents to authorities?", "What are your reporting obligations?"],
        evidenceRequests: ["Incident reporting procedures", "DIBCAC/DC3 reporting process"]
    },
    "3.6.3[a]": {
        questions: ["Do you test incident response capability?", "How often do you test?"],
        evidenceRequests: ["IR test plans", "Tabletop exercises", "After-action reports"]
    },

    // Maintenance (MA)
    "3.7.1[a]": {
        questions: ["How do you perform system maintenance?", "Show me maintenance procedures."],
        evidenceRequests: ["Maintenance procedures", "Maintenance schedules"]
    },
    "3.7.2[a]": {
        questions: ["How do you control maintenance tools?", "What tools are authorized for maintenance?"],
        evidenceRequests: ["Maintenance tool inventory", "Authorized tool list"]
    },
    "3.7.2[b]": {
        questions: ["How do you monitor maintenance tools?", "Do you audit tool usage?"],
        evidenceRequests: ["Maintenance tool usage logs", "Tool monitoring procedures"]
    },
    "3.7.2[c]": {
        questions: ["How do you maintain maintenance tools?", "Are tools kept up to date?"],
        evidenceRequests: ["Tool maintenance records", "Tool update procedures"]
    },
    "3.7.3[a]": {
        questions: ["How do you sanitize equipment for off-site maintenance?", "What is your equipment sanitization process?"],
        evidenceRequests: ["Equipment sanitization procedures", "Data removal before off-site repair"]
    },
    "3.7.4[a]": {
        questions: ["How do you check media with diagnostic programs?", "Do you scan maintenance media?"],
        evidenceRequests: ["Maintenance media scanning procedures", "Malware scan before use"]
    },
    "3.7.5[a]": {
        questions: ["Do you require MFA for remote maintenance?", "How is remote maintenance authenticated?"],
        evidenceRequests: ["Remote maintenance policy", "MFA configuration for remote access"]
    },
    "3.7.5[b]": {
        questions: ["How do you terminate remote maintenance sessions?", "Are sessions ended when complete?"],
        evidenceRequests: ["Session termination procedures", "Remote session audit logs"]
    },
    "3.7.6[a]": {
        questions: ["How do you supervise maintenance personnel without access?", "What supervision is provided?"],
        evidenceRequests: ["Maintenance personnel supervision policy", "Escort procedures for contractors"]
    },

    // Media Protection (MP)
    "3.8.1[a]": {
        questions: ["How do you protect paper media containing CUI?", "What physical protections exist?"],
        evidenceRequests: ["Media protection policy", "Physical storage controls"]
    },
    "3.8.1[b]": {
        questions: ["How do you protect digital media containing CUI?", "What digital media protections exist?"],
        evidenceRequests: ["Digital media protection policy", "Encryption for digital media"]
    },
    "3.8.2[a]": {
        questions: ["How do you limit access to CUI on media?", "Who can access CUI media?"],
        evidenceRequests: ["Media access control policy", "Authorized personnel list"]
    },
    "3.8.3[a]": {
        questions: ["How do you sanitize media before disposal?", "What sanitization methods do you use?"],
        evidenceRequests: ["Media sanitization procedures (NIST 800-88)", "Sanitization records"]
    },
    "3.8.3[b]": {
        questions: ["How do you sanitize media before reuse?", "What sanitization is performed?"],
        evidenceRequests: ["Media reuse sanitization procedures", "Sanitization verification"]
    },
    "3.8.4[a]": {
        questions: ["How do you mark media containing CUI?", "What CUI markings do you use?"],
        evidenceRequests: ["CUI marking policy", "Media marking examples"]
    },
    "3.8.5[a]": {
        questions: ["How do you control access to media containing CUI?", "What access controls exist?"],
        evidenceRequests: ["Media access controls", "Secure storage for CUI media"]
    },
    "3.8.5[b]": {
        questions: ["How do you maintain accountability for media during transport?", "How do you track media?"],
        evidenceRequests: ["Media transport tracking", "Chain of custody procedures"]
    },
    "3.8.6[a]": {
        questions: ["How do you implement cryptographic protection for portable storage?", "What encryption is used?"],
        evidenceRequests: ["Portable storage encryption policy", "BitLocker To Go or similar"]
    },
    "3.8.7[a]": {
        questions: ["How do you control removable media on systems?", "What removable media controls exist?"],
        evidenceRequests: ["Removable media policy", "USB device control configuration"]
    },
    "3.8.7[b]": {
        questions: ["How do you prohibit unauthorized removable media?", "What prevents unauthorized USB?"],
        evidenceRequests: ["USB blocking configuration", "Device control policies"]
    },
    "3.8.8[a]": {
        questions: ["How do you prohibit portable storage without owner?", "Can users take home storage devices?"],
        evidenceRequests: ["Portable storage policy", "Take-home restrictions"]
    },
    "3.8.9[a]": {
        questions: ["How do you protect backup CUI at storage locations?", "What backup storage protections exist?"],
        evidenceRequests: ["Backup protection policy", "Backup storage security"]
    },
    "3.8.9[b]": {
        questions: ["How do you protect backup CUI during transport?", "How are backups secured in transit?"],
        evidenceRequests: ["Backup transport encryption", "Secure backup transfer procedures"]
    },

    // Personnel Security (PS)
    "3.9.1[a]": {
        questions: ["Do you screen individuals before granting CUI access?", "What screening is performed?"],
        evidenceRequests: ["Personnel screening policy", "Background check procedures"]
    },
    "3.9.1[b]": {
        questions: ["Do you rescreen individuals periodically?", "How often are rescreening checks performed?"],
        evidenceRequests: ["Rescreening policy", "Periodic background check records"]
    },
    "3.9.2[a]": {
        questions: ["How do you protect CUI during personnel transfers?", "What actions occur during transfer?"],
        evidenceRequests: ["Transfer procedures", "Access modification records"]
    },
    "3.9.2[b]": {
        questions: ["How do you protect CUI during terminations?", "What is your termination process?"],
        evidenceRequests: ["Termination checklist", "Access revocation records"]
    },
    "3.9.2[c]": {
        questions: ["How do you retrieve CUI-related property on termination?", "What property is collected?"],
        evidenceRequests: ["Property return checklist", "Equipment return records"]
    },
    "3.9.2[d]": {
        questions: ["How do you revoke access on termination?", "How quickly is access removed?"],
        evidenceRequests: ["Access revocation procedures", "Termination access removal logs"]
    },

    // Physical Protection (PE)
    "3.10.1[a]": {
        questions: ["How do you limit physical access to authorized individuals?", "What physical access controls exist?"],
        evidenceRequests: ["Physical access policy", "Badge/key control system"]
    },
    "3.10.1[b]": {
        questions: ["How do you protect physical infrastructure?", "What protections exist for equipment?"],
        evidenceRequests: ["Infrastructure protection measures", "Equipment security"]
    },
    "3.10.2[a]": {
        questions: ["How do you protect physical access devices?", "What protects keys/badges?"],
        evidenceRequests: ["Physical access device policy", "Key/badge management procedures"]
    },
    "3.10.3[a]": {
        questions: ["Do you escort visitors?", "What is your visitor policy?"],
        evidenceRequests: ["Visitor policy", "Escort procedures", "Visitor logs"]
    },
    "3.10.3[b]": {
        questions: ["How do you monitor visitor activity?", "What visitor monitoring exists?"],
        evidenceRequests: ["Visitor monitoring procedures", "Visitor activity logs"]
    },
    "3.10.4[a]": {
        questions: ["How do you maintain audit logs of physical access?", "What physical access logs exist?"],
        evidenceRequests: ["Physical access audit logs", "Badge reader logs"]
    },
    "3.10.5[a]": {
        questions: ["How do you control physical access to output devices?", "Who can access printers/displays?"],
        evidenceRequests: ["Output device access policy", "Secure print configuration"]
    },
    "3.10.6[a]": {
        questions: ["How do you enforce safeguarding for alternate work sites?", "What controls exist for remote work?"],
        evidenceRequests: ["Remote work policy", "Home office requirements"]
    },

    // Risk Assessment (RA)
    "3.11.1[a]": {
        questions: ["Do you periodically assess risk?", "What is your risk assessment process?"],
        evidenceRequests: ["Risk assessment methodology", "Recent risk assessment results"]
    },
    "3.11.1[b]": {
        questions: ["How do you assess risk to operations?", "What operational risks are assessed?"],
        evidenceRequests: ["Operational risk assessment", "Business impact analysis"]
    },
    "3.11.1[c]": {
        questions: ["How do you assess risk to assets?", "What asset risks are assessed?"],
        evidenceRequests: ["Asset risk assessment", "Critical asset identification"]
    },
    "3.11.1[d]": {
        questions: ["How do you assess risk to individuals?", "What individual risks are assessed?"],
        evidenceRequests: ["Individual risk assessment", "Privacy impact assessment"]
    },
    "3.11.2[a]": {
        questions: ["How do you scan for vulnerabilities?", "What vulnerability scanning do you perform?"],
        evidenceRequests: ["Vulnerability scanning tools", "Recent scan reports"]
    },
    "3.11.2[b]": {
        questions: ["How often do you scan for vulnerabilities?", "What is your scan frequency?"],
        evidenceRequests: ["Vulnerability scan schedule", "Scan frequency documentation"]
    },
    "3.11.3[a]": {
        questions: ["How do you remediate vulnerabilities?", "What is your remediation process?"],
        evidenceRequests: ["Vulnerability remediation procedures", "Patch management process"]
    },
    "3.11.3[b]": {
        questions: ["How do you prioritize vulnerability remediation?", "What is your remediation timeline?"],
        evidenceRequests: ["Remediation prioritization criteria", "SLA for vulnerability fixes"]
    },

    // Security Assessment (CA)
    "3.12.1[a]": {
        questions: ["Do you periodically assess security controls?", "What is your assessment process?"],
        evidenceRequests: ["Security control assessment procedures", "Assessment results"]
    },
    "3.12.1[b]": {
        questions: ["How often do you assess security controls?", "What is your assessment frequency?"],
        evidenceRequests: ["Assessment schedule", "Annual assessment evidence"]
    },
    "3.12.2[a]": {
        questions: ["Do you have a plan of action and milestones (POA&M)?", "How do you track remediation?"],
        evidenceRequests: ["POA&M document", "Remediation tracking"]
    },
    "3.12.2[b]": {
        questions: ["How do you develop POA&M items?", "What goes into a POA&M entry?"],
        evidenceRequests: ["POA&M development procedures", "POA&M entry examples"]
    },
    "3.12.2[c]": {
        questions: ["How do you update POA&M items?", "How often is POA&M reviewed?"],
        evidenceRequests: ["POA&M update procedures", "POA&M review records"]
    },
    "3.12.3[a]": {
        questions: ["Do you monitor security controls continuously?", "What continuous monitoring do you perform?"],
        evidenceRequests: ["Continuous monitoring plan", "Monitoring dashboards"]
    },
    "3.12.4[a]": {
        questions: ["Do you have a system security plan (SSP)?", "Can I see your SSP?"],
        evidenceRequests: ["System Security Plan", "SSP document"]
    },
    "3.12.4[b]": {
        questions: ["Does your SSP describe boundaries?", "Show me boundary documentation in SSP."],
        evidenceRequests: ["SSP boundary section", "System boundary diagrams"]
    },
    "3.12.4[c]": {
        questions: ["Does your SSP describe system environment?", "What environment details are in SSP?"],
        evidenceRequests: ["SSP environment section", "System architecture"]
    },
    "3.12.4[d]": {
        questions: ["Does your SSP describe security requirements?", "What security requirements are documented?"],
        evidenceRequests: ["SSP security requirements section", "Control implementation statements"]
    },

    // System and Communications Protection (SC)
    "3.13.1[a]": {
        questions: ["How do you monitor communications at external boundaries?", "Show me boundary protection."],
        evidenceRequests: ["Firewall configurations", "IDS/IPS configurations"]
    },
    "3.13.1[b]": {
        questions: ["How do you monitor communications at key internal boundaries?", "What internal monitoring exists?"],
        evidenceRequests: ["Internal network segmentation", "Internal monitoring configuration"]
    },
    "3.13.2[a]": {
        questions: ["How do you employ architectural designs to promote security?", "What security architecture exists?"],
        evidenceRequests: ["Security architecture documentation", "Defense-in-depth design"]
    },
    "3.13.2[b]": {
        questions: ["How do you employ development techniques to promote security?", "What secure development practices exist?"],
        evidenceRequests: ["Secure development procedures", "SDLC security requirements"]
    },
    "3.13.2[c]": {
        questions: ["How do you employ operational principles to promote security?", "What security principles are applied?"],
        evidenceRequests: ["Security operational procedures", "Least privilege implementation"]
    },
    "3.13.3[a]": {
        questions: ["How do you separate user functionality from system management?", "Are admin functions separate?"],
        evidenceRequests: ["User/admin separation design", "Jump server or PAW configuration"]
    },
    "3.13.4[a]": {
        questions: ["How do you prevent unauthorized data transfer via shared resources?", "What shared resource controls exist?"],
        evidenceRequests: ["Shared resource controls", "Data isolation configuration"]
    },
    "3.13.5[a]": {
        questions: ["How do you implement subnetworks for publicly accessible systems?", "Show me DMZ configuration."],
        evidenceRequests: ["DMZ architecture", "Network diagrams"]
    },
    "3.13.6[a]": {
        questions: ["How do you deny network traffic by default?", "What is your default deny posture?"],
        evidenceRequests: ["Default deny firewall rules", "Implicit deny configuration"]
    },
    "3.13.6[b]": {
        questions: ["How do you allow only necessary traffic?", "What traffic is permitted?"],
        evidenceRequests: ["Allowed traffic documentation", "Firewall rule justification"]
    },
    "3.13.7[a]": {
        questions: ["How do you prevent split tunneling for remote devices?", "Is split tunneling blocked?"],
        evidenceRequests: ["Split tunnel prevention configuration", "VPN full tunnel settings"]
    },
    "3.13.8[a]": {
        questions: ["How do you implement cryptographic mechanisms to prevent unauthorized disclosure during transmission?"],
        evidenceRequests: ["TLS configuration", "Encryption in transit"]
    },
    "3.13.9[a]": {
        questions: ["How do you terminate network connections after inactivity?", "What is your connection timeout?"],
        evidenceRequests: ["Network connection timeout settings", "Session termination configuration"]
    },
    "3.13.10[a]": {
        questions: ["How do you establish cryptographic key management?", "What key management exists?"],
        evidenceRequests: ["Key management policy", "Key lifecycle procedures"]
    },
    "3.13.10[b]": {
        questions: ["How do you manage cryptographic keys?", "Show me key management implementation."],
        evidenceRequests: ["Key management system", "Key rotation procedures"]
    },
    "3.13.11[a]": {
        questions: ["Do you employ FIPS-validated cryptography?", "Show me FIPS compliance."],
        evidenceRequests: ["FIPS 140-2/140-3 validation certificates", "Cryptographic module documentation"]
    },
    "3.13.12[a]": {
        questions: ["How do you prohibit remote activation of collaborative devices?", "Can devices be remotely activated?"],
        evidenceRequests: ["Collaborative device policy", "Remote activation prevention"]
    },
    "3.13.12[b]": {
        questions: ["How do you provide indication of use for collaborative devices?", "Do users know when devices are active?"],
        evidenceRequests: ["Device activation indicators", "LED/audio indication configuration"]
    },
    "3.13.13[a]": {
        questions: ["How do you control mobile code?", "What mobile code restrictions exist?"],
        evidenceRequests: ["Mobile code policy", "JavaScript/ActiveX controls"]
    },
    "3.13.14[a]": {
        questions: ["How do you control VoIP technologies?", "What VoIP security controls exist?"],
        evidenceRequests: ["VoIP security policy", "Encrypted voice configuration"]
    },
    "3.13.15[a]": {
        questions: ["How do you protect communications sessions?", "What session protection exists?"],
        evidenceRequests: ["Session protection mechanisms", "TLS/SSL configuration"]
    },
    "3.13.16[a]": {
        questions: ["How do you protect CUI at rest?", "Show me encryption at rest."],
        evidenceRequests: ["Data at rest encryption", "BitLocker/encryption configuration"]
    },

    // System and Information Integrity (SI)
    "3.14.1[a]": {
        questions: ["How do you identify system flaws?", "What vulnerability identification do you perform?"],
        evidenceRequests: ["Vulnerability scanning", "Flaw identification process"]
    },
    "3.14.1[b]": {
        questions: ["How do you report system flaws?", "What is your reporting process?"],
        evidenceRequests: ["Flaw reporting procedures", "Vulnerability tickets"]
    },
    "3.14.1[c]": {
        questions: ["How do you correct system flaws?", "Show me your patching process."],
        evidenceRequests: ["Patch management procedures", "Remediation records"]
    },
    "3.14.2[a]": {
        questions: ["Do you provide malicious code protection at designated locations?", "Where is AV deployed?"],
        evidenceRequests: ["Antivirus/EDR deployment", "Protection point inventory"]
    },
    "3.14.2[b]": {
        questions: ["Do you update malicious code protection automatically?", "How often are updates applied?"],
        evidenceRequests: ["Auto-update configuration", "Update frequency settings"]
    },
    "3.14.2[c]": {
        questions: ["Do you perform real-time malware scanning?", "Is real-time protection enabled?"],
        evidenceRequests: ["Real-time scanning configuration", "On-access scan settings"]
    },
    "3.14.2[d]": {
        questions: ["Do you scan files from external sources?", "Are downloads scanned?"],
        evidenceRequests: ["Download scanning configuration", "Email attachment scanning"]
    },
    "3.14.2[e]": {
        questions: ["How do you respond to malware detection?", "What happens when malware is found?"],
        evidenceRequests: ["Malware response procedures", "Quarantine configuration"]
    },
    "3.14.3[a]": {
        questions: ["Do you monitor security alerts?", "What alerts do you track?"],
        evidenceRequests: ["Security alert monitoring", "Alert response procedures"]
    },
    "3.14.3[b]": {
        questions: ["Do you monitor security advisories?", "How do you stay informed?"],
        evidenceRequests: ["Security advisory monitoring", "Vendor alert subscriptions"]
    },
    "3.14.3[c]": {
        questions: ["Do you monitor security directives?", "What directives do you follow?"],
        evidenceRequests: ["Security directive tracking", "CISA/vendor directive compliance"]
    },
    "3.14.4[a]": {
        questions: ["Do you update malicious code protection mechanisms?", "How often are definitions updated?"],
        evidenceRequests: ["AV update configuration", "Update logs"]
    },
    "3.14.5[a]": {
        questions: ["Do you perform periodic scans?", "What is your scan schedule?"],
        evidenceRequests: ["Scan schedules", "Scan results"]
    },
    "3.14.5[b]": {
        questions: ["Do you perform real-time scans when files are accessed?", "Is on-access scanning enabled?"],
        evidenceRequests: ["Real-time scan configuration", "On-access scan settings"]
    },
    "3.14.6[a]": {
        questions: ["Do you monitor systems for attacks?", "What attack monitoring exists?"],
        evidenceRequests: ["Attack monitoring configuration", "IDS/IPS alerts"]
    },
    "3.14.6[b]": {
        questions: ["Do you monitor for indicators of compromise?", "What IOC monitoring exists?"],
        evidenceRequests: ["IOC monitoring", "Threat intelligence integration"]
    },
    "3.14.6[c]": {
        questions: ["Do you monitor for unauthorized connections?", "What connection monitoring exists?"],
        evidenceRequests: ["Connection monitoring", "Network flow analysis"]
    },
    "3.14.7[a]": {
        questions: ["How do you identify unauthorized use of systems?", "What constitutes unauthorized use?"],
        evidenceRequests: ["Unauthorized use definitions", "Detection mechanisms"]
    }
};

// Helper function to get CCA questions for an objective
function getCCAQuestions(objectiveId) {
    return CCA_QUESTIONS[objectiveId] || null;
}
