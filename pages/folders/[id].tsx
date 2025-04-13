import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Sidebar from '@/components/ui/Sidebar';
import SearchBar from '@/components/ui/SearchBar';
import PromptTable from '@/components/prompts/PromptTable';
import PromptForm from '@/components/prompts/PromptForm';
import FolderForm from '@/components/folders/FolderForm';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PromptFormData, FolderFormData, Folder, Prompt, Tag } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function FolderDetail() {
  const router = useRouter();
  const { id: folderId } = router.query;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPromptFormOpen, setIsPromptFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch folders
  const { data: folders = [] } = useSWR<Folder[]>('/api/folders', fetcher);
  
  // Fetch the current folder
  const { data: folder, error: folderError } = useSWR<Folder>(
    folderId ? `/api/folders/${folderId}` : null,
    fetcher
  );
  
  // Fetch tags
  const { data: tags = [] } = useSWR<Tag[]>('/api/tags', fetcher);
  
  // Build the prompts API URL with query parameters
  const promptsUrl = `/api/prompts?folderId=${folderId}${
    searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''
  }${selectedTags.length ? `&tagIds=${selectedTags.join(',')}` : ''}`;
  
  // Fetch prompts with folder, search, and tag filtering
  const { data: promptsData, error: promptsError } = useSWR(
    folderId ? promptsUrl : null,
    fetcher
  );
  const prompts = promptsData?.items || [];
  
  // Handle copying a prompt to clipboard
  const handleCopyPrompt = async (id: string, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      
      // Increment the copy count
      await axios.post('/api/prompts/increment-copy', { promptId: id });
      
      // Update the local data
      mutate(promptsUrl);
      
      // Show success toast
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };
  
  // Handle deleting a prompt
  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.delete(`/api/prompts/${id}`);
      
      // Update the local data
      mutate(promptsUrl);
      
      // Show success toast
      toast.success('Prompt deleted!');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('Failed to delete prompt');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle creating a new prompt
  const handleCreatePrompt = async (data: PromptFormData) => {
    setIsLoading(true);
    
    try {
      await axios.post('/api/prompts', {
        ...data,
        // Ensure the prompt is created in this folder
        folderId: folderId as string,
      });
      
      // Update the local data
      mutate(promptsUrl);
      
      // Show success toast
      toast.success('Prompt created!');
      
      // Close the form
      setIsPromptFormOpen(false);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      toast.error('Failed to create prompt');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating a folder
  const handleUpdateFolder = async (data: FolderFormData) => {
    if (!folder) return;
    
    setIsLoading(true);
    
    try {
      await axios.put(`/api/folders/${folderId}`, data);
      
      // Update the local data
      mutate(`/api/folders/${folderId}`);
      mutate('/api/folders');
      
      // Show success toast
      toast.success('Folder updated!');
      
      // Close the form
      setIsFolderFormOpen(false);
    } catch (error) {
      console.error('Failed to update folder:', error);
      toast.error('Failed to update folder');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deleting a folder
  const handleDeleteFolder = async () => {
    if (!folder) return;
    
    setIsLoading(true);
    
    try {
      await axios.delete(`/api/folders/${folderId}`);
      
      // Navigate back to the main prompts page
      router.push('/prompts');
      
      // Show success toast
      toast.success('Folder deleted!');
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
    } finally {
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
    }
  };
  
  // Check if this is the General folder (which cannot be edited or deleted)
  const isGeneralFolder = folder?.name === 'General';

  return (
    <MainLayout title={`${folder?.name || 'Folder'} | Prompt Saver`}>
      <div className="h-[calc(100vh-10rem)] flex">
        <Sidebar 
          folders={folders} 
          onCreateFolder={() => setIsFolderFormOpen(true)} 
        />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-800 shadow">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {folder?.name || 'Loading...'}
              </h1>
              {folder?.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {folder.description}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!isGeneralFolder && (
                <>
                  <button
                    onClick={() => setIsFolderFormOpen(true)}
                    className="flex items-center p-2 text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400 rounded-md"
                    aria-label="Edit folder"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex items-center p-2 text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 rounded-md"
                    aria-label="Delete folder"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </>
              )}
              
              <button
                onClick={() => setIsPromptFormOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                New Prompt
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <SearchBar 
              onSearch={setSearchQuery} 
              onTagFilter={setSelectedTags} 
              tags={tags} 
            />
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
            {folderError || promptsError ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 shadow rounded-lg">
                <p className="text-red-500 dark:text-red-400">Error loading prompts</p>
              </div>
            ) : (
              <PromptTable
                prompts={prompts}
                onDelete={handleDeletePrompt}
                onCopy={handleCopyPrompt}
                onEdit={(id) => router.push(`/prompts/${id}`)}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Prompt Form Modal */}
      <PromptForm
        isOpen={isPromptFormOpen}
        onClose={() => setIsPromptFormOpen(false)}
        onSubmit={handleCreatePrompt}
        folders={folders}
        tags={tags}
        initialData={folder ? { id: '', title: '', body: '', folderId: folder.id, tagIds: [] } : undefined}
      />
      
      {/* Folder Form Modal */}
      {folder && (
        <FolderForm
          isOpen={isFolderFormOpen}
          onClose={() => setIsFolderFormOpen(false)}
          onSubmit={handleUpdateFolder}
          initialData={{
            id: folder.id,
            name: folder.name,
            description: folder.description || '',
          }}
        />
      )}
      
      {/* Delete Folder Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Delete Folder
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete this folder? All prompts will be moved to the General folder.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};
