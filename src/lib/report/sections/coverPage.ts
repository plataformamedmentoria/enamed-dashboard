import {
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
} from 'docx';
import { AZUL_SPR, VERDE_SPR, CINZA, emptyLine } from '../styles';
import { EscolaConfig } from '../constants';

export function createCoverPage(
  escola: EscolaConfig,
  escolaId: string,
  filtros: { areaFormacao?: string; areaConhecimento?: string }
): Paragraph[] {
  const now = new Date();
  const timestamp = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const elements: Paragraph[] = [];

  // Espaço superior
  for (let i = 0; i < 6; i++) elements.push(emptyLine());

  // Título principal
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: 'RELATORIO FILTRO SPRMED',
          bold: true,
          size: 48,
          color: AZUL_SPR,
          font: 'Arial',
        }),
      ],
    })
  );

  // Subtítulo
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'Analise de Desempenho ENAMED 2025',
          size: 28,
          color: VERDE_SPR,
          font: 'Arial',
        }),
      ],
    })
  );

  elements.push(emptyLine());

  // Linha divisória (simulada com underscores)
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: '________________________________________',
          color: VERDE_SPR,
          size: 24,
          font: 'Arial',
        }),
      ],
    })
  );

  elements.push(emptyLine());

  // Nome da escola
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: escola.nome,
          bold: true,
          size: 36,
          color: CINZA,
          font: 'Arial',
        }),
      ],
    })
  );

  // Cidade/UF
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${escola.cidade} / ${escola.uf}`,
          size: 24,
          color: CINZA,
          font: 'Arial',
        }),
      ],
    })
  );

  // Filtros aplicados
  if (filtros.areaFormacao || filtros.areaConhecimento) {
    elements.push(emptyLine());
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: 'Filtros aplicados:',
            bold: true,
            size: 22,
            color: CINZA,
            font: 'Arial',
          }),
        ],
      })
    );
    if (filtros.areaFormacao) {
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `Area de Formacao: ${filtros.areaFormacao}`,
              size: 22,
              color: VERDE_SPR,
              font: 'Arial',
            }),
          ],
        })
      );
    }
    if (filtros.areaConhecimento) {
      elements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: `Area de Conhecimento: ${filtros.areaConhecimento}`,
              size: 22,
              color: VERDE_SPR,
              font: 'Arial',
            }),
          ],
        })
      );
    }
  }

  elements.push(emptyLine());
  elements.push(emptyLine());

  // Timestamp
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Gerado em: ${timestamp}`,
          size: 20,
          color: CINZA,
          font: 'Arial',
          italics: true,
        }),
      ],
    })
  );

  // Alunos
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `${escola.alunos} alunos avaliados`,
          size: 20,
          color: CINZA,
          font: 'Arial',
        }),
      ],
    })
  );

  // Page break
  elements.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  return elements;
}
