import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  TextRun,
  PageBreak,
} from 'docx';
import {
  sectionTitle,
  bodyText,
  headerCell,
  dataCell,
  borders,
  corTaxa,
  corTaxaBg,
  CINZA,
  CINZA_CLARO,
  emptyLine,
} from '../styles';
import { LEGENDAS } from '../constants';

interface DimensionItem {
  nome: string;
  taxa: number;
  qtd: number;
  numeros: number[];
}

interface DimQuestao {
  numero: number;
  acertos: number;
  erros: number;
  total: number;
  taxa_acerto: number;
}

export function createDimensionSection(
  titulo: string,
  indice: Record<string, number[]>,
  taxas: Record<string, { taxa: number }>,
  questoesFiltradas: DimQuestao[],
  legendaKey?: string
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];
  const legendas = legendaKey ? LEGENDAS[legendaKey] || {} : {};

  // Monta dados
  const items: DimensionItem[] = [];
  for (const [nome, numeros] of Object.entries(indice)) {
    const qs = questoesFiltradas.filter((q) => numeros.includes(q.numero));
    if (qs.length === 0) continue;

    const taxa = taxas[nome]?.taxa ?? 0;
    items.push({ nome, taxa, qtd: qs.length, numeros });
  }

  if (items.length === 0) return [];

  // Ordena por taxa ascendente (pior primeiro)
  items.sort((a, b) => a.taxa - b.taxa);

  elements.push(sectionTitle(titulo));

  // Descrição com legenda se disponível
  if (legendaKey) {
    const desc = items
      .slice(0, 3)
      .map((i) => `${i.nome} = ${legendas[i.nome] || i.nome}`)
      .join(' | ');
    elements.push(bodyText(desc, { italic: true }));
  }

  elements.push(emptyLine());

  // Cria tabela
  const headerRow = new TableRow({
    children: [
      headerCell('Codigo', 2000),
      headerCell('Descricao', 4000),
      headerCell('Taxa de Acerto', 1800),
      headerCell('Questoes', 1200),
    ],
  });

  const dataRows = items.map((item) => {
    const taxaColor = corTaxa(item.taxa);
    const taxaBg = corTaxaBg(item.taxa);
    const descricao = legendas[item.nome] || item.nome;

    return new TableRow({
      children: [
        dataCell(item.nome, { bold: true, alignment: AlignmentType.CENTER }),
        dataCell(descricao),
        // Célula com cor de fundo baseada na taxa
        new TableCell({
          borders,
          shading: { fill: taxaBg, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${item.taxa.toFixed(1)}%`,
                  bold: true,
                  color: taxaColor,
                  size: 22,
                  font: 'Arial',
                }),
              ],
            }),
          ],
        }),
        dataCell(String(item.qtd), { alignment: AlignmentType.CENTER }),
      ],
    });
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });

  elements.push(table);
  elements.push(emptyLine());

  // Resumo
  const pior = items[0];
  const melhor = items[items.length - 1];
  elements.push(
    bodyText(
      `Menor taxa: ${pior.nome} (${pior.taxa.toFixed(1)}%) | Maior taxa: ${melhor.nome} (${melhor.taxa.toFixed(1)}%)`
    )
  );

  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

// Calcula taxas a partir de índices e questões filtradas
export function calcularTaxasDinamicas(
  indice: Record<string, number[]>,
  questoes: DimQuestao[]
): Record<string, { taxa: number }> {
  const taxas: Record<string, { taxa: number }> = {};
  for (const [nome, numeros] of Object.entries(indice)) {
    const qs = questoes.filter((q) => numeros.includes(q.numero));
    const totalAcertos = qs.reduce((s, q) => s + q.acertos, 0);
    const totalRespostas = qs.reduce((s, q) => s + q.total, 0);
    taxas[nome] = {
      taxa: totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0,
    };
  }
  return taxas;
}
