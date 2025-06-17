
// Public API re-export for backwards compatibility
export { processApiResponse, createFallbackPlan } from './processApiResponse';
export { createPromptText } from './promptTextBuilder';
export { getConcreteExercisesForActivitiesByPhases, createAntiRepetitionContext, createProgressionContext } from './contextBuilders';
export { extractSelectedActivities } from './extractActivities';
export { showErrorToast } from './showErrorToast';
export { createOptimizedSystemPrompt } from './systemPromptBuilder';
