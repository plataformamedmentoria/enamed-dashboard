import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  PageBreak,
} from 'docx';
import {
  sectionTitle,
  sectionSubtitle,
  bodyText,
  headerCell,
  dataCell,
  borders,
  corTaxa,
  corTaxaBg,
  AZUL_SPR,
  VERDE_SPR,
  VERMELHO,
  CINZA,
  CINZA_CLARO,
  BRANCO,
  emptyLine,
} from '../styles';
import { LEGENDAS } from '../constants';

interface Questao {
  numero: number;
  enunciado: string;
  area: string;
  subespecialidade: string;
  tema: string;
  subtema: string;
  bloom: string;
  competencia_principal: string;
  competencias_secundarias: string;
  dominios: string;
  cenarios: string;
  ciclo_formativo: string;
  eixo_cognitivo: string;
  nivel_cognitivo: string;
  eixos_transversais: string;
  area_formacao_principal: string;
  area_formacao_secundaria: string;
  gabarito: string;
  acertos: number;
  erros: number;
  total: number;
  taxa_acerto: number;
  distribuicao?: {
    A: { qtd: number; pct: number };
    B: { qtd: number; pct: number };
    C: { qtd: number; pct: number };
    D: { qtd: number; pct: number };
  };
  alternativa_a?: string;
  alternativa_b?: string;
  alternativa_c?: string;
  alternativa_d?: string;
}

function tagLine(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 18, color: AZUL_SPR, font: 'Arial' }),
      new TextRun({ text: value, size: 18, color: CINZA, font: 'Arial' }),
    ],
  });
}

export function createQuestionDetail(questoes: Questao[]): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  // Ordena por taxa de acerto (pior primeiro)
  const sorted = [...questoes].sort((a, b) => a.taxa_acerto - b.taxa_acerto);

  elements.push(sectionTitle('Detalhamento por Questao'));
  elements.push(
    bodyText(
      `${sorted.length} questoes ordenadas por taxa de acerto (menor para maior). Para cada questao: enunciado, alternativas com distribuicao de respostas, gabarito e tags pedagogicas.`
    )
  );
  elements.push(emptyLine());

  for (let i = 0; i < sorted.length; i++) {
    const q = sorted[i];

    // Header da questão com número e taxa
    elements.push(
      new Paragraph({
        spacing: { before: 300, after: 100 },
        children: [
          new TextRun({
            text: `Questao ${q.numero}`,
            bold: true,
            size: 24,
            color: AZUL_SPR,
            font: 'Arial',
          }),
          new TextRun({
            text: `   ${q.taxa_acerto.toFixed(1)}% de acerto`,
            bold: true,
            size: 24,
            color: corTaxa(q.taxa_acerto),
            font: 'Arial',
          }),
          new TextRun({
            text: `   |   Gabarito: ${q.gabarito}`,
            size: 20,
            color: CINZA,
            font: 'Arial',
          }),
        ],
      })
    );

    // Tags pedagógicas (compactas)
    const tags: string[] = [];
    if (q.ciclo_formativo) tags.push(`Ciclo: ${q.ciclo_formativo}`);
    if (q.bloom) tags.push(`Bloom: ${q.bloom}`);
    if (q.competencia_principal) tags.push(`Comp: ${q.competencia_principal}`);
    if (q.eixo_cognitivo) tags.push(`Eixo: ${q.eixo_cognitivo}`);
    if (q.nivel_cognitivo) tags.push(`Nivel: ${q.nivel_cognitivo}`);

    if (tags.length > 0) {
      elements.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: tags.join('  |  '),
              size: 16,
              color: VERDE_SPR,
              font: 'Arial',
              italics: true,
            }),
          ],
        })
      );
    }

    // Hierarquia de conteúdo
    const hierarquia: string[] = [];
    if (q.area) hierarquia.push(q.area);
    if (q.subespecialidade) hierarquia.push(q.subespecialidade);
    if (q.tema) hierarquia.push(q.tema);
    if (q.subtema) hierarquia.push(q.subtema);
    if (hierarquia.length > 0) {
      elements.push(tagLine('Conteudo', hierarquia.join(' > ')));
    }

    // Domínios e cenários
    if (q.dominios) elements.push(tagLine('Dominios', q.dominios));
    if (q.cenarios) elements.push(tagLine('Cenarios', q.cenarios));
    if (q.area_formacao_principal) {
      let af = q.area_formacao_principal;
      if (q.area_formacao_secundaria) af += `, ${q.area_formacao_secundaria} (2a)`;
      elements.push(tagLine('Area de Formacao', af));
    }

    // Enunciado (truncado se muito longo)
    const enunciado = q.enunciado.length > 800 ? q.enunciado.substring(0, 800) + '...' : q.enunciado;
    elements.push(
      new Paragraph({
        spacing: { before: 100, after: 100 },
        children: [
          new TextRun({
            text: enunciado,
            size: 20,
            color: CINZA,
            font: 'Arial',
          }),
        ],
      })
    );

    // Tabela de alternativas com distribuição
    if (q.distribuicao) {
      const altRows: TableRow[] = [];

      // Header
      altRows.push(
        new TableRow({
          children: [
            headerCell('Alt', 600),
            headerCell('Texto', 5400),
            headerCell('%', 1000),
            headerCell('Qtd', 1000),
          ],
        })
      );

      for (const letra of ['A', 'B', 'C', 'D'] as const) {
        const dist = q.distribuicao[letra];
        const isGabarito = q.gabarito === letra;
        const textoAlt =
          letra === 'A'
            ? q.alternativa_a
            : letra === 'B'
              ? q.alternativa_b
              : letra === 'C'
                ? q.alternativa_c
                : q.alternativa_d;

        const bgColor = isGabarito ? 'DCFCE7' : undefined;
        const txtColor = isGabarito ? '22C55E' : CINZA;

        altRows.push(
          new TableRow({
            children: [
              new TableCell({
                borders,
                shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
                margins: { top: 40, bottom: 40, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: isGabarito ? `${letra} *` : letra,
                        bold: isGabarito,
                        size: 20,
                        color: txtColor,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders,
                shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
                margins: { top: 40, bottom: 40, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: textoAlt
                          ? textoAlt.length > 120
                            ? textoAlt.substring(0, 120) + '...'
                            : textoAlt
                          : `Alternativa ${letra}`,
                        size: 18,
                        color: txtColor,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders,
                shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
                margins: { top: 40, bottom: 40, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: `${(dist?.pct || 0).toFixed(1)}%`,
                        bold: isGabarito,
                        size: 18,
                        color: txtColor,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders,
                shading: bgColor ? { fill: bgColor, type: ShadingType.CLEAR } : undefined,
                margins: { top: 40, bottom: 40, left: 80, right: 80 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: String(dist?.qtd || 0),
                        size: 18,
                        color: txtColor,
                        font: 'Arial',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        );
      }

      elements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: altRows,
        })
      );
    }

    elements.push(emptyLine());

    // Page break a cada 3 questões
    if ((i + 1) % 3 === 0 && i < sorted.length - 1) {
      elements.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  return elements;
}
