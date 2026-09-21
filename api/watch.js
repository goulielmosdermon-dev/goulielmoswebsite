// Counts completed views per film. POST {film} increments; GET ?key=STATS_KEY returns all counts.
const FILMS = ["day-out", "roses-cigarettes", "last-sunny-day", "collision-course", "help-is-available"];
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(path) {
  const r = await fetch(`${URL_}/${path}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  return (await r.json()).result;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) return res.status(503).json({ error: "storage not connected" });

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    const film = body && body.film;
    if (!FILMS.includes(film)) return res.status(400).json({ error: "unknown film" });
    await redis(`incr/watched:${film}`);
    return res.status(204).end();
  }

  if (req.method === "GET") {
    if (!process.env.STATS_KEY || req.query.key !== process.env.STATS_KEY) return res.status(401).json({ error: "unauthorized" });
    const vals = await redis(`mget/${FILMS.map(f => `watched:${f}`).join("/")}`);
    const counts = {};
    FILMS.forEach((f, i) => (counts[f] = Number(vals[i] || 0)));
    return res.status(200).json(counts);
  }

  res.status(405).end();
};
