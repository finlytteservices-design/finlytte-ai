 export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const symbol = url.searchParams.get("symbol");

    if (!symbol) {
      return new Response(JSON.stringify({ error: "No symbol provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Dummy response
    return new Response(JSON.stringify({
      ok: true,
      ticker: symbol,
      analysis: "Cloudflare Pages Function working perfectly!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
