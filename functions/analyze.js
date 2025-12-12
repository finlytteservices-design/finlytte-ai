 export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json();
    const symbol = body.symbol;

    if (!symbol) {
      return new Response(JSON.stringify({ error: "No symbol provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call Finnhub
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${env.FINNHUB_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Finnhub API failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
