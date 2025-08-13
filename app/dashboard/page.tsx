import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { UserProfile, DashboardStats } from '../types/dashboard'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import LogoutButton from './LogoutButton'

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient()
  
  // Get projects stats
  const { data: projects } = await supabase
    .from('projects')
    .select('status')
    .eq('user_id', userId)

  // Get notifications stats
  const { data: notifications } = await supabase
    .from('notifications')
    .select('read')
    .eq('user_id', userId)

  // Get subscriptions stats
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('status, next_renewal')
    .eq('user_id', userId)

  // Get invoices stats
  const { data: invoices } = await supabase
    .from('invoices')
    .select('status, total')
    .eq('user_id', userId)

  // Get activity stats
  const { data: recentActivity } = await supabase
    .from('activity_logs')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const projectStats = {
    total: projects?.length || 0,
    active: projects?.filter((p: any) => p.status === 'active').length || 0,
    completed: projects?.filter((p: any) => p.status === 'completed').length || 0,
    overdue: 0 // Would need to calculate based on end_date
  }

  const notificationStats = {
    unread: notifications?.filter((n: any) => !n.read).length || 0,
    total: notifications?.length || 0
  }

  const subscriptionStats = {
    active: subscriptions?.filter((s: any) => s.status === 'active').length || 0,
    expiring_soon: 0 // Would need to calculate based on next_renewal
  }

  const invoiceStats = {
    pending: invoices?.filter((i: any) => i.status === 'pending').length || 0,
    overdue: invoices?.filter((i: any) => i.status === 'overdue').length || 0,
    total_amount: invoices?.reduce((sum: number, i: any) => sum + (i.total || 0), 0) || 0
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
      <div id="dashboard-overview-container" className="space-y-6">
        {/* Welcome Section */}
        <div id="dashboard-welcome-section" className="bg-white rounded-lg shadow-sm p-6">
          <div id="dashboard-welcome-header" className="flex justify-between items-center mb-4">
            <div id="dashboard-welcome-content">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile.full_name || profile.username || 'User'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Grid */}
        <div id="dashboard-stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div id="dashboard-stat-projects" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.projects.active}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-notifications" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12h5v12z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.notifications.unread}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-subscriptions" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.subscriptions.active}</p>
              </div>
            </div>
          </div>

          <div id="dashboard-stat-invoices" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.invoices.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div id="dashboard-profile-section" className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          <div id="dashboard-profile-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="dashboard-profile-basic">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {data.user.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Full Name:</strong> {profile.full_name || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Company:</strong> {profile.company || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Role:</strong> {profile.role || 'Not set'}
                </p>
              </div>
            </div>
            <div id="dashboard-profile-settings">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Settings</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Timezone:</strong> {profile.timezone}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Language:</strong> {profile.language}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email Notifications:</strong> {profile.email_notifications ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Marketing Emails:</strong> {profile.marketing_emails ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div id="dashboard-quick-actions" className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div id="dashboard-actions-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              id="dashboard-action-profile"
              href="/dashboard/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Edit Profile</h3>
                <p className="text-xs text-gray-500">Update your information</p>
              </div>
            </a>

            <a
              id="dashboard-action-projects"
              href="/dashboard/projects"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">New Project</h3>
                <p className="text-xs text-gray-500">Start a new project</p>
              </div>
            </a>

            <a
              id="dashboard-action-support"
              href="/dashboard/support"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l.01.01M12 12l.01.01M12 12l.01.01M12 12l.01.01" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Get Support</h3>
                <p className="text-xs text-gray-500">Contact our team</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}