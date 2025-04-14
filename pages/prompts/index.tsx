import React, { useState, useEffect } from 'react';
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
import TagManager from '@/components/tags/TagManager';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PromptFormData, FolderFormData, Folder, Prompt, Tag } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function PromptsIndex() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPromptFormOpen, setIsPromptFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch folders
  const { data: folders = [] } = useSWR<Folder[]>('/api/folders', fetcher);
  
  // Fetch tags
  const { data: tags = [] } = useSWR<Tag[]>('/api/tags', fetcher);
  
  // Build the prompts API URL with query parameters
  const promptsUrl = `/api/prompts?${searchQuery ? `searchQuery=${encodeURIComponent(searchQuery)}` : ''}${
    selectedTags.length ? `&tagIds=${selectedTags.join(',')}` : ''
  }`;
  
  // Fetch prompts with search and tag filtering
  const { data: promptsData, error } = useSWR(promptsUrl, fetcher);
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
  
  // Handle creating a new prompt
  const handleCreatePrompt = async (data: PromptFormData) => {
    setIsLoading(true);
    
    try {
      await axios.post('/api/prompts', data);
      
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
  
  // Handle creating a new folder
  const handleCreateFolder = async (data: FolderFormData) => {
    setIsLoading(true);
    
    try {
      await axios.post('/api/folders', data);
      
      // Update the local data
      mutate('/api/folders');
      
      // Show success toast
      toast.success('Folder created!');
      
      // Close the form
      setIsFolderFormOpen(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="My Prompts | Prompt Saver">
      <div className="h-[calc(100vh-10rem)] flex">
        <Sidebar 
          folders={folders} 
          onCreateFolder={() => setIsFolderFormOpen(true)} 
        />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between bg-[#032024] shadow">
            <h1 className="text-xl font-normal text-white">
              All Prompts
            </h1>
            
            <button
              onClick={() => setIsPromptFormOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-normal text-white bg-[#FA3811] hover:bg-[#e53411] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              New Prompt
            </button>
          </div>
          
          <div className="p-4 flex justify-between items-center">
            <div className="w-2/3">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search prompts..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <TagManager
                existingTags={tags}
                onSelect={(tagId) => {
                  if (selectedTags.includes(tagId)) {
                    setSelectedTags(selectedTags.filter(id => id !== tagId));
                  } else {
                    setSelectedTags([...selectedTags, tagId]);
                  }
                }}
                selectedTags={selectedTags}
                triggerElement={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary hover:text-accent cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                }
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-[#032024]">
            {error ? (
              <div className="text-center py-12 bg-[#011B1F] shadow rounded-lg">
                <p className="text-red-500 font-normal">Error loading prompts.</p>
              </div>
            ) : !promptsData ? (
              <div className="text-center py-12 bg-[#011B1F] shadow rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA3811] mx-auto"></div>
                <p className="text-gray-400 font-normal mt-4">Loading prompts...</p>
              </div>
            ) : (
              <PromptTable 
                prompts={prompts} 
                onCopy={handleCopyPrompt} 
                onEdit={(id) => {
                  // Instead of using router.push which might trigger authentication issues,
                  // let's create a direct URL navigation
                  window.location.href = `/prompts/${id}`;
                  return Promise.resolve(true);
                }} 
                allTags={tags}
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
      />
      
      {/* Folder Form Modal */}
      <FolderForm
        isOpen={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        onSubmit={handleCreateFolder}
      />
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
