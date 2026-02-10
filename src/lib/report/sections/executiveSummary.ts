import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  PageBreak,
} from 'docx';
import {
  sectionTitle,
  bodyText,
  headerRow,
  dataCell,
  borders,
  corTaxa,
  corTaxaBg,
  AZUL_SPR,
  CINZA,
  VERDE_SPR,
  VERMELHO,
  emptyLine,
} from '../styles';
import { EscolaConfig } from '../constants';

interface SummaryQuestao {
  numero: number;
  enunciado: string;
  area: string;
  tema: string;
  taxa_acerto: number;
  acertos: number;
  erros: number;
  total: number;
}

export function createExecutiveSummary(
  escola: EscolaConfig,
  questoes: SummaryQuestao[]
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(sectionTitle('Sumario Executivo'));

  // Estatísticas gerais
  const totalQuestoes = questoes.length;
  const totalAcertos = questoes.reduce((s, q) => s + q.acertos, 0);
  const totalRespostas = questoes.reduce((s, q) => s + q.total, 0);
  const mediaGeral = totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0;

  // Questão mais difícil e mais fácil
  const sorted = [...questoes].sort((a, b) => a.taxa_acerto - b.taxa_acerto);
  const maisDificil = sorted[0];
  const maisFacil = sorted[sorted.length - 1];

  // Questões por faixa
  const verdes = questoes.filter((q) => q.taxa_acerto >= 70).length;
  const amarelas = questoes.filter((q) => q.taxa_acerto >= 50 && q.taxa_acerto < 70).length;
  const vermelhas = questoes.filter((q) => q.taxa_acerto < 50).length;

  elements.push(
    bodyText(
      `Este relatorio apresenta a analise detalhada do desempenho da ${escola.nome} (${escola.cidade}/${escola.uf}) no ENAMED 2025, filtrado por ${totalQuestoes} questoes.`
    )
  );

  elements.push(emptyLine());

  // Tabela de indicadores
  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      headerRow(['Indicador', 'Valor', 'Observacao']),
      new TableRow({
        children: [
          dataCell('Total de Questoes', { bold: true }),
          dataCell(String(totalQuestoes), { alignment: AlignmentType.CENTER }),
          dataCell('Questoes no escopo dos filtros aplicados'),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Media de Acerto', { bold: true }),
          dataCell(`${mediaGeral.toFixed(1)}%`, {
            color: corTaxa(mediaGeral),
            bold: true,
            alignment: AlignmentType.CENTER,
          }),
          dataCell(`Nacional: 65.03 | Gap: ${(escola.nota - 65.03).toFixed(2)} pts`),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Nota Media', { bold: true }),
          dataCell(String(escola.nota), { alignment: AlignmentType.CENTER }),
          dataCell(`Proficiencia TRI: ${escola.proficiencia}`),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Questoes >= 70% (verde)', { bold: true }),
          dataCell(String(verdes), { color: '22C55E', alignment: AlignmentType.CENTER }),
          dataCell(`${((verdes / totalQuestoes) * 100).toFixed(0)}% do total`),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Questoes 50-70% (amarelo)', { bold: true }),
          dataCell(String(amarelas), { color: 'F59E0B', alignment: AlignmentType.CENTER }),
          dataCell(`${((amarelas / totalQuestoes) * 100).toFixed(0)}% do total`),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Questoes < 50% (vermelho)', { bold: true }),
          dataCell(String(vermelhas), { color: 'EF4444', alignment: AlignmentType.CENTER }),
          dataCell(`${((vermelhas / totalQuestoes) * 100).toFixed(0)}% do total`),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Questao Mais Dificil', { bold: true }),
          dataCell(
            maisDificil ? `Q${maisDificil.numero} (${maisDificil.taxa_acerto.toFixed(1)}%)` : 'N/A',
            { color: VERMELHO, alignment: AlignmentType.CENTER }
          ),
          dataCell(maisDificil ? `${maisDificil.area} - ${maisDificil.tema || ''}` : ''),
        ],
      }),
      new TableRow({
        children: [
          dataCell('Questao Mais Facil', { bold: true }),
          dataCell(
            maisFacil ? `Q${maisFacil.numero} (${maisFacil.taxa_acerto.toFixed(1)}%)` : 'N/A',
            { color: VERDE_SPR, alignment: AlignmentType.CENTER }
          ),
          dataCell(maisFacil ? `${maisFacil.area} - ${maisFacil.tema || ''}` : ''),
        ],
      }),
    ],
  });

  elements.push(summaryTable);
  elements.push(emptyLine());

  // Legenda de cores
  elements.push(
    bodyText('Legenda de cores: Verde (>= 70%) = bom desempenho | Amarelo (50-70%) = atencao | Vermelho (< 50%) = critico', {
      italic: true,
    })
  );

  // Page break
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}
