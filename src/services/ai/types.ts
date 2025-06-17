
// Základní nastavení AI
export interface AiSettings {
  id?: number;
  provider: 'openai' | 'groq';
  api_key: string;
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt?: string;
  ai_enabled?: boolean;
}

// Jednotlivé cvičení
export interface ExerciseItem {
  name: string;
  description: string;
  time: number;
  phase: 'preparation' | 'main' | 'finish';
}

// Data cvičení pro celou hodinu
export interface LessonExerciseData {
  preparation: ExerciseItem[];
  main: ExerciseItem[];
  finish: ExerciseItem[];
}

// Data pro vytvoření promptu
export interface PromptData {
  systemPrompt: string;
  userPrompt: string;
}

// Request pro generování hodiny
export interface LessonGenerationRequest {
  school: string;
  grade: number;
  construct: string;
  environment: string;
  equipment: string[];
  preparationTime: number;
  mainTime: number;
  finishTime: number;
  preparationRole: string;
  mainRole: string;
  finishRole: string;
  selectedActivitiesPhases?: string[];
  selectedActivitiesInfo?: {
    [phase: string]: ActivityItem[];
  };
}

// Výsledek generování hodiny
export interface LessonGenerationResult {
  exercises: LessonExerciseData;
  promptData?: {
    systemPrompt: string;
    userPrompt: string;
  };
}

// Aktivita item pro vybrané aktivity
export interface ActivityItem {
  id?: number;
  name: string;
  description?: string;
  notes?: string;
  keywords?: string[];
  duration?: number;
  activity_name?: string; // Přidáno pro kompatibilitu se znalostní databází
}
