// Vercel Serverless Function — proxies requests to the Anthropic API.
// The API key lives only here as an environment variable (ANTHROPIC_API_KEY),
// set in the Vercel dashboard. It is never sent to or exposed in the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is not configured with an API key yet." });
    return;
  }

  try {
    const { prompt, max_tokens } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing 'prompt' in request body." });
      return;
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: max_tokens || 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data?.error?.message || "Upstream error from Anthropic API." });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error while contacting the AI service." });
  }
}
