/**
 * LAVERAP - Painel Administrativo / Gestão de Agendamentos
 */

document.addEventListener("DOMContentLoaded", () => {
  initAdminDashboard();
});

let adminCurrentFilter = "all"; // 'all', 'today', 'tomorrow'
let adminStatusFilter = "all";
let adminVehicleFilter = "all";

function initAdminDashboard() {
  const adminBtn = document.getElementById("nav-admin-btn");
  const modal = document.getElementById("admin-modal");

  if (adminBtn && modal) {
    adminBtn.addEventListener("click", () => {
      openAdminModal();
    });
  }

  // Fechar modal
  document.querySelectorAll(".close-admin-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      if (modal) modal.classList.add("hidden");
    });
  });

  // Filtros de Data
  const dateTabs = document.querySelectorAll(".admin-date-filter");
  dateTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      dateTabs.forEach(t => t.className = "admin-date-filter px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all");
      e.currentTarget.className = "admin-date-filter px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 font-bold transition-all";
      adminCurrentFilter = e.currentTarget.dataset.filter;
      renderAdminAppointments();
    });
  });

  // Filtro de Status
  const statusSelect = document.getElementById("admin-status-select");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      adminStatusFilter = e.target.value;
      renderAdminAppointments();
    });
  }

  // Filtro de Veículo
  const vehicleSelect = document.getElementById("admin-vehicle-select");
  if (vehicleSelect) {
    vehicleSelect.addEventListener("change", (e) => {
      adminVehicleFilter = e.target.value;
      renderAdminAppointments();
    });
  }

  // Salvar Configurações
  const saveConfigBtn = document.getElementById("admin-save-config-btn");
  if (saveConfigBtn) {
    saveConfigBtn.addEventListener("click", saveAdminConfig);
  }

  // Resetar Demonstração
  const resetDemoBtn = document.getElementById("admin-reset-demo-btn");
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener("click", () => {
      if (confirm("Deseja restaurar os agendamentos de exemplo?")) {
        StorageManager.saveAppointments(INITIAL_APPOINTMENTS);
        renderAdminAppointments();
        updateAdminStats();
        showToast("Sucesso", "Dados de demonstração restaurados com sucesso!", "success");
      }
    });
  }
}

function openAdminModal() {
  const modal = document.getElementById("admin-modal");
  if (!modal) return;

  // Carrega configurações nos campos
  const config = StorageManager.getConfig();
  const inputPhone = document.getElementById("cfg-company-phone");
  const inputDisplayPhone = document.getElementById("cfg-company-display-phone");
  const inputAddress = document.getElementById("cfg-company-address");
  const inputHours = document.getElementById("cfg-company-hours");

  if (inputPhone) inputPhone.value = config.telefoneWhatsApp;
  if (inputDisplayPhone) inputDisplayPhone.value = config.telefoneExibicao;
  if (inputAddress) inputAddress.value = config.endereco;
  if (inputHours) inputHours.value = config.horarioFuncionamento;

  renderAdminAppointments();
  updateAdminStats();

  modal.classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function updateAdminStats() {
  const appointments = StorageManager.getAppointments();
  const todayIso = new Date().toISOString().split("T")[0];

  const todayList = appointments.filter(a => a.date === todayIso && a.status !== "Cancelado");

  // Faturamento previsto para hoje
  const todayRevenue = todayList.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // Total de carros e motos hoje
  const totalCars = todayList.filter(a => a.vehicleType === "car").length;
  const totalMotos = todayList.filter(a => a.vehicleType === "moto").length;

  const elRevenue = document.getElementById("admin-stat-revenue");
  const elTotal = document.getElementById("admin-stat-total");
  const elVehicles = document.getElementById("admin-stat-vehicles");
  const elPending = document.getElementById("admin-stat-pending");

  if (elRevenue) elRevenue.textContent = `R$ ${todayRevenue},00`;
  if (elTotal) elTotal.textContent = `${todayList.length} agendamentos`;
  if (elVehicles) elVehicles.textContent = `${totalCars} Carros • ${totalMotos} Motos`;

  const pendingCount = appointments.filter(a => a.status === "Pendente").length;
  if (elPending) elPending.textContent = `${pendingCount} pendentes`;
}

function renderAdminAppointments() {
  const container = document.getElementById("admin-appointments-table-body");
  if (!container) return;

  const appointments = StorageManager.getAppointments();
  const todayIso = new Date().toISOString().split("T")[0];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().split("T")[0];

  // Aplica filtros
  const filtered = appointments.filter(item => {
    // Filtro de data
    if (adminCurrentFilter === "today" && item.date !== todayIso) return false;
    if (adminCurrentFilter === "tomorrow" && item.date !== tomorrowIso) return false;

    // Filtro de status
    if (adminStatusFilter !== "all" && item.status !== adminStatusFilter) return false;

    // Filtro de veículo
    if (adminVehicleFilter !== "all" && item.vehicleType !== adminVehicleFilter) return false;

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-8 text-slate-500">
          <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
          Nenhum agendamento encontrado com os filtros selecionados.
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const [year, month, day] = item.date.split("-");

    let badgeClass = "status-badge-pendente";
    if (item.status === "Confirmado") badgeClass = "status-badge-confirmado";
    if (item.status === "Em Andamento") badgeClass = "status-badge-andamento";
    if (item.status === "Concluído") badgeClass = "status-badge-concluido";
    if (item.status === "Cancelado") badgeClass = "status-badge-cancelado";

    const isCar = item.vehicleType === "car";
    const vehicleIcon = isCar ? "car" : "bike";

    return `
      <tr class="border-b border-slate-800/80 hover:bg-slate-800/30 transition-all text-xs">
        <td class="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
          #${item.id}
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-white text-sm">${item.clientName}</div>
          <div class="text-slate-400 flex items-center gap-1 mt-0.5">
            <i data-lucide="phone" class="w-3 h-3 text-emerald-400"></i>
            <span>${item.whatsapp}</span>
          </div>
        </td>
        <td class="py-3 px-3">
          <div class="font-semibold text-slate-200 flex items-center gap-1.5">
            <i data-lucide="${vehicleIcon}" class="w-3.5 h-3.5 text-cyan-400"></i>
            ${item.vehicleModel}
          </div>
          <div class="text-slate-400 font-mono mt-0.5">
            <span class="bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700 text-slate-300 font-bold">${item.plate}</span>
            <span class="text-[11px] text-slate-400 ml-1">(${item.categoryName})</span>
          </div>
        </td>
        <td class="py-3 px-3">
          <div class="font-medium text-slate-200">${item.serviceName}</div>
          <div class="text-cyan-400 font-bold mt-0.5">R$ ${item.totalPrice},00</div>
          ${item.deliveryType === "leva_e_traz" ? '<span class="text-[10px] bg-amber-950 text-amber-300 px-1 rounded">Leva e Traz</span>' : ''}
        </td>
        <td class="py-3 px-3 whitespace-nowrap">
          <div class="font-semibold text-slate-300">${day}/${month}/${year}</div>
          <div class="text-slate-400 font-bold flex items-center gap-1 mt-0.5">
            <i data-lucide="clock" class="w-3 h-3 text-cyan-400"></i> ${item.time}h
          </div>
        </td>
        <td class="py-3 px-3">
          <select onchange="updateAppointmentStatus('${item.id}', this.value)"
                  class="rounded-lg text-xs font-bold px-2 py-1 bg-slate-900 border border-slate-700 cursor-pointer ${badgeClass}">
            <option value="Pendente" ${item.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Confirmado" ${item.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="Em Andamento" ${item.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
            <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
            <option value="Cancelado" ${item.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td class="py-3 px-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <!-- Botão WhatsApp com mensagens rápidas -->
            <button onclick="sendQuickClientWhatsApp('${item.id}', 'ready')"
                    title="Avisar que o veículo está PRONTO"
                    class="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="sendQuickClientWhatsApp('${item.id}', 'confirmed')"
                    title="Confirmar Agendamento no WhatsApp"
                    class="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteAppointment('${item.id}')"
                    title="Excluir Agendamento"
                    class="p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-slate-950 transition-all">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

function updateAppointmentStatus(id, newStatus) {
  StorageManager.updateAppointmentStatus(id, newStatus);
  renderAdminAppointments();
  updateAdminStats();
  // Se o usuário estiver na tela de agendamento, atualiza slots ocupados se cancelou
  renderTimeSlots();
  showToast("Status Atualizado", `Agendamento #${id} alterado para "${newStatus}".`, "success");
}

function deleteAppointment(id) {
  if (confirm(`Tem certeza que deseja excluir o agendamento #${id}?`)) {
    const list = StorageManager.getAppointments();
    const updated = list.filter(a => a.id !== id);
    StorageManager.saveAppointments(updated);
    renderAdminAppointments();
    updateAdminStats();
    renderTimeSlots();
    showToast("Excluído", `Agendamento #${id} removido com sucesso.`, "info");
  }
}

// Disparo de mensagem rápida do Lava Jato para o WhatsApp do cliente
function sendQuickClientWhatsApp(id, type) {
  const appointments = StorageManager.getAppointments();
  const item = appointments.find(a => a.id === id);
  if (!item) return;

  const config = StorageManager.getConfig();
  const [year, month, day] = item.date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  let msg = "";
  if (type === "ready") {
    msg = `✨🚗 Olá, *${item.clientName}*!\n\n` +
          `Temos ótimas notícias da equipe *${config.nome}*:\n` +
          `O seu veículo *${item.vehicleModel} (${item.plate})* já está com o serviço de *${item.serviceName}* CONCLUÍDO e pronto para retirada!\n\n` +
          `📍 Nosso endereço: ${config.endereco} - ${config.cidade}\n` +
          `Esperamos você! 🧼🌟`;
  } else if (type === "confirmed") {
    msg = `👋 Olá, *${item.clientName}*!\n\n` +
          `Confirmamos o agendamento do seu veículo na *${config.nome}*:\n` +
          `🔖 Código: *#${item.id}*\n` +
          `🚗 Veículo: *${item.vehicleModel} (${item.plate})*\n` +
          `📅 Data: *${formattedDate}* às *${item.time}h*\n` +
          `💰 Valor Total: *R$ ${item.totalPrice},00*\n\n` +
          `Estamos prontos para deixar seu veículo impecável!`;
  }

  const cleanPhone = item.whatsapp.replace(/\D/g, "");
  const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function saveAdminConfig() {
  const phone = document.getElementById("cfg-company-phone")?.value.trim();
  const displayPhone = document.getElementById("cfg-company-display-phone")?.value.trim();
  const address = document.getElementById("cfg-company-address")?.value.trim();
  const hours = document.getElementById("cfg-company-hours")?.value.trim();

  const current = StorageManager.getConfig();
  const updated = {
    ...current,
    telefoneWhatsApp: phone || current.telefoneWhatsApp,
    telefoneExibicao: displayPhone || current.telefoneExibicao,
    endereco: address || current.endereco,
    horarioFuncionamento: hours || current.horarioFuncionamento
  };

  StorageManager.saveConfig(updated);
  renderCompanyInfo();
  showToast("Configurações Salvas", "Os dados do lava jato foram atualizados!", "success");
}
