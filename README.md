# 🚗🏍️ LAVERAP - Sistema de Agendamento Online para Lava Jato & Estética Automotiva

O **LAVERAP** é um sistema moderno, responsivo e completo de agendamento online desenvolvido especialmente para lava jatos e centros de estética automotiva que atendem tanto **carros** (hatch, sedã, SUV, picapes) quanto **motos** (pequena, média e alta cilindrada).

📍 **Localização Oficial**: **Rua Recife, 1071, Casa 4 - Jardim Bela Vista, Rio das Ostras - RJ**  
📞 **WhatsApp / Contato**: **(22) 99999-8888**

---

## 🌟 Principais Recursos

### 1. 🏎️ Design Visual com Foto Central de Fundo
- Visual automotivo escuro de alto padrão (*Dark Detailing Aesthetic*), com iluminação neon ciano e **foto central de fundo** em alta definição mostrando o processo e brilho de lavagem de carros e motos.
- Máxima legibilidade em qualquer dispositivo (mobile, tablet e desktop) com efeitos de vidro fosco (*glassmorphism*).

### 2. 📲 Agendamento em 3 Etapas Intuitivas (Wizard)
- **Passo 1: Veículo & Serviço**:
  - Seletor rápido de tipo: **Carro** ou **Moto**.
  - Categorias de porte: Hatch/Compacto, Sedã Médio, SUV/Picape Grande, Moto Pequena (até 160cc), Média (250cc-650cc) e Alta Cilindrada (700cc+).
  - Preços dinâmicos recalculados em tempo real de acordo com a categoria selecionada.
  - Opcionais/Adicionais: Cera de carnaúba, limpeza de motor com verniz protetor, cristalização de para-brisa, higienização de couro e combo de desengraxe e lubrificação de corrente de moto com Motul C4.
- **Passo 2: Data & Horário**:
  - Calendário interativo dos próximos 14 dias com identificação de finais de semana.
  - Bloqueio automático de horários já reservados por outros clientes.
  - Opções de atendimento: "Levar ao Lava Jato" ou "Solicitar Leva e Traz em Rio das Ostras".
- **Passo 3: Dados & Finalização**:
  - Nome completo, WhatsApp com máscara automática `(22) 99999-9999`, modelo do veículo e placa no padrão Mercosul ou antigo.
  - Campo de observações especiais.

### 3. 💬 Integração Total com WhatsApp
- Ao confirmar o agendamento, o sistema gera instantaneamente um ticket com ID único (ex: `#LVR-7821`) e um botão que redireciona diretamente para o WhatsApp do lava jato com a mensagem completa formatada com endereço de Rio das Ostras, pronta para envio.
- O cliente também pode imprimir o comprovante de agendamento em papel ou PDF.

### 4. 🔎 Consulta de Agendamento pelo Cliente (Rastreamento)
- O cliente pode pesquisar pela **placa**, **número do WhatsApp** ou **código do pedido** para consultar o status do seu serviço (Pendente, Confirmado, Em Andamento, Concluído).

### 5. 🛡️ Painel do Gestor / Área Administrativa Embutida
- Acessível no cabeçalho ou rodapé pelo botão **"Painel Admin"**.
- Indicadores em tempo real:
  - Faturamento previsto do dia (R$).
  - Quantidade de agendamentos do dia.
  - Proporção de Carros vs Motos atendidos.
  - Total de agendamentos pendentes.
- Filtros rápidos por data (Hoje, Amanhã, Todos) e por status.
- **Disparo de Mensagens Rápidas no WhatsApp do Cliente com 1 Clique**:
  - 🚀 *"Olá [Cliente], seu veículo já está pronto para retirada!"*
  - 📅 *"Confirmamos o seu agendamento para as [Horário]h!"*
- Editor rápido dos dados da empresa (WhatsApp de recebimento, telefone de exibição, endereço e horário de funcionamento).

---

## 🚀 Como Executar o Projeto

Você tem duas formas muito simples de abrir o site:

### Opção 1: Abrir Diretamente no Navegador (Sem Instalação)
Basta clicar duas vezes no arquivo `index.html` ou abri-lo em qualquer navegador (Google Chrome, Microsoft Edge, Firefox, etc.). O sistema funciona de forma 100% autônoma!

### Opção 2: Executar com o Servidor Local Node.js
No terminal, dentro da pasta do projeto (`C:\Users\WESLEY\.gemini\antigravity\scratch\laverap`), execute:

```bash
node server.js
```
ou:
```bash
npm start
```

Em seguida, abra o link no seu navegador:
👉 **http://localhost:3000**

---

## ⚙️ Personalização das Informações e Preços

Todos os dados e preços são fáceis de editar:

1. **Alterar Número do WhatsApp e Dados da Empresa**:
   - Pelo próprio site: clique em **"Painel Admin"** no topo da página e abra a aba de configurações no rodapé do painel.
   - Ou no arquivo [js/data.js](js/data.js) na constante `LAVERAP_CONFIG`.

2. **Alterar Tabela de Preços e Serviços**:
   - Abra o arquivo [js/data.js](js/data.js) e edite os valores na lista `SERVICES` e `ADDONS`.
   - Cada serviço possui uma matriz de preços separada para cada categoria de carro e moto.

---

## 📁 Estrutura de Arquivos

```text
laverap/
├── index.html          # Interface principal do site e formulário de agendamento
├── server.js           # Servidor local Node.js embutido
├── package.json        # Configuração do projeto
├── css/
│   └── styles.css      # Estilos customizados, glassmorphism e animações
├── js/
│   ├── data.js         # Catálogo de serviços, matriz de preços e agendamentos iniciais
│   ├── app.js          # Lógica do wizard, máscaras, WhatsApp e validações
│   └── admin.js        # Painel do gestor, KPIs de faturamento e disparo de mensagens
└── README.md           # Documentação completa do projeto
```
