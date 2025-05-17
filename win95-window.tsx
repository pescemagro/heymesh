
import React from 'react';
import { cn } from '@/lib/utils';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  controls?: boolean;
}

export function Win95Window({ 
  title, 
  children, 
  className, 
  onClose, 
  controls = true 
}: WindowProps) {
  return (
    <div className={cn('win95-window rounded-none flex flex-col', className)}>
      <div className="win95-titlebar">
        <div className="flex items-center gap-2">
          {/* Window icon could go here */}
          <span className="text-xs uppercase tracking-wide">{title}</span>
        </div>
        
        {controls && (
          <div className="flex space-x-1">
            <button className="win95-button h-4 w-4 flex items-center justify-center p-0" aria-label="Minimize">
              <Minus size={8} />
            </button>
            <button className="win95-button h-4 w-4 flex items-center justify-center p-0" aria-label="Maximize">
              <Square size={8} />
            </button>
            <button 
              className="win95-button h-4 w-4 flex items-center justify-center p-0" 
              aria-label="Close"
              onClick={onClose}
            >
              <X size={8} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-2 overflow-auto">
        {children}
      </div>
    </div>
  );
}
