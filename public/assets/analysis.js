
document.getElementById('yearA').textContent = new Date().getFullYear();
function getQueryParam(name){
  const s = new URLSearchParams(window.location.search);
  return s.get(name);
}
const symbol = (getQueryParam('symbol') || '').toUpperCase();
if(!symbol){
  document.getElementById('loading').textContent = 'No stock symbol provided.';
} else {
  document.getElementById('title').textContent = 'Analysis: '+symbol;
  fetchAnalysis(symbol);
}

async function fetchAnalysis(stock){
  const loading = document.getElementById('loading');
  const full = document.getElementById('fullResult');
  loading.textContent = 'Contacting AI — this may take a few seconds.';
  try{
    const res = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: stock })
    });
    if(!res.ok){
      const txt = await res.text();
      loading.textContent = 'Error: '+res.status+' '+txt;
      return;
    }
    const data = await res.json();
    let payload = data;
    if(data.choices && data.choices[0] && data.choices[0].message){
      const text = data.choices[0].message.content;
      try{ payload = JSON.parse(text); }catch(e){ payload = { summary: text }; }
    }else if(data.analysis){
      // new safe function returns { analysis: "..." } or structured
      try{
        payload = JSON.parse(data.analysis);
      }catch(e){
        payload = { summary: data.analysis };
      }
    }
    renderFull(payload);
    loading.style.display='none';
  }catch(err){
    loading.textContent = 'Network error: '+err.message;
  }
}

function renderFull(obj){
  const full = document.getElementById('fullResult');
  full.innerHTML = '';
  const addCard = (title, content)=>{
    const c = document.createElement('div');
    c.className='card';
    c.style.marginBottom='12px';
    c.innerHTML = '<h3>'+escapeHtml(title)+'</h3><div class="muted">'+escapeHtml(content)+'</div>';
    full.appendChild(c);
  };
  if(obj.risk_meter) addCard('Risk Meter', obj.risk_meter);
  if(obj.ratios){
    const rcard = document.createElement('div'); rcard.className='card';
    rcard.innerHTML = '<h3>Key Ratios</h3>';
    for(const k in obj.ratios){
      const row = document.createElement('div'); row.className='kv';
      row.innerHTML = '<strong>'+escapeHtml(k)+'</strong><span>'+escapeHtml(String(obj.ratios[k]))+'</span>';
      rcard.appendChild(row);
    }
    full.appendChild(rcard);
  }
  if(obj.profitability) addCard('Profitability', obj.profitability);
  if(obj.yoy) addCard('YoY Growth', obj.yoy);
  if(obj.peer_comparison) addCard('Peer Comparison', obj.peer_comparison);
  if(obj.history) addCard('History', obj.history);
  if(obj.summary) addCard('Summary', obj.summary);
  if(Object.keys(obj).length===0) full.innerHTML = '<div class="muted">No structured data returned. Raw response:<pre>'+escapeHtml(JSON.stringify(obj,null,2))+'</pre></div>';
}

function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
