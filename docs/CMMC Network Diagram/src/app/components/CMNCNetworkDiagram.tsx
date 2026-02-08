import React, { useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CloudNode } from './nodes/CloudNode';
import { DeviceNode } from './nodes/DeviceNode';
import { LocationNode } from './nodes/LocationNode';
import { ZoneBoundary } from './nodes/ZoneBoundary';
import { NetworkDevice } from './nodes/NetworkDevice';
import { ServerNode } from './nodes/ServerNode';
import { ModernLegend } from './ModernLegend';

const nodeTypes = {
  cloud: CloudNode,
  device: DeviceNode,
  location: LocationNode,
  zone: ZoneBoundary,
  network: NetworkDevice,
  server: ServerNode,
};

const initialNodes: Node[] = [
  // Background zones
  {
    id: 'cui-zone',
    type: 'zone',
    position: { x: 400, y: 150 },
    data: { label: 'CUI Environment', type: 'cui', width: 1100, height: 700 },
    draggable: false,
    selectable: false,
    zIndex: -1,
    style: { pointerEvents: 'none' },
  },
  {
    id: 'out-scope-zone',
    type: 'zone',
    position: { x: 1550, y: 150 },
    data: { label: 'Out of Scope', type: 'out', width: 350, height: 700 },
    draggable: false,
    selectable: false,
    zIndex: -1,
    style: { pointerEvents: 'none' },
  },
  
  // Cloud Services at top
  {
    id: 'internet',
    type: 'cloud',
    position: { x: 650, y: 20 },
    data: {
      label: 'Internet',
      sublabel: 'Public Cloud',
      scope: 'boundary',
      assetType: 'none',
      provider: 'generic',
    },
  },
  {
    id: 'azure',
    type: 'cloud',
    position: { x: 850, y: 20 },
    data: {
      label: 'Microsoft Azure',
      sublabel: 'FedRAMP Moderate',
      scope: 'in',
      assetType: 'cui',
      provider: 'azure',
    },
  },
  {
    id: 'aws-gov',
    type: 'cloud',
    position: { x: 1050, y: 20 },
    data: {
      label: 'AWS GovCloud',
      sublabel: 'FedRAMP High',
      scope: 'in',
      assetType: 'cui',
      provider: 'aws',
    },
  },

  // Physical Locations
  {
    id: 'location-hq',
    type: 'location',
    position: { x: 50, y: 200 },
    data: {
      label: 'Headquarters',
      sublabel: 'Main Office - NY',
      scope: 'in',
      assetType: 'location',
    },
  },
  {
    id: 'location-branch1',
    type: 'location',
    position: { x: 50, y: 350 },
    data: {
      label: 'Branch Office 1',
      sublabel: 'Regional - DC',
      scope: 'in',
      assetType: 'location',
    },
  },
  {
    id: 'location-branch2',
    type: 'location',
    position: { x: 50, y: 500 },
    data: {
      label: 'Branch Office 2',
      sublabel: 'Regional - CA',
      scope: 'in',
      assetType: 'location',
    },
  },
  {
    id: 'location-remote',
    type: 'location',
    position: { x: 50, y: 650 },
    data: {
      label: 'Remote Workers',
      sublabel: 'Distributed',
      scope: 'in',
      assetType: 'location',
    },
  },

  // Perimeter Security
  {
    id: 'firewall-main',
    type: 'network',
    position: { x: 750, y: 180 },
    data: {
      label: 'Perimeter Firewall',
      deviceType: 'firewall',
      scope: 'in',
      assetType: 'security',
    },
  },
  {
    id: 'ids-ips',
    type: 'network',
    position: { x: 750, y: 280 },
    data: {
      label: 'IDS/IPS',
      deviceType: 'security',
      scope: 'in',
      assetType: 'security',
    },
  },
  {
    id: 'vpn-gateway',
    type: 'network',
    position: { x: 450, y: 180 },
    data: {
      label: 'VPN Gateway',
      deviceType: 'vpn',
      scope: 'in',
      assetType: 'security',
    },
  },

  // Core Infrastructure
  {
    id: 'core-switch',
    type: 'network',
    position: { x: 750, y: 380 },
    data: {
      label: 'Core Switch',
      deviceType: 'switch',
      scope: 'in',
      assetType: 'infrastructure',
    },
  },
  {
    id: 'core-router',
    type: 'network',
    position: { x: 900, y: 380 },
    data: {
      label: 'Core Router',
      deviceType: 'router',
      scope: 'in',
      assetType: 'infrastructure',
    },
  },

  // Server Infrastructure
  {
    id: 'ad-server',
    type: 'server',
    position: { x: 450, y: 480 },
    data: {
      label: 'Active Directory',
      sublabel: 'Domain Controller',
      scope: 'in',
      assetType: 'security',
    },
  },
  {
    id: 'file-server',
    type: 'server',
    position: { x: 600, y: 480 },
    data: {
      label: 'File Server',
      sublabel: 'CUI Storage',
      scope: 'in',
      assetType: 'cui',
    },
  },
  {
    id: 'app-server',
    type: 'server',
    position: { x: 750, y: 480 },
    data: {
      label: 'Application Server',
      sublabel: 'CUI Processing',
      scope: 'in',
      assetType: 'cui',
    },
  },
  {
    id: 'db-server',
    type: 'server',
    position: { x: 900, y: 480 },
    data: {
      label: 'Database Server',
      sublabel: 'SQL Server',
      scope: 'in',
      assetType: 'cui',
    },
  },
  {
    id: 'siem',
    type: 'server',
    position: { x: 1050, y: 480 },
    data: {
      label: 'SIEM',
      sublabel: 'Log Management',
      scope: 'in',
      assetType: 'security',
    },
  },
  {
    id: 'backup-server',
    type: 'server',
    position: { x: 1200, y: 480 },
    data: {
      label: 'Backup Server',
      sublabel: 'CUI Backup',
      scope: 'in',
      assetType: 'cui',
    },
  },

  // Workstations - HQ
  {
    id: 'ws-hq-1',
    type: 'device',
    position: { x: 450, y: 600 },
    data: {
      label: 'Engineering Workstations',
      sublabel: '15 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },
  {
    id: 'ws-hq-2',
    type: 'device',
    position: { x: 600, y: 600 },
    data: {
      label: 'Admin Workstations',
      sublabel: '10 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },
  {
    id: 'ws-hq-3',
    type: 'device',
    position: { x: 750, y: 600 },
    data: {
      label: 'General Workstations',
      sublabel: '50 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },

  // Workstations - Branches
  {
    id: 'ws-branch-1',
    type: 'device',
    position: { x: 900, y: 600 },
    data: {
      label: 'Branch 1 Workstations',
      sublabel: '20 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },
  {
    id: 'ws-branch-2',
    type: 'device',
    position: { x: 1050, y: 600 },
    data: {
      label: 'Branch 2 Workstations',
      sublabel: '15 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },

  // Mobile Devices
  {
    id: 'mobile-corp',
    type: 'device',
    position: { x: 450, y: 720 },
    data: {
      label: 'Corporate Mobile',
      sublabel: 'MDM Enrolled - 45 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'mobile',
    },
  },
  {
    id: 'mobile-tablets',
    type: 'device',
    position: { x: 600, y: 720 },
    data: {
      label: 'Corporate Tablets',
      sublabel: 'MDM Enrolled - 20 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'mobile',
    },
  },

  // Remote Access
  {
    id: 'remote-laptops',
    type: 'device',
    position: { x: 750, y: 720 },
    data: {
      label: 'Remote Laptops',
      sublabel: 'VPN Required - 30 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'laptop',
    },
  },

  // Network Security Appliances
  {
    id: 'proxy',
    type: 'network',
    position: { x: 1200, y: 280 },
    data: {
      label: 'Web Proxy',
      deviceType: 'security',
      scope: 'in',
      assetType: 'security',
    },
  },
  {
    id: 'email-gateway',
    type: 'network',
    position: { x: 1200, y: 380 },
    data: {
      label: 'Email Security Gateway',
      deviceType: 'security',
      scope: 'in',
      assetType: 'security',
    },
  },

  // Printers
  {
    id: 'mfp-1',
    type: 'device',
    position: { x: 1350, y: 600 },
    data: {
      label: 'Multifunction Printers',
      sublabel: '8 devices',
      scope: 'in',
      assetType: 'cui',
      deviceType: 'printer',
    },
  },

  // Out of Scope Assets
  {
    id: 'public-web',
    type: 'cloud',
    position: { x: 1600, y: 200 },
    data: {
      label: 'Public Website',
      sublabel: 'Marketing',
      scope: 'out',
      assetType: 'none',
      provider: 'generic',
    },
  },
  {
    id: 'dev-env',
    type: 'server',
    position: { x: 1600, y: 350 },
    data: {
      label: 'Dev/Test Environment',
      sublabel: 'Non-production',
      scope: 'out',
      assetType: 'none',
    },
  },
  {
    id: 'byod',
    type: 'device',
    position: { x: 1600, y: 500 },
    data: {
      label: 'BYOD Devices',
      sublabel: 'Personal devices',
      scope: 'out',
      assetType: 'none',
      deviceType: 'mobile',
    },
  },
  {
    id: 'guest-wifi',
    type: 'network',
    position: { x: 1600, y: 650 },
    data: {
      label: 'Guest WiFi',
      deviceType: 'wifi',
      scope: 'out',
      assetType: 'none',
    },
  },
  {
    id: 'personal-cloud',
    type: 'cloud',
    position: { x: 1750, y: 350 },
    data: {
      label: 'Personal Cloud Storage',
      sublabel: 'Not authorized',
      scope: 'out',
      assetType: 'none',
      provider: 'generic',
    },
  },
];

const initialEdges: Edge[] = [
  // Cloud to Firewall
  { id: 'e-inet-fw', source: 'internet', target: 'firewall-main', animated: true },
  { id: 'e-azure-fw', source: 'azure', target: 'firewall-main', animated: true },
  { id: 'e-aws-fw', source: 'aws-gov', target: 'firewall-main', animated: true },
  
  // VPN to Firewall
  { id: 'e-vpn-fw', source: 'vpn-gateway', target: 'firewall-main' },
  
  // Locations to VPN
  { id: 'e-loc-hq-vpn', source: 'location-hq', target: 'vpn-gateway', animated: true },
  { id: 'e-loc-b1-vpn', source: 'location-branch1', target: 'vpn-gateway', animated: true },
  { id: 'e-loc-b2-vpn', source: 'location-branch2', target: 'vpn-gateway', animated: true },
  { id: 'e-loc-rem-vpn', source: 'location-remote', target: 'vpn-gateway', animated: true },
  
  // Firewall to IDS
  { id: 'e-fw-ids', source: 'firewall-main', target: 'ids-ips' },
  
  // IDS to Core Network
  { id: 'e-ids-core', source: 'ids-ips', target: 'core-switch' },
  
  // Core Network
  { id: 'e-switch-router', source: 'core-switch', target: 'core-router' },
  
  // Security appliances
  { id: 'e-fw-proxy', source: 'firewall-main', target: 'proxy' },
  { id: 'e-fw-email', source: 'firewall-main', target: 'email-gateway' },
  
  // Servers to Core
  { id: 'e-ad-core', source: 'ad-server', target: 'core-switch' },
  { id: 'e-file-core', source: 'file-server', target: 'core-switch' },
  { id: 'e-app-core', source: 'app-server', target: 'core-switch' },
  { id: 'e-db-core', source: 'db-server', target: 'core-switch' },
  { id: 'e-siem-core', source: 'siem', target: 'core-switch' },
  { id: 'e-backup-core', source: 'backup-server', target: 'core-switch' },
  
  // Workstations to Core
  { id: 'e-ws-hq1-core', source: 'ws-hq-1', target: 'core-switch' },
  { id: 'e-ws-hq2-core', source: 'ws-hq-2', target: 'core-switch' },
  { id: 'e-ws-hq3-core', source: 'ws-hq-3', target: 'core-switch' },
  { id: 'e-ws-b1-core', source: 'ws-branch-1', target: 'core-switch' },
  { id: 'e-ws-b2-core', source: 'ws-branch-2', target: 'core-switch' },
  
  // Mobile to Core
  { id: 'e-mobile-corp-core', source: 'mobile-corp', target: 'core-switch' },
  { id: 'e-mobile-tab-core', source: 'mobile-tablets', target: 'core-switch' },
  { id: 'e-remote-lap-vpn', source: 'remote-laptops', target: 'vpn-gateway', animated: true },
  
  // Printers
  { id: 'e-mfp-core', source: 'mfp-1', target: 'core-switch' },
  
  // Out of scope (dashed lines)
  { id: 'e-public-web', source: 'public-web', target: 'internet', style: { strokeDasharray: '5,5' }, animated: false },
  { id: 'e-guest-inet', source: 'guest-wifi', target: 'internet', style: { strokeDasharray: '5,5' }, animated: false },
];

export function CMMCNetworkDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full bg-[#1a1b26]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#414868"
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.data.assetType === 'cui') return '#7aa2f7';
            if (node.data.assetType === 'security') return '#9ece6a';
            if (node.data.scope === 'out') return '#565f89';
            return '#414868';
          }}
          maskColor="rgba(26, 27, 38, 0.8)"
          className="border-2 border-[#414868] rounded-lg bg-[#16161e]"
        />
        <Panel position="top-center">
          <div className="bg-[#16161e] px-6 py-3 rounded-lg shadow-xl border-2 border-[#7aa2f7]">
            <h1 className="text-xl font-bold text-[#c0caf5]">CMMC Network Architecture Diagram</h1>
            <p className="text-sm text-[#a9b1d6] mt-1">Controlled Unclassified Information (CUI) Environment</p>
          </div>
        </Panel>
        <Panel position="bottom-right">
          <ModernLegend />
        </Panel>
      </ReactFlow>
    </div>
  );
}