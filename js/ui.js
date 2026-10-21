/* ==========================================================
   MÓDULO: INTERFACE
   Tema claro/escuro, menu no celular, animação ao rolar,
   formulário de contato e ano do rodapé.
   ========================================================== */
(function () {
  function tema() {
    const root = document.documentElement;
    const btn = document.getElementById("tema-btn");
    try {
      const salvo = localStorage.getItem("tema");
      if (salvo) root.dataset.theme = salvo;
    } catch (e) {}

    btn.addEventListener("click", () => {
      const escuroAgora = root.dataset.theme
        ? root.dataset.theme === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = escuroAgora ? "light" : "dark";
      try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
    });
  }

  function menu() {
    const btn = document.getElementById("menu-btn");
    const nav = document.getElementById("menu");
    btn.addEventListener("click", () => {
      const aberto = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", aberto);
    });
    nav.addEventListener("click", e => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", false);
      }
    });
  }

  function revelar() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  function contato() {
    const form = document.getElementById("contato-form");
    const cfg = Portfolio.config;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const d = new FormData(form);
      const nome = String(d.get("nome") || "").trim();
      const msg = String(d.get("mensagem") || "").trim();
      const aviso = document.getElementById("contato-aviso");
      if (!nome || !msg) {
        aviso.textContent = "Preencha seu nome e conte um pouco sobre o projeto.";
        return;
      }
      aviso.textContent = "Abrindo seu e-mail com a mensagem pronta.";
      const corpo = `${msg}\n\n${nome}`;
      location.href = `mailto:${cfg.email}?subject=${encodeURIComponent("Projeto de site: " + nome)}&body=${encodeURIComponent(corpo)}`;
    });

    document.querySelectorAll("[data-email]").forEach(a => {
      a.href = "mailto:" + cfg.email;
      if (a.dataset.email === "texto") a.textContent = cfg.email;
    });
    document.querySelectorAll("[data-github]").forEach(a => {
      a.href = "https://github.com/" + cfg.githubUser;
    });
    document.querySelectorAll("[data-zap]").forEach(a => {
      if (cfg.whatsapp) a.href = "https://wa.me/" + cfg.whatsapp;
      else a.hidden = true;
    });
  }

  function iniciar() {
    tema();
    menu();
    revelar();
    contato();
    document.getElementById("ano").textContent = new Date().getFullYear();
  }

  Portfolio.ui = { iniciar };
})();
