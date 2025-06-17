
import { supabase } from '@/integrations/supabase/client';
import * as mammoth from 'mammoth';

interface DocumentMetadata {
  exercise_phase?: string | null;
  activity_name?: string | null;
  week_range_start?: number | null;
  week_range_end?: number | null;
  difficulty_level?: number | null;
}

// File upload and knowledge management service
export async function uploadDocument(file: File, metadata?: DocumentMetadata) {
  try {
    // Předpokládáme, že bucket "ai_documents" již existuje v Supabase
    const bucketName = 'ai_documents';
    
    // Krok 1: Nahrajeme soubor do úložiště (pokud bucket existuje)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    try {
      const { data: bucketExists } = await supabase.storage.getBucket(bucketName);
      
      if (!bucketExists) {
        // Vytvoříme bucket pokud neexistuje
        await supabase.storage.createBucket(bucketName, {
          public: false
        });
      }
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Error uploading document to storage:', uploadError);
      }
    } catch (storageError) {
      console.error('Storage operation failed:', storageError);
      // Pokračujeme i když upload do storage selhal, protože důležitější je text v databázi
    }
    
    // Krok 2: Extrahujeme obsah souboru
    const fileContent = await extractTextContent(file);
    
    // Krok 3: Uložíme do tabulky knowledge_chunks
    const { error: insertError } = await supabase
      .from('knowledge_chunks')
      .insert({
        content: fileContent,
        file_name: file.name,
        file_type: file.type,
        exercise_phase: metadata?.exercise_phase || null,
        activity_name: metadata?.activity_name || null,
        week_range_start: metadata?.week_range_start || null,
        week_range_end: metadata?.week_range_end || null,
        difficulty_level: metadata?.difficulty_level || null
      });
      
    if (insertError) {
      console.error('Error storing knowledge chunk:', insertError);
      throw insertError;
    }
    
    return { success: true, fileName: file.name };
  } catch (error: any) {
    console.error('Error in document upload process:', error);
    return { success: false, error };
  }
}

// Function to get file content from uploaded documents
async function extractTextContent(file: File): Promise<string> {
  try {
    // Zpracování podle typu souboru
    if (file.type === 'text/plain') {
      // Pro textové soubory načteme obsah jako UTF-8 text
      const text = await file.text();
      return text;
    } 
    else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
             file.name.endsWith('.docx')) {
      // Pro soubory Word .docx použijeme mammoth.js
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({arrayBuffer});
      return result.value;
    }
    else if (file.type.includes('pdf')) {
      // Zde by mohla být integrace s knihovnou pro parsování PDF
      // Pro zjednodušení zatím vracíme informativní zprávu
      return `Obsah PDF dokumentu ${file.name}. Implementujte parsování PDF pro získání textu.`;
    }
    
    // Výchozí zpracování pro nerozpoznané typy
    return `Obsah dokumentu ${file.name} (${file.type}).`;
  }
  catch (error) {
    console.error('Error extracting text content:', error);
    return `Chyba při extrakci textu z dokumentu ${file.name}.`;
  }
}

export async function getUploadedDocuments() {
  try {
    // Get list of knowledge chunks from database
    const { data: knowledgeChunks, error } = await supabase
      .from('knowledge_chunks')
      .select('id, file_name, file_type, created_at, exercise_phase, activity_name, week_range_start, week_range_end, difficulty_level')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching knowledge chunks:', error);
      throw error;
    }
    
    return knowledgeChunks || [];
  } catch (error) {
    console.error('Error getting uploaded documents:', error);
    return [];
  }
}

export async function deleteDocument(id: string) {
  try {
    // Delete from knowledge_chunks table
    const { error } = await supabase
      .from('knowledge_chunks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting knowledge chunk:', error);
      throw error;
    }
    
    // Note: We would also delete the actual file from storage here
    // But for this simplified implementation, we'll just handle the database entry
    
    return true;
  } catch (error: any) {
    console.error('Error deleting document:', error);
    // Nepoužíváme zde useToast, protože jsme mimo React komponentu
    return false;
  }
}

// Nová funkce pro získání dokumentů podle fáze a aktivity
export async function getDocumentsByPhaseAndActivity(phase: string, activityName: string, weekNumber?: number) {
  try {
    let query = supabase
      .from('knowledge_chunks')
      .select('*')
      .eq('exercise_phase', phase)
      .eq('activity_name', activityName);
    
    // Pokud je zadáno číslo týdne, filtrujeme podle rozsahu týdnů
    if (weekNumber !== undefined) {
      query = query
        .lte('week_range_start', weekNumber)
        .gte('week_range_end', weekNumber);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching knowledge chunks by phase and activity:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getDocumentsByPhaseAndActivity:', error);
    return [];
  }
}
