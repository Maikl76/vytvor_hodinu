
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DocumentUploader } from './DocumentUploader';
import { DocumentsList } from './DocumentsList';
import { Database } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
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
          <DocumentUploader />
          <p className="text-sm text-muted-foreground">
            Nahrané dokumenty budou využity jako kontext pro generování hodin pomocí AI.
          </p>
        </div>
        
        <DocumentsList />
      </CardContent>
    </Card>
  );
};
