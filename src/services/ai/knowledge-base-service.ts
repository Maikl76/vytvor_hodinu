
import { supabase } from '@/integrations/supabase/client';

// Define the ActivityItem interface locally to avoid circular imports
interface ActivityItem {
  id?: number;
  name: string;
  activity_name?: string;
  description?: string;
  notes?: string;
  keywords?: string[];
  duration?: number;
  exercise_phase?: string;
}

/**
 * Načte znalostní bázi pro daný plán filtrovanou podle fáze hodiny
 */
export async function getKnowledgeBase(planId: string): Promise<ActivityItem[]> {
  try {
    console.log('🔍 Loading knowledge base for plan:', planId);
    
    // Load all knowledge chunks from uploaded documents
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .select('activity_name, content, file_name, exercise_phase');
      
    if (error) {
      console.error('Error fetching knowledge base:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('No knowledge base data found');
      return [];
    }
    
    console.log('📚 Found knowledge chunks:', data.length);
    
    // Convert to ActivityItem format with proper structure
    const activities = data.map((chunk) => ({
      id: undefined,
      name: chunk.activity_name || 'Neznámá aktivita',
      activity_name: chunk.activity_name,
      description: chunk.content,
      notes: chunk.file_name,
      keywords: [],
      duration: undefined,
      exercise_phase: chunk.exercise_phase
    }));
    
    console.log('✅ Converted knowledge to activities:', activities.length);
    console.log('🔍 Sample activities:', activities.slice(0, 3).map(a => ({
      name: a.name,
      activity_name: a.activity_name,
      exercise_phase: a.exercise_phase,
      notes: a.notes
    })));
    
    return activities;
    
  } catch (error) {
    console.error('Error in getKnowledgeBase:', error);
    return [];
  }
}

/**
 * Načte cviky pro konkrétní fázi hodiny a vybrané aktivity
 */
export async function getKnowledgeForPhase(
  planId: string, 
  phase: 'preparation' | 'main' | 'finish', 
  selectedActivities: string[]
): Promise<ActivityItem[]> {
  try {
    console.log(`🎯 Loading knowledge for phase: ${phase}, activities:`, selectedActivities);
    
    // Load knowledge chunks filtered by phase and activities
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .select('activity_name, content, file_name, exercise_phase')
      .eq('exercise_phase', phase);
      
    if (error) {
      console.error('Error fetching knowledge for phase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn(`No knowledge found for phase: ${phase}`);
      return [];
    }
    
    console.log(`📚 Found ${data.length} chunks for phase: ${phase}`);
    
    // Filter by selected activities
    const filteredData = data.filter(chunk => {
      if (!chunk.activity_name) return false;
      
      return selectedActivities.some(selectedActivity => 
        chunk.activity_name?.toLowerCase().includes(selectedActivity.toLowerCase()) ||
        selectedActivity.toLowerCase().includes(chunk.activity_name?.toLowerCase() || '')
      );
    });
    
    console.log(`🎯 Filtered to ${filteredData.length} relevant chunks for phase: ${phase}`);
    
    // Convert to ActivityItem format
    const activities = filteredData.map((chunk) => ({
      id: undefined,
      name: chunk.activity_name || 'Neznámá aktivita',
      activity_name: chunk.activity_name,
      description: chunk.content,
      notes: chunk.file_name,
      keywords: [],
      duration: undefined,
      exercise_phase: chunk.exercise_phase
    }));
    
    return activities;
    
  } catch (error) {
    console.error(`Error in getKnowledgeForPhase for ${phase}:`, error);
    return [];
  }
}
