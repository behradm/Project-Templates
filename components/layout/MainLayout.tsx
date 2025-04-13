import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BookmarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function MainLayout({ children, title = 'Prompt Saver' }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  const { theme } = useTheme();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !session && !router.pathname.startsWith('/auth')) {
      router.push('/auth/signin');
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Organize and save your prompts with Prompt Saver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-secondary shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center">
                  <BookmarkIcon className="h-8 w-8 text-accent" />
                  <span className="ml-2 text-xl font-bold">Prompt Saver</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {session && (
                <div className="flex items-center space-x-4">
                  <Link href="/account" className="flex items-center text-primary hover:text-accent">
                    <UserCircleIcon className="h-5 w-5 mr-1" />
                    <span>Account</span>
                  </Link>
                  <div className="flex items-center">
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.email || 'User'} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
                        {session.user.email ? session.user.email[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="ml-2 text-primary">
                      {session.user.email}
                    </span>
                  </div>
                  <Link href="/api/auth/signout" className="text-primary hover:text-red-500">
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-secondary shadow mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-secondary">
            &copy; {new Date().getFullYear()} Prompt Saver. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
