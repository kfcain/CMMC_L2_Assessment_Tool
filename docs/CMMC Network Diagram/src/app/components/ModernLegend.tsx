import React from 'react';
import { 
  Cloud, Shield, Building2, Laptop, Smartphone, Server, 
  Database, Network, Wifi, Lock, Activity, HardDrive, Printer,
  CheckCircle, XCircle, Info
} from 'lucide-react';

export function ModernLegend() {
  return (
    <div className="bg-[#16161e] rounded-lg shadow-xl border-2 border-[#414868] max-w-md">
      <div className="px-3 py-2 bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] rounded-t-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-white" />
          <h3 className="font-bold text-sm text-white">Legend</h3>
        </div>
      </div>
      
      <div className="p-3 max-h-[70vh] overflow-y-auto">
        <div className="space-y-3">
          {/* Asset Types */}
          <div>
            <h4 className="font-bold text-xs text-[#c0caf5] mb-1.5">Assets</h4>
            <div className="space-y-1">
              <LegendItem
                icon={<Server className="w-4 h-4 text-[#7aa2f7]" />}
                label="CUI Assets"
              />
              <LegendItem
                icon={<Shield className="w-4 h-4 text-[#9ece6a]" />}
                label="Security Assets"
              />
              <LegendItem
                icon={<Building2 className="w-4 h-4 text-[#bb9af7]" />}
                label="Locations"
              />
              <LegendItem
                icon={<Cloud className="w-4 h-4 text-[#7dcfff]" />}
                label="Cloud Services"
              />
            </div>
          </div>

          {/* Scope */}
          <div>
            <h4 className="font-bold text-xs text-[#c0caf5] mb-1.5">Scope</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-[#1a2b32] border border-[#9ece6a] rounded flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-[#9ece6a]" />
                </div>
                <span className="text-xs text-[#a9b1d6]">In Scope</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-[#1f2335] border border-[#565f89] rounded flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-3 h-3 text-[#565f89]" />
                </div>
                <span className="text-xs text-[#a9b1d6]">Out of Scope</span>
              </div>
            </div>
          </div>

          {/* Boundaries */}
          <div>
            <h4 className="font-bold text-xs text-[#c0caf5] mb-1.5">Boundaries</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-3 bg-[#1a2b32] border border-dashed border-[#9ece6a] rounded flex-shrink-0"></div>
                <span className="text-xs text-[#a9b1d6]">CUI Zone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-3 bg-[#1f2335] border border-dashed border-[#f7768e] rounded flex-shrink-0"></div>
                <span className="text-xs text-[#a9b1d6]">Out of Scope</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LegendItemProps {
  icon: React.ReactNode;
  label: string;
}

function LegendItem({ icon, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs text-[#a9b1d6]">{label}</span>
    </div>
  );
}