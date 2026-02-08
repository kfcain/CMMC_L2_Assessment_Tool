import React from 'react';
import { Cloud, Shield, Building2, Laptop, Info } from 'lucide-react';

export function Legend() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 border border-slate-200 max-w-sm">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200">
        <Info className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-slate-900">CMMC Network Diagram</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <div className="font-semibold text-xs text-slate-700 mb-2">Asset Types</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 border-2 border-blue-500 rounded flex items-center justify-center">
                <Cloud className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs">CUI Assets (Controlled Unclassified Information)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 border-2 border-green-500 rounded flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs">Security Protection Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 border-2 border-purple-500 rounded flex items-center justify-center">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs">Physical Locations</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="font-semibold text-xs text-slate-700 mb-2">Scope Status</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                In Scope
              </span>
              <span className="text-xs text-slate-600">Subject to CMMC requirements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full">
                Out of Scope
              </span>
              <span className="text-xs text-slate-600">Not subject to CMMC</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="font-semibold text-xs text-slate-700 mb-2">Connections</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-slate-400"></div>
              <span className="text-xs text-slate-600">Network connection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-xs text-slate-600">Active data flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-slate-400 border-t-2 border-dashed border-slate-400"></div>
              <span className="text-xs text-slate-600">Limited/isolated connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
