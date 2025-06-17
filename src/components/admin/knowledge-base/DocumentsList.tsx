
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Trash2, FilePlus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeChunk {
  id: string;
  file_name: string;
  file_type: string;
  content: string;
  created_at: string;
  activity_name: string | null;
  exercise_phase: string | null;
  week_range_start: number | null;
  week_range_end: number | null;
  difficulty_level: number | null;
}

interface DocumentsListProps {
  refreshTrigger?: number;
  filterPhase: string | null;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ 
  refreshTrigger = 0,
  filterPhase 
}) => {
  const [documents, setDocuments] = useState<KnowledgeChunk[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeChunk | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('knowledge_chunks')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Pokud je zadán filtr fáze, aplikujeme ho
      if (filterPhase) {
        query = query.eq('exercise_phase', filterPhase);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Chyba při načítání dokumentů",
        description: "Nepodařilo se načíst dokumenty ze znalostní databáze.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger, filterPhase]);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento dokument?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('knowledge_chunks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDocuments(documents.filter(doc => doc.id !== id));
      toast({
        title: "Dokument smazán",
        description: "Dokument byl úspěšně smazán ze znalostní databáze.",
      });
      
      // Close dialog if the deleted document is the selected one
      if (selectedDocument?.id === id) {
        setDialogOpen(false);
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat dokument.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const viewDocument = (document: KnowledgeChunk) => {
    setSelectedDocument(document);
    setDialogOpen(true);
  };
  
  const renderPhaseTag = (phase: string | null) => {
    if (!phase) return null;
    
    let color = '';
    let label = '';
    
    switch (phase) {
      case 'preparation':
        color = 'bg-blue-100 text-blue-800';
        label = 'Přípravná';
        break;
      case 'main':
        color = 'bg-green-100 text-green-800';
        label = 'Hlavní';
        break;
      case 'finish':
        color = 'bg-yellow-100 text-yellow-800';
        label = 'Závěrečná';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
        label = phase;
    }
    
    return (
      <Badge className={color} variant="outline">{label}</Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {filterPhase ? `Dokumenty - ${filterPhase === 'preparation' ? 'Přípravná část' : 
                         filterPhase === 'main' ? 'Hlavní část' : 'Závěrečná část'}` : 
                         'Všechny dokumenty'}
        </h3>
        <Button variant="outline" size="sm" onClick={loadDocuments} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Obnovit"}
        </Button>
      </div>
      
      {isLoading ? (
        <Card className="p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : documents.length === 0 ? (
        <Card className="p-8 text-center">
          <FilePlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {filterPhase ? `Zatím nejsou nahrány žádné dokumenty pro ${filterPhase === 'preparation' ? 'přípravnou část' : 
                           filterPhase === 'main' ? 'hlavní část' : 'závěrečnou část'}` : 
                           'Zatím nejsou nahrány žádné dokumenty'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Nahrajte dokumenty výše pro rozšíření znalostní báze AI.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="font-medium truncate">{doc.file_name}</div>
                  </div>
                  
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {renderPhaseTag(doc.exercise_phase)}
                    
                    {doc.activity_name && (
                      <Badge variant="outline">{doc.activity_name}</Badge>
                    )}
                    
                    {(doc.week_range_start !== null && doc.week_range_end !== null) && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Týden {doc.week_range_start}-{doc.week_range_end}
                      </Badge>
                    )}
                    
                    {doc.difficulty_level && (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Obtížnost: {doc.difficulty_level}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-500">
                    Nahráno: {formatDate(doc.created_at)}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => viewDocument(doc)}
                  >
                    Zobrazit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedDocument && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDocument.file_name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {renderPhaseTag(selectedDocument.exercise_phase)}
              
              {selectedDocument.activity_name && (
                <Badge variant="outline">{selectedDocument.activity_name}</Badge>
              )}
              
              {(selectedDocument.week_range_start !== null && selectedDocument.week_range_end !== null) && (
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Týden {selectedDocument.week_range_start}-{selectedDocument.week_range_end}
                </Badge>
              )}
              
              {selectedDocument.difficulty_level && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  Obtížnost: {selectedDocument.difficulty_level}
                </Badge>
              )}
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Obsah dokumentu:</div>
              <pre className="whitespace-pre-wrap bg-gray-50 rounded p-4 text-sm max-h-96 overflow-y-auto">
                {selectedDocument.content}
              </pre>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(selectedDocument.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mažu...</>
                ) : (
                  <><Trash2 className="mr-2 h-4 w-4" /> Smazat</>
                )}
              </Button>
              
              <DialogClose asChild>
                <Button variant="outline">Zavřít</Button>
              </DialogClose>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
