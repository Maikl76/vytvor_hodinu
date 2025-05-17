
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { getUploadedDocuments, deleteDocument } from '@/services/knowledgeService';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  file_name: string;
  file_type: string;
  created_at: string;
}

export const DocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getUploadedDocuments();
      setDocuments(docs);
    } catch (error: any) {
      toast({
        title: "Chyba při načítání dokumentů",
        description: error.message || "Nastala neznámá chyba při načítání dokumentů.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDocuments();
    setIsRefreshing(false);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const success = await deleteDocument(documentToDelete);
      if (success) {
        setDocuments(documents.filter(doc => doc.id !== documentToDelete));
        toast({
          title: "Dokument smazán",
          description: "Dokument byl úspěšně odstraněn.",
        });
      } else {
        toast({
          title: "Chyba při mazání",
          description: "Nastala neznámá chyba při mazání dokumentu.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Chyba při mazání",
        description: error.message || "Nastala neznámá chyba při mazání dokumentu.",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Nahrané dokumenty</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Obnovit
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Žádné dokumenty nebyly nahrány.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Soubor</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Nahráno</TableHead>
              <TableHead className="w-[100px]">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {doc.file_name}
                </TableCell>
                <TableCell>{doc.file_type}</TableCell>
                <TableCell>
                  {format(new Date(doc.created_at), 'dd. MMMM yyyy HH:mm', { locale: cs })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDocumentToDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat dokument</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat tento dokument? Tuto akci nelze vrátit zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Smazat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
