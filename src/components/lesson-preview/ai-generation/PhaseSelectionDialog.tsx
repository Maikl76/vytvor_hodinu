
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PhaseSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPhases: string[];
  onSelectPhase: (phase: string) => void;
  onGenerate: () => void;
}

export const PhaseSelectionDialog: React.FC<PhaseSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedPhases,
  onSelectPhase,
  onGenerate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vyberte části hodiny pro regeneraci</DialogTitle>
          <DialogDescription>
            Vyberte, které části hodiny chcete nově vygenerovat pomocí AI. Systém použije znalostní bázi a existující cvičení jako základ pro vytvoření nových aktivit.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="preparation" 
                checked={selectedPhases.includes('preparation')}
                onCheckedChange={() => onSelectPhase('preparation')} 
              />
              <Label htmlFor="preparation" className="cursor-pointer">Přípravná část hodiny</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="main" 
                checked={selectedPhases.includes('main')}
                onCheckedChange={() => onSelectPhase('main')} 
              />
              <Label htmlFor="main" className="cursor-pointer">Hlavní část hodiny</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="finish" 
                checked={selectedPhases.includes('finish')}
                onCheckedChange={() => onSelectPhase('finish')} 
              />
              <Label htmlFor="finish" className="cursor-pointer">Závěrečná část hodiny</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušit</Button>
          <Button 
            onClick={onGenerate} 
            disabled={selectedPhases.length === 0}
          >
            Vygenerovat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
