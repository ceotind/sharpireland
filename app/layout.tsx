import "./globals.css";
import NavBar from "./components/NavBar";
import ServerFooter from "./components/ServerFooter";
import ErrorBoundary from "./components/ErrorBoundary";
import Analytics from "./components/Analytics";
import ClientProviders from "./components/ClientProviders";
import { metadata } from './metadata';
import { createClient } from './utils/supabase/server';
import { UserProfile } from './types/dashboard';
import WebVitalsReporter from './components/WebVitalsReporter';

export { metadata };

// Define type for structured data
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface StructuredData {
  [key: string]: JSONValue;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Try to get the logged-in user
  let userProfile: UserProfile | null = null;
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (!error && data?.user) {
      // User is logged in, get their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (!profileError && profile) {
        userProfile = profile;
      } else if (profileError && profileError.code !== 'PGRST205') {
        console.error('Error fetching user profile:', profileError);
      }
    }
  } catch (error) {
    console.error('Error in layout getting user:', error);
  }
  
  const structuredData: StructuredData[] = [
    // ... (structured data remains the same)
  ];

  return (
    <html lang="en-IE">
      <head>
        {/* ... (head content remains the same) */}
        
        {/* Structured Data */}
        {structuredData.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <Analytics
          gaId={process.env.NEXT_PUBLIC_GA_ID || undefined}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID || undefined}
        />
        <ClientProviders>
          <ErrorBoundary>
            <NavBar user={userProfile} />
            <main>{children}</main>
            <ServerFooter />
          </ErrorBoundary>
        </ClientProviders>
      </body>
    </html>
  );
}
