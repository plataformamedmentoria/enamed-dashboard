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
    M2: 'Lembrar/Entender (Bloom 1-2)',
    M4: 'Aplicar/Analisar (Bloom 3-4)',
    M6: 'Avaliar/Criar (Bloom 5-6)',
  },
  eixo_cognitivo: {
    E1: 'Lembrar e Entender',
    E2: 'Aplicar e Analisar',
    E3: 'Avaliar e Criar',
  },
  nivel_cognitivo: {
    NC1: 'Basico (Lembrar/Entender)',
    NC2: 'Intermediario (Aplicar/Analisar)',
    NC3: 'Avancado (Avaliar/Criar)',
  },
  eixo_transversal: {
    AT: 'Atencao a Saude',
    GS: 'Gestao em Saude',
    ES: 'Educacao em Saude',
  },
  competencia: {
    'C-I': 'Singularidade',
    'C-II': 'Hipoteses diagnosticas',
    'C-III': 'Exames complementares',
    'C-IV': 'Planos terapeuticos',
    'C-V': 'Urgencias/emergencias',
    'C-VI': 'Procedimentos basicos',
    'C-VII': 'Necessidades coletivas',
    'C-VIII': 'Promocao e vigilancia',
    'C-IX': 'Principios do SUS',
    'C-X': 'Comunicacao',
    'C-XI': 'Equipe multiprofissional',
    'C-XII': 'Etica e deontologia',
    'C-XIII': 'Autorreflexao',
    'C-XIV': 'TICs em saude',
    'C-XV': 'Emergencias sanitarias',
  },
  dominio: {
    'D-I': 'Bases moleculares e celulares',
    'D-II': 'Processos fisiologicos',
    'D-III': 'Determinantes sociais',
    'D-IV': 'Etica, bioetica e seguranca',
    'D-V': 'Direitos humanos e inclusao',
    'D-VI': 'Semiologia',
    'D-VII': 'Comunicacao em saude',
    'D-VIII': 'Registro e documentacao',
    'D-IX': 'Propedeutica e diagnostico',
    'D-X': 'Terapeutica',
    'D-XI': 'Prognostico e prevencao',
    'D-XII': 'Reabilitacao',
    'D-XIII': 'Promocao e educacao',
    'D-XIV': 'Politicas de saude e SUS',
    'D-XV': 'Gestao de servicos',
    'D-XVI': 'Epidemiologia',
    'D-XVII': 'Vigilancia em saude',
    'D-XVIII': 'Saude ambiental e ocupacional',
    'D-XIX': 'Lideranca e trabalho em equipe',
    'D-XX': 'Metodologia cientifica e MBE',
    'D-XXI': 'Tecnologias da informacao',
  },
  cenario: {
    APS: 'Atencao Primaria (UBS, ESF)',
    URG: 'Urgencia e Emergencia',
    MAT: 'Rede Materno-Infantil',
    RAPS: 'Atencao Psicossocial (CAPS)',
    CRON: 'Doencas Cronicas',
    REAB: 'Reabilitacao',
    GS: 'Gestao em Saude',
  },
  bloom: {
    Lembrar: '1 - Recuperar informacao',
    Entender: '2 - Compreender significado',
    Aplicar: '3 - Usar em pratica',
    Analisar: '4 - Decompor em partes',
    Avaliar: '5 - Fazer julgamentos',
    Criar: '6 - Produzir algo novo',
  },
  area_formacao: {
    CLIN: 'Clinica Medica',
    CIR: 'Cirurgia',
    GO: 'Ginecologia e Obstetricia',
    PED: 'Pediatria',
    MFC: 'Medicina de Familia',
    SM: 'Saude Mental',
    SC: 'Saude Coletiva',
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
