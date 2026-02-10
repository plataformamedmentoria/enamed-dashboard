import { BorderStyle, ShadingType, WidthType, AlignmentType, TableCell, Paragraph, TextRun, TableRow } from 'docx';

// Cores SPRMed
export const VERDE_SPR = '148F77';
export const AZUL_SPR = '1A5276';
export const CINZA = '2C3E50';
export const CINZA_CLARO = 'ECF0F1';
export const LARANJA = 'E67E22';
export const VERMELHO = 'C0392B';
export const BRANCO = 'FFFFFF';

// Cores de taxa (semáforo)
export function corTaxa(taxa: number): string {
  if (taxa >= 70) return '22C55E'; // verde
  if (taxa >= 50) return 'F59E0B'; // laranja/amarelo
  return 'EF4444'; // vermelho
}

export function corTaxaBg(taxa: number): string {
  if (taxa >= 70) return 'DCFCE7'; // verde claro
  if (taxa >= 50) return 'FEF3C7'; // amarelo claro
  return 'FEE2E2'; // vermelho claro
}

// Borders padrão para tabelas
const defaultBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
export const borders = {
  top: defaultBorder,
  bottom: defaultBorder,
  left: defaultBorder,
  right: defaultBorder,
};

export const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

// Helpers de criação
export function headerCell(text: string, width?: number): TableCell {
  return new TableCell({
    borders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    shading: { fill: AZUL_SPR, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text, bold: true, color: BRANCO, size: 20, font: 'Arial' }),
        ],
      }),
    ],
  });
}

export function dataCell(
  text: string,
  opts: { shading?: string; color?: string; bold?: boolean; alignment?: typeof AlignmentType.CENTER } = {}
): TableCell {
  return new TableCell({
    borders,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: opts.alignment ?? AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            color: opts.color ?? CINZA,
            bold: opts.bold ?? false,
            size: 20,
            font: 'Arial',
          }),
        ],
      }),
    ],
  });
}

export function headerRow(texts: string[]): TableRow {
  return new TableRow({ children: texts.map((t) => headerCell(t)) });
}

export function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({ text, bold: true, size: 28, color: AZUL_SPR, font: 'Arial' }),
    ],
  });
}

export function sectionSubtitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({ text, bold: true, size: 24, color: VERDE_SPR, font: 'Arial' }),
    ],
  });
}

export function bodyText(text: string, opts: { bold?: boolean; italic?: boolean; color?: string } = {}): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 22,
        font: 'Arial',
        color: opts.color ?? CINZA,
        bold: opts.bold,
        italics: opts.italic,
      }),
    ],
  });
}

export function emptyLine(): Paragraph {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}
