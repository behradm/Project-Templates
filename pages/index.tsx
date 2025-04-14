import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { BookmarkIcon, TagIcon, FolderIcon, MagnifyingGlassIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

// Import ParticlesBackground with SSR disabled to avoid hydration errors
const ParticlesBackground = dynamic(
  () => import('../components/ParticlesBackground'),
  { ssr: false }
);

export default function Home() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#032024] to-[#011518] text-white overflow-x-hidden">
      <Head>
        <title>Prompt Saver - Organize Your Prompts</title>
        <meta name="description" content="Prompt Saver - A simple way to store, organize, and manage your prompts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Premium Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className={`mx-auto px-6 max-w-7xl transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-[#021820]/80 shadow-md rounded-lg mt-2 border border-white/5' : 'bg-transparent'}`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FA3811] to-[#FA3811]/40 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                <BookmarkIcon className="h-6 w-6 text-[#FA3811] relative z-10 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="ml-2 text-base font-normal relative">
                Prompt Saver
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#FA3811] group-hover:w-full transition-all duration-300"></span>
              </span>
            </div>

            {/* Nav Links */}
            <nav>
              <ul className="flex items-center space-x-6">
                <li className="relative group">
                  <a href="#how-it-works" className="py-2 text-sm text-gray-200 hover:text-white transition-colors">
                    How it works
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA3811] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li className="relative group">
                  <a href="#features" className="py-2 text-sm text-gray-200 hover:text-white transition-colors">
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA3811] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li className="relative group">
                  <a href="#pricing" className="py-2 text-sm text-gray-200 hover:text-white transition-colors">
                    Pricing
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA3811] group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                
                {!session ? (
                  <>
                    <li className="relative group">
                      <button 
                        onClick={() => signIn(undefined, { callbackUrl: '/prompts' })} 
                        className="py-2 text-sm text-gray-200 hover:text-white transition-colors"
                      >
                        Login
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FA3811] group-hover:w-full transition-all duration-300"></span>
                      </button>
                    </li>
                    <li>
                      <Link 
                        href="/auth/signup" 
                        className="inline-flex items-center justify-center px-4 py-1.5 overflow-hidden font-normal text-sm text-white rounded-full bg-[#FA3811] hover:bg-[#e53411] transition-colors duration-300"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      href="/prompts" 
                      className="inline-flex items-center justify-center px-4 py-1.5 overflow-hidden font-normal text-sm text-white rounded-full bg-[#FA3811] hover:bg-[#e53411] transition-colors duration-300"
                    >
                      Go to App
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Empty div to push content down when header is fixed */}
      <div className="h-20"></div>

      <main>
        {/* Hero Section with animated particles and centered layout */}
        <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
          {/* Background gradient and particle effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#032024] to-[#01171C] z-0">
            <ParticlesBackground />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FA3811] rounded-full filter blur-[120px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FA3811] rounded-full filter blur-[150px] opacity-5 transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-normal leading-tight mb-6">
                <span className="relative">
                  The App to <span className="relative">
                    <span className="absolute -inset-1 bg-[#FA3811]/10 blur-sm"></span>
                    <span className="relative text-[#FA3811]">Sort</span>
                  </span> All
                </span>
                <br />
                <span className="relative">
                  Your <span className="relative">
                    <span className="absolute -inset-1 bg-[#FA3811]/10 blur-sm"></span>
                    <span className="relative text-[#FA3811]">Prompts</span>
                  </span>
                </span>
              </h1>
              
              <p className="text-base text-gray-300 mb-12 leading-relaxed max-w-2xl">
                Digging through a pile of notes to find that one prompt you need is the worst, isn't it? 
                Let's make it way easier. Prompt Saver lets you search through everything—title, tags, whatever—and 
                pull up what you need in a flash. No more treasure hunt.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                {!session ? (
                  <button
                    onClick={() => signIn(undefined, { callbackUrl: '/prompts' })}
                    className="relative px-8 py-4 rounded-full font-normal overflow-hidden group bg-[#FA3811] hover:bg-[#E53E3E] text-white shadow-xl transition-colors duration-300"
                  >
                    <div className="relative flex items-center justify-center">
                      <span>Start organizing prompts</span>
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </button>
                ) : (
                  <Link 
                    href="/prompts" 
                    className="relative px-8 py-4 rounded-full font-normal overflow-hidden bg-[#FA3811] hover:bg-[#E53E3E] text-white shadow-xl transition-colors duration-300 flex items-center justify-center"
                  >
                    <span>Go to Your Prompts</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#FA3811]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>First 100 users free forever</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-[#FA3811]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>No credit card required</span>
                </div>
              </div>
              
              {/* App screenshot now moved below the text */}
              <div className="mt-20 w-full max-w-5xl mx-auto">
                <div className="relative z-10 backdrop-blur-md bg-gradient-to-b from-[#032024]/90 to-[#011518]/90 p-4 rounded-xl border border-[#153A42] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FA3811]/5 to-transparent opacity-50 rounded-xl"></div>
                  <div className="flex space-x-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-[#FA3811]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#FFC107]"></div>
                    <div className="h-3 w-3 rounded-full bg-[#4CAF50]"></div>
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-[#153A42]/50">
                    <img 
                      src="/images/prompt-app-screenshot.svg" 
                      alt="Prompt Saver Interface" 
                      className="w-full rounded relative z-10"
                    />
                    
                    {/* Overlay glow effects */}
                    <div className="absolute top-1/4 right-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[70px] opacity-20 z-0"></div>
                    <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[50px] opacity-10 z-0"></div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#FA3811]/10 rounded-full filter blur-[20px]"></div>
                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#FA3811]/5 rounded-full filter blur-[20px]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#011518] to-[#01171C] z-0"></div>
          <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-[#032024] to-transparent z-0"></div>
          <div className="absolute -left-32 top-1/4 w-64 h-64 bg-[#FA3811] rounded-full filter blur-[120px] opacity-5"></div>
          <div className="absolute -right-32 bottom-1/4 w-64 h-64 bg-[#FA3811] rounded-full filter blur-[120px] opacity-5"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-6">
                Features Designed for <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-[#FA3811]/10 blur-sm"></span>
                  <span className="relative text-[#FA3811]">Prompt Engineers</span>
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Tools that make managing your prompts effortless and effective
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <FolderIcon className="h-8 w-8 text-[#FA3811]" />
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">Folder Organization</h3>
                  <p className="text-gray-300 relative z-10">
                    Keep your prompts organized with custom folders for different projects, clients, or use cases.
                  </p>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <TagIcon className="h-8 w-8 text-[#FA3811]" />
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">Tagging System</h3>
                  <p className="text-gray-300 relative z-10">
                    Add tags to your prompts for easy filtering and create a flexible organizational structure.
                  </p>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <MagnifyingGlassIcon className="h-8 w-8 text-[#FA3811]" />
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">Powerful Search</h3>
                  <p className="text-gray-300 relative z-10">
                    Quickly find the exact prompt you need with our PostgreSQL full-text search capability.
                  </p>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <ClipboardDocumentIcon className="h-8 w-8 text-[#FA3811]" />
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">One-Click Copy</h3>
                  <p className="text-gray-300 relative z-10">
                    Copy any prompt to your clipboard with a single click, complete with visual feedback.
                  </p>
                </div>
              </div>

              {/* Feature Card 5 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <svg className="h-8 w-8 text-[#FA3811]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">Private & Secure</h3>
                  <p className="text-gray-300 relative z-10">
                    Your prompts are private to your account. No one else can access your valuable prompt library.
                  </p>
                </div>
              </div>

              {/* Feature Card 6 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-[#FA3811]/20 to-[#FA3811]/0 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-[#032024] to-[#011518] p-8 rounded-xl border border-[#153A42] shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-[#FA3811]/30 h-full overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[80px] opacity-5 transition-opacity duration-300 group-hover:opacity-10"></div>
                  
                  <div className="bg-[#FA3811]/10 p-3 rounded-lg inline-flex items-center justify-center mb-6 relative z-10">
                    <svg className="h-8 w-8 text-[#FA3811]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-normal mb-4 relative z-10">Responsive Design</h3>
                  <p className="text-gray-300 relative z-10">
                    Access your prompts from any device with our mobile-friendly, responsive interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-24 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#01171C] to-[#032024] z-0"></div>
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#FA3811] rounded-full filter blur-[150px] opacity-5 z-0"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#FA3811] rounded-full filter blur-[100px] opacity-5 z-0"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal mb-6">
                How <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-[#FA3811]/10 blur-sm"></span>
                  <span className="relative text-[#FA3811]">Prompt Saver</span>
                </span> Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A streamlined experience from sign-up to daily usage
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto relative">
              {/* Timeline connector line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FA3811]/50 via-[#FA3811]/20 to-[#FA3811]/5 transform md:translate-x-px"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 mb-16 md:mb-24">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0 order-2 md:order-1">
                    <h3 className="text-2xl font-normal mb-4">Create an Account</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Sign up with your email or GitHub account to get started with Prompt Saver. Your data is securely stored and accessible only to you.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center order-1 md:order-2 w-full md:w-1/2 md:pl-12 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#FA3811]/30 to-[#FA3811]/5 blur-md opacity-60"></div>
                      <div className="bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 rounded-full h-14 w-14 flex items-center justify-center font-normal text-xl relative">
                        1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 mb-16 md:mb-24">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center order-1 w-full md:w-1/2 md:pr-12 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#FA3811]/30 to-[#FA3811]/5 blur-md opacity-60"></div>
                      <div className="bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 rounded-full h-14 w-14 flex items-center justify-center font-normal text-xl relative">
                        2
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 md:text-left order-2 mt-8 md:mt-0">
                    <h3 className="text-2xl font-normal mb-4">Organize Your Workspace</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Create custom folders to categorize your prompts by project, topic, or use case. Set up tags with colors for a flexible labeling system.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 mb-16 md:mb-24">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1 mb-8 md:mb-0">
                    <h3 className="text-2xl font-normal mb-4">Add Your Prompts</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Store your effective prompts with rich markdown formatting. Add tags, assign folders, and keep your best AI conversation starters organized.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center order-1 md:order-2 w-full md:w-1/2 md:pl-12 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#FA3811]/30 to-[#FA3811]/5 blur-md opacity-60"></div>
                      <div className="bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 rounded-full h-14 w-14 flex items-center justify-center font-normal text-xl relative">
                        3
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="flex items-center justify-center order-1 w-full md:w-1/2 md:pr-12 mb-6 md:mb-0">
                    <div className="relative">
                      <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-[#FA3811]/30 to-[#FA3811]/5 blur-md opacity-60"></div>
                      <div className="bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 rounded-full h-14 w-14 flex items-center justify-center font-normal text-xl relative">
                        4
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 md:text-left order-2 mt-8 md:mt-0">
                    <h3 className="text-2xl font-normal mb-4">Use Anytime, Anywhere</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Quickly find and copy the prompts you need with our powerful search. Your entire prompt library is accessible across all your devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#032024] to-[#011518] z-0"></div>
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#032024] to-transparent z-0"></div>
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-[#FA3811] rounded-full filter blur-[100px] opacity-5 z-0"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FA3811] rounded-full filter blur-[150px] opacity-5 z-0"></div>
          
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="bg-gradient-to-br from-[#032024]/90 to-[#011518]/90 p-12 rounded-2xl border border-[#153A42] shadow-2xl backdrop-blur-sm relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FA3811] rounded-full filter blur-[100px] opacity-10 z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FA3811] rounded-full filter blur-[50px] opacity-5 z-0"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-normal text-center mb-6">
                  Ready to Organize Your <span className="relative inline-block">
                    <span className="absolute -inset-1 bg-[#FA3811]/10 blur-sm"></span>
                    <span className="relative text-[#FA3811]">Prompt Library</span>
                  </span>?
                </h2>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-normal text-center">
                  Join Prompt Saver today and take control of your AI prompts. Your future self will thank you.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
                  {!session ? (
                    <button
                      onClick={() => signIn(undefined, { callbackUrl: '/prompts' })}
                      className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-normal text-white rounded-full group"
                    >
                      <span className="absolute w-full h-full bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 group-hover:from-[#FA3811] group-hover:to-[#E53E3E] transition-all duration-500 ease-out rounded-full"></span>
                      <span className="relative flex items-center">
                        Get Started Now
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <Link 
                      href="/prompts" 
                      className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-normal text-white rounded-full group"
                    >
                      <span className="absolute w-full h-full bg-gradient-to-br from-[#FA3811] to-[#FA3811]/80 group-hover:from-[#FA3811] group-hover:to-[#E53E3E] transition-all duration-500 ease-out rounded-full"></span>
                      <span className="relative flex items-center">
                        Go to Your Dashboard
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </Link>
                  )}
                </div>
                
                <div className="flex justify-center items-center space-x-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-normal text-[#FA3811]">500+</div>
                    <div className="text-sm text-gray-400">Prompts Saved</div>
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-[#153A42] to-transparent"></div>
                  <div className="text-center">
                    <div className="text-3xl font-normal text-[#FA3811]">250+</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="h-10 w-px bg-gradient-to-b from-[#153A42] to-transparent"></div>
                  <div className="text-center">
                    <div className="text-3xl font-normal text-[#FA3811]">4.9/5</div>
                    <div className="text-sm text-gray-400">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-12 border-t border-[#153A42]/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#011518] to-[#021820] z-0"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FA3811] to-[#FA3811]/40 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                  <BookmarkIcon className="h-8 w-8 text-[#FA3811] relative z-10" />
                </div>
                <span className="ml-2 text-xl font-normal">Prompt Saver</span>
              </div>
              
              <div className="flex space-x-8 mb-6 md:mb-0">
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              </div>
              
              <div className="flex space-x-4">
                <a href="https://twitter.com" className="text-gray-400 hover:text-[#FA3811] transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-[#FA3811] transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-[#FA3811] transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-[#153A42]/30 mt-8 pt-8 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
              <div>&copy; {new Date().getFullYear()} Prompt Saver. All rights reserved.</div>
              <div className="mt-4 md:mt-0">
                <a href="/terms" className="hover:text-white mr-4 transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
