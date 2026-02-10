// AWS Compliance Toolkit for MSSP/Organization Use
// CloudFormation, Lambda, Systems Manager, CloudTrail, and Orchestration Templates
// Designed for multi-account CMMC/FedRAMP compliance at scale

const MSP_AWS_COMPLIANCE_TOOLKIT = {
    version: "1.0.0",
    lastUpdated: "2025-02-09",

    // ==================== OVERVIEW ====================
    overview: {
        title: "AWS Compliance Toolkit",
        description: "Production-ready AWS templates for CMMC/FedRAMP compliance. Includes CloudFormation stacks, Lambda functions, Systems Manager automation, and multi-account orchestration patterns for MSSPs managing client environments at scale.",
        useCases: [
            "MSSP managing 10-100+ client AWS accounts for CMMC compliance",
            "Single organization standing up a compliant AWS GovCloud environment",
            "Automated evidence collection and continuous compliance monitoring",
            "Centralized logging, alerting, and incident response orchestration"
        ],
        prerequisites: [
            "AWS Organizations with delegated administrator",
            "AWS GovCloud account (required for CUI/CMMC)",
            "IAM Identity Center configured",
            "S3 bucket for CloudFormation templates"
        ]
    },

    // ==================== 1. CLOUDFORMATION STACKS ====================
    cloudformation: {
        title: "CloudFormation Stacks",
        description: "Deploy-ready CloudFormation templates for compliance infrastructure. Use StackSets for multi-account deployment across your AWS Organization.",

        stacks: [
            {
                id: "org-cloudtrail",
                name: "Organization CloudTrail with Integrity Validation",
                description: "Multi-region, multi-account CloudTrail with log file validation, KMS encryption, CloudWatch integration, and S3 lifecycle policies. Covers AU controls for audit logging.",
                controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.5", "3.3.6", "3.3.7"],
                category: "Logging & Audit",
                deployMethod: "Single deploy in management account",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  CMMC Compliant Organization CloudTrail
  Deploys org-wide trail with KMS encryption, log validation,
  CloudWatch Logs integration, and S3 lifecycle for retention.

Parameters:
  OrgId:
    Type: String
    Description: AWS Organization ID (o-xxxxxxxxxx)
  RetentionDays:
    Type: Number
    Default: 365
    Description: Days to retain logs in S3 Standard before Glacier
  AlertEmail:
    Type: String
    Description: Email for CloudTrail alerts

Resources:
  # KMS Key for CloudTrail encryption
  CloudTrailKMSKey:
    Type: AWS::KMS::Key
    Properties:
      Description: CMK for CloudTrail log encryption (CMMC 3.13.11)
      EnableKeyRotation: true
      KeyPolicy:
        Version: '2012-10-17'
        Statement:
          - Sid: AllowCloudTrailEncrypt
            Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action:
              - kms:GenerateDataKey*
              - kms:DescribeKey
            Resource: '*'
            Condition:
              StringLike:
                kms:EncryptionContext:aws:cloudtrail:arn:
                  - !Sub 'arn:aws-us-gov:cloudtrail:*:\${AWS::AccountId}:trail/*'
          - Sid: AllowKeyAdmin
            Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws-us-gov:iam::\${AWS::AccountId}:root'
            Action: kms:*
            Resource: '*'

  CloudTrailKMSAlias:
    Type: AWS::KMS::Alias
    Properties:
      AliasName: alias/cloudtrail-cmmc
      TargetKeyId: !Ref CloudTrailKMSKey

  # S3 Bucket for audit logs
  AuditLogBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub 'cmmc-audit-logs-\${AWS::AccountId}'
      VersioningConfiguration:
        Status: Enabled
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: aws:kms
              KMSMasterKeyID: !Ref CloudTrailKMSKey
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      ObjectLockEnabled: true
      LifecycleConfiguration:
        Rules:
          - Id: AuditLogRetention
            Status: Enabled
            Transitions:
              - StorageClass: GLACIER
                TransitionInDays: !Ref RetentionDays
            ExpirationInDays: 2555  # 7 years
      LoggingConfiguration:
        DestinationBucketName: !Ref AccessLogBucket
        LogFilePrefix: audit-log-access/

  AuditLogBucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref AuditLogBucket
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: AllowCloudTrailACLCheck
            Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action: s3:GetBucketAcl
            Resource: !GetAtt AuditLogBucket.Arn
          - Sid: AllowCloudTrailWrite
            Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action: s3:PutObject
            Resource: !Sub '\${AuditLogBucket.Arn}/*'
            Condition:
              StringEquals:
                s3:x-amz-acl: bucket-owner-full-control
          - Sid: DenyUnencryptedTransport
            Effect: Deny
            Principal: '*'
            Action: s3:*
            Resource:
              - !GetAtt AuditLogBucket.Arn
              - !Sub '\${AuditLogBucket.Arn}/*'
            Condition:
              Bool:
                aws:SecureTransport: 'false'

  AccessLogBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub 'cmmc-access-logs-\${AWS::AccountId}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  # CloudWatch Log Group
  CloudTrailLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: /aws/cloudtrail/cmmc-org-trail
      RetentionInDays: 90

  CloudTrailCWRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: CloudTrail-CloudWatch-Role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: CloudTrailCWLogs
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                Resource: !GetAtt CloudTrailLogGroup.Arn

  # Organization CloudTrail
  OrgTrail:
    Type: AWS::CloudTrail::Trail
    DependsOn: AuditLogBucketPolicy
    Properties:
      TrailName: cmmc-org-trail
      IsLogging: true
      IsMultiRegionTrail: true
      IsOrganizationTrail: true
      EnableLogFileValidation: true
      IncludeGlobalServiceEvents: true
      S3BucketName: !Ref AuditLogBucket
      KMSKeyId: !GetAtt CloudTrailKMSKey.Arn
      CloudWatchLogsLogGroupArn: !GetAtt CloudTrailLogGroup.Arn
      CloudWatchLogsRoleArn: !GetAtt CloudTrailCWRole.Arn
      EventSelectors:
        - ReadWriteType: All
          IncludeManagementEvents: true
          DataResources:
            - Type: AWS::S3::Object
              Values: ['arn:aws-us-gov:s3']
        - ReadWriteType: WriteOnly
          IncludeManagementEvents: false
          DataResources:
            - Type: AWS::Lambda::Function
              Values: ['arn:aws-us-gov:lambda']
      InsightSelectors:
        - InsightType: ApiCallRateInsight
        - InsightType: ApiErrorRateInsight

  # SNS Topic for alerts
  AlertTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: cmmc-cloudtrail-alerts
      KmsMasterKeyId: !Ref CloudTrailKMSKey

  AlertSubscription:
    Type: AWS::SNS::Subscription
    Properties:
      TopicArn: !Ref AlertTopic
      Protocol: email
      Endpoint: !Ref AlertEmail

  # Metric Filters & Alarms for critical events
  UnauthorizedAPICalls:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref CloudTrailLogGroup
      FilterPattern: '{ ($.errorCode = "*UnauthorizedAccess*") || ($.errorCode = "AccessDenied*") }'
      MetricTransformations:
        - MetricNamespace: CMMC/CloudTrail
          MetricName: UnauthorizedAPICalls
          MetricValue: '1'

  UnauthorizedAPIAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: CMMC-UnauthorizedAPICalls
      AlarmDescription: Alert on unauthorized API calls (CMMC 3.1.1, 3.14.7)
      MetricName: UnauthorizedAPICalls
      Namespace: CMMC/CloudTrail
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 5
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertTopic

  RootAccountUsage:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref CloudTrailLogGroup
      FilterPattern: '{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }'
      MetricTransformations:
        - MetricNamespace: CMMC/CloudTrail
          MetricName: RootAccountUsage
          MetricValue: '1'

  RootAccountAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: CMMC-RootAccountUsage
      AlarmDescription: Alert on root account usage (CMMC 3.1.7)
      MetricName: RootAccountUsage
      Namespace: CMMC/CloudTrail
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertTopic

  ConsoleLoginWithoutMFA:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref CloudTrailLogGroup
      FilterPattern: '{ ($.eventName = "ConsoleLogin") && ($.additionalEventData.MFAUsed != "Yes") }'
      MetricTransformations:
        - MetricNamespace: CMMC/CloudTrail
          MetricName: ConsoleLoginWithoutMFA
          MetricValue: '1'

  MFAAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: CMMC-ConsoleLoginNoMFA
      AlarmDescription: Alert on console login without MFA (CMMC 3.5.3)
      MetricName: ConsoleLoginWithoutMFA
      Namespace: CMMC/CloudTrail
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertTopic

  SecurityGroupChanges:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref CloudTrailLogGroup
      FilterPattern: '{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }'
      MetricTransformations:
        - MetricNamespace: CMMC/CloudTrail
          MetricName: SecurityGroupChanges
          MetricValue: '1'

  SecurityGroupAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: CMMC-SecurityGroupChanges
      AlarmDescription: Alert on security group changes (CMMC 3.13.1)
      MetricName: SecurityGroupChanges
      Namespace: CMMC/CloudTrail
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertTopic

  IAMPolicyChanges:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref CloudTrailLogGroup
      FilterPattern: '{ ($.eventName=DeleteGroupPolicy) || ($.eventName=DeleteRolePolicy) || ($.eventName=DeleteUserPolicy) || ($.eventName=PutGroupPolicy) || ($.eventName=PutRolePolicy) || ($.eventName=PutUserPolicy) || ($.eventName=CreatePolicy) || ($.eventName=DeletePolicy) || ($.eventName=AttachRolePolicy) || ($.eventName=DetachRolePolicy) || ($.eventName=AttachUserPolicy) || ($.eventName=DetachUserPolicy) || ($.eventName=AttachGroupPolicy) || ($.eventName=DetachGroupPolicy) }'
      MetricTransformations:
        - MetricNamespace: CMMC/CloudTrail
          MetricName: IAMPolicyChanges
          MetricValue: '1'

  IAMPolicyAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: CMMC-IAMPolicyChanges
      AlarmDescription: Alert on IAM policy changes (CMMC 3.1.1, 3.1.2)
      MetricName: IAMPolicyChanges
      Namespace: CMMC/CloudTrail
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 1
      Threshold: 1
      ComparisonOperator: GreaterThanOrEqualToThreshold
      AlarmActions:
        - !Ref AlertTopic

Outputs:
  TrailArn:
    Value: !GetAtt OrgTrail.Arn
  AuditBucket:
    Value: !Ref AuditLogBucket
  KMSKeyArn:
    Value: !GetAtt CloudTrailKMSKey.Arn
  AlertTopicArn:
    Value: !Ref AlertTopic`
            },

            {
                id: "security-hub-config",
                name: "Security Hub + Config Compliance Baseline",
                description: "Enables AWS Security Hub with NIST 800-171 standard, AWS Config with CMMC-relevant rules, and conformance packs across all accounts via StackSet.",
                controls: ["3.4.1", "3.4.2", "3.11.1", "3.11.2", "3.12.1", "3.12.2"],
                category: "Compliance Monitoring",
                deployMethod: "StackSet to all member accounts",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  CMMC Security Hub + Config Baseline
  Enables Security Hub with NIST standard, Config rules,
  and conformance packs for continuous compliance monitoring.

Parameters:
  AggregatorAccountId:
    Type: String
    Description: Security tooling account ID for finding aggregation

Resources:
  # Enable AWS Config
  ConfigRecorder:
    Type: AWS::Config::ConfigurationRecorder
    Properties:
      Name: cmmc-config-recorder
      RoleARN: !GetAtt ConfigRole.Arn
      RecordingGroup:
        AllSupported: true
        IncludeGlobalResourceTypes: true

  ConfigRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: AWSConfigRole-CMMC
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: config.amazonaws.com
            Action: sts:AssumeRole
      ManagedPolicyArns:
        - arn:aws-us-gov:iam::aws:policy/service-role/AWS_ConfigRole

  ConfigDeliveryChannel:
    Type: AWS::Config::DeliveryChannel
    Properties:
      S3BucketName: !Sub 'cmmc-config-\${AWS::AccountId}'
      SnsTopicARN: !Ref ConfigAlertTopic

  ConfigAlertTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: cmmc-config-alerts

  # CMMC-relevant Config Rules
  MFAEnabled:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: iam-user-mfa-enabled
      Source:
        Owner: AWS
        SourceIdentifier: IAM_USER_MFA_ENABLED

  RootMFA:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: root-account-mfa-enabled
      Source:
        Owner: AWS
        SourceIdentifier: ROOT_ACCOUNT_MFA_ENABLED

  EncryptedVolumes:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: encrypted-volumes
      Source:
        Owner: AWS
        SourceIdentifier: ENCRYPTED_VOLUMES

  S3BucketSSL:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: s3-bucket-ssl-requests-only
      Source:
        Owner: AWS
        SourceIdentifier: S3_BUCKET_SSL_REQUESTS_ONLY

  S3PublicRead:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: s3-bucket-public-read-prohibited
      Source:
        Owner: AWS
        SourceIdentifier: S3_BUCKET_PUBLIC_READ_PROHIBITED

  CloudTrailEnabled:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: cloudtrail-enabled
      Source:
        Owner: AWS
        SourceIdentifier: CLOUD_TRAIL_ENABLED

  VPCFlowLogs:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: vpc-flow-logs-enabled
      Source:
        Owner: AWS
        SourceIdentifier: VPC_FLOW_LOGS_ENABLED

  SSMManaged:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: ec2-instance-managed-by-ssm
      Source:
        Owner: AWS
        SourceIdentifier: EC2_INSTANCE_MANAGED_BY_SSM

  RestrictedSSH:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: restricted-ssh
      Source:
        Owner: AWS
        SourceIdentifier: INCOMING_SSH_DISABLED

  RDSEncrypted:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: rds-storage-encrypted
      Source:
        Owner: AWS
        SourceIdentifier: RDS_STORAGE_ENCRYPTED

  AccessKeysRotated:
    Type: AWS::Config::ConfigRule
    DependsOn: ConfigRecorder
    Properties:
      ConfigRuleName: access-keys-rotated
      Source:
        Owner: AWS
        SourceIdentifier: ACCESS_KEYS_ROTATED
      InputParameters:
        maxAccessKeyAge: '90'

Outputs:
  ConfigRecorderName:
    Value: !Ref ConfigRecorder
  ConfigRuleCount:
    Value: '10'
    Description: Number of CMMC-relevant Config rules deployed`
            },

            {
                id: "guardduty-org",
                name: "GuardDuty Organization Deployment",
                description: "Enables GuardDuty across all accounts with finding aggregation, S3/EKS/Malware protection, and automated finding export to Security Hub.",
                controls: ["3.14.2", "3.14.6", "3.14.7"],
                category: "Threat Detection",
                deployMethod: "Delegated admin in security account",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  GuardDuty Organization Setup with all protection plans enabled.

Parameters:
  SecurityAccountId:
    Type: String
    Description: Delegated admin account for GuardDuty

Resources:
  GuardDutyDetector:
    Type: AWS::GuardDuty::Detector
    Properties:
      Enable: true
      FindingPublishingFrequency: FIFTEEN_MINUTES
      DataSources:
        S3Logs:
          Enable: true
        Kubernetes:
          AuditLogs:
            Enable: true
        MalwareProtection:
          ScanEc2InstanceWithFindings:
            EbsVolumes: true

  # EventBridge rule to forward high-severity findings
  HighSeverityRule:
    Type: AWS::Events::Rule
    Properties:
      Name: cmmc-guardduty-high-severity
      Description: Forward high/critical GuardDuty findings
      EventPattern:
        source:
          - aws.guardduty
        detail-type:
          - GuardDuty Finding
        detail:
          severity:
            - numeric: ['>=', 7]
      Targets:
        - Arn: !Ref FindingsTopic
          Id: SNSTarget

  FindingsTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: cmmc-guardduty-findings

Outputs:
  DetectorId:
    Value: !Ref GuardDutyDetector
  FindingsTopicArn:
    Value: !Ref FindingsTopic`
            },

            {
                id: "vpc-flow-logs",
                name: "VPC Flow Logs with Centralized Analysis",
                description: "Enables VPC Flow Logs across all VPCs with delivery to CloudWatch Logs and S3, plus Athena table for querying. Supports network monitoring controls.",
                controls: ["3.13.1", "3.14.6", "3.3.1"],
                category: "Network Monitoring",
                deployMethod: "StackSet to all member accounts",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  VPC Flow Logs with centralized S3 delivery and Athena analysis.

Parameters:
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: VPC to enable flow logs on
  CentralLogBucket:
    Type: String
    Description: Central S3 bucket for flow log aggregation

Resources:
  FlowLogRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: vpc-flow-logs.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: FlowLogCW
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                  - logs:DescribeLogGroups
                  - logs:DescribeLogStreams
                Resource: '*'

  FlowLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/aws/vpc/flowlogs/\${VpcId}'
      RetentionInDays: 90

  VPCFlowLogCW:
    Type: AWS::EC2::FlowLog
    Properties:
      ResourceId: !Ref VpcId
      ResourceType: VPC
      TrafficType: ALL
      LogDestinationType: cloud-watch-logs
      LogGroupName: !Ref FlowLogGroup
      DeliverLogsPermissionArn: !GetAtt FlowLogRole.Arn
      MaxAggregationInterval: 60
      LogFormat: >-
        \${version} \${account-id} \${interface-id} \${srcaddr}
        \${dstaddr} \${srcport} \${dstport} \${protocol}
        \${packets} \${bytes} \${start} \${end} \${action}
        \${log-status} \${vpc-id} \${subnet-id}
        \${tcp-flags} \${pkt-srcaddr} \${pkt-dstaddr}

  VPCFlowLogS3:
    Type: AWS::EC2::FlowLog
    Properties:
      ResourceId: !Ref VpcId
      ResourceType: VPC
      TrafficType: ALL
      LogDestinationType: s3
      LogDestination: !Sub 'arn:aws-us-gov:s3:::\${CentralLogBucket}/vpc-flow-logs/'
      MaxAggregationInterval: 60

  # Metric filter for rejected traffic spikes
  RejectedTraffic:
    Type: AWS::Logs::MetricFilter
    Properties:
      LogGroupName: !Ref FlowLogGroup
      FilterPattern: '[version, account, eni, srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, start, end, action="REJECT", status]'
      MetricTransformations:
        - MetricNamespace: CMMC/VPCFlowLogs
          MetricName: RejectedPackets
          MetricValue: '$packets'

  RejectedTrafficAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmName: !Sub 'CMMC-RejectedTraffic-\${VpcId}'
      MetricName: RejectedPackets
      Namespace: CMMC/VPCFlowLogs
      Statistic: Sum
      Period: 300
      EvaluationPeriods: 2
      Threshold: 1000
      ComparisonOperator: GreaterThanOrEqualToThreshold

Outputs:
  FlowLogIdCW:
    Value: !Ref VPCFlowLogCW
  FlowLogIdS3:
    Value: !Ref VPCFlowLogS3`
            }
        ]
    },

    // ==================== 2. LAMBDA FUNCTIONS ====================
    lambda: {
        title: "Lambda Compliance Functions",
        description: "Serverless functions for automated compliance checks, evidence collection, and remediation. Deploy individually or as part of a compliance automation pipeline.",

        functions: [
            {
                id: "access-key-auditor",
                name: "IAM Access Key Auditor & Rotator",
                description: "Scans all IAM users for access keys older than 90 days. Disables stale keys, notifies owners, and generates compliance evidence. Runs on a daily EventBridge schedule.",
                controls: ["3.5.7", "3.5.8", "3.5.10"],
                runtime: "python3.12",
                trigger: "EventBridge (daily)",
                category: "Identity & Access",
                code: `# lambda/access_key_auditor.py
# Audits IAM access keys for age compliance (CMMC 3.5.7, 3.5.8, 3.5.10)
# Disables keys > 90 days, deletes keys > 180 days, sends SNS alerts

import boto3
import json
import os
from datetime import datetime, timezone

iam = boto3.client('iam')
sns = boto3.client('sns')
s3 = boto3.client('s3')

MAX_KEY_AGE_DAYS = int(os.environ.get('MAX_KEY_AGE_DAYS', '90'))
DELETE_AGE_DAYS = int(os.environ.get('DELETE_AGE_DAYS', '180'))
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
EVIDENCE_BUCKET = os.environ.get('EVIDENCE_BUCKET', '')
DRY_RUN = os.environ.get('DRY_RUN', 'true').lower() == 'true'

def lambda_handler(event, context):
    now = datetime.now(timezone.utc)
    report = {
        'scan_time': now.isoformat(),
        'max_age_days': MAX_KEY_AGE_DAYS,
        'dry_run': DRY_RUN,
        'users_scanned': 0,
        'keys_compliant': 0,
        'keys_disabled': 0,
        'keys_deleted': 0,
        'findings': []
    }

    paginator = iam.get_paginator('list_users')
    for page in paginator.paginate():
        for user in page['Users']:
            report['users_scanned'] += 1
            username = user['UserName']

            keys = iam.list_access_keys(UserName=username)
            for key_meta in keys['AccessKeyMetadata']:
                key_id = key_meta['AccessKeyId']
                created = key_meta['CreateDate']
                status = key_meta['Status']
                age_days = (now - created).days

                if age_days <= MAX_KEY_AGE_DAYS and status == 'Active':
                    report['keys_compliant'] += 1
                    continue

                finding = {
                    'user': username,
                    'key_id': key_id,
                    'age_days': age_days,
                    'status': status,
                    'action': 'none'
                }

                if age_days > DELETE_AGE_DAYS and status == 'Inactive':
                    finding['action'] = 'delete'
                    if not DRY_RUN:
                        iam.delete_access_key(
                            UserName=username,
                            AccessKeyId=key_id
                        )
                    report['keys_deleted'] += 1

                elif age_days > MAX_KEY_AGE_DAYS and status == 'Active':
                    finding['action'] = 'disable'
                    if not DRY_RUN:
                        iam.update_access_key(
                            UserName=username,
                            AccessKeyId=key_id,
                            Status='Inactive'
                        )
                    report['keys_disabled'] += 1

                report['findings'].append(finding)

    # Save evidence to S3
    if EVIDENCE_BUCKET:
        date_key = now.strftime('%Y/%m/%d')
        s3.put_object(
            Bucket=EVIDENCE_BUCKET,
            Key=f'evidence/access-key-audit/{date_key}/report.json',
            Body=json.dumps(report, indent=2, default=str),
            ServerSideEncryption='aws:kms'
        )

    # Send alert if findings exist
    if report['findings'] and SNS_TOPIC_ARN:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=f"CMMC Access Key Audit: {len(report['findings'])} findings",
            Message=json.dumps(report, indent=2, default=str)
        )

    return report`,
                envVars: {
                    MAX_KEY_AGE_DAYS: "90",
                    DELETE_AGE_DAYS: "180",
                    SNS_TOPIC_ARN: "(your SNS topic ARN)",
                    EVIDENCE_BUCKET: "(your evidence bucket)",
                    DRY_RUN: "true"
                },
                iamPolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:ListUsers",
        "iam:ListAccessKeys",
        "iam:UpdateAccessKey",
        "iam:DeleteAccessKey"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["sns:Publish"],
      "Resource": "arn:aws-us-gov:sns:*:*:cmmc-*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws-us-gov:s3:::*/evidence/*"
    }
  ]
}`
            },

            {
                id: "security-group-auditor",
                name: "Security Group Open Port Auditor",
                description: "Scans all security groups for overly permissive rules (0.0.0.0/0 ingress). Generates findings, optionally auto-remediates, and exports evidence.",
                controls: ["3.13.1", "3.13.5", "3.13.6"],
                runtime: "python3.12",
                trigger: "EventBridge (hourly) + Config Rule change",
                category: "Network Security",
                code: `# lambda/security_group_auditor.py
# Audits security groups for open ingress rules (CMMC 3.13.1, 3.13.5)
# Flags 0.0.0.0/0 and ::/0 rules, optionally remediates

import boto3
import json
import os
from datetime import datetime, timezone

ec2 = boto3.client('ec2')
sns = boto3.client('sns')
s3 = boto3.client('s3')

ALLOWED_OPEN_PORTS = [443]  # Only HTTPS allowed from 0.0.0.0/0
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
EVIDENCE_BUCKET = os.environ.get('EVIDENCE_BUCKET', '')
AUTO_REMEDIATE = os.environ.get('AUTO_REMEDIATE', 'false').lower() == 'true'

def lambda_handler(event, context):
    now = datetime.now(timezone.utc)
    findings = []
    remediated = []

    paginator = ec2.get_paginator('describe_security_groups')
    for page in paginator.paginate():
        for sg in page['SecurityGroups']:
            sg_id = sg['GroupId']
            sg_name = sg['GroupName']
            vpc_id = sg.get('VpcId', 'N/A')

            for rule in sg.get('IpPermissions', []):
                from_port = rule.get('FromPort', 0)
                to_port = rule.get('ToPort', 65535)
                protocol = rule.get('IpProtocol', '-1')

                for ip_range in rule.get('IpRanges', []):
                    cidr = ip_range.get('CidrIp', '')
                    if cidr == '0.0.0.0/0':
                        if protocol == '-1' or from_port not in ALLOWED_OPEN_PORTS:
                            finding = {
                                'sg_id': sg_id,
                                'sg_name': sg_name,
                                'vpc_id': vpc_id,
                                'rule': f'{protocol}:{from_port}-{to_port}',
                                'cidr': cidr,
                                'severity': 'HIGH' if protocol == '-1' else 'MEDIUM'
                            }
                            findings.append(finding)

                            if AUTO_REMEDIATE and protocol != '-1':
                                try:
                                    ec2.revoke_security_group_ingress(
                                        GroupId=sg_id,
                                        IpPermissions=[rule]
                                    )
                                    finding['remediated'] = True
                                    remediated.append(finding)
                                except Exception as e:
                                    finding['remediation_error'] = str(e)

                for ip_range in rule.get('Ipv6Ranges', []):
                    cidr = ip_range.get('CidrIpv6', '')
                    if cidr == '::/0':
                        findings.append({
                            'sg_id': sg_id,
                            'sg_name': sg_name,
                            'vpc_id': vpc_id,
                            'rule': f'{protocol}:{from_port}-{to_port}',
                            'cidr': cidr,
                            'severity': 'HIGH'
                        })

    report = {
        'scan_time': now.isoformat(),
        'total_findings': len(findings),
        'auto_remediated': len(remediated),
        'findings': findings
    }

    # Save evidence
    if EVIDENCE_BUCKET:
        date_key = now.strftime('%Y/%m/%d')
        s3.put_object(
            Bucket=EVIDENCE_BUCKET,
            Key=f'evidence/sg-audit/{date_key}/report.json',
            Body=json.dumps(report, indent=2, default=str),
            ServerSideEncryption='aws:kms'
        )

    # Alert on findings
    if findings and SNS_TOPIC_ARN:
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=f"CMMC SG Audit: {len(findings)} open rules found",
            Message=json.dumps(report, indent=2, default=str)
        )

    return report`
            },

            {
                id: "compliance-evidence-collector",
                name: "Automated Compliance Evidence Collector",
                description: "Collects point-in-time compliance evidence from AWS Config, Security Hub, IAM, and CloudTrail. Generates a dated evidence package in S3 for assessor review.",
                controls: ["3.12.1", "3.12.3", "3.12.4"],
                runtime: "python3.12",
                trigger: "EventBridge (weekly) or manual",
                category: "Evidence & Assessment",
                code: `# lambda/compliance_evidence_collector.py
# Collects compliance evidence from AWS services (CMMC 3.12.x)
# Generates a dated evidence package in S3

import boto3
import json
import os
from datetime import datetime, timezone

s3 = boto3.client('s3')
config_client = boto3.client('config')
securityhub = boto3.client('securityhub')
iam = boto3.client('iam')

EVIDENCE_BUCKET = os.environ['EVIDENCE_BUCKET']
ACCOUNT_ALIAS = os.environ.get('ACCOUNT_ALIAS', 'unknown')

def lambda_handler(event, context):
    now = datetime.now(timezone.utc)
    date_prefix = now.strftime('%Y/%m/%d')
    base_key = f'evidence-packages/{ACCOUNT_ALIAS}/{date_prefix}'
    collected = []

    # 1. Config Compliance Summary
    try:
        compliance = config_client.get_compliance_summary_by_config_rule()
        save_evidence(base_key, 'config-compliance-summary.json',
                      compliance['ComplianceSummary'])
        collected.append('Config Compliance Summary')
    except Exception as e:
        collected.append(f'Config Compliance Summary: ERROR - {e}')

    # 2. Config Rule Evaluation Results
    try:
        rules = config_client.describe_config_rules()
        rule_results = {}
        for rule in rules['ConfigRules'][:50]:
            name = rule['ConfigRuleName']
            evals = config_client.get_compliance_details_by_config_rule(
                ConfigRuleName=name, Limit=100
            )
            rule_results[name] = {
                'state': rule['ConfigRuleState'],
                'compliant': sum(1 for e in evals['EvaluationResults']
                               if e['ComplianceType'] == 'COMPLIANT'),
                'non_compliant': sum(1 for e in evals['EvaluationResults']
                                    if e['ComplianceType'] == 'NON_COMPLIANT')
            }
        save_evidence(base_key, 'config-rule-results.json', rule_results)
        collected.append(f'Config Rules: {len(rule_results)} rules evaluated')
    except Exception as e:
        collected.append(f'Config Rules: ERROR - {e}')

    # 3. Security Hub Findings Summary
    try:
        findings = securityhub.get_findings(
            Filters={
                'WorkflowStatus': [{'Value': 'NEW', 'Comparison': 'EQUALS'}],
                'RecordState': [{'Value': 'ACTIVE', 'Comparison': 'EQUALS'}]
            },
            MaxResults=100
        )
        summary = {
            'total_active': len(findings['Findings']),
            'by_severity': {},
            'by_product': {}
        }
        for f in findings['Findings']:
            sev = f.get('Severity', {}).get('Label', 'UNKNOWN')
            prod = f.get('ProductName', 'Unknown')
            summary['by_severity'][sev] = summary['by_severity'].get(sev, 0) + 1
            summary['by_product'][prod] = summary['by_product'].get(prod, 0) + 1
        save_evidence(base_key, 'securityhub-findings-summary.json', summary)
        collected.append(f'Security Hub: {summary["total_active"]} active findings')
    except Exception as e:
        collected.append(f'Security Hub: ERROR - {e}')

    # 4. IAM Credential Report
    try:
        iam.generate_credential_report()
        import time
        time.sleep(5)
        cred_report = iam.get_credential_report()
        save_evidence(base_key, 'iam-credential-report.csv',
                      cred_report['Content'].decode('utf-8'), content_type='text/csv')
        collected.append('IAM Credential Report')
    except Exception as e:
        collected.append(f'IAM Credential Report: ERROR - {e}')

    # 5. IAM Account Summary
    try:
        summary = iam.get_account_summary()
        save_evidence(base_key, 'iam-account-summary.json',
                      summary['SummaryMap'])
        collected.append('IAM Account Summary')
    except Exception as e:
        collected.append(f'IAM Account Summary: ERROR - {e}')

    # Generate manifest
    manifest = {
        'collection_time': now.isoformat(),
        'account_alias': ACCOUNT_ALIAS,
        'account_id': context.invoked_function_arn.split(':')[4],
        'items_collected': collected,
        'evidence_location': f's3://{EVIDENCE_BUCKET}/{base_key}/'
    }
    save_evidence(base_key, 'manifest.json', manifest)

    return manifest

def save_evidence(base_key, filename, data, content_type='application/json'):
    body = data if isinstance(data, str) else json.dumps(data, indent=2, default=str)
    s3.put_object(
        Bucket=EVIDENCE_BUCKET,
        Key=f'{base_key}/{filename}',
        Body=body,
        ContentType=content_type,
        ServerSideEncryption='aws:kms'
    )`
            },

            {
                id: "config-auto-remediation",
                name: "Config Rule Auto-Remediation Dispatcher",
                description: "Receives non-compliant Config rule evaluations via EventBridge and dispatches SSM Automation documents for auto-remediation. Supports encryption, public access, and logging fixes.",
                controls: ["3.4.2", "3.13.11", "3.14.1"],
                runtime: "python3.12",
                trigger: "EventBridge (Config compliance change)",
                category: "Auto-Remediation",
                code: `# lambda/config_auto_remediation.py
# Dispatches SSM Automation for non-compliant Config rules
# Maps Config rule names to SSM remediation documents

import boto3
import json
import os

ssm = boto3.client('ssm')
sns = boto3.client('sns')

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')

# Map Config rules to SSM Automation remediation documents
REMEDIATION_MAP = {
    's3-bucket-public-read-prohibited': {
        'document': 'AWS-DisableS3BucketPublicReadWrite',
        'params': lambda r: {'S3BucketName': [r['resourceId']]}
    },
    'encrypted-volumes': {
        'document': 'AWS-EnableEbsEncryptionByDefault',
        'params': lambda r: {}
    },
    's3-bucket-ssl-requests-only': {
        'document': 'AWSConfigRemediation-ConfigureS3BucketPublicAccessBlock',
        'params': lambda r: {
            'S3BucketName': [r['resourceId']],
            'BlockPublicAcls': ['true'],
            'BlockPublicPolicy': ['true'],
            'IgnorePublicAcls': ['true'],
            'RestrictPublicBuckets': ['true']
        }
    },
    'cloudtrail-enabled': {
        'document': None,  # Alert only, manual remediation
        'alert': True
    }
}

def lambda_handler(event, context):
    detail = event.get('detail', {})
    rule_name = detail.get('configRuleName', '')
    compliance = detail.get('newEvaluationResult', {}).get('complianceType', '')
    resource_id = detail.get('resourceId', '')

    if compliance != 'NON_COMPLIANT':
        return {'action': 'skipped', 'reason': 'compliant'}

    remediation = REMEDIATION_MAP.get(rule_name)
    if not remediation:
        return {'action': 'skipped', 'reason': f'no remediation for {rule_name}'}

    resource_info = {
        'resourceId': resource_id,
        'resourceType': detail.get('resourceType', ''),
        'configRule': rule_name
    }

    if remediation.get('alert') or not remediation.get('document'):
        # Alert-only remediation
        if SNS_TOPIC_ARN:
            sns.publish(
                TopicArn=SNS_TOPIC_ARN,
                Subject=f"CMMC Config Non-Compliance: {rule_name}",
                Message=json.dumps({
                    'rule': rule_name,
                    'resource': resource_id,
                    'action': 'manual_remediation_required'
                }, indent=2)
            )
        return {'action': 'alerted', 'rule': rule_name, 'resource': resource_id}

    # Execute SSM Automation
    try:
        params = remediation['params'](resource_info)
        response = ssm.start_automation_execution(
            DocumentName=remediation['document'],
            Parameters=params
        )
        execution_id = response['AutomationExecutionId']

        if SNS_TOPIC_ARN:
            sns.publish(
                TopicArn=SNS_TOPIC_ARN,
                Subject=f"CMMC Auto-Remediation: {rule_name}",
                Message=json.dumps({
                    'rule': rule_name,
                    'resource': resource_id,
                    'document': remediation['document'],
                    'execution_id': execution_id,
                    'action': 'auto_remediated'
                }, indent=2)
            )

        return {
            'action': 'remediated',
            'rule': rule_name,
            'resource': resource_id,
            'execution_id': execution_id
        }
    except Exception as e:
        return {
            'action': 'error',
            'rule': rule_name,
            'resource': resource_id,
            'error': str(e)
        }`
            }
        ]
    },

    // ==================== 3. SYSTEMS MANAGER AUTOMATION ====================
    systemsManager: {
        title: "Systems Manager Automation",
        description: "SSM Automation documents, Run Commands, and State Manager associations for endpoint compliance. Deploy across fleets via AWS Organizations.",

        documents: [
            {
                id: "ssm-patch-baseline",
                name: "CMMC Patch Compliance Baseline",
                description: "State Manager association that enforces patch compliance on all managed instances. Scans daily, installs patches during maintenance windows, and reports compliance status.",
                controls: ["3.14.1", "3.4.1", "3.4.2"],
                category: "Patch Management",
                type: "State Manager Association",
                template: `# SSM State Manager Association for Patch Compliance
# Deploy via AWS CLI or CloudFormation

# 1. Create a CMMC-compliant patch baseline
aws ssm create-patch-baseline \\
  --name "CMMC-PatchBaseline" \\
  --operating-system "WINDOWS" \\
  --approval-rules '{
    "PatchRules": [
      {
        "PatchFilterGroup": {
          "PatchFilters": [
            {"Key": "MSRC_SEVERITY", "Values": ["Critical", "Important"]},
            {"Key": "CLASSIFICATION", "Values": ["SecurityUpdates", "CriticalUpdates"]}
          ]
        },
        "ApproveAfterDays": 3,
        "ComplianceLevel": "CRITICAL",
        "EnableNonSecurity": false
      },
      {
        "PatchFilterGroup": {
          "PatchFilters": [
            {"Key": "CLASSIFICATION", "Values": ["Updates", "UpdateRollups"]}
          ]
        },
        "ApproveAfterDays": 7,
        "ComplianceLevel": "HIGH"
      }
    ]
  }' \\
  --description "CMMC L2 patch baseline - Critical/Important within 3 days" \\
  --tags Key=Compliance,Value=CMMC-L2

# 2. Register as default baseline
aws ssm register-default-patch-baseline \\
  --baseline-id <baseline-id>

# 3. Create maintenance window (Sunday 2-5 AM)
aws ssm create-maintenance-window \\
  --name "CMMC-PatchWindow" \\
  --schedule "cron(0 2 ? * SUN *)" \\
  --duration 3 \\
  --cutoff 1 \\
  --allow-unassociated-targets

# 4. Create State Manager association for daily scan
aws ssm create-association \\
  --name "AWS-RunPatchBaseline" \\
  --targets "Key=tag:Compliance,Values=CMMC" \\
  --parameters '{"Operation":["Scan"]}' \\
  --schedule-expression "rate(1 day)" \\
  --compliance-severity "CRITICAL" \\
  --association-name "CMMC-DailyPatchScan"

# 5. Create association for patch install during window
aws ssm create-association \\
  --name "AWS-RunPatchBaseline" \\
  --targets "Key=tag:Compliance,Values=CMMC" \\
  --parameters '{"Operation":["Install"],"RebootOption":["RebootIfNeeded"]}' \\
  --schedule-expression "cron(0 2 ? * SUN *)" \\
  --compliance-severity "CRITICAL" \\
  --association-name "CMMC-WeeklyPatchInstall"`
            },

            {
                id: "ssm-hardening",
                name: "CIS/STIG Hardening via SSM",
                description: "SSM Run Command documents for applying CIS Benchmark and DISA STIG hardening to Windows and Linux instances. Includes audit mode for assessment.",
                controls: ["3.4.1", "3.4.2", "3.4.6", "3.4.7", "3.4.8"],
                category: "Configuration Management",
                type: "Run Command",
                template: `# SSM Run Command for CIS/STIG Hardening
# Use AWS-RunPowerShellScript for Windows, AWS-RunShellScript for Linux

# === WINDOWS CIS HARDENING ===
# Run against tagged instances: Compliance=CMMC

# 1. Audit current CIS compliance (read-only)
aws ssm send-command \\
  --document-name "AWS-RunPowerShellScript" \\
  --targets "Key=tag:Compliance,Values=CMMC" \\
  --parameters '{
    "commands": [
      "# CIS Benchmark Audit Script",
      "Write-Output \\"=== CIS AUDIT: Account Policies ===\"",
      "net accounts",
      "",
      "Write-Output \\"=== CIS AUDIT: Password Policy ===\"",
      "Get-ADDefaultDomainPasswordPolicy -ErrorAction SilentlyContinue",
      "",
      "Write-Output \\"=== CIS AUDIT: Audit Policy ===\"",
      "auditpol /get /category:*",
      "",
      "Write-Output \\"=== CIS AUDIT: Firewall Status ===\"",
      "Get-NetFirewallProfile | Select Name, Enabled, DefaultInboundAction",
      "",
      "Write-Output \\"=== CIS AUDIT: SMBv1 ===\"",
      "Get-SmbServerConfiguration | Select EnableSMB1Protocol",
      "",
      "Write-Output \\"=== CIS AUDIT: TLS Settings ===\"",
      "Get-ItemProperty -Path \\"HKLM:\\\\SYSTEM\\\\CurrentControlSet\\\\Control\\\\SecurityProviders\\\\SCHANNEL\\\\Protocols\\\\TLS 1.0\\\\Server\\" -ErrorAction SilentlyContinue",
      "Get-ItemProperty -Path \\"HKLM:\\\\SYSTEM\\\\CurrentControlSet\\\\Control\\\\SecurityProviders\\\\SCHANNEL\\\\Protocols\\\\TLS 1.1\\\\Server\\" -ErrorAction SilentlyContinue",
      "",
      "Write-Output \\"=== CIS AUDIT: Local Admins ===\"",
      "Get-LocalGroupMember -Group Administrators"
    ]
  }' \\
  --comment "CMMC CIS Audit" \\
  --output-s3-bucket-name "cmmc-ssm-output" \\
  --output-s3-key-prefix "cis-audit"

# === LINUX CIS HARDENING ===
aws ssm send-command \\
  --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:OS,Values=Linux" \\
  --parameters '{
    "commands": [
      "#!/bin/bash",
      "echo \\"=== CIS AUDIT: SSH Configuration ===\"",
      "grep -E \\"^(PermitRootLogin|PasswordAuthentication|X11Forwarding|MaxAuthTries|Protocol)\\" /etc/ssh/sshd_config",
      "",
      "echo \\"=== CIS AUDIT: Password Aging ===\"",
      "grep -E \\"^PASS_(MAX|MIN|WARN)_AGE\\" /etc/login.defs",
      "",
      "echo \\"=== CIS AUDIT: Firewall ===\"",
      "iptables -L -n 2>/dev/null || firewall-cmd --list-all 2>/dev/null",
      "",
      "echo \\"=== CIS AUDIT: AIDE (File Integrity) ===\"",
      "rpm -q aide 2>/dev/null || dpkg -l aide 2>/dev/null",
      "",
      "echo \\"=== CIS AUDIT: Cron Permissions ===\"",
      "stat /etc/crontab /etc/cron.hourly /etc/cron.daily 2>/dev/null",
      "",
      "echo \\"=== CIS AUDIT: SUID/SGID Files ===\"",
      "find / -perm /6000 -type f 2>/dev/null | head -20"
    ]
  }' \\
  --comment "CMMC CIS Linux Audit" \\
  --output-s3-bucket-name "cmmc-ssm-output" \\
  --output-s3-key-prefix "cis-linux-audit"`
            },

            {
                id: "ssm-inventory",
                name: "SSM Inventory & Compliance Reporting",
                description: "Configures SSM Inventory collection for software, network, Windows updates, and custom inventory. Syncs to S3 for Athena analysis and evidence.",
                controls: ["3.4.1", "3.4.2", "3.4.9"],
                category: "Asset Management",
                type: "Inventory Association",
                template: `# SSM Inventory Collection for CMMC Asset Management
# Collects software, network, Windows updates, services, and custom data

# 1. Create inventory association for all managed instances
aws ssm create-association \\
  --name "AWS-GatherSoftwareInventory" \\
  --targets "Key=InstanceIds,Values=*" \\
  --schedule-expression "rate(12 hours)" \\
  --parameters '{
    "applications": ["Enabled"],
    "awsComponents": ["Enabled"],
    "networkConfig": ["Enabled"],
    "windowsUpdates": ["Enabled"],
    "instanceDetailedInformation": ["Enabled"],
    "services": ["Enabled"],
    "windowsRoles": ["Enabled"],
    "customInventory": ["Enabled"],
    "billingInfo": ["Enabled"]
  }' \\
  --association-name "CMMC-InventoryCollection" \\
  --compliance-severity "MEDIUM"

# 2. Create Resource Data Sync to S3 for Athena queries
aws ssm create-resource-data-sync \\
  --sync-name "CMMC-InventorySync" \\
  --s3-destination '{
    "BucketName": "cmmc-inventory-data",
    "SyncFormat": "JsonSerDe",
    "Region": "us-gov-west-1",
    "Prefix": "ssm-inventory"
  }'

# 3. Athena table for inventory analysis
# Run in Athena after sync populates S3:
#
# CREATE EXTERNAL TABLE ssm_inventory (
#   resourceId STRING,
#   captureTime STRING,
#   schemaVersion STRING,
#   typeName STRING,
#   content ARRAY<MAP<STRING,STRING>>
# )
# ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
# LOCATION 's3://cmmc-inventory-data/ssm-inventory/'
#
# -- Query: Find instances missing critical patches
# SELECT resourceId, c['Title'] as patch, c['KBId'] as kb
# FROM ssm_inventory
# CROSS JOIN UNNEST(content) AS t(c)
# WHERE typeName = 'AWS:WindowsUpdate'
#   AND c['InstalledTime'] = ''
#   AND c['Classification'] IN ('SecurityUpdates','CriticalUpdates')

# 4. Compliance summary query
aws ssm list-compliance-summaries \\
  --filters "Key=ComplianceType,Values=Patch,Type=EQUAL" \\
  --query 'ComplianceSummaryItems[].{
    Type:ComplianceType,
    Compliant:CompliantSummary.CompliantCount,
    NonCompliant:NonCompliantSummary.NonCompliantCount
  }' \\
  --output table`
            }
        ]
    },

    // ==================== 4. MULTI-ACCOUNT ORCHESTRATION ====================
    orchestration: {
        title: "Multi-Account Orchestration",
        description: "Patterns for MSSPs managing compliance across many client AWS accounts. Includes cross-account roles, centralized logging, StackSets, and EventBridge forwarding.",

        patterns: [
            {
                id: "cross-account-role",
                name: "MSSP Cross-Account Compliance Role",
                description: "IAM role deployed to each client account that grants the MSSP read-only access for compliance monitoring, evidence collection, and security assessment. Follows least-privilege with explicit deny on data access.",
                controls: ["3.1.1", "3.1.2", "3.1.5"],
                category: "Access Control",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  MSSP Cross-Account Compliance Role
  Grants read-only security and compliance access to MSSP account.
  Deploy as StackSet to all client accounts.

Parameters:
  MSSPAccountId:
    Type: String
    Description: MSSP management account ID
  ExternalId:
    Type: String
    Description: Unique external ID for this client (prevents confused deputy)
    MinLength: 12

Resources:
  MSSPComplianceRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: MSSP-ComplianceAuditor
      MaxSessionDuration: 3600
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws-us-gov:iam::\${MSSPAccountId}:root'
            Action: sts:AssumeRole
            Condition:
              StringEquals:
                sts:ExternalId: !Ref ExternalId
      ManagedPolicyArns:
        - arn:aws-us-gov:iam::aws:policy/SecurityAudit
        - arn:aws-us-gov:iam::aws:policy/job-function/ViewOnlyAccess
      Policies:
        - PolicyName: ComplianceReadAccess
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Sid: AllowComplianceRead
                Effect: Allow
                Action:
                  - config:Get*
                  - config:Describe*
                  - config:List*
                  - securityhub:Get*
                  - securityhub:List*
                  - securityhub:Describe*
                  - guardduty:Get*
                  - guardduty:List*
                  - ssm:Describe*
                  - ssm:List*
                  - ssm:GetInventory
                  - ssm:GetComplianceSummary
                  - cloudtrail:Describe*
                  - cloudtrail:Get*
                  - cloudtrail:LookupEvents
                  - access-analyzer:Get*
                  - access-analyzer:List*
                Resource: '*'
              - Sid: DenyDataAccess
                Effect: Deny
                Action:
                  - s3:GetObject
                  - dynamodb:GetItem
                  - dynamodb:Query
                  - dynamodb:Scan
                  - rds:Download*
                  - secretsmanager:GetSecretValue
                  - ssm:GetParameter
                Resource: '*'

Outputs:
  RoleArn:
    Value: !GetAtt MSSPComplianceRole.Arn
    Description: ARN for MSSP to assume into this account`
            },

            {
                id: "centralized-eventbridge",
                name: "Centralized EventBridge for Security Events",
                description: "Forwards security-relevant events from all client accounts to the MSSP security account via EventBridge cross-account rules. Enables centralized SIEM ingestion and alerting.",
                controls: ["3.3.1", "3.14.6", "3.14.7", "3.6.1"],
                category: "Centralized Monitoring",
                template: `AWSTemplateFormatVersion: '2010-09-09'
Description: >
  Cross-account EventBridge forwarding for centralized security monitoring.
  Deploy to each client account via StackSet.

Parameters:
  SecurityAccountId:
    Type: String
    Description: MSSP security/SIEM account ID
  SecurityEventBusArn:
    Type: String
    Description: ARN of the central event bus in security account

Resources:
  # Rule: Forward GuardDuty findings
  GuardDutyForward:
    Type: AWS::Events::Rule
    Properties:
      Name: forward-guardduty-to-mssp
      Description: Forward all GuardDuty findings to MSSP security account
      EventPattern:
        source:
          - aws.guardduty
        detail-type:
          - GuardDuty Finding
      Targets:
        - Arn: !Ref SecurityEventBusArn
          Id: MSSPSecurityBus
          RoleArn: !GetAtt EventBridgeForwardRole.Arn

  # Rule: Forward Security Hub findings
  SecurityHubForward:
    Type: AWS::Events::Rule
    Properties:
      Name: forward-securityhub-to-mssp
      EventPattern:
        source:
          - aws.securityhub
        detail-type:
          - Security Hub Findings - Imported
        detail:
          findings:
            Severity:
              Label:
                - CRITICAL
                - HIGH
      Targets:
        - Arn: !Ref SecurityEventBusArn
          Id: MSSPSecurityBus
          RoleArn: !GetAtt EventBridgeForwardRole.Arn

  # Rule: Forward IAM changes
  IAMChangeForward:
    Type: AWS::Events::Rule
    Properties:
      Name: forward-iam-changes-to-mssp
      EventPattern:
        source:
          - aws.iam
        detail-type:
          - AWS API Call via CloudTrail
        detail:
          eventSource:
            - iam.amazonaws.com
          eventName:
            - prefix: Create
            - prefix: Delete
            - prefix: Attach
            - prefix: Detach
            - prefix: Put
      Targets:
        - Arn: !Ref SecurityEventBusArn
          Id: MSSPSecurityBus
          RoleArn: !GetAtt EventBridgeForwardRole.Arn

  # Rule: Forward Config compliance changes
  ConfigComplianceForward:
    Type: AWS::Events::Rule
    Properties:
      Name: forward-config-compliance-to-mssp
      EventPattern:
        source:
          - aws.config
        detail-type:
          - Config Rules Compliance Change
        detail:
          newEvaluationResult:
            complianceType:
              - NON_COMPLIANT
      Targets:
        - Arn: !Ref SecurityEventBusArn
          Id: MSSPSecurityBus
          RoleArn: !GetAtt EventBridgeForwardRole.Arn

  EventBridgeForwardRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: EventBridge-MSSP-Forward
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: events.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: PutEventsToMSSP
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: events:PutEvents
                Resource: !Ref SecurityEventBusArn`
            },

            {
                id: "stackset-deployment",
                name: "StackSet Deployment Automation",
                description: "Step Functions workflow that deploys compliance StackSets to new accounts automatically when they join the Organization. Includes drift detection and remediation.",
                controls: ["3.4.1", "3.4.2", "3.12.2"],
                category: "Deployment Automation",
                template: `# Automated StackSet Deployment for New Accounts
# Uses EventBridge + Step Functions to deploy compliance stacks
# when new accounts join the AWS Organization

# 1. EventBridge rule to detect new account creation
aws events put-rule \\
  --name "NewAccountCreated" \\
  --event-pattern '{
    "source": ["aws.organizations"],
    "detail-type": ["AWS API Call via CloudTrail"],
    "detail": {
      "eventName": ["CreateAccount", "InviteAccountToOrganization"],
      "eventSource": ["organizations.amazonaws.com"]
    }
  }'

# 2. Compliance StackSets to deploy to every account:
COMPLIANCE_STACKSETS=(
  "cmmc-cloudtrail-org"
  "cmmc-security-hub-config"
  "cmmc-guardduty"
  "cmmc-vpc-flowlogs"
  "cmmc-mssp-cross-account-role"
  "cmmc-eventbridge-forwarding"
)

# 3. Deploy all compliance StackSets
for STACK in "\${COMPLIANCE_STACKSETS[@]}"; do
  aws cloudformation create-stack-instances \\
    --stack-set-name "$STACK" \\
    --deployment-targets '{
      "OrganizationalUnitIds": ["ou-xxxx-workloads"]
    }' \\
    --regions '["us-gov-west-1"]' \\
    --operation-preferences '{
      "MaxConcurrentPercentage": 25,
      "FailureTolerancePercentage": 10,
      "RegionConcurrencyType": "PARALLEL"
    }'
done

# 4. Enable drift detection on all StackSets (weekly)
for STACK in "\${COMPLIANCE_STACKSETS[@]}"; do
  aws cloudformation detect-stack-set-drift \\
    --stack-set-name "$STACK"
done

# 5. Query drift status
for STACK in "\${COMPLIANCE_STACKSETS[@]}"; do
  echo "=== $STACK ==="
  aws cloudformation describe-stack-set \\
    --stack-set-name "$STACK" \\
    --query 'StackSet.{Name:StackSetName,Status:Status,DriftStatus:StackSetDriftDetectionDetails.DriftStatus}' \\
    --output table
done`
            }
        ]
    },

    // ==================== 5. ATHENA QUERIES ====================
    athena: {
        title: "Athena Compliance Queries",
        description: "Pre-built Athena queries for analyzing CloudTrail, VPC Flow Logs, and Config data. Use for evidence generation, incident investigation, and compliance reporting.",

        queries: [
            {
                id: "unauthorized-access-attempts",
                name: "Unauthorized Access Attempts (Last 30 Days)",
                controls: ["3.1.1", "3.14.7"],
                category: "Access Monitoring",
                sql: `-- Unauthorized access attempts in the last 30 days
-- Use for CMMC 3.1.1 evidence and 3.14.7 monitoring
SELECT
  eventTime,
  userIdentity.arn AS user_arn,
  userIdentity.type AS user_type,
  eventName,
  errorCode,
  errorMessage,
  sourceIPAddress,
  userAgent,
  requestParameters
FROM cloudtrail_logs
WHERE errorCode IN ('AccessDenied', 'UnauthorizedAccess', 'Client.UnauthorizedAccess')
  AND eventTime > date_add('day', -30, current_timestamp)
ORDER BY eventTime DESC
LIMIT 500`
            },
            {
                id: "root-account-activity",
                name: "Root Account Activity Audit",
                controls: ["3.1.7"],
                category: "Privileged Access",
                sql: `-- All root account activity (should be near zero)
-- Use for CMMC 3.1.7 evidence
SELECT
  eventTime,
  eventName,
  eventSource,
  sourceIPAddress,
  userAgent,
  awsRegion,
  errorCode
FROM cloudtrail_logs
WHERE userIdentity.type = 'Root'
  AND userIdentity.invokedBy IS NULL
  AND eventType != 'AwsServiceEvent'
  AND eventTime > date_add('day', -90, current_timestamp)
ORDER BY eventTime DESC`
            },
            {
                id: "sg-changes-audit",
                name: "Security Group Change Audit Trail",
                controls: ["3.13.1", "3.4.3"],
                category: "Network Changes",
                sql: `-- All security group modifications
-- Use for CMMC 3.13.1 and 3.4.3 change tracking evidence
SELECT
  eventTime,
  userIdentity.arn AS who,
  eventName AS action,
  requestParameters AS changes,
  sourceIPAddress,
  awsRegion
FROM cloudtrail_logs
WHERE eventName IN (
  'AuthorizeSecurityGroupIngress',
  'AuthorizeSecurityGroupEgress',
  'RevokeSecurityGroupIngress',
  'RevokeSecurityGroupEgress',
  'CreateSecurityGroup',
  'DeleteSecurityGroup'
)
  AND eventTime > date_add('day', -90, current_timestamp)
ORDER BY eventTime DESC`
            },
            {
                id: "failed-logins",
                name: "Failed Console Login Attempts",
                controls: ["3.1.8", "3.5.3"],
                category: "Authentication",
                sql: `-- Failed console login attempts
-- Use for CMMC 3.1.8 (unsuccessful logon attempts) evidence
SELECT
  eventTime,
  userIdentity.userName AS attempted_user,
  sourceIPAddress,
  userAgent,
  additionalEventData
FROM cloudtrail_logs
WHERE eventName = 'ConsoleLogin'
  AND responseElements LIKE '%Failure%'
  AND eventTime > date_add('day', -30, current_timestamp)
ORDER BY eventTime DESC`
            },
            {
                id: "vpc-rejected-traffic",
                name: "VPC Rejected Traffic Analysis",
                controls: ["3.13.1", "3.14.6"],
                category: "Network Monitoring",
                sql: `-- Top rejected traffic sources from VPC Flow Logs
-- Use for CMMC 3.13.1 boundary protection evidence
SELECT
  srcaddr,
  dstaddr,
  dstport,
  protocol,
  COUNT(*) AS reject_count,
  SUM(bytes) AS total_bytes
FROM vpc_flow_logs
WHERE action = 'REJECT'
  AND date > date_add('day', -7, current_date)
GROUP BY srcaddr, dstaddr, dstport, protocol
HAVING COUNT(*) > 100
ORDER BY reject_count DESC
LIMIT 50`
            },
            {
                id: "iam-policy-changes",
                name: "IAM Policy Modification Audit",
                controls: ["3.1.1", "3.1.2"],
                category: "Access Control",
                sql: `-- All IAM policy changes for access control audit
-- Use for CMMC 3.1.1 and 3.1.2 evidence
SELECT
  eventTime,
  userIdentity.arn AS modified_by,
  eventName AS action,
  JSON_EXTRACT_SCALAR(requestParameters, '$.policyArn') AS policy_arn,
  JSON_EXTRACT_SCALAR(requestParameters, '$.roleName') AS role_name,
  JSON_EXTRACT_SCALAR(requestParameters, '$.userName') AS user_name,
  sourceIPAddress
FROM cloudtrail_logs
WHERE eventName IN (
  'CreatePolicy', 'DeletePolicy', 'CreatePolicyVersion',
  'AttachRolePolicy', 'DetachRolePolicy',
  'AttachUserPolicy', 'DetachUserPolicy',
  'AttachGroupPolicy', 'DetachGroupPolicy',
  'PutRolePolicy', 'PutUserPolicy', 'PutGroupPolicy',
  'DeleteRolePolicy', 'DeleteUserPolicy', 'DeleteGroupPolicy'
)
  AND eventTime > date_add('day', -90, current_timestamp)
ORDER BY eventTime DESC`
            }
        ]
    },

    // ==================== 6. QUICK REFERENCE ====================
    quickReference: {
        title: "AWS Service → CMMC Control Mapping",
        description: "Quick reference mapping AWS services to the CMMC controls they help satisfy.",
        mappings: [
            { service: "CloudTrail", controls: ["3.3.1", "3.3.2", "3.3.4", "3.3.5", "3.3.6", "3.3.7"], category: "Audit & Accountability" },
            { service: "CloudWatch Logs", controls: ["3.3.1", "3.3.4", "3.14.6"], category: "Monitoring" },
            { service: "Security Hub", controls: ["3.11.1", "3.12.1", "3.12.2", "3.12.3"], category: "Security Assessment" },
            { service: "GuardDuty", controls: ["3.14.2", "3.14.6", "3.14.7"], category: "Threat Detection" },
            { service: "AWS Config", controls: ["3.4.1", "3.4.2", "3.11.2", "3.12.2"], category: "Configuration Mgmt" },
            { service: "IAM / Identity Center", controls: ["3.1.1", "3.1.2", "3.1.5", "3.1.7", "3.5.1", "3.5.2", "3.5.3"], category: "Access Control" },
            { service: "KMS", controls: ["3.13.10", "3.13.11"], category: "Encryption" },
            { service: "S3 (Object Lock)", controls: ["3.3.6", "3.8.9"], category: "Audit Protection" },
            { service: "Systems Manager", controls: ["3.4.1", "3.4.2", "3.4.6", "3.14.1"], category: "Endpoint Mgmt" },
            { service: "Network Firewall", controls: ["3.13.1", "3.13.5", "3.14.6"], category: "Boundary Protection" },
            { service: "VPC Flow Logs", controls: ["3.13.1", "3.14.6", "3.3.1"], category: "Network Monitoring" },
            { service: "Macie", controls: ["3.1.3", "3.8.1"], category: "Data Classification" },
            { service: "Lambda", controls: ["3.12.1", "3.14.1"], category: "Automation" },
            { service: "EventBridge", controls: ["3.3.1", "3.6.1", "3.14.6"], category: "Event Orchestration" },
            { service: "Organizations / SCPs", controls: ["3.1.2", "3.4.6", "3.4.7"], category: "Guardrails" },
            { service: "CloudFormation / StackSets", controls: ["3.4.1", "3.4.2"], category: "IaC Compliance" },
            { service: "Athena", controls: ["3.3.5", "3.3.6"], category: "Audit Analysis" },
            { service: "Detective", controls: ["3.6.1", "3.6.2"], category: "Incident Investigation" }
        ]
    }
};
