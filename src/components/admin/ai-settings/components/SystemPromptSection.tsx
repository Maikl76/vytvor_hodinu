
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SystemPromptSectionProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

export const SystemPromptSection: React.FC<SystemPromptSectionProps> = ({
  systemPrompt,
  onSystemPromptChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="system_prompt">Systémový prompt pro AI</Label>
        <Textarea
          id="system_prompt"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          rows={12}
          className="mt-2"
          placeholder="Zadejte systémový prompt pro AI model..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Náhled systémového promptu
        </p>
      </div>
    </div>
  );
};
