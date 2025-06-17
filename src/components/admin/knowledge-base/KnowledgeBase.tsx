
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DocumentUploader } from './DocumentUploader';
import { DocumentsList } from './DocumentsList';
import { Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const KnowledgeBase: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const handleDocumentUploaded = () => {
    // Zvýší počítadlo, což způsobí refresh seznamu dokumentů
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <CardTitle>Znalostní databáze</CardTitle>
        </div>
        <CardDescription>
          Nahrajte dokumenty, které budou sloužit jako znalostní báze pro AI model. 
          Dokumenty budou rozděleny na textové bloky a použity pro generování hodin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <DocumentUploader onDocumentUploaded={handleDocumentUploaded} />
          <p className="text-sm text-muted-foreground">
            Nahrané dokumenty budou využity jako kontext pro generování hodin pomocí AI.
          </p>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Všechny dokumenty</TabsTrigger>
            <TabsTrigger value="preparation">Přípravná část</TabsTrigger>
            <TabsTrigger value="main">Hlavní část</TabsTrigger>
            <TabsTrigger value="finish">Závěrečná část</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DocumentsList refreshTrigger={refreshTrigger} filterPhase={null} />
          </TabsContent>
          <TabsContent value="preparation">
            <DocumentsList refreshTrigger={refreshTrigger} filterPhase="preparation" />
          </TabsContent>
          <TabsContent value="main">
            <DocumentsList refreshTrigger={refreshTrigger} filterPhase="main" />
          </TabsContent>
          <TabsContent value="finish">
            <DocumentsList refreshTrigger={refreshTrigger} filterPhase="finish" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
