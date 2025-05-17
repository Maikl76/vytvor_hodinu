
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ConstructSelectionProps {
  constructId: number | null;
  setConstructId: (id: number | null) => void;
  constructs: any[];
}

const ConstructSelection: React.FC<ConstructSelectionProps> = ({ 
  constructId, 
  setConstructId, 
  constructs 
}) => {
  // Handle construct selection
  const handleConstructChange = (id: number) => {
    setConstructId(id);
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium text-lg mb-2">Cvičební konstrukt</h3>
      <div className="grid grid-cols-1 gap-3">
        <RadioGroup value={constructId?.toString() || ""} onValueChange={(value) => handleConstructChange(parseInt(value))}>
          {constructs.map(construct => (
            <div key={construct.id} className="flex items-start space-x-2 p-3 border rounded-md hover:bg-gray-50">
              <RadioGroupItem value={construct.id.toString()} id={`construct-${construct.id}`} />
              <div className="grid gap-1.5">
                <Label htmlFor={`construct-${construct.id}`} className="font-medium">{construct.name}</Label>
                <p className="text-sm text-gray-600">{construct.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ConstructSelection;
