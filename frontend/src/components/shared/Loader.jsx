import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Loader = ({ className, size = 'default' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-10 w-10',
    xl: 'h-16 w-16'
  };
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <Loader2 className={cn("animate-spin text-muted-foreground", sizes[size], className)} />
    </div>
  );
};
