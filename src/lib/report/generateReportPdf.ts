/* eslint-disable @typescript-eslint/no-explicit-any */
import { ESCOLAS, LEGENDAS, DIMENSOES } from './constants';

type Content = any;
type TableCell = any;

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

// Cores
const AZUL = '#1A5276';
const VERDE = '#148F77';
const CINZA = '#2C3E50';
const VERDE_HEX = '#22C55E';
const AMARELO_HEX = '#F59E0B';
const VERMELHO_HEX = '#EF4444';

function corTaxa(taxa: number): string {
  if (taxa >= 70) return VERDE_HEX;
  if (taxa >= 50) return AMARELO_HEX;
  return VERMELHO_HEX;
}

function corTaxaBg(taxa: number): string {
  if (taxa >= 70) return '#DCFCE7';
  if (taxa >= 50) return '#FEF3C7';
  return '#FEE2E2';
}

function filtrarQuestoes(questoes: Questao[], areaFormacao?: string, areaConhecimento?: string): Questao[] {
  let filtradas = questoes;
  if (areaFormacao) {
    filtradas = filtradas.filter(
      (q) => q.area_formacao_principal === areaFormacao ||
        (q.area_formacao_secundaria && q.area_formacao_secundaria.includes(areaFormacao))
    );
  }
  if (areaConhecimento) {
    filtradas = filtradas.filter((q) => q.area === areaConhecimento);
  }
  return filtradas;
}

function calcularTaxasDinamicas(indice: Record<string, number[]>, questoes: Questao[]): Record<string, { taxa: number }> {
  const taxas: Record<string, { taxa: number }> = {};
  for (const [nome, numeros] of Object.entries(indice)) {
    const qs = questoes.filter((q) => numeros.includes(q.numero));
    const totalAcertos = qs.reduce((s, q) => s + q.acertos, 0);
    const totalRespostas = qs.reduce((s, q) => s + q.total, 0);
    taxas[nome] = { taxa: totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0 };
  }
  return taxas;
}

// --- Seções do PDF ---

function buildCoverPage(escola: typeof ESCOLAS[string], filtros: { areaFormacao?: string; areaConhecimento?: string }): Content[] {
  const now = new Date();
  const timestamp = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const content: Content[] = [
    { text: '', margin: [0, 120, 0, 0] },
    { text: 'RELATORIO FILTRO SPRMED', style: 'coverTitle', alignment: 'center' },
    { text: 'Analise de Desempenho ENAMED 2025', style: 'coverSubtitle', alignment: 'center' },
    { text: '', margin: [0, 20, 0, 0] },
    { canvas: [{ type: 'line', x1: 100, y1: 0, x2: 420, y2: 0, lineWidth: 2, lineColor: VERDE }] },
    { text: '', margin: [0, 20, 0, 0] },
    { text: escola.nome, style: 'coverSchool', alignment: 'center' },
    { text: `${escola.cidade} / ${escola.uf}`, alignment: 'center', fontSize: 14, color: CINZA, margin: [0, 5, 0, 0] },
  ];

  if (filtros.areaFormacao || filtros.areaConhecimento) {
    content.push({ text: '', margin: [0, 20, 0, 0] });
    content.push({ text: 'Filtros aplicados:', alignment: 'center', fontSize: 11, bold: true, color: CINZA });
    if (filtros.areaFormacao) content.push({ text: `Area de Formacao: ${filtros.areaFormacao}`, alignment: 'center', fontSize: 11, color: VERDE });
    if (filtros.areaConhecimento) content.push({ text: `Area de Conhecimento: ${filtros.areaConhecimento}`, alignment: 'center', fontSize: 11, color: VERDE });
  }

  content.push({ text: '', margin: [0, 30, 0, 0] });
  content.push({ text: `Gerado em: ${timestamp}`, alignment: 'center', fontSize: 10, italics: true, color: CINZA });
  content.push({ text: `${escola.alunos} alunos avaliados`, alignment: 'center', fontSize: 10, color: CINZA, margin: [0, 5, 0, 0] });
  content.push({ text: '', pageBreak: 'after' });

  return content;
}

function buildExecutiveSummary(escola: typeof ESCOLAS[string], questoes: Questao[]): Content[] {
  const totalQuestoes = questoes.length;
  const totalAcertos = questoes.reduce((s, q) => s + q.acertos, 0);
  const totalRespostas = questoes.reduce((s, q) => s + q.total, 0);
  const mediaGeral = totalRespostas > 0 ? (totalAcertos / totalRespostas) * 100 : 0;

  const sorted = [...questoes].sort((a, b) => a.taxa_acerto - b.taxa_acerto);
  const maisDificil = sorted[0];
  const maisFacil = sorted[sorted.length - 1];

  const verdes = questoes.filter((q) => q.taxa_acerto >= 70).length;
  const amarelas = questoes.filter((q) => q.taxa_acerto >= 50 && q.taxa_acerto < 70).length;
  const vermelhas = questoes.filter((q) => q.taxa_acerto < 50).length;

  const tableBody: TableCell[][] = [
    [
      { text: 'Indicador', style: 'tableHeader' },
      { text: 'Valor', style: 'tableHeader' },
      { text: 'Observacao', style: 'tableHeader' },
    ],
    ['Total de Questoes', { text: String(totalQuestoes), alignment: 'center' }, 'Questoes no escopo dos filtros'],
    ['Media de Acerto', { text: `${mediaGeral.toFixed(1)}%`, color: corTaxa(mediaGeral), bold: true, alignment: 'center' }, `Nacional: 65.03 | Gap: ${(escola.nota - 65.03).toFixed(2)} pts`],
    ['Nota Media', { text: String(escola.nota), alignment: 'center' }, `Proficiencia TRI: ${escola.proficiencia}`],
    ['Questoes >= 70%', { text: String(verdes), color: VERDE_HEX, alignment: 'center' }, `${((verdes / totalQuestoes) * 100).toFixed(0)}% do total`],
    ['Questoes 50-70%', { text: String(amarelas), color: AMARELO_HEX, alignment: 'center' }, `${((amarelas / totalQuestoes) * 100).toFixed(0)}% do total`],
    ['Questoes < 50%', { text: String(vermelhas), color: VERMELHO_HEX, alignment: 'center' }, `${((vermelhas / totalQuestoes) * 100).toFixed(0)}% do total`],
    ['Mais Dificil', { text: maisDificil ? `Q${maisDificil.numero} (${maisDificil.taxa_acerto.toFixed(1)}%)` : 'N/A', color: VERMELHO_HEX, alignment: 'center' }, maisDificil ? `${maisDificil.area} - ${maisDificil.tema || ''}` : ''],
    ['Mais Facil', { text: maisFacil ? `Q${maisFacil.numero} (${maisFacil.taxa_acerto.toFixed(1)}%)` : 'N/A', color: VERDE, alignment: 'center' }, maisFacil ? `${maisFacil.area} - ${maisFacil.tema || ''}` : ''],
  ];

  return [
    { text: 'Sumario Executivo', style: 'sectionTitle' },
    { text: `Analise detalhada do desempenho da ${escola.nome} (${escola.cidade}/${escola.uf}) no ENAMED 2025, com ${totalQuestoes} questoes.`, style: 'body', margin: [0, 0, 0, 10] },
    {
      table: { headerRows: 1, widths: ['*', 'auto', '*'], body: tableBody },
      layout: {
        fillColor: (rowIndex: number) => rowIndex === 0 ? AZUL : (rowIndex % 2 === 0 ? '#F8F9FA' : null),
        hLineColor: () => '#DEE2E6',
        vLineColor: () => '#DEE2E6',
      },
    },
    { text: 'Verde (>= 70%) = bom | Amarelo (50-70%) = atencao | Vermelho (< 50%) = critico', fontSize: 8, italics: true, color: CINZA, margin: [0, 5, 0, 0] },
    { text: '', pageBreak: 'after' },
  ];
}

function buildDimensionSection(
  titulo: string,
  indice: Record<string, number[]>,
  taxas: Record<string, { taxa: number }>,
  questoesFiltradas: Questao[],
  legendaKey?: string
): Content[] {
  const legendas = legendaKey ? LEGENDAS[legendaKey] || {} : {};

  const items: { nome: string; taxa: number; qtd: number }[] = [];
  for (const [nome, numeros] of Object.entries(indice)) {
    const qs = questoesFiltradas.filter((q) => numeros.includes(q.numero));
    if (qs.length === 0) continue;
    items.push({ nome, taxa: taxas[nome]?.taxa ?? 0, qtd: qs.length });
  }
  if (items.length === 0) return [];
  items.sort((a, b) => a.taxa - b.taxa);

  const tableBody: TableCell[][] = [
    [
      { text: 'Codigo', style: 'tableHeader' },
      { text: 'Descricao', style: 'tableHeader' },
      { text: 'Taxa de Acerto', style: 'tableHeader' },
      { text: 'Questoes', style: 'tableHeader' },
    ],
    ...items.map((item) => [
      { text: item.nome, bold: true, alignment: 'center' as const },
      { text: legendas[item.nome] || item.nome, fontSize: 9 },
      { text: `${item.taxa.toFixed(1)}%`, bold: true, color: corTaxa(item.taxa), fillColor: corTaxaBg(item.taxa), alignment: 'center' as const },
      { text: String(item.qtd), alignment: 'center' as const },
    ]),
  ];

  const pior = items[0];
  const melhor = items[items.length - 1];

  return [
    { text: titulo, style: 'sectionTitle' },
    {
      table: { headerRows: 1, widths: [60, '*', 80, 50], body: tableBody },
      layout: {
        fillColor: (rowIndex: number, _node: unknown, columnIndex: number) => {
          if (rowIndex === 0) return AZUL;
          if (columnIndex === 2) return undefined; // taxa cell has its own fill
          return rowIndex % 2 === 0 ? '#F8F9FA' : null;
        },
        hLineColor: () => '#DEE2E6',
        vLineColor: () => '#DEE2E6',
      },
    },
    { text: `Menor: ${pior.nome} (${pior.taxa.toFixed(1)}%) | Maior: ${melhor.nome} (${melhor.taxa.toFixed(1)}%)`, fontSize: 8, color: CINZA, margin: [0, 5, 0, 0] },
    { text: '', pageBreak: 'after' },
  ];
}

function buildQuestionDetail(questoes: Questao[]): Content[] {
  const sorted = [...questoes].sort((a, b) => a.taxa_acerto - b.taxa_acerto);
  const content: Content[] = [
    { text: 'Detalhamento por Questao', style: 'sectionTitle' },
    { text: `${sorted.length} questoes ordenadas por taxa de acerto (menor para maior).`, style: 'body', margin: [0, 0, 0, 10] },
  ];

  for (let i = 0; i < sorted.length; i++) {
    const q = sorted[i];

    // Header
    content.push({
      columns: [
        { text: `Questao ${q.numero}`, bold: true, fontSize: 12, color: AZUL, width: 'auto' },
        { text: `${q.taxa_acerto.toFixed(1)}% de acerto`, bold: true, fontSize: 12, color: corTaxa(q.taxa_acerto), width: 'auto', margin: [15, 0, 0, 0] },
        { text: `Gabarito: ${q.gabarito}`, fontSize: 10, color: CINZA, width: 'auto', margin: [15, 2, 0, 0] },
      ],
      margin: [0, 10, 0, 3],
    });

    // Tags
    const tags: string[] = [];
    if (q.ciclo_formativo) tags.push(`Ciclo: ${q.ciclo_formativo}`);
    if (q.bloom) tags.push(`Bloom: ${q.bloom}`);
    if (q.competencia_principal) tags.push(`Comp: ${q.competencia_principal}`);
    if (q.eixo_cognitivo) tags.push(`Eixo: ${q.eixo_cognitivo}`);
    if (tags.length > 0) {
      content.push({ text: tags.join('  |  '), fontSize: 8, italics: true, color: VERDE, margin: [0, 0, 0, 2] });
    }

    // Hierarquia
    const hier: string[] = [];
    if (q.area) hier.push(q.area);
    if (q.subespecialidade) hier.push(q.subespecialidade);
    if (q.tema) hier.push(q.tema);
    if (hier.length > 0) {
      content.push({ text: `Conteudo: ${hier.join(' > ')}`, fontSize: 8, color: CINZA, margin: [0, 0, 0, 2] });
    }

    // Enunciado
    const enunciado = q.enunciado.length > 600 ? q.enunciado.substring(0, 600) + '...' : q.enunciado;
    content.push({ text: enunciado, fontSize: 9, color: CINZA, margin: [0, 3, 0, 5] });

    // Alternativas
    if (q.distribuicao) {
      const altBody: TableCell[][] = [
        [
          { text: 'Alt', style: 'tableHeader', alignment: 'center' },
          { text: 'Texto', style: 'tableHeader' },
          { text: '%', style: 'tableHeader', alignment: 'center' },
          { text: 'Qtd', style: 'tableHeader', alignment: 'center' },
        ],
      ];
      for (const letra of ['A', 'B', 'C', 'D'] as const) {
        const dist = q.distribuicao[letra];
        const isGab = q.gabarito === letra;
        const textoAlt = letra === 'A' ? q.alternativa_a : letra === 'B' ? q.alternativa_b : letra === 'C' ? q.alternativa_c : q.alternativa_d;
        const bg = isGab ? '#DCFCE7' : undefined;
        const tc = isGab ? VERDE_HEX : CINZA;
        altBody.push([
          { text: isGab ? `${letra} *` : letra, bold: isGab, color: tc, fillColor: bg, alignment: 'center' },
          { text: textoAlt ? (textoAlt.length > 100 ? textoAlt.substring(0, 100) + '...' : textoAlt) : `Alt ${letra}`, fontSize: 8, color: tc, fillColor: bg },
          { text: `${(dist?.pct || 0).toFixed(1)}%`, bold: isGab, color: tc, fillColor: bg, alignment: 'center' },
          { text: String(dist?.qtd || 0), color: tc, fillColor: bg, alignment: 'center' },
        ]);
      }
      content.push({
        table: { headerRows: 1, widths: [25, '*', 35, 35], body: altBody },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? AZUL : null,
          hLineColor: () => '#DEE2E6',
          vLineColor: () => '#DEE2E6',
        },
        margin: [0, 0, 0, 5],
      });
    }

    // Page break a cada 3 questões
    if ((i + 1) % 3 === 0 && i < sorted.length - 1) {
      content.push({ text: '', pageBreak: 'after' });
    }
  }

  return content;
}

// --- Orquestrador Principal ---

async function loadLogoBase64(): Promise<string> {
  const res = await fetch('/logo_sprmed.png');
  const blob = await res.blob();
  // Reduz resolução para diminuir tamanho do PDF
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = Math.round(50 * (img.height / img.width));
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.4));
    };
    const reader = new FileReader();
    reader.onloadend = () => { img.src = reader.result as string; };
    reader.readAsDataURL(blob);
  });
}

async function createRotatedLogo(logoBase64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Canvas reduzido para manter PDF leve
      const size = 200;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.translate(size / 2, size / 2);
      ctx.rotate(-40 * Math.PI / 180);
      const w = 150;
      const h = w * (img.height / img.width);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.4));
    };
    img.src = logoBase64;
  });
}

export async function generateReportPdf(params: ReportParams): Promise<void> {
  const { escolaId, questoes, indices, sprmed, areaFormacao, areaConhecimento } = params;
  const escola = ESCOLAS[escolaId];
  if (!escola) throw new Error(`Escola nao encontrada: ${escolaId}`);

  // Carrega logo para watermark
  const logoBase64 = await loadLogoBase64();
  const rotatedLogo = await createRotatedLogo(logoBase64);

  const questoesFiltradas = filtrarQuestoes(questoes, areaFormacao, areaConhecimento);

  // Monta conteúdo
  const content: Content[] = [];

  // 1. Capa
  content.push(...buildCoverPage(escola, { areaFormacao, areaConhecimento }));

  // 2. Sumário executivo
  content.push(...buildExecutiveSummary(escola, questoesFiltradas));

  // 3. Dimensões
  for (const dim of DIMENSOES) {
    const indice = indices[dim.indiceKey];
    if (!indice || Object.keys(indice).length === 0) continue;

    let taxas: Record<string, { taxa: number }>;
    if (dim.sprmedKey && sprmed[dim.sprmedKey]) {
      taxas = sprmed[dim.sprmedKey];
    } else {
      taxas = calcularTaxasDinamicas(indice, questoesFiltradas);
    }

    const section = buildDimensionSection(dim.titulo, indice, taxas, questoesFiltradas, dim.legendaKey);
    if (section.length > 0) content.push(...section);
  }

  // 4. Detalhamento por questão
  content.push(...buildQuestionDetail(questoesFiltradas));

  // Documento PDF
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 80, 40, 60],
    background: () => {
      const items: any[] = [];
      // Logo grande diagonal central
      items.push({ image: rotatedLogo, width: 550, absolutePosition: { x: 25, y: 150 }, opacity: 0.11 });
      // Grid de logos pequenas preenchendo a página (A4: 595x842)
      const logoW = 70;
      const spacingX = 95;
      const spacingY = 75;
      const cols = 6;
      const rows = 11;
      const offsetX = 15;
      const offsetY = 20;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          items.push({
            image: logoBase64,
            width: logoW,
            absolutePosition: { x: offsetX + col * spacingX, y: offsetY + row * spacingY },
            opacity: 0.11,
          });
        }
      }
      return items;
    },
    info: {
      title: `Relatorio Filtro SPRMed - ${escola.nome}`,
      author: 'SPRMed Dashboard ENAMED 2025',
      subject: `Analise ENAMED 2025 - ${escola.nome}`,
    },
    header: (currentPage: number) => {
      if (currentPage === 1) return null;
      return {
        columns: [
          { text: '', width: '*' },
          {
            text: [
              { text: 'SPRMed', bold: true, color: AZUL },
              { text: '  |  Relatorio Filtro ENAMED 2025', color: CINZA },
            ],
            alignment: 'right',
            fontSize: 8,
            margin: [0, 20, 40, 0],
          },
        ],
      };
    },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: 'CONFIDENCIAL', bold: true, color: '#C0392B', fontSize: 7, width: 'auto' },
        { text: `  |  ${escola.nome}  |  SPRMed ENAMED 2025  |  Pagina ${currentPage} de ${pageCount}`, fontSize: 7, color: CINZA, width: '*' },
      ],
      margin: [40, 10, 40, 0],
    }),
    styles: {
      coverTitle: { fontSize: 26, bold: true, color: AZUL },
      coverSubtitle: { fontSize: 14, color: VERDE, margin: [0, 5, 0, 0] },
      coverSchool: { fontSize: 20, bold: true, color: CINZA, margin: [0, 10, 0, 0] },
      sectionTitle: { fontSize: 16, bold: true, color: AZUL, margin: [0, 15, 0, 8] },
      body: { fontSize: 10, color: CINZA },
      tableHeader: { fontSize: 9, bold: true, color: 'white', fillColor: AZUL, alignment: 'center' },
    },
    defaultStyle: { fontSize: 10 },
    content,
  };

  // Dynamic import do pdfmake (client-side only)
  const pdfMake = (await import('pdfmake/build/pdfmake')).default;
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

  // Nome do arquivo
  let filename = `Relatorio_SPRMed_${escolaId}`;
  if (areaFormacao) filename += `_${areaFormacao}`;
  if (areaConhecimento) filename += `_${areaConhecimento.replace(/\s+/g, '_')}`;
  filename += '.pdf';

  // Gera e baixa
  pdfMake.createPdf(docDefinition).download(filename);
}
