
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';

interface EditToggleProps {
  isEditing: boolean;
  isModified: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditToggle: React.FC<EditToggleProps> = ({
  isEditing,
  isModified,
  onToggleEdit,
  onSave,
  onCancel
}) => {
  if (!isEditing) {
    return (
      <Button
        variant="outline"
        onClick={onToggleEdit}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Upravit hodinu
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      {isModified && (
        <Button
          onClick={onSave}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Save className="h-4 w-4" />
          Uložit změny
        </Button>
      )}
      <Button
        variant="outline"
        onClick={onCancel}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        {isModified ? 'Zrušit změny' : 'Ukončit úpravy'}
      </Button>
    </div>
  );
};

export default EditToggle;
