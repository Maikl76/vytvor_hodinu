
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OpenAISettingsData {
  id?: number;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  aiEnabled: boolean;
}

export const OpenAISettings: React.FC = () => {
  const [settings, setSettings] = useState<OpenAISettingsData>({
    apiKey: '',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'Jsi AI asistent specializovaný na tělesnou výchovu a sport.',
    aiEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('provider', 'openai')
          .order('id', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading OpenAI settings:', error);
          return;
        }
        
        if (data) {
          setSettings({
            id: data.id,
            apiKey: data.api_key || '',
            model: data.model || 'gpt-4o',
            temperature: data.temperature || 0.7,
            maxTokens: data.max_tokens || 1000,
            systemPrompt: data.system_prompt || 'Jsi AI asistent specializovaný na tělesnou výchovu a sport.',
            aiEnabled: data.ai_enabled || true
          });
        }
      } catch (error) {
        console.error('Error loading OpenAI settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      let result;
      if (settings.id) {
        // Update existing settings
        const { data, error } = await supabase
          .from('ai_settings')
          .update({
            api_key: settings.apiKey,
            model: settings.model,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens,
            system_prompt: settings.systemPrompt,
            ai_enabled: settings.aiEnabled,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('ai_settings')
          .insert([{
            provider: 'openai',
            api_key: settings.apiKey,
            model: settings.model,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens,
            system_prompt: settings.systemPrompt,
            ai_enabled: settings.aiEnabled
          }])
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      if (result && result[0]) {
        setSettings({ ...settings, id: result[0].id });
      }
      
      toast({
        title: "Nastavení uloženo",
        description: "OpenAI nastavení bylo úspěšně uloženo.",
      });
    } catch (error: any) {
      console.error('Error saving OpenAI settings:', error);
      toast({
        title: "Chyba při ukládání nastavení",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

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
          <Settings className="h-6 w-6 text-primary" />
          <CardTitle>OpenAI nastavení</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="openai-ai-enabled" className="font-medium">AI Asistent aktivován</Label>
            <Switch
              id="openai-ai-enabled"
              checked={settings.aiEnabled}
              onCheckedChange={(checked) => setSettings({
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
          <Label htmlFor="openai-api-key" className="font-medium">API klíč</Label>
          <Input
            id="openai-api-key"
            type="password"
            placeholder="sk-..."
            value={settings.apiKey}
            onChange={(e) => setSettings({
              ...settings,
              apiKey: e.target.value
            })}
          />
          <p className="text-sm text-gray-500">API klíč pro přístup k OpenAI modelu.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openai-model" className="font-medium">AI model</Label>
          <select 
            id="openai-model"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings.model}
            onChange={(e) => setSettings({
              ...settings,
              model: e.target.value
            })}
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Parametry generování</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openai-temperature" className="text-sm">Teplota</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="openai-temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings({
                    ...settings,
                    temperature: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <span className="text-sm w-10">{settings.temperature}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="openai-max-tokens" className="text-sm">Max. tokenů</Label>
              <Input
                id="openai-max-tokens"
                type="number"
                min="100"
                max="4096"
                value={settings.maxTokens}
                onChange={(e) => setSettings({
                  ...settings,
                  maxTokens: parseInt(e.target.value) || 100
                })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openai-system-prompt" className="font-medium">Systémový prompt</Label>
          <Textarea
            id="openai-system-prompt"
            placeholder="Zadejte výchozí instrukce pro AI model..."
            value={settings.systemPrompt}
            onChange={(e) => setSettings({
              ...settings,
              systemPrompt: e.target.value
            })}
            rows={6}
          />
          <p className="text-sm text-gray-500">
            Základní instrukce pro AI model, které definují jeho chování a schopnosti při generování obsahu.
          </p>
        </div>
        
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
