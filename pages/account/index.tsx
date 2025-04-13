import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/layout/MainLayout';
import { UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default function AccountPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <MainLayout title="Account | Prompt Saver">
        <div className="text-center py-12">
          <p className="text-gray-400">Please sign in to view your account</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Account | Prompt Saver">
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-6">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    className="h-20 w-20 rounded-full mr-6"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-white mr-6">
                    <UserCircleIcon className="h-12 w-12" />
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {session.user.name || 'User'}
                  </h2>
                  <div className="flex items-center text-gray-400 mt-1">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    <span>{session.user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary rounded-md p-4">
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="text-white">{session.user.email}</div>
                </div>
                
                <div className="bg-primary rounded-md p-4">
                  <div className="text-sm text-gray-400">Name</div>
                  <div className="text-white">{session.user.name || 'Not provided'}</div>
                </div>
                
                <div className="bg-primary rounded-md p-4">
                  <div className="text-sm text-gray-400">Authentication Method</div>
                  <div className="text-white">
                    {session.user.image ? 'GitHub' : 'Email and Password'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start">
              <a 
                href="/api/auth/signout"
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
