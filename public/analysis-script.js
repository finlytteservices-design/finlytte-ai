 // public/analysis-script.js
(function(){
  const qs = new URLSearchParams(window.location.search);
  const symbol = (qs.get('symbol') || '').trim().toUpperCase();
  const exchange = (qs.get('exchange') || 'NSE').toUpperCase();

  const title = document.getElementById('title');
  const meta = document.getElementById('meta');

  if(!symbol){
    title.textContent = 'No symbol provided';
    return;
  }

  title.textContent = `Analysis: ${symbol} (${exchange})`;
  meta.textContent = `Generated: fetching...`;

  const setError = (msg) => {
    const els = ['overviewContent','growthContent','ratiosContent','roiContent','industryContent','riskLabel'];
    els.forEach(id => document.getElementById(id).textContent = 'Error fetching analysis.');
    meta.textContent = `Error: ${msg}`;
  };

  async function fetchAnalysis() {
    try {
      const res = await fetch(`/functions/analyze?symbol=${encodeURIComponent(symbol)}&exchange=${encodeURIComponent(exchange)}`);
      if(!res.ok){
        const t = await res.text();
        throw new Error(`${res.status} ${t}`);
      }
      const data = await res.json();
      renderAll(data);
    } catch(e){
      console.error(e);
      setError(e.message || e);
    }
  }

  function renderAll(data){
    meta.textContent = `As of: ${new Date(data.generatedAt || Date.now()).toLocaleString()}`;

    // Overview
    const ov = data.overview || {};
    document.getElementById('overviewContent').innerHTML =
      `<p><strong>Founded:</strong> ${ov.founded || '—'}</p>
       <p><strong>IPO:</strong> ${ov.ipoYear || '—'}</p>
       <p>${escapeHtml(ov.description || '')}</p>
       ${(ov.notable && ov.notable.length)? `<ul>${ov.notable.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''}`;

    // Growth
    const gr = data.growth || {};
    document.getElementById('growthContent').innerHTML =
      `<p><strong>Recent CAGR:</strong> ${gr.recentCAGR || '—'}</p>
       <p>${escapeHtml(gr.revenueTrend || '')}</p>
       <p>${escapeHtml(gr.futureOutlook || '')}</p>`;

    // Ratios
    const r = data.ratios || {};
    document.getElementById('ratiosContent').innerHTML =
      `<table class="ratios-table">
        <tr><th>Metric</th><th>Value</th><th>Meaning</th></tr>
        <tr><td>ROCE</td><td>${r.ROCE ?? '—'}%</td><td>Measures capital efficiency; higher is better.</td></tr>
        <tr><td>Gross Profit Margin</td><td>${r.GrossProfitMargin ?? '—'}%</td><td>Profitability on core operations.</td></tr>
        <tr><td>ROA</td><td>${r.ROA ?? '—'}%</td><td>Returns on total assets.</td></tr>
        <tr><td>Current Ratio</td><td>${r.CurrentRatio ?? '—'}</td><td>Short-term liquidity (>=1.2 healthy).</td></tr>
        <tr><td>Debt/Equity</td><td>${r.DebtEquity ?? '—'}</td><td>Leverage; lower generally safer.</td></tr>
      </table>`;

    // ROI
    const roi = data.roi || {};
    document.getElementById('roiContent').innerHTML =
      `<p><strong>Trailing 3Y Return:</strong> ${roi.trailing3Y || '—'}</p>
       <p>${escapeHtml(roi.explanation || '')}</p>`;

    // Industry
    const ic = data.industryComparison || [];
    document.getElementById('industryContent').innerHTML =
      `<ul>${ic.map(it => `<li><strong>${escapeHtml(it.name)}</strong> — ${escapeHtml(it.metric)}</li>`).join('')}</ul>`;

    // Risk - animate gauge
    const risk = (typeof data.riskScore === 'number')? data.riskScore : 50;
    drawGauge(risk);
    document.getElementById('riskLabel').textContent = `Risk score: ${risk} / 100`;
  }

  function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#039;"}[c])); }

  // --- Simple canvas gauge (speedometer) ---
  function drawGauge(targetPercent){
    const c = document.getElementById('gauge');
    if(!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    const cx = w/2, cy = h*0.9; // center near bottom
    const radius = Math.min(w*0.4, h*0.75);
    ctx.clearRect(0,0,w,h);

    // ranges background arc
    const start = Math.PI; // left
    const end = 0;         // right
    // draw base gradient arcs for low/med/high
    const drawArc = (s,e, color) => {
      ctx.beginPath();
      ctx.lineWidth = 18;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.arc(cx, cy, radius, s, e, false);
      ctx.stroke();
    };
    drawArc(start, start + (Math.PI*0.33), '#2ecc71'); // low (green)
    drawArc(start + (Math.PI*0.33), start + (Math.PI*0.66), '#f1c40f'); // mid (yellow)
    drawArc(start + (Math.PI*0.66), end, '#e74c3c'); // high (red)

    // ticks and labels
    ctx.fillStyle = '#ddd';
    ctx.font = '12px monospace';
    for(let i=0;i<=10;i++){
      const ang = start - (i*(Math.PI/10));
      const x1 = cx + Math.cos(ang)* (radius - 10);
      const y1 = cy + Math.sin(ang)* (radius - 10);
      const x2 = cx + Math.cos(ang)* (radius + 6);
      const y2 = cy + Math.sin(ang)* (radius + 6);
      ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = '#111'; ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }

    // needle animation
    const targetAngle = Math.PI - (targetPercent/100)*Math.PI;
    let t = 0;
    const duration = 800;
    const startTime = performance.now();
    function animate(now){
      t = Math.min(1, (now - startTime)/duration);
      const ease = (--t)*t*t+1; // ease out
      const angle = Math.PI + (targetAngle - Math.PI) * ease;
      // clear top area for needle
      ctx.clearRect(0,0,w,h*0.8);
      // redraw small inner arc overlay so base arcs stay visible
      // (we can simply re-draw the arcs lightly)
      // draw needle
      const nx = cx + Math.cos(angle) * (radius - 20);
      const ny = cy + Math.sin(angle) * (radius - 20);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      if(ease < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  fetchAnalysis();
})();

