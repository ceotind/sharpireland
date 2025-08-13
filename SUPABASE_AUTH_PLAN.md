# Supabase OAuth Authentication Implementation Plan

## Overview
This plan outlines the implementation of OAuth-only authentication using Supabase Auth with Google and GitHub providers for the Sharp Ireland Next.js project.

## Architecture

```mermaid
graph TB
    A[User] --> B[Login Page]
    B --> C[OAuth Provider Selection]
    C --> D[Google OAuth]
    C --> E[GitHub OAuth]
    D --> F[Supabase Auth]
    E --> F[Supabase Auth]
    F --> G[OAuth Callback Route]
    G --> H[Dashboard]
    H --> I[Supabase Database]
```

## Technology Stack
- **Frontend**: Next.js 15 with App Router
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **OAuth Providers**: Google, GitHub
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Implementation Steps

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Environment Variables
Your environment variables are already configured in `.env`:
```env
# Supabase Configuration (Already configured)
NEXT_PUBLIC_SUPABASE_URL="https://cinozekxbsgmbkxywebc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbm96ZWt4YnNnbWJreHl3ZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTU0ODksImV4cCI6MjA3MDY3MTQ4OX0.HeoWiP91CCfL142odaODwXe-2r0J9JdwgNkB-3XVLoA"

# Additional Supabase variables available:
SUPABASE_URL="https://cinozekxbsgmbkxywebc.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbm96ZWt4YnNnbWJreHl3ZWJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA5NTQ4OSwiZXhwIjoyMDcwNjcxNDg5fQ.K17NBotipHjycR4sHwyg_nm65oGFZX8sYr2OR09_29s"
SUPABASE_JWT_SECRET="lpcCfvDdON5Kr5+KGqWxcoRDyH5hRhci409im6qIwaqrFkUFDf/rbPF+CPcRP2IWf+Q0WHmNo14oPTcaO/Ytkw=="

# OAuth Provider Configuration (to be set in Supabase Dashboard)
# Google OAuth - configured in Supabase Dashboard
# GitHub OAuth - configured in Supabase Dashboard
```

**Note**: Your Supabase project is already set up with project ID: `cinozekxbsgmbkxywebc`

**Action Required**: Update `.env.example` to include Supabase configuration:
```env
# --- Supabase Configuration ---
# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# Supabase anonymous key (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Supabase service role key (server-side only, keep secret)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Supabase JWT secret (for token verification)
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### 3. Supabase Client Configuration

#### Server Client (`utils/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

#### Client Component (`utils/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 4. OAuth Callback Route Handler
Create `app/auth/callback/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

### 5. Login Page Implementation
Create `app/login/page.tsx`:
```typescript
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(provider)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error during OAuth login:', error)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-100">
            Sign in to Sharp Ireland
          </h2>
          <p className="mt-2 text-text-200">
            Choose your preferred sign-in method
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-white text-text-100 hover:bg-bg-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'google' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-300"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center px-4 py-3 border border-border rounded-md shadow-sm bg-white text-text-100 hover:bg-bg-200 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'github' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-300"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 6. Dashboard Page with Authentication
Create `app/dashboard/page.tsx`:
```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text-100">
              Welcome to Dashboard
            </h1>
            <LogoutButton />
          </div>
          
          <div className="space-y-4">
            <div className="bg-bg-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-text-100 mb-2">
                User Information
              </h2>
              <p className="text-text-200">
                <strong>Email:</strong> {data.user.email}
              </p>
              <p className="text-text-200">
                <strong>Provider:</strong> {data.user.app_metadata.provider}
              </p>
              <p className="text-text-200">
                <strong>Last Sign In:</strong> {new Date(data.user.last_sign_in_at || '').toLocaleString()}
              </p>
            </div>
            
            <div className="bg-bg-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-text-100 mb-2">
                Dashboard Content
              </h2>
              <p className="text-text-200">
                This is your protected dashboard. Only authenticated users can see this content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 7. Logout Button Component
Create `app/dashboard/LogoutButton.tsx`:
```typescript
'use client'

import { createClient } from '@/utils/supabase/client'
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
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-accent-red text-white rounded-md hover:bg-accent-red-light focus:outline-none focus:ring-2 focus:ring-accent-red disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Signing out...
        </div>
      ) : (
        'Sign Out'
      )}
    </button>
  )
}
```

### 8. Update Next.js Security Headers
Update `next.config.ts` to include OAuth redirect URLs:
```typescript
// In the CSP configuration, update connect-src to include Supabase
"connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.supabase.co https://accounts.google.com https://github.com https://*.agora.io https://*.edge.agora.io https://*.sd-rtn.com https://*.edge.sd-rtn.com wss://*.agora.io wss://*.edge.agora.io wss://*.sd-rtn.com wss://*.edge.sd-rtn.com",
```

### 9. OAuth Provider Setup

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy Client ID and Client Secret
8. Add to Supabase Dashboard → Authentication → Providers → Google

#### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Sharp Ireland"
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. Add to Supabase Dashboard → Authentication → Providers → GitHub

### 10. Supabase Dashboard Configuration
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Settings
3. Set Site URL: `https://your-domain.com` (or `http://localhost:3000` for development)
4. Add redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/auth/callback`
5. Enable Google and GitHub providers with your OAuth credentials

### 11. Optional: Middleware for Route Protection
Create `middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Testing Checklist

### Google OAuth Flow
- [ ] Click "Continue with Google" button
- [ ] Redirected to Google consent screen
- [ ] Grant permissions
- [ ] Redirected back to dashboard
- [ ] User information displayed correctly
- [ ] Logout functionality works

### GitHub OAuth Flow
- [ ] Click "Continue with GitHub" button
- [ ] Redirected to GitHub authorization screen
- [ ] Grant permissions
- [ ] Redirected back to dashboard
- [ ] User information displayed correctly
- [ ] Logout functionality works

### Security & UX
- [ ] Protected routes redirect to login when not authenticated
- [ ] Login page redirects to dashboard when already authenticated
- [ ] Loading states work correctly
- [ ] Error handling displays appropriate messages
- [ ] Session persists across browser refreshes
- [ ] Logout clears session completely

## Deployment Considerations

### Environment Variables
Your environment variables are already configured in Vercel from your Supabase integration:
- `NEXT_PUBLIC_SUPABASE_URL="https://cinozekxbsgmbkxywebc.supabase.co"`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already set)

### OAuth Redirect URLs
Update OAuth applications with production URLs:
- Google: Add `https://sharpireland.com/auth/callback` (or your production domain)
- GitHub: Update callback URL to `https://cinozekxbsgmbkxywebc.supabase.co/auth/v1/callback`
- Supabase: Update Site URL and redirect URLs in dashboard to match your production domain

### Security Headers
The existing Next.js security headers should be updated to include Supabase domains in the CSP.

## File Structure
```
app/
├── auth/
│   ├── callback/
│   │   └── route.ts
│   └── auth-code-error/
│       └── page.tsx
├── dashboard/
│   ├── page.tsx
│   └── LogoutButton.tsx
├── login/
│   └── page.tsx
└── utils/
    └── supabase/
        ├── client.ts
        └── server.ts
middleware.ts (optional)
```

This plan provides a complete OAuth-only authentication system using Supabase Auth with Google and GitHub providers, perfectly suited for your Next.js application hosted on Vercel.