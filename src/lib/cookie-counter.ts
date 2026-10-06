const COUNTER_API = "https://cookie-counter-api.vercel.app/api/count";

async function fetchCounter(key: string, method: "GET" | "POST"): Promise<number> {
  const res = await fetch(`${COUNTER_API}?key=${encodeURIComponent(key)}`, { method });
  if (!res.ok) throw new Error(`Failed to ${method} counter "${key}": ${res.status}`);
  const data = (await res.json()) as { count: number };
  return data.count;
}

export async function incrementCookieClicks(): Promise<number> {
  return fetchCounter("cookie-clicks", "POST");
}

export async function getFishPoked(): Promise<number> {
  return fetchCounter("fish-poked", "GET");
}

export async function incrementFishPoked(): Promise<number> {
  return fetchCounter("fish-poked", "POST");
}
