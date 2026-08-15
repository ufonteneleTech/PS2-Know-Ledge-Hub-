/* ============================================================
   js/script.js — Lógica geral e interatividade
   PS2 Know Ledge Hub®
   Depende de: data/jogos.js, data/modelos.js, js/busca.js, js/quiz.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     Utilidades gerais
  --------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function mostrarToast(msg, duracao = 2600) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(mostrarToast._t);
    mostrarToast._t = setTimeout(() => (toast.hidden = true), duracao);
  }

  /* ---------------------------------------------------------
     Tema claro/escuro — respeita preferência do sistema
  --------------------------------------------------------- */
  (function initTema() {
    const salvo = localStorage.getItem("ps2hub_tema");
    const prefereClaro = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const temaInicial = salvo || (prefereClaro ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", temaInicial);

    $("#temaToggle").addEventListener("click", () => {
      const atual = document.documentElement.getAttribute("data-theme");
      const novo = atual === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", novo);
      localStorage.setItem("ps2hub_tema", novo);
    });
  })();

  /* ---------------------------------------------------------
     Boot line — efeito de "console técnico" no hero
  --------------------------------------------------------- */
  (function initBootLine() {
    const el = $("#bootLine");
    if (!el) return;
    const texto = "Iniciando PS2 Know Ledge Hub® · carregando acervo…";
    let i = 0;
    const digitar = () => {
      el.textContent = texto.slice(0, i);
      i++;
      if (i <= texto.length) setTimeout(digitar, 28);
    };
    digitar();
  })();

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  (function initNavMobile() {
    const toggle = $("#navToggle");
    const nav = $("#navPrincipal");
    toggle.addEventListener("click", () => {
      const aberto = nav.classList.toggle("aberto");
      toggle.setAttribute("aria-expanded", String(aberto));
    });
    $$(".nav-link").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("aberto");
      toggle.setAttribute("aria-expanded", "false");
    }));
  })();

  /* ---------------------------------------------------------
     Navegação ativa via IntersectionObserver
  --------------------------------------------------------- */
  (function initNavAtiva() {
    const secoes = $$("main section[id]");
    const links = $$(".nav-link");
    if (!secoes.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.toggle("ativo", l.dataset.nav === id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });

    secoes.forEach(s => observer.observe(s));
  })();

  /* ---------------------------------------------------------
     Voltar ao topo
  --------------------------------------------------------- */
  (function initVoltarTopo() {
    const btn = $("#voltarTopo");
    window.addEventListener("scroll", () => {
      btn.hidden = window.scrollY < 500;
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  })();

  /* ---------------------------------------------------------
     Favoritos (localStorage) — usados apenas para preferências,
     nenhum dado sensível é armazenado.
  --------------------------------------------------------- */
  const Favoritos = (() => {
    const CHAVE = "ps2hub_favoritos";
    const carregar = () => JSON.parse(localStorage.getItem(CHAVE) || "[]");
    const salvar = (lista) => localStorage.setItem(CHAVE, JSON.stringify(lista));
    const alternar = (id) => {
      const lista = carregar();
      const idx = lista.indexOf(id);
      if (idx >= 0) lista.splice(idx, 1); else lista.push(id);
      salvar(lista);
      atualizarContador();
      return lista.includes(id);
    };
    const contem = (id) => carregar().includes(id);
    const atualizarContador = () => { $("#favCount").textContent = carregar().length; };
    return { carregar, alternar, contem, atualizarContador };
  })();
  Favoritos.atualizarContador();
  $("#favToggle").addEventListener("click", () => {
    const lista = Favoritos.carregar();
    if (!lista.length) { mostrarToast("Você ainda não tem favoritos. Toque no ♥ de um jogo."); return; }
    document.getElementById("jogosBusca").value = "";
    $$(".jogo-card").forEach(card => {
      card.style.display = lista.includes(card.dataset.id) ? "" : "none";
    });
    document.getElementById("jogos").scrollIntoView({ behavior: "smooth" });
    mostrarToast(`Mostrando ${lista.length} favorito(s).`);
  });

  /* ---------------------------------------------------------
     Lightbox
  --------------------------------------------------------- */
  const Lightbox = (() => {
    const el = $("#lightbox");
    const img = $("#lightboxImg");
    const legenda = $("#lightboxLegenda");
    const fonte = $("#lightboxFonte");

    function abrir({ src, alt, legendaTxt, fonteTxt }) {
      img.src = src || "";
      img.alt = alt || "";
      legenda.textContent = legendaTxt || "";
      fonte.textContent = fonteTxt ? `Fonte: ${fonteTxt}` : "";
      el.hidden = false;
      $("#lightboxFechar").focus();
      document.body.style.overflow = "hidden";
    }
    function fechar() {
      el.hidden = true;
      document.body.style.overflow = "";
    }
    $("#lightboxFechar").addEventListener("click", fechar);
    el.addEventListener("click", (e) => { if (e.target === el) fechar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !el.hidden) fechar(); });

    return { abrir, fechar };
  })();

  /* ---------------------------------------------------------
     Placeholder de imagem estilizado (blur-up simulado)
     — usado quando não há uma fotografia livre de direitos
     disponível para o item (ex.: artes de capa de jogos, que
     são protegidas por direitos autorais das publicadoras).
  --------------------------------------------------------- */
  function placeholderImg(texto) {
    return `<div class="img-placeholder">${texto}</div>`;
  }

  /** Renderiza uma imagem real com atributos de acessibilidade e carregamento tardio. */
  function imagemReal(img) {
    return `<img src="${img.src}" alt="${img.alt || ""}" loading="lazy" decoding="async">`;
  }

  /* ---------------------------------------------------------
     Renderização: cartões de jogos
  --------------------------------------------------------- */
  function renderJogos(lista, termoBusca = "") {
    const grid = $("#jogosGrid");
    const vazio = $("#jogosVazio");
    grid.innerHTML = "";

    if (!lista.length) {
      vazio.hidden = false;
      $("#jogosStatus").textContent = "0 jogos encontrados";
      return;
    }
    vazio.hidden = true;
    $("#jogosStatus").textContent = `${lista.length} jogo(s) encontrado(s)`;

    lista.forEach(j => {
      const card = document.createElement("article");
      card.className = "card jogo-card";
      card.dataset.id = j.id;

      const tituloDestacado = termoBusca ? PS2Busca.destacar(j.titulo, termoBusca) : j.titulo;
      const favAtivo = Favoritos.contem(j.id);

      card.innerHTML = `
        <button class="fav-btn ${favAtivo ? "ativo" : ""}" aria-label="Favoritar ${j.titulo}" aria-pressed="${favAtivo}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${favAtivo ? "currentColor" : "none"}"><path stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 21s-7.5-4.6-10-9.1C.5 8.3 2.4 5 5.9 5c2 0 3.4 1 6.1 3.6C14.7 6 16.1 5 18.1 5c3.5 0 5.4 3.3 3.9 6.9-2.5 4.5-10 9.1-10 9.1Z"/></svg>
        </button>
        <a class="capa" href="${j.capa.url}" target="_blank" rel="noopener noreferrer" aria-label="Ver capa oficial de ${j.titulo} na fonte original (abre em nova aba)">
          ${placeholderImg(j.titulo)}
          <span class="capa-link">Ver capa oficial ↗</span>
        </a>
        <h3>${tituloDestacado}</h3>
        <p class="meta">${j.ano} · ${j.desenvolvedora} · ${j.jogadores} jogador(es)</p>
        <div class="tags">${j.genero.map(g => `<span class="tag-pill">${g}</span>`).join("")}</div>
        <p class="fonte">Fonte: ${j.fontes.map(f => `<a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.texto}</a>`).join(", ")}</p>
      `;

      card.querySelector(".fav-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const ativo = Favoritos.alternar(j.id);
        e.currentTarget.classList.toggle("ativo", ativo);
        e.currentTarget.setAttribute("aria-pressed", String(ativo));
        e.currentTarget.querySelector("path").setAttribute("fill", ativo ? "currentColor" : "none");
      });

      grid.appendChild(card);
    });
  }

  function popularFiltros() {
    const generoSel = $("#filtroGenero");
    const anoSel = $("#filtroAno");
    const devSel = $("#filtroDev");

    const generos = [...new Set(PS2_JOGOS.flatMap(j => j.genero))].sort();
    const anos = [...new Set(PS2_JOGOS.map(j => j.ano))].sort((a, b) => a - b);
    const devs = [...new Set(PS2_JOGOS.map(j => j.desenvolvedora))].sort();

    generos.forEach(g => generoSel.insertAdjacentHTML("beforeend", `<option value="${g}">${g}</option>`));
    anos.forEach(a => anoSel.insertAdjacentHTML("beforeend", `<option value="${a}">${a}</option>`));
    devs.forEach(d => devSel.insertAdjacentHTML("beforeend", `<option value="${d}">${d}</option>`));
  }

  function aplicarFiltrosJogos() {
    const texto = $("#jogosBusca").value.trim();
    const genero = $("#filtroGenero").value;
    const ano = $("#filtroAno").value;
    const dev = $("#filtroDev").value;
    const resultado = PS2Busca.filtrarJogos(PS2_JOGOS, { texto, genero, ano, dev });
    renderJogos(resultado, texto);
  }

  (function initJogos() {
    popularFiltros();
    renderJogos(PS2_JOGOS);

    const buscaDebounced = PS2Busca.debounce(aplicarFiltrosJogos, 200);
    $("#jogosBusca").addEventListener("input", buscaDebounced);
    $("#filtroGenero").addEventListener("change", aplicarFiltrosJogos);
    $("#filtroAno").addEventListener("change", aplicarFiltrosJogos);
    $("#filtroDev").addEventListener("change", aplicarFiltrosJogos);
    $("#limparFiltros").addEventListener("click", () => {
      $("#jogosBusca").value = "";
      $("#filtroGenero").value = "";
      $("#filtroAno").value = "";
      $("#filtroDev").value = "";
      aplicarFiltrosJogos();
    });

    $("#statJogos").textContent = PS2_JOGOS.length;
    const fontesJogos = PS2_JOGOS.flatMap(j => j.fontes.map(f => f.url));
    const fontesModelos = PS2_MODELOS.flatMap(m => m.fontes.map(f => f.url));
    const totalFontes = new Set([...fontesJogos, ...fontesModelos]).size;
    $("#statFontes").textContent = totalFontes + "+";
  })();

  /* ---------------------------------------------------------
     Renderização: modelos
  --------------------------------------------------------- */
  function renderModelos() {
    const grid = $("#modelosGrid");
    grid.innerHTML = "";
    PS2_MODELOS.forEach(m => {
      const card = document.createElement("article");
      card.className = "card item-card";
      card.innerHTML = `
        <div class="imgwrap" tabindex="0" role="button" aria-label="Ampliar imagem de ${m.nome}">${imagemReal(m.imagem)}</div>
        <h3>${m.nome}</h3>
        <p class="meta" style="font-family:var(--font-mono);font-size:.76rem;color:var(--cor-acento-3);margin-bottom:6px;">${m.codigo} · ${m.ano}</p>
        <p>${m.diferencas}</p>
        <p class="fonte">Foto: <a href="${m.imagem.creditoUrl}" target="_blank" rel="noopener noreferrer">${m.imagem.credito}</a> · Fonte: ${m.fontes.map(f => `<a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.texto}</a>`).join(", ")}</p>
      `;
      card.querySelector(".imgwrap").addEventListener("click", () => {
        Lightbox.abrir({ src: m.imagem.src, alt: m.imagem.alt, legendaTxt: `${m.nome} (${m.codigo})`, fonteTxt: `${m.imagem.credito} — ${m.imagem.licenca}` });
      });
      grid.appendChild(card);
    });
    $("#statModelos").textContent = PS2_MODELOS.length;
  }
  renderModelos();

  /* ---------------------------------------------------------
     Hardware — cartões de especificações
  --------------------------------------------------------- */
  const HARDWARE_SPECS = [
    { titulo: "CPU", valor: "Emotion Engine · 294,912 MHz", desc: "Processador central customizado, com unidade vetorial dedicada a cálculos de geometria 3D." },
    { titulo: "GPU", valor: "Graphics Synthesizer", desc: "Chip gráfico dedicado, responsável pela renderização e efeitos visuais do console." },
    { titulo: "Memória principal", valor: "32 MB RDRAM", desc: "Memória de sistema de alta largura de banda para a época de lançamento." },
    { titulo: "Memória de vídeo", valor: "4 MB eDRAM", desc: "Memória embutida no chip gráfico, usada para acesso rápido a dados de renderização." },
    { titulo: "Mídia óptica", valor: "DVD-ROM / CD-ROM", desc: "Suporte à leitura de DVDs, ampliando a capacidade de armazenamento frente à geração anterior." },
    { titulo: "Áudio", valor: "SPU2 · 48 canais", desc: "Processador de som dedicado, com suporte a múltiplos canais simultâneos." },
    { titulo: "Armazenamento externo", valor: "Memory Card 8 MB", desc: "Cartão de memória proprietário utilizado para salvar progresso dos jogos." },
    { titulo: "Conectividade", valor: "PC Card / Ethernet (conforme modelo)", desc: "Expansão de rede disponível via adaptador dedicado ou porta embutida em revisões posteriores." }
  ];
  (function renderHardware() {
    const grid = $("#hardwareGrid");
    grid.innerHTML = HARDWARE_SPECS.map(h => `
      <div class="card">
        <h3>${h.titulo}</h3>
        <span class="valor">${h.valor}</span>
        <p>${h.desc}</p>
      </div>
    `).join("");
  })();

  /* ---------------------------------------------------------
     Timelines (história e cultural)
  --------------------------------------------------------- */
  const TIMELINE_HISTORIA = [
    { ano: "1999", titulo: "Anúncio oficial", texto: "A Sony revela publicamente o sucessor do PlayStation original, gerando grande expectativa no mercado." },
    { ano: "2000", titulo: "Lançamento no Japão", texto: "O console chega às lojas japonesas em março, seguido pelo lançamento norte-americano no mesmo ano." },
    { ano: "2000", titulo: "Chegada à Europa", texto: "O lançamento europeu completa a disponibilidade global do console em seu primeiro ano." },
    { ano: "2004", titulo: "Modelo Slim", texto: "A Sony lança uma revisão compacta e mais leve do console, reduzindo significativamente suas dimensões." },
    { ano: "2006", titulo: "Convivência com o PS3", texto: "Mesmo com o lançamento do sucessor, o PS2 continua recebendo lançamentos relevantes." },
    { ano: "2013", titulo: "Fim da produção", texto: "A Sony encerra oficialmente a fabricação do console, consolidando uma das gerações mais longas do mercado." }
  ];
  const TIMELINE_CULTURAL = [
    { ano: "2000-2001", titulo: "Campanhas publicitárias marcantes", texto: "O lançamento foi acompanhado de campanhas de marketing amplamente comentadas na imprensa especializada da época." },
    { ano: "2002-2004", titulo: "Consolidação como fenômeno de mercado", texto: "O console se torna referência cultural, citado com frequência em revistas e programas sobre entretenimento." },
    { ano: "2004-2006", titulo: "Onda de jogos de festa e ritmo", texto: "Títulos como jogos de dança ampliam o público do console para além do jogador tradicional." },
    { ano: "2013", titulo: "Legado reconhecido", texto: "Encerrada a produção, o console é frequentemente citado em retrospectivas como um marco da indústria." }
  ];
  function renderTimeline(elId, dados) {
    const el = $(elId);
    el.innerHTML = dados.map(t => `
      <div class="timeline-item" role="listitem">
        <span class="ano">${t.ano}</span>
        <h3>${t.titulo}</h3>
        <p>${t.texto}</p>
      </div>
    `).join("");
  }
  renderTimeline("#timeline", TIMELINE_HISTORIA);
  renderTimeline("#timelineCultural", TIMELINE_CULTURAL);

  /* ---------------------------------------------------------
     Acessórios
  --------------------------------------------------------- */
  const ACESSORIOS = [
    { nome: "DualShock 2", desc: "Controle padrão do console, com botões sensíveis à pressão e vibração dupla.",
      imagem: { src: "https://commons.wikimedia.org/wiki/Special:FilePath/PS2-DualShock2.jpg?width=520", alt: "Controle DualShock 2 do PlayStation 2", credito: "Foto: Evan-Amos (domínio público)", creditoUrl: "https://commons.wikimedia.org/wiki/File:PS2-DualShock2.jpg" } },
    { nome: "Memory Card 8MB", desc: "Cartão de memória proprietário para salvar progresso de jogos." },
    { nome: "Multitap", desc: "Adaptador que permite conectar múltiplos controles e memory cards simultaneamente." },
    { nome: "EyeToy", desc: "Câmera USB utilizada em jogos baseados em movimento e reconhecimento de imagem." },
    { nome: "Network Adaptor", desc: "Adaptador de rede usado para conexão à internet em jogos com suporte online." },
    { nome: "Adaptador de dança (tapete)", desc: "Periférico alternativo popularizado por jogos de ritmo." }
  ];
  (function renderAcessorios() {
    const grid = $("#acessoriosGrid");
    grid.innerHTML = ACESSORIOS.map(a => `
      <div class="card item-card">
        <div class="imgwrap">${a.imagem ? imagemReal(a.imagem) : placeholderImg(a.nome)}</div>
        <h3>${a.nome}</h3>
        <p>${a.desc}</p>
        ${a.imagem ? `<p class="fonte">Foto: <a href="${a.imagem.creditoUrl}" target="_blank" rel="noopener noreferrer">${a.imagem.credito}</a></p>` : ""}
      </div>
    `).join("");
  })();

  /* ---------------------------------------------------------
     Tecnologia — accordion
  --------------------------------------------------------- */
  const TECH_TOPICOS = [
    { titulo: "Arquitetura geral", texto: "O PS2 combina um processador central com unidades vetoriais dedicadas e um chip gráfico próprio, buscando alto desempenho em cálculos geométricos para a época de seu lançamento." },
    { titulo: "Emotion Engine", texto: "O processador central foi desenvolvido especificamente para o console, integrando unidades de processamento vetorial voltadas a transformações 3D em tempo real." },
    { titulo: "Graphics Synthesizer", texto: "Chip gráfico dedicado que trabalha em conjunto com o Emotion Engine, responsável por rasterização e efeitos visuais." },
    { titulo: "Leitor de DVD", texto: "A adoção do DVD como mídia principal permitiu jogos com maior volume de dados em comparação à geração baseada em CD." },
    { titulo: "Recursos online", texto: "Por meio do Network Adaptor, o console ofereceu suporte a jogos multiplayer online em títulos selecionados durante seu ciclo de vida." }
  ];
  (function renderTech() {
    const el = $("#techAccordion");
    el.innerHTML = TECH_TOPICOS.map((t, i) => `
      <details class="tech-item" ${i === 0 ? "open" : ""}>
        <summary>${t.titulo}</summary>
        <div class="tech-corpo"><p>${t.texto}</p></div>
      </details>
    `).join("");
  })();

  /* ---------------------------------------------------------
     Curiosidades — flip cards
  ---------------------------------------------------------- */
  const CURIOSIDADES = [
    { fato: "O PS2 é o console mais vendido da história até hoje.", fonte: "Registros de vendas amplamente divulgados pela Sony." },
    { fato: "O console podia reproduzir DVDs, ajudando a popularizar o formato em muitos lares.", fonte: "Cobertura de imprensa da época do lançamento." },
    { fato: "Sua produção durou mais de uma década, convivendo com duas gerações seguintes.", fonte: "Linha do tempo oficial de descontinuação." },
    { fato: "Alguns jogos de PS1 ganharam melhorias de compatibilidade rodando no PS2.", fonte: "Documentação técnica de retrocompatibilidade." },
    { fato: "O formato compacto 'Slim' pesava menos da metade do modelo original.", fonte: "Especificações comparativas SCPH." },
    { fato: "O console teve suporte oficial a discos rígidos internos em sua versão original.", fonte: "Manuais técnicos SCPH." }
  ];
  (function renderCuriosidades() {
    const grid = $("#curiosidadesGrid");
    grid.innerHTML = CURIOSIDADES.map((c, i) => `
      <div class="flip-card" tabindex="0" role="button" aria-label="Vire para ver a fonte da curiosidade ${i + 1}">
        <div class="flip-card-inner">
          <div class="flip-frente"><span>Você sabia?</span><p>${c.fato}</p></div>
          <div class="flip-verso"><p>Fonte: ${c.fonte}</p></div>
        </div>
      </div>
    `).join("");
    $$(".flip-card", grid).forEach(card => {
      const virar = () => card.classList.toggle("virado");
      card.addEventListener("click", virar);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); virar(); } });
    });
  })();

  /* Curiosidade do dia — sorteada de forma estável ao longo do dia */
  (function initCuriosidadeDia() {
    const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const escolhida = CURIOSIDADES[diaDoAno % CURIOSIDADES.length];
    $("#curiosidadeTexto").textContent = escolhida.fato;
    $("#curiosidadeFonte").textContent = "Fonte: " + escolhida.fonte;
  })();

  /* ---------------------------------------------------------
     Comparador
  --------------------------------------------------------- */
  (function initComparador() {
    const tabs = $$(".comparador-tabs .tab");
    const selA = $("#compA");
    const selB = $("#compB");
    const resultado = $("#comparadorResultado");
    let tipoAtual = "modelos";

    function popularSelects() {
      const dados = tipoAtual === "modelos" ? PS2_MODELOS : PS2_JOGOS;
      const rotulo = (item) => tipoAtual === "modelos" ? item.nome : item.titulo;
      selA.innerHTML = dados.map(d => `<option value="${d.id}">${rotulo(d)}</option>`).join("");
      selB.innerHTML = dados.map(d => `<option value="${d.id}">${rotulo(d)}</option>`).join("");
      if (dados[1]) selB.value = dados[1].id;
      renderComparacao();
    }

    function renderComparacao() {
      const dados = tipoAtual === "modelos" ? PS2_MODELOS : PS2_JOGOS;
      const a = dados.find(d => d.id === selA.value);
      const b = dados.find(d => d.id === selB.value);
      if (!a || !b) { resultado.innerHTML = ""; return; }

      let campos;
      if (tipoAtual === "modelos") {
        campos = [
          ["Código", "codigo"], ["Ano", "ano"], ["Formato", "formato"], ["Peso", "peso"]
        ];
      } else {
        campos = [
          ["Ano", "ano"], ["Gênero", (j) => j.genero.join(", ")],
          ["Desenvolvedora", "desenvolvedora"], ["Jogadores", "jogadores"]
        ];
      }

      const linhas = campos.map(([rotulo, campo]) => {
        const va = typeof campo === "function" ? campo(a) : a[campo];
        const vb = typeof campo === "function" ? campo(b) : b[campo];
        const diff = String(va) !== String(vb);
        return `<tr><td>${rotulo}</td><td class="${diff ? "diff" : ""}">${va}</td><td class="${diff ? "diff" : ""}">${vb}</td></tr>`;
      }).join("");

      resultado.innerHTML = `
        <table>
          <thead><tr><th>Campo</th><th>${tipoAtual === "modelos" ? a.nome : a.titulo}</th><th>${tipoAtual === "modelos" ? b.nome : b.titulo}</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      `;
    }

    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(t => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      tipoAtual = tab.dataset.tipo;
      popularSelects();
    }));
    selA.addEventListener("change", renderComparacao);
    selB.addEventListener("change", renderComparacao);

    popularSelects();
  })();

  /* ---------------------------------------------------------
     Busca global (header) com debounce e atalho de teclado "/"
  --------------------------------------------------------- */
  (function initBuscaGlobal() {
    const input = $("#buscaGlobal");
    const painel = $("#buscaResultados");

    function renderResultados(termo) {
      const resultados = PS2Busca.buscarGlobal(termo, { jogos: PS2_JOGOS, modelos: PS2_MODELOS });
      if (!resultados.length) {
        painel.innerHTML = `<div class="container"><p class="busca-vazio">Nenhum resultado para "${termo}". Tente outro termo.</p></div>`;
        painel.hidden = false;
        return;
      }
      painel.innerHTML = `<div class="container">${resultados.map(r => `
        <a class="busca-item" href="${r.ancora}" data-id="${r.id}">
          <span class="tag">${r.tipo}</span>
          <span>${PS2Busca.destacar(r.titulo, termo)} <small style="color:var(--cor-texto-mais-fraco)">— ${r.sub}</small></span>
        </a>
      `).join("")}</div>`;
      painel.hidden = false;
    }

    const debounced = PS2Busca.debounce((termo) => {
      if (termo.trim().length < 2) { painel.hidden = true; return; }
      renderResultados(termo);
    }, 200);

    input.addEventListener("input", (e) => debounced(e.target.value));
    document.addEventListener("click", (e) => {
      if (!painel.contains(e.target) && e.target !== input) painel.hidden = true;
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        input.focus();
      }
      if (e.key === "Escape") painel.hidden = true;
    });
  })();

  /* ---------------------------------------------------------
     Quiz
  --------------------------------------------------------- */
  (function initQuiz() {
    const inicioEl = $("#quizInicio");
    const jogoEl = $("#quizJogo");
    const fimEl = $("#quizFim");
    const chips = $$(".chip");
    let dificuldade = "facil";
    let sessao = [];
    let indice = 0;
    let pontos = 0;
    let acertos = 0;
    let sequencia = 0;
    let maiorSequencia = 0;

    $("#quizRecorde").textContent = PS2Quiz.recordeLocal();

    chips.forEach(chip => chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("ativo"));
      chip.classList.add("ativo");
      dificuldade = chip.dataset.dif;
    }));
    chips[0].classList.add("ativo");

    $("#quizIniciar").addEventListener("click", () => {
      sessao = PS2Quiz.montarSessao(dificuldade, 10);
      indice = 0; pontos = 0; acertos = 0; sequencia = 0; maiorSequencia = 0;
      inicioEl.hidden = true; fimEl.hidden = true; jogoEl.hidden = false;
      renderPergunta();
    });

    function renderPergunta() {
      const atual = sessao[indice];
      $("#quizProgresso").textContent = `Pergunta ${indice + 1} de ${sessao.length}`;
      $("#quizPontos").textContent = `Pontos: ${pontos}`;
      $("#quizPergunta").textContent = atual.pergunta;
      $("#quizExplicacao").hidden = true;
      $("#quizProxima").hidden = true;

      const altEl = $("#quizAlternativas");
      altEl.innerHTML = "";
      atual.alternativas.forEach((alt, i) => {
        const btn = document.createElement("button");
        btn.className = "alt-btn";
        btn.textContent = alt;
        btn.addEventListener("click", () => responder(i));
        altEl.appendChild(btn);
      });
    }

    function responder(escolhida) {
      const atual = sessao[indice];
      const botoes = $$(".alt-btn");
      botoes.forEach((b, i) => {
        b.disabled = true;
        if (i === atual.correta) b.classList.add("correta");
        else if (i === escolhida) b.classList.add("errada");
      });

      if (escolhida === atual.correta) {
        acertos++; sequencia++; maiorSequencia = Math.max(maiorSequencia, sequencia);
        pontos += dificuldade === "especialista" ? 15 : dificuldade === "medio" ? 10 : 5;
      } else {
        sequencia = 0;
      }

      $("#quizExplicacao").hidden = false;
      $("#quizExplicacao").textContent = atual.explicacao;
      $("#quizPontos").textContent = `Pontos: ${pontos}`;

      const proximaBtn = $("#quizProxima");
      proximaBtn.hidden = false;
      proximaBtn.textContent = indice + 1 < sessao.length ? "Próxima pergunta" : "Ver resultado";
      proximaBtn.onclick = avancar;
    }

    function avancar() {
      indice++;
      if (indice < sessao.length) { renderPergunta(); return; }
      finalizar();
    }

    function finalizar() {
      jogoEl.hidden = true;
      fimEl.hidden = false;
      const recorde = PS2Quiz.salvarRecordeSeMelhor(pontos);
      $("#quizRecorde").textContent = recorde;
      $("#quizResultadoTexto").textContent = `Você acertou ${acertos} de ${sessao.length} perguntas e somou ${pontos} pontos.`;

      const conquistas = PS2Quiz.calcularConquistas({ acertos, total: sessao.length, maiorSequencia, dificuldade });
      $("#quizConquistas").innerHTML = conquistas.length
        ? conquistas.map(c => `<span class="conquista">🏆 ${c}</span>`).join("")
        : `<span style="color:var(--cor-texto-mais-fraco);font-size:.85rem">Nenhuma conquista desta vez — tente novamente!</span>`;
    }

    $("#quizRefazer").addEventListener("click", () => {
      fimEl.hidden = true; inicioEl.hidden = false;
    });

    $("#quizCompartilhar").addEventListener("click", async () => {
      const texto = `Fiz ${acertos}/${sessao.length} acertos (${pontos} pontos) no quiz do PS2 Know Ledge Hub®!`;
      if (navigator.share) {
        try { await navigator.share({ text: texto, title: "PS2 Know Ledge Hub®" }); }
        catch (_) { /* usuário cancelou o compartilhamento */ }
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        mostrarToast("Resultado copiado para a área de transferência!");
      } else {
        mostrarToast(texto);
      }
    });
  })();

  /* ---------------------------------------------------------
     Formulário de contribuição — apenas validação client-side,
     nenhum dado é enviado a servidores neste protótipo estático.
  --------------------------------------------------------- */
  (function initFormContribuicao() {
    const form = $("#formContribuicao");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Sanitização básica: remove tags HTML da entrada de texto livre.
      const textoBruto = $("#ctbTexto").value;
      const textoLimpo = textoBruto.replace(/<[^>]*>/g, "").trim();
      if (!textoLimpo) return;

      $("#ctbStatus").textContent = "Sugestão registrada localmente. A moderação está prevista para a v4.0.";
      form.reset();
      mostrarToast("Obrigado pela contribuição!");
    });
  })();

});