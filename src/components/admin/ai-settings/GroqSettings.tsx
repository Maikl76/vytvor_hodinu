
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GroqSettingsProps {
  settings: {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    aiEnabled: boolean;
  };
  onChange: (settings: any) => void;
}

export const GroqSettings: React.FC<GroqSettingsProps> = ({ settings, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="groq-ai-enabled" className="font-medium">AI Asistent aktivován</Label>
          <Switch
            id="groq-ai-enabled"
            checked={settings.aiEnabled}
            onCheckedChange={(checked) => onChange({
              ...settings, 
              aiEnabled: checked
            })}
          />
        </div>
        <p className="text-sm text-gray-500">
          Když je aktivován, AI asistent pomáhá s generováním návrhů aktivit pro hodiny tělesné výchovy.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="groq-api-key" className="font-medium">API klíč</Label>
        <Input
          id="groq-api-key"
          type="password"
          placeholder="gsk-..."
          value={settings.apiKey}
          onChange={(e) => onChange({
            ...settings,
            apiKey: e.target.value
          })}
        />
        <p className="text-sm text-gray-500">API klíč pro přístup k Groq modelům.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="groq-model" className="font-medium">AI model</Label>
        <select 
          id="groq-model"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={settings.model}
          onChange={(e) => onChange({
            ...settings,
            model: e.target.value
          })}
        >
          <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
          <option value="llama3-70b-8192">Llama3 70B 8192</option>
          <option value="llama3-8b-8192">Llama3 8B 8192</option>
          <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
          <option value="meta-llama/llama-4-maverick-17b-128e-instruct">Llama 4 Maverick 17B Instruct</option>
          <option value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B Instruct</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label className="font-medium">Parametry generování</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="groq-temperature" className="text-sm">Teplota</Label>
            <div className="flex items-center gap-2">
              <Input
                id="groq-temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => onChange({
                  ...settings,
                  temperature: parseFloat(e.target.value)
                })}
                className="w-full"
              />
              <span className="text-sm w-10">{settings.temperature}</span>
            </div>
          </div>
          <div>
            <Label htmlFor="groq-max-tokens" className="text-sm">Max. tokenů</Label>
            <Input
              id="groq-max-tokens"
              type="number"
              min="100"
              max="4096"
              value={settings.maxTokens}
              onChange={(e) => onChange({
                ...settings,
                maxTokens: parseInt(e.target.value) || 100
              })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="groq-system-prompt" className="font-medium">Systémový prompt</Label>
        <Textarea
          id="groq-system-prompt"
          placeholder="Zadejte výchozí instrukce pro AI model..."
          value={settings.systemPrompt}
          onChange={(e) => onChange({
            ...settings,
            systemPrompt: e.target.value
          })}
          rows={6}
        />
        <p className="text-sm text-gray-500">
          Základní instrukce pro AI model, které definují jeho chování a schopnosti při generování obsahu.
        </p>
      </div>
    </div>
  );
};
