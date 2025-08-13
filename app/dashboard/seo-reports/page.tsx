import React from 'react';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import SEOHistorySection from '../../components/dashboard/SEOHistorySection';

export default async function SEOReportsPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get dashboard stats
  const [
    { count: totalProjects },
    { count: activeProjects },
    { count: completedProjects },
    { count: unreadNotifications },
    { count: activeSubscriptions },
    { count: pendingInvoices },
    { count: overdueInvoices },
    { count: seoReports }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'overdue'),
    supabase.from('seo_reports').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  ]);

  // Get overdue projects
  const { count: overdueProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('status', 'eq', 'completed')
    .lt('end_date', new Date().toISOString().split('T')[0]);

  // Get expiring subscriptions (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const { count: expiringSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active')
    .lte('next_renewal', thirtyDaysFromNow.toISOString().split('T')[0]);

  // Get total invoice amount for pending and overdue invoices
  const { data: invoiceAmounts } = await supabase
    .from('invoices')
    .select('total')
    .eq('user_id', user.id)
    .in('status', ['pending', 'overdue']);

  const totalInvoiceAmount = invoiceAmounts?.reduce((sum: number, invoice: any) => sum + (invoice.total || 0), 0) || 0;

  // Get recent activity count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { count: recentActivityCount } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString());

  const stats = {
    projects: {
      total: totalProjects || 0,
      active: activeProjects || 0,
      completed: completedProjects || 0,
      overdue: overdueProjects || 0,
    },
    notifications: {
      unread: unreadNotifications || 0,
      total: unreadNotifications || 0,
    },
    subscriptions: {
      active: activeSubscriptions || 0,
      expiring_soon: expiringSubscriptions || 0,
    },
    invoices: {
      pending: pendingInvoices || 0,
      overdue: overdueInvoices || 0,
      total_amount: totalInvoiceAmount,
    },
    activity: {
      recent_count: recentActivityCount || 0,
      last_login: new Date().toISOString(),
    },
  };

  const userProfile = {
    id: user.id,
    username: profile?.username || null,
    full_name: profile?.full_name || user.user_metadata?.full_name || null,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    phone: profile?.phone || null,
    company: profile?.company || null,
    role: profile?.role || null,
    bio: profile?.bio || null,
    website: profile?.website || null,
    social_links: profile?.social_links || null,
    timezone: profile?.timezone || 'UTC',
    language: profile?.language || 'en',
    email_notifications: profile?.email_notifications ?? true,
    marketing_emails: profile?.marketing_emails ?? false,
    onboarding_completed: profile?.onboarding_completed ?? false,
    created_at: profile?.created_at || user.created_at,
    updated_at: profile?.updated_at || user.created_at,
  };

  return (
    <DashboardLayout user={userProfile} stats={stats}>
      <div id="seo-reports-page" className="space-y-6">
        <div id="seo-reports-page-header" className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Reports</h1>
              <p className="text-gray-600 mt-1">
                View and manage your SEO analysis reports and history
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{seoReports || 0}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <a
                href="/seo-analyzer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                New SEO Analysis
              </a>
            </div>
          </div>
        </div>

        <SEOHistorySection className="w-full" />
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'SEO Reports - Dashboard',
  description: 'View and manage your SEO analysis reports',
};