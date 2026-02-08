import React from 'react';
import { Handle, Position } from 'reactflow';
import { Shield, Wifi, Lock, Network, Activity } from 'lucide-react';

interface NetworkDeviceProps {
  data: {
    label: string;
    deviceType: 'firewall' | 'switch' | 'router' | 'security' | 'vpn' | 'wifi';
    scope: 'in' | 'out';
    assetType: 'security' | 'infrastructure' | 'none';
  };
}

export function NetworkDevice({ data }: NetworkDeviceProps) {
  const isInScope = data.scope === 'in';
  const isSecurity = data.assetType === 'security';
  
  const getIcon = () => {
    const iconClass = isSecurity ? 'text-[#9ece6a]' : 'text-[#7aa2f7]';
    
    switch (data.deviceType) {
      case 'firewall':
        return <Shield className={`w-8 h-8 ${iconClass}`} />;
      case 'vpn':
        return <Lock className={`w-8 h-8 ${iconClass}`} />;
      case 'wifi':
        return <Wifi className={`w-8 h-8 ${iconClass}`} />;
      case 'security':
        return <Activity className={`w-8 h-8 ${iconClass}`} />;
      default:
        return <Network className={`w-8 h-8 ${iconClass}`} />;
    }
  };

  const getBorderColor = () => {
    if (!isInScope) return 'border-[#565f89]';
    if (isSecurity) return 'border-[#9ece6a]';
    return 'border-[#7aa2f7]';
  };

  const getBackgroundColor = () => {
    if (!isInScope) return 'bg-[#1f2335]';
    if (isSecurity) return 'bg-[#1a2b32]';
    return 'bg-[#1e2030]';
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} min-w-[180px] shadow-lg hover:shadow-xl transition-shadow`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <div className="text-center">
          <div className="font-semibold text-sm text-[#c0caf5]">{data.label}</div>
          
          <div className="flex gap-1 mt-2 justify-center flex-wrap">
            {isSecurity && (
              <span className="px-2 py-0.5 bg-[#9ece6a]/20 text-[#9ece6a] text-xs rounded-full border border-[#9ece6a]/30">
                Security
              </span>
            )}
            {isInScope ? (
              <span className="px-2 py-0.5 bg-[#9ece6a]/20 text-[#9ece6a] text-xs rounded-full border border-[#9ece6a]/30">
                In Scope
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#565f89]/20 text-[#a9b1d6] text-xs rounded-full border border-[#565f89]/30">
                Out of Scope
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}