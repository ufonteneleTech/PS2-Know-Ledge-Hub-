/* ============================================================
   js/busca.js — Motor de pesquisa e filtros
   PS2 Know Ledge Hub®
   Isolado em módulo próprio: busca tolerante a erros de digitação
   (distância de Levenshtein), destaque de termos e debounce.
   ============================================================ */

const PS2Busca = (() => {

  /** Distância de Levenshtein simples, usada para tolerância a erros de digitação. */
  function distanciaLevenshtein(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const linha = new Array(n + 1);
    for (let j = 0; j <= n; j++) linha[j] = j;

    for (let i = 1; i <= m; i++) {
      let anterior = linha[0];
      linha[0] = i;
      for (let j = 1; j <= n; j++) {
        const temp = linha[j];
        const custo = a[i - 1] === b[j - 1] ? 0 : 1;
        linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + custo);
        anterior = temp;
      }
    }
    return linha[n];
  }

  function normalizar(str) {
    return (str || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  /** Verifica se um texto "casa" com um termo de busca, permitindo pequenos erros de digitação. */
  function combina(texto, termo) {
    const t = normalizar(texto);
    const q = normalizar(termo);
    if (!q) return true;
    if (t.includes(q)) return true;

    // tolerância a erros: compara contra janelas de palavras do texto
    const palavras = t.split(/\s+/);
    const tolerancia = q.length <= 4 ? 1 : Math.floor(q.length / 4) + 1;
    return palavras.some(p => distanciaLevenshtein(p, q) <= tolerancia);
  }

  /** Envolve as ocorrências do termo em <mark> para destaque visual. */
  function destacar(texto, termo) {
    if (!termo) return texto;
    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${termoEscapado})`, "ig");
    return texto.replace(re, "<mark>$1</mark>");
  }

  /** debounce genérico */
  function debounce(fn, espera = 220) {
    let temporizador;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => fn(...args), espera);
    };
  }

  /** Busca global entre jogos e modelos, retornando itens combinados com tipo e destaque. */
  function buscarGlobal(termo, { jogos = [], modelos = [] } = {}) {
    if (!termo || termo.trim().length < 2) return [];
    const resultados = [];

    jogos.forEach(j => {
      if (combina(j.titulo, termo) || j.genero.some(g => combina(g, termo)) || combina(j.desenvolvedora, termo)) {
        resultados.push({ tipo: "Jogo", id: j.id, titulo: j.titulo, sub: `${j.ano} · ${j.genero.join(", ")}`, ancora: "#jogos" });
      }
    });

    modelos.forEach(m => {
      if (combina(m.nome, termo) || combina(m.codigo, termo)) {
        resultados.push({ tipo: "Modelo", id: m.id, titulo: m.nome, sub: m.codigo, ancora: "#modelos" });
      }
    });

    return resultados.slice(0, 12);
  }

  /** Filtra a lista de jogos por texto + filtros combináveis (gênero, ano, desenvolvedora). */
  function filtrarJogos(jogos, { texto = "", genero = "", ano = "", dev = "" } = {}) {
    return jogos.filter(j => {
      const passaTexto = combina(j.titulo, texto);
      const passaGenero = !genero || j.genero.includes(genero);
      const passaAno = !ano || String(j.ano) === String(ano);
      const passaDev = !dev || j.desenvolvedora === dev;
      return passaTexto && passaGenero && passaAno && passaDev;
    });
  }

  return { combina, destacar, debounce, buscarGlobal, filtrarJogos, distanciaLevenshtein, normalizar };
})();
