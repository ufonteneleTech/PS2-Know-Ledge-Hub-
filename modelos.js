/* ============================================================
   data/modelos.js — Modelos (revisões SCPH) do PlayStation 2
   PS2 Know Ledge Hub®
   Cada registro segue um schema fixo:
   id, codigo, nome, ano, formato, peso, destaques[], diferencas,
   imagem{src, alt, credito, creditoUrl, licenca}, fontes[]

   As fotografias usadas abaixo são de autoria de Evan-Amos, doadas
   para o domínio público e hospedadas no Wikimedia Commons — por
   isso podem ser reutilizadas livremente, com crédito.
   ============================================================ */

const PS2_MODELOS = [
  {
    id: "scph-10000",
    codigo: "SCPH-10000 / 15000",
    nome: "PS2 Original ('Fat')",
    ano: 2000,
    formato: "Gabinete grande, disco rígido opcional via encaixe traseiro",
    peso: "≈ 2,1 kg",
    destaques: ["Modelo de lançamento", "Porta PC Card para expansão", "Leitor óptico inicial com variações de compatibilidade"],
    diferencas: "Primeira revisão comercializada; versões subsequentes ajustaram a lente óptica e a fonte interna.",
    imagem: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/PS2-Fat-Console-Set.jpg?width=640",
      alt: "PlayStation 2 modelo 'Fat' com controle DualShock 2",
      credito: "Foto: Evan-Amos (domínio público)",
      creditoUrl: "https://commons.wikimedia.org/wiki/File:PS2-Fat-Console-Set.jpg",
      licenca: "Domínio público"
    },
    fontes: [{ texto: "Wikipedia — PlayStation 2", url: "https://pt.wikipedia.org/wiki/PlayStation_2" }]
  },
  {
    id: "scph-30000",
    codigo: "SCPH-30000 / 39000",
    nome: "PS2 'Fat' (revisão intermediária)",
    ano: 2001,
    formato: "Gabinete grande, mesma pegada da versão de lançamento",
    peso: "≈ 2,1 kg",
    destaques: ["Suporte oficial ampliado ao HD interno", "Ajustes internos de fonte e refrigeração"],
    diferencas: "Mantém o design externo, com pequenas revisões de placa-mãe e componentes internos.",
    imagem: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Sony-PlayStation-2-30001-Console-FL.jpg?width=640",
      alt: "PlayStation 2 SCPH-30001, vista frontal",
      credito: "Foto: Evan-Amos (domínio público)",
      creditoUrl: "https://commons.wikimedia.org/wiki/File:Sony-PlayStation-2-30001-Console-FL.jpg",
      licenca: "Domínio público"
    },
    fontes: [{ texto: "Wikipedia — PlayStation 2", url: "https://pt.wikipedia.org/wiki/PlayStation_2" }]
  },
  {
    id: "scph-50000",
    codigo: "SCPH-50000 / 55000",
    nome: "PS2 'Fat' (última geração grande)",
    ano: 2003,
    formato: "Gabinete grande",
    peso: "≈ 2,1 kg",
    destaques: ["Última leva antes da transição para o modelo Slim", "Refinamentos de estabilidade do leitor óptico"],
    diferencas: "Última revisão do gabinete grande antes do lançamento da versão compacta em 2004.",
    imagem: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/PS2-Fat-Console-Set.jpg?width=640",
      alt: "PlayStation 2 modelo 'Fat', geração final do gabinete grande",
      credito: "Foto: Evan-Amos (domínio público)",
      creditoUrl: "https://commons.wikimedia.org/wiki/File:PS2-Fat-Console-Set.jpg",
      licenca: "Domínio público"
    },
    fontes: [{ texto: "Wikipedia — PlayStation 2", url: "https://pt.wikipedia.org/wiki/PlayStation_2" }]
  },
  {
    id: "scph-70000",
    codigo: "SCPH-70000 / 77000 / 79000",
    nome: "PS2 Slim",
    ano: 2004,
    formato: "Gabinete compacto, sem baía para HD interno tradicional",
    peso: "≈ 0,9 kg",
    destaques: ["Redução drástica de tamanho e peso", "Fonte de alimentação externa", "Porta Ethernet embutida em revisões posteriores"],
    diferencas: "Reprojetado internamente; perdeu a porta PC Card e o suporte ao HDD interno clássico, mantendo retrocompatibilidade com PS1.",
    imagem: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/PS2-Slim-Console-Set.jpg?width=640",
      alt: "PlayStation 2 Slim com controle DualShock 2",
      credito: "Foto: Evan-Amos (domínio público)",
      creditoUrl: "https://commons.wikimedia.org/wiki/File:PS2-Slim-Console-Set.jpg",
      licenca: "Domínio público"
    },
    fontes: [{ texto: "Wikipedia — PlayStation 2", url: "https://pt.wikipedia.org/wiki/PlayStation_2" }]
  },
  {
    id: "scph-90000",
    codigo: "SCPH-90000",
    nome: "PS2 Slim (última revisão)",
    ano: 2007,
    formato: "Gabinete compacto",
    peso: "≈ 0,9 kg",
    destaques: ["Última revisão oficial fabricada", "Ajustes finais de consumo de energia"],
    diferencas: "Revisão final antes do encerramento gradual da produção global do console.",
    imagem: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/PS2-Slim-Console-Set.jpg?width=640",
      alt: "PlayStation 2 Slim, última revisão de gabinete",
      credito: "Foto: Evan-Amos (domínio público)",
      creditoUrl: "https://commons.wikimedia.org/wiki/File:PS2-Slim-Console-Set.jpg",
      licenca: "Domínio público"
    },
    fontes: [{ texto: "Wikipedia — PlayStation 2", url: "https://pt.wikipedia.org/wiki/PlayStation_2" }]
  }
];

if (typeof module !== "undefined" && module.exports) module.exports = PS2_MODELOS;
