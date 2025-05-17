
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadDocument } from '@/services/knowledgeService';

export const DocumentUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Nepodporovaný formát souboru",
        description: "Nahrajte pouze soubory typu PDF, DOCX nebo TXT.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Soubor je příliš velký",
        description: "Maximální velikost souboru je 5 MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await uploadDocument(file);
      
      if (result.success) {
        toast({
          title: "Dokument nahrán",
          description: `Soubor ${result.fileName} byl úspěšně nahrán.`,
        });
        
        // Aktualizace seznamu dokumentů - můžeme použít událost nebo callback
        // Pro jednoduchost použijeme reload stránky
        window.location.reload();
      } else {
        toast({
          title: "Chyba při nahrávání",
          description: result.error?.message || "Nastala neznámá chyba při nahrávání souboru.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Chyba při nahrávání",
        description: error.message || "Nastala neznámá chyba při nahrávání souboru.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          disabled={isUploading}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? 'Nahrávání...' : 'Nahrát dokument'}
        </Button>
      </label>
      <span className="text-sm text-muted-foreground">
        Podporované formáty: PDF, DOCX, TXT
      </span>
    </div>
  );
};
