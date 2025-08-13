import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import ChatInterface from '../components/ChatInterface';
import { BusinessPlannerSession, BusinessPlannerUsage, BusinessPlannerConversation } from '@/app/types/business-planner';
import { UserProfile, DashboardStats } from '@/app/types/dashboard';

interface ChatPageProps {
  searchParams: { session?: string };
}

/**
 * Business Planner Chat Page
 * Real-time chat interface for business planning conversations
 * - Loads existing session or creates new one
 * - Displays message history
 * - Handles AI responses and usage tracking
 */
export default async function BusinessPlannerChat({ searchParams }: ChatPageProps) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    redirect('/login');
  }

  const userId = session.user.id;
  const sessionId = searchParams.session;

  try {
    // Fetch user profile for dashboard layout
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Check if user has completed onboarding
    const { data: businessProfile } = await supabase
      .from('business_planner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!businessProfile || !businessProfile.onboarding_completed) {
      redirect('/dashboard/business-planner/onboarding');
    }

    // Fetch or create session
    let currentSession: BusinessPlannerSession | null = null;
    let conversations: BusinessPlannerConversation[] = [];

    if (sessionId) {
      // Load existing session
      const { data: existingSession } = await supabase
        .from('business_planner_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (existingSession) {
        currentSession = existingSession;
        
        // Load conversation history
        const { data: sessionConversations } = await supabase
          .from('business_planner_conversations')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        conversations = sessionConversations || [];
      } else {
        // Session not found or doesn't belong to user
        redirect('/dashboard/business-planner');
      }
    }

    // If no session, create a new one with default context
    if (!currentSession) {
      const defaultContext = {
        business_type: businessProfile.business_type || 'General Business',
        target_market: 'To be defined',
        challenge: 'General business planning and strategy',
        created_at: new Date().toISOString()
      };

      const { data: newSession, error: sessionError } = await supabase
        .from('business_planner_sessions')
        .insert({
          user_id: userId,
          title: 'New Business Planning Session',
          context: defaultContext,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        redirect('/dashboard/business-planner');
      }

      currentSession = newSession;
      // Redirect to include session ID in URL
      redirect(`/dashboard/business-planner/chat?session=${newSession.id}`);
    }

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

    const user: UserProfile = {
      id: userId,
      username: userProfile?.username || session.user.email || 'User',
      full_name: userProfile?.full_name || session.user.user_metadata?.full_name || '',
      avatar_url: userProfile?.avatar_url || session.user.user_metadata?.avatar_url || null,
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
      created_at: userProfile?.created_at || session.user.created_at,
      updated_at: userProfile?.updated_at || new Date().toISOString()
    };

    return (
      <DashboardLayout user={user} stats={dashboardStats}>
        <div id="chat-page-container" className="h-full flex flex-col">
          {/* Header */}
          <div id="chat-header" className="bg-white border-b border-gray-200 px-6 py-4">
            <div id="chat-header-content" className="flex items-center justify-between">
              <div id="chat-title-section">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentSession.title || 'Business Planning Chat'}
                </h1>
                <div id="chat-subtitle" className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">
                    Session started {new Date(currentSession.created_at).toLocaleDateString()}
                  </span>
                  <span
                    id="session-status-badge"
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      currentSession.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : currentSession.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {currentSession.status}
                  </span>
                </div>
              </div>
              
              <div id="chat-actions" className="flex items-center space-x-3">
                <a
                  href="/dashboard/business-planner"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </a>
                
                <button
                  id="export-conversation-button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    // This will be handled by the ChatInterface component
                    console.log('Export conversation');
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Business Context Card */}
          {currentSession.context && (
            <div id="business-context-card" className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div id="context-content" className="flex items-start space-x-4">
                <div id="context-icon" className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div id="context-details" className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Business Context</h3>
                  <div id="context-info" className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                    <div id="business-type-info">
                      <span className="font-medium">Type:</span> {currentSession.context.business_type}
                    </div>
                    <div id="target-market-info">
                      <span className="font-medium">Market:</span> {currentSession.context.target_market}
                    </div>
                    <div id="challenge-info">
                      <span className="font-medium">Challenge:</span> {currentSession.context.challenge}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div id="chat-interface-container" className="flex-1 min-h-0">
            <ChatInterface
              session={currentSession}
              usage={usageData}
              initialMessages={conversations}
              onMessageSent={(message: string) => {
                console.log('Message sent:', message);
              }}
              onSessionCreated={(session: BusinessPlannerSession) => {
                console.log('Session created:', session);
              }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Error loading chat page:', error);
    redirect('/dashboard/business-planner');
  }
}