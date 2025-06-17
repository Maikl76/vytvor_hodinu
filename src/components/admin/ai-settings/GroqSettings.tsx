
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

interface GroqSettingsData {
  id?: number;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  aiEnabled: boolean;
}

export const GroqSettings: React.FC = () => {
  const [settings, setSettings] = useState<GroqSettingsData>({
    apiKey: '',
    model: 'llama-3.1-8b-instant',
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
        console.log('🔍 Načítám Groq nastavení...');
        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('provider', 'groq')
          .order('id', { ascending: false })
          .limit(1);
          
        if (error && error.code !== 'PGRST116') {
          console.error('❌ Chyba při načítání Groq nastavení:', error);
          return;
        }
        
        console.log('📄 Načtená Groq data:', data);
        
        if (data && data.length > 0) {
          const settingsData = data[0];
          setSettings({
            id: settingsData.id,
            apiKey: settingsData.api_key || '',
            model: settingsData.model || 'llama-3.1-8b-instant',
            temperature: settingsData.temperature || 0.7,
            maxTokens: settingsData.max_tokens || 1000,
            systemPrompt: settingsData.system_prompt || 'Jsi AI asistent specializovaný na tělesnou výchovu a sport.',
            aiEnabled: settingsData.ai_enabled !== false // default true pokud není definováno
          });
          console.log('✅ Groq nastavení načteno:', settingsData);
        } else {
          console.log('📝 Žádná Groq nastavení nenalezena, používám výchozí');
        }
      } catch (error) {
        console.error('❌ Chyba při načítání Groq nastavení:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    console.log('💾 Ukládám Groq nastavení:', settings);
    
    try {
      // Kontrola povinných polí
      if (!settings.apiKey.trim()) {
        toast({
          title: "Chybí API klíč",
          description: "API klíč je povinný pro funkčnost Groq.",
          variant: "destructive",
        });
        return;
      }

      const dataToSave = {
        provider: 'groq',
        api_key: settings.apiKey.trim(),
        model: settings.model,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        system_prompt: settings.systemPrompt,
        ai_enabled: settings.aiEnabled,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Data k uložení:', dataToSave);

      let result;
      if (settings.id) {
        console.log('🔄 Aktualizuji existující nastavení s ID:', settings.id);
        // Update existing settings
        const { data, error } = await supabase
          .from('ai_settings')
          .update(dataToSave)
          .eq('id', settings.id)
          .select()
          .single();
          
        if (error) {
          console.error('❌ Chyba při aktualizaci Groq nastavení:', error);
          throw error;
        }
        result = data;
        console.log('✅ Nastavení aktualizováno:', result);
      } else {
        console.log('➕ Vytvářím nové nastavení');
        // Insert new settings
        const { data, error } = await supabase
          .from('ai_settings')
          .insert([dataToSave])
          .select()
          .single();
          
        if (error) {
          console.error('❌ Chyba při vytváření Groq nastavení:', error);
          throw error;
        }
        result = data;
        console.log('✅ Nové nastavení vytvořeno:', result);
      }
      
      if (result) {
        setSettings({ ...settings, id: result.id });
      }
      
      toast({
        title: "Nastavení uloženo",
        description: "Groq nastavení bylo úspěšně uloženo.",
      });
      
      console.log('🎉 Groq nastavení úspěšně uloženo!');
    } catch (error: any) {
      console.error('❌ Chyba při ukládání Groq nastavení:', error);
      toast({
        title: "Chyba při ukládání nastavení",
        description: error.message || "Došlo k neočekávané chybě při ukládání.",
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
          <CardTitle>Groq nastavení</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="groq-ai-enabled" className="font-medium">AI Asistent aktivován</Label>
            <Switch
              id="groq-ai-enabled"
              checked={settings.aiEnabled}
              onCheckedChange={(checked) => {
                console.log('🔄 Měním AI enabled na:', checked);
                setSettings({
                  ...settings, 
                  aiEnabled: checked
                });
              }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Když je aktivován, AI asistent pomáhá s generováním návrhů aktivit pro hodiny tělesné výchovy.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groq-api-key" className="font-medium">API klíč *</Label>
          <Input
            id="groq-api-key"
            type="password"
            placeholder="gsk-..."
            value={settings.apiKey}
            onChange={(e) => {
              console.log('🔄 Měním API klíč');
              setSettings({
                ...settings,
                apiKey: e.target.value
              });
            }}
          />
          <p className="text-sm text-gray-500">API klíč pro přístup k Groq modelům.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groq-model" className="font-medium">AI model</Label>
          <select 
            id="groq-model"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={settings.model}
            onChange={(e) => {
              console.log('🔄 Měním model na:', e.target.value);
              setSettings({
                ...settings,
                model: e.target.value
              });
            }}
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
              <Label htmlFor="groq-max-tokens" className="text-sm">Max. tokenů</Label>
              <Input
                id="groq-max-tokens"
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
          <Label htmlFor="groq-system-prompt" className="font-medium">Systémový prompt</Label>
          <Textarea
            id="groq-system-prompt"
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
            disabled={saving || !settings.apiKey.trim()}
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
