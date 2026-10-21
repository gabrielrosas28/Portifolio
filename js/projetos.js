/* ==========================================================
   MÓDULO: PROJETOS
   Renderiza os cards, os filtros e o painel de detalhes.
   ========================================================== */
(function () {
  let todos = [];
  let filtroAtual = "todos";

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function dataCurta(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(".", "");
  }

  function card(p, i) {
    return `
      <article class="proj ${p.destaque ? "proj--destaque" : ""}" data-cat="${p.categoria}" style="--i:${i}">
        <button class="proj__abrir" data-repo="${esc(p.repo)}" aria-label="Ver detalhes de ${esc(p.titulo)}">
          <div class="proj__topo">
            <span class="proj__cat">${esc(Portfolio.config.categorias[p.categoria] || "Projeto")}</span>
            ${p.estrelas ? `<span class="proj__stars" title="Estrelas no GitHub">★ ${p.estrelas}</span>` : ""}
          </div>
          <h3 class="proj__titulo">${esc(p.titulo)}</h3>
          <p class="proj__resumo">${esc(p.resumo)}</p>
          <ul class="proj__stack">${p.stack.slice(0, 4).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
          <div class="proj__rodape">
            <span>${esc(p.status || "Atualizado em " + dataCurta(p.atualizado))}</span>
            <span class="proj__seta" aria-hidden="true">→</span>
          </div>
        </button>
      </article>`;
  }

  function renderFiltros(el) {
    const cats = [...new Set(todos.map(p => p.categoria))];
    const nomes = Portfolio.config.categorias;
    el.innerHTML = [`<button class="chip is-on" data-f="todos" aria-pressed="true">Todos <b>${todos.length}</b></button>`]
      .concat(cats.map(c => {
        const n = todos.filter(p => p.categoria === c).length;
        return `<button class="chip" data-f="${c}" aria-pressed="false">${esc(nomes[c] || c)} <b>${n}</b></button>`;
      })).join("");

    el.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      filtroAtual = b.dataset.f;
      el.querySelectorAll(".chip").forEach(c => {
        const on = c === b;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on);
      });
      renderGrade();
    });
  }

  function renderGrade() {
    const grade = document.getElementById("proj-grade");
    const lista = filtroAtual === "todos" ? todos : todos.filter(p => p.categoria === filtroAtual);
    grade.innerHTML = lista.map(card).join("");
  }

  function abrir(repo) {
    const p = todos.find(x => x.repo === repo);
    if (!p) return;
    const dlg = document.getElementById("proj-dialog");
    dlg.querySelector(".dlg__corpo").innerHTML = `
      <span class="proj__cat">${esc(Portfolio.config.categorias[p.categoria] || "Projeto")}</span>
      <h3 class="dlg__titulo">${esc(p.titulo)}</h3>
      ${p.status ? `<p class="dlg__status">${esc(p.status)}</p>` : ""}
      <p class="dlg__resumo">${esc(p.resumo)}</p>
      ${p.detalhes.length ? `<ul class="dlg__lista">${p.detalhes.map(d => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <ul class="proj__stack">${p.stack.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="dlg__acoes">
        <a class="btn btn--sec" href="${esc(p.url)}" target="_blank" rel="noopener">Ver código no GitHub</a>
        ${p.site ? `<a class="btn btn--sec" href="${esc(p.site)}" target="_blank" rel="noopener">Abrir site</a>` : ""}
        <a class="btn" href="#orcamento" data-fechar>Quero algo assim</a>
      </div>`;
    dlg.showModal();
  }

  async function iniciar() {
    const grade = document.getElementById("proj-grade");
    const aviso = document.getElementById("proj-fonte");
    const { projetos, aoVivo } = await Portfolio.github.carregar();
    todos = projetos;

    aviso.textContent = aoVivo
      ? `Lido agora do GitHub @${Portfolio.config.githubUser}`
      : "GitHub fora do ar no momento. Mostrando a lista salva.";
    aviso.classList.toggle("is-live", aoVivo);

    renderFiltros(document.getElementById("proj-filtros"));
    renderGrade();

    grade.addEventListener("click", e => {
      const b = e.target.closest(".proj__abrir");
      if (b) abrir(b.dataset.repo);
    });

    const dlg = document.getElementById("proj-dialog");
    dlg.addEventListener("click", e => {
      if (e.target === dlg || e.target.closest("[data-fechar]")) dlg.close();
    });
  }

  Portfolio.projetos = { iniciar };
})();
