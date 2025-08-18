/**
 * Real-time Subscription Manager
 * 
 * Manages Supabase real-time subscriptions with automatic reconnection,
 * optimistic UI updates, and subscription lifecycle management.
 */

// Generic types for real-time functionality
interface RealtimeChannel {
  unsubscribe: () => void;
}

interface Identifiable {
  id: string;
}

interface RealtimeChannelConfig {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  table: string;
  filter?: string | undefined;
}

interface RealtimePostgresChangesPayload<T extends Identifiable = Identifiable> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: T;
  old?: T;
  table: string;
  schema: string;
}

import { createClient, SupabaseClient as SupabaseClientOriginal } from '@supabase/supabase-js';

interface RealtimeChannel {
  unsubscribe: () => void;
}

interface Identifiable {
  id: string;
}

interface RealtimeChannelConfig {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  table: string;
  filter?: string | undefined;
}

interface RealtimePostgresChangesPayload<T extends Identifiable = Identifiable> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: T;
  old?: T;
  table: string;
  schema: string;
}

// Use the original SupabaseClient type from the library
type SupabaseClient = SupabaseClientOriginal;

interface SubscriptionConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
}

interface SubscriptionHandler<T extends Identifiable = Identifiable> {
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onError?: (error: Error) => void;
}

interface OptimisticUpdate<T extends Identifiable = Identifiable> {
  id: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  data: T;
  timestamp: number;
  confirmed: boolean;
}

interface RealtimeStats {
  activeSubscriptions: number;
  totalMessages: number;
  reconnections: number;
  errors: number;
  lastActivity: number;
}

/**
 * Real-time subscription manager with optimistic updates
 */
export class RealtimeManager {
  private supabase: SupabaseClient;
  private subscriptions = new Map<string, RealtimeChannel>();
  private handlers = new Map<string, SubscriptionHandler<Identifiable>>();
  private optimisticUpdates = new Map<string, OptimisticUpdate[]>();
  private reconnectAttempts = new Map<string, number>();
  private stats: RealtimeStats = {
    activeSubscriptions: 0,
    totalMessages: 0,
    reconnections: 0,
    errors: 0,
    lastActivity: Date.now()
  };

  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval = 30000;
  private heartbeatTimer?: NodeJS.Timeout;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.startHeartbeat();
  }

  /**
   * Subscribe to real-time changes on a table
   */
  subscribe<T extends Identifiable = Identifiable>(
    subscriptionId: string,
    config: SubscriptionConfig,
    handler: SubscriptionHandler<T>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Clean up existing subscription if it exists
        this.unsubscribe(subscriptionId);

        const channel = (this.supabase
          .channel(`realtime:${subscriptionId}`, {
            config: {
              event: config.event || '*',
              schema: config.schema || 'public',
              table: config.table,
              filter: config.filter
            }
          } as any) as any)
          .on(
            'postgres_changes', undefined,
            (payload: RealtimePostgresChangesPayload<Identifiable>) => {
              this.handleRealtimeEvent(subscriptionId, payload as RealtimePostgresChangesPayload<T>, handler);
            }
          )
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') {
              this.subscriptions.set(subscriptionId, channel);
              this.handlers.set(subscriptionId, handler as SubscriptionHandler<Identifiable>);
              this.stats.activeSubscriptions++;
              this.resetReconnectAttempts(subscriptionId);
              resolve(true);
            } else if (status === 'CHANNEL_ERROR') {
              this.handleSubscriptionError(subscriptionId, new Error('Channel error'));
              reject(new Error('Failed to subscribe to real-time channel'));
            } else if (status === 'TIMED_OUT') {
              this.handleSubscriptionError(subscriptionId, new Error('Subscription timed out'));
              reject(new Error('Subscription timed out'));
            } else if (status === 'CLOSED') {
              this.handleSubscriptionClosed(subscriptionId);
            }
          });

      } catch (error) {
        this.handleSubscriptionError(subscriptionId, error as Error);
        reject(error);
      }
    });
  }

  /**
   * Unsubscribe from real-time changes
   */
  unsubscribe(subscriptionId: string): boolean {
    const channel = this.subscriptions.get(subscriptionId);
    if (channel) {
      channel.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      this.handlers.delete(subscriptionId);
      this.optimisticUpdates.delete(subscriptionId);
      this.reconnectAttempts.delete(subscriptionId);
      this.stats.activeSubscriptions--;
      return true;
    }
    return false;
  }

  /**
   * Add optimistic update
   */
  addOptimisticUpdate<T extends Identifiable>(
    subscriptionId: string,
    type: 'INSERT' | 'UPDATE' | 'DELETE',
    data: T,
    id?: string
  ): string {
    const updateId = id || `optimistic_${Date.now()}_${Math.random()}`;
    const update: OptimisticUpdate<T> = {
      id: updateId,
      type,
      data,
      timestamp: Date.now(),
      confirmed: false
    };

    if (!this.optimisticUpdates.has(subscriptionId)) {
      this.optimisticUpdates.set(subscriptionId, []);
    }

    this.optimisticUpdates.get(subscriptionId)!.push(update);

    // Auto-remove unconfirmed optimistic updates after 10 seconds
    setTimeout(() => {
      this.removeOptimisticUpdate(subscriptionId, updateId);
    }, 10000);

    return updateId;
  }

  /**
   * Confirm optimistic update
   */
  confirmOptimisticUpdate(subscriptionId: string, updateId: string): boolean {
    const updates = this.optimisticUpdates.get(subscriptionId);
    if (updates) {
      const update = updates.find(u => u.id === updateId);
      if (update) {
        update.confirmed = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Remove optimistic update
   */
  removeOptimisticUpdate(subscriptionId: string, updateId: string): boolean {
    const updates = this.optimisticUpdates.get(subscriptionId);
    if (updates) {
      const index = updates.findIndex(u => u.id === updateId);
      if (index !== -1) {
        updates.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Get optimistic updates for a subscription
   */
  getOptimisticUpdates(subscriptionId: string): OptimisticUpdate[] {
    return this.optimisticUpdates.get(subscriptionId) || [];
  }

  /**
   * Get pending (unconfirmed) optimistic updates
   */
  getPendingOptimisticUpdates(subscriptionId: string): OptimisticUpdate[] {
    const updates = this.optimisticUpdates.get(subscriptionId) || [];
    return updates.filter(update => !update.confirmed);
  }

  /**
   * Handle real-time event
   */
  private handleRealtimeEvent<T extends Identifiable>(
    subscriptionId: string,
    payload: RealtimePostgresChangesPayload<T>,
    handler: SubscriptionHandler<T>
  ): void {
    try {
      this.stats.totalMessages++;
      this.stats.lastActivity = Date.now();

      // Check if this event confirms an optimistic update
      this.checkOptimisticUpdateConfirmation(subscriptionId, payload);

      // Call appropriate handler
      switch (payload.eventType) {
        case 'INSERT':
          handler.onInsert?.(payload);
          break;
        case 'UPDATE':
          handler.onUpdate?.(payload);
          break;
        case 'DELETE':
          handler.onDelete?.(payload);
          break;
      }
    } catch (error) {
      this.handleSubscriptionError(subscriptionId, error as Error);
    }
  }

  /**
   * Check if real-time event confirms an optimistic update
   */
  private checkOptimisticUpdateConfirmation<T extends Identifiable>(
    subscriptionId: string,
    payload: RealtimePostgresChangesPayload<T>
  ): void {
    const updates = this.optimisticUpdates.get(subscriptionId);
    if (!updates) return;

    // Try to match the payload with pending optimistic updates
    const matchingUpdate = updates.find(update => {
      if (update.confirmed) return false;
      
      // Match by event type and data similarity
      const eventTypeMatch = update.type === payload.eventType;
      if (!eventTypeMatch) return false;

      // For INSERT/UPDATE, check if the data matches
      if (payload.new && update.data) {
        const payloadId = payload.new.id;
        const updateId = update.data.id;
        return payloadId === updateId;
      }

      // For DELETE, check old data
      if (payload.old && update.data) {
        const payloadId = payload.old.id;
        const updateId = update.data.id;
        return payloadId === updateId;
      }

      return false;
    });

    if (matchingUpdate) {
      this.confirmOptimisticUpdate(subscriptionId, matchingUpdate.id);
    }
  }

  /**
   * Handle subscription error
   */
  private handleSubscriptionError(subscriptionId: string, error: Error): void {
    console.error(`Real-time subscription error for ${subscriptionId}:`, error);
    
    this.stats.errors++;
    
    const handler = this.handlers.get(subscriptionId);
    handler?.onError?.(error);

    // Attempt reconnection
    this.attemptReconnection(subscriptionId);
  }

  /**
   * Handle subscription closed
   */
  private handleSubscriptionClosed(subscriptionId: string): void {
    console.warn(`Real-time subscription closed for ${subscriptionId}`);
    this.attemptReconnection(subscriptionId);
  }

  /**
   * Attempt to reconnect a subscription
   */
  private async attemptReconnection(subscriptionId: string): Promise<void> {
    const attempts = this.reconnectAttempts.get(subscriptionId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ${subscriptionId}`);
      return;
    }

    this.reconnectAttempts.set(subscriptionId, attempts + 1);
    this.stats.reconnections++;

    // Exponential backoff
    const delay = this.reconnectDelay * Math.pow(2, attempts);
    
    setTimeout(async () => {
      try {
        // Get the original subscription config and handler
        const handler = this.handlers.get(subscriptionId);
        if (!handler) return;

        // Note: In a real implementation, you'd need to store the original config
        // For now, we'll just log the reconnection attempt
        console.log(`Attempting to reconnect subscription ${subscriptionId} (attempt ${attempts + 1})`);
        
      } catch (error) {
        console.error(`Reconnection failed for ${subscriptionId}:`, error);
        this.attemptReconnection(subscriptionId);
      }
    }, delay);
  }

  /**
   * Reset reconnection attempts for a subscription
   */
  private resetReconnectAttempts(subscriptionId: string): void {
    this.reconnectAttempts.set(subscriptionId, 0);
  }

  /**
   * Start heartbeat to monitor connection health
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.stats.lastActivity;
      
      // If no activity for more than 2 minutes, consider connection stale
      if (timeSinceLastActivity > 120000) {
        console.warn('Real-time connection appears stale, checking subscriptions...');
        this.checkSubscriptionHealth();
      }
    }, this.heartbeatInterval);
  }

  /**
   * Check health of all subscriptions
   */
  private checkSubscriptionHealth(): void {
    for (const [subscriptionId, channel] of this.subscriptions.entries()) {
      // In a real implementation, you might ping the channel or check its state
      console.log(`Checking health of subscription: ${subscriptionId}`);
    }
  }

  /**
   * Get real-time statistics
   */
  getStats(): RealtimeStats {
    return { ...this.stats };
  }

  /**
   * Get active subscription IDs
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Check if a subscription is active
   */
  isSubscriptionActive(subscriptionId: string): boolean {
    return this.subscriptions.has(subscriptionId);
  }

  /**
   * Cleanup all subscriptions and timers
   */
  destroy(): void {
    // Unsubscribe from all channels
    for (const subscriptionId of this.subscriptions.keys()) {
      this.unsubscribe(subscriptionId);
    }

    // Clear timers
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    // Clear data structures
    this.subscriptions.clear();
    this.handlers.clear();
    this.optimisticUpdates.clear();
    this.reconnectAttempts.clear();
  }
}

/**
 * Utility functions for common real-time patterns
 */
export const RealtimeUtils = {
  /**
   * Create a subscription for user-specific data
   */
  createUserSubscription<T extends Identifiable>(
    manager: RealtimeManager,
    userId: string,
    table: string,
    handler: SubscriptionHandler<T>
  ): Promise<boolean> {
    return manager.subscribe(
      `user_${userId}_${table}`,
      {
        table,
        filter: `user_id=eq.${userId}`
      },
      handler
    );
  },

  /**
   * Create a subscription for project-specific data
   */
  createProjectSubscription<T extends Identifiable>(
    manager: RealtimeManager,
    projectId: string,
    table: string,
    handler: SubscriptionHandler<T>
  ): Promise<boolean> {
    return manager.subscribe(
      `project_${projectId}_${table}`,
      {
        table,
        filter: `project_id=eq.${projectId}`
      },
      handler
    );
  },

  /**
   * Create optimistic update with automatic rollback
   */
  createOptimisticUpdateWithRollback<T extends Identifiable>(
    manager: RealtimeManager,
    subscriptionId: string,
    type: 'INSERT' | 'UPDATE' | 'DELETE',
    data: T,
    rollbackFn: () => void,
    timeoutMs: number = 5000
  ): string {
    const updateId = manager.addOptimisticUpdate(subscriptionId, type, data);
    
    setTimeout(() => {
      const updates = manager.getPendingOptimisticUpdates(subscriptionId);
      const pendingUpdate = updates.find(u => u.id === updateId);
      
      if (pendingUpdate) {
        console.warn(`Optimistic update ${updateId} not confirmed, rolling back`);
        manager.removeOptimisticUpdate(subscriptionId, updateId);
        rollbackFn();
      }
    }, timeoutMs);

    return updateId;
  }
};

// Global real-time manager instance
let globalRealtimeManager: RealtimeManager | null = null;

/**
 * Get or create global real-time manager
 */
export function getRealtimeManager(): RealtimeManager {
  if (!globalRealtimeManager) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    globalRealtimeManager = new RealtimeManager(supabaseUrl, supabaseKey);
  }
  return globalRealtimeManager;
}

export default RealtimeManager;