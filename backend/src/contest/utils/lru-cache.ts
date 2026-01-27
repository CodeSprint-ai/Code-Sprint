interface CacheEntry<T> {
    value: T;
    timestamp: number;
    ttl: number;
}

export class LRUCache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private readonly maxSize: number;
    private readonly defaultTtl: number;

    constructor(maxSize: number = 100, defaultTtlSeconds: number = 300) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.defaultTtl = defaultTtlSeconds * 1000;
    }

    get(key: string): { value: T; isStale: boolean } | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        const age = now - entry.timestamp;
        const isStale = age > entry.ttl;

        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, entry);

        return { value: entry.value, isStale };
    }

    set(key: string, value: T, ttlSeconds?: number): void {
        // Evict oldest if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: ttlSeconds ? ttlSeconds * 1000 : this.defaultTtl,
        });
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    getAge(key: string): number | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        return Math.floor((Date.now() - entry.timestamp) / 1000);
    }

    size(): number {
        return this.cache.size;
    }
}
