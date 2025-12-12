 document.getElementById('yearA').textContent = new Date().getFullYear();

function getQueryParam(name){
  const s = new URLSearchParams(window.location.search);
  return s.get(name);
}

const ticker = (getQueryParam('symbol') || '').toUpperCase();

if(!ticker){
  document.getElementById('loading').textContent = 'No stock symbol provided.';
} else {
  document.getElementById('title').textContent = 'Analysis: ' + ticker;
  fetchAnalysis(ticker);
}

async function fetchAnalysis(ticker){
  const loading = document.getElementById('loading');
  const full = document.getElementById('fullResult');

  loading.textContent = 'Fetching data…';

  try {
    // Call Cloudflare Function
    const res = await fetch(`/api/analyze?symbol=${encodeURIComponent(ticker)}`);

    if (!res.ok) {
      const txt = await res.text();
      loading.textContent = 'Error: ' + res.status + ' ' + txt;
      return;
    }

    const data = await res.json();

    renderFull({
      summary: data.analysis || "No analysis returned."
    });

    loading.style.display = 'none';

  } catch(err){
    loading.textContent = 'Network error: ' + err.message;
  }
}

function renderFull(obj){
  const full = document.getElementById('fullResult');
  full.innerHTML = '';

  const addCard = (title, content) => {
    const c = document.createElement('div');
    c.className = 'card';
    c.style.marginBottom = '12px';
    c.innerHTML =
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<div class="muted">' + escapeHtml(content) + '</div>';
    full.appendChild(c);
  };

  if (obj.summary)
    addCard('Summary', obj.summary);
}

function escapeHtml(s){
  return String(s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));
}
