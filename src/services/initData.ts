
import { supabase } from "@/integrations/supabase/client";

// Sample data for initial load
const sampleSchools = [
  { name: 'ZŠ Komenského', lessons_per_week: 2 },
  { name: 'ZŠ Masarykova', lessons_per_week: 3 },
  { name: 'ZŠ Jiráskova', lessons_per_week: 2 }
];

const sampleEnvironments = [
  { name: 'Tělocvična' },
  { name: 'Hřiště' },
  { name: 'Bazén' },
  { name: 'Les' }
];

const sampleEquipment = [
  { name: 'Míče' },
  { name: 'Švihadla' },
  { name: 'Žíněnky' },
  { name: 'Kužely' },
  { name: 'Překážky' }
];

const sampleConstructs = [
  { 
    name: 'Fyzická zdatnost', 
    description: 'Cvičení pro rozvoj fyzické zdatnosti',
    items: [
      { name: 'Běh', description: 'Běh na různé vzdálenosti', duration: 5 },
      { name: 'Skoky', description: 'Skoky z místa i s rozběhem', duration: 7 },
    ]
  },
  { 
    name: 'Manipulace s předměty', 
    description: 'Cvičení pro rozvoj manipulace s předměty',
    items: [
      { name: 'Míč', description: 'Házení a chytání míče', duration: 8 },
      { name: 'Švihadlo', description: 'Skákání přes švihadlo', duration: 6 },
    ]
  },
  { 
    name: 'Lokomoce', 
    description: 'Cvičení pro rozvoj pohybových dovedností',
    items: [
      { name: 'Plazení', description: 'Plazení různými způsoby', duration: 5 },
      { name: 'Lezení', description: 'Lezení po žebřinách', duration: 7 },
    ]
  }
];

// Function to initialize data if tables are empty
export const initializeDatabaseIfEmpty = async () => {
  try {
    // Check if tables are empty
    const [schoolsCount, environmentsCount, equipmentCount, constructsCount] = await Promise.all([
      supabase.from('schools').select('*', { count: 'exact', head: true }),
      supabase.from('environments').select('*', { count: 'exact', head: true }),
      supabase.from('equipment').select('*', { count: 'exact', head: true }),
      supabase.from('constructs').select('*', { count: 'exact', head: true })
    ]);
    
    // Initialize schools if empty
    if (schoolsCount.count === 0) {
      await supabase.from('schools').insert(sampleSchools);
      console.log('Initialized schools data');
    }
    
    // Initialize environments if empty
    if (environmentsCount.count === 0) {
      await supabase.from('environments').insert(sampleEnvironments);
      console.log('Initialized environments data');
    }
    
    // Initialize equipment if empty
    if (equipmentCount.count === 0) {
      await supabase.from('equipment').insert(sampleEquipment);
      console.log('Initialized equipment data');
    }
    
    // Initialize constructs if empty
    if (constructsCount.count === 0) {
      // First insert the constructs
      for (const construct of sampleConstructs) {
        const { data: constructData, error: constructError } = await supabase
          .from('constructs')
          .insert({
            name: construct.name,
            description: construct.description
          })
          .select()
          .single();
        
        if (constructError) {
          console.error('Error inserting construct:', constructError);
          continue;
        }
        
        // Then insert the items for this construct
        if (construct.items && construct.items.length > 0) {
          const itemsWithConstructId = construct.items.map(item => ({
            ...item,
            construct_id: constructData.id
          }));
          
          const { error: itemsError } = await supabase
            .from('construct_items')
            .insert(itemsWithConstructId);
          
          if (itemsError) {
            console.error('Error inserting construct items:', itemsError);
          }
        }
      }
      console.log('Initialized constructs data');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
