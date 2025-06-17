
import { supabase } from '@/integrations/supabase/client';

export async function getWeeklyPlanData(planId: string) {
  console.log('📊 NAČÍTÁM DATA PLÁNU PRO AI GENEROVÁNÍ:', planId);
  
  // Načteme základní data plánu
  const { data: plan, error: planError } = await supabase
    .from('weekly_plans')
    .select(`
      *,
      school:school_id(name)
    `)
    .eq('id', planId)
    .single();
    
  if (planError) {
    console.error('❌ CHYBA NAČÍTÁNÍ PLÁNU:', planError);
    throw planError;
  }
  
  // Načteme prostředí
  const { data: environments } = await supabase
    .from('weekly_plan_environments')
    .select('environment:environment_id(name)')
    .eq('plan_id', planId);
    
  // Načteme vybrané aktivity pro každou fázi
  const { data: prepItems } = await supabase
    .from('weekly_plan_items')
    .select('item:item_id(name)')
    .eq('plan_id', planId)
    .eq('phase', 'preparation');
    
  const { data: mainItems } = await supabase
    .from('weekly_plan_items')
    .select('item:item_id(name)')
    .eq('plan_id', planId)
    .eq('phase', 'main');
    
  const { data: finishItems } = await supabase
    .from('weekly_plan_items')
    .select('item:item_id(name)')
    .eq('plan_id', planId)
    .eq('phase', 'finish');
    
  // Načteme vybavení
  const { data: equipment } = await supabase
    .from('weekly_plan_equipment')
    .select('equipment:equipment_id(name)')
    .eq('plan_id', planId);
    
  // Načteme role
  const { data: roles } = await supabase
    .from('roles')
    .select('*');
    
  console.log('📋 NAČTENÁ DATA PRO AI:', {
    plan: plan?.title,
    environments: environments?.length,
    prepItems: prepItems?.length,
    mainItems: mainItems?.length,
    finishItems: finishItems?.length,
    equipment: equipment?.length
  });
  
  return {
    plan,
    environments: environments || [],
    prepItems: prepItems || [],
    mainItems: mainItems || [],
    finishItems: finishItems || [],
    equipment: equipment || [],
    roles: roles || []
  };
}
