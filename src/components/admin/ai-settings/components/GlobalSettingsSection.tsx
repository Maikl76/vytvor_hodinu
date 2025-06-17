
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface GlobalSettingsSectionProps {
  repetitionFrequency: number;
  minPause: number;
  progression: number;
  onSettingChange: (field: string, value: number) => void;
}

export const GlobalSettingsSection: React.FC<GlobalSettingsSectionProps> = ({
  repetitionFrequency,
  minPause,
  progression,
  onSettingChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Globální nastavení plánu</h3>
      
      <div>
        <Label htmlFor="repetition_frequency">Maximální počet opakování cvičení v plánu</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="repetition_frequency"
            min={1}
            max={10}
            step={1}
            value={[repetitionFrequency]}
            onValueChange={([value]) => onSettingChange('repetition_frequency_global', value)}
            className="w-60"
          />
          <span className="ml-2 text-sm">{repetitionFrequency}×</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Kolikrát maximálně se může stejné cvičení opakovat v celém více týdenním plánu.
        </p>
      </div>
      
      <div>
        <Label htmlFor="min_pause">Minimální pauza mezi opakováním (týdny)</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="min_pause"
            min={0}
            max={8}
            step={1}
            value={[minPause]}
            onValueChange={([value]) => onSettingChange('min_pause_between_repetitions', value)}
            className="w-60"
          />
          <span className="ml-2 text-sm">{minPause} týdnů</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Počet týdnů, které musí uběhnout, než se může cvičení opakovat.
        </p>
      </div>
      
      <div>
        <Label htmlFor="progression">Koeficient progrese</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="progression"
            min={1}
            max={3}
            step={0.1}
            value={[progression]}
            onValueChange={([value]) => onSettingChange('progression_coefficient', value)}
            className="w-60"
          />
          <span className="ml-2 text-sm">{progression.toFixed(1)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Jak rychle se má zvyšovat úroveň obtížnosti cvičení s postupujícími týdny.
        </p>
      </div>
    </div>
  );
};
