// Dashboard TypeScript Types and Interfaces
// These types correspond to the database schema defined in the migration

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  bio: string | null;
  website: string | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  } | null;
  timezone: string;
  language: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'review' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  budget_allocated: number | null;
  budget_spent: number;
  start_date: string | null;
  end_date: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  service_type: string;
  plan_name: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  billing_cycle: 'monthly' | 'yearly' | 'one-time' | null;
  price: number | null;
  next_renewal: string | null;
  usage_limit: Record<string, unknown> | null;
  current_usage: Record<string, unknown> | null;
  features: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  user_id: string;
  metric_type: 'seo' | 'marketing' | 'website' | 'social' | 'conversion';
  metric_data: Record<string, unknown>;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'billing' | 'project';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string | null;
  action_url: string | null;
  action_label: string | null;
  read: boolean;
  read_at: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  line_items: Record<string, unknown> | null;
  pdf_url: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string | null;
  assigned_to: string | null;
  resolved_at: string | null;
  satisfaction_rating: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  created_at: string;
}

export interface SEOReport {
  id: string;
  user_id: string;
  url: string;
  score: number | null;
  report_data: Record<string, unknown> | null;
  improvements: Record<string, unknown> | null;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form Types for Profile Updates
export interface ProfileUpdateData {
  username?: string;
  full_name?: string;
  phone?: string;
  company?: string;
  role?: string;
  bio?: string;
  website?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  timezone?: string;
  language?: string;
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

// Dashboard Statistics Types
export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };
  notifications: {
    unread: number;
    total: number;
  };
  subscriptions: {
    active: number;
    expiring_soon: number;
  };
  invoices: {
    pending: number;
    overdue: number;
    total_amount: number;
  };
  activity: {
    recent_count: number;
    last_login: string;
  };
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  stats: DashboardStats;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

// Activity Logger Types
export interface ActivityLogData {
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Error Types
export interface DashboardError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Theme and Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebar_collapsed: boolean;
  dashboard_layout: 'grid' | 'list';
  notifications_enabled: boolean;
  email_digest_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string[];
  priority?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
}
