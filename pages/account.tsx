import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import MainLayout from '@/components/layout/MainLayout';
import { useTheme } from '@/contexts/ThemeContext';

export default function Account() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status messages
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/user/change-password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        setPasswordSuccess('Password changed successfully');
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password changed successfully');
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || 'Failed to change password');
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Account Settings">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-normal mb-4">Theme Preference</h2>
            <button
              onClick={toggleTheme}
              className="px-3 py-2 bg-[#011B1F] hover:bg-[#032024] rounded-full hover:bg-opacity-80 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-indigo-400" />
              )}
            </button>
          </div>
          <p className="text-gray-300">
            Current theme: <span className="font-normal">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </p>
        </div>
        
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-normal mb-4">Email & Password</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-normal text-gray-300 mb-1">
              Email Address
            </label>
            <div className="px-3 py-2 bg-input border border-themed rounded-md">
              {session?.user?.email}
            </div>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="font-normal">Change Password</h3>
            
            {passwordError && (
              <div className="p-3 bg-red-500/20 border border-red-500 text-red-100 rounded-md text-sm">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="p-3 bg-green-500/20 border border-green-500 text-green-100 rounded-md text-sm">
                {passwordSuccess}
              </div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-normal text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-themed rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-normal text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-themed rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-normal text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-themed rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-[#FA3811] hover:bg-[#e53411] text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] disabled:opacity-50 font-normal"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
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
    props: {
      session,
    },
  };
};
