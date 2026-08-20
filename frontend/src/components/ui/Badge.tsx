'use client';

import { Priority, PRIORITY_CONFIG } from '@/types';

interface BadgeProps {
  priority: Priority;
  className?: string;
}

export default function Badge({ priority, className = '' }: BadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
