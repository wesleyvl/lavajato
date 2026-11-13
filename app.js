/**
 * LAVERAP - Aplicação Principal de Agendamento
 */

// Estado da Aplicação
const appState = {
  currentStep: 1,
  vehicleType: "car", // 'car' ou 'moto'
  category: "sedan", // ID da categoria selecionada
  serviceId: "completa", // ID do serviço principal
  addons: [], // IDs dos adicionais selecionados
  date: null,
  time: null,
  deliveryType: "balcao", // 'balcao' ou 'leva_e_traz'
  customer: {
    name: "",
    phone: "",
    model: "",
    plate: "",
    notes: ""
  }
};

// Gerenciador de Armazenamento Local (LocalStorage)
const StorageManager = {
  KEY_APPOINTMENTS: "laverap_appointments",
  KEY_CONFIG: "laverap_config",

  getAppointments() {
    const data = localStorage.getItem(this.KEY_APPOINTMENTS);
    if (!data) {
      // Salva os dados de demonstração iniciais
      localStorage.setItem(this.KEY_APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Erro ao ler agendamentos:", e);
      return [];
    }
  },

  saveAppointments(list) {
    localStorage.setItem(this.KEY_APPOINTMENTS, JSON.stringify(list));
  },

  addAppointment(appointment) {
    const list = this.getAppointments();
    list.unshift(appointment);
    this.saveAppointments(list);
    return appointment;
  },

  updateAppointmentStatus(id, newStatus) {
    const list = this.getAppointments();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
      this.saveAppointments(list);
      return true;
    }
    return false;
  },

  getConfig() {
    const data = localStorage.getItem(this.KEY_CONFIG);
    if (!data) return LAVERAP_CONFIG;
    try {
      return { ...LAVERAP_CONFIG, ...JSON.parse(data) };
    } catch {
      return LAVERAP_CONFIG;
    }
  },

  saveConfig(newConfig) {
    localStorage.setItem(this.KEY_CONFIG, JSON.stringify(newConfig));
  }
};

// Inicialização da Página
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa ícones do Lucide se disponível
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Preenche dados da empresa na interface
  renderCompanyInfo();

  // Configura listeners de veículos (Carro vs Moto)
  initVehicleTypeToggles();

  // Renderiza categorias de veículos
  renderVehicleCategories();

  // Renderiza catálogo de serviços
  renderServices();

  // Renderiza opcionais / adicionais
  renderAddons();

  // Gera dias do calendário
  generateDateOptions();

  // Inicializa máscaras de inputs
  initInputMasks();

  // Configura navegação por etapas (Wizard)
  initWizardNavigation();

  // Atualiza barra de resumo flutuante / lateral
  updateSummary();

  // Consulta de agendamento por placa/telefone
  initTrackingModal();

  // Botão de scroll suave
  initSmoothScroll();
});

// Renderiza dados da empresa
function renderCompanyInfo() {
  const config = StorageManager.getConfig();
  document.querySelectorAll(".company-name").forEach(el => el.textContent = config.nome);
  document.querySelectorAll(".company-phone").forEach(el => el.textContent = config.telefoneExibicao);
  document.querySelectorAll(".company-address").forEach(el => el.textContent = config.endereco);
  document.querySelectorAll(".company-city").forEach(el => el.textContent = config.cidade);
  document.querySelectorAll(".company-hours").forEach(el => el.textContent = config.horarioFuncionamento);
  
  // Atualiza links de mapa se existirem
  const mapsLink = document.getElementById("google-maps-btn");
  if (mapsLink && config.googleMapsUrl) mapsLink.href = config.googleMapsUrl;

  const wazeLink = document.getElementById("waze-btn");
  if (wazeLink && config.wazeUrl) wazeLink.href = config.wazeUrl;
}

// Alternador entre Carro e Moto
function initVehicleTypeToggles() {
  const btnCar = document.getElementById("tab-type-car");
  const btnMoto = document.getElementById("tab-type-moto");

  if (btnCar && btnMoto) {
    btnCar.addEventListener("click", () => switchVehicleType("car"));
    btnMoto.addEventListener("click", () => switchVehicleType("moto"));
  }
}

function switchVehicleType(type) {
  if (appState.vehicleType === type) return;

  appState.vehicleType = type;
  
  // Atualiza classes visuais das tabs
  const btnCar = document.getElementById("tab-type-car");
  const btnMoto = document.getElementById("tab-type-moto");

  if (type === "car") {
    btnCar.className = "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all";
    btnMoto.className = "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all";
    // Seleciona categoria padrão de carro
    appState.category = "sedan";
    appState.serviceId = "completa";
  } else {
    btnMoto.className = "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all";
    btnCar.className = "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all";
    // Seleciona categoria padrão de moto
    appState.category = "moto_media";
    appState.serviceId = "moto_pro";
  }

  // Remove addons incompatíveis
  appState.addons = [];

  renderVehicleCategories();
  renderServices();
  renderAddons();
  updateSummary();

  if (window.lucide) window.lucide.createIcons();
}

// Renderiza Cards das Categorias do Veículo
function renderVehicleCategories() {
  const container = document.getElementById("vehicle-categories-container");
  if (!container) return;

  const currentCategories = VEHICLE_CATEGORIES.filter(c => c.type === appState.vehicleType);
  
  container.innerHTML = currentCategories.map(cat => {
    const isSelected = appState.category === cat.id;
    return `
      <div class="selectable-card rounded-2xl p-5 relative overflow-hidden transition-all ${isSelected ? 'selected' : ''}"
           onclick="selectVehicleCategory('${cat.id}')">
        <div class="flex items-start justify-between mb-3">
          <div class="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400">
            <i data-lucide="${cat.icon}" class="w-6 h-6"></i>
          </div>
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/20">
            ${cat.badge}
          </span>
        </div>
        <h4 class="text-base font-bold text-white mb-1">${cat.name}</h4>
        <p class="text-xs text-slate-400 leading-relaxed">${cat.examples}</p>
        
        <div class="check-indicator absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
          <i data-lucide="check" class="w-4 h-4 stroke-[3]"></i>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function selectVehicleCategory(categoryId) {
  appState.category = categoryId;
  renderVehicleCategories();
  renderServices();
  renderAddons();
  updateSummary();
}

// Renderiza Cards de Serviços com Preços Dinâmicos
function renderServices() {
  const container = document.getElementById("services-container");
  if (!container) return;

  // Filtra serviços aplicáveis à categoria do veículo
  const availableServices = SERVICES.filter(s => {
    if (s.category === "all") return true;
    return s.category === appState.vehicleType;
  });

  container.innerHTML = availableServices.map(service => {
    const price = service.prices[appState.category] || 0;
    const isSelected = appState.serviceId === service.id;

    const featureItems = service.features.map(f => `
      <li class="flex items-center gap-2 text-xs text-slate-300">
        <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
        <span>${f}</span>
      </li>
    `).join("");

    return `
      <div class="selectable-card rounded-2xl p-6 relative flex flex-col justify-between transition-all ${isSelected ? 'selected' : ''}"
           onclick="selectService('${service.id}')">
        
        ${service.popular ? `
          <div class="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black tracking-wide uppercase shadow-md flex items-center gap-1">
            <i data-lucide="sparkles" class="w-3 h-3"></i> Mais Escolhido
          </div>
        ` : ''}

        <div>
          <div class="flex items-center justify-between mt-1 mb-2">
            <h4 class="text-lg font-bold text-white">${service.name}</h4>
            <div class="text-right">
              <span class="text-xs text-slate-400 block font-medium">A partir de</span>
              <span class="text-2xl font-black text-cyan-400">R$ ${price}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 mb-4 text-xs text-slate-400">
            <span class="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 text-slate-300">
              <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i>
              ${service.duration}
            </span>
            <span>• ${service.tagline}</span>
          </div>

          <ul class="space-y-2 mb-6 border-t border-slate-800/80 pt-4">
            ${featureItems}
          </ul>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}">
            ${isSelected ? 'Serviço Selecionado' : 'Clique para selecionar'}
          </span>
          <div class="w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700 text-slate-500'}">
            <i data-lucide="${isSelected ? 'check' : 'plus'}" class="w-4 h-4 stroke-[2.5]"></i>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function selectService(serviceId) {
  appState.serviceId = serviceId;
  renderServices();
  updateSummary();
}

// Renderiza Serviços Adicionais (Add-ons)
function renderAddons() {
  const container = document.getElementById("addons-container");
  if (!container) return;

  const availableAddons = ADDONS.filter(addon => {
    return addon.applicableTo === "all" || addon.applicableTo === appState.vehicleType;
  });

  container.innerHTML = availableAddons.map(addon => {
    const isSelected = appState.addons.includes(addon.id);
    const price = addon.prices[appState.vehicleType] || addon.prices.car || 0;

    return `
      <div class="glass-card rounded-xl p-4 flex items-center justify-between cursor-pointer border transition-all ${isSelected ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700'}"
           onclick="toggleAddon('${addon.id}')">
        <div class="flex items-start gap-3">
          <div class="w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-all ${isSelected ? 'bg-cyan-500 text-slate-950' : 'border border-slate-600 bg-slate-900'}">
            ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>' : ''}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h5 class="text-sm font-semibold text-white">${addon.name}</h5>
              <span class="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">${addon.duration}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">${addon.desc}</p>
          </div>
        </div>
        <div class="text-right pl-3 shrink-0">
          <span class="text-sm font-bold text-cyan-400">+ R$ ${price}</span>
        </div>
      </div>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function toggleAddon(addonId) {
  const index = appState.addons.indexOf(addonId);
  if (index >= 0) {
    appState.addons.splice(index, 1);
  } else {
    appState.addons.push(addonId);
  }
  renderAddons();
  updateSummary();
}

// Gera opções de Data dos próximos 14 dias
function generateDateOptions() {
  const dateContainer = document.getElementById("date-options-container");
  if (!dateContainer) return;

  const dates = [];
  const today = new Date();
  
  // Nomes dos dias e meses em português
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isSunday = d.getDay() === 0; // Fechado aos domingos
    const isoDate = d.toISOString().split("T")[0];

    dates.push({
      dateObj: d,
      iso: isoDate,
      dayNumber: d.getDate(),
      dayName: i === 0 ? "Hoje" : (i === 1 ? "Amanhã" : dayNames[d.getDay()]),
      monthName: monthNames[d.getMonth()],
      disabled: isSunday
    });
  }

  // Pre-seleciona primeiro dia válido (Hoje ou amanhã se hoje for domingo)
  if (!appState.date) {
    const firstValid = dates.find(d => !d.disabled);
    if (firstValid) {
      appState.date = firstValid.iso;
    }
  }

  dateContainer.innerHTML = dates.map(item => {
    const isSelected = appState.date === item.iso;
    
    if (item.disabled) {
      return `
        <div class="flex-shrink-0 w-20 py-3 rounded-xl bg-slate-900/40 border border-slate-800/40 text-center opacity-40 cursor-not-allowed">
          <span class="text-[11px] uppercase tracking-wider block text-slate-500 font-bold">${item.dayName}</span>
          <span class="text-lg font-black block text-slate-600">${item.dayNumber}</span>
          <span class="text-[10px] block text-red-400 font-medium">Fechado</span>
        </div>
      `;
    }

    return `
      <div class="flex-shrink-0 w-20 py-3 rounded-xl cursor-pointer text-center border transition-all ${isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'}"
           onclick="selectDate('${item.iso}')">
        <span class="text-[11px] uppercase tracking-wider block ${isSelected ? 'text-slate-950' : 'text-slate-400'} font-bold">${item.dayName}</span>
        <span class="text-xl font-black block my-0.5">${item.dayNumber}</span>
        <span class="text-[10px] block ${isSelected ? 'text-slate-900' : 'text-slate-400'}">${item.monthName}</span>
      </div>
    `;
  }).join("");

  // Renderiza horários para a data selecionada
  renderTimeSlots();
}

function selectDate(isoDate) {
  appState.date = isoDate;
  generateDateOptions();
  renderTimeSlots();
  updateSummary();
}

// Renderiza Horários Disponíveis filtrando os já agendados
function renderTimeSlots() {
  const container = document.getElementById("time-slots-container");
  if (!container) return;

  const appointments = StorageManager.getAppointments();
  
  // Encontra horários ocupados para a data selecionada (exceto cancelados)
  const bookedTimes = appointments
    .filter(a => a.date === appState.date && a.status !== "Cancelado")
    .map(a => a.time);

  // Divide slots em manhã e tarde
  const morningSlots = TIME_SLOTS.filter(t => parseInt(t.split(":")[0]) < 12);
  const afternoonSlots = TIME_SLOTS.filter(t => parseInt(t.split(":")[0]) >= 12);

  const renderSlotButtons = (slots) => slots.map(time => {
    const isBooked = bookedTimes.includes(time);
    const isSelected = appState.time === time;

    return `
      <button type="button"
              class="time-slot-btn py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${isSelected ? 'selected' : ''}"
              ${isBooked ? 'disabled title="Horário já reservado"' : `onclick="selectTime('${time}')"`}>
        <i data-lucide="clock" class="w-3.5 h-3.5"></i>
        <span>${time}</span>
        ${isBooked ? '<span class="text-[10px] ml-1 bg-red-950 text-red-400 px-1 rounded">Ocupado</span>' : ''}
      </button>
    `;
  }).join("");

  container.innerHTML = `
    <div class="mb-4">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Manhã</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        ${renderSlotButtons(morningSlots)}
      </div>
    </div>
    <div>
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tarde</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        ${renderSlotButtons(afternoonSlots)}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function selectTime(time) {
  appState.time = time;
  renderTimeSlots();
  updateSummary();
}

// Inicializa Máscaras de Inputs
function initInputMasks() {
  const phoneInput = document.getElementById("client-phone");
  const plateInput = document.getElementById("vehicle-plate");

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      if (v.length > 11) v = v.substring(0, 11);
      
      if (v.length > 6) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      } else {
        e.target.value = "";
      }
      appState.customer.phone = e.target.value;
      updateSummary();
    });
  }

  if (plateInput) {
    plateInput.addEventListener("input", (e) => {
      let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (v.length > 7) v = v.substring(0, 7);
      e.target.value = v;
      appState.customer.plate = v;
      updateSummary();
    });
  }

  const nameInput = document.getElementById("client-name");
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      appState.customer.name = e.target.value;
      updateSummary();
    });
  }

  const modelInput = document.getElementById("vehicle-model");
  if (modelInput) {
    modelInput.addEventListener("input", (e) => {
      appState.customer.model = e.target.value;
      updateSummary();
    });
  }

  const notesInput = document.getElementById("booking-notes");
  if (notesInput) {
    notesInput.addEventListener("input", (e) => {
      appState.customer.notes = e.target.value;
    });
  }

  // Delivery options (Balcão vs Leva e Traz)
  const deliveryRadios = document.querySelectorAll("input[name='delivery-option']");
  deliveryRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      appState.deliveryType = e.target.value;
      updateSummary();
    });
  });
}

// Cálculo do Total e Atualização do Resumo
function calculateTotals() {
  const service = SERVICES.find(s => s.id === appState.serviceId);
  const basePrice = service ? (service.prices[appState.category] || 0) : 0;

  let addonsPrice = 0;
  appState.addons.forEach(addonId => {
    const add = ADDONS.find(a => a.id === addonId);
    if (add) {
      addonsPrice += add.prices[appState.vehicleType] || add.prices.car || 0;
    }
  });

  const totalPrice = basePrice + addonsPrice;
  return { basePrice, addonsPrice, totalPrice, service };
}

function updateSummary() {
  const { basePrice, addonsPrice, totalPrice, service } = calculateTotals();
  const categoryObj = VEHICLE_CATEGORIES.find(c => c.id === appState.category);

  // Elementos do resumo
  const elCategory = document.getElementById("summary-category");
  const elService = document.getElementById("summary-service");
  const elDate = document.getElementById("summary-date");
  const elTime = document.getElementById("summary-time");
  const elAddons = document.getElementById("summary-addons-list");
  const elTotal = document.getElementById("summary-total-price");
  const elDuration = document.getElementById("summary-duration");

  if (elCategory && categoryObj) {
    elCategory.textContent = categoryObj.name;
  }
  if (elService && service) {
    elService.textContent = service.name;
  }
  if (elDuration && service) {
    elDuration.textContent = service.duration;
  }
  if (elDate) {
    if (appState.date) {
      const [year, month, day] = appState.date.split("-");
      elDate.textContent = `${day}/${month}/${year}`;
    } else {
      elDate.textContent = "Selecione o dia";
    }
  }
  if (elTime) {
    elTime.textContent = appState.time ? `${appState.time}h` : "Escolha o horário";
  }
  if (elAddons) {
    if (appState.addons.length === 0) {
      elAddons.innerHTML = `<span class="text-xs text-slate-500 italic">Nenhum adicional selecionado</span>`;
    } else {
      elAddons.innerHTML = appState.addons.map(id => {
        const ad = ADDONS.find(a => a.id === id);
        return `<span class="inline-block text-[11px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded mr-1 mb-1 border border-cyan-500/20">${ad.name}</span>`;
      }).join("");
    }
  }
  if (elTotal) {
    elTotal.textContent = `R$ ${totalPrice},00`;
  }
}

// Navegação entre Etapas do Wizard
function initWizardNavigation() {
  const nextBtn = document.getElementById("wizard-btn-next");
  const prevBtn = document.getElementById("wizard-btn-prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateCurrentStep()) {
        if (appState.currentStep < 3) {
          goToStep(appState.currentStep + 1);
        } else if (appState.currentStep === 3) {
          // Último passo -> finalizar agendamento
          finalizeAppointment();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (appState.currentStep > 1) {
        goToStep(appState.currentStep - 1);
      }
    });
  }
}

function validateCurrentStep() {
  if (appState.currentStep === 1) {
    if (!appState.category || !appState.serviceId) {
      showToast("Atenção", "Selecione o porte do veículo e o serviço desejado.", "warning");
      return false;
    }
    return true;
  }

  if (appState.currentStep === 2) {
    if (!appState.date) {
      showToast("Data obrigatória", "Por favor, escolha uma data para o agendamento.", "warning");
      return false;
    }
    if (!appState.time) {
      showToast("Horário obrigatório", "Por favor, selecione um horário disponível.", "warning");
      return false;
    }
    return true;
  }

  if (appState.currentStep === 3) {
    const name = document.getElementById("client-name")?.value.trim();
    const phone = document.getElementById("client-phone")?.value.trim();
    const model = document.getElementById("vehicle-model")?.value.trim();
    const plate = document.getElementById("vehicle-plate")?.value.trim();

    if (!name || name.length < 3) {
      showToast("Nome Inválido", "Por favor, informe seu nome completo.", "warning");
      document.getElementById("client-name")?.focus();
      return false;
    }

    const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
    if (!phone || cleanPhone.length < 10) {
      showToast("Telefone Inválido", "Informe um número de WhatsApp válido com DDD.", "warning");
      document.getElementById("client-phone")?.focus();
      return false;
    }

    if (!model) {
      showToast("Modelo do Veículo", "Informe a marca e modelo do seu carro ou moto.", "warning");
      document.getElementById("vehicle-model")?.focus();
      return false;
    }

    if (!plate || plate.length < 7) {
      showToast("Placa do Veículo", "Informe a placa completa do veículo.", "warning");
      document.getElementById("vehicle-plate")?.focus();
      return false;
    }

    return true;
  }

  return true;
}

function goToStep(stepNumber) {
  appState.currentStep = stepNumber;

  // Atualiza painéis das etapas
  document.querySelectorAll(".wizard-step-content").forEach(el => el.classList.add("hidden"));
  const currentContent = document.getElementById(`step-content-${stepNumber}`);
  if (currentContent) currentContent.classList.remove("hidden");

  // Atualiza indicadores visuais do topo
  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById(`step-indicator-${i}`);
    if (indicator) {
      indicator.classList.remove("active", "completed");
      if (i < stepNumber) indicator.classList.add("completed");
      if (i === stepNumber) indicator.classList.add("active");
    }
  }

  // Atualiza botões
  const prevBtn = document.getElementById("wizard-btn-prev");
  const nextBtn = document.getElementById("wizard-btn-next");

  if (prevBtn) {
    if (stepNumber === 1) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }
  }

  if (nextBtn) {
    if (stepNumber === 3) {
      nextBtn.innerHTML = `
        <span>Confirmar Agendamento</span>
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      `;
      nextBtn.className = "px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all";
    } else {
      nextBtn.innerHTML = `
        <span>Continuar</span>
        <i data-lucide="arrow-right" class="w-5 h-5"></i>
      `;
      nextBtn.className = "px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all";
    }
  }

  // Rola suavemente até o topo da seção de agendamento
  const bookingSection = document.getElementById("agendamento");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (window.lucide) window.lucide.createIcons();
}

// Finaliza o agendamento
function finalizeAppointment() {
  const { totalPrice } = calculateTotals();
  const service = SERVICES.find(s => s.id === appState.serviceId);
  const categoryObj = VEHICLE_CATEGORIES.find(c => c.id === appState.category);

  // Gera ID único
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const appointmentId = `LVR-${randomId}`;

  const newAppointment = {
    id: appointmentId,
    clientName: appState.customer.name,
    whatsapp: appState.customer.phone.replace(/\D/g, ""),
    vehicleType: appState.vehicleType,
    category: appState.category,
    categoryName: categoryObj.name,
    vehicleModel: appState.customer.model,
    plate: appState.customer.plate.toUpperCase(),
    serviceId: appState.serviceId,
    serviceName: service.name,
    addons: [...appState.addons],
    date: appState.date,
    time: appState.time,
    totalPrice: totalPrice,
    status: "Pendente",
    notes: appState.customer.notes || "Nenhuma observação informada.",
    deliveryType: appState.deliveryType,
    createdAt: new Date().toISOString()
  };

  // Salva no LocalStorage
  StorageManager.addAppointment(newAppointment);

  // Exibe modal de confirmação
  showSuccessModal(newAppointment);
}

// Exibe Modal de Sucesso com Botão do WhatsApp
function showSuccessModal(appointment) {
  const modal = document.getElementById("success-modal");
  if (!modal) return;

  const [year, month, day] = appointment.date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  const config = StorageManager.getConfig();

  // Nomes dos adicionais
  const addonsText = appointment.addons.length > 0 
    ? appointment.addons.map(id => ADDONS.find(a => a.id === id)?.name).filter(Boolean).join(", ")
    : "Nenhum";

  // Preenche dados do modal
  document.getElementById("modal-ticket-id").textContent = appointment.id;
  document.getElementById("modal-ticket-name").textContent = appointment.clientName;
  document.getElementById("modal-ticket-vehicle").textContent = `${appointment.vehicleModel} (${appointment.plate})`;
  document.getElementById("modal-ticket-service").textContent = appointment.serviceName;
  document.getElementById("modal-ticket-datetime").textContent = `${formattedDate} às ${appointment.time}h`;
  document.getElementById("modal-ticket-addons").textContent = addonsText;
  document.getElementById("modal-ticket-total").textContent = `R$ ${appointment.totalPrice},00`;
  document.getElementById("modal-ticket-delivery").textContent = appointment.deliveryType === "leva_e_traz" ? "Leva e Traz Solicitado" : "Cliente Leva ao Lava Jato";

  // Monta link oficial do WhatsApp com a mensagem pronta
  const message = `👋 Olá, *${config.nome}*!\n\n` +
    `Acabei de fazer um agendamento pelo site:\n` +
    `🔖 *Código:* ${appointment.id}\n` +
    `👤 *Cliente:* ${appointment.clientName}\n` +
    `📱 *WhatsApp:* ${appointment.whatsapp}\n` +
    `🚗 *Veículo:* ${appointment.vehicleModel} (${appointment.plate})\n` +
    `📦 *Serviço:* ${appointment.serviceName}\n` +
    `➕ *Adicionais:* ${addonsText}\n` +
    `📅 *Data & Horário:* ${formattedDate} às ${appointment.time}h\n` +
    `📍 *Unidade:* ${config.endereco} - ${config.cidade}\n` +
    `🚗 *Modalidade:* ${appointment.deliveryType === "leva_e_traz" ? "Leva e Traz Solicitado" : "Cliente Leva ao Lava Jato"}\n` +
    `💰 *Valor Estimado:* R$ ${appointment.totalPrice},00\n\n` +
    `Por favor, confirmem o meu agendamento! Obrigado.`;

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${config.telefoneWhatsApp}?text=${encodedMsg}`;

  const waBtn = document.getElementById("modal-whatsapp-btn");
  if (waBtn) {
    waBtn.href = waUrl;
  }

  // Prepara botão de impressão
  const printBtn = document.getElementById("modal-print-btn");
  if (printBtn) {
    printBtn.onclick = () => window.print();
  }

  modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function closeSuccessModal() {
  const modal = document.getElementById("success-modal");
  if (modal) modal.classList.add("hidden");

  // Reseta wizard para o passo 1
  goToStep(1);
  appState.addons = [];
  appState.time = null;
  appState.customer = { name: "", phone: "", model: "", plate: "", notes: "" };

  const form = document.getElementById("booking-form");
  if (form) form.reset();

  renderServices();
  renderAddons();
  renderTimeSlots();
  updateSummary();
}

// Modal de Rastreamento / Consulta de Agendamento
function initTrackingModal() {
  const trackBtn = document.getElementById("nav-track-btn");
  const modal = document.getElementById("track-modal");
  const searchBtn = document.getElementById("track-search-btn");
  const searchInput = document.getElementById("track-search-input");
  const resultContainer = document.getElementById("track-result-container");

  if (trackBtn && modal) {
    trackBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      if (searchInput) searchInput.focus();
    });
  }

  const closeModal = () => {
    if (modal) modal.classList.add("hidden");
  };

  document.querySelectorAll(".close-track-modal").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  if (searchBtn && searchInput && resultContainer) {
    const doSearch = () => {
      const query = searchInput.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (!query) {
        showToast("Digite algo", "Informe a placa, código ou telefone do agendamento.", "warning");
        return;
      }

      const appointments = StorageManager.getAppointments();
      const results = appointments.filter(a => {
        const p = a.plate ? a.plate.replace(/[^A-Z0-9]/g, "") : "";
        const w = a.whatsapp ? a.whatsapp.replace(/\D/g, "") : "";
        const id = a.id ? a.id.replace(/[^A-Z0-9]/g, "") : "";
        return p.includes(query) || w.includes(query) || id.includes(query);
      });

      if (results.length === 0) {
        resultContainer.innerHTML = `
          <div class="text-center py-8">
            <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
              <i data-lucide="search-x" class="w-6 h-6"></i>
            </div>
            <p class="text-slate-300 font-semibold">Nenhum agendamento encontrado</p>
            <p class="text-xs text-slate-500 mt-1">Verifique se digitou a placa ou telefone corretamente.</p>
          </div>
        `;
      } else {
        resultContainer.innerHTML = results.map(item => {
          let badgeClass = "status-badge-pendente";
          if (item.status === "Confirmado") badgeClass = "status-badge-confirmado";
          if (item.status === "Em Andamento") badgeClass = "status-badge-andamento";
          if (item.status === "Concluído") badgeClass = "status-badge-concluido";
          if (item.status === "Cancelado") badgeClass = "status-badge-cancelado";

          const [year, month, day] = item.date.split("-");

          return `
            <div class="glass-card rounded-xl p-4 border border-slate-700/80 mb-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-cyan-400">#${item.id}</span>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}">${item.status}</span>
              </div>
              <h5 class="text-white font-bold text-sm">${item.vehicleModel} • <span class="text-cyan-300">${item.plate}</span></h5>
              <p class="text-xs text-slate-400 mt-1">${item.serviceName}</p>
              <div class="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span><i data-lucide="calendar" class="w-3.5 h-3.5 inline mr-1 text-cyan-400"></i> ${day}/${month}/${year} às ${item.time}h</span>
                <span class="font-bold text-white">R$ ${item.totalPrice},00</span>
              </div>
            </div>
          `;
        }).join("");
      }

      if (window.lucide) window.lucide.createIcons();
    };

    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }
}

// Toast Notifications
function showToast(title, message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  
  let borderColor = "border-cyan-500/40";
  let iconName = "info";
  let iconColor = "text-cyan-400";

  if (type === "warning") {
    borderColor = "border-amber-500/40";
    iconName = "alert-triangle";
    iconColor = "text-amber-400";
  } else if (type === "success") {
    borderColor = "border-emerald-500/40";
    iconName = "check-circle";
    iconColor = "text-emerald-400";
  }

  toast.className = `toast glass-panel rounded-xl p-4 border ${borderColor} flex items-start gap-3 w-80`;
  toast.innerHTML = `
    <div class="${iconColor} shrink-0 mt-0.5">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <h5 class="text-xs font-bold text-white uppercase tracking-wider">${title}</h5>
      <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${message}</p>
    </div>
    <button type="button" class="text-slate-500 hover:text-white" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// Scroll Suave
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
