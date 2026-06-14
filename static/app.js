/* ============================================================
   GRIDMIND AI — APP.JS
   Agentic Power Grid Intelligence Platform
   ============================================================ */

'use strict';

// ── STATE ─────────────────────────────────────────────────────
const STATE = {
  data: null,
  history: [],
  aiHistory: [],
  charts: {},
  agentStates: ['Monitoring', 'Predicting', 'Diagnosing', 'Autonomous Response Active'],
  agentIdx: 0,
  alertCount: 0,
};

// ── MOCK / FALLBACK DATA ──────────────────────────────────────
const DEFAULT_DATA = {
  avg_voltage: 225, avg_current: 11, power_factor: 0.866,
  efficiency: 97.55, power_loss: 60.5, health_score: 88.3,
  failure_probability: 30, frequency: 49.8,
  demand: 900, generation: 1000, grid_stress: 0,
  grid_utilization: 90, temperature_rise: 25,
  thermal_risk: 'HIGH', root_cause: 'Transformer Overheating',
  recommendation: 'Inspect cooling system and reduce transformer load by 15%.',
  supply_margin: 100, reactive_power: 1526, apparent_power: 3053,
};

// ── DOM HELPERS ───────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const qs = id => document.getElementById(id);

// ── CLOCK ─────────────────────────────────────────────────────
function startClock() {
  const el = qs('nav-clock') || document.querySelector('.nav-clock');
  function tick() {
    if (el) el.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

// ── AGENT STATUS ROTATOR ──────────────────────────────────────
function rotateAgentStatus() {
  setInterval(() => {
    STATE.agentIdx = (STATE.agentIdx + 1) % STATE.agentStates.length;
    const el = document.querySelector('.agent-badge-text');
    if (el) el.textContent = STATE.agentStates[STATE.agentIdx];
  }, 4000);
}

// ── API CALL ──────────────────────────────────────────────────
async function fetchAnalysis(params = {}) {
  showLoader(true);
  try {
    const query = new URLSearchParams(params).toString();
    const url = `/analyze${query ? '?' + query : ''}`;
    const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('Backend unavailable, using demo data:', e.message);
    // Simulate slight variation for demo
    return simulateVariation(DEFAULT_DATA, params);
  } finally {
    showLoader(false);
  }
}

function simulateVariation(base, params = {}) {
  const jitter = v => v * (0.95 + Math.random() * 0.1);
  return {
    avg_voltage: params.voltage || jitter(base.avg_voltage),
    avg_current: params.current || jitter(base.avg_current),
    power_factor: params.pf || Math.min(1, jitter(base.power_factor)),
    efficiency: Math.min(100, jitter(base.efficiency)),
    power_loss: jitter(base.power_loss),
    health_score: Math.min(100, jitter(base.health_score)),
    failure_probability: Math.min(100, jitter(base.failure_probability)),
    frequency: params.frequency || (49.5 + Math.random() * 1),
    demand: params.demand || jitter(base.demand),
    generation: params.generation || jitter(base.generation),
    grid_stress: Math.random() * 40,
    grid_utilization: jitter(base.grid_utilization),
    temperature_rise: jitter(base.temperature_rise),
    thermal_risk: base.thermal_risk,
    root_cause: base.root_cause,
    recommendation: base.recommendation,
    supply_margin: jitter(base.supply_margin),
    reactive_power: jitter(base.reactive_power),
    apparent_power: jitter(base.apparent_power),
  };
}

// ── LOADER ────────────────────────────────────────────────────
function showLoader(show) {
  const el = document.querySelector('.loading-overlay');
  if (el) el.classList.toggle('hidden', !show);
}

// ── KPI CARDS ─────────────────────────────────────────────────
function getKPIStatus(key, val) {
  const rules = {
    efficiency:          v => v >= 95 ? 'green' : v >= 85 ? 'amber' : 'red',
    health_score:        v => v >= 80 ? 'green' : v >= 60 ? 'amber' : 'red',
    failure_probability: v => v < 20 ? 'green' : v < 50 ? 'amber' : 'red',
    power_loss:          v => v < 50 ? 'green' : v < 100 ? 'amber' : 'red',
    frequency:           v => Math.abs(v - 50) < 0.3 ? 'green' : Math.abs(v - 50) < 0.7 ? 'amber' : 'red',
    demand:              () => 'cyan',
    generation:          () => 'cyan',
    grid_utilization:    v => v < 80 ? 'green' : v < 90 ? 'amber' : 'red',
    carbon_intensity: v =>
    v < 300 ? 'green' :
    v < 500 ? 'amber' :
    'red',

    renewable_percentage: v =>
        v > 50 ? 'green' :
        v > 30 ? 'amber' :
        'red',

    sustainability_score: v =>
        v > 70 ? 'green' :
        v > 40 ? 'amber' :
        'red',

    priority_score: v =>
        v < 40 ? 'green' :
        v < 70 ? 'amber' :
        'red',
  };
  return (rules[key] || (() => 'cyan'))(val);
}

function renderKPIs(data) {
  const cards = [
    { key: 'efficiency',          label: 'Grid Efficiency',       icon: '⚡', unit: '%',   val: data.efficiency.toFixed(1) },
    { key: 'health_score',        label: 'Health Score',          icon: '💚', unit: '/100', val: data.health_score.toFixed(1) },
    { key: 'failure_probability', label: 'Failure Probability',   icon: '⚠️', unit: '%',   val: data.failure_probability.toFixed(0) },
    { key: 'power_loss',          label: 'Power Loss',            icon: '🔥', unit: 'kW',  val: data.power_loss.toFixed(1) },
    { key: 'frequency',           label: 'Frequency',             icon: '〰', unit: 'Hz',  val: data.frequency.toFixed(2) },
    { key: 'demand',              label: 'Demand',                icon: '📊', unit: 'kW',  val: Math.round(data.demand) },
    { key: 'generation',          label: 'Generation',            icon: '⚙️', unit: 'kW',  val: Math.round(data.generation) },
    { key: 'grid_utilization',    label: 'Grid Utilization',      icon: '📡', unit: '%',   val: data.grid_utilization.toFixed(1) },
    { 
      key: 'carbon_intensity',
      label: 'Carbon Intensity',
      icon: '🌍',
      unit: ' gCO₂',
      val: data.carbon_intensity
    },

    {
      key: 'renewable_percentage',
      label: 'Renewable Share',
      icon: '☀️',
      unit: '%',
      val: data.renewable_percentage
    },

    {
      key: 'sustainability_score',
      label: 'Sustainability',
      icon: '♻️',
      unit: '/100',
      val: data.sustainability_score.toFixed(1)
    },

    {
      key: 'priority_score',
      label: 'AI Priority',
      icon: '🚨',
      unit: '/100',
      val: data.priority_score
    },
  ];

  const grid = document.querySelector('.kpi-grid');
  if (!grid) return;
  grid.innerHTML = cards.map(c => {
    const status = getKPIStatus(c.key, parseFloat(c.val));
    const change = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 3).toFixed(1) + '%';
    const changeClass = change.startsWith('+') ? 'change-up' : 'change-down';
    return `
      <div class="glass kpi-card status-${status}" data-key="${c.key}">
        <div class="kpi-top">
          <div class="kpi-icon">${c.icon}</div>
          <span class="kpi-change ${changeClass}">${change}</span>
        </div>
        <div class="kpi-value">${c.val}<span class="kpi-unit">${c.unit}</span></div>
        <div class="kpi-label">${c.label}</div>
        <canvas class="kpi-sparkline" id="spark-${c.key}"></canvas>
      </div>`;
  }).join('');

  // Draw sparklines
  cards.forEach(c => {
    const canvas = qs(`spark-${c.key}`);
    if (!canvas) return;
    drawSparkline(canvas, c.key, getKPIStatus(c.key, parseFloat(c.val)));
  });
}

function drawSparkline(canvas, key, status) {
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth || 180;
  const h = 32;
  canvas.width = w;
  canvas.height = h;

  const colorMap = { green: '#00e5a0', amber: '#ffb300', red: '#ff3b5c', cyan: '#00c8ff' };
  const color = colorMap[status] || '#00c8ff';

  const pts = Array.from({ length: 20 }, (_, i) => {
    const base = STATE.history.length > 1
      ? (STATE.history.map(d => d[key] || 0).slice(-20)[i] || 50)
      : 50 + Math.sin(i * 0.5) * 15 + Math.random() * 10;
    return base;
  });

  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const norm = pts.map(v => 1 - (v - min) / range);

  ctx.clearRect(0, 0, w, h);

  // Fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  ctx.moveTo(0, norm[0] * h);
  pts.forEach((_, i) => {
    if (i === 0) return;
    const x = (i / (pts.length - 1)) * w;
    ctx.lineTo(x, norm[i] * h);
  });
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((_, i) => {
    const x = (i / (pts.length - 1)) * w;
    if (i === 0) ctx.moveTo(x, norm[i] * h);
    else ctx.lineTo(x, norm[i] * h);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// ── DIGITAL TWIN ──────────────────────────────────────────────
function renderDigitalTwin(data) {
  let transformerStatus = "normal";

if(data.alert_level === "CRITICAL"){
    transformerStatus = "fault";
}
else if(data.alert_level === "WARNING"){
    transformerStatus = "warning";
}
else if(data.thermal_risk === "HIGH"){
    transformerStatus = "fault";
}
else if(data.thermal_risk === "MEDIUM"){
    transformerStatus = "warning";
}
  const iHighUtil = data.grid_utilization > 88;

let generatorStatus = "normal";

if(data.alert_level === "CRITICAL"){
    generatorStatus = "fault";
}
else if(data.alert_level === "WARNING"){
    generatorStatus = "warning";
}
else if(data.supply_margin < 0){
    generatorStatus = "fault";
}
else if(data.supply_margin < 50){
    generatorStatus = "warning";
}

let transmissionStatus = "normal";

if(data.power_loss > 100){
    transmissionStatus = "fault";
}
else if(data.power_loss > 50){
    transmissionStatus = "warning";
}

let substationStatus = "normal";

if(data.alert_level === "CRITICAL"){
    substationStatus = "fault";
}
else if(data.alert_level === "WARNING"){
    substationStatus = "warning";
}
else if(data.grid_stress > 70){
    substationStatus = "fault";
}
else if(data.grid_stress > 40){
    substationStatus = "warning";
}

  const nodes = [
    {
      id: 'generator', emoji: '🏭', name: 'Generator',
      status: generatorStatus,

health:
    data.supply_margin < 0
    ? "50%"
    : data.supply_margin < 50
    ? "75%"
    : "98%", load: `${Math.round(data.generation)} kW`, temp: '42°C',
    },
    {
      id: 'transformer', emoji: '⚡', name: 'Transformer',
      status: transformerStatus,

health:
    data.thermal_risk === "HIGH"
    ? "62%"
    : data.thermal_risk === "MEDIUM"
    ? "80%"
    : "95%",
      load: `${Math.round(data.apparent_power / 10)} kVA`,
      temp: `${Math.round(40 + data.temperature_rise)}°C`,
    },
    {
      id: 'transmission', emoji: '🗼', name: 'Transmission',
      status: transmissionStatus,

health:
    data.power_loss > 100
    ? "55%"
    : data.power_loss > 50
    ? "75%"
    : "95%",
      load: `${data.grid_utilization.toFixed(0)}%`,
      temp: `${Math.round(35 + data.temperature_rise * 0.5)}°C`,
    },
    {
      id: 'substation', emoji: '🔌', name: 'Substation',
      status: substationStatus,

health:
    data.grid_stress > 70
    ? "60%"
    : data.grid_stress > 40
    ? "80%"
    : "95%",
      load: `${data.avg_voltage.toFixed(0)} V`,
      temp: '38°C',
    },
    {
      id: 'consumer', emoji: '🏙', name: 'Consumer Load',
      status: 'normal', health: '100%',
      load: `${Math.round(data.demand)} kW`,
      temp: '—',
    },
  ];

  const container = document.querySelector('.twin-canvas');
  if (!container) return;

  container.innerHTML = nodes.map((node, i) => {
    const tagClass = `tag-${node.status}`;
    const tagLabel = node.status === 'fault' ? 'FAULT' : node.status === 'warning' ? 'WARN' : 'OK';
    const connector = i < nodes.length - 1 ? `
      <div class="twin-connector">
        <div class="flow-line"><div class="flow-particle" style="animation-delay:${i * 0.4}s"></div></div>
      </div>` : '';

    return `
      <div class="twin-node">
        <div class="twin-body node-${node.status}" title="${node.name}">
          <span class="twin-emoji">${node.emoji}</span>
          <span class="twin-status-tag ${tagClass}">${tagLabel}</span>
        </div>
        <div class="twin-node-name">${node.name}</div>
        <div class="twin-meta">
          ❤ ${node.health}<br>
          ⚡ ${node.load}<br>
          🌡 ${node.temp}
        </div>
      </div>
      ${connector}`;
  }).join('');
}

// ── CHARTS ────────────────────────────────────────────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#6a8a9e',
        font: { family: 'JetBrains Mono', size: 10 },
        boxWidth: 12,
        padding: 12,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(11,22,39,0.95)',
      borderColor: 'rgba(0,200,255,0.2)',
      borderWidth: 1,
      titleColor: '#00c8ff',
      bodyColor: '#c8dce8',
      titleFont: { family: 'JetBrains Mono', size: 10 },
      bodyFont: { family: 'JetBrains Mono', size: 10 },
    }
  },
  scales: {
    x: {
      ticks: { color: '#4a6a7e', font: { family: 'JetBrains Mono', size: 9 } },
      grid: { color: 'rgba(0,200,255,0.05)' },
    },
    y: {
      ticks: { color: '#4a6a7e', font: { family: 'JetBrains Mono', size: 9 } },
      grid: { color: 'rgba(0,200,255,0.05)' },
    }
  }
};

function destroyChart(key) {
  if (STATE.charts[key]) { STATE.charts[key].destroy(); delete STATE.charts[key]; }
}

function renderCharts(data) {
  // Chart 1: Power Flow Analysis (Bar)
  destroyChart('powerFlow');
  const c1 = qs('chart-power-flow');
  if (c1) {
    STATE.charts.powerFlow = new Chart(c1, {
      type: 'bar',
      data: {
        labels: ['Input Power', 'Output Power', 'Reactive Power', 'Transmission Loss'],
        datasets: [{
          data: [data.apparent_power, data.apparent_power - data.power_loss, data.reactive_power, data.power_loss],
          backgroundColor: ['rgba(0,200,255,0.6)', 'rgba(0,229,160,0.6)', 'rgba(124,92,252,0.6)', 'rgba(255,59,92,0.6)'],
          borderColor: ['#00c8ff', '#00e5a0', '#7c5cfc', '#ff3b5c'],
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
    });
  }

  // Chart 2: Voltage & Current (Grouped Bar)
  destroyChart('voltCurr');
  const c2 = qs('chart-volt-curr');
  if (c2) {
    STATE.charts.voltCurr = new Chart(c2, {
      type: 'bar',
      data: {
        labels: ['Voltage (V)', 'Current (A)', 'Vrms', 'Irms'],
        datasets: [{
          label: 'Measured',
          data: [data.avg_voltage, data.avg_current, data.avg_voltage * 0.98, data.avg_current * 0.97],
          backgroundColor: 'rgba(0,102,255,0.6)',
          borderColor: '#0066ff', borderWidth: 1, borderRadius: 4,
        }, {
          label: 'Rated',
          data: [230, 12, 230, 12],
          backgroundColor: 'rgba(0,200,255,0.25)',
          borderColor: '#00c8ff', borderWidth: 1, borderRadius: 4,
        }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Chart 3: Grid Utilization (Line)
  destroyChart('gridUtil');
  const c3 = qs('chart-grid-util');
  if (c3) {
    const labels = STATE.history.length > 1
      ? STATE.history.map((_, i) => `T-${STATE.history.length - i}`)
      : Array.from({ length: 10 }, (_, i) => `T-${10 - i}`);
    const getHist = key => STATE.history.length > 1
      ? STATE.history.map(d => d[key] || 0)
      : Array.from({ length: 10 }, (_, i) => data[key] * (0.92 + Math.sin(i) * 0.05));

    STATE.charts.gridUtil = new Chart(c3, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Demand', data: getHist('demand'), borderColor: '#00c8ff', backgroundColor: 'rgba(0,200,255,0.08)', tension: .4, fill: true, pointRadius: 2 },
          { label: 'Generation', data: getHist('generation'), borderColor: '#00e5a0', backgroundColor: 'rgba(0,229,160,0.08)', tension: .4, fill: true, pointRadius: 2 },
          { label: 'Supply Margin', data: getHist('supply_margin'), borderColor: '#ffb300', backgroundColor: 'transparent', tension: .4, borderDash: [4, 3], pointRadius: 2 },
        ]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Chart 4: Grid Health Trend
  destroyChart('healthTrend');
  const c4 = qs('chart-health-trend');
  if (c4) {
    const labels = STATE.history.length > 1
      ? STATE.history.map((_, i) => `R${i + 1}`)
      : Array.from({ length: 12 }, (_, i) => `R${i + 1}`);
    const getHist2 = key => STATE.history.length > 1
      ? STATE.history.map(d => d[key] || 0)
      : Array.from({ length: 12 }, (_, i) => data[key] * (0.9 + Math.cos(i * 0.5) * 0.08));

    STATE.charts.healthTrend = new Chart(c4, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Health Score', data: getHist2('health_score'), borderColor: '#00e5a0', backgroundColor: 'rgba(0,229,160,0.1)', tension: .4, fill: true, pointRadius: 2 },
          { label: 'Failure Prob %', data: getHist2('failure_probability'), borderColor: '#ff3b5c', backgroundColor: 'rgba(255,59,92,0.08)', tension: .4, fill: true, pointRadius: 2 },
          { label: 'Efficiency %', data: getHist2('efficiency'), borderColor: '#00c8ff', backgroundColor: 'transparent', tension: .4, pointRadius: 2 },
        ]
      },
      options: { ...CHART_DEFAULTS }
    });
  }
}

// ── AI COMMAND CENTER ─────────────────────────────────────────
let typeTimeout = null;

function typeText(el, text, speed = 28) {
  if (!el) return;
  if (typeTimeout) clearTimeout(typeTimeout);
  el.innerHTML = '';
  let i = 0;
  function step() {
    if (i < text.length) {
      el.innerHTML = text.slice(0, ++i) + '<span class="typing-cursor"></span>';
      typeTimeout = setTimeout(step, speed);
    } else {
      el.innerHTML = text;
    }
  }
  step();
}

function getRiskLevel(data) {
  if (data.failure_probability > 50 || data.thermal_risk === 'HIGH') return 'HIGH';
  if (data.failure_probability > 25 || data.grid_utilization > 85) return 'MEDIUM';
  return 'LOW';
}

function renderAICenter(data) {
  const risk = getRiskLevel(data);
  const statusBanner =
document.getElementById("ai-system-status");

if(statusBanner){

    if(data.alert_level === "CRITICAL"){

        statusBanner.textContent =
        "🔴 CRITICAL GRID CONDITION";

        statusBanner.style.border =
        "2px solid #ff3b5c";

    }

    else if(data.alert_level === "WARNING"){

        statusBanner.textContent =
        "🟡 OPERATIONAL WARNING";

        statusBanner.style.border =
        "2px solid #ffb300";

    }

    else{

        statusBanner.textContent =
        "🟢 GRID STABLE";

        statusBanner.style.border =
        "2px solid #00e5a0";

    }
}
  let confidence = 95;

if(data.failure_probability > 20){
    confidence = 90;
}

if(data.failure_probability > 40){
    confidence = 85;
}

if(data.failure_probability > 60){
    confidence = 80;
}

if(data.failure_probability > 20){
    confidence = 90;
}

if(data.failure_probability > 40){
    confidence = 85;
}

if(data.failure_probability > 60){
    confidence = 80;
}
  const riskClass = risk === 'HIGH' ? 'risk-high' : risk === 'MEDIUM' ? 'risk-medium' : 'risk-low';

  const diagEl = document.querySelector('.ai-diagnosis-text');
  let rootCause = "System operating normally.";

if(data.thermal_risk === "HIGH"){
    rootCause =
    "Transformer overheating detected. Temperature exceeds safe operating limits.";
}
else if(data.failure_probability > 25){
    rootCause =
    "Elevated failure probability detected. Preventive maintenance advised.";
}
else if(data.power_loss > 50){
    rootCause =
    "High transmission losses detected across the grid.";
}

if(data.thermal_risk === "HIGH"){
    rootCause =
    "Transformer overheating detected. Temperature exceeds safe operating limits.";
}
else if(data.failure_probability > 25){
    rootCause =
    "Elevated failure probability detected. Preventive maintenance advised.";
}
else if(data.power_loss > 50){
    rootCause =
    "High transmission losses detected across the grid.";
}
  setTimeout(() => diagEl.textContent = rootCause, 300);

  const confFill = document.querySelector('.ai-confidence-fill');
  if (confFill) {
    confFill.style.width = '0%';
    console.log("ROOT CAUSE =", rootCause);
    setTimeout(() => { confFill.style.width = confidence + '%'; }, 400);
  }
  const confVal = document.querySelector('.ai-conf-value');
  if (confVal) confVal.textContent = confidence + '%';

  const riskEl = document.querySelector('.ai-risk-badge');
  if (riskEl) {
    riskEl.className = `risk-badge ${riskClass}`;
    riskEl.textContent = risk;
  }

  const recEl = document.querySelector('.ai-rec-text');
  if (recEl) {
    setTimeout(() => typeText(recEl, data.recommendation || 'System nominal — continue standard monitoring.', 20), 600);
  }

  // Power factor display
  const pfEl = document.querySelector('.ai-pf-value');
  if (pfEl) pfEl.textContent = data.power_factor.toFixed(3);

  // Thermal Status
const thermalEl =
document.getElementById('ai-thermal-val');

if (thermalEl){
    thermalEl.textContent = data.thermal_risk;
}

// Alert Level
const alertEl =
document.getElementById('ai-alert-level');

if(alertEl){

    let emoji = "🟢";

    if(data.alert_level === "WARNING"){
        emoji = "🟡";
    }

    if(data.alert_level === "CRITICAL"){
        emoji = "🔴";
    }

    alertEl.textContent =
        emoji + " " + data.alert_level;
}

// Sustainability Score
const sustainabilityEl =
document.getElementById('ai-sustainability');

if(sustainabilityEl){
    sustainabilityEl.textContent =
        data.sustainability_score.toFixed(1);
}

// Carbon Intensity
const carbonEl =
document.getElementById('ai-carbon');

if(carbonEl){
    carbonEl.textContent =
        data.carbon_intensity + " gCO₂/kWh";
}

// Renewable Percentage
const renewableEl =
document.getElementById('ai-renewable');

if(renewableEl){
    renewableEl.textContent =
        data.renewable_percentage + "%";
}
}

// ── PREDICTIVE ANALYTICS ──────────────────────────────────────
function renderPredictions(data) {
  const h1Health = data.predicted_health_1h.toFixed(1);

  const h24Health = data.predicted_health_24h.toFixed(1);

  const h1Risk = data.predicted_failure_1h.toFixed(0);

  const h24Risk = data.predicted_failure_24h.toFixed(0);

  const map = {
    'pred-h1-health': h1Health + '%',
    'pred-h24-health': h24Health + '%',
    'pred-h1-risk': h1Risk + '%',
    'pred-h24-risk': h24Risk + '%',
    'pred-stability': data.grid_utilization < 85 ? 'STABLE' : data.grid_utilization < 95 ? 'MARGINAL' : 'UNSTABLE',
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = qs(id);
    if (el) el.textContent = val;
  });

  // Stability color
  const stabEl = qs('pred-stability');
  if (stabEl) {
    stabEl.className = `forecast-val ${
      stabEl.textContent === 'STABLE' ? 'text-green' :
      stabEl.textContent === 'MARGINAL' ? 'text-amber' : 'text-red'
    } font-mono`;
  }

  renderMiniGauge('gauge-h1-risk', parseFloat(h1Risk), 100);
  renderMiniGauge('gauge-h24-risk', parseFloat(h24Risk), 100);
}

function renderMiniGauge(id, value, max) {
  const canvas = qs(id);
  if (!canvas) return;
  const w = 120, h = 80;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const pct = Math.min(value / max, 1);

  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h - 10, r = 55;
  const startAngle = Math.PI, endAngle = Math.PI + pct * Math.PI;

  // BG arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(0,200,255,0.1)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  const color = pct < 0.3 ? '#00e5a0' : pct < 0.6 ? '#ffb300' : '#ff3b5c';
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, startAngle + pct * Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Label
  ctx.fillStyle = color;
  ctx.font = 'bold 16px JetBrains Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(value.toFixed(0) + '%', cx, cy - 12);
}

// ── STRESS GAUGES ─────────────────────────────────────────────
function renderGauges(data) {
  drawRadialGauge('gauge-stress', data.grid_stress, 100, 'Grid Stress', '%');
  drawRadialGauge('gauge-pf', data.power_factor * 100, 100, 'Power Factor', '');
  drawRadialGauge('gauge-freq', ((data.frequency - 47) / 6) * 100, 100, 'Freq Stability', 'Hz');
  drawRadialGauge('gauge-thermal', data.thermal_risk === 'HIGH' ? 80 : data.thermal_risk === 'MEDIUM' ? 50 : 20, 100, 'Thermal Risk', '');

  const map2 = {
    'gauge-stress-val': data.grid_stress.toFixed(1) + '%',
    'gauge-pf-val': data.power_factor.toFixed(3),
    'gauge-freq-val': data.frequency.toFixed(2) + ' Hz',
    'gauge-thermal-val': data.thermal_risk,
  };
  Object.entries(map2).forEach(([id, v]) => {
    const el = qs(id);
    if (el) el.textContent = v;
  });
}

function drawRadialGauge(id, value, max, label, unit) {
  const canvas = qs(id);
  if (!canvas) return;
  const size = 130;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2, r = 52;
  const pct = Math.min(value / max, 1);
  const startAngle = -Math.PI * 0.8;
  const totalArc = Math.PI * 1.6;

  ctx.clearRect(0, 0, size, size);

  // Tick marks
  for (let i = 0; i <= 10; i++) {
    const a = startAngle + (i / 10) * totalArc;
    const inner = r - 8, outer = r - 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    ctx.strokeStyle = 'rgba(0,200,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Background arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, startAngle + totalArc);
  ctx.strokeStyle = 'rgba(0,200,255,0.08)';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value arc
  const color = pct < 0.4 ? '#00e5a0' : pct < 0.7 ? '#ffb300' : '#ff3b5c';
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, startAngle + pct * totalArc);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Glow
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, startAngle + pct * totalArc);
    ctx.strokeStyle = color + '40';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Needle dot
  const needleAngle = startAngle + pct * totalArc;
  ctx.beginPath();
  ctx.arc(cx + Math.cos(needleAngle) * r, cy + Math.sin(needleAngle) * r, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── ALERTS ────────────────────────────────────────────────────
function generateAlerts(data) {
  const alerts = [];
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (data.thermal_risk === 'HIGH') {
    alerts.push({ type: 'critical', icon: '🔥', title: data.root_cause || 'Thermal Overload', desc: data.recommendation, time: now, sev: 'CRITICAL' });
  }
  if (data.grid_utilization > 88) {
    alerts.push({ type: 'warning', icon: '📡', title: 'High Grid Utilization', desc: `Grid at ${data.grid_utilization.toFixed(1)}% — approaching capacity limit`, time: now, sev: 'WARNING' });
  }
  if (data.failure_probability > 25) {
    alerts.push({ type: 'warning', icon: '⚠️', title: 'Elevated Failure Probability', desc: `${data.failure_probability.toFixed(0)}% failure risk — schedule preventive maintenance`, time: now, sev: 'WARNING' });
  }
  if (Math.abs(data.frequency - 50) > 0.3) {
    alerts.push({ type: 'warning', icon: '〰', title: 'Frequency Deviation', desc: `Grid frequency at ${data.frequency.toFixed(2)} Hz — nominal is 50.00 Hz`, time: now, sev: 'WARNING' });
  }
  if (data.power_factor < 0.8) {
    alerts.push({ type: 'warning', icon: '📉', title: 'Low Power Factor', desc: `Power factor ${data.power_factor.toFixed(3)} — capacitor banks may need adjustment`, time: now, sev: 'WARNING' });
  }

  if (data.carbon_intensity > 500) {
    alerts.push({
      type: 'warning',
      icon: '🌍',
      title: 'High Carbon Emissions',
      desc: `Carbon intensity is ${data.carbon_intensity} gCO₂/kWh`,
      time: now,
      sev: 'WARNING'
    });
  }

  if (data.renewable_percentage < 30) {
    alerts.push({
      type: 'warning',
      icon: '☀️',
      title: 'Low Renewable Contribution',
      desc: `Renewable share is only ${data.renewable_percentage}%`,
      time: now,
      sev: 'WARNING'
    });
  }

  if (alerts.length === 0) {
    alerts.push({ type: 'info', icon: '✅', title: 'System Operating Normally', desc: 'All parameters within acceptable ranges', time: now, sev: 'INFO' });
  }

  const list = document.querySelector('.alerts-list');
  if (!list) return;
  list.innerHTML = alerts.map(a => `
    <div class="alert-item alert-${a.type}">
      <span class="alert-icon">${a.icon}</span>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-meta">
          <span class="alert-time">${a.time}</span>
          <span class="alert-sev sev-${a.type === 'info' ? 'info' : a.type === 'warning' ? 'warning' : 'critical'}">${a.sev}</span>
        </div>
      </div>
    </div>`).join('');

  // Update notif count
  const badge = document.querySelector('.notif-count');
  const critical = alerts.filter(a => a.type === 'critical' || a.type === 'warning').length;
  if (badge) badge.textContent = critical;
}

// ── SUMMARY BAR ───────────────────────────────────────────────
function renderSummaryBar(data) {
  const bar = document.querySelector('.summary-bar');
  if (!bar) return;
  bar.innerHTML = [
    { lbl: 'Voltage', val: data.avg_voltage.toFixed(0) + ' V' },
    { lbl: 'Current', val: data.avg_current.toFixed(1) + ' A' },
    { lbl: 'PF', val: data.power_factor.toFixed(3) },
    { lbl: 'Apparent', val: Math.round(data.apparent_power) + ' kVA' },
    { lbl: 'Reactive', val: Math.round(data.reactive_power) + ' kVAR' },
    { lbl: 'Supply Margin', val: data.supply_margin.toFixed(0) + ' kW' },
    { lbl: 'Temp Rise', val: data.temperature_rise.toFixed(1) + ' °C' },
  ].map(m => `<div class="mini-metric"><span class="mini-metric-val">${m.val}</span><span class="mini-metric-lbl">${m.lbl}</span></div>`).join('');
}

// ── FULL RENDER ───────────────────────────────────────────────
function renderAll(data) {
  STATE.data = data;
  STATE.aiHistory.unshift({
    time: new Date().toLocaleTimeString(),
    alert: data.alert_level,
    cause: data.root_cause
});

if(STATE.aiHistory.length > 10){
    STATE.aiHistory.pop();
}
  STATE.history.push({ ...data });
  if (STATE.history.length > 20) STATE.history.shift();

  const historyList =
document.getElementById("history-list");

if(historyList){

    historyList.innerHTML =
    STATE.aiHistory.map(item => `
        <div style="margin-bottom:8px;">
            ${item.time}
            |
            ${item.alert}
            |
            ${item.cause}
        </div>
    `).join("");
}

  renderSummaryBar(data);
  renderKPIs(data);
  renderDigitalTwin(data);
  renderCharts(data);
  renderAICenter(data);
  renderPredictions(data);
  renderGauges(data);
  const execAlert =
document.getElementById("exec-alert");

const execRoot =
document.getElementById("exec-root");

const execAction =
document.getElementById("exec-action");

if(execAlert)
    execAlert.innerText =
    "Alert Level: " + data.alert_level;

if(execRoot)
    execRoot.innerText =
    "Root Cause: " + data.root_cause;

if(execAction)
    execAction.innerText =
    "Recommended Action: " +
    data.recommendation;
  generateAlerts(data);
}

// ── INPUT PANEL ───────────────────────────────────────────────
function setupInputPanel() {
  const btn = qs('run-analysis-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.textContent = '⟳ ANALYZING...';
    btn.disabled = true;

    const params = {};
    ['voltage', 'current', 'pf', 'resistance', 'equip_temp', 'ambient_temp', 'demand', 'generation', 'frequency'].forEach(id => {
      const el = qs('input-' + id);
      if (el && el.value !== '') params[id] = parseFloat(el.value);
    });

    const data = await fetchAnalysis(params);
    renderAll(data);

    btn.textContent = '▶ RUN AI ANALYSIS';
    btn.disabled = false;
  });
}

// ── AUTO REFRESH ──────────────────────────────────────────────
function startAutoRefresh() {
  setInterval(async () => {
    const data = await fetchAnalysis();
    renderAll(data);
  }, 900000);
}

// ── SIDEBAR NAV ───────────────────────────────────────────────
function setupNav() {
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      $$('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.target;
      if (target) {
        const el = qs(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── INIT ──────────────────────────────────────────────────────
async function init() {
  startClock();
  rotateAgentStatus();
  setupNav();
  setupInputPanel();

  await loadGridInfo();

  const data = await fetchAnalysis();
  renderAll(data);

  startAutoRefresh();
}

document.addEventListener('DOMContentLoaded', init);

async function loadGridInfo(){

    const response =
    await fetch("/grid-info");

    const data =
    await response.json();

    document.getElementById("region")
        .innerText =
        "Region: " + data.zone;

    document.getElementById("country")
        .innerText =
        "Country: " + data.country;

    document.getElementById("zone")
        .innerText =
        "Zone Key: " + data.zoneKey;
}
loadGridInfo();
