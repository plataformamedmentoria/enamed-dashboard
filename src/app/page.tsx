'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components';

// Configurações das escolas
const ESCOLAS_BRASIL = [
  {
    id: 'brasil_todos',
    nome: 'Brasil (Todos)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 89016,
    nota: 67.01,
    proficiencia: 0.00,
    destaque: true
  },
  {
    id: 'brasil_concluintes',
    nome: 'Brasil (Concluintes)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 39256,
    nota: 65.03,
    proficiencia: -0.11,
    destaque: true
  },
  {
    id: 'enamed_5',
    nome: 'ENAMED 5 (49 faculdades)',
    cidade: 'Nacional',
    uf: 'BR',
    alunos: 4129,
    nota: 73.42,
    proficiencia: 0.36,
    destaque: true
  }
];

const ESCOLAS = [
  {
    id: 'unimar',
    nome: 'UNIMAR',
    cidade: 'Marília',
    uf: 'SP',
    alunos: 163,
    nota: 60.56,
    proficiencia: -0.37
  },
  {
    id: 'unifaa',
    nome: 'UNIFAA',
    cidade: 'Valença',
    uf: 'RJ',
    alunos: 220,
    nota: 64.71,
    proficiencia: -0.13
  },
  {
    id: 'integrado',
    nome: 'Faculdade Integrado',
    cidade: 'Campo Mourão',
    uf: 'PR',
    alunos: 129,
    nota: 63.39,
    proficiencia: -0.21
  },
  {
    id: 'multivix_vitoria',
    nome: 'Multivix Vitória',
    cidade: 'Vitória',
    uf: 'ES',
    alunos: 137,
    nota: 66.75,
    proficiencia: -0.02
  },
  {
    id: 'multivix_cachoeiro',
    nome: 'Fac. Brasileira de Cachoeiro',
    cidade: 'Cachoeiro de Itapemirim',
    uf: 'ES',
    alunos: 109,
    nota: 65.28,
    proficiencia: -0.1
  },
  {
    id: 'slmandic_araras',
    nome: 'SLMandic Araras',
    cidade: 'Araras',
    uf: 'SP',
    alunos: 83,
    nota: 56.76,
    proficiencia: -0.58
  },
  {
    id: 'slmandic_campinas',
    nome: 'SLMandic Campinas',
    cidade: 'Campinas',
    uf: 'SP',
    alunos: 191,
    nota: 62.2,
    proficiencia: -0.27
  },
  {
    id: 'facene_rn',
    nome: 'FACENE Mossoró',
    cidade: 'Mossoró',
    uf: 'RN',
    alunos: 126,
    nota: 60.26,
    proficiencia: -0.39
  },
  {
    id: 'unifoa',
    nome: 'UNIFOA',
    cidade: 'Volta Redonda',
    uf: 'RJ',
    alunos: 119,
    nota: 61.71,
    proficiencia: -0.3
  }
];

export default function Home() {
  const [filtroUF, setFiltroUF] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');

  const ufsDisponiveis = [...new Set(ESCOLAS.map(e => e.uf))].sort();
  const municipiosDisponiveis = [...new Set(
    ESCOLAS
      .filter(e => !filtroUF || e.uf === filtroUF)
      .map(e => e.cidade)
  )].sort();

  const escolasFiltradas = ESCOLAS.filter(e => {
    if (filtroUF && e.uf !== filtroUF) return false;
    if (filtroMunicipio && e.cidade !== filtroMunicipio) return false;
    return true;
  });

  const temFiltroAtivo = filtroUF || filtroMunicipio;

  const labelContagem = temFiltroAtivo
    ? `${escolasFiltradas.length} ${escolasFiltradas.length === 1 ? 'instituição' : 'instituições'} ${filtroUF ? `em ${filtroUF}` : ''}${filtroMunicipio ? ` - ${filtroMunicipio}` : ''}`
    : `${ESCOLAS.length} instituições`;

  return (
    <main className="min-h-screen bg-[#0a1628] text-gray-200">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard ENAMED 2025</h1>
        <p className="text-gray-400 mb-8">Selecione uma opção para visualizar a análise</p>

        {/* Brasil */}
        <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
          <span>🇧🇷</span> Brasil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {ESCOLAS_BRASIL.map((escola) => (
            <Link
              key={escola.id}
              href={`/escola/${escola.id}`}
              className="block"
            >
              <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all cursor-pointer">
                <h2 className="text-2xl font-bold text-white mb-1">{escola.nome}</h2>
                <p className="text-blue-300 mb-4">{escola.alunos.toLocaleString()} alunos</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-blue-300/70">Nota Média</div>
                    <div className="text-2xl font-bold text-white">{escola.nota}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-300/70">Proficiência TRI</div>
                    <div className="text-2xl font-bold text-white">{escola.proficiencia.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Filtros + Instituições */}
        <h2 className="text-xl font-semibold text-gray-400 mb-4 flex items-center gap-2">
          <span>🏫</span> Instituições
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={filtroUF}
            onChange={(e) => {
              setFiltroUF(e.target.value);
              setFiltroMunicipio('');
            }}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos os estados</option>
            {ufsDisponiveis.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>

          <select
            value={filtroMunicipio}
            onChange={(e) => setFiltroMunicipio(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Todos os municípios</option>
            {municipiosDisponiveis.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>

          {temFiltroAtivo && (
            <button
              onClick={() => { setFiltroUF(''); setFiltroMunicipio(''); }}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg border border-white/10 hover:border-white/30"
            >
              Limpar filtros
            </button>
          )}

          <span className="text-sm text-gray-500 ml-auto">{labelContagem}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {escolasFiltradas.map((escola) => (
            <Link
              key={escola.id}
              href={`/escola/${escola.id}`}
              className="block"
            >
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer">
                <h2 className="text-2xl font-bold text-white mb-1">{escola.nome}</h2>
                <p className="text-gray-400 mb-4">{escola.cidade}/{escola.uf}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Alunos</div>
                    <div className="text-xl font-bold text-white">{escola.alunos}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Nota Média</div>
                    <div className="text-xl font-bold text-white">{escola.nota}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Proficiência</div>
                    <div className="text-xl font-bold text-white">{escola.proficiencia}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          SPRMed Dashboard ENAMED 2025/2026®
        </div>
      </div>
    </main>
  );
}
