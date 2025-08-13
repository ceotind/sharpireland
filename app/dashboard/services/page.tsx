import React from 'react';
import { createClient } from '../../utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ServicesSection from '../../components/dashboard/ServicesSection';

export default async function ServicesPage() {
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
    { count: activeSubscriptions }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active')
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
      pending: 0,
      overdue: 0,
      total_amount: 0,
    },
    activity: {
      recent_count: 0,
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
      <div id="services-page" className="space-y-6">
        <div id="services-page-header" className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Services & Subscriptions</h1>
          <p className="text-gray-600 mt-1">
            Manage your service subscriptions and usage
          </p>
        </div>

        <ServicesSection className="w-full" />
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'Services - Dashboard',
  description: 'Manage your service subscriptions and usage',
};