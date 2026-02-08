import React from 'react';
import { Handle, Position } from 'reactflow';
import { MapPin, Building2, Home } from 'lucide-react';

interface LocationNodeProps {
  data: {
    label: string;
    sublabel: string;
    scope: 'in' | 'out';
    assetType: 'location' | 'none';
  };
}

export function LocationNode({ data }: LocationNodeProps) {
  const isInScope = data.scope === 'in';
  
  const getBorderColor = () => {
    if (!isInScope) return 'border-[#565f89]';
    return 'border-[#bb9af7]';
  };

  const getBackgroundColor = () => {
    if (!isInScope) return 'bg-[#1f2335]';
    return 'bg-[#292e42]';
  };

  const getIcon = () => {
    const iconClass = isInScope ? 'text-[#bb9af7]' : 'text-[#565f89]';
    if (data.label.includes('Remote')) {
      return <Home className={`w-7 h-7 ${iconClass}`} />;
    }
    return <Building2 className={`w-7 h-7 ${iconClass}`} />;
  };

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 ${getBorderColor()} ${getBackgroundColor()} min-w-[180px] shadow-lg hover:shadow-xl transition-shadow`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-[#c0caf5] truncate">{data.label}</div>
          <div className="text-xs text-[#a9b1d6] mt-0.5 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{data.sublabel}</span>
          </div>
          
          <div className="flex gap-1 mt-2 flex-wrap">
            <span className="px-2 py-0.5 bg-[#bb9af7]/20 text-[#bb9af7] text-xs rounded-full border border-[#bb9af7]/30">
              Physical Location
            </span>
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
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}