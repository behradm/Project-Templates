import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import * as Button from '@radix-ui/react-button'
import { useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // If user is not logged in, redirect to home
  if (status === 'unauthenticated') {
    router.push('/')
    return null
  }

  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  const handleAiRequest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Hello from the dashboard!' }),
      })
      const data = await response.json()
      setAiResponse(data.message)
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      setAiResponse('Error calling OpenAI API. Please check your API key.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | Next.js Fullstack Template</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button.Root
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </Button.Root>
          </header>
          
          <main>
            <div className="mt-8 bg-white p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome, {session?.user?.name || session?.user?.email || 'User'}!
              </h2>
              <p className="mb-4">
                You've successfully logged in to the Next.js Fullstack Template.
              </p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">OpenAI Integration Test</h3>
                <Button.Root
                  onClick={handleAiRequest}
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isLoading ? 'Loading...' : 'Test OpenAI API'}
                </Button.Root>
                {aiResponse && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">Response: {aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
