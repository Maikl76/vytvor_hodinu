
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle, 
  WidthType, 
  AlignmentType, 
  HeadingLevel,
  SectionType
} from 'docx';
import { saveAs } from 'file-saver';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

// Funkce pro vytvoření a stažení Word dokumentu s plánem hodiny
export const generateAndDownloadLessonPlan = async (
  lessonData: any, 
  equipmentNames: string[], 
  exerciseData: {
    preparation: ExerciseItem[],
    main: ExerciseItem[],
    finish: ExerciseItem[]
  }
) => {
  const totalTime = lessonData ? lessonData.preparationTime + lessonData.mainTime + lessonData.finishTime : 0;

  try {
    // Vytvoření nového dokumentu s sections property
    const doc = new Document({
      sections: [{
        properties: {
          type: SectionType.NEXT_PAGE
        },
        children: [
          new Paragraph({
            text: "Plán hodiny tělesné výchovy",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
          }),
          
          // Základní informace o hodině
          createInfoTable(lessonData, equipmentNames, totalTime),
          
          // Přípravná část
          new Paragraph({
            text: `Přípravná část (${lessonData.preparationTime} minut) - ${lessonData.preparationRole || ""}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          
          // Tabulka s cviky pro přípravnou část
          createExerciseTable(exerciseData.preparation),
          
          // Hlavní část
          new Paragraph({
            text: `Hlavní část (${lessonData.mainTime} minut) - ${lessonData.mainRole || ""}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          
          // Tabulka s cviky pro hlavní část
          createExerciseTable(exerciseData.main),
          
          // Závěrečná část
          new Paragraph({
            text: `Závěrečná část (${lessonData.finishTime} minut) - ${lessonData.finishRole || ""}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 400,
              after: 200,
            },
          }),
          
          // Tabulka s cviky pro závěrečnou část
          createExerciseTable(exerciseData.finish),
        ],
      }],
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28,
              bold: true,
              color: "2E5AAC"
            },
            paragraph: {
              spacing: {
                after: 120,
              }
            }
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 26,
              bold: true,
              color: "2E5AAC"
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              }
            }
          }
        ]
      }
    });

    // Generování dokumentu
    const buffer = await Packer.toBlob(doc);
    
    // Použijeme název hodiny místo konstruktu pro název souboru
    const fileName = lessonData.title 
      ? `${lessonData.title.replace(/\s+/g, '_').replace(/[^\w\-_]/g, '')}.docx`
      : `plan_hodiny_${lessonData.construct.replace(/\s+/g, '_')}.docx`;
    
    // Stažení dokumentu
    saveAs(buffer, fileName);
    
    return true;
  } catch (error) {
    console.error("Chyba při generování dokumentu:", error);
    return false;
  }
};

// Pomocná funkce pro vytvoření tabulky s informacemi o hodině
function createInfoTable(lessonData: any, equipmentNames: string[], totalTime: number) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Škola:")] }),
          new TableCell({ children: [new Paragraph(lessonData.school || "Neurčeno")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Název hodiny:")] }),
          new TableCell({ children: [new Paragraph(`Tělesná výchova - ${lessonData.construct}`)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Prostředí:")] }),
          new TableCell({ children: [new Paragraph(lessonData.environment || "Neurčeno")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Vybavení:")] }),
          new TableCell({ 
            children: [
              new Paragraph(
                equipmentNames.length > 0 
                  ? equipmentNames.join(', ')
                  : 'Žádné'
              )
            ] 
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Cvičební konstrukt:")] }),
          new TableCell({ children: [new Paragraph(lessonData.construct || "")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Časová dotace:")] }),
          new TableCell({ 
            children: [
              new Paragraph(
                `${totalTime} minut (Přípravná: ${lessonData.preparationTime}, ` +
                `Hlavní: ${lessonData.mainTime}, Závěrečná: ${lessonData.finishTime})`
              )
            ] 
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Vedení hodiny:")] }),
          new TableCell({ 
            children: [
              new Paragraph(
                `Přípravná část: ${lessonData.preparationRole || 'Neurčeno'}, ` +
                `Hlavní část: ${lessonData.mainRole || 'Neurčeno'}, ` +
                `Závěrečná část: ${lessonData.finishRole || 'Neurčeno'}`
              )
            ] 
          }),
        ],
      }),
    ],
  });
}

// Pomocná funkce pro vytvoření tabulky s cvičeními
export function createExerciseTable(exercises: ExerciseItem[]) {
  const rows = exercises.map(exercise => {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(exercise.name)] }),
        new TableCell({ children: [new Paragraph(exercise.description || '')] }),
        new TableCell({ 
          children: [new Paragraph(`${exercise.time} min`)],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
      ],
    });
  });

  // Přidání záhlaví tabulky
  rows.unshift(
    new TableRow({
      children: [
        new TableCell({ 
          children: [new Paragraph({ text: "Název cviku", style: "Strong" })],
        }),
        new TableCell({ 
          children: [new Paragraph({ text: "Popis", style: "Strong" })],
        }),
        new TableCell({ 
          children: [new Paragraph({ text: "Čas (min)", style: "Strong" })],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
      ],
    })
  );

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
    },
    rows: rows,
  });
}
