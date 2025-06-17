
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ActionButtonsProps {
  onSave: () => void;
  onDownload: () => void;
  lessonData: any;
  promptData?: {
    systemPrompt?: string;
    userPrompt?: string;
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onDownload, lessonData, promptData }) => {
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

  const handleReturnToEdit = () => {
    // Navigate back to create-lesson with the current lesson data
    navigate('/create-lesson', { 
      state: { 
        lessonData: lessonData,
        returnFromPreview: true 
      } 
    });
  };

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button variant="outline" onClick={handleReturnToEdit}>
          Zpět k úpravám
        </Button>
        <div className="space-x-4">
          {promptData && (
            <Button variant="secondary" onClick={() => setShowPrompt(true)}>
              Zobrazit prompt
            </Button>
          )}
          <Button variant="outline" onClick={onSave}>
            Uložit do historie
          </Button>
          <Button onClick={onDownload}>
            Stáhnout jako Word
          </Button>
        </div>
      </div>

      {/* Dialog for showing prompt */}
      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prompt použitý pro AI generování</DialogTitle>
            <DialogDescription>
              Tyto prompty byly použity pro generování plánu hodiny pomocí AI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {promptData?.systemPrompt && (
              <div>
                <h3 className="font-semibold mb-1">Systémový prompt:</h3>
                <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
                  {promptData.systemPrompt}
                </div>
              </div>
            )}
            
            {promptData?.userPrompt && (
              <div>
                <h3 className="font-semibold mb-1">Uživatelský prompt:</h3>
                <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">
                  {promptData.userPrompt}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionButtons;
