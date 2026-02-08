import React from 'react';
import { Handle, Position } from 'reactflow';

interface ZoneBoundaryProps {
  data: {
    label: string;
    type: 'cui' | 'out' | 'dmz';
    width: number;
    height: number;
  };
}

export function ZoneBoundary({ data }: ZoneBoundaryProps) {
  const getStyles = () => {
    switch (data.type) {
      case 'cui':
        return {
          border: 'border-[#9ece6a]',
          bg: 'bg-[#9ece6a]/10',
          text: 'text-[#9ece6a]',
          shadow: 'shadow-[#9ece6a]/20',
        };
      case 'out':
        return {
          border: 'border-[#f7768e]',
          bg: 'bg-[#f7768e]/10',
          text: 'text-[#f7768e]',
          shadow: 'shadow-[#f7768e]/20',
        };
      case 'dmz':
        return {
          border: 'border-[#e0af68]',
          bg: 'bg-[#e0af68]/10',
          text: 'text-[#e0af68]',
          shadow: 'shadow-[#e0af68]/20',
        };
      default:
        return {
          border: 'border-[#565f89]',
          bg: 'bg-[#565f89]/10',
          text: 'text-[#a9b1d6]',
          shadow: 'shadow-[#565f89]/20',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`rounded-lg border-4 border-dashed ${styles.border} ${styles.bg} backdrop-blur-sm shadow-xl ${styles.shadow}`}
      style={{
        width: data.width,
        height: data.height,
      }}
    >
      <div className={`px-4 py-2 ${styles.text} font-bold text-lg`}>
        {data.label}
      </div>
    </div>
  );
}