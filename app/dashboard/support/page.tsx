import React from 'react';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import SupportSection from '../../components/dashboard/SupportSection';

interface Invoice {
  total: number;
}

export default async function SupportPage() {
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
    { count: openTickets },
    { count: totalTickets }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending'),
    supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'overdue'),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['open', 'in-progress']),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
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

  const totalInvoiceAmount = invoiceAmounts?.reduce((sum: number, invoice: Invoice) => sum + (invoice.total || 0), 0) || 0;

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
      <div id="support-page" className="space-y-6">
        <div id="support-page-header" className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">
                Get help, submit tickets, and track your support requests
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{openTickets || 0}</div>
                <div className="text-sm text-gray-600">Active Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{totalTickets || 0}</div>
                <div className="text-sm text-gray-600">Total Tickets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help Links */}
        <div id="quick-help-section" className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/docs/getting-started"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Documentation</h3>
                <p className="text-sm text-gray-600">Browse our comprehensive guides</p>
              </div>
            </Link>

            <Link
              href="/docs/faq"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">FAQ</h3>
                <p className="text-sm text-gray-600">Find answers to common questions</p>
              </div>
            </Link>

            <Link
              href="/contact"
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Contact Us</h3>
                <p className="text-sm text-gray-600">Get in touch with our team</p>
              </div>
            </Link>
          </div>
        </div>

        <SupportSection className="w-full" />
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'Support - Dashboard',
  description: 'Get help and manage your support tickets',
};