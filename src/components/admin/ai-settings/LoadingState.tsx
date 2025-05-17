
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{message?: string}> = ({ message = 'Načítání nastavení AI...' }) => {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};
