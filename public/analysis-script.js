 // public/assets/analysis-script.js
document.getElementById('yearA').textContent = new Date().getFullYear();

function getQueryParam(name){
  const s = new URLSearchParams(window.location.search);
  return s.get(name);
}

const symbol = (getQueryParam('symbol') || '').toUpperCase();
const exchange = (getQueryParam('exchange') || 'NSE').toUpperCase();

const titleEl = document.getElementById('title');
const loadingEl = document.getElementById('loading');
const fullEl = document.getElementById('fullResult');

if (!symbol) {
  loadingEl.textContent = 'No stock symbol provided. Use ?symbol=RELIANCE&exchange=NSE';
  titleEl.textContent = 'Analysis';
} else {
  titleEl.textContent = `${symbol} (${exchange}) — Analysis Report`;
  fetchAnalysis(symbol, exchange);
}

async function fetchAnalysis(symbol, exchange){
  loadingEl.textContent = 'Fetching analysis...';

  try {
    // IMPORTANT: path must match your Pages Function location
    const url = `/functions/analyze?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const txt = await res.text();
      loadingEl.textContent = `Error: ${res.status} ${txt}`;
      return;
    }

    const data = await res.json();
    renderReport(data);
    loadingEl.style.display = 'none';

  } catch(err) {
    loadingEl.textContent = 'Network error: ' + err.message;
  }
}

function renderReport(d){
  fullEl.innerHTML = '';

  // Overview
  addSection('Overview', `
    <p><strong>Symbol:</strong> ${escapeHtml(d.symbol)} (${escapeHtml(d.exchange)})</p>
    <p><strong>Industry:</strong> ${escapeHtml(d.industry || '—')}</p>
    <p>${escapeHtml(d.overview || d.summary || '')}</p>
    <p class="muted">Data timestamp: ${escapeHtml(d.timestamp || '')}</p>
  `);

  // Growth & Profitability
  addSection('Growth, Profitability & Future Scope', `
    <p>${escapeHtml(d.growthAndProfitability || 'No growth data available.')}</p>
  `);

  // Price + 52w
  const price = d.price || {};
  addSection('Price & 52-Week Range', `
    <div class="kv">
      <div class="pair"><strong>Last Price</strong>${escapeHtml(price.last || '—')}</div>
      <div class="pair"><strong>Change</strong>${escapeHtml(price.change || '—')}</div>
      <div class="pair"><strong>52-week High</strong>${escapeHtml(price["52wHigh"] || '—')}</div>
      <div class="pair"><strong>52-week Low</strong>${escapeHtml(price["52wLow"] || '—')}</div>
    </div>
  `);

  // Ratio analysis
  const ratios = d.ratios || {};
  const ratioNotes = d.ratioNotes || {};
  let ratiosHtml = '<div class="kv">';
  for (const key of Object.keys(ratios)) {
    ratiosHtml += `<div class="pair"><strong>${escapeHtml(key)}</strong>${escapeHtml(String(ratios[key]))}<div class="muted" style="margin-top:8px">${escapeHtml(ratioNotes[key] || '')}</div></div>`;
  }
  ratiosHtml += '</div>';
  addSection('Ratio Analysis (what numbers imply)', ratiosHtml);

  // Risk meter
  const score = Number(d.riskScore) || 0;
  addSection('Risk Meter', `
    <div class="risk-wrap">
      <div style="width:110px; text-align:center;"><strong>${score}%</strong><div class="muted" style="font-size:12px">Higher = riskier</div></div>
      <div class="risk-bar"><div class="risk-fill" id="riskFill" style="width:${Math.min(100, Math.max(0,score))}%"></div></div>
    </div>
  `);

  // Summary
  addSection('Summary', `<p>${escapeHtml(d.summary || '')}</p>`);
}

function addSection(title, innerHtml){
  const s = document.createElement('div');
  s.className = 'section';
  s.innerHTML = `<h3>${escapeHtml(title)}</h3>${innerHtml}`;
  fullEl.appendChild(s);
}

function escapeHtml(s){
  if (s === undefined || s === null) return '';
  return String(s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}

