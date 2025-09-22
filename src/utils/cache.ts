export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(
    private readonly defaultTtlMs: number,
    private readonly maxEntries: number,
  ) {}

  set(key: string, value: T, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });

    if (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return;
    }
    return entry.value;
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }
}
