import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import type { Metadata } from 'next';
import ClientProviders from "./components/ClientProviders"; // Import the new ClientProviders

export const metadata: Metadata = {
  title: 'My Next.js Site',
  description: 'A beautiful Next.js site',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientProviders> {/* Use ClientProviders to wrap theme and main content */}
          <NavBar />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
