// Comprehensive Implementation Guidance - Part 4
// Final L1/L2 CMMC Assessment Objectives: RE, SA, SC, SI

const COMPREHENSIVE_GUIDANCE_PART4 = {
    objectives: {
        
        // Note: RE (Recovery) objectives are actually CP (Contingency Planning) in NIST 800-171
        // Using the correct control family numbering
        
        "CP.L2-3.12.1": {
            objective: "Establish and maintain baseline configurations and inventories of organizational systems throughout the respective system development life cycles.",
            summary: "Business continuity plan, disaster recovery, backup procedures",
            implementation: {
                general: { steps: ["Develop contingency plan", "Identify critical systems and data", "Define recovery time objectives (RTO) and recovery point objectives (RPO)", "Document backup procedures", "Establish alternate processing site", "Train personnel on contingency procedures", "Test plan annually"], effort_hours: 40 }
            },
            cloud: {
                aws: { services: ["Backup", "Disaster Recovery", "Route 53"], implementation: { steps: ["Use AWS Backup for automated backups", "Implement multi-region architecture", "Use Route 53 for DNS failover", "Document RTO/RPO requirements", "Test DR procedures quarterly", "Use AWS Elastic Disaster Recovery"], cost_estimate: "$200-2000/month", effort_hours: 24 }},
                azure: { services: ["Backup", "Site Recovery", "Traffic Manager"], implementation: { steps: ["Use Azure Backup for automated backups", "Implement Azure Site Recovery for DR", "Use Traffic Manager for failover", "Document RTO/RPO requirements", "Test DR procedures quarterly"], cost_estimate: "$200-1500/month", effort_hours: 24 }},
                gcp: { services: ["Cloud Backup", "Cloud DNS"], implementation: { steps: ["Use Cloud Backup for automated backups", "Implement multi-region architecture", "Use Cloud DNS for failover", "Document RTO/RPO requirements", "Test DR procedures quarterly"], cost_estimate: "$200-1500/month", effort_hours: 24 }}
            },
            small_business: { approach: "Use cloud backup service, document recovery procedures, test restoration quarterly, maintain offline backup copy", cost_estimate: "$100-500/month", effort_hours: 16 }
        }
        
        ,
        
        "CP.L2-3.12.2": {
            objective: "Perform backups of user-level and system-level information (including system state information) contained in organizational systems.",
            summary: "Daily backups, system state backups, test restoration",
            cloud: {
                aws: { services: ["Backup", "S3", "EBS Snapshots"], implementation: { steps: ["Use AWS Backup for automated daily backups", "Enable EBS snapshots", "Backup RDS databases daily", "Backup S3 with versioning", "Store backups in separate region", "Test restoration monthly"], cost_estimate: "$50-500/month", effort_hours: 12 }},
                azure: { services: ["Backup", "Recovery Services"], implementation: { steps: ["Use Azure Backup for VMs and databases", "Enable disk snapshots", "Backup Azure Files", "Store backups in separate region", "Test restoration monthly"], cost_estimate: "$50-400/month", effort_hours: 12 }},
                gcp: { services: ["Cloud Backup", "Persistent Disk Snapshots"], implementation: { steps: ["Use Cloud Backup for automated backups", "Enable disk snapshots", "Backup Cloud SQL databases", "Store backups in separate region", "Test restoration monthly"], cost_estimate: "$50-400/month", effort_hours: 12 }}
            },
            small_business: { approach: "Use cloud backup service (Backblaze, Carbonite), enable Windows Server Backup, test restoration monthly", cost_estimate: "$50-200/month", effort_hours: 8 }
        }
        
        ,
        
        "CP.L2-3.12.3": {
            objective: "Protect the confidentiality of backup CUI at storage locations.",
            summary: "Encrypt backups, secure storage, access controls",
            cloud: {
                aws: { implementation: { steps: ["Enable encryption for AWS Backup", "Use S3 encryption for backup storage", "Implement IAM policies to restrict backup access", "Enable MFA Delete on backup buckets", "Store backups in separate AWS account"], cost_estimate: "$0-50/month", effort_hours: 6 }},
                azure: { implementation: { steps: ["Enable encryption for Azure Backup", "Use RBAC to restrict backup access", "Enable soft delete for backups", "Store backups in separate subscription", "Enable MFA for backup deletion"], cost_estimate: "$0-50/month", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Enable encryption for Cloud Backup", "Use IAM to restrict backup access", "Store backups in separate project", "Use customer-managed encryption keys"], cost_estimate: "$0-50/month", effort_hours: 6 }}
            },
            small_business: { approach: "Use encrypted cloud backup, store local backups in locked cabinet, restrict backup access", cost_estimate: "$0", effort_hours: 4 }
        }
        
        ,
        
        "CP.L2-3.12.4": {
            objective: "Test backup information to verify media reliability and information integrity.",
            summary: "Quarterly restoration tests, verify backup integrity",
            implementation: {
                general: { steps: ["Test backup restoration quarterly", "Verify file integrity after restoration", "Document test results", "Test restoration of critical systems", "Measure restoration time", "Update procedures based on test results"], effort_hours: 8 }
            },
            cloud: {
                aws: { implementation: { steps: ["Perform quarterly restoration tests", "Use AWS Backup restore testing", "Verify data integrity", "Test cross-region restoration", "Document test results"], cost_estimate: "$10-100/test", effort_hours: 6 }},
                azure: { implementation: { steps: ["Perform quarterly restoration tests", "Use Azure Site Recovery test failover", "Verify data integrity", "Test cross-region restoration", "Document test results"], cost_estimate: "$10-100/test", effort_hours: 6 }},
                gcp: { implementation: { steps: ["Perform quarterly restoration tests", "Verify data integrity", "Test cross-region restoration", "Document test results"], cost_estimate: "$10-100/test", effort_hours: 6 }}
            },
            small_business: { approach: "Test backup restoration quarterly, verify critical files restore correctly, document test results", cost_estimate: "$0", effort_hours: 4 }
        }
        
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPREHENSIVE_GUIDANCE_PART4 };
}

if (typeof window !== 'undefined') {
    window.COMPREHENSIVE_GUIDANCE_PART4 = COMPREHENSIVE_GUIDANCE_PART4;
}
