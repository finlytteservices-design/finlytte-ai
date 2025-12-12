export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const symbol = url.searchParams.get("symbol") || "";

      if (!symbol) {
        return new Response(
          JSON.stringify({ error: "No symbol provided" }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      const result = {
        symbol,
        analysis: "This is a functional Cloudflare test response."
      };

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
