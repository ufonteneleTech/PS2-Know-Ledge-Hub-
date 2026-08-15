# PS2 Know Ledge Hub®

Enciclopédia interativa e **não oficial** sobre o PlayStation 2 — história, hardware, modelos, jogos, acessórios, tecnologia e curiosidades, sempre com a fonte da informação indicada.

Projeto estático em **HTML + CSS + JavaScript puro**, sem frameworks ou build step. Basta abrir `index.html` em um navegador ou hospedar em qualquer serviço de hospedagem estática.

## Estrutura de arquivos

```
index.html              Página principal (todas as seções)
css/style.css            Identidade visual, layout e responsividade
css/temas.css             Variáveis de tema claro/escuro isoladas
js/script.js              Lógica geral: navegação, tema, favoritos, renderização
js/busca.js                Motor de pesquisa e filtros (tolerante a erros de digitação)
js/quiz.js                 Lógica do quiz: perguntas, pontuação, conquistas
data/jogos.js               Banco de dados dos jogos (schema documentado)
data/modelos.js              Banco de dados dos modelos de console (SCPH)
assets/icons/favicon.svg     Ícone do site
FONTES.md                  Registro central das fontes usadas no projeto
```

## Como rodar localmente

Qualquer servidor estático simples funciona, por exemplo:

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Como publicar

O projeto é compatível com hospedagem estática (GitHub Pages, Netlify, Vercel). Basta apontar o serviço para a raiz do repositório — não há etapa de build.

## Convenções de dado

Cada jogo em `data/jogos.js` segue um schema fixo: `id`, `titulo`, `ano`, `genero[]`, `desenvolvedora`, `publicadora`, `jogadores`, `descricao`, `plataformas[]`, `curiosidades[]`, `recepcao`, `acessibilidade[]`, `capa` e `fontes[]`.
Cada modelo em `data/modelos.js` segue: `id`, `codigo`, `nome`, `ano`, `formato`, `peso`, `destaques[]`, `diferencas`, `imagem` e `fontes[]`.

Para adicionar um novo jogo ou modelo, edite apenas o arquivo de dados correspondente — a interface se atualiza automaticamente.

## Regra de fontes

Nenhuma informação relevante aparece sem indicação de origem. Consulte `FONTES.md` para a lista completa de referências utilizadas.

## Imagens e direitos autorais

Fotografias de hardware (consoles e controle) usadas no site são de domínio público, de autoria de Evan-Amos, hospedadas no Wikimedia Commons — sempre exibidas com crédito e link para a fonte. Artes de capa de jogos **não são reproduzidas**, por serem protegidas por direitos autorais das publicadoras; cada cartão de jogo linka para a capa oficial na fonte indicada. Ver `FONTES.md` para o registro completo.

## Roadmap

Consulte o documento de concepção original do projeto para o roadmap completo (v1.0 até v4.0 e visão futura de PWA/offline).

## Marcas registradas

PlayStation, PS2 e DualShock são marcas registradas da Sony Interactive Entertainment. Este é um projeto de fã, independente e sem vínculo com a Sony.
