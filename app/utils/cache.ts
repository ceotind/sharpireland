/**
 * Cache Utility
 * 
 * Provides Redis-like in-memory caching functionality with TTL support,
 * cache invalidation strategies, and performance monitoring.
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  totalSize: number;
}

interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  cleanupInterval?: number;
  enableStats?: boolean;
}

/**
 * In-memory cache implementation with TTL and LRU eviction
 */
export class Cache {
  private cache = new Map<string, CacheItem<unknown>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    totalSize: 0
  };
  
  private maxSize: number;
  private defaultTTL: number;
  private cleanupInterval: number;
  private enableStats: boolean;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute
    this.enableStats = options.enableStats !== false;

    // Start cleanup timer
    this.startCleanup();
  }

  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const itemTTL = ttl || this.defaultTTL;

    // Check if we need to evict items
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      ttl: itemTTL,
      accessCount: 0,
      lastAccessed: now
    });

    if (this.enableStats) {
      this.stats.sets++;
      this.stats.totalSize = this.cache.size;
    }
  }

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      if (this.enableStats) this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    // Check if item has expired
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      if (this.enableStats) {
        this.stats.misses++;
        this.stats.evictions++;
        this.stats.totalSize = this.cache.size;
      }
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = now;

    if (this.enableStats) this.stats.hits++;
    return item.value as T;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      if (this.enableStats) {
        this.stats.evictions++;
        this.stats.totalSize = this.cache.size;
      }
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted && this.enableStats) {
      this.stats.deletes++;
      this.stats.totalSize = this.cache.size;
    }
    return deleted;
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    if (this.enableStats) {
      this.stats.totalSize = 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache hit ratio
   */
  getHitRatio(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }

  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      if (this.enableStats) {
        this.stats.evictions++;
        this.stats.totalSize = this.cache.size;
      }
    }
  }

  /**
   * Start cleanup timer to remove expired items
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Clean up expired items
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      if (this.enableStats) this.stats.evictions++;
    });

    if (this.enableStats && keysToDelete.length > 0) {
      this.stats.totalSize = this.cache.size;
    }
  }

  /**
   * Stop cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Global cache instance
const globalCache = new Cache({
  maxSize: 5000,
  defaultTTL: 300000, // 5 minutes
  cleanupInterval: 60000, // 1 minute
  enableStats: true
});

/**
 * Cache decorator for functions
 */
export function cached(ttl?: number) {
  return function (target: object, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const cacheKey = `${(target as Record<string, unknown>).constructor.name}.${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cachedResult = globalCache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }

      // Execute method and cache result
      const result = method.apply(this, args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.then((resolvedResult: unknown) => {
          globalCache.set(cacheKey, resolvedResult, ttl);
          return resolvedResult;
        });
      }

      globalCache.set(cacheKey, result, ttl);
      return result;
    };
  };
}

/**
 * Cache invalidation strategies
 */
export class CacheInvalidator {
  /**
   * Invalidate cache entries by pattern
   */
  static invalidateByPattern(pattern: string): number {
    const keys = globalCache.keys();
    const regex = new RegExp(pattern);
    let invalidated = 0;

    keys.forEach(key => {
      if (regex.test(key)) {
        globalCache.delete(key);
        invalidated++;
      }
    });

    return invalidated;
  }

  /**
   * Invalidate cache entries by prefix
   */
  static invalidateByPrefix(prefix: string): number {
    const keys = globalCache.keys();
    let invalidated = 0;

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        globalCache.delete(key);
        invalidated++;
      }
    });

    return invalidated;
  }

  /**
   * Invalidate cache entries by tags
   */
  static invalidateByTags(tags: string[]): number {
    const keys = globalCache.keys();
    let invalidated = 0;

    keys.forEach(key => {
      const hasTag = tags.some(tag => key.includes(`:tag:${tag}`));
      if (hasTag) {
        globalCache.delete(key);
        invalidated++;
      }
    });

    return invalidated;
  }
}

/**
 * Utility functions for common caching patterns
 */
export const CacheUtils = {
  /**
   * Get or set pattern - if key exists return it, otherwise execute function and cache result
   */
  async getOrSet<T>(
    key: string,
    fn: () => Promise<T> | T,
    ttl?: number
  ): Promise<T> {
    const cached = globalCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn();
    globalCache.set(key, result, ttl);
    return result;
  },

  /**
   * Cache with tags for easier invalidation
   */
  setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): void {
    const taggedKey = `${key}:tags:${tags.join(',')}`;
    globalCache.set(taggedKey, value, ttl);
  },

  /**
   * Warm up cache with data
   */
  async warmUp(entries: Array<{ key: string; fn: () => Promise<unknown> | unknown; ttl?: number }>): Promise<void> {
    const promises = entries.map(async ({ key, fn, ttl }) => {
      try {
        const result = await fn();
        globalCache.set(key, result, ttl);
      } catch (error) {
        console.error(`Failed to warm up cache for key ${key}:`, error);
      }
    });

    await Promise.all(promises);
  },

  /**
   * Get cache health metrics
   */
  getHealthMetrics() {
    const stats = globalCache.getStats();
    const hitRatio = globalCache.getHitRatio();
    
    return {
      ...stats,
      hitRatio,
      memoryUsage: process.memoryUsage(),
      cacheSize: globalCache.size(),
      health: hitRatio > 0.8 ? 'good' : hitRatio > 0.6 ? 'fair' : 'poor'
    };
  }
};

// Export the global cache instance
export { globalCache };
export default globalCache;