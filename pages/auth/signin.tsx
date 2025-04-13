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
    <div className="min-h-screen bg-[#032024] text-white">
      <Head>
        <title>Sign In | Prompt Saver</title>
        <meta name="description" content="Sign in to your Prompt Saver account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-[#FA3811]" />
            <span className="ml-2 text-xl font-bold">Prompt Saver</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-[#011B1F] p-8 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Your Account</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded-md text-sm">
              {error === 'CredentialsSignin' ? 'Invalid email or password' : error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FA3811] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FA3811] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FA3811] hover:bg-[#e53411] px-4 py-2 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#011B1F] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signIn('github', { callbackUrl: callbackUrl as string || '/prompts' })}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Continue with GitHub
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#FA3811] hover:text-[#e53411]">
                Sign up
              </Link>
            </p>
          </div>
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
