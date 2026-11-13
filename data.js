/**
 * LAVERAP - Dados e Configurações dos Serviços, Veículos e Horários
 */

const LAVERAP_CONFIG = {
  nome: "LAVERAP",
  slogan: "Lava Jato & Estética Automotiva de Alta Performance",
  telefoneWhatsApp: "5522999998888", // Rio das Ostras (DDD 22)
  telefoneExibicao: "(22) 99999-8888",
  endereco: "Rua Recife, 1071, Casa 4 - Jardim Bela Vista",
  cidade: "Rio das Ostras - RJ",
  horarioFuncionamento: "Segunda a Sábado, das 08h às 18h",
  instagram: "@laverap_riodasostras",
  pixChave: "contato@laverap.com.br",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Recife+1071+Casa+4+Jardim+Bela+Vista+Rio+das+Ostras+RJ",
  wazeUrl: "https://waze.com/ul?q=Rua+Recife+1071+Jardim+Bela+Vista+Rio+das+Ostras"
};

// Categorias de Veículos
const VEHICLE_CATEGORIES = [
  {
    type: "car",
    id: "hatch",
    name: "Hatch / Compacto",
    icon: "car",
    examples: "Ex: Onix, HB20, Polo, Gol, Ka, Kwid, Argo",
    badge: "Econômico"
  },
  {
    type: "car",
    id: "sedan",
    name: "Sedã / Sedan Médio",
    icon: "car",
    examples: "Ex: Corolla, Civic, Virtus, Cruze, Sentra, Cronos",
    badge: "Popular"
  },
  {
    type: "car",
    id: "suv",
    name: "SUV / Picape / Grande",
    icon: "truck",
    examples: "Ex: Compass, Hilux, Renegade, Toro, T-Cross, SW4, Ranger",
    badge: "Porte Maior"
  },
  {
    type: "moto",
    id: "moto_pequena",
    name: "Moto Pequena / Scooter",
    icon: "bike",
    examples: "Até 160cc - Ex: CG 160, Biz, Factor, PCX, NMax",
    badge: "Urbana"
  },
  {
    type: "moto",
    id: "moto_media",
    name: "Moto Média Cilindrada",
    icon: "bike",
    examples: "250cc a 650cc - Ex: CB 500, MT-03, Fazer 250, XRE 300",
    badge: "Média"
  },
  {
    type: "moto",
    id: "moto_alta",
    name: "Moto Alta Cilindrada / Big Trail",
    icon: "bike",
    examples: "700cc+ - Ex: BMW GS 1250, Tiger 900, MT-09, Z900, Harley",
    badge: "Alta Performance"
  }
];

// Catálogo de Serviços com matriz de preços por tipo de veículo
const SERVICES = [
  {
    id: "ducha",
    name: "Ducha Rápida & Aspiração",
    category: "all",
    popular: false,
    duration: "35 min",
    tagline: "Para quem está com pressa e precisa do veículo limpo no dia a dia",
    features: [
      "Lavagem externa com shampoo neutro pH balanceado",
      "Enxágue com lavadora de alta pressão",
      "Secagem técnica com toalhas de microfibra",
      "Aspiração rápida do assoalho e tapetes",
      "Limpeza rápida dos vidros externos"
    ],
    prices: {
      hatch: 40,
      sedan: 45,
      suv: 55,
      moto_pequena: 25,
      moto_media: 35,
      moto_alta: 45
    }
  },
  {
    id: "completa",
    name: "Lavagem Completa LAVERAP",
    category: "all",
    popular: true,
    duration: "1h 10 min",
    tagline: "O melhor custo-benefício com limpeza externa e interna aprofundada",
    features: [
      "Tudo da Ducha Rápida +",
      "Lavagem de caixas de roda e desengraxe de pneus",
      "Aspiração profunda (bancos, carpetes e porta-malas)",
      "Higienização de painel e guarnições plásticas com proteção UV",
      "Aplicação de pretinho siliconado de longa duração nos pneus",
      "Aromatizante automotivo premium LAVERAP"
    ],
    prices: {
      hatch: 65,
      sedan: 75,
      suv: 90,
      moto_pequena: 40,
      moto_media: 55,
      moto_alta: 70
    }
  },
  {
    id: "detalhada",
    name: "Lavagem Técnica Detalhada (Detailing)",
    category: "all",
    popular: false,
    duration: "2h 00 min",
    tagline: "Cuidado artesanal com pincéis em cada detalhe, cantos e cera nobre",
    features: [
      "Limpeza minuciosa com pincéis de cerdas macias em emblemas e frestas",
      "Descontaminação ferrosa de rodas e pinças de freio",
      "Aplicação manual de Cera Nobre de Carnaúba pura (brilho profundo)",
      "Hidratação e revitalização de plásticos e borrachas externos",
      "Limpeza e acabamento impecável de vidros internos e externos",
      "Condicionamento das caixas de roda"
    ],
    prices: {
      hatch: 130,
      sedan: 150,
      suv: 180,
      moto_pequena: 80,
      moto_media: 105,
      moto_alta: 135
    }
  },
  {
    id: "moto_pro",
    name: "Combo Moto Detailing & Transmissão",
    category: "moto",
    popular: true,
    duration: "1h 30 min",
    tagline: "Especial para motociclistas: banho completo + cuidado da corrente",
    features: [
      "Lavagem técnica completa com água quente e shampoo anti-corrosão",
      "Desengraxe pesado da balança e roda traseira",
      "Limpeza profunda e escovação 360° da relação (corrente, coroa e pinhão)",
      "Secagem integral por ar comprimido (evita pontos de ferrugem)",
      "Lubrificação de alta performance com Motul Chain Lube C4 / Repsol",
      "Proteção de cabos e acabamento de partes metálicas"
    ],
    prices: {
      moto_pequena: 65,
      moto_media: 85,
      moto_alta: 115
    }
  },
  {
    id: "higienizacao",
    name: "Higienização Interna & Oxi-Sanitização",
    category: "car",
    popular: false,
    duration: "3h 00 min",
    tagline: "Eliminação profunda de manchas, ácaros, bactérias e odores desagradáveis",
    features: [
      "Lavagem por extração profunda de todos os bancos (tecido)",
      "Limpeza técnica de teto, colunas, carpetes e cintos",
      "Aplicação de ozônio (oxi-sanitização) no sistema de ar-condicionado",
      "Elimina odor de cigarro, mofo, derramamento de líquidos e pets",
      "Secagem rápida com sopradores"
    ],
    prices: {
      hatch: 220,
      sedan: 250,
      suv: 290
    }
  },
  {
    id: "polimento",
    name: "Polimento Técnico & Cera Cristalizadora",
    category: "all",
    popular: false,
    duration: "3h 30 min",
    tagline: "Restauração de brilho espelhado, remoção de riscos leves e proteção UV",
    features: [
      "Descontaminação de pintura com barra de argila (Clay Bar)",
      "Polimento em etapas para remoção de hologramas e micro-riscos",
      "Aplicação de selante sintético de alto brilho com proteção de 6 meses",
      "Revitalização de faróis e lanternas",
      "Proteção térmica contra desbotamento solar"
    ],
    prices: {
      hatch: 280,
      sedan: 330,
      suv: 390,
      moto_pequena: 120,
      moto_media: 160,
      moto_alta: 210
    }
  }
];

// Serviços Adicionais (Add-ons)
const ADDONS = [
  {
    id: "cera_carnauba",
    name: "Cera de Carnaúba Premium",
    desc: "Brilho molhado espelhado e camada extra de hidrorrepelência.",
    duration: "+15 min",
    applicableTo: "all",
    prices: {
      car: 30,
      moto: 20
    }
  },
  {
    id: "motor",
    name: "Limpeza Técnica de Motor + Verniz Protetor",
    desc: "Limpeza segura com pincéis, vapor e aplicação de verniz térmico protetor.",
    duration: "+30 min",
    applicableTo: "all",
    prices: {
      car: 55,
      moto: 35
    }
  },
  {
    id: "cristalizacao_vidros",
    name: "Cristalização do Para-brisa (Repelência de Chuva)",
    desc: "Água escorre facilmente com o vento, garantindo segurança máxima na chuva.",
    duration: "+15 min",
    applicableTo: "car",
    prices: {
      car: 35
    }
  },
  {
    id: "hidratacao_couro",
    name: "Higienização & Hidratação de Couro",
    desc: "Devolve a maciez natural dos bancos, prevenindo ressecamento e rachaduras.",
    duration: "+25 min",
    applicableTo: "all",
    prices: {
      car: 50,
      moto: 25
    }
  },
  {
    id: "oxi_ozonio",
    name: "Oxi-Sanitização com Gerador de Ozônio",
    desc: "Purifica o ar interno, destruindo bactérias e odores persistentes no duto de ar.",
    duration: "+25 min",
    applicableTo: "car",
    prices: {
      car: 45
    }
  },
  {
    id: "lubrificacao_moto",
    name: "Desengraxe e Lubrificação de Corrente (Motul)",
    desc: "Tratamento de corrente para prolongar a vida útil da relação e rodar suave.",
    duration: "+20 min",
    applicableTo: "moto",
    prices: {
      moto: 25
    }
  },
  {
    id: "farois",
    name: "Polimento e Clareamento de Faróis",
    desc: "Remove o amarelado opaco do policarbonato, restaurando a luminosidade noturna.",
    duration: "+30 min",
    applicableTo: "all",
    prices: {
      car: 60,
      moto: 30
    }
  }
];

// Horários disponíveis por dia
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];


// Dados iniciais de demonstração para agendamentos salvos
const INITIAL_APPOINTMENTS = [
  {
    id: "LVR-7821",
    clientName: "Rodrigo Almeida",
    whatsapp: "11987654321",
    vehicleType: "car",
    category: "sedan",
    categoryName: "Sedã / Sedan Médio",
    vehicleModel: "Honda Civic G10 2.0",
    plate: "BRA2E19",
    serviceId: "completa",
    serviceName: "Lavagem Completa LAVERAP",
    addons: ["cera_carnauba", "cristalizacao_vidros"],
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Amanhã
    time: "09:00",
    totalPrice: 140,
    status: "Confirmado", // Pendente, Confirmado, Em Andamento, Concluído, Cancelado
    notes: "Cuidado com película nos vidros recém aplicada",
    deliveryType: "balcao", // balcao ou leva_e_traz
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "LVR-9412",
    clientName: "Mariana Vasconcelos",
    whatsapp: "11971239845",
    vehicleType: "moto",
    category: "moto_media",
    categoryName: "Moto Média Cilindrada",
    vehicleModel: "Yamaha MT-03 2023",
    plate: "SPX9F44",
    serviceId: "moto_pro",
    serviceName: "Combo Moto Detailing & Transmissão",
    addons: [],
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Amanhã
    time: "14:00",
    totalPrice: 85,
    status: "Pendente",
    notes: "Revisar tensão da corrente se possível",
    deliveryType: "balcao",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "LVR-6130",
    clientName: "Carlos Eduardo Santos",
    whatsapp: "11993321144",
    vehicleType: "car",
    category: "suv",
    categoryName: "SUV / Picape / Grande",
    vehicleModel: "Jeep Compass Longitude",
    plate: "FTL3B88",
    serviceId: "detalhada",
    serviceName: "Lavagem Técnica Detalhada (Detailing)",
    addons: ["motor"],
    date: new Date().toISOString().split("T")[0], // Hoje
    time: "10:00",
    totalPrice: 235,
    status: "Em Andamento",
    notes: "Atenção ao teto solar",
    deliveryType: "leva_e_traz",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];
