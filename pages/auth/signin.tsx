import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function SignIn() {
  // Tab state (signin or signup)
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Error and loading states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { error: errorParam } = router.query;

  // Handle sign in/up submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      // Validate confirm password
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Call signup API route
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to sign up');
        }
        
        // After signup, sign in
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/dashboard',
          redirect: true,
        });
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setIsLoading(false);
      }
    } else {
      // Sign in with NextAuth
      try {
        const result = await signIn('credentials', {
          email,
          password,
          callbackUrl: '/dashboard',
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }
        
        // Successful sign in - redirect to dashboard
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Invalid email or password');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#032024] flex">
      <Head>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} | Next.js Fullstack Template</title>
        <meta name="description" content="Sign in or sign up to access your Next.js fullstack app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Left column - Branding */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-[#011B1F] p-12 justify-center">
        <Link href="/" className="text-white text-xl font-bold mb-16">
          Next.js Template
        </Link>
        
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">
            <span>Launch Your App </span>
            <span className="text-[#FA3811]">In Days</span>
          </h1>
          <p className="text-gray-300 text-xl mb-8">
            Stop wasting time configuring boilerplate code. Our pre-built fullstack template gives you everything you need.
          </p>
          <div className="flex space-x-6 mt-12">
            <div className="flex items-center">
              <div className="icon-bg-accent rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">NextAuth Authentication</span>
            </div>
            <div className="flex items-center">
              <div className="icon-bg-accent rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white">Prisma ORM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to home on mobile */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-white text-xl font-bold">
              Next.js Template
            </Link>
          </div>

          {/* Auth card */}
          <div className="bg-[#011B1F] rounded-lg shadow-lg p-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`py-2 px-4 text-sm font-medium ${!isSignUp ? 'text-[#FA3811] border-b-2 border-[#FA3811]' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${isSignUp ? 'text-[#FA3811] border-b-2 border-[#FA3811]' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>

            {/* Error message */}
            {(error || errorParam) && (
              <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-4">
                {error || (errorParam === 'CredentialsSignin' ? 'Invalid email or password' : errorParam)}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#032024] border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FA3811] focus:border-[#FA3811] sm:text-sm text-white"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-[#032024] border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FA3811] focus:border-[#FA3811] sm:text-sm text-white"
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-[#032024] border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FA3811] focus:border-[#FA3811] sm:text-sm text-white"
                  />
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FA3811] hover:bg-[#e63510] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#011B1F] text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </button>
                
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                  className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
