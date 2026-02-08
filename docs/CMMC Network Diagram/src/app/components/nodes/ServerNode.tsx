import React from 'react';
import { Handle, Position } from 'reactflow';
import { Server, Database, HardDrive, Activity } from 'lucide-react';

interface ServerNodeProps {
  data: {
    label: string;
    sublabel: string;
    scope: 'in' | 'out';
    assetType: 'cui' | 'security' | 'infrastructure' | 'none';
  };
}

export function ServerNode({ data }: ServerNodeProps) {
  const isInScope = data.scope === 'in';
  const isCUI = data.assetType === 'cui';
  const isSecurity = data.assetType === 'security';
  
  const getBorderColor = () => {
    if (!isInScope) return 'border-[#565f89]';
    if (isSecurity) return 'border-[#9ece6a]';
    if (isCUI) return 'border-[#7aa2f7]';
    return 'border-[#414868]';
  };

  const getBackgroundColor = () => {
    if (!isInScope) return 'bg-[#1f2335]';
    if (isSecurity) return 'bg-[#1a2b32]';
    if (isCUI) return 'bg-[#1e2030]';
    return 'bg-[#16161e]';
  };

  const getIcon = () => {
    const iconClass = isSecurity ? 'text-[#9ece6a]' : 
                     isCUI ? 'text-[#7aa2f7]' : 
                     'text-[#7dcfff]';
    
    if (data.label.includes('Database') || data.label.includes('SQL')) {
      return <Database className={`w-7 h-7 ${iconClass}`} />;
    }
    if (data.label.includes('Backup')) {
      return <HardDrive className={`w-7 h-7 ${iconClass}`} />;
    }
    if (data.label.includes('SIEM')) {
      return <Activity className={`w-7 h-7 ${iconClass}`} />;
    }
    return <Server className={`w-7 h-7 ${iconClass}`} />;
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} min-w-[180px] shadow-lg hover:shadow-xl transition-shadow`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[#c0caf5] truncate">{data.label}</div>
          <div className="text-xs text-[#a9b1d6] mt-0.5 truncate">{data.sublabel}</div>
          
          <div className="flex gap-1 mt-2 flex-wrap">
            {isCUI && (
              <span className="px-2 py-0.5 bg-[#7aa2f7]/20 text-[#7aa2f7] text-xs rounded-full border border-[#7aa2f7]/30">
                CUI
              </span>
            )}
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
    </div>
  );
}