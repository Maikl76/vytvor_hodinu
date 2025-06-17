
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Settings2 } from 'lucide-react';
import { useAiGenerationSettings } from '@/hooks/useAiGenerationSettings';
import { SystemPromptSection } from './components/SystemPromptSection';
import { ExerciseCountsSection } from './components/ExerciseCountsSection';
import { GlobalSettingsSection } from './components/GlobalSettingsSection';

export const AiGenerationSettings: React.FC = () => {
  const { settings, loading, saving, handleSave, handleChange } = useAiGenerationSettings();

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="h-6 w-6 text-primary" />
          <CardTitle>Možnost uložení předchozího systémového promptu pro generování AI plánu</CardTitle>
        </div>
        <CardDescription>
          Tento systémový prompt se neposílá do modelu AI. Je určen pouze pro uložení za účelem porovnání s promptem, který se odesílá do modelu AI a je umístěn v záložce "Groq" nebo "Open AI"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SystemPromptSection
          systemPrompt={settings.system_prompt}
          onSystemPromptChange={(value) => handleChange('system_prompt', value)}
        />

        <ExerciseCountsSection
          preparationMin={settings.preparation_exercises_min}
          preparationMax={settings.preparation_exercises_max}
          mainMin={settings.main_exercises_min}
          mainMax={settings.main_exercises_max}
          finishMin={settings.finish_exercises_min}
          finishMax={settings.finish_exercises_max}
          onCountChange={handleChange}
        />

        <GlobalSettingsSection
          repetitionFrequency={settings.repetition_frequency_global}
          minPause={settings.min_pause_between_repetitions}
          progression={settings.progression_coefficient}
          onSettingChange={handleChange}
        />
          
        <div className="pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ukládám...</>
            ) : (
              <>Uložit nastavení</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
