import { Document, Packer, Paragraph, Table } from 'docx';
import { saveAs } from 'file-saver';
import { createCoverPage } from './sections/coverPage';
import { createExecutiveSummary } from './sections/executiveSummary';
import { createDimensionSection, calcularTaxasDinamicas } from './sections/dimensionSection';
import { createQuestionDetail } from './sections/questionDetail';
import { createHeader, createFooter } from './watermark';
import { ESCOLAS, LEGENDAS, DIMENSOES, type EscolaConfig } from './constants';

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

interface ReportParams {
  escolaId: string;
  questoes: Questao[];
  indices: Record<string, Record<string, number[]>>;
  sprmed: Record<string, Record<string, { taxa: number }>>;
  areaFormacao?: string;
  areaConhecimento?: string;
}

function filtrarQuestoes(
  questoes: Questao[],
  areaFormacao?: string,
  areaConhecimento?: string
): Questao[] {
  let filtradas = questoes;

  if (areaFormacao) {
    filtradas = filtradas.filter(
      (q) =>
        q.area_formacao_principal === areaFormacao ||
        (q.area_formacao_secundaria && q.area_formacao_secundaria.includes(areaFormacao))
    );
  }

  if (areaConhecimento) {
    filtradas = filtradas.filter((q) => q.area === areaConhecimento);
  }

  return filtradas;
}

export async function generateReport(params: ReportParams): Promise<void> {
  const { escolaId, questoes, indices, sprmed, areaFormacao, areaConhecimento } = params;

  const escola = ESCOLAS[escolaId];
  if (!escola) throw new Error(`Escola nao encontrada: ${escolaId}`);

  // Filtra questões
  const questoesFiltradas = filtrarQuestoes(questoes, areaFormacao, areaConhecimento);

  // Monta todas as seções
  const children: (Paragraph | Table)[] = [];

  // 1. Capa
  children.push(...createCoverPage(escola, escolaId, { areaFormacao, areaConhecimento }));

  // 2. Sumário executivo
  children.push(...createExecutiveSummary(escola, questoesFiltradas));

  // 3. Seções de dimensão (11 dimensões)
  for (const dim of DIMENSOES) {
    const indice = indices[dim.indiceKey];
    if (!indice || Object.keys(indice).length === 0) continue;

    // Taxas: usa sprmed se disponível, senão calcula dinamicamente
    let taxas: Record<string, { taxa: number }>;
    if (dim.sprmedKey && sprmed[dim.sprmedKey]) {
      taxas = sprmed[dim.sprmedKey];
    } else {
      taxas = calcularTaxasDinamicas(indice, questoesFiltradas);
    }

    const section = createDimensionSection(
      dim.titulo,
      indice,
      taxas,
      questoesFiltradas,
      dim.legendaKey
    );

    if (section.length > 0) {
      children.push(...section);
    }
  }

  // 4. Detalhamento por questão
  children.push(...createQuestionDetail(questoesFiltradas));

  // Monta documento
  const doc = new Document({
    creator: 'SPRMed Dashboard ENAMED 2025',
    title: `Relatorio Filtro SPRMed - ${escola.nome}`,
    description: `Analise de desempenho ENAMED 2025 - ${escola.nome}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1080,  // 0.75 inch
              bottom: 1440,
              left: 1080,
            },
          },
        },
        headers: {
          default: createHeader(),
        },
        footers: {
          default: createFooter(escola.nome),
        },
        children,
      },
    ],
  });

  // Gera e faz download
  const blob = await Packer.toBlob(doc);

  // Monta nome do arquivo
  let filename = `Relatorio_SPRMed_${escolaId}`;
  if (areaFormacao) filename += `_${areaFormacao}`;
  if (areaConhecimento) filename += `_${areaConhecimento.replace(/\s+/g, '_')}`;
  filename += '.docx';

  saveAs(blob, filename);
}
