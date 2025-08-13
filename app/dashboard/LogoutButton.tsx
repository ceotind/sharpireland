'use client'

import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      id="logout-button"
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-accent-red text-white rounded-md hover:bg-accent-red-light hover:text-text-100 focus:outline-none focus:ring-2 focus:ring-accent-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <div id="logout-loading" className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Signing out...
        </div>
      ) : (
        'Sign Out'
      )}
    </button>
  )
}