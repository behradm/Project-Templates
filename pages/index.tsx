import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { BookmarkIcon, TagIcon, FolderIcon, MagnifyingGlassIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#032024] text-white">
      <Head>
        <title>Prompt Saver - Organize Your Prompts</title>
        <meta name="description" content="Prompt Saver - A simple way to store, organize, and manage your prompts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <BookmarkIcon className="h-8 w-8 text-[#FA3811]" />
          <span className="ml-2 text-xl font-normal">Prompt Saver</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="#how-it-works" className="hover:text-[#FA3811] transition-colors">How it works</a>
            </li>
            <li>
              <a href="#features" className="hover:text-[#FA3811] transition-colors">Features</a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-[#FA3811] transition-colors">Pricing</a>
            </li>
            {!session ? (
              <>
                <li>
                  <button 
                    onClick={() => signIn(undefined, { callbackUrl: '/prompts' })} 
                    className="hover:text-[#FA3811] transition-colors font-normal"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <Link 
                    href="/auth/signup" 
                    className="bg-[#FA3811] hover:bg-[#e53411] px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  href="/prompts" 
                  className="bg-[#FA3811] hover:bg-[#e53411] px-4 py-2 rounded-lg transition-colors"
                >
                  Go to App
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section - Redesigned based on the provided template */}
        <section className="container mx-auto px-4 py-16 bg-[#EBF1FB]/5 rounded-lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-[#032824] px-3 py-1 rounded-full text-sm">
              <span className="mr-2">✨</span> Instant Markdown Editing
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-normal leading-tight mb-6">
              Track, Analyze, and Grow Your<br />Prompts with Ease
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-normal">
              Get real-time insights on your favorite prompts, organize with tags and folders,
              all in one place
            </p>
          </div>

          <div className="flex justify-center mb-12">
            {!session ? (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/prompts' })}
                className="bg-[#FA3811] hover:bg-[#e53411] px-6 py-3 rounded-lg text-lg font-normal transition-colors"
              >
                Start your free trial
              </button>
            ) : (
              <Link 
                href="/prompts" 
                className="bg-[#FA3811] hover:bg-[#e53411] px-6 py-3 rounded-lg text-lg font-normal transition-colors text-center"
              >
                Go to Your Prompts
              </Link>
            )}
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-2xl border border-[#153A42] max-w-6xl mx-auto">
            <div className="bg-gradient-to-b from-[#032024] to-[#011B1F] p-4 rounded-t-lg border-b border-[#153A42]">
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-[#FA3811]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFC107]"></div>
                <div className="h-3 w-3 rounded-full bg-[#4CAF50]"></div>
              </div>
            </div>
            <div className="bg-[#011B1F] p-1">
              <img 
                src="/images/prompt-app-screenshot.svg" 
                alt="Prompt Saver Interface" 
                className="w-full rounded"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-[#011B1F] py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-normal text-center mb-16">
              Features Designed for <span className="text-[#FA3811]">Prompt Engineers</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <FolderIcon className="h-8 w-8 text-[#FA3811]" />
                </div>
                <h3 className="text-xl font-normal mb-3">Folder Organization</h3>
                <p className="text-gray-300">
                  Keep your prompts organized with custom folders for different projects, clients, or use cases.
                </p>
              </div>
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <TagIcon className="h-8 w-8 text-[#FA3811]" />
                </div>
                <h3 className="text-xl font-normal mb-3">Tagging System</h3>
                <p className="text-gray-300">
                  Add tags to your prompts for easy filtering and create a flexible organizational structure.
                </p>
              </div>
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 text-[#FA3811]" />
                </div>
                <h3 className="text-xl font-normal mb-3">Powerful Search</h3>
                <p className="text-gray-300">
                  Quickly find the exact prompt you need with our PostgreSQL full-text search capability.
                </p>
              </div>
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <ClipboardDocumentIcon className="h-8 w-8 text-[#FA3811]" />
                </div>
                <h3 className="text-xl font-normal mb-3">One-Click Copy</h3>
                <p className="text-gray-300">
                  Copy any prompt to your clipboard with a single click, complete with visual feedback.
                </p>
              </div>
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <svg className="h-8 w-8 text-[#FA3811]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-normal mb-3">Private & Secure</h3>
                <p className="text-gray-300">
                  Your prompts are private to your account. No one else can access your valuable prompt library.
                </p>
              </div>
              <div className="bg-[#032024] p-6 rounded-xl">
                <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-block mb-4">
                  <svg className="h-8 w-8 text-[#FA3811]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-normal mb-3">Responsive Design</h3>
                <p className="text-gray-300">
                  Access your prompts from any device with our mobile-friendly, responsive interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-normal text-center mb-16">
              How <span className="text-[#FA3811]">Prompt Saver</span> Works
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-5 top-0 h-full w-1 bg-[#011B1F]"></div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex items-start">
                    <div className="bg-[#FA3811] rounded-full h-10 w-10 flex items-center justify-center font-normal">1</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-normal mb-2">Create an Account</h3>
                      <p className="text-gray-300">
                        Sign up with your email or GitHub account to get started with Prompt Saver.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex items-start">
                    <div className="bg-[#FA3811] rounded-full h-10 w-10 flex items-center justify-center font-normal">2</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-normal mb-2">Organize Your Workspace</h3>
                      <p className="text-gray-300">
                        Create folders and tags to organize your prompts based on your workflow and preferences.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mb-12">
                  <div className="flex items-start">
                    <div className="bg-[#FA3811] rounded-full h-10 w-10 flex items-center justify-center font-normal">3</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-normal mb-2">Add Your Prompts</h3>
                      <p className="text-gray-300">
                        Save your favorite and most effective prompts with titles, tags, and organize them into folders.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start">
                    <div className="bg-[#FA3811] rounded-full h-10 w-10 flex items-center justify-center font-normal">4</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-normal mb-2">Use Anytime, Anywhere</h3>
                      <p className="text-gray-300">
                        Quickly find and copy the prompts you need whenever you're working with AI tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#011B1F] py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-normal mb-6">
              Ready to Organize Your <span className="text-[#FA3811]">Prompt Library</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-normal">
              Join Prompt Saver today and take control of your AI prompts. Your future self will thank you.
            </p>
            {!session ? (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/prompts' })}
                className="bg-[#FA3811] hover:bg-[#e53411] px-8 py-3 rounded-lg text-lg font-normal transition-colors"
              >
                Get Started Now
              </button>
            ) : (
              <Link 
                href="/prompts" 
                className="bg-[#FA3811] hover:bg-[#e53411] px-8 py-3 rounded-lg text-lg font-normal transition-colors inline-block"
              >
                Go to Your Dashboard
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[#032024] border-t border-[#011B1F] py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BookmarkIcon className="h-8 w-8 text-[#FA3811]" />
              <span className="ml-2 text-xl font-normal">Prompt Saver</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Prompt Saver. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
