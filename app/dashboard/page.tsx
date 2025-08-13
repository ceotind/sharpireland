import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div id="dashboard-container" className="min-h-screen bg-bg-100">
      <div id="dashboard-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="dashboard-card" className="bg-white rounded-lg shadow-md p-6">
          <div id="dashboard-header" className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text-100">
              Welcome to Dashboard
            </h1>
            <LogoutButton />
          </div>
          
          <div id="dashboard-sections" className="space-y-4">
            <div id="user-info-section" className="bg-bg-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-text-100 mb-2">
                User Information
              </h2>
              <div id="user-details" className="space-y-1">
                <p className="text-text-200">
                  <strong>Email:</strong> {data.user.email}
                </p>
                <p className="text-text-200">
                  <strong>Provider:</strong> {data.user.app_metadata.provider}
                </p>
                <p className="text-text-200">
                  <strong>Last Sign In:</strong> {new Date(data.user.last_sign_in_at || '').toLocaleString()}
                </p>
                <p className="text-text-200">
                  <strong>User ID:</strong> {data.user.id}
                </p>
              </div>
            </div>
            
            <div id="dashboard-content-section" className="bg-bg-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-text-100 mb-2">
                Dashboard Content
              </h2>
              <p className="text-text-200">
                This is your protected dashboard. Only authenticated users can see this content.
              </p>
              <div id="dashboard-features" className="mt-4 space-y-2">
                <div className="flex items-center text-text-200">
                  <svg className="w-4 h-4 mr-2 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure OAuth authentication
                </div>
                <div className="flex items-center text-text-200">
                  <svg className="w-4 h-4 mr-2 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Session management with Supabase
                </div>
                <div className="flex items-center text-text-200">
                  <svg className="w-4 h-4 mr-2 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Protected routes and content
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}