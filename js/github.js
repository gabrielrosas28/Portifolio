/* ==========================================================
   MÓDULO: GITHUB
   Busca os repositórios públicos ao vivo e mistura com os
   textos do config. Se a API falhar, usa só o config.
   ========================================================== */
(function () {
  const CACHE_KEY = () => "gh-repos-v2-" + Portfolio.config.githubUser;
  const CACHE_MS = 30 * 60 * 1000;

  function lerCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY());
      if (!raw) return null;
      const { t, data } = JSON.parse(raw);
      return Date.now() - t < CACHE_MS ? data : null;
    } catch (e) { return null; }
  }

  function salvarCache(data) {
    try { sessionStorage.setItem(CACHE_KEY(), JSON.stringify({ t: Date.now(), data })); } catch (e) {}
  }

  function montar(repo, extra) {
    const cfg = Portfolio.config;
    return {
      repo: repo.name,
      url: repo.html_url || `https://github.com/${cfg.githubUser}/${repo.name}`,
      site: repo.homepage || "",
      titulo: extra.titulo || repo.name.replace(/[-_]/g, " "),
      categoria: extra.categoria || "outro",
      status: extra.status || "",
      resumo: extra.resumo || repo.description || "Projeto publicado no GitHub.",
      detalhes: extra.detalhes || [],
      stack: extra.stack || (repo.language ? [repo.language] : []),
      linguagem: repo.language || (extra.stack && extra.stack[0]) || "",
      estrelas: repo.stargazers_count || 0,
      atualizado: repo.pushed_at || repo.updated_at || "",
      destaque: !!extra.destaque
    };
  }

  function ordenar(lista) {
    return lista.sort((a, b) =>
      (b.destaque - a.destaque) ||
      (new Date(b.atualizado) - new Date(a.atualizado))
    );
  }

  async function carregar() {
    const cfg = Portfolio.config;
    let repos = lerCache();
    let aoVivo = true;

    if (!repos) {
      try {
        const r = await fetch(`https://api.github.com/users/${cfg.githubUser}/repos?sort=pushed&per_page=100`);
        if (!r.ok) throw new Error("GitHub respondeu " + r.status);
        repos = await r.json();
        salvarCache(repos);
      } catch (e) {
        aoVivo = false;
        repos = Object.keys(cfg.projetos).map(name => ({ name }));
      }
    }

    const lista = repos
      .filter(r => !r.fork && r.size !== 0)
      .map(r => montar(r, cfg.projetos[r.name] || {}));

    return { projetos: ordenar(lista), aoVivo };
  }

  Portfolio.github = { carregar };
})();
