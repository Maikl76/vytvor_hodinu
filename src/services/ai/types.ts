
// Ponechat existující exporty

export interface AiSettings {
  id: number;
  provider: string;
  api_key?: string;
  api_url?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  systemPrompt?: string;
  ai_enabled: boolean;
}

export interface ExerciseItem {
  name: string;
  description: string;
  time: number;
}

export interface ActivityItem {
  id: number;
  name: string;
  description?: string;
  notes?: string;
  keywords?: string[];
}

export interface LessonExerciseData {
  preparation: ExerciseItem[];
  main: ExerciseItem[];
  finish: ExerciseItem[];
}

export interface PromptData {
  systemPrompt?: string;
  userPrompt?: string;
}

export interface LessonGenerationRequest {
  school: string;
  grade: number;
  construct: string;
  environment: string;
  equipment: string[];  // Ujistíme se, že tento typ odpovídá seznamu názvů vybavení
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

export interface LessonGenerationResult {
  exercises: LessonExerciseData;
  promptData?: PromptData;
}
