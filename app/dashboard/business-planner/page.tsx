import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import SessionListWrapper from './components/SessionListWrapper';
import UsageTrackerWrapper from './components/UsageTrackerWrapper';
import { BusinessPlannerSession, BusinessPlannerUsage, BusinessPlannerProfile } from '@/app/types/business-planner';
import { UserProfile, DashboardStats } from '@/app/types/dashboard';

/**
 * Business Planner Dashboard Page
 * Main dashboard for the business planner feature
 * - Checks authentication and onboarding status
 * - Displays active sessions and usage statistics
 * - Provides navigation to chat and onboarding
 */
export default async function BusinessPlannerDashboard() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login?redirect=/dashboard/business-planner');
  }

  const userId = user.id;

  try {
    // Fetch user profile for dashboard layout
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch business planner profile
    const { data: businessProfile } = await supabase
      .from('business_planner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If no business profile exists or onboarding not completed, redirect to onboarding
    if (!businessProfile || !businessProfile.onboarding_completed) {
      redirect('/dashboard/business-planner/onboarding');
    }

    // Fetch user sessions (exclude archived sessions)
    const { data: sessions } = await supabase
      .from('business_planner_sessions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'completed'])
      .order('updated_at', { ascending: false })
      .limit(10);

    // Fetch usage data
    const { data: usage } = await supabase
      .from('business_planner_usage')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Create default usage if none exists
    let usageData: BusinessPlannerUsage;
    if (!usage) {
      const { data: newUsage } = await supabase
        .from('business_planner_usage')
        .insert({
          user_id: userId,
          free_conversations_used: 0,
          paid_conversations_used: 0,
          total_tokens_used: 0,
          last_reset_date: new Date().toISOString(),
          subscription_status: 'free'
        })
        .select()
        .single();
      
      usageData = newUsage!;
    } else {
      usageData = usage;
    }

    // Mock dashboard stats for layout
    const dashboardStats: DashboardStats = {
      projects: { total: 0, active: 0, completed: 0, overdue: 0 },
      notifications: { unread: 0, total: 0 },
      subscriptions: { active: 1, expiring_soon: 0 },
      invoices: { pending: 0, overdue: 0, total_amount: 0 },
      activity: { recent_count: 0, last_login: new Date().toISOString() }
    };

    const userProfileData: UserProfile = {
      id: userId,
      username: userProfile?.username || user.email || 'User',
      full_name: userProfile?.full_name || user.user_metadata?.full_name || '',
      avatar_url: userProfile?.avatar_url || user.user_metadata?.avatar_url || null,
      phone: userProfile?.phone || null,
      company: userProfile?.company || null,
      role: userProfile?.role || 'user',
      bio: userProfile?.bio || null,
      website: userProfile?.website || null,
      social_links: userProfile?.social_links || null,
      timezone: userProfile?.timezone || 'UTC',
      language: userProfile?.language || 'en',
      email_notifications: userProfile?.email_notifications ?? true,
      marketing_emails: userProfile?.marketing_emails ?? false,
      onboarding_completed: userProfile?.onboarding_completed ?? false,
      created_at: userProfile?.created_at || user.created_at,
      updated_at: userProfile?.updated_at || new Date().toISOString()
    };

    return (
      <DashboardLayout user={userProfileData} stats={dashboardStats}>
        <div id="business-planner-dashboard-container" className="space-y-8">
          {/* Header Section */}
          <div id="dashboard-header-section" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div id="dashboard-header-content" className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div id="dashboard-title-section">
                <h1 className="text-3xl font-bold text-gray-900">Business Planner</h1>
                <p className="mt-2 text-gray-600">
                  AI-powered business planning and strategy development
                </p>
              </div>
              <div id="dashboard-actions" className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                <a
                  href="/dashboard/business-planner/chat"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Conversation
                </a>
                <a
                  href="/dashboard/business-planner/onboarding"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Update Profile
                </a>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div id="dashboard-stats-section" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div id="total-sessions-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="total-sessions-content" className="flex items-center">
                <div id="total-sessions-icon" className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <div id="total-sessions-info" className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">{sessions?.length || 0}</p>
                </div>
              </div>
            </div>

            <div id="active-sessions-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="active-sessions-content" className="flex items-center">
                <div id="active-sessions-icon" className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div id="active-sessions-info" className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {sessions?.filter((s: BusinessPlannerSession) => s.status === 'active').length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div id="business-type-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="business-type-content" className="flex items-center">
                <div id="business-type-icon" className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div id="business-type-info" className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Business Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {businessProfile.business_type || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div id="dashboard-main-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sessions List */}
            <div id="sessions-section" className="lg:col-span-2">
              <div id="sessions-card" className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div id="sessions-header" className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Sessions</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your recent business planning conversations
                  </p>
                </div>
                <div id="sessions-content" className="p-6">
                  <SessionListWrapper
                    sessions={sessions || []}
                  />
                </div>
              </div>
            </div>

            {/* Usage Tracker */}
            <div id="usage-section" className="lg:col-span-1">
              <div id="usage-card" className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div id="usage-header" className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Usage Statistics</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Track your conversation usage
                  </p>
                </div>
                <div id="usage-content" className="p-6">
                  <UsageTrackerWrapper
                    usage={usageData}
                    showDetails={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div id="quick-actions-section" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div id="quick-actions-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/dashboard/business-planner/chat"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="start-chat-icon" className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div id="start-chat-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Start New Chat</p>
                  <p className="text-xs text-gray-500">Begin planning session</p>
                </div>
              </a>

              <a
                href="/dashboard/business-planner/onboarding"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="update-profile-icon" className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div id="update-profile-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Update Profile</p>
                  <p className="text-xs text-gray-500">Modify business info</p>
                </div>
              </a>

              <a
                href="/dashboard/billing"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="upgrade-plan-icon" className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div id="upgrade-plan-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Upgrade Plan</p>
                  <p className="text-xs text-gray-500">Get more conversations</p>
                </div>
              </a>

              <a
                href="/dashboard/support"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="get-help-icon" className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div id="get-help-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Get Help</p>
                  <p className="text-xs text-gray-500">Contact support</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Error loading business planner dashboard:', error);
    redirect('/dashboard/business-planner/onboarding');
  }
}