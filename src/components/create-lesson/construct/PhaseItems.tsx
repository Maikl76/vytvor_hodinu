
import React from 'react';
import { ConstructItemRow } from '@/types/supabase';

interface PhaseItemsProps {
  items: ConstructItemRow[];
  isLoading: boolean;
  isItemSelected: (itemId: number) => boolean;
  onItemToggle: (itemId: number) => void;
  emptyMessage: string;
}

const PhaseItems: React.FC<PhaseItemsProps> = ({
  items,
  isLoading,
  isItemSelected,
  onItemToggle,
  emptyMessage
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 mt-2 border p-3 rounded-md">
      {isLoading ? (
        <p className="text-center py-4">Načítání položek...</p>
      ) : items.length > 0 ? (
        items.map(item => (
          <label key={item.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
            <input 
              type="checkbox"
              checked={isItemSelected(item.id)}
              onChange={() => onItemToggle(item.id)}
              className="mr-2"
            />
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
              <div className="text-xs text-gray-500">Trvání: {item.duration} min</div>
            </div>
          </label>
        ))
      ) : (
        <p className="text-center py-4 text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );
};

export default PhaseItems;
