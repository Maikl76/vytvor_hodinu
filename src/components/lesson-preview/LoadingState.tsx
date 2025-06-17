
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC<{ message?: string }> = ({ message = "Načítání náhledu hodiny..." }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
