import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Call - Sharp Ireland',
  description: 'Join a video call session with Sharp Ireland',
  robots: 'noindex, nofollow', // Prevent indexing of meeting pages
};

export default function MeetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="meet-layout">
      {children}
    </div>
  );
}