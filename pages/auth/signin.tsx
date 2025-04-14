import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen flex flex-col md:flex-row bg-primary">
      <Head>
        <title>Sign In | Prompt Saver</title>
        <meta name="description" content="Sign in to your Prompt Saver account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Left column - Brand/Image */}
      <div className="hidden md:flex md:w-1/2 bg-[#011B1F] relative overflow-hidden items-center justify-center">
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-[#FA3811]" />
            <span className="ml-2 text-xl font-normal text-white">Prompt Saver</span>
          </Link>
        </div>
        
        <div className="absolute top-6 right-6 z-10">
          <Link href="/" className="flex items-center text-white/80 hover:text-white transition-colors text-sm">
            <span className="mr-1">Back to website</span>
            <ArrowLeftIcon className="h-4 w-4 transform rotate-180" />
          </Link>
        </div>
        
        {/* Placeholder image */}
        <div className="relative w-4/5 h-4/5 mx-auto">
          <Image 
            src="/images/prompt-placeholder.svg" 
            alt="Prompt Saver" 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        {/* Tagline at bottom */}
        <div className="absolute bottom-16 left-0 w-full px-12 z-10">
          <h2 className="text-3xl font-normal text-white leading-snug">
            Capturing Prompts,<br />Creating Intelligence
          </h2>
        </div>
      </div>

      {/* Right column - Form */}
      <div className="flex-1 md:w-1/2 flex flex-col">
        <div className="md:hidden py-6 px-6">
          <Link href="/" className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-[#FA3811]" />
            <span className="ml-2 text-xl font-normal text-white">Prompt Saver</span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-normal text-white mb-2">Sign In</h1>
            <p className="text-gray-400 mb-8">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#FA3811] hover:underline">
                Sign Up
              </Link>
            </p>
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-100 rounded-md text-sm">
                {error === 'CredentialsSignin' ? 'Invalid email or password' : error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-normal text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-3 bg-[#011B1F] border border-[#1A2A32] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FA3811] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-normal text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-3 bg-[#011B1F] border border-[#1A2A32] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FA3811] focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-[#FA3811] text-white rounded-md hover:bg-[#e53411] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1A2A32]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#032024] text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => signIn('github', { callbackUrl: callbackUrl as string || '/prompts' })}
                  className="flex-1 flex justify-center items-center px-4 py-2 bg-[#24292F] text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292F] transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
                
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: callbackUrl as string || '/prompts' })}
                  className="flex-1 flex justify-center items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                    <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                    <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
