
document.getElementById('year').textContent = new Date().getFullYear();
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const stockInput = document.getElementById('stock');

if(analyzeBtn){
  analyzeBtn.addEventListener('click', ()=>{
    const stock = stockInput.value.trim();
    if(!stock){ alert('Enter a stock symbol (e.g., RELIANCE)'); return; }
    window.location.href = 'analysis.html?symbol='+encodeURIComponent(stock);
  });
}
if(clearBtn){
  clearBtn.addEventListener('click', ()=>{ stockInput.value=''; });
}
