'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Configurações das escolas
const ESCOLAS: Record<string, {
  nome: string;
  cidade: string;
  uf: string;
  alunos: number;
  nota: number;
  proficiencia: number;
  risco: number;
  percentualRisco: number;
  conceito?: number;
  rankNota?: number;
  rankNotaTotal?: number;
  rankMec?: number;
  rankMecTotal?: number;
  pctProficientes?: number;
}> = {
  brasil_todos: {
    nome: 'Brasil (Todos)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 89016,
    nota: 67.01,
    proficiencia: 0.00,
    risco: 0,
    percentualRisco: 0
  },
  brasil_concluintes: {
    nome: 'Brasil (Concluintes)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 39256,
    nota: 65.03,
    proficiencia: -0.11,
    risco: 0,
    percentualRisco: 0
  },
  enamed_5: {
    nome: 'ENAMED 5 (49 faculdades)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 4129,
    nota: 73.42,
    proficiencia: 0.36,
    risco: 0,
    percentualRisco: 0
  },
  unimar: {
    nome: 'UNIMAR',
    cidade: 'Marília',
    uf: 'SP',
    alunos: 163,
    nota: 60.56,
    proficiencia: -0.37,
    risco: 31,
    percentualRisco: 19,
    conceito: 2,
    rankNota: 288, rankNotaTotal: 350,
    rankMec: 304, rankMecTotal: 350,
    pctProficientes: 47.2
  },
  unifaa: {
    nome: 'UNIFAA',
    cidade: 'Valença',
    uf: 'RJ',
    alunos: 220,
    nota: 64.71,
    proficiencia: -0.13,
    risco: 23,
    percentualRisco: 10,
    conceito: 3,
    rankNota: 188, rankNotaTotal: 350,
    rankMec: 205, rankMecTotal: 350,
    pctProficientes: 66.4
  },
  integrado: {
    nome: 'Faculdade Integrado',
    cidade: 'Campo Mourão',
    uf: 'PR',
    alunos: 129,
    nota: 63.39,
    proficiencia: -0.21,
    risco: 58,
    percentualRisco: 45,
    conceito: 3,
    rankNota: 225, rankNotaTotal: 350,
    rankMec: 223, rankMecTotal: 350,
    pctProficientes: 64.3
  },
  multivix_vitoria: {
    nome: 'Multivix Vitória',
    cidade: 'Vitória',
    uf: 'ES',
    alunos: 137,
    nota: 66.75,
    proficiencia: -0.02,
    risco: 60,
    percentualRisco: 43,
    conceito: 3,
    rankNota: 149, rankNotaTotal: 350,
    rankMec: 167, rankMecTotal: 350,
    pctProficientes: 73.7
  },
  multivix_cachoeiro: {
    nome: 'Faculdade Brasileira de Cachoeiro',
    cidade: 'Cachoeiro de Itapemirim',
    uf: 'ES',
    alunos: 109,
    nota: 65.28,
    proficiencia: -0.1,
    risco: 53,
    percentualRisco: 48,
    conceito: 4,
    rankNota: 135, rankNotaTotal: 350,
    rankMec: 127, rankMecTotal: 350,
    pctProficientes: 79.2
  },
  slmandic_araras: {
    nome: 'SLMandic Araras',
    cidade: 'Araras',
    uf: 'SP',
    alunos: 83,
    nota: 56.76,
    proficiencia: -0.58,
    risco: 38,
    percentualRisco: 45,
    conceito: 1,
    rankNota: 337, rankNotaTotal: 350,
    rankMec: 328, rankMecTotal: 350,
    pctProficientes: 39.8
  },
  slmandic_campinas: {
    nome: 'SLMandic Campinas',
    cidade: 'Campinas',
    uf: 'SP',
    alunos: 191,
    nota: 62.2,
    proficiencia: -0.27,
    risco: 104,
    percentualRisco: 54,
    conceito: 2,
    rankNota: 252, rankNotaTotal: 350,
    rankMec: 258, rankMecTotal: 350,
    pctProficientes: 57.6
  },
  facene_rn: {
    nome: 'FACENE Mossoró',
    cidade: 'Mossoró',
    uf: 'RN',
    alunos: 126,
    nota: 60.26,
    proficiencia: -0.39,
    risco: 66,
    percentualRisco: 52,
    conceito: 2,
    rankNota: 294, rankNotaTotal: 350,
    rankMec: 280, rankMecTotal: 350,
    pctProficientes: 52.4
  },
  unifoa: {
    nome: 'UNIFOA',
    cidade: 'Volta Redonda',
    uf: 'RJ',
    alunos: 119,
    nota: 61.71,
    proficiencia: -0.3,
    risco: 47,
    percentualRisco: 39,
    conceito: 2,
    rankNota: 263, rankNotaTotal: 350,
    rankMec: 283, rankMecTotal: 350,
    pctProficientes: 52.1
  },
  emescam: {
    nome: 'EMESCAM',
    cidade: 'Vitória',
    uf: 'ES',
    alunos: 135,
    nota: 69.97,
    proficiencia: 0.17,
    risco: 60,
    percentualRisco: 44,
    conceito: 4,
    rankNota: 80, rankNotaTotal: 350,
    rankMec: 117, rankMecTotal: 350,
    pctProficientes: 80.7
  },
  afya_consolidado: {
    nome: 'Afya (Consolidado)',
    cidade: '20 unidades',
    uf: 'BR',
    alunos: 2870,
    nota: 61.92,
    proficiencia: -0.29,
    risco: 5,
    percentualRisco: 0
  },
  einstein: {
    nome: 'Albert Einstein',
    cidade: 'São Paulo',
    uf: 'SP',
    alunos: 118,
    nota: 71.9,
    proficiencia: 0.28,
    risco: 56,
    percentualRisco: 47,
    conceito: 5,
    rankNota: 45, rankNotaTotal: 350,
    rankMec: 43, rankMecTotal: 350,
    pctProficientes: 90.7
  }
};

// Legendas
const LEGENDAS: Record<string, Record<string, string>> = {
  ciclo: {
    'M2': 'ENAMED-2 - Ciclo Básico (Final do 2º ano)',
    'M4': 'ENAMED-4 - Ciclo Clínico (Final do 4º ano)',
    'M6': 'ENAMED-6 - Internato (Final do 6º ano)'
  },
  eixo_cognitivo: {
    'E1': 'Conhecimento e Compreensão',
    'E2': 'Aplicação e Análise',
    'E3': 'Avaliação e Julgamento Ético-Profissional'
  },
  nivel_cognitivo: {
    'NC1': 'Conhecimento e Compreensão (Cognitivo)',
    'NC2': 'Aplicação e Execução Prática (Psicomotor)',
    'NC3': 'Raciocínio Clínico e Julgamento Ético (Atitudinal)'
  },
  eixo_transversal: {
    'AT': 'Atenção à Saúde - Cuidado integral centrado na pessoa',
    'GS': 'Gestão em Saúde - Planejamento, equipe multiprofissional, políticas',
    'ES': 'Educação em Saúde - Aprendizagem contínua, educação permanente'
  },
  competencia: {
    'C-I': 'Singularidade - Respeitar a singularidade de cada pessoa e grupo social',
    'C-II': 'Hipóteses diagnósticas - Formular hipóteses diagnósticas e plano propedêutico',
    'C-III': 'Exames complementares - Solicitar e interpretar exames complementares',
    'C-IV': 'Planos terapêuticos - Elaborar, pactuar e acompanhar planos terapêuticos',
    'C-V': 'Urgências/emergências - Reconhecer e tratar urgências e emergências',
    'C-VI': 'Procedimentos básicos - Indicar e realizar procedimentos clínicos e cirúrgicos básicos',
    'C-VII': 'Necessidades coletivas - Identificar necessidades coletivas de saúde',
    'C-VIII': 'Promoção e vigilância - Planejar e implementar ações de promoção e vigilância',
    'C-IX': 'Princípios do SUS - Aplicar princípios e políticas do SUS',
    'C-X': 'Comunicação - Comunicar-se com pacientes, famílias e equipes',
    'C-XI': 'Equipe multiprofissional - Trabalhar em equipe multiprofissional',
    'C-XII': 'Ética e deontologia - Respeitar normas éticas e deontológicas',
    'C-XIII': 'Autorreflexão - Desenvolver atitude autorreflexiva e aprendizado permanente',
    'C-XIV': 'TICs em saúde - Utilizar tecnologias da informação e comunicação em saúde',
    'C-XV': 'Emergências sanitárias - Atuar em emergências sanitárias e desastres'
  },
  dominio: {
    'D-I': 'Bases moleculares e celulares (Bloco I)',
    'D-II': 'Processos fisiológicos do ciclo de vida (Bloco I)',
    'D-III': 'Determinantes sociais, culturais e ecológicos (Bloco I)',
    'D-IV': 'Ética, bioética e segurança de dados (Bloco II)',
    'D-V': 'Direitos humanos e inclusão (Bloco II)',
    'D-VI': 'Semiologia (Bloco II)',
    'D-VII': 'Comunicação em saúde (Bloco II)',
    'D-VIII': 'Registro e documentação médica (Bloco II)',
    'D-IX': 'Propedêutica e diagnóstico (Bloco III)',
    'D-X': 'Terapêutica (Bloco III)',
    'D-XI': 'Prognóstico e prevenção (Bloco III)',
    'D-XII': 'Reabilitação (Bloco III)',
    'D-XIII': 'Promoção e educação em saúde (Bloco III)',
    'D-XIV': 'Políticas de saúde e SUS (Bloco IV)',
    'D-XV': 'Gestão de serviços (Bloco IV)',
    'D-XVI': 'Epidemiologia (Bloco IV)',
    'D-XVII': 'Vigilância em saúde (Bloco IV)',
    'D-XVIII': 'Saúde ambiental e ocupacional (Bloco IV)',
    'D-XIX': 'Liderança e trabalho em equipe (Bloco IV)',
    'D-XX': 'Metodologia científica e MBE (Bloco IV)',
    'D-XXI': 'Tecnologias da informação (Bloco IV)'
  },
  cenario: {
    'APS': 'Atenção Primária à Saúde (UBS, ESF, NASF-AB)',
    'URG': 'Urgência e Emergência (UPA, SAMU, PS)',
    'MAT': 'Rede Materno-Infantil (Maternidades, Casas de parto)',
    'RAPS': 'Atenção Psicossocial (CAPS I/II/AD)',
    'CRON': 'Doenças Crônicas (Ambulatórios, Atenção domiciliar)',
    'REAB': 'Reabilitação (Centros de referência)',
    'GESTAO': 'Gestão em Saúde (Planejamento, equipe, políticas)'
  },
  bloom: {
    'Lembrar': '1 - Recuperar informação da memória',
    'Entender': '2 - Compreender significado, interpretar',
    'Aplicar': '3 - Usar conhecimento em situação prática',
    'Analisar': '4 - Decompor em partes, identificar relações',
    'Avaliar': '5 - Fazer julgamentos baseados em critérios',
    'Criar': '6 - Produzir algo novo, sintetizar'
  },
  area_formacao: {
    'CLIN': 'Clínica Médica - Diagnóstico e terapêutico de condições prevalentes em adultos',
    'CIR': 'Cirurgia Geral - Manejo cirúrgico básico, trauma e urgências',
    'GO': 'Ginecologia e Obstetrícia - Cuidado integral à saúde da mulher',
    'PED': 'Pediatria - Cuidado integral de crianças e adolescentes',
    'MFC': 'Medicina de Família e Comunidade - Atenção primária, cuidado longitudinal',
    'SM': 'Saúde Mental - Reconhecimento, manejo e atenção psicossocial',
    'SC': 'Saúde Coletiva - Epidemiologia, vigilância, gestão do SUS, bioética'
  }
};

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
  total_respostas?: number;
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

interface DimensionData {
  nome: string;
  qtd: number;
  acertou: number;
  errou: number;
  taxa: number;
  score: number;
  numeros: number[];
  totalAcertos: number;
  totalErros: number;
}

export default function EscolaPage() {
  const params = useParams();
  const escolaId = params.id as string;
  const escola = ESCOLAS[escolaId];

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [indices, setIndices] = useState<Record<string, Record<string, number[]>>>({});
  const [sprmed, setSprmed] = useState<Record<string, Record<string, { taxa: number }>>>({});
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'geral' | 'sprmed' | 'alunos'>('sprmed');
  const [alunosData, setAlunosData] = useState<any>(null);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [ordenacao, setOrdenacao] = useState('efetividade');
  const [areaFormacao, setAreaFormacao] = useState('');
  const [areaConhecimento, setAreaConhecimento] = useState('');
  
  // Estados para hierarquia
  const [hierarquiaAreaFormacao, setHierarquiaAreaFormacao] = useState('');
  const [hierarquiaArea, setHierarquiaArea] = useState('');
  const [hierarquiaSubesp, setHierarquiaSubesp] = useState('');
  const [hierarquiaTema, setHierarquiaTema] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalQuestoes, setModalQuestoes] = useState<Questao[]>([]);
  const [questaoSelecionada, setQuestaoSelecionada] = useState<Questao | null>(null);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    if (!escola) return;
    
    async function loadData() {
      try {
        const [qRes, iRes, sRes] = await Promise.all([
          fetch(`/data/${escolaId}/questoes_detalhadas.json`),
          fetch(`/data/${escolaId}/indices_questoes.json`),
          fetch(`/data/${escolaId}/analise_turma_sprmed.json`)
        ]);
        
        setQuestoes(await qRes.json());
        setIndices(await iRes.json());
        setSprmed(await sRes.json());
        
        // Tenta carregar dados de alunos (só existe para faculdades, não para Brasil)
        try {
          const alunosRes = await fetch(`/data/${escolaId}/alunos_individuais.json`);
          if (alunosRes.ok) {
            setAlunosData(await alunosRes.json());
          }
        } catch (e) {
          // Sem dados de alunos para esta escola
        }
        
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    
    loadData();
  }, [escola, escolaId]);

  // Verifica se questão tem área de formação
  const questaoTemAreaFormacao = useCallback((q: Questao, af: string) => {
    if (!af) return true;
    return q.area_formacao_principal === af || (q.area_formacao_secundaria && q.area_formacao_secundaria.includes(af));
  }, []);

  // Filtra questões
  const questoesFiltradas = questoes.filter(q => {
    if (!questaoTemAreaFormacao(q, areaFormacao)) return false;
    if (areaConhecimento && q.area !== areaConhecimento) return false;
    return true;
  });

  // Calcula taxas dinâmicas
  const calcularTaxas = useCallback((indice: Record<string, number[]>) => {
    const taxas: Record<string, { taxa: number }> = {};
    for (const [nome, nums] of Object.entries(indice)) {
      const qs = questoesFiltradas.filter(q => nums.includes(q.numero));
      const totalAcertos = qs.reduce((s, q) => s + q.acertos, 0);
      const totalResp = qs.reduce((s, q) => s + q.total, 0);
      taxas[nome] = { taxa: totalResp > 0 ? (totalAcertos / totalResp) * 100 : 0 };
    }
    return taxas;
  }, [questoesFiltradas]);

  // Processa dimensão para gráficos
  const processarDimensao = useCallback((
    indice: Record<string, number[]>,
    taxas: Record<string, { taxa: number }>,
    mostrarVazios: boolean = true
  ): DimensionData[] => {
    const resultado: DimensionData[] = [];
    
    for (const [nome, numeros] of Object.entries(indice)) {
      const qs = questoesFiltradas.filter(q => numeros.includes(q.numero));
      
      // Se não mostrar vazios e não há questões, pula
      if (!mostrarVazios && qs.length === 0) continue;
      
      if (qs.length === 0) {
        // Item sem questões após filtro - mostra como "sem dados"
        resultado.push({ 
          nome, 
          qtd: 0, 
          acertou: 0, 
          errou: 0, 
          taxa: -1, // -1 indica sem dados
          score: 0, 
          numeros,
          totalAcertos: 0,
          totalErros: 0
        });
      } else {
        const taxaSprmed = taxas[nome]?.taxa;
        const taxa = taxaSprmed !== undefined ? taxaSprmed : (
          qs.reduce((s, q) => s + q.total, 0) > 0
            ? (qs.reduce((s, q) => s + q.acertos, 0) / qs.reduce((s, q) => s + q.total, 0)) * 100
            : 0
        );
        const acertou = qs.filter(q => q.taxa_acerto >= 50).length;
        const errou = qs.filter(q => q.taxa_acerto < 50).length;
        const score = (100 - taxa) * Math.log(qs.length + 1);
        const totalAcertos = qs.reduce((sum, q) => sum + q.acertos, 0);
        const totalErros = qs.reduce((sum, q) => sum + q.erros, 0);
        
        resultado.push({ nome, qtd: qs.length, acertou, errou, taxa, score, numeros, totalAcertos, totalErros });
      }
    }
    
    // Ordena - itens sem dados vão pro final
    resultado.sort((a, b) => {
      // Itens sem dados (-1) vão pro final
      if (a.taxa === -1 && b.taxa !== -1) return 1;
      if (a.taxa !== -1 && b.taxa === -1) return -1;
      if (a.taxa === -1 && b.taxa === -1) return a.nome.localeCompare(b.nome);
      
      // Ordenação normal
      if (ordenacao === 'efetividade') return b.score - a.score;
      if (ordenacao === 'taxa-asc') return a.taxa - b.taxa;
      if (ordenacao === 'taxa-desc') return b.taxa - a.taxa;
      if (ordenacao === 'qtd-desc') return b.qtd - a.qtd;
      return 0;
    });
    
    return resultado;
  }, [questoesFiltradas, ordenacao]);

  // Abre modal
  const abrirModal = (titulo: string, numeros: number[]) => {
    // Filtra apenas questões que estão nos números E passam pelos filtros ativos
    const qs = questoesFiltradas
      .filter(q => numeros.includes(q.numero))
      .sort((a, b) => a.taxa_acerto - b.taxa_acerto);
    setModalTitle(titulo);
    setModalQuestoes(qs);
    setQuestaoSelecionada(null);
    setModalOpen(true);
  };

  // Áreas disponíveis
  const areasFormacao = [...new Set(questoes.map(q => q.area_formacao_principal).filter(Boolean))].sort();
  const areasConhecimento = [...new Set(
    questoes.filter(q => questaoTemAreaFormacao(q, areaFormacao)).map(q => q.area).filter(Boolean)
  )].sort();

  // Filtros da hierarquia
  const questoesHierarquia = questoes.filter(q => {
    if (!questaoTemAreaFormacao(q, hierarquiaAreaFormacao)) return false;
    if (hierarquiaArea && q.area !== hierarquiaArea) return false;
    if (hierarquiaSubesp && q.subespecialidade !== hierarquiaSubesp) return false;
    if (hierarquiaTema && q.tema !== hierarquiaTema) return false;
    return true;
  });
  
  const hierarquiaAreasDisponiveis = [...new Set(
    questoes.filter(q => questaoTemAreaFormacao(q, hierarquiaAreaFormacao)).map(q => q.area).filter(Boolean)
  )].sort();
  
  const hierarquiaSubespDisponiveis = [...new Set(
    questoes.filter(q => {
      if (!questaoTemAreaFormacao(q, hierarquiaAreaFormacao)) return false;
      if (hierarquiaArea && q.area !== hierarquiaArea) return false;
      return true;
    }).map(q => q.subespecialidade).filter(Boolean)
  )].sort();
  
  const hierarquiaTemasDisponiveis = [...new Set(
    questoes.filter(q => {
      if (!questaoTemAreaFormacao(q, hierarquiaAreaFormacao)) return false;
      if (hierarquiaArea && q.area !== hierarquiaArea) return false;
      if (hierarquiaSubesp && q.subespecialidade !== hierarquiaSubesp) return false;
      return true;
    }).map(q => q.tema).filter(Boolean)
  )].sort();
  
  // Índices dinâmicos para hierarquia
  const hierarquiaIndiceSubesp: Record<string, number[]> = {};
  const hierarquiaIndiceTema: Record<string, number[]> = {};
  const hierarquiaIndiceSubtema: Record<string, number[]> = {};
  
  questoesHierarquia.forEach(q => {
    if (q.subespecialidade) {
      if (!hierarquiaIndiceSubesp[q.subespecialidade]) hierarquiaIndiceSubesp[q.subespecialidade] = [];
      hierarquiaIndiceSubesp[q.subespecialidade].push(q.numero);
    }
    if (q.tema) {
      if (!hierarquiaIndiceTema[q.tema]) hierarquiaIndiceTema[q.tema] = [];
      hierarquiaIndiceTema[q.tema].push(q.numero);
    }
    if (q.subtema) {
      const chave = `${q.tema} > ${q.subtema}`;
      if (!hierarquiaIndiceSubtema[chave]) hierarquiaIndiceSubtema[chave] = [];
      hierarquiaIndiceSubtema[chave].push(q.numero);
    }
  });

  // Cor baseada na taxa
  const getColor = (taxa: number) => {
    if (taxa >= 70) return '#22c55e';
    if (taxa >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  // Cor de fundo baseada na taxa (mais suave)
  const getBgColor = (taxa: number) => {
    if (taxa >= 70) return 'rgba(34, 197, 94, 0.15)';
    if (taxa >= 50) return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(239, 68, 68, 0.15)';
  };
  
  // Cor da borda baseada na taxa
  const getBorderColor = (taxa: number) => {
    if (taxa >= 70) return 'rgba(34, 197, 94, 0.4)';
    if (taxa >= 50) return 'rgba(245, 158, 11, 0.4)';
    return 'rgba(239, 68, 68, 0.4)';
  };

  // Formata números grandes (ex: 3.1M, 456K)
  const formatarNumero = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  if (!escola) {
    return <div className="min-h-screen bg-[#0a1628] text-white flex items-center justify-center">
      <div><h1 className="text-2xl mb-4">Escola não encontrada</h1></div>
    </div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0a1628] text-white flex items-center justify-center">Carregando...</div>;
  }

  // Renderiza seção com gráficos
  const renderSection = (
    titulo: string,
    descricao: string,
    indice: Record<string, number[]>,
    taxas: Record<string, { taxa: number }>,
    legendaTipo?: string
  ) => {
    const data = processarDimensao(indice, taxas);
    if (data.length === 0) return null;
    
    const legendas = legendaTipo ? LEGENDAS[legendaTipo] : {};
    
    return (
      <div className="section">
        <div className="section-title">{titulo}</div>
        <div className="section-desc" dangerouslySetInnerHTML={{ __html: descricao }} />
        
        <div className="section-grid-3">
          {/* Gráfico de barras empilhadas */}
          <div className="chart-box chart-dist">
            <div className="chart-box-title">Distribuição</div>
            <ResponsiveContainer width="100%" height={Math.max(180, data.length * 45)}>
              <BarChart 
                data={data.map(d => ({ ...d, nomeDisplay: d.nome.length > 18 ? d.nome.substring(0, 16) + '...' : d.nome }))} 
                layout="vertical" 
                margin={{ left: 10, right: 10 }}
                barCategoryGap="20%"
              >
                <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis 
                  dataKey="nomeDisplay" 
                  type="category" 
                  tick={{ fill: '#fff', fontSize: 11 }} 
                  width={120}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: 5 }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value, name, props) => [value, name === 'acertou' ? 'Questões onde maioria acertou' : 'Questões onde maioria errou']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.nome || label}
                />
                <Bar dataKey="acertou" stackId="a" fill="#22c55e" />
                <Bar dataKey="errou" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Mapa de efetividade */}
          <div className="chart-box chart-efet">
            <div className="chart-box-title">Mapa de Efetividade</div>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis dataKey="qtd" type="number" name="Qtd" tick={{ fill: '#888', fontSize: 9 }} />
                <YAxis dataKey="taxa" type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 9 }} />
                <ZAxis dataKey="score" range={[50, 400]} />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    if (!d) return null;
                    return (
                      <div style={{ backgroundColor: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 13, marginBottom: 6 }}>{d.nome}</div>
                        <div style={{ color: '#fff' }}>Questões: {d.qtd}</div>
                        <div style={{ color: '#fff' }}>Taxa: {d.taxa?.toFixed(1)}%</div>
                        <div style={{ color: '#fff' }}>Score: {d.score?.toFixed(1)}</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={data}>
                  {data.map((entry, i) => {
                    const intensity = Math.min(1, entry.score / 120);
                    const color = `rgba(${Math.round(239 * intensity + 59 * (1 - intensity))}, ${Math.round(68 * intensity + 130 * (1 - intensity))}, ${Math.round(68 * intensity + 246 * (1 - intensity))}, 0.7)`;
                    return <Cell key={i} fill={color} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Lista de itens */}
          <div className="dim-list list-full">
            {data.map(item => (
              <div 
                key={item.nome} 
                className={`dim-item ${item.taxa === -1 ? 'sem-dados' : ''}`}
                style={{ 
                  background: item.taxa === -1 ? 'rgba(100,100,100,0.1)' : getBgColor(item.taxa),
                  borderColor: item.taxa === -1 ? 'rgba(100,100,100,0.3)' : getBorderColor(item.taxa),
                  borderWidth: 2
                }}
                onClick={() => item.qtd > 0 ? abrirModal(`${titulo}: ${item.nome}`, item.numeros) : null}
              >
                <div className="dim-item-name">{item.nome}</div>
                {legendas[item.nome] && <div className="dim-item-legenda">{legendas[item.nome]}</div>}
                {item.taxa === -1 ? (
                  <>
                    <div className="dim-item-value" style={{ color: '#666' }}>—</div>
                    <div className="dim-item-stats">
                      <span style={{ color: '#666' }}>Sem questões</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dim-item-value" style={{ color: getColor(item.taxa) }}>
                      {item.taxa.toFixed(1)}%
                    </div>
                    <div className="dim-item-stats">
                      <span style={{ color: '#22c55e' }}>{item.acertou} questões</span>
                      <span style={{ color: '#ef4444' }}>{item.errou} questões</span>
                    </div>
                    <div className="dim-item-totais">
                      <span style={{ color: '#22c55e' }}>{formatarNumero(item.totalAcertos)} acertos</span>
                      <span style={{ color: '#ef4444' }}>{formatarNumero(item.totalErros)} erros</span>
                    </div>
                    {(() => {
                      const qsDoItem = questoesFiltradas.filter(q => item.numeros.includes(q.numero));
                      const qsAcertadas = qsDoItem.filter(q => q.taxa_acerto >= 50).map(q => q.numero).sort((a, b) => a - b);
                      const qsErradas = qsDoItem.filter(q => q.taxa_acerto < 50).map(q => q.numero).sort((a, b) => a - b);
                      return (
                        <>
                          {qsAcertadas.length > 0 && (
                            <div className="dim-item-questoes-acertadas">
                              <span style={{ color: '#22c55e', fontSize: 10 }}>
                                Acertadas: {qsAcertadas.map(n => `Q${n}`).join(', ')}
                              </span>
                            </div>
                          )}
                          {qsErradas.length > 0 && (
                            <div className="dim-item-questoes-erradas">
                              <span style={{ color: '#ef4444', fontSize: 10 }}>
                                Erradas: {qsErradas.map(n => `Q${n}`).join(', ')}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        <h1>
          Dashboard ENAMED 2025 - {escola.nome}
        </h1>
        <p>{escola.alunos} alunos | {escola.cidade}/{escola.uf} | Clique nos cards para ver as questões</p>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}>
          Visão Geral
        </button>
        <button className={`tab-btn ${activeTab === 'sprmed' ? 'active' : ''}`} onClick={() => setActiveTab('sprmed')}>
          Filtro SPRMed
        </button>
        {alunosData && (
          <button className={`tab-btn ${activeTab === 'alunos' ? 'active' : ''}`} onClick={() => setActiveTab('alunos')}>
            Alunos ({alunosData.turma.total_alunos})
          </button>
        )}
      </div>

      {/* Tab Geral */}
      <div className={`tab-content ${activeTab === 'geral' ? 'active' : ''}`}>
        <div className="container">
          {/* Indicadores */}
          <div className="section">
            <div className="section-title">Indicadores Principais</div>
            <div className="section-desc">
              Estes são os <strong>4 indicadores-chave</strong> que resumem a performance da {escola.nome} no ENAMED 2025.
            </div>
            <div className="cards cards-3">
              <div className="card">
                <div className="card-label">Total de Alunos</div>
                <div className="card-value">{escola.alunos}</div>
                <div className="card-desc">Alunos com prova válida (TP_PR_GER=555)</div>
              </div>
              <div className="card">
                <div className="card-label">Nota Média</div>
                <div className="card-value">{escola.nota}</div>
                <div className="card-desc">Nacional: 65.03 | Gap: {(escola.nota - 65.03).toFixed(2)} pontos</div>
              </div>
              <div className="card">
                <div className="card-label">Proficiência TRI</div>
                <div className="card-value">{escola.proficiencia}</div>
                <div className="card-desc">Escala -3 a +3 | Zero = média nacional</div>
              </div>
            </div>
          </div>
          
          {/* Rankings e Conceito */}
          {escola.conceito && (
          <div className="section">
            <div className="section-title">Posicionamento Nacional</div>
            <div className="section-desc">
              Conceito ENAMED e posição nos <strong>2 rankings oficiais</strong> entre 350 cursos de medicina do Brasil.
            </div>
            <div className="cards cards-3">
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="card-label">Conceito ENAMED</div>
                <div className="card-value" style={{
                  fontSize: 48,
                  color: escola.conceito >= 4 ? '#22c55e' : escola.conceito === 3 ? '#f59e0b' : '#ef4444'
                }}>
                  {escola.conceito}
                </div>
                <div className="card-desc">
                  {escola.conceito === 5 ? 'Excelência' :
                   escola.conceito === 4 ? 'Muito Bom' :
                   escola.conceito === 3 ? 'Satisfatório' :
                   escola.conceito === 2 ? 'Insatisfatório' : 'Crítico'}
                  {' '}| {escola.pctProficientes}% proficientes
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="card-label">Ranking por Nota Geral</div>
                <div className="card-value" style={{ fontSize: 36 }}>
                  {escola.rankNota}º <span style={{ fontSize: 18, color: '#888' }}>/ {escola.rankNotaTotal}</span>
                </div>
                <div className="card-desc">
                  Top {(100 - (100 * (escola.rankNota || 0) / (escola.rankNotaTotal || 350))).toFixed(0)}% | Média geral dos alunos (NT_GER)
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="card-label">Ranking MEC (% Proficiência)</div>
                <div className="card-value" style={{ fontSize: 36 }}>
                  {escola.rankMec}º <span style={{ fontSize: 18, color: '#888' }}>/ {escola.rankMecTotal}</span>
                </div>
                <div className="card-desc">
                  Top {(100 - (100 * (escola.rankMec || 0) / (escola.rankMecTotal || 350))).toFixed(0)}% | % alunos acima do ponto de corte
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Gráficos de Distribuição */}
          <div className="section">
            <div className="section-title">Distribuição de Performance</div>
            <div className="section-grid">
              <div className="chart-box" style={{ height: 320 }}>
                <div className="chart-box-title">Distribuição de Notas</div>
                <div className="section-desc" style={{ margin: '5px 0 10px', fontSize: 11 }}>
                  Histograma com quantidade de alunos por faixa de nota.
                  <span style={{ color: '#ef4444' }}> Vermelho</span> = reprovados |
                  <span style={{ color: '#f59e0b' }}> Amarelo</span> = risco |
                  <span style={{ color: '#22c55e' }}> Verde</span> = aprovados
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { faixa: '30-40', qtd: Math.round(escola.alunos * 0.05), cor: '#ef4444' },
                    { faixa: '40-50', qtd: Math.round(escola.alunos * 0.12), cor: '#ef4444' },
                    { faixa: '50-60', qtd: Math.round(escola.alunos * 0.25), cor: '#f59e0b' },
                    { faixa: '60-70', qtd: Math.round(escola.alunos * 0.30), cor: '#22c55e' },
                    { faixa: '70-80', qtd: Math.round(escola.alunos * 0.20), cor: '#22c55e' },
                    { faixa: '80-90', qtd: Math.round(escola.alunos * 0.08), cor: '#22c55e' },
                  ]}>
                    <XAxis dataKey="faixa" tick={{ fill: '#888', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="qtd" name="Alunos">
                      {[
                        { faixa: '30-40', cor: '#ef4444' },
                        { faixa: '40-50', cor: '#ef4444' },
                        { faixa: '50-60', cor: '#f59e0b' },
                        { faixa: '60-70', cor: '#22c55e' },
                        { faixa: '70-80', cor: '#22c55e' },
                        { faixa: '80-90', cor: '#22c55e' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box" style={{ height: 320 }}>
                <div className="chart-box-title">Performance por Área</div>
                <div className="section-desc" style={{ margin: '5px 0 10px', fontSize: 11 }}>
                  Comparação {escola.nome} (azul) vs média nacional (cinza).
                  Áreas onde a linha azul está "para dentro" indicam deficit.
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={[
                    { area: 'Clínica', escola: 58, nacional: 65 },
                    { area: 'Cirurgia', escola: 62, nacional: 63 },
                    { area: 'Pediatria', escola: 55, nacional: 62 },
                    { area: 'GO', escola: 60, nacional: 64 },
                    { area: 'MFC', escola: 52, nacional: 65 },
                  ]}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="area" tick={{ fill: '#888', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#888', fontSize: 9 }} />
                    <Radar name="Nacional" dataKey="nacional" stroke="#666" fill="#666" fillOpacity={0.3} />
                    <Radar name={escola.nome} dataKey="escola" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a2744', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Tab SPRMed */}
      <div className={`tab-content ${activeTab === 'sprmed' ? 'active' : ''}`}>
        <div className="container">
          {/* Filtros */}
          <div className="filter-row" style={{ flexWrap: 'wrap', gap: 15, marginBottom: 20, alignItems: 'flex-end' }}>
            <div className="pre-filter">
              <label style={{ display: 'block', marginBottom: 5 }}>Área de Formação (pré-filtro):</label>
              <select 
                className="filter-select" 
                style={{ minWidth: 200 }}
                value={areaFormacao}
                onChange={(e) => { setAreaFormacao(e.target.value); setAreaConhecimento(''); }}
              >
                <option value="">Todas as Áreas de Formação</option>
                {areasFormacao.map(a => (
                  <option key={a} value={a}>{LEGENDAS.area_formacao[a] || a}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Área de Conhecimento:</label>
              <select 
                className="filter-select"
                style={{ minWidth: 180 }}
                value={areaConhecimento}
                onChange={(e) => setAreaConhecimento(e.target.value)}
              >
                <option value="">Todas</option>
                {areasConhecimento.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 5 }}>Ordenar por:</label>
              <select 
                className="filter-select"
                style={{ minWidth: 220 }}
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="efetividade">🎯 EFETIVIDADE (gaps prioritários)</option>
                <option value="taxa-asc">Taxa de acerto (menor primeiro)</option>
                <option value="taxa-desc">Taxa de acerto (maior primeiro)</option>
                <option value="qtd-desc">Quantidade (maior primeiro)</option>
              </select>
            </div>
            
            {/* Botão Exportar PDF */}
            <div style={{ marginLeft: 'auto' }}>
              <button
                className="btn-exportar"
                disabled={exportando}
                onClick={async () => {
                  setExportando(true);
                  try {
                    const { generateReportPdf } = await import('@/lib/report/generateReportPdf');
                    await generateReportPdf({
                      escolaId,
                      questoes,
                      indices,
                      sprmed,
                      areaFormacao: areaFormacao || undefined,
                      areaConhecimento: areaConhecimento || undefined,
                    });
                  } catch (err) {
                    console.error('Erro ao exportar:', err);
                    alert('Erro ao gerar relatório. Veja o console para detalhes.');
                  } finally {
                    setExportando(false);
                  }
                }}
              >
                {exportando ? '⏳ Gerando...' : '📄 Exportar Relatório PDF'}
              </button>
            </div>
          </div>
          
          <div className="filter-legend">
            <strong>Área de Formação (pré-filtro):</strong> MFC, CLIN, CIR, PED, GO, SC, SM - filtra o universo de questões<br/>
            <strong>Área de Conhecimento (hierarquia):</strong> Clínica Médica, Cirurgia, Pediatria, GO, Med Preventiva → Subespecialidade → Tema
          </div>

          <div className="filter-legend" style={{ marginTop: 10 }}>
            <strong>Como ler cada card de dimensão:</strong><br/>
            <strong>Taxa de acerto (%)</strong> = total de acertos / total de respostas de todos os alunos em todas as questões daquela dimensão<br/>
            <span style={{ color: '#22c55e' }}>N questões (verde)</span> = questões onde a maioria dos alunos acertou (taxa da questão &ge; 50%)<br/>
            <span style={{ color: '#ef4444' }}>N questões (vermelho)</span> = questões onde a maioria dos alunos errou (taxa da questão &lt; 50%)<br/>
            <span style={{ color: '#22c55e' }}>N acertos</span> / <span style={{ color: '#ef4444' }}>N erros</span> = soma de todas as respostas corretas e incorretas de todos os alunos naquela dimensão<br/>
            <span style={{ color: '#22c55e' }}>Acertadas: Q1, Q2...</span> = números das questões com taxa de acerto &ge; 50%<br/>
            <span style={{ color: '#ef4444' }}>Erradas: Q3, Q4...</span> = números das questões com taxa de acerto &lt; 50%
          </div>

          {/* Seções */}
          {renderSection(
            'Ciclo Formativo',
            '<strong>M2</strong> = 2º ano | <strong>M4</strong> = 4º ano | <strong>M6</strong> = 6º ano (internato)',
            indices.por_ciclo || {},
            sprmed.ciclos || {},
            'ciclo'
          )}
          
          {renderSection(
            'Taxonomia de Bloom',
            '<strong>Lembrar</strong> → <strong>Entender</strong> → <strong>Aplicar</strong> → <strong>Analisar</strong> → <strong>Avaliar</strong> (complexidade crescente)',
            indices.por_bloom || {},
            sprmed.bloom || {},
            'bloom'
          )}
          
          {renderSection(
            'Competências ENAMED (Portaria INEP 478/2025)',
            '<strong>C-I</strong>=Singularidade | <strong>C-II</strong>=Hipóteses | <strong>C-III</strong>=Exames | <strong>C-IV</strong>=Planos terapêuticos | <strong>C-V</strong>=Urgências | <strong>C-VI</strong>=Procedimentos<br/><strong>C-VII</strong>=Necessidades coletivas | <strong>C-VIII</strong>=Promoção | <strong>C-IX</strong>=SUS | <strong>C-X</strong>=Comunicação | <strong>C-XI</strong>=Equipe | <strong>C-XII</strong>=Ética<br/><strong>C-XIII</strong>=Autorreflexão | <strong>C-XIV</strong>=TICs | <strong>C-XV</strong>=Emergências sanitárias',
            indices.por_competencia || {},
            sprmed.competencias || {},
            'competencia'
          )}
          
          {renderSection(
            'Domínios de Conteúdo (D-I a D-XXI)',
            '<strong>Bloco I</strong>: D-I=Bases moleculares | D-II=Fisiologia | D-III=Determinantes sociais<br/><strong>Bloco II</strong>: D-IV=Ética | D-V=Direitos humanos | D-VI=Semiologia | D-VII=Comunicação | D-VIII=Registro<br/><strong>Bloco III</strong>: D-IX=Propedêutica | D-X=Terapêutica | D-XI=Prognóstico | D-XII=Reabilitação | D-XIII=Promoção<br/><strong>Bloco IV</strong>: D-XIV=Políticas SUS | D-XV=Gestão | D-XVI=Epidemiologia | D-XVII=Vigilância | D-XVIII=Saúde ambiental | D-XIX=Liderança | D-XX=MBE | D-XXI=TICs',
            indices.por_dominio || {},
            sprmed.dominios || {},
            'dominio'
          )}
          
          {renderSection(
            'Cenários de Atuação',
            '<strong>APS</strong>=Atenção Primária à Saúde | <strong>URG</strong>=Urgência e Emergência | <strong>MAT</strong>=Rede Materno-Infantil | <strong>RAPS</strong>=Atenção Psicossocial | <strong>CRON</strong>=Doenças Crônicas | <strong>REAB</strong>=Reabilitação',
            indices.por_cenario || {},
            sprmed.cenarios || {},
            'cenario'
          )}
          
          {renderSection(
            'Eixo Cognitivo',
            'Nível de processamento mental exigido.<br/><strong>E1</strong> = Memória (lembrar, reconhecer) | <strong>E2</strong> = Raciocínio Clínico (analisar, diagnosticar) | <strong>E3</strong> = Tomada de Decisão (avaliar, decidir)',
            indices.por_eixo_cognitivo || {},
            calcularTaxas(indices.por_eixo_cognitivo || {}),
            'eixo_cognitivo'
          )}
          
          {renderSection(
            'Nível Cognitivo',
            'Complexidade da tarefa cognitiva.<br/><strong>NC1</strong> = Básico (reconhecimento) | <strong>NC2</strong> = Intermediário (aplicação) | <strong>NC3</strong> = Avançado (síntese crítica)',
            indices.por_nivel_cognitivo || {},
            calcularTaxas(indices.por_nivel_cognitivo || {}),
            'nivel_cognitivo'
          )}
          
          {renderSection(
            'Eixos Transversais',
            'Temas que permeiam todas as áreas.<br/><strong>AT</strong> = Atenção à Saúde | <strong>ES</strong> = Educação em Saúde | <strong>GS</strong> = Gestão em Saúde',
            indices.por_eixo_transversal || {},
            calcularTaxas(indices.por_eixo_transversal || {}),
            'eixo_transversal'
          )}
          
          {renderSection(
            'Área de Formação',
            'Áreas de conhecimento médico conforme DCN.<br/><strong>CLIN</strong> = Clínica | <strong>CIR</strong> = Cirurgia | <strong>PED</strong> = Pediatria | <strong>GO</strong> = Gineco-Obstetrícia | <strong>MFC</strong> = Medicina de Família | <strong>SC</strong> = Saúde Coletiva | <strong>SM</strong> = Saúde Mental',
            indices.por_area_formacao || {},
            calcularTaxas(indices.por_area_formacao || {}),
            'area_formacao'
          )}
          
          {renderSection(
            'Áreas de Conhecimento',
            'Grandes áreas da medicina: Clínica Médica, Cirurgia, Pediatria, Ginecologia e Obstetrícia, Medicina Preventiva',
            indices.por_area || {},
            sprmed.areas || {},
            undefined
          )}
          
          {/* Hierarquia de Conteúdos */}
          <div className="section">
            <div className="section-title">Hierarquia de Conteúdos</div>
            <div className="section-desc">
              Navegue pela hierarquia: <strong>Área</strong> → <strong>Subespecialidade</strong> → <strong>Tema</strong> → <strong>Subtema</strong><br/>
              Use os filtros abaixo para explorar os conteúdos.
            </div>
            
            {/* Filtros da Hierarquia */}
            <div className="filter-row" style={{ flexWrap: 'wrap', gap: 15, marginBottom: 20, alignItems: 'flex-end' }}>
              <div className="pre-filter">
                <label style={{ display: 'block', marginBottom: 5 }}>Área de Formação (pré-filtro):</label>
                <select 
                  className="filter-select" 
                  style={{ minWidth: 200 }}
                  value={hierarquiaAreaFormacao}
                  onChange={(e) => { 
                    setHierarquiaAreaFormacao(e.target.value); 
                    setHierarquiaArea('');
                    setHierarquiaSubesp('');
                    setHierarquiaTema('');
                  }}
                >
                  <option value="">Todas as Áreas de Formação</option>
                  {areasFormacao.map(a => (
                    <option key={a} value={a}>{LEGENDAS.area_formacao[a] || a}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 5 }}>Área de Conhecimento:</label>
                <select 
                  className="filter-select"
                  style={{ minWidth: 180 }}
                  value={hierarquiaArea}
                  onChange={(e) => { 
                    setHierarquiaArea(e.target.value);
                    setHierarquiaSubesp('');
                    setHierarquiaTema('');
                  }}
                >
                  <option value="">Todas</option>
                  {hierarquiaAreasDisponiveis.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 5 }}>Subespecialidade:</label>
                <select 
                  className="filter-select"
                  style={{ minWidth: 200 }}
                  value={hierarquiaSubesp}
                  onChange={(e) => { 
                    setHierarquiaSubesp(e.target.value);
                    setHierarquiaTema('');
                  }}
                >
                  <option value="">Todas</option>
                  {hierarquiaSubespDisponiveis.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 5 }}>Tema:</label>
                <select 
                  className="filter-select"
                  style={{ minWidth: 200 }}
                  value={hierarquiaTema}
                  onChange={(e) => setHierarquiaTema(e.target.value)}
                >
                  <option value="">Todos os Temas</option>
                  {hierarquiaTemasDisponiveis.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-legend">
              <strong>Área de Formação (pré-filtro):</strong> MFC, CLIN, CIR, PED, GO, SC, SM - filtra o universo de questões<br/>
              <strong>Área de Conhecimento (hierarquia):</strong> Clínica Médica, Cirurgia, Pediatria, GO, Med Preventiva → Subespecialidade → Tema
            </div>
            
            {renderSection(
              'Por Subespecialidade',
              'Detalhamento por especialidade médica dentro de cada área',
              hierarquiaIndiceSubesp,
              calcularTaxas(hierarquiaIndiceSubesp),
              undefined
            )}
            
            {renderSection(
              'Por Tema',
              'Temas específicos dentro de cada subespecialidade',
              hierarquiaIndiceTema,
              calcularTaxas(hierarquiaIndiceTema),
              undefined
            )}
            
            {renderSection(
              'Por Subtema (detalhado)',
              'Nível mais granular de conteúdo',
              hierarquiaIndiceSubtema,
              calcularTaxas(hierarquiaIndiceSubtema),
              undefined
            )}
          </div>
        </div>
      </div>

      {/* Tab Alunos */}
      {alunosData && (
        <div className={`tab-content ${activeTab === 'alunos' ? 'active' : ''}`}>
          <div className="container">
            {/* Estatísticas da Turma */}
            <div className="section">
              <div className="section-title">Estatísticas da Turma</div>
              <div className="cards cards-4">
                <div className="card">
                  <div className="card-label">Total de Alunos</div>
                  <div className="card-value">{alunosData.turma.total_alunos}</div>
                </div>
                <div className="card">
                  <div className="card-label">Média da Turma</div>
                  <div className="card-value">{alunosData.turma.media_nota}</div>
                </div>
                <div className="card">
                  <div className="card-label">Média Nacional</div>
                  <div className="card-value">{alunosData.turma.nacional_nota}</div>
                </div>
                <div className="card">
                  <div className="card-label">Gap</div>
                  <div className="card-value" style={{ color: alunosData.turma.media_nota >= alunosData.turma.nacional_nota ? '#22c55e' : '#ef4444' }}>
                    {(alunosData.turma.media_nota - alunosData.turma.nacional_nota).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Alunos ou Detalhe do Aluno */}
            {!alunoSelecionado ? (
              <div className="section">
                <div className="section-title">Lista de Alunos</div>
                <div className="section-desc">Clique em um aluno para ver a análise individual detalhada.</div>
                <div className="alunos-table">
                  <div className="alunos-header">
                    <span className="col-rank">#</span>
                    <span className="col-id">ID</span>
                    <span className="col-nota">Nota</span>
                    <span className="col-prof">Prof. TRI</span>
                    <span className="col-acertos">Acertos</span>
                    <span className="col-taxa">Taxa</span>
                    <span className="col-risco">Risco</span>
                  </div>
                  {alunosData.alunos.sort((a: any, b: any) => a.ranking - b.ranking).map((aluno: any) => (
                    <div key={aluno.id} className={`alunos-row ${aluno.risco_chute ? 'risco' : ''}`} onClick={() => setAlunoSelecionado(aluno)}>
                      <span className="col-rank">{aluno.ranking}º</span>
                      <span className="col-id">Aluno #{aluno.ranking}</span>
                      <span className="col-nota" style={{ color: getColor(aluno.nota) }}>{aluno.nota}</span>
                      <span className="col-prof">{aluno.proficiencia}</span>
                      <span className="col-acertos">{aluno.acertos}/{aluno.acertos + aluno.erros}</span>
                      <span className="col-taxa" style={{ color: getColor(aluno.taxa_acerto) }}>{aluno.taxa_acerto}%</span>
                      <span className="col-risco">{aluno.risco_chute ? <span className="badge-risco">⚠️</span> : <span className="badge-ok">✓</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="section">
                <div className="aluno-header-destaque">
                  <div className="aluno-titulo">
                    <span className="aluno-label">Análise Individual</span>
                    <span className="aluno-nome">Aluno #{alunoSelecionado.ranking}</span>
                  </div>
                  <button className="btn-voltar" onClick={() => setAlunoSelecionado(null)}>← Voltar à lista</button>
                </div>
                
                <div className="cards cards-4" style={{ marginBottom: 20 }}>
                  <div className="card">
                    <div className="card-label">Ranking</div>
                    <div className="card-value">{alunoSelecionado.ranking}º / {alunosData.turma.total_alunos}</div>
                  </div>
                  <div className="card">
                    <div className="card-label">Nota</div>
                    <div className="card-value" style={{ color: getColor(alunoSelecionado.nota) }}>{alunoSelecionado.nota}</div>
                    <div className="card-desc">Turma: {alunosData.turma.media_nota} | Nacional: {alunosData.turma.nacional_nota}</div>
                  </div>
                  <div className="card">
                    <div className="card-label">Proficiência TRI</div>
                    <div className="card-value">{alunoSelecionado.proficiencia}</div>
                  </div>
                  <div className="card">
                    <div className="card-label">Taxa de Acerto</div>
                    <div className="card-value" style={{ color: getColor(alunoSelecionado.taxa_acerto) }}>{alunoSelecionado.taxa_acerto}%</div>
                    <div className="card-desc">{alunoSelecionado.acertos} acertos / {alunoSelecionado.erros} erros</div>
                  </div>
                </div>

                {alunoSelecionado.risco_chute && (
                  <div className="alerta-risco">
                    <div className="alerta-risco-titulo">⚠️ <strong>Padrão de Risco Detectado</strong></div>
                    <div className="alerta-risco-motivo">Motivo: {alunoSelecionado.motivo_risco || 'padrão suspeito'}</div>
                    {alunoSelecionado.descricao_risco && (
                      <div className="alerta-risco-detalhe">
                        <strong>Sequências encontradas:</strong> {alunoSelecionado.descricao_risco}
                      </div>
                    )}
                    <div className="alerta-risco-interpretacao">
                      💡 <em>Isso pode indicar: chute sequencial, desistência temporária (cansaço), ou ansiedade durante a prova.</em>
                    </div>
                  </div>
                )}

                <div className="section-subtitle">Desempenho por Ciclo Formativo</div>
                <div className="dim-list dim-list-readonly" style={{ marginBottom: 20 }}>
                  {Object.entries(alunoSelecionado.dimensoes.ciclo || {}).map(([nome, data]: [string, any]) => (
                    <div key={nome} className="dim-item-static" style={{ background: getBgColor(data.taxa), borderColor: getBorderColor(data.taxa) }}>
                      <div className="dim-item-name">{nome}</div>
                      <div className="dim-item-legenda">{LEGENDAS.ciclo[nome]}</div>
                      <div className="dim-item-value" style={{ color: getColor(data.taxa) }}>{data.taxa}%</div>
                      <div className="dim-item-stats"><span>{data.acertos}/{data.total}</span></div>
                    </div>
                  ))}
                </div>

                <div className="section-subtitle">Desempenho por Taxonomia de Bloom</div>
                <div className="dim-list dim-list-readonly" style={{ marginBottom: 20 }}>
                  {Object.entries(alunoSelecionado.dimensoes.bloom || {}).map(([nome, data]: [string, any]) => (
                    <div key={nome} className="dim-item-static" style={{ background: getBgColor(data.taxa), borderColor: getBorderColor(data.taxa) }}>
                      <div className="dim-item-name">{nome}</div>
                      <div className="dim-item-legenda">{LEGENDAS.bloom[nome]}</div>
                      <div className="dim-item-value" style={{ color: getColor(data.taxa) }}>{data.taxa}%</div>
                      <div className="dim-item-stats"><span>{data.acertos}/{data.total}</span></div>
                    </div>
                  ))}
                </div>

                <div className="section-subtitle">Desempenho por Área de Formação</div>
                <div className="dim-list dim-list-readonly" style={{ marginBottom: 20 }}>
                  {Object.entries(alunoSelecionado.dimensoes.area_formacao || {}).map(([nome, data]: [string, any]) => (
                    <div key={nome} className="dim-item-static" style={{ background: getBgColor(data.taxa), borderColor: getBorderColor(data.taxa) }}>
                      <div className="dim-item-name">{nome}</div>
                      <div className="dim-item-legenda">{LEGENDAS.area_formacao[nome]}</div>
                      <div className="dim-item-value" style={{ color: getColor(data.taxa) }}>{data.taxa}%</div>
                      <div className="dim-item-stats"><span>{data.acertos}/{data.total}</span></div>
                    </div>
                  ))}
                </div>

                <div className="section-subtitle">Desempenho por Competência</div>
                <div className="dim-list dim-list-readonly" style={{ marginBottom: 20 }}>
                  {Object.entries(alunoSelecionado.dimensoes.competencia || {}).map(([nome, data]: [string, any]) => (
                    <div key={nome} className="dim-item-static" style={{ background: getBgColor(data.taxa), borderColor: getBorderColor(data.taxa) }}>
                      <div className="dim-item-name">{nome}</div>
                      <div className="dim-item-legenda">{LEGENDAS.competencia[nome]}</div>
                      <div className="dim-item-value" style={{ color: getColor(data.taxa) }}>{data.taxa}%</div>
                      <div className="dim-item-stats"><span>{data.acertos}/{data.total}</span></div>
                    </div>
                  ))}
                </div>

                <div className="section-subtitle">Desempenho por Cenário</div>
                <div className="dim-list dim-list-readonly" style={{ marginBottom: 20 }}>
                  {Object.entries(alunoSelecionado.dimensoes.cenario || {}).map(([nome, data]: [string, any]) => (
                    <div key={nome} className="dim-item-static" style={{ background: getBgColor(data.taxa), borderColor: getBorderColor(data.taxa) }}>
                      <div className="dim-item-name">{nome}</div>
                      <div className="dim-item-legenda">{LEGENDAS.cenario[nome]}</div>
                      <div className="dim-item-value" style={{ color: getColor(data.taxa) }}>{data.taxa}%</div>
                      <div className="dim-item-stats"><span>{data.acertos}/{data.total}</span></div>
                    </div>
                  ))}
                </div>

                <div className="section-subtitle">Questões Erradas ({alunoSelecionado.questoes_erradas.length})</div>
                <div className="questoes-erradas-list">
                  {alunoSelecionado.questoes_erradas.map((num: number) => {
                    const q = questoes.find(q => q.numero === num);
                    // Encontra a escolha do aluno para esta questão
                    const escolhaAluno = alunoSelecionado.escolhas?.[num - 1] || '?';
                    return q ? (
                      <div key={num} className="questao-errada-item" onClick={() => { setModalTitle(`Questão ${num}`); setModalQuestoes([q]); setQuestaoSelecionada(q); setModalOpen(true); }}>
                        <span className="qe-num">Q{num}</span>
                        <span className="qe-area">{q.area}</span>
                        <span className="qe-tema">{q.tema?.substring(0, 25)}{q.tema && q.tema.length > 25 ? '...' : ''}</span>
                        <span className="qe-gabarito">Gab: {q.gabarito}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <div className={`modal ${modalOpen ? 'active' : ''}`} onClick={() => setModalOpen(false)}>
        <div className="modal-content modal-wide" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">{modalTitle}</div>
            <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
          </div>
          
          {/* Sumário e Dropdown */}
          <div className="modal-controls">
            <div className="summary-box">
              <div className="summary-item">
                <div className="summary-label">Questões</div>
                <div className="summary-value">{modalQuestoes.length}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Taxa Média</div>
                <div className="summary-value" style={{ color: getColor(
                  modalQuestoes.length > 0 
                    ? modalQuestoes.reduce((s, q) => s + q.taxa_acerto, 0) / modalQuestoes.length 
                    : 0
                )}}>
                  {modalQuestoes.length > 0 
                    ? (modalQuestoes.reduce((s, q) => s + q.taxa_acerto, 0) / modalQuestoes.length).toFixed(1)
                    : 0}%
                </div>
              </div>
            </div>
            
            <div className="questao-dropdown">
              <label>Selecione uma questão:</label>
              <select 
                className="filter-select"
                value={questaoSelecionada?.numero || ''}
                onChange={(e) => {
                  const num = parseInt(e.target.value);
                  const q = modalQuestoes.find(q => q.numero === num);
                  setQuestaoSelecionada(q || null);
                }}
              >
                <option value="">-- Escolha uma questão --</option>
                {modalQuestoes.map(q => (
                  <option key={q.numero} value={q.numero}>
                    Q{q.numero} - {q.taxa_acerto.toFixed(1)}% acerto - {q.area}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Questão Selecionada */}
          {questaoSelecionada && (
            <div className="questao-detalhe">
              {/* Header da questão */}
              <div className="questao-detalhe-header">
                <span className="questao-numero">Questão {questaoSelecionada.numero}</span>
                <span className={`questao-taxa-grande ${questaoSelecionada.taxa_acerto < 50 ? 'danger' : questaoSelecionada.taxa_acerto < 70 ? 'warning' : 'success'}`}>
                  {questaoSelecionada.taxa_acerto.toFixed(1)}% de acerto
                </span>
              </div>
              
              {/* Tags organizadas */}
              <div className="questao-boxes">
          
          {/* Linha 1: Ciclo, Bloom, Competência */}
                <div className="boxes-row">
                  {questaoSelecionada.ciclo_formativo && (
                    <div className="box box-ciclo">
                      <div className="box-header">Ciclo Formativo</div>
                      <div className="box-content">{LEGENDAS.ciclo[questaoSelecionada.ciclo_formativo] || questaoSelecionada.ciclo_formativo}</div>
                    </div>
                  )}
                  {questaoSelecionada.bloom && (
                    <div className="box box-bloom">
                      <div className="box-header">Taxonomia de Bloom</div>
                      <div className="box-content">{questaoSelecionada.bloom}</div>
                    </div>
                  )}
                  {questaoSelecionada.competencia_principal && (
                    <div className="box box-comp">
                      <div className="box-header">Competência</div>
                      <div className="box-content">{questaoSelecionada.competencia_principal} - {LEGENDAS.competencia[questaoSelecionada.competencia_principal] || ''}</div>
                    </div>
                  )}
                </div>
                
                {/* Linha 2: Domínios e Cenários */}
                <div className="boxes-row">
                  {questaoSelecionada.dominios && (
                    <div className="box box-dom box-wide">
                      <div className="box-header">Domínios de Conteúdo</div>
                      <div className="box-items">
                        {questaoSelecionada.dominios.split(',').map((d: string) => d.trim()).filter(Boolean).map((dom: string, i: number) => (
                          <span key={`dom-${i}`} className="box-item">{dom} - {LEGENDAS.dominio[dom] || ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {questaoSelecionada.cenarios && (
                    <div className="box box-cen">
                      <div className="box-header">Cenários</div>
                      <div className="box-items">
                        {questaoSelecionada.cenarios.split(',').map((c: string) => c.trim()).filter(Boolean).map((cen: string, i: number) => (
                          <span key={`cen-${i}`} className="box-item">{cen} - {LEGENDAS.cenario[cen] || ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Linha 3: Eixo, Nível, Área de Formação */}
                <div className="boxes-row">
                  {questaoSelecionada.eixo_cognitivo && (
                    <div className="box box-eixo">
                      <div className="box-header">Eixo Cognitivo</div>
                      <div className="box-content">{questaoSelecionada.eixo_cognitivo} - {LEGENDAS.eixo_cognitivo?.[questaoSelecionada.eixo_cognitivo] || ''}</div>
                    </div>
                  )}
                  {questaoSelecionada.nivel_cognitivo && (
                    <div className="box box-nivel">
                      <div className="box-header">Nível Cognitivo</div>
                      <div className="box-content">{questaoSelecionada.nivel_cognitivo} - {LEGENDAS.nivel_cognitivo?.[questaoSelecionada.nivel_cognitivo] || ''}</div>
                    </div>
                  )}
                  {questaoSelecionada.area_formacao_principal && (
                    <div className="box box-form">
                      <div className="box-header">Área de Formação</div>
                      <div className="box-items">
                        <span className="box-item">{questaoSelecionada.area_formacao_principal} - {LEGENDAS.area_formacao[questaoSelecionada.area_formacao_principal] || ''}</span>
                        {questaoSelecionada.area_formacao_secundaria && <span className="box-item secondary">{questaoSelecionada.area_formacao_secundaria} (2ª)</span>}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Linha 4: Hierarquia de Conteúdos */}
                <div className="boxes-row">
                  <div className="box box-hier box-full">
                    <div className="box-header">Hierarquia de Conteúdos</div>
                    <div className="hier-flow">
                      {questaoSelecionada.area && <div className="hier-item"><span className="hier-label">Área</span><span className="hier-value">{questaoSelecionada.area}</span></div>}
                      {questaoSelecionada.area && questaoSelecionada.subespecialidade && <span className="hier-arrow">→</span>}
                      {questaoSelecionada.subespecialidade && <div className="hier-item"><span className="hier-label">Subespecialidade</span><span className="hier-value">{questaoSelecionada.subespecialidade}</span></div>}
                      {questaoSelecionada.subespecialidade && questaoSelecionada.tema && <span className="hier-arrow">→</span>}
                      {questaoSelecionada.tema && <div className="hier-item"><span className="hier-label">Tema</span><span className="hier-value">{questaoSelecionada.tema}</span></div>}
                      {questaoSelecionada.tema && questaoSelecionada.subtema && <span className="hier-arrow">→</span>}
                      {questaoSelecionada.subtema && <div className="hier-item"><span className="hier-label">Subtema</span><span className="hier-value">{questaoSelecionada.subtema}</span></div>}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enunciado */}
              <div className="questao-enunciado-completo">
                <div className="enunciado-header">Enunciado</div>
                <div className="enunciado-texto">{questaoSelecionada.enunciado}</div>
              </div>
              
              {/* Alternativas e gabarito */}
              <div className="alternativas-box">
                <div className="alternativas-header">Alternativas</div>
                {['A', 'B', 'C', 'D'].map(letra => {
                  const isGabarito = questaoSelecionada.gabarito === letra;
                  const textoAlt = letra === 'A' ? questaoSelecionada.alternativa_a
                    : letra === 'B' ? questaoSelecionada.alternativa_b
                    : letra === 'C' ? questaoSelecionada.alternativa_c
                    : questaoSelecionada.alternativa_d;

                  return (
                    <div
                      key={letra}
                      className={`alternativa ${isGabarito ? 'correta' : 'incorreta'}`}
                    >
                      <div className="alt-header">
                        <div className="alt-letra">{letra}</div>
                        <div className="alt-texto">{textoAlt || `Alternativa ${letra}`}</div>
                        {isGabarito && <span className="alt-gabarito">✓ GABARITO</span>}
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 10, fontSize: 13, color: '#fff' }}>
                  <strong>Acertos:</strong> <span style={{ color: '#22c55e' }}>{questaoSelecionada.acertos}</span> de {questaoSelecionada.total} alunos ({questaoSelecionada.taxa_acerto.toFixed(1)}%)
                </div>
              </div>
            </div>
          )}
          
          {/* Mensagem quando não há questão selecionada */}
          {!questaoSelecionada && modalQuestoes.length > 0 && (
            <div className="selecione-questao">
              Selecione uma questão no dropdown acima para ver os detalhes completos.
            </div>
          )}
        </div>
      </div>

      <div className="footer">SPRMed Dashboard ENAMED 2025/2026®</div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511941073157?text=Ol%C3%A1%20Dr.%20Vin%C3%ADcius%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20relat%C3%B3rio%20ENAMED."
        target="_blank"
        rel="noopener noreferrer"
        title="Fale com o Dr. Vinícius - SPRMed"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999,
          transition: 'transform 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
