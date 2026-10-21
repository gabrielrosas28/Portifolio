(function () {
  const TIPOS = {
    landing:      { nome: "Página única",       prazo: [1, 2], paginas: false },
    institucional:{ nome: "Site institucional", prazo: [2, 3], paginas: true },
    catalogo:     { nome: "Catálogo / loja",    prazo: [3, 5], paginas: true },
    sistema:      { nome: "Sistema sob medida", prazo: [4, 8], paginas: true }
  };

  const RECURSOS = {
    whatsapp: { nome: "Botão de WhatsApp",        semanas: 0 },
    form:     { nome: "Formulário de contato",    semanas: 0 },
    mapa:     { nome: "Mapa e endereço",          semanas: 0 },
    agenda:   { nome: "Agendamento online",       semanas: 1 },
    pix:      { nome: "Pagamento por Pix",        semanas: 1 },
    login:    { nome: "Área do cliente com login",semanas: 1 },
    painel:   { nome: "Painel para editar textos",semanas: 1 }
  };

  const PAGINAS = ["Início", "Sobre", "Serviços", "Galeria", "Blog", "Contato"];

  const estado = {
    negocio: "",
    tipo: "institucional",
    paginas: new Set(["Início", "Sobre", "Serviços", "Contato"]),
    recursos: new Set(["whatsapp", "form"])
  };

  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function montarControles() {
    $("#ob-tipos").innerHTML = Object.entries(TIPOS).map(([k, t]) => `
      <label class="opt">
        <input type="radio" name="tipo" value="${k}" ${k === estado.tipo ? "checked" : ""}>
        <span>${t.nome}</span>
      </label>`).join("");

    $("#ob-paginas").innerHTML = PAGINAS.map(p => `
      <label class="opt opt--mini">
        <input type="checkbox" name="pagina" value="${p}" ${estado.paginas.has(p) ? "checked" : ""}>
        <span>${p}</span>
      </label>`).join("");

    $("#ob-recursos").innerHTML = Object.entries(RECURSOS).map(([k, r]) => `
      <label class="opt opt--mini">
        <input type="checkbox" name="recurso" value="${k}" ${estado.recursos.has(k) ? "checked" : ""}>
        <span>${r.nome}</span>
      </label>`).join("");

    $("#ob-form").addEventListener("input", e => {
      const t = e.target;
      if (t.id === "ob-negocio") estado.negocio = t.value.trim();
      if (t.name === "tipo") estado.tipo = t.value;
      if (t.name === "pagina") t.checked ? estado.paginas.add(t.value) : estado.paginas.delete(t.value);
      if (t.name === "recurso") t.checked ? estado.recursos.add(t.value) : estado.recursos.delete(t.value);
      atualizar();
    });
  }

  /* ---------- rascunho visual ---------- */
  const bloco = (cls, html = "") => `<div class="wf ${cls}">${html}</div>`;
  const linhas = n => Array.from({ length: n }, (_, i) =>
    `<i class="wf-linha" style="width:${90 - i * 18}%"></i>`).join("");

  function rascunho() {
    const tipo = TIPOS[estado.tipo];
    const nome = estado.negocio || "Seu negócio";
    const r = estado.recursos;
    const pags = tipo.paginas ? PAGINAS.filter(p => estado.paginas.has(p)) : [];
    const partes = [];

    partes.push(bloco("wf-nav", `
      <b class="wf-logo">${esc(nome)}</b>
      <span class="wf-menu">${pags.map(p => `<em>${p}</em>`).join("")}</span>
      ${r.has("login") ? `<em class="wf-entrar">Entrar</em>` : ""}`));

    partes.push(bloco("wf-hero", `
      <strong>${esc(nome)}</strong>${linhas(2)}<i class="wf-botao"></i>`));

    if (estado.tipo === "catalogo") {
      partes.push(bloco("wf-grade", Array.from({ length: 6 }, () =>
        `<span><i class="wf-img"></i><i class="wf-linha" style="width:70%"></i><i class="wf-preco"></i></span>`).join("")));
    } else if (estado.tipo === "sistema") {
      partes.push(bloco("wf-dash", `<aside>${linhas(4)}</aside><div><span></span><span></span><span></span><i class="wf-tabela"></i></div>`));
    } else {
      partes.push(bloco("wf-cols", `<span>${linhas(3)}</span><span>${linhas(3)}</span><span>${linhas(3)}</span>`));
    }

    if (pags.includes("Galeria")) partes.push(bloco("wf-galeria", "<i></i><i></i><i></i><i></i>"));
    if (r.has("agenda")) partes.push(bloco("wf-agenda", `<b>Agende um horário</b><div>${"<i></i>".repeat(14)}</div>`));
    if (r.has("pix")) partes.push(bloco("wf-pix", `<i class="wf-qr"></i><span><b>Pague com Pix</b>${linhas(2)}</span>`));
    if (r.has("form") || r.has("mapa")) {
      partes.push(bloco("wf-contato", `
        ${r.has("form") ? `<span class="wf-campos"><i></i><i></i><i class="wf-area"></i></span>` : ""}
        ${r.has("mapa") ? `<span class="wf-mapa"><i></i></span>` : ""}`));
    }
    if (r.has("painel")) partes.push(bloco("wf-editar", `<b>✎</b> Você edita os textos sozinho`));
    partes.push(bloco("wf-rodape", linhas(1)));

    return partes.join("") + (r.has("whatsapp") ? `<i class="wf-zap" aria-hidden="true"></i>` : "");
  }

  function prazo() {
    const t = TIPOS[estado.tipo];
    let extra = 0;
    estado.recursos.forEach(k => extra += RECURSOS[k].semanas);
    const pags = t.paginas ? Math.max(0, estado.paginas.size - 4) : 0;
    extra += Math.ceil(pags / 2);
    return [t.prazo[0] + extra, t.prazo[1] + extra];
  }

  function mensagem() {
    const t = TIPOS[estado.tipo];
    const [a, b] = prazo();
    const linhas = [
      `Olá, Gabriel! Montei um rascunho no seu portfólio.`,
      estado.negocio ? `Negócio: ${estado.negocio}` : "",
      `Tipo: ${t.nome}`,
      t.paginas && estado.paginas.size ? `Páginas: ${[...estado.paginas].join(", ")}` : "",
      estado.recursos.size ? `Recursos: ${[...estado.recursos].map(k => RECURSOS[k].nome).join(", ")}` : "",
      `Prazo estimado: ${a} a ${b} semanas`
    ];
    return linhas.filter(Boolean).join("\n");
  }

  function atualizar() {
    const tela = $("#ob-tela");
    tela.innerHTML = rascunho();
    $("#ob-url").textContent = (estado.negocio || "seunegocio")
      .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "") + ".com.br";

    $("#ob-paginas-grupo").hidden = !TIPOS[estado.tipo].paginas;

    const [a, b] = prazo();
    $("#ob-prazo").textContent = `${a} a ${b} semanas`;

    const cfg = Portfolio.config;
    const texto = encodeURIComponent(mensagem());
    const zap = $("#ob-zap");
    if (cfg.whatsapp) {
      zap.href = `https://wa.me/${cfg.whatsapp}?text=${texto}`;
      zap.hidden = false;
    } else {
      zap.hidden = true;
    }
    $("#ob-email").href = `mailto:${cfg.email}?subject=${encodeURIComponent("Orçamento de site")}&body=${texto}`;
  }

  function iniciar() {
    montarControles();
    atualizar();
  }

  Portfolio.orcamento = { iniciar };
})();
