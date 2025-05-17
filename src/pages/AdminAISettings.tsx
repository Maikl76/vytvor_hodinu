
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { Brain, Settings, Loader2 } from 'lucide-react';
import { getAISettings, saveAISettings } from '@/services/supabaseService';
import { OpenAISettings } from '@/components/admin/ai-settings/OpenAISettings';
import { GroqSettings } from '@/components/admin/ai-settings/GroqSettings';
import { LoadingState } from '@/components/admin/ai-settings/LoadingState';
import { KnowledgeBase } from '@/components/admin/knowledge-base/KnowledgeBase';

const AdminAISettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    openai: {
      apiKey: '',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'Jsi asistent, který pomáhá vytvářet plány hodin tělesné výchovy pro žáky třetí třídy základní školy.',
      aiEnabled: true,
    },
    groq: {
      apiKey: '',
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'Jsi asistent, který pomáhá vytvářet plány hodin tělesné výchovy pro žáky třetí třídy základní školy.',
      aiEnabled: true,
    }
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const aiSettings = await getAISettings();
      if (aiSettings) {
        // Update provider selection
        setSelectedProvider(aiSettings.provider);
        
        // Update settings state based on provider
        if (aiSettings.provider === 'openai') {
          setSettings({
            ...settings,
            openai: {
              apiKey: aiSettings.api_key,
              model: aiSettings.model,
              temperature: aiSettings.temperature,
              maxTokens: aiSettings.max_tokens,
              systemPrompt: aiSettings.system_prompt,
              aiEnabled: aiSettings.ai_enabled,
            }
          });
        } else if (aiSettings.provider === 'groq') {
          setSettings({
            ...settings,
            groq: {
              apiKey: aiSettings.api_key,
              model: aiSettings.model,
              temperature: aiSettings.temperature,
              maxTokens: aiSettings.max_tokens,
              systemPrompt: aiSettings.system_prompt,
              aiEnabled: aiSettings.ai_enabled,
            }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching AI settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    
    fetchSettings();
  }, [navigate]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    const currentProviderSettings = selectedProvider === 'openai' 
      ? settings.openai 
      : settings.groq;
      
    const settingsData = {
      provider: selectedProvider,
      api_key: currentProviderSettings.apiKey,
      model: currentProviderSettings.model,
      temperature: currentProviderSettings.temperature,
      max_tokens: currentProviderSettings.maxTokens,
      system_prompt: currentProviderSettings.systemPrompt,
      ai_enabled: currentProviderSettings.aiEnabled
    };
    
    try {
      await saveAISettings(settingsData);
      
      toast({
        title: "Nastavení uloženo",
        description: "Nastavení AI asistenta bylo úspěšně uloženo.",
      });
    } catch (error) {
      console.error("Error saving AI settings:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Nastala chyba při ukládání nastavení AI asistenta.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAISettingsChange = (openaiSettings: any) => {
    setSettings({
      ...settings,
      openai: openaiSettings
    });
  };

  const handleGroqSettingsChange = (groqSettings: any) => {
    setSettings({
      ...settings,
      groq: groqSettings
    });
  };

  if (isLoading) {
    return (
      <MainLayout isAdmin={true}>
        <LoadingState />
      </MainLayout>
    );
  }

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Nastavení AI integrace</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Zpět na dashboard
          </Button>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle>Konfigurace AI asistenta</CardTitle>
            </div>
            <CardDescription>
              Nastavte parametry AI asistenta, který pomáhá s generováním hodin tělesné výchovy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="openai">OpenAI</TabsTrigger>
                <TabsTrigger value="groq">Groq</TabsTrigger>
              </TabsList>

              <TabsContent value="openai">
                <OpenAISettings 
                  settings={settings.openai} 
                  onChange={handleOpenAISettingsChange} 
                />
              </TabsContent>

              <TabsContent value="groq">
                <GroqSettings 
                  settings={settings.groq} 
                  onChange={handleGroqSettingsChange} 
                />
              </TabsContent>

              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleSaveSettings} 
                  className="flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                  {isSaving ? 'Ukládání...' : 'Uložit nastavení'}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Knowledge Base Section */}
        <KnowledgeBase />
      </div>
    </MainLayout>
  );
};

export default AdminAISettings;
