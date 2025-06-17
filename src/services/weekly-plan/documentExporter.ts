
import { supabase } from '@/integrations/supabase/client';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';
import { createExerciseTable } from '@/utils/documentUtils';
import { WeeklyPlanLessonData } from './types';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';
import { saveAs } from 'file-saver';

// Helper function to convert AI ExerciseItem to Component ExerciseItem
const convertExerciseItems = (items: any[], phase: 'preparation' | 'main' | 'finish'): ExerciseItem[] => {
  return items.map(item => ({
    name: item.name,
    description: item.description,
    time: item.time,
    phase: item.phase || phase
  }));
};

export async function exportWeeklyPlanToDocument(
  plan: any,
  lessonsData: Record<string, WeeklyPlanLessonData>
): Promise<void> {
  try {
    console.log('🔄 Exportuji týdenní plán:', plan.title, 'with lessons:', lessonsData);
    
    // Načteme prostředí pro plán
    const { data: environments, error: envError } = await supabase
      .from('weekly_plan_environments')
      .select('environment:environment_id(name)')
      .eq('plan_id', plan.id);
      
    if (envError) {
      console.error('❌ Chyba při načítání prostředí:', envError);
    }
    
    const environmentNames = environments ? 
      environments.map((e: any) => e.environment?.name).filter(Boolean) : [];
    
    // Create document sections for each lesson
    const documentChildren: any[] = [
      new Paragraph({
        text: `Více týdenní plán: ${plan.title}`,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
        },
      }),
      new Paragraph({
        text: `Škola: ${plan.schools?.name || plan.school?.name || 'Neurčeno'}`,
        spacing: {
          after: 200,
        },
      }),
      new Paragraph({
        text: `Ročník: ${plan.grade}`,
        spacing: {
          after: 200,
        },
      }),
      new Paragraph({
        text: `Prostředí: ${environmentNames.join(', ') || 'Neurčeno'}`,
        spacing: {
          after: 400,
        },
      }),
    ];
    
    // Sort lessons by week and lesson number
    const sortedLessonKeys = Object.keys(lessonsData).sort((a, b) => {
      const [weekA, lessonA] = a.split('-').map(Number);
      const [weekB, lessonB] = b.split('-').map(Number);
      
      if (weekA === weekB) {
        return lessonA - lessonB;
      }
      return weekA - weekB;
    });
    
    console.log('📋 Seřazené klíče hodin:', sortedLessonKeys);
    
    // Add each lesson to the document
    for (const key of sortedLessonKeys) {
      const lessonData = lessonsData[key];
      const [week, lessonNumber] = key.split('-').map(Number);
      
      console.log(`📝 Zpracovávám hodinu ${key}:`, lessonData);
      
      if (!lessonData?.exercises) {
        console.log(`⚠️ Žádná cvičení pro hodinu ${key}`);
        continue;
      }
      
      // Add week heading if it's the first lesson of the week
      if (lessonNumber === 1) {
        documentChildren.push(
          new Paragraph({
            text: `Týden ${week}`,
            heading: HeadingLevel.HEADING_1,
            pageBreakBefore: true,
            spacing: {
              after: 200,
            },
          })
        );
      }
      
      // Add lesson heading
      documentChildren.push(
        new Paragraph({
          text: `Hodina ${lessonNumber}`,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 300,
            after: 200,
          },
        })
      );
      
      // Preparation section
      if (lessonData.exercises.preparation && lessonData.exercises.preparation.length > 0) {
        documentChildren.push(
          new Paragraph({
            text: `Přípravná část`,
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 200,
              after: 100,
            },
          })
        );
        
        console.log(`📋 Přidávám přípravná cvičení:`, lessonData.exercises.preparation);
        const convertedPreparationExercises = convertExerciseItems(lessonData.exercises.preparation, 'preparation');
        documentChildren.push(createExerciseTable(convertedPreparationExercises));
      }
      
      // Main section
      if (lessonData.exercises.main && lessonData.exercises.main.length > 0) {
        documentChildren.push(
          new Paragraph({
            text: `Hlavní část`,
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 200,
              after: 100,
            },
          })
        );
        
        console.log(`📋 Přidávám hlavní cvičení:`, lessonData.exercises.main);
        const convertedMainExercises = convertExerciseItems(lessonData.exercises.main, 'main');
        documentChildren.push(createExerciseTable(convertedMainExercises));
      }
      
      // Finish section
      if (lessonData.exercises.finish && lessonData.exercises.finish.length > 0) {
        documentChildren.push(
          new Paragraph({
            text: `Závěrečná část`,
            heading: HeadingLevel.HEADING_3,
            spacing: {
              before: 200,
              after: 100,
            },
          })
        );
        
        console.log(`📋 Přidávám závěrečná cvičení:`, lessonData.exercises.finish);
        const convertedFinishExercises = convertExerciseItems(lessonData.exercises.finish, 'finish');
        documentChildren.push(createExerciseTable(convertedFinishExercises));
      }
    }
    
    console.log('📄 Vytvořeno dokumentových elementů:', documentChildren.length);
    
    // Create document
    const doc = new Document({
      sections: [{
        children: documentChildren
      }]
    });
    
    // Generate and save document
    const buffer = await Packer.toBlob(doc);
    
    // Create filename from plan title
    const fileName = plan.title 
      ? `${plan.title.replace(/\s+/g, '_').replace(/[^\w\-_]/g, '')}_vicetydenni_plan.docx`
      : `vicetydenni_plan_${new Date().toISOString().split('T')[0]}.docx`;
    
    saveAs(buffer, fileName);
    
    console.log('✅ Dokument byl úspěšně vygenerován a stažen:', fileName);
  } catch (error) {
    console.error("❌ Chyba při exportu týdenního plánu:", error);
    throw error;
  }
}
