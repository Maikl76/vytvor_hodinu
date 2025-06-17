
/**
 * Přeloží název fáze z angličtiny do češtiny
 * 
 * @param phase - Název fáze v angličtině
 * @returns Přeložený název fáze
 */
export const translatePhase = (phase: string): string => {
  switch (phase) {
    case 'preparation': return 'přípravná část';
    case 'main': return 'hlavní část';
    case 'finish': return 'závěrečná část';
    default: return phase;
  }
};
