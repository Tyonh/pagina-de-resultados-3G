/**
 * CONFIGURAÇÃO DOS LINKS DO GOOGLE SHEETS (CSV)
 */
const SHEET_URLS = {
  // Slide 2
  ranking:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=1600633914&single=true&output=csv",
  // Slide 3
  positivacao:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=577000856&single=true&output=csv",
  // Slide 5
  horario:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=1787962885&single=true&output=csv",
  // Slide 7
  metaSemanal:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=1475891190&single=true&output=csv",
  // Slide 9
  vencedoresSemana:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=825950443&single=true&output=csv",
  // Slide 10 (Gráfico)
  podioMes:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=1467795128&single=true&output=csv",
  // Slide 10 (Grid Fotos)
  campeoesSemanas:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3Ov8l0GVetC6ywdnbQnBljOecI21rjuMYrwcjWypC1V1NBUNAWmKIo4Pn698p4Q/pub?gid=1883964368&single=true&output=csv",
};

let slideIndex = 0;

/* ==========================================================================
   SISTEMA DE ESCALA DINÂMICA
   Calcula tamanhos proporcionais com base na quantidade de itens
   ========================================================================== */

/**
 * Interpola linearmente entre min e max com base na contagem de itens.
 * @param {number} count - Quantidade de itens
 * @param {number} minCount - Contagem mínima de referência
 * @param {number} maxCount - Contagem máxima de referência
 * @param {number} valAtMin - Valor quando count <= minCount
 * @param {number} valAtMax - Valor quando count >= maxCount
 * @returns {number}
 */
const lerp = (count, minCount, maxCount, valAtMin, valAtMax) => {
  if (count <= minCount) return valAtMin;
  if (count >= maxCount) return valAtMax;
  const t = (count - minCount) / (maxCount - minCount);
  return valAtMin + t * (valAtMax - valAtMin);
};

/**
 * Aplica variáveis CSS dinâmicas para o ranking horizontal (slides 2 e 10).
 * Escala: gap, altura da barra, tamanho da fonte, foto.
 */
const aplicarEscalaRanking = (count) => {
  const root = document.documentElement.style;
  root.setProperty("--item-count", count);
  root.setProperty("--ranking-gap", `${lerp(count, 3, 15, 30, 6)}px`);
  root.setProperty("--ranking-bar-height", `${lerp(count, 3, 15, 70, 35)}px`);
  root.setProperty("--ranking-font", `${lerp(count, 3, 15, 1.8, 0.9)}rem`);
  root.setProperty("--ranking-foto", `${lerp(count, 3, 15, 70, 35)}px`);
};

/**
 * Aplica variáveis CSS dinâmicas para tabelas (slides 5 e 7).
 * Escala: fonte e padding das células.
 */
const aplicarEscalaTabela = (count) => {
  const root = document.documentElement.style;
  root.setProperty("--table-font", `${lerp(count, 3, 20, 1.8, 0.85)}rem`);
  root.setProperty("--table-padding", `${lerp(count, 3, 20, 25, 8)}px`);
};

/**
 * Aplica variáveis CSS dinâmicas para o gráfico de positivação (slide 3).
 * Escala: largura da barra, gap entre colunas, fontes.
 */
const aplicarEscalaChart = (count) => {
  const root = document.documentElement.style;
  root.setProperty("--chart-bar-width", `${lerp(count, 3, 8, 100, 70)}px`);
  root.setProperty("--chart-gap", `${lerp(count, 3, 8, 100, 50)}px`);
  root.setProperty("--chart-label-font", `${lerp(count, 3, 8, 1.3, 1.0)}rem`);
  root.setProperty("--chart-value-font", `${lerp(count, 3, 8, 1.8, 1.3)}rem`);
  root.setProperty("--chart-meta-font", `${lerp(count, 3, 8, 1.1, 0.85)}rem`);
};

/**
 * Aplica variáveis CSS dinâmicas para o grid de campeões (slide 10).
 * Escala: tamanho do card, foto, gap.
 */
const aplicarEscalaCampeoes = (count) => {
  const root = document.documentElement.style;
  root.setProperty("--campeao-card-width", `${lerp(count, 2, 10, 240, 140)}px`);
  root.setProperty("--campeao-card-height", `${lerp(count, 2, 10, 180, 110)}px`);
  root.setProperty("--campeao-foto", `${lerp(count, 2, 10, 110, 55)}px`);
  root.setProperty("--campeoes-gap", `${lerp(count, 2, 10, 10, 5)}px`);
};

/* ==========================================================================
   LÓGICA DE NAVEGAÇÃO MANUAL (SETAS DO TECLADO)
   ========================================================================== */

const mudarSlide = (direcao) => {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  slides[slideIndex].classList.remove("active");

  if (direcao === "proximo") {
    slideIndex = (slideIndex + 1) % slides.length;
  } else {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  }

  slides[slideIndex].classList.add("active");

  const id = slides[slideIndex].id;
  if (id === "slide-ranking") carregarRanking();
  if (id === "slide-positivacao") carregarPositivacao();
  if (id === "slide-horario") carregarHorario();
  if (id === "slide-meta-semanal") carregarMetaSemanal();
  if (id === "slide-vencedor") carregarVencedor();
  if (id === "slide-podio-mes") carregarDadosPodioMes();

  atualizarData();
};

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") mudarSlide("proximo");
  if (e.key === "ArrowLeft") mudarSlide("anterior");
});

/* ==========================================================================
   LOADERS E PROCESSADORES DE DADOS
   ========================================================================== */

// SLIDE 2: Ranking Horizontal
const carregarRanking = async () => {
  try {
    const res = await fetch(SHEET_URLS.ranking);
    const text = await res.text();

    const dados = text
      .trim()
      .split("\n")
      .slice(1)
      .map((l) => {
        const c = l.split(",");
        const valorLimpo = c[1].replace("%", "").replace(",", ".").trim();
        return { nome: c[0].trim(), perc: parseFloat(valorLimpo) };
      })
      .sort((a, b) => b.perc - a.perc);

    // Aplica escala dinâmica com base na quantidade de vendedores
    aplicarEscalaRanking(dados.length);

    const list = document.getElementById("ranking-list");
    list.innerHTML = dados
      .map(
        (v) => `
            <div class="ranking-item">
                <img src="public/${v.nome}.png" class="foto-vendedor" onerror="this.src='https://via.placeholder.com/70'">
                <div class="termometro-bg">
                    <div class="termometro-fill" style="width:0%" data-target="${Math.min(v.perc, 100)}"></div>
                    <div class="info-vendedor-interna">
                        <span>${v.nome}</span>
                        <span>${v.perc}%</span> </div>
                </div>
            </div>`,
      )
      .join("");

    // Animação das barras
    setTimeout(
      () =>
        document
          .querySelectorAll("#ranking-list .termometro-fill")
          .forEach((b) => (b.style.width = b.dataset.target + "%")),
      100,
    );
  } catch (e) {
    console.error("Erro Ranking:", e);
  }
};

// SLIDE 3: Positivação (Gráfico Vertical)
const carregarPositivacao = async () => {
  try {
    const res = await fetch(SHEET_URLS.positivacao);
    const text = await res.text();
    const dados = text
      .trim()
      .split("\n")
      .slice(1)
      .map((l) => {
        const c = l.split(",");
        return {
          nome: c[0].trim(),
          meta: parseInt(c[1]),
          venda: parseInt(c[2]),
        };
      });

    // Aplica escala dinâmica com base na quantidade de vendedores
    aplicarEscalaChart(dados.length);

    const max = Math.max(...dados.map((d) => d.meta));

    const chart = document.getElementById("positivacao-chart");
    chart.innerHTML = dados
      .map(
        (v) => `
            <div class="bar-wrapper">
                <div class="meta-label">META ${v.meta}</div>
                <div class="bar-goal" style="height:${(v.meta / max) * 85}%">
                    <div class="bar-fill-vertical" style="height:0%" data-target="${Math.min((v.venda / v.meta) * 100, 100)}">
                        <div class="floating-value">${v.venda}</div>
                    </div>
                </div>
                <div class="bar-label-name">${v.nome}</div>
            </div>`,
      )
      .join("");

    setTimeout(
      () =>
        document
          .querySelectorAll(".bar-fill-vertical")
          .forEach((b) => (b.style.height = b.dataset.target + "%")),
      100,
    );
  } catch (e) {
    console.error("Erro Positivação:", e);
  }
};

// SLIDE 5: Horário (Tabela com Ícones)
const carregarHorario = async () => {
  try {
    const res = await fetch(SHEET_URLS.horario);
    const text = await res.text();

    const linhas = text.trim().split("\n").slice(1);

    // Aplica escala dinâmica com base na quantidade de linhas
    aplicarEscalaTabela(linhas.length);

    const icon = (s) => {
      if (!s) return "";
      const v = s.toLowerCase().trim();
      if (["ok", "v", "sim", "✔", "☑"].some((x) => v.includes(x)))
        return '<span class="icon-check">✔</span>';
      if (["x", "falta"].some((x) => v.includes(x)))
        return '<span class="icon-x">✖</span>';
      if (["s2", "♡", "❤"].some((x) => v.includes(x)))
        return '<span class="icon-heart">❤</span>';
      return s;
    };

    const tbody = document.querySelector("#tabela-horario-content tbody");
    tbody.innerHTML = linhas
      .map((l) => {
        const c = l.split(",");
        return `<tr>
                <td>${c[0]}</td>
                <td>${icon(c[1])}</td>
                <td>${icon(c[2])}</td>
                <td>${icon(c[3])}</td>
                <td>${icon(c[4])}</td>
                <td>${icon(c[5])}</td>
            </tr>`;
      })
      .join("");
  } catch (e) {
    console.error("Erro Horário:", e);
  }
};

// SLIDE 7: Meta Semanal
const carregarMetaSemanal = async () => {
  try {
    const res = await fetch(SHEET_URLS.metaSemanal);
    const text = await res.text();

    const linhas = text.trim().split("\n").slice(1);

    // Aplica escala dinâmica com base na quantidade de linhas
    aplicarEscalaTabela(linhas.length);

    const fmt = (v) => {
      if (!v) return '<span class="status-neutro">0</span>';
      return v.toUpperCase().includes("BATEU")
        ? '<span class="status-bateu">BATEU</span>'
        : '<span class="status-neutro">0</span>';
    };

    const tbody = document.querySelector("#tabela-meta-semanal tbody");
    tbody.innerHTML = linhas
      .map((l) => {
        const c = l.split(",");
        return `<tr>
                <td>${c[0]}</td>
                <td>${fmt(c[1])}</td>
                <td>${fmt(c[2])}</td>
                <td>${fmt(c[3])}</td>
                <td>${fmt(c[4])}</td>
                <td>${fmt(c[5])}</td>
            </tr>`;
      })
      .join("");
  } catch (e) {
    console.error("Erro Meta Semanal:", e);
  }
};

// SLIDE 9: Vencedor da Semana (Foto Grande)
const carregarVencedor = async () => {
  try {
    const res = await fetch(SHEET_URLS.vencedoresSemana);
    const text = await res.text();
    const nome = text.trim().split("\n")[0].split(",")[1].trim();

    const meses = [
      "JANEIRO",
      "FEVEREIRO",
      "MARÇO",
      "ABRIL",
      "MAIO",
      "JUNHO",
      "JULHO",
      "AGOSTO",
      "SETEMBRO",
      "OUTUBRO",
      "NOVEMBRO",
      "DEZEMBRO",
    ];
    const d = new Date();
    const mes = meses[d.getMonth()];
    const sem = Math.ceil(d.getDate() / 7);

    document.getElementById("vencedor-content").innerHTML = `
            <img src="public/${nome}.png" class="foto-vencedor-destaque" onerror="this.src='https://via.placeholder.com/350'">
            <div class="vencedor-info">
                <h1>VENCEDOR</h1>
                <h2>${nome}</h2>
                <div class="vencedor-badge">${mes} | SEMANA ${sem}</div>
            </div>`;
  } catch (e) {
    console.error("Erro Vencedor:", e);
  }
};

// SLIDE 10: Pódio Mensal (Gráfico) + Campeões (Grid)
const carregarDadosPodioMes = async () => {
  try {
    const [resPontos, resCampeoes] = await Promise.all([
      fetch(SHEET_URLS.podioMes),
      fetch(SHEET_URLS.campeoesSemanas),
    ]);

    // Processa Pontos (Lado Esquerdo)
    const csvPontos = await resPontos.text();
    const pontos = csvPontos
      .trim()
      .split("\n")
      .slice(1)
      .map((l) => {
        const c = l.split(",");
        return { nome: c[0].trim(), pts: parseInt(c[1]) };
      })
      .sort((a, b) => b.pts - a.pts);

    // Processa Campeões (Lado Direito)
    const csvCampeoes = await resCampeoes.text();
    const campeoes = csvCampeoes
      .trim()
      .split("\n")
      .slice(1)
      .map((l) => {
        const c = l.split(",");
        return { sem: c[0].trim(), nome: c[1].trim(), pontos: parseInt(c[2]) };
      });

    // Aplica escala dinâmica para ambos os lados
    aplicarEscalaRanking(pontos.length);
    aplicarEscalaCampeoes(campeoes.length);

    // 1. Renderiza Gráfico Horizontal (Esquerda)
    const max = Math.max(...pontos.map((d) => d.pts));
    document.getElementById("podio-mes-chart").innerHTML = pontos
      .map(
        (v) => `
            <div class="ranking-item">
                <div class="termometro-bg" style="height: 45px;">
                    <div class="termometro-fill" style="width:0%" data-target="${(v.pts / max) * 100}"></div>
                    <div class="info-vendedor-interna" style="font-size: 1.1rem;">
                        <span>${v.nome}</span>
                        <span>${v.pts} pts</span>
                    </div>
                </div>
            </div>`,
      )
      .join("");

    // 2. Renderiza Grid de Campeões (Direita) - Pega apenas os 5 primeiros
    document.getElementById("campeoes-list").innerHTML = campeoes
      .slice(0, 5)
      .map(
        (c) => `
            <div class="card-campeao-grid">
                <img src="public/${c.nome}.png" class="foto-grid" onerror="this.src='https://via.placeholder.com/120'">
                <span class="label-sem-grid">${c.sem}</span>
                <span class="nome-sem-grid">${c.nome}</span>
                <span class="nome-sem-grid">Pontos ${c.pontos}</span>
            </div>`,
      )
      .join("");

    // Animação das barras
    setTimeout(
      () =>
        document
          .querySelectorAll("#podio-mes-chart .termometro-fill")
          .forEach((b) => (b.style.width = b.dataset.target + "%")),
      100,
    );
  } catch (e) {
    console.error("Erro Slide 10:", e);
  }
};

/* ==========================================================================
   UTILITÁRIOS E INICIALIZAÇÃO
   ========================================================================== */

const atualizarData = () => {
  const meses = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];
  const d = new Date();

  // Atualiza todos os elementos com a classe .mes-atual
  document
    .querySelectorAll(".mes-atual")
    .forEach((el) => (el.innerText = meses[d.getMonth()]));

  // Atualiza semana se existir
  if (document.getElementById("semana-atual")) {
    document.getElementById("semana-atual").innerText =
      `SEMANA ${Math.ceil(d.getDate() / 7)}`;
  }
};

/* ==========================================================================
   AUTO-REFRESH — Recarrega os dados do slide ativo a cada N segundos
   ========================================================================== */

const INTERVALO_REFRESH_MS = 30_000; // 30 segundos

/**
 * Recarrega os dados do slide que está visível no momento.
 * Chamada periodicamente pelo setInterval.
 */
const recarregarSlideAtivo = () => {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  const id = slides[slideIndex].id;

  const loaders = {
    "slide-ranking": carregarRanking,
    "slide-positivacao": carregarPositivacao,
    "slide-horario": carregarHorario,
    "slide-meta-semanal": carregarMetaSemanal,
    "slide-vencedor": carregarVencedor,
    "slide-podio-mes": carregarDadosPodioMes,
  };

  if (loaders[id]) {
    loaders[id]();
    console.log(`[Auto-Refresh] Dados recarregados: ${id}`);
  }

  atualizarData();
};

// Inicia o script quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarData();

  // Inicia o polling automático
  setInterval(recarregarSlideAtivo, INTERVALO_REFRESH_MS);
});
