// functions/analyze.js
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const ticker = (url.searchParams.get('ticker') || '').trim().toUpperCase();

  // Basic validation: allow letters, digits, dot, dash (e.g. RELIANCE.NS)
  if (!/^[A-Z0-9.\-]{1,20}$/.test(ticker)) {
    return new Response(JSON.stringify({ error: 'Invalid ticker format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // 1) Fetch market quote (example using Finnhub)
    const FINNHUB_KEY = env.FINNHUB_API_KEY;
    const quoteResp = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${FINNHUB_KEY}`);
    if (!quoteResp.ok) throw new Error('Market data fetch failed');
    const quote = await quoteResp.json();

    // 2) Build LLM prompt
    const prompt = [
      `You are a helpful financial analyst.`,
      `Provide a concise plain-language analysis (150-220 words) of the stock ticker: ${ticker}.`,
      `Include: (1) short summary, (2) 3 technical observations (price, trend, momentum if clear), (3) 1 fundamental caveat, (4) suggested next steps for a retail investor.`,
      `Latest quote object: ${JSON.stringify(quote)}`
    ].join("\n\n");

    // 3) Call OpenAI (Chat Completion)
    const OPENAI_KEY = env.OPENAI_API_KEY;
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a concise financial analyst.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.2
      })
    });

    if (!openaiResp.ok) {
      const errText = await openaiResp.text();
      throw new Error('LLM error: ' + errText);
    }
    const openaiData = await openaiResp.json();
    const analysis = openaiData.choices?.[0]?.message?.content || '';

    // 4) Return
    return new Response(JSON.stringify({ ticker, quote, analysis }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
