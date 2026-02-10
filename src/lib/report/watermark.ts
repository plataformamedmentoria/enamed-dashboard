import {
  Header,
  Footer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageNumber,
} from 'docx';
import { AZUL_SPR, VERDE_SPR, CINZA } from './styles';

export function createHeader(): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: 'SPRMed',
            bold: true,
            size: 16,
            color: AZUL_SPR,
            font: 'Arial',
          }),
          new TextRun({
            text: '  |  Relatorio Filtro ENAMED 2025',
            size: 14,
            color: CINZA,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: '_______________________________________________________________',
            size: 10,
            color: VERDE_SPR,
          }),
        ],
      }),
    ],
  });
}

export function createFooter(escolaNome: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text: '_______________________________________________________________',
            size: 10,
            color: VERDE_SPR,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 0 },
        children: [
          new TextRun({
            text: 'CONFIDENCIAL',
            bold: true,
            size: 14,
            color: VERMELHO_FOOTER,
            font: 'Arial',
          }),
          new TextRun({
            text: `  |  ${escolaNome}  |  SPRMed Dashboard ENAMED 2025  |  Pagina `,
            size: 12,
            color: CINZA,
            font: 'Arial',
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 12,
            color: CINZA,
            font: 'Arial',
          }),
          new TextRun({
            text: ' de ',
            size: 12,
            color: CINZA,
            font: 'Arial',
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 12,
            color: CINZA,
            font: 'Arial',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 0 },
        children: [
          new TextRun({
            text: 'Este documento e propriedade da SPRMed. Proibida a reproducao sem autorizacao.',
            size: 10,
            color: CINZA,
            font: 'Arial',
            italics: true,
          }),
        ],
      }),
    ],
  });
}

const VERMELHO_FOOTER = 'C0392B';
