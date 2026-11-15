/**
 * Safe Database Query Wrapper
 * Guarantees that database queries will never hang or block Next.js builds / page rendering.
 * If the database connection is slow, unconfigured, or unreachable, it falls back gracefully
 * within the specified timeout (default 2500ms).
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  timeoutMs = 2500
): Promise<T> {
  try {
    const timeoutPromise = new Promise<T>((resolve) =>
      setTimeout(() => resolve(fallback), timeoutMs)
    )
    const result = await Promise.race([queryFn(), timeoutPromise])
    return (result !== undefined && result !== null) ? result : fallback
  } catch (error) {
    console.warn("safeDbQuery caught error, returning fallback:", error)
    return fallback
  }
}
