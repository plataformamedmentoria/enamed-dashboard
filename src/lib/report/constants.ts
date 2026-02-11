export interface EscolaConfig {
  nome: string;
  cidade: string;
  uf: string;
  alunos: number;
  nota: number;
  proficiencia: number;
  risco: number;
  percentualRisco: number;
}

export const ESCOLAS: Record<string, EscolaConfig> = {
  brasil_todos: {
    nome: 'Brasil (Todos)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 89016,
    nota: 67.01,
    proficiencia: 0.0,
    risco: 0,
    percentualRisco: 0,
  },
  brasil_concluintes: {
    nome: 'Brasil (Concluintes)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 39256,
    nota: 65.03,
    proficiencia: -0.11,
    risco: 0,
    percentualRisco: 0,
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
  },
};

export const LEGENDAS: Record<string, Record<string, string>> = {
  ciclo: {
    M2: 'ENAMED-2 - Ciclo Basico (Final do 2o ano)',
    M4: 'ENAMED-4 - Ciclo Clinico (Final do 4o ano)',
    M6: 'ENAMED-6 - Internato (Final do 6o ano)',
  },
  eixo_cognitivo: {
    E1: 'Conhecimento e Compreensao',
    E2: 'Aplicacao e Analise',
    E3: 'Avaliacao e Julgamento Etico-Profissional',
  },
  nivel_cognitivo: {
    NC1: 'Conhecimento e Compreensao (Cognitivo)',
    NC2: 'Aplicacao e Execucao Pratica (Psicomotor)',
    NC3: 'Raciocinio Clinico e Julgamento Etico (Atitudinal)',
  },
  eixo_transversal: {
    AT: 'Atencao a Saude - Cuidado integral centrado na pessoa',
    GS: 'Gestao em Saude - Planejamento, equipe, politicas',
    ES: 'Educacao em Saude - Aprendizagem continua, educacao permanente',
  },
  competencia: {
    'C-I': 'Singularidade - Respeitar a singularidade de cada pessoa',
    'C-II': 'Hipoteses diagnosticas - Formular hipoteses e plano propedeutico',
    'C-III': 'Exames complementares - Solicitar e interpretar',
    'C-IV': 'Planos terapeuticos - Elaborar, pactuar e acompanhar',
    'C-V': 'Urgencias/emergencias - Reconhecer e tratar',
    'C-VI': 'Procedimentos basicos - Indicar e realizar procedimentos clinicos e cirurgicos',
    'C-VII': 'Necessidades coletivas - Identificar necessidades coletivas de saude',
    'C-VIII': 'Promocao e vigilancia - Planejar e implementar acoes',
    'C-IX': 'Principios do SUS - Aplicar principios e politicas do SUS',
    'C-X': 'Comunicacao - Comunicar-se com pacientes, familias e equipes',
    'C-XI': 'Equipe multiprofissional - Trabalhar em equipe multiprofissional',
    'C-XII': 'Etica e deontologia - Respeitar normas eticas e deontologicas',
    'C-XIII': 'Autorreflexao - Atitude autorreflexiva e aprendizado permanente',
    'C-XIV': 'TICs em saude - Tecnologias da informacao e comunicacao',
    'C-XV': 'Emergencias sanitarias - Atuar em emergencias e desastres',
  },
  dominio: {
    'D-I': 'Bases moleculares e celulares (Bloco I)',
    'D-II': 'Processos fisiologicos do ciclo de vida (Bloco I)',
    'D-III': 'Determinantes sociais, culturais e ecologicos (Bloco I)',
    'D-IV': 'Etica, bioetica e seguranca de dados (Bloco II)',
    'D-V': 'Direitos humanos e inclusao (Bloco II)',
    'D-VI': 'Semiologia (Bloco II)',
    'D-VII': 'Comunicacao em saude (Bloco II)',
    'D-VIII': 'Registro e documentacao medica (Bloco II)',
    'D-IX': 'Propedeutica e diagnostico (Bloco III)',
    'D-X': 'Terapeutica (Bloco III)',
    'D-XI': 'Prognostico e prevencao (Bloco III)',
    'D-XII': 'Reabilitacao (Bloco III)',
    'D-XIII': 'Promocao e educacao em saude (Bloco III)',
    'D-XIV': 'Politicas de saude e SUS (Bloco IV)',
    'D-XV': 'Gestao de servicos (Bloco IV)',
    'D-XVI': 'Epidemiologia (Bloco IV)',
    'D-XVII': 'Vigilancia em saude (Bloco IV)',
    'D-XVIII': 'Saude ambiental e ocupacional (Bloco IV)',
    'D-XIX': 'Lideranca e trabalho em equipe (Bloco IV)',
    'D-XX': 'Metodologia cientifica e MBE (Bloco IV)',
    'D-XXI': 'Tecnologias da informacao (Bloco IV)',
  },
  cenario: {
    APS: 'Atencao Primaria a Saude (UBS, ESF, NASF-AB)',
    URG: 'Urgencia e Emergencia (UPA, SAMU, PS)',
    MAT: 'Rede Materno-Infantil (Maternidades, Casas de parto)',
    RAPS: 'Atencao Psicossocial (CAPS I/II/AD)',
    CRON: 'Doencas Cronicas (Ambulatorios, Atencao domiciliar)',
    REAB: 'Reabilitacao (Centros de referencia)',
    GESTAO: 'Gestao em Saude (Planejamento, equipe, politicas)',
  },
  bloom: {
    Lembrar: '1 - Recuperar informacao da memoria',
    Entender: '2 - Compreender significado, interpretar',
    Aplicar: '3 - Usar conhecimento em situacao pratica',
    Analisar: '4 - Decompor em partes, identificar relacoes',
    Avaliar: '5 - Fazer julgamentos baseados em criterios',
    Criar: '6 - Produzir algo novo, sintetizar',
  },
  area_formacao: {
    CLIN: 'Clinica Medica - Diagnostico e terapeutico em adultos',
    CIR: 'Cirurgia Geral - Manejo cirurgico basico, trauma e urgencias',
    GO: 'Ginecologia e Obstetricia - Cuidado integral a saude da mulher',
    PED: 'Pediatria - Cuidado integral de criancas e adolescentes',
    MFC: 'Medicina de Familia e Comunidade - Atencao primaria, cuidado longitudinal',
    SM: 'Saude Mental - Reconhecimento, manejo e atencao psicossocial',
    SC: 'Saude Coletiva - Epidemiologia, vigilancia, gestao do SUS, bioetica',
  },
};

// Configuração das seções de dimensão do relatório
export interface DimensionConfig {
  titulo: string;
  indiceKey: string;
  sprmedKey?: string; // se null, calcular taxas dinâmicas
  legendaKey?: string;
}

export const DIMENSOES: DimensionConfig[] = [
  { titulo: 'Ciclo Formativo', indiceKey: 'por_ciclo', sprmedKey: 'ciclos', legendaKey: 'ciclo' },
  { titulo: 'Taxonomia de Bloom', indiceKey: 'por_bloom', sprmedKey: 'bloom', legendaKey: 'bloom' },
  { titulo: 'Competencias ENAMED', indiceKey: 'por_competencia', sprmedKey: 'competencias', legendaKey: 'competencia' },
  { titulo: 'Dominios de Conteudo', indiceKey: 'por_dominio', sprmedKey: 'dominios', legendaKey: 'dominio' },
  { titulo: 'Cenarios de Atuacao', indiceKey: 'por_cenario', sprmedKey: 'cenarios', legendaKey: 'cenario' },
  { titulo: 'Eixo Cognitivo', indiceKey: 'por_eixo_cognitivo', legendaKey: 'eixo_cognitivo' },
  { titulo: 'Nivel Cognitivo', indiceKey: 'por_nivel_cognitivo', legendaKey: 'nivel_cognitivo' },
  { titulo: 'Eixos Transversais', indiceKey: 'por_eixo_transversal', legendaKey: 'eixo_transversal' },
  { titulo: 'Area de Formacao', indiceKey: 'por_area_formacao', legendaKey: 'area_formacao' },
  { titulo: 'Areas de Conhecimento', indiceKey: 'por_area' },
  { titulo: 'Subespecialidades e Temas', indiceKey: 'por_subespecialidade' },
];
