// functions/analyze.js

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const symbol = url.searchParams.get("symbol") || "";

    if (!symbol) {
      return new Response(JSON.stringify({ error: "No symbol provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Dummy response (replace later with real OpenAI logic)
    const result = {
      ok: true,
      symbol,
      analysis: "This is a Cloudflare Pages Function test response."
    };

    return new Response(JSON.stringify(result), {
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
