import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default function SignIn() {
  const router = useRouter();
  const { error: queryError, callbackUrl } = router.query;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(queryError as string || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Redirect to callback URL or prompts page
        router.push(callbackUrl as string || '/prompts');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Head>
        <title>Sign In | Prompt Saver</title>
        <meta name="description" content="Sign in to your Prompt Saver account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-accent" />
            <span className="ml-2 text-xl font-bold">Prompt Saver</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-secondary p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded-md text-sm">
              {error === 'CredentialsSignin' ? 'Invalid email or password' : error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-input border border-themed rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-input border border-themed rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <p className="text-sm text-secondary text-center">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-accent hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (session) {
    return {
      redirect: {
        destination: '/prompts',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};
