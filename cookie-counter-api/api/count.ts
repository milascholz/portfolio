import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const DEFAULT_COUNTER_KEY = "cookie-clicks";

// Allowlist of valid counter keys — keeps an unauthenticated POST from
// writing arbitrary keys into Redis.
const ALLOWED_COUNTER_KEYS = new Set(["cookie-clicks", "fish-poked"]);

const ALLOWED_ORIGINS = new Set([
  "https://milascholz.github.io",
  "http://localhost:3000",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const keyParam = typeof req.query.key === "string" ? req.query.key : DEFAULT_COUNTER_KEY;
  const counterKey = ALLOWED_COUNTER_KEYS.has(keyParam) ? keyParam : DEFAULT_COUNTER_KEY;

  if (req.method === "POST") {
    const count = await redis.incr(counterKey);
    res.status(200).json({ count });
    return;
  }

  if (req.method === "GET") {
    const count = (await redis.get<number>(counterKey)) ?? 0;
    res.status(200).json({ count });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
