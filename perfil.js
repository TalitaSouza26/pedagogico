/* ============================================================
   perfil.js — Perfis de acesso (Orientação Técnica Nº 012/2026)
   Define os perfis administrativos e pedagógicos, o recorte de
   dados por etapa/modalidade/área e o seletor de perfil da topbar.
   Compartilhado por todas as telas do Painel Pedagógico.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Perfis (seção 2 do documento) ---- */
  const PERFIS = [
    // Equipe administrativa — visão ampla (rede inteira)
    { id: 'secretario',   nome: 'Ana Ribeiro',        cargo: 'Secretário(a) Municipal de Educação', grupo: 'Administrativo', escopo: 'rede' },
    { id: 'adjunta',      nome: 'Marina Teles',       cargo: 'Secretária Municipal Adjunta',        grupo: 'Administrativo', escopo: 'rede' },
    { id: 'subsecretaria',nome: 'Cláudia Ramos',      cargo: 'Subsecretária do Litoral Sul',        grupo: 'Administrativo', escopo: 'rede' },
    { id: 'gestor',       nome: 'Paulo Menezes',      cargo: 'Gestor do Contrato',                  grupo: 'Administrativo', escopo: 'rede' },
    // Equipe pedagógica
    { id: 'supervisor',   nome: 'Ana Ribeiro',        cargo: 'Coordenador',                              grupo: 'Pedagógico', escopo: 'rede' },
    { id: 'infantil',     nome: 'Rita Fontes',        cargo: 'Coordenação da Educação Infantil',         grupo: 'Pedagógico', escopo: 'etapa', etapa: 'Infantil' },
    { id: 'fund1',        nome: 'Josefa Lima',        cargo: 'Coordenação do Ensino Fundamental I',      grupo: 'Pedagógico', escopo: 'etapa', etapa: 'Fund I' },
    { id: 'fund2',        nome: 'Hélio Barros',       cargo: 'Coordenação do Ensino Fundamental II',     grupo: 'Pedagógico', escopo: 'etapa', etapa: 'Fund II' },
    { id: 'ejai',         nome: 'Sônia Prado',        cargo: 'Coordenação da EJAI',                      grupo: 'Pedagógico', escopo: 'etapa', etapa: 'EJAI' },
    { id: 'especial',     nome: 'Dora Vasconcelos',   cargo: 'Coordenação de Educação Especial',         grupo: 'Pedagógico', escopo: 'especial' },
    { id: 'campo',        nome: 'Ivo Santana',        cargo: 'Coordenação de Educação do Campo',         grupo: 'Pedagógico', escopo: 'modalidade', modalidade: 'Campo' },
    { id: 'indigena',     nome: 'Célia Andrade',      cargo: 'Coordenação de Educação Escolar Indígena', grupo: 'Pedagógico', escopo: 'modalidade', modalidade: 'Indígena' },
  ];
  const KEY = 'eprof_perfil';

  let ativoId = null;
  try { ativoId = localStorage.getItem(KEY); } catch (e) {}
  const urlPerfil = new URLSearchParams(location.search).get('perfil');
  if (urlPerfil) ativoId = urlPerfil;
  const ativo = PERFIS.find(p => p.id === ativoId) || PERFIS.find(p => p.id === 'supervisor');

  /* ---- Gerador único das 60 escolas da rede (mesma fórmula da tela Escolas) ---- */
  const NOMES = [
    'E.M. Cidade Alta','E.M. Baianão','E.M. Frei Calixto','CMEI Estrela do Mar',"E.M. Arraial d'Ajuda",'E.M. Trancoso','E.M. Vera Cruz','E.M. Pindorama','CMEI Primeiros Passos','E.M. Coroa Vermelha',
    'E.M. Caraíva','E.M. Vale do Jequitibá','E.M. Mundaí','E.M. Taperapuã','E.M. Cambolo','CMEI Girassol','E.M. Juçara','E.M. Mirante','E.M. Itaquena','E.M. Guaiú',
    'E.M. Nova Brasília','E.M. Parque Ecológico','CMEI Pequeno Príncipe','E.M. Fontana','E.M. Alto do Mercado','E.M. Gruta Azul','E.M. Ponta Grande','E.M. Rio da Prata','E.M. Vale Verde','CMEI Semente do Saber',
    'E.M. Monte Pascoal','E.M. Pataxó','E.M. Aldeia Jaqueira','E.M. Barra Velha','E.M. Corumbau','E.M. Km 40','E.M. Santo André','E.M. Santa Cruz','E.M. Outeiro','E.M. Recife de Fora',
    'CMEI Arco-Íris','E.M. Vila de Trancoso','E.M. Nova Aliança','E.M. José de Anchieta','E.M. Pero Vaz','E.M. Tancredo Neves','E.M. Paulo Freire','E.M. Anísio Teixeira','CMEI Mundo Encantado','E.M. Castro Alves',
    'E.M. Rui Barbosa','E.M. Cecília Meireles','E.M. Monteiro Lobato','E.M. Darcy Ribeiro','E.M. Zumbi dos Palmares','E.M. Chico Mendes','CMEI Vovó Maria','E.M. Nova Alegria','E.M. Boa Esperança','E.M. Campo Verde'
  ];
  const LOCS = ['Urbana','Urbana','Urbana','Urbana','Campo','Campo','Indígena'];
  const BAIRROS = ['Centro','Cidade Alta','Baianão','Cambolo','Trancoso',"Arraial d'Ajuda",'Coroa Vermelha','Vale Verde','Mundaí','Taperapuã','Juçara','Zona Rural','Nova Esperança','Pindorama','Mirante'];
  const ETAPAS_OPTS = ['Anos iniciais','Anos iniciais, Anos finais','Anos iniciais, Anos finais, EJA'];

  const REDE = NOMES.map((nome, i) => {
    const r = k => ((i * 9301 + k * 49297) % 233280) / 233280;
    const cmei = nome.startsWith('CMEI');
    const alunos = cmei ? 110 + Math.floor(r(1) * 150) : 360 + Math.floor(r(1) * 900);
    const freq = Math.round((84 + r(2) * 14.4) * 10) / 10;
    const turmas = cmei ? 8 + Math.floor(r(3) * 8) : 16 + Math.floor(r(3) * 26);
    const servidores = cmei ? 20 + Math.floor(r(4) * 18) : 30 + Math.floor(r(4) * 40);
    const ocupacao = 84 + Math.floor(r(5) * 26);
    const ocorrencias = Math.floor(r(6) * 12);
    const vagas = Math.max(alunos, Math.round(alunos / (ocupacao / 100)));
    const direcao = 1, coord = cmei ? 1 + Math.floor(r(9) * 2) : 2 + Math.floor(r(9) * 2), sec = 1 + Math.floor(r(10) * 2);
    const apoio = cmei ? 7 + Math.floor(r(11) * 6) : 4 + Math.floor(r(11) * 6);
    const prof = Math.max(5, servidores - direcao - coord - sec - apoio);
    const localidade = LOCS[Math.floor(r(13) * LOCS.length)];
    const etapas = cmei ? 'Creche, Pré-escola' : ETAPAS_OPTS[Math.floor(r(14) * ETAPAS_OPTS.length)];
    const modalidade = localidade === 'Campo' ? 'Campo' : localidade === 'Indígena' ? 'Indígena' : 'Regular';
    return {
      inep: String(31097401 + i), nome, cmei, bairro: BAIRROS[Math.floor(r(12) * BAIRROS.length)],
      localidade, modalidade, etapas, alunos, matriculas: alunos, freq, turmas, servidores, ocupacao, ocorrencias, vagas,
      responsaveis: Math.round(alunos * 0.72),
      equipe: { direcao, coord, prof, sec, apoio },
      infantil: cmei || /Creche|Pré/.test(etapas),
      fund1: !cmei && /Anos iniciais/.test(etapas),
      fund2: !cmei && /Anos finais/.test(etapas),
      ejai: !cmei && /EJA/.test(etapas),
    };
  });
  const REDE_NOME = {}; REDE.forEach(e => REDE_NOME[e.inep] = e.nome);

  /* Equipe da escola — mesma numeração de matrícula da tela Servidores (deep-link #m) */
  const FIRST = ['Ana','Bruno','Carla','Diego','Elaine','Fábio','Gisele','Hugo','Iara','João','Karla','Luís','Marta','Nara','Otávio','Paula','Rafael','Sônia','Tiago','Vera','Wesley','Yara','Cléber','Zélia','Marcos','Priscila','Anderson','Luciana','Fernanda','Roberto'];
  const LAST = ['Silva','Souza','Oliveira','Santos','Rocha','Fontes','Melo','Prado','Carvalho','Barros','Nunes','Alves','Farias','Menezes','Ribeiro','Gomes','Antunes','Castro','Duarte','Teles','Aquino','Vasconcelos','Andrade','Pinto'];
  const pad2 = n => String(n).padStart(2, '0');
  const DISC_POOL = ['Agroecologia','Arte','Ciências','Diversidade Afro e Indígena','Educação Física','Ensino Religioso','Geografia','Leitura e Produção de Texto','História','História de Porto Seguro','Língua Inglesa','Língua Portuguesa','Matemática'];
  const TURMA_POOL = ['1º ANO A','2º ANO A','3º ANO A','4º ANO B','5º ANO A','6º ANO A','7º ANO B','8º ANO A','9º ANO A'];
  const VINCULOS = ['efetivo','efetivo','contrato','designado'];
  const SIT_LBL = { exercicio:'Em exercício', licenca:'Licença', afastado:'Afastado', cedido:'Cedido' };
  function gerarEquipe(inep) {
    const nomeEsc = REDE_NOME[inep] || ''; const cmei = nomeEsc.startsWith('CMEI');
    const base = parseInt(inep.slice(-3)); const rr = k => ((base * 9301 + k * 49297) % 233280) / 233280;
    const team = []; let idx = 0;
    const add = (grupo, cargo, opts = {}) => {
      const nome = FIRST[Math.floor(rr(100 + idx * 3) * FIRST.length)] + ' ' + LAST[Math.floor(rr(101 + idx * 3) * LAST.length)];
      const sr = rr(102 + idx * 3);
      const situacao = sr > 0.94 ? 'cedido' : sr > 0.9 ? 'afastado' : sr > 0.85 ? 'licenca' : 'exercicio';
      const detalhe = situacao === 'licenca' ? 'Licença maternidade' : situacao === 'afastado' ? 'Afastamento para tratamento de saúde' : situacao === 'cedido' ? 'Cedido à Secretaria' : null;
      const carga = grupo === 'Professores' ? [20, 40][Math.floor(rr(103 + idx * 3) * 2)] : 40;
      const acesso = rr(105 + idx * 3) > 0.22 ? pad2(1 + Math.floor(rr(106 + idx * 3) * 27)) + '/07/2026' : 'nunca';
      const myIdx = parseInt(inep) - 31097401;
      const cargos = [cargo];
      if (rr(110 + idx * 3) > 0.86) cargos.push(cargo.includes('Professor') ? 'Coordenador(a) pedagógico(a)' : 'Professor(a)');
      const lotacoes = [{ escola: nomeEsc, cargos }];
      const multiChance = grupo === 'Professores' ? 0.5 : 0.85;
      if (rr(108 + idx * 3) > multiChance) { const extra = rr(109 + idx * 3) > 0.82 ? 2 : 1; for (let k = 0; k < extra; k++) { let j = Math.floor(rr(120 + idx * 3 + k) * 60); if (j === myIdx) j = (j + 1) % 60; lotacoes.push({ escola: REDE_NOME[String(31097401 + j)] || nomeEsc, cargos: [cargo] }); } }
      const vinculos = lotacoes.length;
      const ncargos = new Set(lotacoes.flatMap(l => l.cargos)).size;
      team.push({ m: inep.slice(2) + pad2(idx), nome, cargo, grupo, vinculo: VINCULOS[Math.floor(rr(107 + idx * 3) * 4)], carga, situacao, detalhe, acesso, escola: inep, lotacoes, vinculos, ncargos, etapas: [], disc: [], turmas: [], ocor: [], ...opts });
      idx++;
    };
    add('Direção', 'Diretor(a)');
    const nc = cmei ? 1 : 2 + Math.floor(rr(1) * 2); for (let i = 0; i < nc; i++) add('Coordenação', 'Coordenador(a) pedagógico(a)');
    const np = cmei ? 8 + Math.floor(rr(2) * 8) : 16 + Math.floor(rr(2) * 22);
    for (let i = 0; i < np; i++) {
      const d = DISC_POOL[Math.floor(rr(300 + i) * DISC_POOL.length)];
      const etapa = cmei ? 'Ed. Infantil' : (rr(320 + i) > 0.5 ? 'Fundamental I' : 'Fundamental II');
      const nt = 1 + Math.floor(rr(340 + i) * 2);
      const turmas = Array.from({ length: nt }, (_, k) => ({ t: TURMA_POOL[Math.floor(rr(360 + i * 2 + k) * TURMA_POOL.length)], n: etapa, turno: rr(380 + i + k) > 0.5 ? 'Matutino' : 'Vespertino' }));
      const ocor = rr(400 + i) > 0.86 ? [{ t: turmas[0].t, tipo: 'Infrequência', data: pad2(1 + Math.floor(rr(410 + i) * 27)) + '/07/2026' }] : [];
      add('Professores', 'Professor(a)', { etapas: [etapa], disc: [d], turmas, ocor });
    }
    add('Secretaria', 'Secretário(a) escolar'); if (!cmei || rr(3) > 0.4) add('Secretaria', 'Auxiliar de secretaria');
    return team;
  }

  /* ---- Recorte por perfil (seção 3) ---- */
  function classifica(esc) {
    // aceita objeto {nome, localidade, etapas} OU flags já calculadas
    const cmei = esc.cmei != null ? esc.cmei : (esc.nome || '').startsWith('CMEI');
    const et = esc.etapas || '';
    const mod = esc.modalidade || (esc.localidade === 'Campo' ? 'Campo' : esc.localidade === 'Indígena' ? 'Indígena' : 'Regular');
    return {
      modalidade: mod,
      infantil: esc.infantil != null ? esc.infantil : (cmei || /Creche|Pré/.test(et)),
      fund1: esc.fund1 != null ? esc.fund1 : (!cmei && /Anos iniciais/.test(et)),
      fund2: esc.fund2 != null ? esc.fund2 : (!cmei && /Anos finais/.test(et)),
      ejai: esc.ejai != null ? esc.ejai : (!cmei && /EJA/.test(et)),
    };
  }
  function emEscopo(esc) {
    if (ativo.escopo === 'rede' || ativo.escopo === 'especial') return true;
    const c = classifica(esc);
    if (ativo.escopo === 'modalidade') return c.modalidade === ativo.modalidade;
    if (ativo.escopo === 'etapa') {
      if (ativo.etapa === 'Infantil') return c.infantil;
      if (ativo.etapa === 'Fund I') return c.fund1;
      if (ativo.etapa === 'Fund II') return c.fund2;
      if (ativo.etapa === 'EJAI') return c.ejai;
    }
    return true;
  }
  function emEscopoNome(nome) {
    const e = REDE.find(x => x.nome === nome);
    return e ? emEscopo(e) : true; // se a escola não está na base, não filtra
  }

  const LABELS = {
    rede: 'Rede municipal · todas as escolas',
    Infantil: 'Educação Infantil',
    'Fund I': 'Ensino Fundamental I',
    'Fund II': 'Ensino Fundamental II',
    EJAI: 'EJAI · Jovens, Adultos e Idosos',
    especial: 'Educação Especial · rede',
    Campo: 'Educação do Campo',
    'Indígena': 'Educação Escolar Indígena',
  };
  const escopoLabel = ativo.escopo === 'rede' ? LABELS.rede
    : ativo.escopo === 'etapa' ? LABELS[ativo.etapa]
    : ativo.escopo === 'modalidade' ? LABELS[ativo.modalidade]
    : LABELS.especial;

  /* ---- API pública ---- */
  const iniciais = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  window.PERFIL = {
    id: ativo.id, nome: ativo.nome, cargo: ativo.cargo, grupo: ativo.grupo,
    escopo: ativo.escopo, etapa: ativo.etapa, modalidade: ativo.modalidade,
    emEscopo, emEscopoNome, escopoLabel, transversal: (ativo.escopo === 'rede' || ativo.escopo === 'especial'),
  };
  window.REDE = REDE;
  window.REDE_NOME = REDE_NOME;
  window.gerarEquipe = gerarEquipe;
  window.escolasEmEscopo = () => REDE.filter(emEscopo);
  window.inepsEmEscopo = () => new Set(REDE.filter(emEscopo).map(e => e.inep));

  /* ---- UI: seletor de perfil na topbar + persona ---- */
  function montar() {
    // persona
    const nm = document.querySelector('.user-name'); if (nm) nm.textContent = ativo.nome;
    const rl = document.querySelector('.user-role'); if (rl) rl.textContent = ativo.cargo;
    const av = document.querySelector('.avatar'); if (av) av.textContent = iniciais(ativo.nome);
    // atualiza rótulos de escopo marcados com .js-escopo
    document.querySelectorAll('.js-escopo').forEach(el => el.textContent = escopoLabel);
    // (seletor de perfil removido a pedido — o perfil ativo vem de localStorage/URL ?perfil=)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
