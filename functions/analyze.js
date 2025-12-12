 export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const symbol = url.searchParams.get("symbol");

    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol required" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- NSE + BSE API from Yahoo Finance ---
    const NSE = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.NS`;
    const BSE = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.BO`;

    const [nseData, bseData] = await Promise.all([
      fetch(NSE).then((r) => r.json()),
      fetch(BSE).then((r) => r.json()),
    ]);

    const nse = nseData.quoteResponse?.result?.[0] || null;
    const bse = bseData.quoteResponse?.result?.[0] || null;

    // --- AI Analysis Prompt ---
    const prompt = `
      Give a detailed stock analysis for ${symbol} in this structure:

      1. COMPANY OVERVIEW
      2. GROWTH ANALYSIS
      3. PROFITABILITY
      4. FUTURE SCOPE
      5. PRICE & VALUATION INSIGHTS
      6. RATIO ANALYSIS
      7. RISK METER (Low/Medium/High)

      Make it simple, clear, clean.
      Do not hallucinate exact financial numbers.
      Use qualitative terms like "moderate", "strong", "healthy".
    `;

    const aiResponse = await env.AI.run("@hf/meta-llama/Meta-Llama-3.1-8B-Instruct", {
      messages: [{ role: "user", content: prompt }],
    });

    return new Response(
      JSON.stringify({
        nse,
        bse,
        analysis: aiResponse.response,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};
