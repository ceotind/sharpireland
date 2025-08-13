import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import PaymentHistory from '../components/PaymentHistory';
import UsageTracker from '../components/UsageTracker';
import { 
  BusinessPlannerPayment, 
  BusinessPlannerUsage, 
  BusinessPlannerProfile 
} from '@/app/types/business-planner';
import { UserProfile, DashboardStats } from '@/app/types/dashboard';
import { 
  PAYMENT_AMOUNT, 
  PAID_CONVERSATIONS_COUNT, 
  FREE_CONVERSATIONS_LIMIT 
} from '@/app/utils/business-planner/constants';
import { formatCurrency } from '@/app/utils/business-planner/payment';

/**
 * Business Planner Billing Page
 * Displays subscription status, payment history, and billing information
 * - Shows current subscription status and usage
 * - Displays payment history with status tracking
 * - Provides wire transfer instructions for new payments
 * - Shows pending payments with status updates
 */
export default async function BusinessPlannerBilling() {
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

    // Fetch payment history
    const { data: payments } = await supabase
      .from('business_planner_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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

    // Calculate usage statistics
    const freeUsed = usageData.free_conversations_used;
    const paidUsed = usageData.paid_conversations_used;
    const freeRemaining = Math.max(0, FREE_CONVERSATIONS_LIMIT - freeUsed);
    const paidRemaining = usageData.subscription_status === 'paid' 
      ? Math.max(0, PAID_CONVERSATIONS_COUNT - paidUsed)
      : 0;
    const totalRemaining = freeRemaining + paidRemaining;

    // Get pending payments
    const pendingPayments = payments?.filter((p: BusinessPlannerPayment) => p.payment_status === 'pending') || [];
    const completedPayments = payments?.filter((p: BusinessPlannerPayment) => p.payment_status === 'completed') || [];

    return (
      <DashboardLayout user={user} stats={dashboardStats}>
        <div id="billing-dashboard-container" className="space-y-8">
          {/* Header Section */}
          <div id="billing-header-section" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div id="billing-header-content" className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div id="billing-title-section">
                <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
                <p className="mt-2 text-gray-600">
                  Manage your business planner subscription and payment history
                </p>
              </div>
              <div id="billing-actions" className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
                <a
                  href="/dashboard/business-planner"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div id="subscription-status-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="current-plan-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="current-plan-header" className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                <span
                  id="plan-status-badge"
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    usageData.subscription_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : usageData.subscription_status === 'expired'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {usageData.subscription_status === 'paid' ? 'Paid Plan' : 
                   usageData.subscription_status === 'expired' ? 'Expired' : 'Free Plan'}
                </span>
              </div>
              <div id="current-plan-details" className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Free Conversations:</span>
                  <span className="font-medium text-gray-900">{freeUsed} / {FREE_CONVERSATIONS_LIMIT}</span>
                </div>
                {usageData.subscription_status === 'paid' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Paid Conversations:</span>
                    <span className="font-medium text-gray-900">{paidUsed} / {PAID_CONVERSATIONS_COUNT}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Remaining:</span>
                  <span className="font-medium text-gray-900">{totalRemaining}</span>
                </div>
              </div>
            </div>

            <div id="upgrade-plan-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="upgrade-plan-header" className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upgrade Plan</h3>
                <p className="text-sm text-gray-600 mt-1">Get more conversations with our paid plan</p>
              </div>
              <div id="upgrade-plan-details" className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(PAYMENT_AMOUNT)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversations:</span>
                  <span className="font-medium text-gray-900">{PAID_CONVERSATIONS_COUNT}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost per conversation:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(PAYMENT_AMOUNT / PAID_CONVERSATIONS_COUNT)}</span>
                </div>
              </div>
              {usageData.subscription_status !== 'paid' && (
                <div id="upgrade-plan-action" className="mt-4">
                  <button
                    id="upgrade-plan-button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      // This will be handled by client-side JavaScript to open PaymentModal
                      console.log('Open payment modal');
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>

            <div id="payment-status-card" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="payment-status-header" className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
                <p className="text-sm text-gray-600 mt-1">Current payment information</p>
              </div>
              <div id="payment-status-details" className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Payments:</span>
                  <span className="font-medium text-gray-900">{payments?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{completedPayments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-yellow-600">{pendingPayments.length}</span>
                </div>
              </div>
              {pendingPayments.length > 0 && (
                <div id="pending-payment-alert" className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''} being processed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wire Transfer Instructions */}
          {usageData.subscription_status !== 'paid' && (
            <div id="wire-transfer-section" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div id="wire-transfer-header" className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Wire Transfer Instructions</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Follow these instructions to upgrade your account via wire transfer
                </p>
              </div>
              
              <div id="wire-transfer-content" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div id="transfer-steps" className="space-y-4">
                  <h4 className="font-medium text-gray-900">How to Pay:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Click "Upgrade Now" to generate payment instructions</li>
                    <li>Copy the bank details and payment reference</li>
                    <li>Make a wire transfer for {formatCurrency(PAYMENT_AMOUNT)}</li>
                    <li>Include the payment reference in your transfer</li>
                    <li>Wait 1-3 business days for verification</li>
                    <li>Your account will be credited automatically</li>
                  </ol>
                </div>
                
                <div id="transfer-info" className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                    <li>Transfer the exact amount: {formatCurrency(PAYMENT_AMOUNT)}</li>
                    <li>Always include the payment reference</li>
                    <li>Processing takes 1-3 business days</li>
                    <li>You'll receive email confirmation</li>
                    <li>Contact support if you have issues</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div id="billing-main-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment History */}
            <div id="payment-history-section" className="lg:col-span-2">
              <div id="payment-history-card" className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div id="payment-history-header" className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Track all your payment transactions and their status
                  </p>
                </div>
                <div id="payment-history-content" className="p-6">
                  <PaymentHistory
                    payments={payments || []}
                    onRefresh={() => {
                      // This will be handled by client-side JavaScript
                      window.location.reload();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Usage Tracker */}
            <div id="usage-tracker-section" className="lg:col-span-1">
              <div id="usage-tracker-card" className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div id="usage-tracker-header" className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Usage Overview</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Monitor your conversation usage
                  </p>
                </div>
                <div id="usage-tracker-content" className="p-6">
                  <UsageTracker
                    usage={usageData}
                    onUpgrade={() => {
                      // This will be handled by client-side JavaScript to open PaymentModal
                      console.log('Open payment modal from usage tracker');
                    }}
                    showDetails={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div id="billing-support-section" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div id="billing-support-header" className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Contact our support team for billing questions or payment issues
              </p>
            </div>
            
            <div id="billing-support-content" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="/dashboard/support"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="support-ticket-icon" className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div id="support-ticket-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Create Support Ticket</p>
                  <p className="text-xs text-gray-500">Get help with billing issues</p>
                </div>
              </a>

              <a
                href="mailto:billing@sharpireland.com"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="email-support-icon" className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div id="email-support-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Email Support</p>
                  <p className="text-xs text-gray-500">billing@sharpireland.com</p>
                </div>
              </a>

              <a
                href="/contact"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div id="contact-support-icon" className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div id="contact-support-info" className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Contact Us</p>
                  <p className="text-xs text-gray-500">General inquiries</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Error loading billing dashboard:', error);
    redirect('/dashboard/business-planner');
  }
}