
/**
 * Získá kompletní informace o vybraných aktivitách na základě jejich ID
 * 
 * @param itemIds - Pole ID vybraných aktivit
 * @param lessonData - Data lekce obsahující seznamy všech aktivit
 * @returns Pole objektů s informacemi o vybraných aktivitách
 */
export const getSelectedItemDetails = async (itemIds: number[], lessonData: any): Promise<any[]> => {
  try {
    if (!itemIds || itemIds.length === 0) return [];
    
    // Shromáždíme všechny dostupné aktivity z dat lekce
    const allItems: any[] = [];
    
    // Kontrola, zda existují allPreparationItems v lessonData
    if (lessonData.allPreparationItems) allItems.push(...lessonData.allPreparationItems);
    if (lessonData.allMainItems) allItems.push(...lessonData.allMainItems);
    if (lessonData.allFinishItems) allItems.push(...lessonData.allFinishItems);
    
    // Pokud nejsou dostupné žádné předdefinované seznamy, použijeme přímo exerciseData
    if (allItems.length === 0 && lessonData.exerciseData) {
      // Přidáme ID k cvičením z exerciseData a přidáme je do seznamu
      if (lessonData.exerciseData.preparation) {
        allItems.push(...lessonData.exerciseData.preparation.map((item: any, index: number) => ({
          ...item,
          id: 1000 + index, // Přidáme umělé ID, pokud neexistuje
          phase: "preparation"
        })));
      }
      if (lessonData.exerciseData.main) {
        allItems.push(...lessonData.exerciseData.main.map((item: any, index: number) => ({
          ...item,
          id: 2000 + index, // Přidáme umělé ID, pokud neexistuje
          phase: "main"
        })));
      }
      if (lessonData.exerciseData.finish) {
        allItems.push(...lessonData.exerciseData.finish.map((item: any, index: number) => ({
          ...item,
          id: 3000 + index, // Přidáme umělé ID, pokud neexistuje
          phase: "finish"
        })));
      }
    }
    
    // Pokud stále nemáme žádné položky a jsou k dispozici vybrané ID, vytvoříme je z aktuálních cvičení
    if (allItems.length === 0 && lessonData.selectedItems) {
      const extractedExercises: any[] = [];
      
      // Pro každou fázi zkontrolujeme, zda existují vybraná ID a přidáme odpovídající cvičení
      const phases = ['preparation', 'main', 'finish'];
      phases.forEach(phase => {
        const phaseKey = `${phase}Items` as keyof typeof lessonData.selectedItems;
        if (lessonData.selectedItems[phaseKey] && lessonData.exerciseData && lessonData.exerciseData[phase]) {
          // Pokud máme vybraná ID pro danou fázi, vezmeme odpovídající cvičení z exerciseData
          lessonData.exerciseData[phase].forEach((exercise: any, index: number) => {
            extractedExercises.push({
              id: (phase === 'preparation' ? 1000 : phase === 'main' ? 2000 : 3000) + index,
              name: exercise.name,
              description: exercise.description,
              duration: exercise.time,
              phase: phase
            });
          });
        }
      });
      
      if (extractedExercises.length > 0) {
        allItems.push(...extractedExercises);
      }
    }
    
    console.log("Available items for selection:", allItems);
    console.log("Looking for item IDs:", itemIds);
    
    // Filtrujeme aktivity podle ID a získáme jejich kompletní detaily
    let selectedItems = allItems
      .filter(item => itemIds.includes(item.id))
      .filter(item => item !== undefined);
    
    // Pokud jsme nenašli všechny položky podle ID, zkusíme použít přímo exerciseData pro danou fázi
    if (selectedItems.length === 0 && lessonData.exerciseData) {
      console.log("Item IDs not found in allItems, using exerciseData directly");
      
      // Určíme fázi na základě prvního ID (předpokládáme, že všechna ID jsou ze stejné fáze)
      let phase;
      if (itemIds[0] >= 1000 && itemIds[0] < 2000) phase = 'preparation';
      else if (itemIds[0] >= 2000 && itemIds[0] < 3000) phase = 'main';
      else if (itemIds[0] >= 3000) phase = 'finish';
      
      if (phase && lessonData.exerciseData[phase]) {
        selectedItems = lessonData.exerciseData[phase].map((item: any, index: number) => ({
          id: (phase === 'preparation' ? 1000 : phase === 'main' ? 2000 : 3000) + index,
          name: item.name,
          description: item.description,
          duration: item.time,
          phase: phase
        }));
      }
    }
    
    // Log pro debugging, abychom viděli detaily aktivit
    console.log("Selected item details for prompt generation:", selectedItems);
    
    return selectedItems;
  } catch (error) {
    console.error("Chyba při získávání detailů aktivit:", error);
    return [];
  }
};

/**
 * Získá názvy vybraných aktivit na základě jejich ID
 * 
 * @param itemIds - Pole ID vybraných aktivit
 * @param lessonData - Data lekce obsahující seznamy všech aktivit
 * @returns Pole názvů vybraných aktivit
 */
export const getSelectedItemNames = async (itemIds: number[], lessonData: any): Promise<string[]> => {
  try {
    const selectedItems = await getSelectedItemDetails(itemIds, lessonData);
    return selectedItems.map(item => item.name);
  } catch (error) {
    console.error("Chyba při získávání názvů aktivit:", error);
    return [];
  }
};
