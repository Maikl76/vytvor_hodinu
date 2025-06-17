
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { OpenAISettings } from '@/components/admin/ai-settings/OpenAISettings';
import { GroqSettings } from '@/components/admin/ai-settings/GroqSettings';
import { AiGenerationSettings } from '@/components/admin/ai-settings/AiGenerationSettings';
import { KnowledgeBase } from '@/components/admin/knowledge-base/KnowledgeBase';

const AdminAISettings = () => {
  const [activeTab, setActiveTab] = useState('openai');
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Nastavení AI</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
          >
            Zpět na dashboard
          </Button>
        </div>

        <Tabs defaultValue="openai" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6 grid grid-cols-4 gap-4">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="groq">Groq</TabsTrigger>
            <TabsTrigger value="generation">Generování plánu</TabsTrigger>
            <TabsTrigger value="knowledge">Znalostní databáze</TabsTrigger>
          </TabsList>
          <TabsContent value="openai">
            <OpenAISettings />
          </TabsContent>
          <TabsContent value="groq">
            <GroqSettings />
          </TabsContent>
          <TabsContent value="generation">
            <AiGenerationSettings />
          </TabsContent>
          <TabsContent value="knowledge">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminAISettings;
