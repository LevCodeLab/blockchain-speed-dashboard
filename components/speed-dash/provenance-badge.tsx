'use client';

import React from 'react';
import type { FieldProvenance } from '@/lib/speed-core/types';

interface ProvenanceBadgeProps {
  provenance: FieldProvenance;
  className?: string;
  showIcon?: boolean;
}

export function ProvenanceBadge({
  provenance,
  className = '',
  showIcon = true,
}: ProvenanceBadgeProps) {
  const isDirect = provenance === 'DIRECT';
  const isUnavailable = provenance === 'UNAVAILABLE';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#26262E] bg-[#141418] text-[10px] font-mono uppercase tracking-wider ${
        isDirect
          ? 'text-[#FFFFFF]'
          : isUnavailable
          ? 'text-[#71717A]'
          : 'text-[#E4E4E7]'
      } ${className}`}
      title={`Data Provenance: ${provenance}`}
    >
      {showIcon && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isDirect ? 'bg-[#FFFFFF]' : isUnavailable ? 'bg-[#52525B]' : 'bg-[#A1A1AA]'
          }`}
        />
      )}
      {provenance}
    </span>
  );
}
