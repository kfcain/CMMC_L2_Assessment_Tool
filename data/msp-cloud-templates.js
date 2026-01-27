// MSP Cloud Deployment Templates - Infrastructure as Code
// VDI, Server, Networking Templates for AWS, Azure, GCP

const MSP_CLOUD_TEMPLATES = {
    version: "1.0.0",
    lastUpdated: "2025-01-27",

    // ==================== AZURE DEPLOYMENT TEMPLATES ====================
    azure: {
        title: "Azure GCC High Deployment Templates",
        consoleUrl: "https://portal.azure.us",
        
        vdi: {
            title: "Azure Virtual Desktop (AVD) Deployment",
            description: "FedRAMP High compliant VDI for CUI processing",
            
            terraformTemplate: `# Azure Virtual Desktop - CMMC Compliant Deployment
# terraform/azure/avd/main.tf

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }
}

provider "azurerm" {
  features {}
  environment = "usgovernment"
}

# Variables
variable "resource_group_name" { default = "rg-avd-cmmc-prod" }
variable "location" { default = "usgovvirginia" }
variable "workspace_name" { default = "avd-cmmc-workspace" }
variable "hostpool_name" { default = "avd-cmmc-hostpool" }
variable "vm_size" { default = "Standard_D4s_v3" }
variable "session_host_count" { default = 2 }

# Resource Group
resource "azurerm_resource_group" "avd" {
  name     = var.resource_group_name
  location = var.location
  tags = {
    Environment  = "Production"
    Compliance   = "CMMC-L2"
    DataClass    = "CUI"
  }
}

# Virtual Network for AVD
resource "azurerm_virtual_network" "avd" {
  name                = "vnet-avd-cmmc"
  address_space       = ["10.100.0.0/16"]
  location            = azurerm_resource_group.avd.location
  resource_group_name = azurerm_resource_group.avd.name
}

resource "azurerm_subnet" "session_hosts" {
  name                 = "snet-avd-sessionhosts"
  resource_group_name  = azurerm_resource_group.avd.name
  virtual_network_name = azurerm_virtual_network.avd.name
  address_prefixes     = ["10.100.1.0/24"]
}

# Network Security Group - Deny by Default
resource "azurerm_network_security_group" "avd" {
  name                = "nsg-avd-sessionhosts"
  location            = azurerm_resource_group.avd.location
  resource_group_name = azurerm_resource_group.avd.name

  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowAzureLoadBalancer"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "AzureLoadBalancer"
    destination_address_prefix = "*"
  }
}

# Host Pool
resource "azurerm_virtual_desktop_host_pool" "cmmc" {
  name                     = var.hostpool_name
  location                 = azurerm_resource_group.avd.location
  resource_group_name      = azurerm_resource_group.avd.name
  type                     = "Pooled"
  load_balancer_type       = "BreadthFirst"
  maximum_sessions_allowed = 10
  
  scheduled_agent_updates {
    enabled = true
    schedule {
      day_of_week = "Saturday"
      hour_of_day = 2
    }
  }
}

# Workspace
resource "azurerm_virtual_desktop_workspace" "cmmc" {
  name                = var.workspace_name
  location            = azurerm_resource_group.avd.location
  resource_group_name = azurerm_resource_group.avd.name
  friendly_name       = "CMMC CUI Workspace"
  description         = "Virtual Desktop workspace for CUI processing"
}

# Application Group
resource "azurerm_virtual_desktop_application_group" "desktop" {
  name                = "dag-cmmc-desktop"
  location            = azurerm_resource_group.avd.location
  resource_group_name = azurerm_resource_group.avd.name
  type                = "Desktop"
  host_pool_id        = azurerm_virtual_desktop_host_pool.cmmc.id
  friendly_name       = "CMMC Desktop"
}

# Workspace-Application Group Association
resource "azurerm_virtual_desktop_workspace_application_group_association" "cmmc" {
  workspace_id         = azurerm_virtual_desktop_workspace.cmmc.id
  application_group_id = azurerm_virtual_desktop_application_group.desktop.id
}

# Session Host VMs (simplified - use VM module in production)
resource "azurerm_windows_virtual_machine" "session_host" {
  count               = var.session_host_count
  name                = "avd-sh-\${count.index + 1}"
  resource_group_name = azurerm_resource_group.avd.name
  location            = azurerm_resource_group.avd.location
  size                = var.vm_size
  admin_username      = "avdadmin"
  admin_password      = data.azurerm_key_vault_secret.admin_password.value
  
  network_interface_ids = [
    azurerm_network_interface.session_host[count.index].id
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_encryption_set_id = azurerm_disk_encryption_set.cmmc.id
  }

  source_image_reference {
    publisher = "MicrosoftWindowsDesktop"
    offer     = "windows-11"
    sku       = "win11-22h2-avd"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  secure_boot_enabled = true
  vtpm_enabled        = true

  tags = {
    Environment = "Production"
    Compliance  = "CMMC-L2"
    HostPool    = var.hostpool_name
  }
}`,

            securityBaseline: {
                title: "AVD Security Baseline for CMMC",
                settings: [
                    { setting: "RDP Shortpath", value: "Enabled (UDP only)", control: "3.13.8" },
                    { setting: "Watermarking", value: "Enabled with User ID", control: "3.1.1" },
                    { setting: "Clipboard Redirection", value: "Disabled or Host-to-Client only", control: "3.8.2" },
                    { setting: "Drive Redirection", value: "Disabled", control: "3.8.2" },
                    { setting: "Printer Redirection", value: "Network printers only", control: "3.8.1" },
                    { setting: "USB Redirection", value: "Disabled", control: "3.8.2" },
                    { setting: "Screen Capture", value: "Disabled", control: "3.1.3" },
                    { setting: "Session Timeout", value: "15 minutes idle, 8 hours max", control: "3.1.11" },
                    { setting: "MFA Required", value: "Yes (Conditional Access)", control: "3.5.3" },
                    { setting: "Disk Encryption", value: "BitLocker with CMK", control: "3.13.11" }
                ]
            }
        },

        server: {
            title: "Windows/Linux Server Deployment",
            
            windowsServerTemplate: `# Azure Windows Server - CMMC Hardened
# terraform/azure/compute/windows-server.tf

resource "azurerm_windows_virtual_machine" "cmmc_server" {
  name                = "srv-cmmc-app-01"
  resource_group_name = azurerm_resource_group.compute.name
  location            = azurerm_resource_group.compute.location
  size                = "Standard_D4s_v5"
  admin_username      = "srvadmin"
  admin_password      = data.azurerm_key_vault_secret.admin_password.value
  
  network_interface_ids = [azurerm_network_interface.server.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_encryption_set_id = azurerm_disk_encryption_set.cmmc.id
  }

  source_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2022-datacenter-azure-edition"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  # Enable trusted launch
  secure_boot_enabled = true
  vtpm_enabled        = true

  # Boot diagnostics
  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.diag.primary_blob_endpoint
  }

  tags = {
    Environment = "Production"
    Compliance  = "CMMC-L2"
    Backup      = "Daily"
    Patching    = "Auto-Tuesday"
  }
}

# Apply Guest Configuration (DSC) for CMMC baseline
resource "azurerm_virtual_machine_extension" "guest_config" {
  name                       = "AzurePolicyforWindows"
  virtual_machine_id         = azurerm_windows_virtual_machine.cmmc_server.id
  publisher                  = "Microsoft.GuestConfiguration"
  type                       = "ConfigurationforWindows"
  type_handler_version       = "1.0"
  auto_upgrade_minor_version = true
}

# Microsoft Defender for Cloud - Servers plan
resource "azurerm_security_center_server_vulnerability_assessment_virtual_machine" "defender" {
  virtual_machine_id = azurerm_windows_virtual_machine.cmmc_server.id
}`,

            linuxServerTemplate: `# Azure Linux Server - CMMC Hardened (RHEL 8)
# terraform/azure/compute/linux-server.tf

resource "azurerm_linux_virtual_machine" "cmmc_linux" {
  name                = "srv-cmmc-linux-01"
  resource_group_name = azurerm_resource_group.compute.name
  location            = azurerm_resource_group.compute.location
  size                = "Standard_D4s_v5"
  admin_username      = "srvadmin"
  
  admin_ssh_key {
    username   = "srvadmin"
    public_key = data.azurerm_key_vault_secret.ssh_public_key.value
  }

  disable_password_authentication = true
  
  network_interface_ids = [azurerm_network_interface.linux_server.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_encryption_set_id = azurerm_disk_encryption_set.cmmc.id
  }

  source_image_reference {
    publisher = "RedHat"
    offer     = "RHEL"
    sku       = "8-LVM-gen2"
    version   = "latest"
  }

  identity {
    type = "SystemAssigned"
  }

  # Security type
  secure_boot_enabled = true
  vtpm_enabled        = true

  # Custom data for initial hardening
  custom_data = base64encode(<<-EOF
    #!/bin/bash
    # CMMC Baseline Hardening Script
    
    # Set password requirements
    sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS   60/' /etc/login.defs
    sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS   1/' /etc/login.defs
    sed -i 's/^PASS_MIN_LEN.*/PASS_MIN_LEN    14/' /etc/login.defs
    
    # Enable auditd
    systemctl enable auditd
    systemctl start auditd
    
    # Install and configure AIDE
    yum install -y aide
    aide --init
    mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
    
    # Disable root SSH login
    sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
    systemctl restart sshd
    
    # Enable FIPS mode
    fips-mode-setup --enable
  EOF
  )

  tags = {
    Environment = "Production"
    Compliance  = "CMMC-L2"
    OS          = "RHEL8"
  }
}`
        },

        networking: {
            title: "Hub-Spoke Network Architecture",
            
            hubSpokeTemplate: `# Azure Hub-Spoke Network - CMMC Compliant
# terraform/azure/networking/hub-spoke.tf

# Hub Virtual Network
resource "azurerm_virtual_network" "hub" {
  name                = "vnet-hub-cmmc"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
  
  tags = { Environment = "Hub", Compliance = "CMMC-L2" }
}

# Hub Subnets
resource "azurerm_subnet" "firewall" {
  name                 = "AzureFirewallSubnet"  # Required name
  resource_group_name  = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.hub.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "bastion" {
  name                 = "AzureBastionSubnet"  # Required name
  resource_group_name  = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.hub.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_subnet" "gateway" {
  name                 = "GatewaySubnet"  # Required name
  resource_group_name  = azurerm_resource_group.network.name
  virtual_network_name = azurerm_virtual_network.hub.name
  address_prefixes     = ["10.0.3.0/24"]
}

# Spoke Virtual Networks (per client/workload)
resource "azurerm_virtual_network" "spoke_client_a" {
  name                = "vnet-spoke-client-a"
  address_space       = ["10.1.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
}

resource "azurerm_virtual_network" "spoke_client_b" {
  name                = "vnet-spoke-client-b"
  address_space       = ["10.2.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
}

# Hub-Spoke Peerings
resource "azurerm_virtual_network_peering" "hub_to_spoke_a" {
  name                         = "hub-to-spoke-a"
  resource_group_name          = azurerm_resource_group.network.name
  virtual_network_name         = azurerm_virtual_network.hub.name
  remote_virtual_network_id    = azurerm_virtual_network.spoke_client_a.id
  allow_virtual_network_access = true
  allow_forwarded_traffic      = true
  allow_gateway_transit        = true
}

resource "azurerm_virtual_network_peering" "spoke_a_to_hub" {
  name                         = "spoke-a-to-hub"
  resource_group_name          = azurerm_resource_group.network.name
  virtual_network_name         = azurerm_virtual_network.spoke_client_a.name
  remote_virtual_network_id    = azurerm_virtual_network.hub.id
  allow_virtual_network_access = true
  allow_forwarded_traffic      = true
  use_remote_gateways          = true
}

# Azure Firewall Premium (required for CMMC - TLS inspection, IDPS)
resource "azurerm_firewall" "hub" {
  name                = "fw-hub-cmmc"
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
  sku_name            = "AZFW_VNet"
  sku_tier            = "Premium"
  threat_intel_mode   = "Deny"

  ip_configuration {
    name                 = "configuration"
    subnet_id            = azurerm_subnet.firewall.id
    public_ip_address_id = azurerm_public_ip.firewall.id
  }
}

# Firewall Policy with CMMC rules
resource "azurerm_firewall_policy" "cmmc" {
  name                = "fwpolicy-cmmc"
  resource_group_name = azurerm_resource_group.network.name
  location            = var.location
  sku                 = "Premium"
  
  threat_intelligence_mode = "Deny"
  
  intrusion_detection {
    mode = "Deny"
  }
  
  tls_certificate {
    key_vault_secret_id = azurerm_key_vault_certificate.firewall.secret_id
    name                = "TlsInspectionCert"
  }
}

# Azure Bastion for secure VM access (no public IPs on VMs)
resource "azurerm_bastion_host" "hub" {
  name                = "bas-hub-cmmc"
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name
  sku                 = "Standard"

  ip_configuration {
    name                 = "configuration"
    subnet_id            = azurerm_subnet.bastion.id
    public_ip_address_id = azurerm_public_ip.bastion.id
  }

  tunneling_enabled    = true
  file_copy_enabled    = false  # Disable for CMMC
  shareable_link_enabled = false
}

# Route Table forcing all traffic through Firewall
resource "azurerm_route_table" "spoke" {
  name                = "rt-spoke-to-firewall"
  location            = var.location
  resource_group_name = azurerm_resource_group.network.name

  route {
    name                   = "default-to-firewall"
    address_prefix         = "0.0.0.0/0"
    next_hop_type          = "VirtualAppliance"
    next_hop_in_ip_address = azurerm_firewall.hub.ip_configuration[0].private_ip_address
  }
}`
        }
    },

    // ==================== AWS GOVCLOUD TEMPLATES ====================
    aws: {
        title: "AWS GovCloud Deployment Templates",
        consoleUrl: "https://console.amazonaws-us-gov.com",
        
        vdi: {
            title: "Amazon WorkSpaces Deployment",
            
            terraformTemplate: `# AWS WorkSpaces - CMMC Compliant Deployment
# terraform/aws/workspaces/main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-gov-west-1"
}

# VPC for WorkSpaces
resource "aws_vpc" "workspaces" {
  cidr_block           = "10.200.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name       = "vpc-workspaces-cmmc"
    Compliance = "CMMC-L2"
  }
}

resource "aws_subnet" "workspaces_a" {
  vpc_id            = aws_vpc.workspaces.id
  cidr_block        = "10.200.1.0/24"
  availability_zone = "us-gov-west-1a"
  
  tags = { Name = "snet-workspaces-a" }
}

resource "aws_subnet" "workspaces_b" {
  vpc_id            = aws_vpc.workspaces.id
  cidr_block        = "10.200.2.0/24"
  availability_zone = "us-gov-west-1b"
  
  tags = { Name = "snet-workspaces-b" }
}

# AWS Directory Service (Managed AD)
resource "aws_directory_service_directory" "workspaces" {
  name     = "corp.cmmc.local"
  password = data.aws_secretsmanager_secret_version.ad_password.secret_string
  edition  = "Standard"
  type     = "MicrosoftAD"

  vpc_settings {
    vpc_id     = aws_vpc.workspaces.id
    subnet_ids = [aws_subnet.workspaces_a.id, aws_subnet.workspaces_b.id]
  }

  tags = {
    Name       = "dir-cmmc-workspaces"
    Compliance = "CMMC-L2"
  }
}

# Register Directory for WorkSpaces
resource "aws_workspaces_directory" "cmmc" {
  directory_id = aws_directory_service_directory.workspaces.id
  subnet_ids   = [aws_subnet.workspaces_a.id, aws_subnet.workspaces_b.id]

  self_service_permissions {
    change_compute_type  = false
    increase_volume_size = false
    rebuild_workspace    = false
    restart_workspace    = true
    switch_running_mode  = false
  }

  workspace_access_properties {
    device_type_android    = "DENY"
    device_type_chromeos   = "DENY"
    device_type_ios        = "DENY"
    device_type_linux      = "DENY"
    device_type_osx        = "ALLOW"
    device_type_web        = "DENY"
    device_type_windows    = "ALLOW"
    device_type_zeroclient = "DENY"
  }

  workspace_creation_properties {
    enable_internet_access              = false
    enable_maintenance_mode             = true
    user_enabled_as_local_administrator = false
  }

  tags = { Compliance = "CMMC-L2" }
}

# KMS Key for WorkSpaces encryption
resource "aws_kms_key" "workspaces" {
  description             = "KMS key for WorkSpaces volume encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = { AWS = "arn:aws-us-gov:iam::\${data.aws_caller_identity.current.account_id}:root" }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow WorkSpaces Service"
        Effect = "Allow"
        Principal = { Service = "workspaces.amazonaws.com" }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = { Name = "kms-workspaces-cmmc" }
}

# WorkSpaces Bundle (use custom hardened image in production)
data "aws_workspaces_bundle" "windows" {
  bundle_id = "wsb-gm4d5r0y2"  # Standard Windows 10 Performance
}

# Individual WorkSpace deployment
resource "aws_workspaces_workspace" "user" {
  for_each = var.workspace_users

  directory_id = aws_workspaces_directory.cmmc.id
  bundle_id    = data.aws_workspaces_bundle.windows.id
  user_name    = each.value.username

  root_volume_encryption_enabled = true
  user_volume_encryption_enabled = true
  volume_encryption_key          = aws_kms_key.workspaces.arn

  workspace_properties {
    compute_type_name                         = "PERFORMANCE"
    user_volume_size_gib                      = 50
    root_volume_size_gib                      = 80
    running_mode                              = "AUTO_STOP"
    running_mode_auto_stop_timeout_in_minutes = 60
  }

  tags = {
    Owner      = each.value.username
    Compliance = "CMMC-L2"
  }
}`
        },

        server: {
            title: "EC2 Instance Deployment",
            
            ec2Template: `# AWS EC2 - CMMC Hardened Instance
# terraform/aws/compute/ec2.tf

# Security Group - Deny by Default
resource "aws_security_group" "cmmc_server" {
  name        = "sg-cmmc-server"
  description = "CMMC compliant server security group"
  vpc_id      = var.vpc_id

  # No ingress rules by default - add as needed
  
  egress {
    description = "Allow HTTPS outbound"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "sg-cmmc-server"
    Compliance = "CMMC-L2"
  }
}

# Launch Template with hardening
resource "aws_launch_template" "cmmc_server" {
  name = "lt-cmmc-server"

  image_id      = data.aws_ami.hardened_ami.id
  instance_type = "m6i.large"
  
  # IMDSv2 required (prevent SSRF attacks)
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  # EBS encryption
  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = 100
      volume_type           = "gp3"
      encrypted             = true
      kms_key_id            = aws_kms_key.ebs.arn
      delete_on_termination = true
    }
  }

  # SSM for management (no SSH)
  iam_instance_profile {
    name = aws_iam_instance_profile.ssm_profile.name
  }

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.cmmc_server.id]
    subnet_id                   = var.private_subnet_id
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name       = "srv-cmmc-app"
      Compliance = "CMMC-L2"
      Backup     = "Daily"
    }
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    # Install SSM Agent
    yum install -y amazon-ssm-agent
    systemctl enable amazon-ssm-agent
    systemctl start amazon-ssm-agent
    
    # Install CloudWatch Agent
    yum install -y amazon-cloudwatch-agent
    /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
      -a fetch-config -m ec2 -s \\
      -c ssm:\${var.cw_config_parameter}
    
    # Enable FIPS mode (for AL2023)
    sudo fips-mode-setup --enable
  EOF
  )
}

# SSM Role for Instance Management
resource "aws_iam_role" "ssm_role" {
  name = "role-cmmc-ssm-managed"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws-us-gov:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "cw_agent" {
  role       = aws_iam_role.ssm_role.name
  policy_arn = "arn:aws-us-gov:iam::aws:policy/CloudWatchAgentServerPolicy"
}`
        },

        networking: {
            title: "Transit Gateway Architecture",
            
            transitGatewayTemplate: `# AWS Transit Gateway - Multi-Account CMMC Architecture
# terraform/aws/networking/transit-gateway.tf

# Transit Gateway
resource "aws_ec2_transit_gateway" "cmmc" {
  description                     = "CMMC Transit Gateway"
  default_route_table_association = "disable"
  default_route_table_propagation = "disable"
  dns_support                     = "enable"
  vpn_ecmp_support                = "enable"

  tags = {
    Name       = "tgw-cmmc-hub"
    Compliance = "CMMC-L2"
  }
}

# Route Tables (Segmentation)
resource "aws_ec2_transit_gateway_route_table" "security" {
  transit_gateway_id = aws_ec2_transit_gateway.cmmc.id
  tags = { Name = "tgw-rt-security" }
}

resource "aws_ec2_transit_gateway_route_table" "workloads" {
  transit_gateway_id = aws_ec2_transit_gateway.cmmc.id
  tags = { Name = "tgw-rt-workloads" }
}

resource "aws_ec2_transit_gateway_route_table" "inspection" {
  transit_gateway_id = aws_ec2_transit_gateway.cmmc.id
  tags = { Name = "tgw-rt-inspection" }
}

# Inspection VPC (Network Firewall)
resource "aws_vpc" "inspection" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "vpc-inspection" }
}

resource "aws_networkfirewall_firewall" "cmmc" {
  name                = "nfw-cmmc-inspection"
  firewall_policy_arn = aws_networkfirewall_firewall_policy.cmmc.arn
  vpc_id              = aws_vpc.inspection.id

  dynamic "subnet_mapping" {
    for_each = aws_subnet.firewall_subnets
    content {
      subnet_id = subnet_mapping.value.id
    }
  }

  tags = { Compliance = "CMMC-L2" }
}

# Network Firewall Policy
resource "aws_networkfirewall_firewall_policy" "cmmc" {
  name = "fwpolicy-cmmc"

  firewall_policy {
    stateless_default_actions          = ["aws:forward_to_sfe"]
    stateless_fragment_default_actions = ["aws:forward_to_sfe"]

    stateful_rule_group_reference {
      resource_arn = aws_networkfirewall_rule_group.deny_known_bad.arn
    }

    stateful_rule_group_reference {
      resource_arn = aws_networkfirewall_rule_group.allow_approved.arn
    }
  }
}

# Stateful Rule Group - Deny Known Bad IPs/Domains
resource "aws_networkfirewall_rule_group" "deny_known_bad" {
  capacity = 100
  name     = "deny-known-bad"
  type     = "STATEFUL"

  rule_group {
    rules_source {
      stateful_rule {
        action = "DROP"
        header {
          destination      = "ANY"
          destination_port = "ANY"
          direction        = "ANY"
          protocol         = "TCP"
          source           = "ANY"
          source_port      = "ANY"
        }
        rule_option {
          keyword  = "sid"
          settings = ["1"]
        }
      }
    }

    rule_variables {
      ip_sets {
        key = "HOME_NET"
        ip_set {
          definition = ["10.0.0.0/8"]
        }
      }
    }
  }
}`
        }
    },

    // ==================== GCP TEMPLATES ====================
    gcp: {
        title: "GCP Assured Workloads Deployment Templates",
        consoleUrl: "https://console.cloud.google.com",
        
        vdi: {
            title: "Google Cloud VMware Engine / Chrome Enterprise",
            description: "VDI options in GCP for CMMC compliance",
            
            note: "GCP does not have a native VDI service like Azure Virtual Desktop or AWS WorkSpaces. Options include:",
            options: [
                {
                    name: "Google Cloud VMware Engine (GCVE)",
                    description: "Run VMware Horizon on dedicated VMware infrastructure",
                    useCase: "Existing VMware Horizon customers migrating to cloud"
                },
                {
                    name: "Citrix DaaS on GCP",
                    description: "Deploy Citrix Virtual Apps and Desktops on GCP Compute Engine",
                    useCase: "Enterprise VDI with advanced features"
                },
                {
                    name: "Chrome Enterprise + CloudReady",
                    description: "Zero-trust browser-based access with Chrome Enterprise",
                    useCase: "Web-based application access only"
                }
            ]
        },

        server: {
            title: "Compute Engine Deployment",
            
            terraformTemplate: `# GCP Compute Engine - CMMC Hardened Instance
# terraform/gcp/compute/main.tf

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = "us-central1"
}

# Service Account with minimal permissions
resource "google_service_account" "cmmc_server" {
  account_id   = "sa-cmmc-server"
  display_name = "CMMC Server Service Account"
}

# Compute Instance
resource "google_compute_instance" "cmmc_server" {
  name         = "srv-cmmc-app-01"
  machine_type = "n2-standard-4"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "projects/rhel-cloud/global/images/family/rhel-8"
      size  = 100
      type  = "pd-ssd"
    }
    kms_key_self_link = google_kms_crypto_key.disk_encryption.id
  }

  network_interface {
    network    = google_compute_network.cmmc.id
    subnetwork = google_compute_subnetwork.workload.id
    # No external IP - access via IAP only
  }

  shielded_instance_config {
    enable_secure_boot          = true
    enable_vtpm                 = true
    enable_integrity_monitoring = true
  }

  service_account {
    email  = google_service_account.cmmc_server.email
    scopes = ["cloud-platform"]
  }

  metadata = {
    enable-oslogin         = "TRUE"
    enable-oslogin-2fa     = "TRUE"
    block-project-ssh-keys = "TRUE"
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Install Ops Agent for logging
    curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
    sudo bash add-google-cloud-ops-agent-repo.sh --also-install

    # Enable FIPS mode
    sudo fips-mode-setup --enable
    
    # Configure auditd
    sudo systemctl enable auditd
    sudo systemctl start auditd
  EOF

  labels = {
    environment = "production"
    compliance  = "cmmc-l2"
    data-class  = "cui"
  }

  resource_policies = [google_compute_resource_policy.daily_snapshot.id]
}

# Firewall Rules - Deny by Default
resource "google_compute_firewall" "deny_all_ingress" {
  name      = "fw-deny-all-ingress"
  network   = google_compute_network.cmmc.id
  priority  = 65534
  direction = "INGRESS"

  deny {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow_iap_ssh" {
  name      = "fw-allow-iap-ssh"
  network   = google_compute_network.cmmc.id
  priority  = 1000
  direction = "INGRESS"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # IAP IP ranges
  source_ranges = ["35.235.240.0/20"]
  target_tags   = ["allow-iap"]
}

# CMEK for disk encryption
resource "google_kms_key_ring" "cmmc" {
  name     = "keyring-cmmc"
  location = "us-central1"
}

resource "google_kms_crypto_key" "disk_encryption" {
  name     = "key-disk-encryption"
  key_ring = google_kms_key_ring.cmmc.id

  rotation_period = "7776000s"  # 90 days

  lifecycle {
    prevent_destroy = true
  }
}`
        },

        networking: {
            title: "Shared VPC Architecture",
            
            sharedVpcTemplate: `# GCP Shared VPC - CMMC Multi-Project Architecture
# terraform/gcp/networking/shared-vpc.tf

# Host Project for Shared VPC
resource "google_compute_shared_vpc_host_project" "host" {
  project = var.host_project_id
}

# Service Projects
resource "google_compute_shared_vpc_service_project" "client_a" {
  host_project    = google_compute_shared_vpc_host_project.host.project
  service_project = var.client_a_project_id
}

resource "google_compute_shared_vpc_service_project" "client_b" {
  host_project    = google_compute_shared_vpc_host_project.host.project
  service_project = var.client_b_project_id
}

# Shared VPC Network
resource "google_compute_network" "shared" {
  name                    = "vpc-shared-cmmc"
  project                 = var.host_project_id
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

# Subnets per service project/client
resource "google_compute_subnetwork" "client_a" {
  name          = "snet-client-a"
  project       = var.host_project_id
  network       = google_compute_network.shared.id
  region        = "us-central1"
  ip_cidr_range = "10.1.0.0/16"

  private_ip_google_access = true
  
  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

resource "google_compute_subnetwork" "client_b" {
  name          = "snet-client-b"
  project       = var.host_project_id
  network       = google_compute_network.shared.id
  region        = "us-central1"
  ip_cidr_range = "10.2.0.0/16"

  private_ip_google_access = true
}

# VPC Service Controls (Perimeter)
resource "google_access_context_manager_service_perimeter" "cmmc" {
  parent = "accessPolicies/\${google_access_context_manager_access_policy.cmmc.name}"
  name   = "accessPolicies/\${google_access_context_manager_access_policy.cmmc.name}/servicePerimeters/sp_cmmc"
  title  = "CMMC Service Perimeter"

  status {
    resources = [
      "projects/\${data.google_project.host.number}",
      "projects/\${data.google_project.client_a.number}",
      "projects/\${data.google_project.client_b.number}"
    ]

    restricted_services = [
      "storage.googleapis.com",
      "bigquery.googleapis.com",
      "compute.googleapis.com"
    ]

    vpc_accessible_services {
      enable_restriction = true
      allowed_services   = ["RESTRICTED-SERVICES"]
    }
  }
}

# Cloud NAT (no public IPs on instances)
resource "google_compute_router" "nat_router" {
  name    = "router-nat"
  project = var.host_project_id
  network = google_compute_network.shared.id
  region  = "us-central1"
}

resource "google_compute_router_nat" "nat" {
  name                               = "nat-gateway"
  project                            = var.host_project_id
  router                             = google_compute_router.nat_router.name
  region                             = "us-central1"
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}`
        }
    }
};

// Export
if (typeof window !== 'undefined') window.MSP_CLOUD_TEMPLATES = MSP_CLOUD_TEMPLATES;
if (typeof module !== 'undefined' && module.exports) module.exports = MSP_CLOUD_TEMPLATES;
