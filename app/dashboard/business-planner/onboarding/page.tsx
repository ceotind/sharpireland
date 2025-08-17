import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import OnboardingFlow from '../components/OnboardingFlow';
import { BusinessPlannerOnboardingData } from '@/app/types/business-planner';
import { UserProfile, DashboardStats } from '@/app/types/dashboard';
import Link from 'next/link';

/**
 * Business Planner Onboarding Page
 * Step-by-step wizard for collecting business information
 * - 3-step onboarding process
 * - Business type, target market, and challenge collection
 * - Saves to database and redirects to chat
 */
export default async function BusinessPlannerOnboarding() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login?redirect=/dashboard/business-planner/onboarding');
  }

  const userId = user.id;

  try {
    // Fetch user profile for dashboard layout
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Fetch existing business planner profile if any
    const { data: existingProfile } = await supabase
      .from('business_planner_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

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

    // Prepare initial data if editing existing profile
    const initialData: Partial<BusinessPlannerOnboardingData> = existingProfile ? {
      business_type: existingProfile.business_type || '',
      business_stage: existingProfile.business_stage || 'idea',
      industry: existingProfile.industry || '',
      // Note: target_market and challenge are stored in session context, not profile
    } : {};

    const handleOnboardingComplete = async (data: BusinessPlannerOnboardingData) => {
      'use server';
      
      const supabase = await createClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        redirect('/login?redirect=/dashboard/business-planner/onboarding');
      }

      // Upsert business planner profile
      const { error: profileError } = await supabase
        .from('business_planner_profiles')
        .upsert({
          user_id: authUser.id,
          business_type: data.business_type,
          business_stage: data.business_stage,
          industry: data.industry,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error saving business profile:', profileError);
        redirect('/dashboard/business-planner/onboarding?error=save_failed');
        return;
      }

      // Create initial session with onboarding context
      const sessionContext = {
        business_type: data.business_type,
        target_market: data.target_market,
        challenge: data.challenge,
        additional_context: data.additional_context || '',
        created_at: new Date().toISOString()
      };

      const { data: newSession, error: sessionError } = await supabase
        .from('business_planner_sessions')
        .insert({
          user_id: authUser.id,
          title: `${data.business_type} Business Planning`,
          context: sessionContext,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating initial session:', sessionError);
        redirect('/dashboard/business-planner/onboarding?error=save_failed');
        return;
      }

      // Initialize usage tracking if not exists
      const { error: usageError } = await supabase
        .from('business_planner_usage')
        .upsert({
          user_id: authUser.id,
          free_conversations_used: 0,
          paid_conversations_used: 0,
          total_tokens_used: 0,
          last_reset_date: new Date().toISOString(),
          subscription_status: 'free',
          updated_at: new Date().toISOString()
        });

      if (usageError) {
        console.error('Error initializing usage:', usageError);
        // Don't throw here as it's not critical
      }

      // Redirect to chat with the new session
      redirect(`/dashboard/business-planner/chat?session=${newSession.id}`);
    };

    return (
      <DashboardLayout user={userProfileData} stats={dashboardStats}>
        <div id="onboarding-page-container" className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div id="onboarding-header" className="text-center mb-8">
            <div id="onboarding-icon" className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {existingProfile?.onboarding_completed ? 'Update Your Business Profile' : 'Welcome to Business Planner'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {existingProfile?.onboarding_completed 
                ? 'Update your business information to get more personalized planning assistance.'
                : 'Let\'s get to know your business better so we can provide personalized planning assistance.'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div id="onboarding-progress" className="mb-8">
            <div id="progress-steps" className="flex items-center justify-center space-x-4">
              <div id="step-1-indicator" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Business Info</span>
              </div>
              <div id="step-connector-1" className="w-12 h-0.5 bg-gray-300"></div>
              <div id="step-2-indicator" className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Target Market</span>
              </div>
              <div id="step-connector-2" className="w-12 h-0.5 bg-gray-300"></div>
              <div id="step-3-indicator" className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-500">Challenges</span>
              </div>
            </div>
          </div>

          {/* Onboarding Form */}
          <div id="onboarding-form-container" className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              initialData={initialData}
              isLoading={false}
            />
          </div>

          {/* Help Section */}
          <div id="onboarding-help" className="mt-8 bg-blue-50 rounded-lg p-6">
            <div id="help-content" className="flex items-start">
              <div id="help-icon" className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div id="help-text" className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">Need Help?</h3>
                <p className="mt-1 text-sm text-blue-700">
                  This information helps our AI provide more relevant business planning advice. 
                  You can always update these details later from your dashboard.
                </p>
                <div id="help-tips" className="mt-3 space-y-1">
                  <p className="text-xs text-blue-600">
                    <strong>Tip:</strong> Be as specific as possible about your target market and challenges for better recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skip Option (for existing users) */}
          {existingProfile?.onboarding_completed && (
            <div id="skip-option" className="mt-6 text-center">
              <Link
                href="/dashboard/business-planner"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Skip for now and go to dashboard
              </Link>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Error loading onboarding page:', error);
    redirect('/dashboard');
  }
}