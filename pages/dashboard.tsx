import { GetServerSideProps } from 'next'
import { getSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '../components/ui/Dialog'
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '../components/ui/Tabs'
import { 
  ToastProvider, 
  Toast, 
  ToastTitle, 
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport
} from '../components/ui/Toast'

export default function Dashboard() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <ToastProvider>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Journal Dashboard</h1>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome to your journal dashboard!</h2>
            <p className="text-slate-600 mb-6">
              This page demonstrates some of the Radix UI components we've added to the project.
            </p>
            
            {/* Dialog Example */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Dialog Component</h3>
              <Dialog>
                <DialogTrigger className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Open Dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Welcome to Radix UI</DialogTitle>
                    <DialogDescription>
                      This is a dialog component from Radix UI Primitives, styled with Tailwind CSS.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>Dialogs are perfect for modal content like forms, confirmations, and alerts.</p>
                  </div>
                  <DialogFooter>
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => setShowToast(true)}
                    >
                      Show Toast
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Tabs Example */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Tabs Component</h3>
              <Tabs defaultValue="entries">
                <TabsList>
                  <TabsTrigger value="entries">Journal Entries</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="entries" className="p-4 border rounded-md mt-2">
                  <h4 className="font-medium mb-2">Your Recent Journal Entries</h4>
                  <p className="text-slate-600">You haven't created any journal entries yet.</p>
                </TabsContent>
                <TabsContent value="stats" className="p-4 border rounded-md mt-2">
                  <h4 className="font-medium mb-2">Your Journaling Statistics</h4>
                  <p className="text-slate-600">You'll see your journaling patterns here once you start writing.</p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 border rounded-md mt-2">
                  <h4 className="font-medium mb-2">Journal Settings</h4>
                  <p className="text-slate-600">Customize your journaling experience here.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        {showToast && (
          <Toast open={showToast} onOpenChange={setShowToast}>
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>The toast notification has been triggered.</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
