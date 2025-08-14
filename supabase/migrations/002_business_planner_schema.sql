-- Business Planner Feature Database Schema
-- Migration: 002_business_planner_schema.sql
-- Description: Creates all tables, indexes, and RLS policies for the business planner feature
-- Author: Sharp Ireland Development Team
-- Date: 2025-08-13

-- Enable Row Level Security on all tables
-- This ensures users can only access their own data

-- =============================================================================
-- TABLE: business_planner_profiles
-- Purpose: Stores user onboarding data and business context
-- =============================================================================

CREATE TABLE business_planner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  business_type VARCHAR(255),
  business_stage VARCHAR(50) CHECK (business_stage IN ('idea', 'startup', 'growth', 'established')),
  industry VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE business_planner_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_profiles
CREATE POLICY "Users can view their own profile" ON business_planner_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON business_planner_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON business_planner_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON business_planner_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: business_planner_sessions
-- Purpose: Stores conversation sessions with context from onboarding
-- =============================================================================

CREATE TABLE business_planner_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  context JSONB, -- Stores the 3 initial questions and answers
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_planner_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_sessions
CREATE POLICY "Users can view their own sessions" ON business_planner_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON business_planner_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON business_planner_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON business_planner_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: business_planner_conversations
-- Purpose: Stores individual messages within sessions
-- =============================================================================

CREATE TABLE business_planner_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES business_planner_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0 CHECK (tokens_used >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_planner_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_conversations
CREATE POLICY "Users can view their own conversations" ON business_planner_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON business_planner_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON business_planner_conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON business_planner_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: business_planner_usage
-- Purpose: Tracks user usage limits and subscription status
-- =============================================================================

CREATE TABLE business_planner_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  free_conversations_used INTEGER DEFAULT 0 CHECK (free_conversations_used >= 0),
  paid_conversations_used INTEGER DEFAULT 0 CHECK (paid_conversations_used >= 0),
  total_tokens_used INTEGER DEFAULT 0 CHECK (total_tokens_used >= 0),
  last_reset_date DATE DEFAULT CURRENT_DATE,
  subscription_status VARCHAR(50) DEFAULT 'free' CHECK (subscription_status IN ('free', 'paid', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE business_planner_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_usage
CREATE POLICY "Users can view their own usage" ON business_planner_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON business_planner_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON business_planner_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own usage" ON business_planner_usage
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: business_planner_payments
-- Purpose: Tracks payment records for business planner subscriptions
-- =============================================================================

CREATE TABLE business_planner_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL DEFAULT 5.00 CHECK (amount > 0),
  conversations_purchased INTEGER DEFAULT 50 CHECK (conversations_purchased > 0),
  payment_method VARCHAR(50) DEFAULT 'wire',
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_reference VARCHAR(255),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_planner_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_payments
CREATE POLICY "Users can view their own payments" ON business_planner_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON business_planner_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON business_planner_payments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON business_planner_payments
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- TABLE: business_planner_rate_limits
-- Purpose: Implements rate limiting and tracks suspicious activity
-- =============================================================================

CREATE TABLE business_planner_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  request_count INTEGER DEFAULT 0 CHECK (request_count >= 0),
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  suspicious_activity_count INTEGER DEFAULT 0 CHECK (suspicious_activity_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ip_address)
);

-- Enable RLS
ALTER TABLE business_planner_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_planner_rate_limits
CREATE POLICY "Users can view their own rate limits" ON business_planner_rate_limits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rate limits" ON business_planner_rate_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rate limits" ON business_planner_rate_limits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rate limits" ON business_planner_rate_limits
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- PERFORMANCE INDEXES
-- Purpose: Optimize query performance for common access patterns
-- =============================================================================

-- Index for business_planner_profiles
CREATE INDEX idx_bp_profiles_user_id ON business_planner_profiles(user_id);
CREATE INDEX idx_bp_profiles_onboarding_completed ON business_planner_profiles(onboarding_completed);

-- Index for business_planner_sessions
CREATE INDEX idx_bp_sessions_user_id ON business_planner_sessions(user_id);
CREATE INDEX idx_bp_sessions_status ON business_planner_sessions(status);
CREATE INDEX idx_bp_sessions_created_at ON business_planner_sessions(created_at DESC);

-- Index for business_planner_conversations
CREATE INDEX idx_bp_conversations_session_id ON business_planner_conversations(session_id);
CREATE INDEX idx_bp_conversations_user_id ON business_planner_conversations(user_id);
CREATE INDEX idx_bp_conversations_created_at ON business_planner_conversations(created_at DESC);
CREATE INDEX idx_bp_conversations_role ON business_planner_conversations(role);

-- Index for business_planner_usage
CREATE INDEX idx_bp_usage_user_id ON business_planner_usage(user_id);
CREATE INDEX idx_bp_usage_subscription_status ON business_planner_usage(subscription_status);
CREATE INDEX idx_bp_usage_last_reset_date ON business_planner_usage(last_reset_date);

-- Index for business_planner_payments
CREATE INDEX idx_bp_payments_user_id ON business_planner_payments(user_id);
CREATE INDEX idx_bp_payments_status ON business_planner_payments(payment_status);
CREATE INDEX idx_bp_payments_created_at ON business_planner_payments(created_at DESC);
CREATE INDEX idx_bp_payments_reference ON business_planner_payments(payment_reference);

-- Index for business_planner_rate_limits
CREATE INDEX idx_bp_rate_limits_user_id ON business_planner_rate_limits(user_id);
CREATE INDEX idx_bp_rate_limits_ip_address ON business_planner_rate_limits(ip_address);
CREATE INDEX idx_bp_rate_limits_window_start ON business_planner_rate_limits(window_start);
CREATE INDEX idx_bp_rate_limits_blocked_until ON business_planner_rate_limits(blocked_until);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- Purpose: Automatically update updated_at timestamps
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_bp_profiles_updated_at 
    BEFORE UPDATE ON business_planner_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_sessions_updated_at 
    BEFORE UPDATE ON business_planner_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_usage_updated_at 
    BEFORE UPDATE ON business_planner_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_payments_updated_at 
    BEFORE UPDATE ON business_planner_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_rate_limits_updated_at 
    BEFORE UPDATE ON business_planner_rate_limits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- Purpose: Document table and column purposes for maintainability
-- =============================================================================

-- Table comments
COMMENT ON TABLE business_planner_profiles IS 'Stores user onboarding data and business context for the business planner feature';
COMMENT ON TABLE business_planner_sessions IS 'Stores conversation sessions with context from onboarding questions';
COMMENT ON TABLE business_planner_conversations IS 'Stores individual messages within business planning sessions';
COMMENT ON TABLE business_planner_usage IS 'Tracks user usage limits, token consumption, and subscription status';
COMMENT ON TABLE business_planner_payments IS 'Records payment transactions for business planner subscriptions';
COMMENT ON TABLE business_planner_rate_limits IS 'Implements rate limiting and tracks suspicious activity for security';

-- Column comments for business_planner_profiles
COMMENT ON COLUMN business_planner_profiles.business_stage IS 'Current stage of business: idea, startup, growth, or established';
-- Removed incorrect comment for non-existent column

-- Column comments for business_planner_sessions
COMMENT ON COLUMN business_planner_sessions.context IS 'JSONB field storing the 3 initial onboarding questions and answers';
COMMENT ON COLUMN business_planner_sessions.status IS 'Session status: active, completed, or archived';

-- Column comments for business_planner_conversations
COMMENT ON COLUMN business_planner_conversations.role IS 'Message sender: user or assistant';
COMMENT ON COLUMN business_planner_conversations.tokens_used IS 'Number of OpenAI tokens consumed for this message';

-- Column comments for business_planner_usage
COMMENT ON COLUMN business_planner_usage.free_conversations_used IS 'Number of free conversations used in current period';
COMMENT ON COLUMN business_planner_usage.paid_conversations_used IS 'Number of paid conversations used from purchased credits';
COMMENT ON COLUMN business_planner_usage.subscription_status IS 'Current subscription status: free, paid, or expired';

-- Column comments for business_planner_payments
COMMENT ON COLUMN business_planner_payments.conversations_purchased IS 'Number of conversations purchased with this payment';
COMMENT ON COLUMN business_planner_payments.payment_reference IS 'Unique reference for wire transfer identification';

-- Column comments for business_planner_rate_limits
COMMENT ON COLUMN business_planner_rate_limits.request_count IS 'Number of requests in current time window';
COMMENT ON COLUMN business_planner_rate_limits.window_start IS 'Start time of current rate limiting window';
COMMENT ON COLUMN business_planner_rate_limits.blocked_until IS 'Timestamp until which user is blocked (if applicable)';
COMMENT ON COLUMN business_planner_rate_limits.suspicious_activity_count IS 'Counter for suspicious activity detection';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Log successful migration
DO $$
BEGIN
    RAISE NOTICE 'Business Planner schema migration completed successfully';
    RAISE NOTICE 'Created 6 tables with RLS policies and performance indexes';
    RAISE NOTICE 'Tables: business_planner_profiles, business_planner_sessions, business_planner_conversations, business_planner_usage, business_planner_payments, business_planner_rate_limits';
END $$;