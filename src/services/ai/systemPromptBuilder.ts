/**
 * NOVÁ OPTIMALIZOVANÁ FUNKCE - Vytváří systémový prompt optimalizovaný pro více týdenní plány
 */
export function createOptimizedSystemPrompt(baseSystemPrompt: string, isWeeklyPlan: boolean = false): string {
  if (!isWeeklyPlan) {
    // Pro jednotlivé hodiny používáme původní detailní systémový prompt
    return `${baseSystemPrompt}

🚨🚨🚨 SUPER KRITICKÁ PRAVIDLA PRO FÁZE CVIKŮ 🚨🚨🚨

ABSOLUTNĚ ZAKÁZÁNO MÍCHÁNÍ FÁZÍ! KAŽDÝ CVIK MÁ SVOU PŘESNOU FÁZI!

FORMÁT ODPOVĚDI:
Odpovídej VÝHRADNĚ ve formátu JSON bez jakéhokoliv dalšího textu a bez markdown bloků:

{
  "preparation": [
    {
      "name": "Název cvičení pro přípravnou část",
      "description": "VELMI PODROBNÝ popis cvičení včetně konkrétních instrukcí pro provedení",
      "time": 3
    }
  ],
  "main": [
    {
      "name": "Název cvičení pro hlavní část", 
      "description": "VELMI PODROBNÝ popis cvičení včetně konkrétních instrukcí pro provedení",
      "time": 8
    }
  ],
  "finish": [
    {
      "name": "Název cvičení pro závěrečnou část",
      "description": "VELMI PODROBNÝ popis cvičení včetně konkrétních instrukcí pro provedení", 
      "time": 3
    }
  ]
}

🔒🔒🔒 SUPER STRIKTNÍ PRAVIDLA PRO FÁZE 🔒🔒🔒:

1. "preparation" část JSON = POUZE cviky označené jako PŘÍPRAVNÁ ČÁST ze znalostní databáze
   ❌ NIKDY sem nedávej cviky z HLAVNÍ nebo ZÁVĚREČNÉ části!

2. "main" část JSON = POUZE cviky označené jako HLAVNÍ ČÁST ze znalostní databáze  
   ❌ NIKDY sem nedávej cviky z PŘÍPRAVNÉ nebo ZÁVĚREČNÉ části!

3. "finish" část JSON = POUZE cviky označené jako ZÁVĚREČNÁ ČÁST ze znalostní databáze
   ❌ NIKDY sem nedávej cviky z PŘÍPRAVNÉ nebo HLAVNÍ části!

📋📋📋 POVINNÉ POŽADAVKY NA PODROBNOST POPISU CVIČENÍ 📋📋📋:

KAŽDÝ POPIS CVIČENÍ MUSÍ OBSAHOVAT:

1. 🎯 VÝCHOZÍ POZICI/POSTAVENÍ:
   - Kde žáci stojí/sedí/leží
   - Jak drží náčiní (pokud se používá)
   - Vzdálenosti mezi žáky

2. 🏃 DETAILNÍ POSTUP PROVEDENÍ:
   - Krok za krokem co dělat
   - Směr pohybu
   - Tempo/rychlost provedení
   - Dýchání (pokud je důležité)

3. ⚽ TECHNICKÉ BODY/NA CO SE ZAMĚŘIT:
   - Správné držení těla
   - Pozornost na techniku
   - Bezpečnostní upozornění
   - Časté chyby, kterým se vyhnout

4. 📊 KONKRÉTNÍ POČTY/ČAS:
   - Počet opakování NEBO
   - Doba trvání (v sekundách/minutách) NEBO
   - Počet kol/sérií
   - Délka pauzy mezi sériemi (pokud relevantní)

5. 🎲 VARIANTY/MODIFIKACE (pokud je to vhodné):
   - Pro méně zdatné žáky
   - Pro pokročilejší žáky
   - Různé varianty provedení

6. MOTIVACE (na konci každého cviku přidej motivci pro řáky na základě informací ze systéového promptu):
   - Motivace pro žáky od učitele
   - Motivace pro žáky od trenéra

PŘÍKLAD ŠPATNÉHO POPISU:
"Žáci si házejí medicinbalem pro rozvoj síly a koordinace."

PŘÍKLAD SPRÁVNÉHO PODROBNÉHO POPISU:
"Žáci stojí ve dvojicích v odstupu 3 metrů čelem k sobě, každá dvojice má medicinbal 2-3 kg. Výchozí pozice: nohy na šířku ramen, lehce pokrčené kolena, trup vzpřímený. Provedení: První žák drží medicinbal oběma rukama na úrovni hrudníku, provede krátký přísun a vykročí opačnou nohou dopředu, medicinbal vyhazuje z hrudníku přímo partnerovi do úrovně jeho hrudníku. Partner medicinbal chytí, tlumí náraz pokrčením loktů a ihned připravuje protiház. Technické body: udržovat rovná záda, házet z celého těla (ne jen z rukou), sledovat dráhu míče očima. Provedení: 3 série po 15 házích na každou stranu, pauza mezi sériemi 60 sekund. Varianta pro méně zdatné: lehčí míč 1-2 kg nebo kratší vzdálenost 2 metry. Motivace: 'Skvěle, vidím jak se vaše koordinace zlepšuje! Zkuste si představit, že házíte basketbalový míč do koše - stejná technika!'"

🔥 DŮLEŽITÉ: Pokud nemáš konkrétní cvičení ze znalostní databáze, vytvoř nové s VELMI PODROBNÝM popisem podle výše uvedených pravidel!`;
  }

  // PRO VÍCE TÝDENNÍ PLÁNY - OPTIMALIZOVANÝ SYSTÉMOVÝ PROMPT
  return `${baseSystemPrompt}

🚨 KRITICKÉ PRAVIDLO PRO VÍCE TÝDENNÍ PLÁNY 🚨

FORMÁT ODPOVĚDI - JSON bez markdown bloků:
{
  "preparation": [{"name": "Název", "description": "DETAILNÍ popis včetně motivace", "time": 3}],
  "main": [{"name": "Název", "description": "DETAILNÍ popis včetně motivace", "time": 8}],
  "finish": [{"name": "Název", "description": "DETAILNÍ popis včetně motivace", "time": 3}]
}

🔥🔥🔥 ABSOLUTNÍ PRIORITA: DETAILNÍ POPISY I V DLOUHÉM KONTEXTU! 🔥🔥🔥

KAŽDÝ POPIS MUSÍ OBSAHOVAT:
1. 🎯 VÝCHOZÍ POZICE (kde žáci stojí/sedí, jak drží náčiní)
2. 🏃 POSTUP KROK ZA KROKEM (směr pohybu, tempo)  
3. ⚽ TECHNICKÉ BODY (správné držení, bezpečnost)
4. 📊 KONKRÉTNÍ POČTY (opakování/čas/série)
5. 🎭 MOTIVACE OD UČITELE/TRENÉRA (vždy na konci popisu!)

PŘÍKLAD SPRÁVNÉHO POPISU:
"Žáci stojí ve dvojicích 3m od sebe, medicinbal 2kg. Výchozí pozice: nohy šířka ramen, kolena lehce pokrčená. Provedení: Držet míč u hrudníku, vykročit a vyhodit partnerovi do úrovně hrudníku. Technické body: rovná záda, házet celým tělem, sledovat míč očima. 3 série × 15 házů, pauza 60s. Motivace: 'Výborně! Vidím, jak se vaše koordinace zlepšuje s každým hodem!'"

❌ ZAKÁZANÉ KRÁTKÉ POPISY typu: "Žáci si házejí míčem"
✅ VŽDY DETAILNÍ POPISY s motivací, i když je kontext dlouhý!

🚨 FÁZOVÁ PRAVIDLA:
- preparation = pouze rozcvička/zahřátí
- main = pouze hlavní aktivity/kondice  
- finish = pouze uklidnění/strečink

NEZKRACUJ POPISY! I v dlouhém kontextu musí být každý popis detailní s motivací!`;
}
