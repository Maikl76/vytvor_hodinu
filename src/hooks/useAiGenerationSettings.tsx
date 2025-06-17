
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SettingsFormData {
  id?: number;
  preparation_exercises_min: number;
  preparation_exercises_max: number;
  main_exercises_min: number;
  main_exercises_max: number;
  finish_exercises_min: number;
  finish_exercises_max: number;
  repetition_frequency_global: number;
  progression_coefficient: number;
  min_pause_between_repetitions: number;
  system_prompt: string;
}

export const useAiGenerationSettings = () => {
  const [settings, setSettings] = useState<SettingsFormData>({
    preparation_exercises_min: 2,
    preparation_exercises_max: 3,
    main_exercises_min: 3,
    main_exercises_max: 5,
    finish_exercises_min: 2,
    finish_exercises_max: 3,
    repetition_frequency_global: 3,
    progression_coefficient: 1.5,
    min_pause_between_repetitions: 2,
    system_prompt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Načteme nastavení generování
        const { data: genData, error: genError } = await supabase
          .from('ai_generation_settings')
          .select('*')
          .order('id', { ascending: false })
          .limit(1)
          .single();
          
        // Načteme systémový prompt z ai_settings
        const { data: aiData, error: aiError } = await supabase
          .from('ai_settings')
          .select('system_prompt')
          .order('id', { ascending: false })
          .limit(1)
          .single();
        
        if (genData) {
          setSettings(prev => ({
            ...prev,
            id: genData.id,
            preparation_exercises_min: genData.preparation_exercises_min || prev.preparation_exercises_min,
            preparation_exercises_max: genData.preparation_exercises_max || prev.preparation_exercises_max,
            main_exercises_min: genData.main_exercises_min || prev.main_exercises_min,
            main_exercises_max: genData.main_exercises_max || prev.main_exercises_max,
            finish_exercises_min: genData.finish_exercises_min || prev.finish_exercises_min,
            finish_exercises_max: genData.finish_exercises_max || prev.finish_exercises_max,
            repetition_frequency_global: genData.repetition_frequency_global || prev.repetition_frequency_global,
            progression_coefficient: Number(genData.progression_coefficient) || prev.progression_coefficient,
            min_pause_between_repetitions: genData.min_pause_between_repetitions || prev.min_pause_between_repetitions
          }));
        }
        
        if (aiData && aiData.system_prompt) {
          setSettings(prev => ({
            ...prev,
            system_prompt: aiData.system_prompt
          }));
        }
        
        if (genError && genError.code !== 'PGRST116') {
          console.error('Error loading AI generation settings:', genError);
        }
        if (aiError && aiError.code !== 'PGRST116') {
          console.error('Error loading AI settings:', aiError);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Uložíme nastavení generování
      if (settings.id) {
        const { error: genError } = await supabase
          .from('ai_generation_settings')
          .update({
            preparation_exercises_min: settings.preparation_exercises_min,
            preparation_exercises_max: settings.preparation_exercises_max,
            main_exercises_min: settings.main_exercises_min,
            main_exercises_max: settings.main_exercises_max,
            finish_exercises_min: settings.finish_exercises_min,
            finish_exercises_max: settings.finish_exercises_max,
            repetition_frequency_global: settings.repetition_frequency_global,
            progression_coefficient: settings.progression_coefficient,
            min_pause_between_repetitions: settings.min_pause_between_repetitions,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);
          
        if (genError) throw genError;
      } else {
        const { data: genData, error: genError } = await supabase
          .from('ai_generation_settings')
          .insert([{
            preparation_exercises_min: settings.preparation_exercises_min,
            preparation_exercises_max: settings.preparation_exercises_max,
            main_exercises_min: settings.main_exercises_min,
            main_exercises_max: settings.main_exercises_max,
            finish_exercises_min: settings.finish_exercises_min,
            finish_exercises_max: settings.finish_exercises_max,
            repetition_frequency_global: settings.repetition_frequency_global,
            progression_coefficient: settings.progression_coefficient,
            min_pause_between_repetitions: settings.min_pause_between_repetitions
          }])
          .select();
          
        if (genError) throw genError;
        if (genData && genData[0]) {
          setSettings(prev => ({ ...prev, id: genData[0].id }));
        }
      }
      
      // Uložíme systémový prompt do ai_settings
      const { data: aiData, error: aiError } = await supabase
        .from('ai_settings')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();
        
      if (aiData) {
        const { error: updateError } = await supabase
          .from('ai_settings')
          .update({
            system_prompt: settings.system_prompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', aiData.id);
          
        if (updateError) throw updateError;
      }
      
      toast({
        title: "Nastavení uloženo",
        description: "Nastavení generování AI bylo úspěšně uloženo.",
      });
    } catch (error: any) {
      console.error('Error saving AI generation settings:', error);
      toast({
        title: "Chyba při ukládání nastavení",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SettingsFormData, value: number | string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return {
    settings,
    loading,
    saving,
    handleSave,
    handleChange,
  };
};
