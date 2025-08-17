import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { UserProfile, DashboardStats, Project, Notification, Subscription, Invoice } from '../types/dashboard'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Check if the error is due to missing table
      if (error.code === 'PGRST205') {
        console.error('Profiles table not found, using mock profile:', error)
        // Return null to trigger the profile creation logic below
        return null
      }
      
      console.error('Error fetching profile:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return null
  }
}

async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient()
  
  // Get projects stats
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('status')
    .eq('user_id', userId)

  if (projectsError && projectsError.code !== 'PGRST205') {
    console.error('Error fetching projects:', projectsError)
  }

  // Get notifications stats - handle missing table
  let notifications: { read: boolean }[] = []
  try {
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('read')
      .eq('user_id', userId)
    
    if (!notificationsError) {
      notifications = notificationsData || []
    } else if (notificationsError.code === 'PGRST205') {
      console.error('Notifications table not found, using empty array:', notificationsError)
    } else {
      console.error('Error fetching notifications:', notificationsError)
    }
  } catch (error) {
    console.error('Unexpected error fetching notifications:', error)
  }

  // Get subscriptions stats
  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('subscriptions')
    .select('status, next_renewal')
    .eq('user_id', userId)
    
  if (subscriptionsError && subscriptionsError.code !== 'PGRST205') {
    console.error('Error fetching subscriptions:', subscriptionsError)
  }

  // Get invoices stats
  const { data: invoices, error: invoicesError } = await supabase
    .from('invoices')
    .select('status, total')
    .eq('user_id', userId)
    
  if (invoicesError && invoicesError.code !== 'PGRST205') {
    console.error('Error fetching invoices:', invoicesError)
  }

  // Get activity stats
  const { data: recentActivity, error: activityError } = await supabase
    .from('activity_logs')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
    
  if (activityError && activityError.code !== 'PGRST205') {
    console.error('Error fetching activity logs:', activityError)
  }

  // Calculate stats
  const projectStats = {
    total: projects?.length || 0,
    active: projects?.filter((p: { status: string }) => p.status === 'active').length || 0,
    completed: projects?.filter((p: { status: string }) => p.status === 'completed').length || 0,
    overdue: 0 // Would need to calculate based on end_date
  }

  const notificationStats = {
    unread: notifications?.filter((n: { read: boolean }) => !n.read).length || 0,
    total: notifications?.length || 0
  }

  const subscriptionStats = {
    active: subscriptions?.filter((s: { status: string; next_renewal: string | null }) => s.status === 'active').length || 0,
    expiring_soon: 0 // Would need to calculate based on next_renewal
  }

  const invoiceStats = {
    pending: invoices?.filter((i: { status: string; total: number }) => i.status === 'pending').length || 0,
    overdue: invoices?.filter((i: { status: string; total: number }) => i.status === 'overdue').length || 0,
    total_amount: invoices?.reduce((sum: number, i: { total: number }) => sum + (i.total || 0), 0) || 0
  }

  const activityStats = {
    recent_count: recentActivity?.length || 0,
    last_login: recentActivity?.[0]?.created_at || new Date().toISOString()
  }

  return {
    projects: projectStats,
    notifications: notificationStats,
    subscriptions: subscriptionStats,
    invoices: invoiceStats,
    activity: activityStats
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Get user profile
  let profile = await getUserProfile(data.user.id)
  
  // If no profile exists, create a basic one
  if (!profile) {
    const basicProfile: UserProfile = {
      id: data.user.id,
      username: null,
      full_name: data.user.user_metadata?.full_name || null,
      avatar_url: data.user.user_metadata?.avatar_url || null,
      phone: null,
      company: null,
      role: null,
      bio: null,
      website: null,
      social_links: null,
      timezone: 'UTC',
      language: 'en',
      email_notifications: true,
      marketing_emails: false,
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert(basicProfile)
      .select()
      .single()

    if (!createError && newProfile) {
      profile = newProfile
    } else {
      profile = basicProfile
    }
  }

  // Ensure profile is not null at this point
  if (!profile) {
    redirect('/login')
  }

  // Get dashboard stats
  const stats = await getDashboardStats(data.user.id)

  return (
    <DashboardLayout user={profile} stats={stats}>
      <div id="dashboard-overview-container" className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div id="dashboard-welcome-section" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6">
          <div id="dashboard-welcome-header" className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div id="dashboard-welcome-content">
              <h1 className="text-2xl font-bold text-text-100">
                Welcome back, {profile.full_name || profile.username || 'User'}!
              </h1>
              <p className="text-text-200 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Grid */}
        <div id="dashboard-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div id="dashboard-stat-projects" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6 h-full transition-all duration-200 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-primary-300 bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-text-200 mb-1">Active Projects</p>
                <p className="text-2xl font-semibold text-text-100">{stats.projects.active}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-notifications" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6 h-full transition-all duration-200 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent-red-light bg-opacity-50 rounded-full flex items-center justify-center">
                  {/* Corrected notification bell icon */}
                  <svg className="w-5 h-5 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-text-200 mb-1">Unread Notifications</p>
                <p className="text-2xl font-semibold text-text-100">{stats.notifications.unread}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-subscriptions" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6 h-full transition-all duration-200 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent-green bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-text-200 mb-1">Active Services</p>
                <p className="text-2xl font-semibold text-text-100">{stats.subscriptions.active}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-invoices" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6 h-full transition-all duration-200 hover:shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-accent-red-light bg-opacity-50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-text-200 mb-1">Pending Invoices</p>
                <p className="text-2xl font-semibold text-text-100">{stats.invoices.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div id="dashboard-profile-section" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-text-100 mb-5 pb-2 border-b border-border">Profile Information</h2>
          <div id="dashboard-profile-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div id="dashboard-profile-basic" className="bg-bg-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-text-200 mb-3 pb-2 border-b border-border">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Email:</span>
                  <span className="w-2/3 text-sm text-text-100">{data.user.email}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Full Name:</span>
                  <span className="w-2/3 text-sm text-text-100">{profile.full_name || 'Not set'}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Company:</span>
                  <span className="w-2/3 text-sm text-text-100">{profile.company || 'Not set'}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Role:</span>
                  <span className="w-2/3 text-sm text-text-100">{profile.role || 'Not set'}</span>
                </div>
              </div>
            </div>
            <div id="dashboard-profile-settings" className="bg-bg-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-text-200 mb-3 pb-2 border-b border-border">Settings</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Timezone:</span>
                  <span className="w-2/3 text-sm text-text-100">{profile.timezone}</span>
                </div>
                <div className="flex">
                  <span className="w-1/3 text-sm font-medium text-text-200">Language:</span>
                  <span className="w-2/3 text-sm text-text-100">{profile.language}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 text-sm font-medium text-text-200">Email Notifications:</span>
                  <span className="w-2/3 text-sm text-text-100 flex items-center">
                    {profile.email_notifications ? (
                      <><span className="h-2 w-2 bg-accent-green rounded-full mr-2"></span> Enabled</>
                    ) : (
                      <><span className="h-2 w-2 bg-accent-red rounded-full mr-2"></span> Disabled</>
                    )}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-1/3 text-sm font-medium text-text-200">Marketing Emails:</span>
                  <span className="w-2/3 text-sm text-text-100 flex items-center">
                    {profile.marketing_emails ? (
                      <><span className="h-2 w-2 bg-accent-green rounded-full mr-2"></span> Enabled</>
                    ) : (
                      <><span className="h-2 w-2 bg-accent-red rounded-full mr-2"></span> Disabled</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div id="dashboard-quick-actions" className="bg-bg-100 rounded-lg shadow-sm border border-border p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-text-100 mb-5 pb-2 border-b border-border flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div id="dashboard-actions-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Link
              id="dashboard-action-profile"
              href="/dashboard/profile"
              className="flex items-center p-5 border border-border rounded-lg hover:bg-primary-100 hover:bg-opacity-10 hover:border-primary-100 transition-all duration-200 group h-full"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-300 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-300 group-hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5 text-primary-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-100 group-hover:text-primary-100 transition-colors">Edit Profile</h3>
                <p className="text-xs text-text-200 mt-1">Update your information</p>
              </div>
            </Link>

            <Link
              id="dashboard-action-projects"
              href="/dashboard/projects"
              className="flex items-center p-5 border border-border rounded-lg hover:bg-accent-green hover:bg-opacity-10 hover:border-accent-green transition-all duration-200 group h-full"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-accent-green bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent-green group-hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-100 group-hover:text-accent-green transition-colors">New Project</h3>
                <p className="text-xs text-text-200 mt-1">Start a new project</p>
              </div>
            </Link>

            <Link
              id="dashboard-action-support"
              href="/dashboard/support"
              className="flex items-center p-5 border border-border rounded-lg hover:bg-primary-300 hover:bg-opacity-10 hover:border-primary-300 transition-all duration-200 group h-full"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-300 bg-opacity-20 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-300 group-hover:bg-opacity-30 transition-colors">
                <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l.01.01M12 12l.01.01M12 12l.01.01M12 12l.01.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-100 group-hover:text-primary-300 transition-colors">Get Support</h3>
                <p className="text-xs text-text-200 mt-1">Contact our team</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}