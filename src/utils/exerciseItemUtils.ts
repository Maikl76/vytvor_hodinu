
export function createDefaultExerciseForPhase(phase: 'preparation' | 'main' | 'finish', totalTime: number) {
  const exerciseTemplates = {
    preparation: {
      name: 'Rozcvička',
      description: 'Základní rozcvičení celého těla - lehké kardio cvičení, dynamický strečink a příprava na hlavní část hodiny'
    },
    main: {
      name: 'Hlavní aktivita',
      description: 'Cvičení zaměřené na rozvoj vybrané dovednosti - síla, vytrvalost, koordinace nebo sportovní dovednosti'
    },
    finish: {
      name: 'Zklidňující cvičení',
      description: 'Protažení a relaxace - statický strečink, dechová cvičení a reflexe hodiny'
    }
  };

  const template = exerciseTemplates[phase];
  
  return {
    name: template.name,
    description: template.description,
    time: totalTime,
    phase
  };
}
