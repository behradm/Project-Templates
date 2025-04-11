import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>Next.js Fullstack Template | Launch Your App Faster</title>
        <meta name="description" content="A complete starter template for building modern web applications with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">Next.js Template</span>
              </div>
            </div>
            <div className="flex items-center">
              <a 
                href="https://github.com/behradm/Project-Templates" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                GitHub
              </a>
              <a 
                href="/api/auth/signin"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Launch Your Next.js App</span>
                <span className="block text-blue-600">In Minutes, Not Days</span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                Stop wasting time configuring boilerplate code. Our pre-built fullstack template gives entrepreneurs and developers everything they need to start building instead of setting up.
              </p>
              <div className="mt-10">
                <a
                  href="https://github.com/behradm/Project-Templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Download from GitHub
                </a>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white sm:max-w-md sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden shadow-xl">
                <div className="px-4 py-8 sm:px-10">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex items-center justify-center">
                    <div className="space-y-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        Modern Next.js template with authentication, database, and styling pre-configured
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Complete Solution</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What's Included
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to build modern, full-stack web applications
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Next.js Framework
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      React framework for production with server-side rendering, file-based routing, and API routes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      NeonDB & Prisma
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Serverless PostgreSQL with modern ORM for type-safe database access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Authentication
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      NextAuth.js with GitHub OAuth and email/password authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      Tailwind CSS & Radix UI
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Utility-first CSS framework combined with accessible UI components.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      AI Integration
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Ready-to-use OpenAI API integration for building AI-powered features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      TypeScript
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      Static type checking for improved developer experience and code quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Easy Setup</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How to Get Started
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Get your project up and running in three simple steps
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="font-bold text-lg">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Download the repo from GitHub</h3>
                <p className="mt-2 text-base text-gray-500">
                  Clone the repository to your local machine using Git or download it directly from GitHub.
                </p>
                <div className="mt-4">
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    git clone https://github.com/behradm/Project-Templates.git
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="font-bold text-lg">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Run it on your IDE or cloud environment</h3>
                <p className="mt-2 text-base text-gray-500">
                  Open the project in your favorite IDE like Cursor or deploy it to a cloud development environment with Windsurf.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-700">Install dependencies and start the development server:</p>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    npm install
                    npm run dev
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <span className="font-bold text-lg">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Read the README.md file for instructions</h3>
                <p className="mt-2 text-base text-gray-500">
                  Follow the comprehensive setup guide in the README to configure your environment variables and deploy your app.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc list-inside">
                  <li>Configure your database connection</li>
                  <li>Set up authentication providers</li>
                  <li>Customize as needed for your project</li>
                  <li>Deploy to your preferred hosting platform</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-4 xl:col-span-1">
              <h3 className="text-2xl font-bold text-white">Next.js Templates</h3>
              <p className="text-gray-300 text-base">
                A product of Bonanza Studio
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Rooted in Berlin's vibrant startup ecosystem, we provide CIOs and CDOs immediate access to a fully integrated team of researchers, UX designers, product strategists, and AI technologists. We rapidly design and deliver novel, AI-powered product experiences that redefine industries and outpace competitors.
              </p>
              <div className="mt-4">
                <a
                  href="https://www.bonanza-studios.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Visit Bonanza Studios
                </a>
              </div>
            </div>
            <div className="mt-12 xl:mt-0 xl:col-span-2">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Resources
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="https://nextjs.org/docs" className="text-base text-gray-300 hover:text-white">
                        Next.js Docs
                      </a>
                    </li>
                    <li>
                      <a href="https://tailwindcss.com/docs" className="text-base text-gray-300 hover:text-white">
                        Tailwind CSS
                      </a>
                    </li>
                    <li>
                      <a href="https://www.prisma.io/docs" className="text-base text-gray-300 hover:text-white">
                        Prisma Documentation
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="https://github.com/behradm/Project-Templates/issues" className="text-base text-gray-300 hover:text-white">
                        GitHub Issues
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com/behradm/Project-Templates" className="text-base text-gray-300 hover:text-white">
                        Star on GitHub
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} Bonanza Studios. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
