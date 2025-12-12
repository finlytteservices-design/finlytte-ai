 export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const symbol = url.searchParams.get("symbol") || "";

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "No symbol provided" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Example dummy response (replace with actual analysis logic)
    const result = {
      symbol,
      analysis: "This is a Cloudflare Pages Function test response."
    };

    return new Response(
      JSON.stringify(result),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
