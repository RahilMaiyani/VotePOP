import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { BackgroundShapes } from '../components/BackgroundShapes';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'VOTEPOP — High Contrast Squad Polls & Decisions',
  description: 'Fast, vibrant voting and decision engine for pickleball, cricket, and friend squads.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-black relative selection:bg-[#FFE600] selection:text-black">
        <AuthProvider>
          <BackgroundShapes />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-8">
              {children}
            </main>
          </div>
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
