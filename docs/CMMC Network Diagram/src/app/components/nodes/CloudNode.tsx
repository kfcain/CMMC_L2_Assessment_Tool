import React from 'react';
import { Handle, Position } from 'reactflow';
import { Cloud, Database, Server } from 'lucide-react';

interface CloudNodeProps {
  data: {
    label: string;
    sublabel: string;
    scope: 'in' | 'out' | 'boundary';
    assetType: 'cui' | 'security' | 'none';
    provider: 'azure' | 'aws' | 'generic';
  };
}

export function CloudNode({ data }: CloudNodeProps) {
  const isInScope = data.scope === 'in';
  const isCUI = data.assetType === 'cui';
  
  const getBorderColor = () => {
    if (data.scope === 'boundary') return 'border-[#bb9af7]';
    if (!isInScope) return 'border-[#565f89]';
    if (isCUI) return 'border-[#7aa2f7]';
    return 'border-[#414868]';
  };

  const getBackgroundColor = () => {
    if (data.scope === 'boundary') return 'bg-[#292e42]';
    if (!isInScope) return 'bg-[#1f2335]';
    if (isCUI) return 'bg-[#1e2030]';
    return 'bg-[#16161e]';
  };

  const getProviderColor = () => {
    if (data.provider === 'azure') return 'text-[#7aa2f7]';
    if (data.provider === 'aws') return 'text-[#ff9e64]';
    return 'text-[#7dcfff]';
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} min-w-[180px] shadow-lg hover:shadow-xl transition-shadow`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <Cloud className={`w-7 h-7 ${getProviderColor()} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[#c0caf5] truncate">{data.label}</div>
          <div className="text-xs text-[#a9b1d6] mt-0.5 truncate">{data.sublabel}</div>
          
          <div className="flex gap-1 mt-2 flex-wrap">
            {isCUI && (
              <span className="px-2 py-0.5 bg-[#7aa2f7]/20 text-[#7aa2f7] text-xs rounded-full border border-[#7aa2f7]/30">
                CUI
              </span>
            )}
            {isInScope ? (
              <span className="px-2 py-0.5 bg-[#9ece6a]/20 text-[#9ece6a] text-xs rounded-full border border-[#9ece6a]/30">
                In Scope
              </span>
            ) : data.scope === 'boundary' ? (
              <span className="px-2 py-0.5 bg-[#bb9af7]/20 text-[#bb9af7] text-xs rounded-full border border-[#bb9af7]/30">
                Boundary
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