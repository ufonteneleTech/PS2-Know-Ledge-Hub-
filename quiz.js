/* ============================================================
   js/quiz.js — Módulo do Quiz
   PS2 Know Ledge Hub®
   Isolado em módulo próprio: banco de perguntas, embaralhamento,
   controle de repetição por sessão, pontuação e conquistas.
   ============================================================ */

const PS2Quiz = (() => {

  const BANCO = {
    facil: [
      { p: "Qual empresa fabrica o PlayStation 2?", alt: ["Sony", "Microsoft", "Nintendo", "Sega"], correta: 0,
        exp: "O PS2 foi desenvolvido e fabricado pela Sony Computer Entertainment." },
      { p: "O PlayStation 2 é o sucessor de qual console?", alt: ["Nintendo 64", "PlayStation original", "Sega Saturn", "Dreamcast"], correta: 1,
        exp: "O PS2 é o sucessor direto do PlayStation original, mantendo retrocompatibilidade." },
      { p: "Qual mídia física o PS2 usa para a maioria dos jogos?", alt: ["Cartucho", "DVD", "Fita cassete", "Disquete"], correta: 1,
        exp: "O PS2 utiliza DVDs como mídia principal, o que permitiu jogos maiores que a geração anterior baseada em CD." },
      { p: "Qual é o apelido comum dado ao modelo compacto lançado em 2004?", alt: ["Fat", "Slim", "Mini", "Pro"], correta: 1,
        exp: "O modelo compacto lançado em 2004 ficou popularmente conhecido como PS2 'Slim'." },
      { p: "O PS2 é compatível com jogos de qual console anterior?", alt: ["PlayStation original", "Nintendo 64", "Sega Genesis", "Nenhum"], correta: 0,
        exp: "O PS2 mantém retrocompatibilidade com a biblioteca do PlayStation original." },
      { p: "Qual é o controle padrão do PlayStation 2?", alt: ["DualShock 2", "DualSense", "Joystick S", "DualShock 4"], correta: 0,
        exp: "O DualShock 2 é o controle padrão do console, com botões sensíveis à pressão." },
      { p: "Em que ano a produção do PS2 foi oficialmente encerrada?", alt: ["2009", "2011", "2013", "2015"], correta: 2,
        exp: "A Sony encerrou a fabricação do PS2 em 2013, após mais de uma década de produção." },
      { p: "Qual acessório é usado para salvar o progresso dos jogos no PS2?", alt: ["Memory Card", "Pen drive", "Cartão SD", "Disquete"], correta: 0,
        exp: "O Memory Card de 8MB é o acessório proprietário usado para salvar dados de jogos." },
      { p: "O PS2 é considerado, em unidades vendidas, o console...", alt: ["mais vendido da história", "menos vendido de sua geração", "exclusivo do Japão", "sucessor do PS3"], correta: 0,
        exp: "O PS2 é amplamente reconhecido como o console mais vendido da história até hoje." },
      { p: "Qual periférico transformou o PS2 em leitor de filmes em muitos lares?", alt: ["Leitor de DVD embutido", "Leitor de VHS", "Leitor de Blu-ray", "Leitor de fitas"], correta: 0,
        exp: "A capacidade de reproduzir DVDs ajudou a popularizar o formato em muitas casas." }
    ],
    medio: [
      { p: "Como se chama o processador central do PS2?", alt: ["Emotion Engine", "Cell Broadband", "Hollywood", "Xenon"], correta: 0,
        exp: "O 'Emotion Engine' é o processador central desenvolvido para o PS2." },
      { p: "Qual componente é responsável pelo processamento gráfico do PS2?", alt: ["Graphics Synthesizer", "RSX", "Flipper", "Reality Coprocessor"], correta: 0,
        exp: "O 'Graphics Synthesizer' é o chip gráfico dedicado do console." },
      { p: "Qual porta de expansão o modelo original ('Fat') possuía e foi removida no Slim?", alt: ["USB", "PC Card", "HDMI", "S-Video"], correta: 1,
        exp: "A porta PC Card, usada para expansões como o adaptador de rede, foi removida na versão Slim." },
      { p: "Em que ano o PS2 foi lançado no Japão?", alt: ["1998", "2000", "2003", "2005"], correta: 1,
        exp: "O PS2 foi lançado no Japão em março de 2000." },
      { p: "Qual jogo é conhecido por utilizar neblina para disfarçar limitações técnicas de distância de renderização?", alt: ["Gran Turismo 4", "Silent Hill 2", "God of War II", "Ico"], correta: 1,
        exp: "Silent Hill 2 é frequentemente citado por usar neblina como recurso técnico e atmosférico." },
      { p: "Qual estúdio desenvolveu Gran Turismo 4?", alt: ["Polyphony Digital", "Naughty Dog", "Team Ico", "Rockstar North"], correta: 0,
        exp: "Gran Turismo 4 foi desenvolvido pela Polyphony Digital, estúdio interno da Sony." },
      { p: "Qual jogo introduziu o sistema de progressão em grade conhecido como 'Sphere Grid'?", alt: ["Kingdom Hearts", "Final Fantasy X", "Ōkami", "Jak and Daxter"], correta: 1,
        exp: "Final Fantasy X introduziu o Sphere Grid como sistema de progressão de personagens." },
      { p: "Qual adaptador permitia ao PS2 se conectar à internet para jogos online?", alt: ["Network Adaptor", "Multitap", "EyeToy", "Memory Card"], correta: 0,
        exp: "O Network Adaptor foi o periférico oficial usado para conectividade online em títulos selecionados." },
      { p: "Quantos colossos o jogador enfrenta em Shadow of the Colossus?", alt: ["10", "12", "16", "20"], correta: 2,
        exp: "Shadow of the Colossus apresenta dezesseis colossos como principais desafios do jogo." },
      { p: "Qual mecânica central de Ōkami é usada para resolver enigmas e combate?", alt: ["Pincel Celestial", "Keyblade", "Sphere Grid", "Camuflagem ativa"], correta: 0,
        exp: "O 'Pincel Celestial' permite desenhar símbolos que ativam poderes e resolvem quebra-cabeças em Ōkami." }
    ],
    especialista: [
      { p: "Qual formato de disco rígido o PS2 'Fat' suportava oficialmente para expansão?", alt: ["SATA interno", "IDE via Network Adaptor", "SSD externo", "Não suportava HD"], correta: 1,
        exp: "O HD era conectado via encaixe na parte traseira, junto ao Network Adaptor, em interface IDE." },
      { p: "Qual estúdio desenvolveu tanto Ico quanto Shadow of the Colossus?", alt: ["Team Ico", "Naughty Dog", "Polyphony Digital", "Clover Studio"], correta: 0,
        exp: "Ambos os títulos foram desenvolvidos pela Team Ico, sob direção de Fumito Ueda." },
      { p: "Qual foi um dos últimos grandes exclusivos lançados para o PS2 já durante a era do PS3?", alt: ["God of War II", "Final Fantasy X", "Ico", "Kingdom Hearts"], correta: 0,
        exp: "God of War II (2007) é citado como um dos últimos grandes exclusivos técnicos do PS2." },
      { p: "Qual revisão de gabinete foi a última fabricada oficialmente do PS2 Slim?", alt: ["SCPH-70000", "SCPH-77000", "SCPH-90000", "SCPH-50000"], correta: 2,
        exp: "A SCPH-90000 é registrada como a última revisão oficial do modelo compacto." },
      { p: "Qual recurso de rede passou a vir embutido em revisões posteriores do PS2 Slim?", alt: ["Wi-Fi", "Bluetooth", "Ethernet", "Modem dial-up embutido"], correta: 2,
        exp: "Revisões posteriores do modelo Slim passaram a incluir porta Ethernet embutida." },
      { p: "Qual estúdio foi responsável pelo desenvolvimento de Jak and Daxter: The Precursor Legacy?", alt: ["Naughty Dog", "Insomniac Games", "Sucker Punch", "Team Ico"], correta: 0,
        exp: "A Naughty Dog desenvolveu Jak and Daxter, demonstrando um mundo contínuo sem telas de carregamento." },
      { p: "Qual foi o título norte-americano da versão de 2003 da série Dance Dance Revolution para PS2 catalogada neste acervo?", alt: ["DDRMAX2: Dance Dance Revolution", "Dance Dance Revolution Extreme", "Dancing Stage Fusion", "DDR Universe"], correta: 0,
        exp: "DDRMAX2: Dance Dance Revolution foi lançado na América do Norte em setembro de 2003." },
      { p: "Qual publicadora lançou Metal Gear Solid 3: Snake Eater?", alt: ["Konami", "Capcom", "Square Enix", "Rockstar Games"], correta: 0,
        exp: "Metal Gear Solid 3: Snake Eater foi desenvolvido e publicado pela Konami." },
      { p: "Em que cidade fictícia dividida em três regiões se passa Grand Theft Auto: San Andreas?", alt: ["Liberty City", "San Andreas (com três cidades interligadas)", "Vice City", "Los Santos isolada"], correta: 1,
        exp: "San Andreas conecta três cidades fictícias interligadas em um único estado, ampliando a fórmula de mundo aberto." },
      { p: "Qual memória de vídeo dedicada o Graphics Synthesizer do PS2 utiliza?", alt: ["4 MB eDRAM", "32 MB RDRAM", "8 MB VRAM", "16 MB GDDR"], correta: 0,
        exp: "O Graphics Synthesizer conta com 4 MB de eDRAM embutida para acesso rápido a dados de renderização." }
    ]
  };

  const CONQUISTAS = [
    { id: "sequencia5", nome: "Sequência de 5", teste: (s) => s.maiorSequencia >= 5 },
    { id: "categoria-dominada", nome: "Categoria dominada", teste: (s) => s.acertos === s.total && s.total > 0 },
    { id: "especialista", nome: "Nível especialista concluído", teste: (s) => s.dificuldade === "especialista" && s.acertos >= Math.ceil(s.total * .6) }
  ];

  function embaralhar(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Monta uma sessão de quiz: perguntas embaralhadas, sem repetição, com alternativas embaralhadas.
   *  A quantidade é sempre limitada ao tamanho do banco de perguntas da dificuldade escolhida,
   *  garantindo que nenhuma pergunta se repita dentro da mesma sessão. */
  function montarSessao(dificuldade, quantidade = 10) {
    const base = BANCO[dificuldade] || BANCO.facil;
    const fonte = embaralhar(base).slice(0, Math.min(quantidade, base.length));
    return fonte.map(original => {
      const indices = embaralhar(original.alt.map((_, idx) => idx));
      const alt = indices.map(idx => original.alt[idx]);
      const correta = indices.indexOf(original.correta);
      return { pergunta: original.p, alternativas: alt, correta, explicacao: original.exp };
    });
  }

  function calcularConquistas(estado) {
    return CONQUISTAS.filter(c => c.teste(estado)).map(c => c.nome);
  }

  function recordeLocal() {
    return Number(localStorage.getItem("ps2hub_quiz_recorde") || 0);
  }

  function salvarRecordeSeMelhor(pontos) {
    const atual = recordeLocal();
    if (pontos > atual) localStorage.setItem("ps2hub_quiz_recorde", String(pontos));
    return Math.max(atual, pontos);
  }

  return { montarSessao, calcularConquistas, recordeLocal, salvarRecordeSeMelhor, DIFICULDADES: Object.keys(BANCO) };
})();
