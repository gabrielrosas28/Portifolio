window.Portfolio = window.Portfolio || {};

Portfolio.config = {
  nome: "Gabriel Rosas",
  email: "gabrielaraujor05@gmail.com", 
  whatsapp: "5579996612005",
  github: "https://github.com/gabrielrosas28",
  githubUser: "gabrielrosas28",
  linkedin: "https://www.linkedin.com/in/gabriel-araujo-rosas-155707274/?isSelfProfile=true",

  projetos: {
    "Sistema-Gestao": {
      titulo: "Gestão escolar: Colégio Santa Chiara",
      categoria: "sistema",
      status: "Em uso na escola · v1.4.0",
      resumo: "Sistema da secretaria de uma escola com 637 alunos e 39 turmas: calendário, eventos, pagamentos por turma e relatórios.",
      detalhes: [
        "Um PC da escola é o servidor e os outros só abrem o navegador. Todo mundo vê o mesmo banco de dados, ao vivo.",
        "Cada aluno tem um cartão de pagamento com valor, meio (Pix, cartão ou dinheiro) e confirmação.",
        "Relatórios prontos para imprimir em papel timbrado ou exportar para o Excel.",
        "Turmas e eventos podem ser fechados para travar lançamentos depois da conferência."
      ],
      stack: ["Node.js", "JavaScript", "HTML", "CSS"],
      destaque: true
    },
    "AchadosPerdidos": {
      titulo: "Achados e Perdidos: app para tablet",
      categoria: "app",
      status: "Projeto entregue para a escola",
      resumo: "App Android para o tablet da portaria. Funciona sem internet e envia tudo para o servidor da escola quando reconecta.",
      detalhes: [
        "Modo público para alunos e pais consultarem objetos achados, com foto.",
        "Modo gestor protegido por PIN para cadastrar itens com a câmera e registrar a entrega.",
        "Sincroniza com uma API própria em ASP.NET Core, que guarda o histórico."
      ],
      stack: ["Kotlin", "Jetpack Compose", "Room", "ASP.NET Core", "C#"]
    },
    "pix-integration-hub": {
      titulo: "Hub de cobranças Pix",
      categoria: "api",
      status: "Residência de Software · UNIT",
      resumo: "API para emitir cobranças Pix e confirmar pagamentos direto com o banco, preparada para funcionar com vários bancos.",
      detalhes: [
        "Cobranças imediatas e com vencimento (Cob e CobV).",
        "O pagamento só é confirmado consultando o banco, nunca só pelo aviso automático. Isso evita marcar como pago o que não foi.",
        "Primeira integração com o Itaú. Outros bancos entram como adaptadores."
      ],
      stack: [".NET 10", "C#", "PostgreSQL", "RabbitMQ", "Docker"]
    },
    "EcoSense-IoT": {
      titulo: "EcoSense IoT: sala inteligente",
      categoria: "sistema",
      status: "Projeto em equipe · Engenharia de Software",
      resumo: "Painel web que controla projetor, luzes, irrigação e umidificador de uma sala a partir de sensores, para economizar energia e água.",
      detalhes: [
        "Luz por presença com desligamento automático e irrigação pela umidade do solo.",
        "Gráficos do histórico de umidade e botão para assumir o controle manual.",
        "Feito por uma equipe de 5 pessoas, organizada em Kanban."
      ],
      stack: ["React", "Node.js", "MQTT", "PostgreSQL", "ESP32"]
    }
  },

  categorias: {
    sistema: "Sistemas web",
    app: "Apps",
    api: "APIs e integrações",
    outro: "Outros"
  }
};
