// HTTP Server
const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle /api/action endpoint
    if (url.pathname === "/api/action") {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        console.log("Request from lit node", body);
        if (body.a === "a" && body.b === "b") {
          return new Response(
            JSON.stringify({ message: "Action processed", data: "true" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          return new Response(
            JSON.stringify({ message: "Action processed", data: "false" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else {
        return new Response("Method not allowed", { status: 405 });
      }
    }

    // 404 for other routes
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);
