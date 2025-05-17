
import { supabase } from '@/integrations/supabase/client';

// File upload and knowledge management service
export async function uploadDocument(file: File) {
  try {
    // Předpokládáme, že bucket "ai_documents" již existuje v Supabase
    const bucketName = 'ai_documents';
    
    // Krok 1: Nahrajeme soubor do úložiště
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
      
    if (uploadError) {
      console.error('Error uploading document:', uploadError);
      throw uploadError;
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
  // This is a placeholder - in a full implementation, this would parse PDFs and DOCs
  // For now, we'll just read text files directly
  
  if (file.type === 'text/plain') {
    return await file.text();
  } else if (file.type.includes('pdf') || file.type.includes('word')) {
    // Here we would integrate with libraries like pdf.js or mammoth.js
    // For now we'll return a placeholder message
    return `Obsah dokumentu ${file.name} (${file.type}). Toto je zjednodušená implementace.`;
  }
  
  return `Nerozpoznaný formát dokumentu: ${file.name}`;
}

export async function getUploadedDocuments() {
  try {
    // Get list of knowledge chunks from database
    const { data: knowledgeChunks, error } = await supabase
      .from('knowledge_chunks')
      .select('id, file_name, file_type, created_at')
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
