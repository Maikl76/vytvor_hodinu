
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import mammoth from 'mammoth';

interface DocumentUploaderProps {
  onDocumentUploaded?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState('');
  const [exercisePhase, setExercisePhase] = useState('');
  const [activityName, setActivityName] = useState('');
  const [weekRangeStart, setWeekRangeStart] = useState('1');
  const [weekRangeEnd, setWeekRangeEnd] = useState('4');
  const [maxRepetitions, setMaxRepetitions] = useState('3');
  const [difficultyLevel, setDifficultyLevel] = useState('1');
  const [minIntervalWeeks, setMinIntervalWeeks] = useState('2');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const extractTextFromFile = async (selectedFile: File): Promise<string> => {
    try {
      if (selectedFile.type === 'text/plain') {
        // Pro textové soubory použijeme správné kódování UTF-8
        const arrayBuffer = await selectedFile.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(arrayBuffer);
      } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 selectedFile.name.endsWith('.docx')) {
        // Pro Word dokumenty použijeme mammoth
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (selectedFile.type === 'application/json') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(arrayBuffer);
      } else {
        return `Obsah dokumentu ${selectedFile.name} (${selectedFile.type}). Nepodporovaný formát souboru.`;
      }
    } catch (error) {
      console.error('Chyba při extrakci textu:', error);
      return `Chyba při čtení obsahu souboru ${selectedFile.name}.`;
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    try {
      const extractedContent = await extractTextFromFile(selectedFile);
      setContent(extractedContent);
    } catch (error) {
      console.error('Chyba při načítání souboru:', error);
      toast({
        title: "Chyba při načítání souboru",
        description: "Nepodařilo se načíst obsah souboru.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !content) {
      toast({
        title: "Chybějící údaje",
        description: "Vyberte soubor nebo zadejte obsah manuálně.",
        variant: "destructive",
      });
      return;
    }
    
    if (!exercisePhase) {
      toast({
        title: "Chybějící fáze",
        description: "Vyberte fázi cvičení.",
        variant: "destructive",
      });
      return;
    }
    
    if (!activityName) {
      toast({
        title: "Chybějící aktivita",
        description: "Zadejte název aktivity.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const { data, error } = await supabase
        .from('knowledge_chunks')
        .insert([
          { 
            file_name: file ? file.name : 'manual-entry',
            file_type: file ? file.type : 'text/plain',
            content: content || 'No content',
            exercise_phase: exercisePhase,
            activity_name: activityName,
            week_range_start: parseInt(weekRangeStart),
            week_range_end: parseInt(weekRangeEnd),
            max_repetitions: parseInt(maxRepetitions),
            difficulty_level: parseInt(difficultyLevel),
            min_interval_weeks: parseInt(minIntervalWeeks)
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Dokument nahrán",
        description: "Dokument byl úspěšně přidán do znalostní databáze.",
      });
      
      // Reset form
      setFile(null);
      setContent('');
      setExercisePhase('');
      setActivityName('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Zavolej callback pro refresh seznamu dokumentů
      if (onDocumentUploaded) {
        onDocumentUploaded();
      }
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Chyba nahrávání",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 border p-4 rounded-md">
        <div>
          <Label htmlFor="file-upload">Soubor s cvičeními</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".txt,.md,.json,.docx"
            onChange={handleFileUpload}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Nahrajte textový soubor (.txt), Markdown (.md), Word dokument (.docx) nebo JSON s popisem cvičení
          </p>
        </div>
        
        <div>
          <Label htmlFor="content">Obsah dokumentu</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Zde můžete přímo zadat text s popisem cvičení..."
            className="mt-1 min-h-36"
          />
        </div>
      </div>
      
      <div className="space-y-4 border p-4 rounded-md">
        <div className="text-sm font-medium mb-2">Metadata pro AI</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="exercise-phase">Fáze cvičení</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Pro kterou část hodiny je cvičení určeno
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={exercisePhase} onValueChange={setExercisePhase}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Vyberte fázi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparation">Přípravná část</SelectItem>
                <SelectItem value="main">Hlavní část</SelectItem>
                <SelectItem value="finish">Závěrečná část</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="activity-name">Název aktivity</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Musí odpovídat rolím v aplikaci (např. "Rozcvička", "Všeobecná průprava")
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="activity-name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Např. Rozcvička, Strečink..."
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="week-range">Rozsah týdnů</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="week-range-start"
                type="number"
                min="1"
                max="52"
                value={weekRangeStart}
                onChange={(e) => setWeekRangeStart(e.target.value)}
                className="w-20"
              />
              <span>až</span>
              <Input
                id="week-range-end"
                type="number"
                min={weekRangeStart}
                max="52"
                value={weekRangeEnd}
                onChange={(e) => setWeekRangeEnd(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="max-repetitions">Max. opakování</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Kolikrát se cvičení může maximálně opakovat v celém plánu
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="max-repetitions"
              type="number"
              min="1"
              max="10"
              value={maxRepetitions}
              onChange={(e) => setMaxRepetitions(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <Label htmlFor="difficulty-level">Obtížnost</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Úroveň obtížnosti cvičení (1-5)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="difficulty-level"
              type="number"
              min="1"
              max="5"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1">
            <Label htmlFor="min-interval">Minimální interval opakování (týdny)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Kolik týdnů musí uplynout, než se může cvičení opakovat
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="min-interval"
            type="number"
            min="0"
            max="10"
            value={minIntervalWeeks}
            onChange={(e) => setMinIntervalWeeks(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={uploading}
      >
        {uploading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Nahrávám...</>
        ) : (
          <><Upload className="mr-2 h-4 w-4" /> Nahrát do znalostní databáze</>
        )}
      </Button>
    </form>
  );
};
