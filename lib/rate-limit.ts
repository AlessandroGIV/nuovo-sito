type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()
let callsSinceCleanup = 0

function cleanup() {
  const now = Date.now()
  for (const [k, v] of store) {
    if (now >= v.resetAt) store.delete(k)
  }
}

/**
 * Returns true if the request is allowed, false if it should be rejected (429).
 * @param key      Unique key per client+route, e.g. "airports:1.2.3.4"
 * @param limit    Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  // Periodic cleanup to prevent unbounded Map growth
  if (++callsSinceCleanup >= 500) {
    callsSinceCleanup = 0
    cleanup()
  }

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

export function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  )
}
