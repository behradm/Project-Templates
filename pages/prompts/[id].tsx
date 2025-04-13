import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PromptFormData, Folder, Tag } from '@/types';
import { ArrowLeftIcon, ClipboardIcon, PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function PromptDetail() {
  const router = useRouter();
  const { id: promptId } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [folderId, setFolderId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch the prompt
  const { data: prompt, error: promptError } = useSWR(
    promptId ? `/api/prompts/${promptId}` : null,
    fetcher
  );
  
  // Fetch folders
  const { data: folders = [] } = useSWR<Folder[]>('/api/folders', fetcher);
  
  // Fetch tags
  const { data: tags = [] } = useSWR<Tag[]>('/api/tags', fetcher);
  
  // Initialize form values when prompt data is loaded
  React.useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setBody(prompt.body);
      setFolderId(prompt.folderId);
      setSelectedTags(prompt.tags.map((tag: Tag) => tag.id));
    }
  }, [prompt]);
  
  const handleCopyToClipboard = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt.body);
      
      // Increment the copy count
      await axios.post('/api/prompts/increment-copy', { promptId: promptId });
      
      // Update the local data
      mutate(`/api/prompts/${promptId}`);
      
      // Show visual feedback
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
      
      // Show success toast
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const handleDeletePrompt = async () => {
    if (!prompt) return;
    
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.delete(`/api/prompts/${promptId}`);
      
      // Navigate back to the main prompts page
      router.push('/prompts');
      
      // Show success toast
      toast.success('Prompt deleted!');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      toast.error('Failed to delete prompt');
      setIsLoading(false);
    }
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  const handleUpdatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) return;
    
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!body.trim()) {
      toast.error('Prompt body is required');
      return;
    }
    
    if (!folderId) {
      toast.error('Please select a folder');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.put(`/api/prompts/${promptId}`, {
        title,
        body,
        folderId,
        tagIds: selectedTags,
      });
      
      // Update the local data
      mutate(`/api/prompts/${promptId}`);
      
      // Show success toast
      toast.success('Prompt updated!');
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update prompt:', error);
      toast.error('Failed to update prompt');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (promptError) {
    return (
      <MainLayout title="Prompt Not Found | Prompt Saver">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Prompt Not Found
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The prompt you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => router.push('/prompts')}
              className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-teal-100 dark:bg-teal-800 dark:hover:bg-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Back to Prompts
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${prompt?.title || 'Prompt'} | Prompt Saver`}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center px-3 py-2 text-sm font-medium text-teal-700 bg-teal-100 hover:bg-teal-200 dark:text-teal-100 dark:bg-teal-800 dark:hover:bg-teal-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              disabled={!prompt}
            >
              {copiedToClipboard ? (
                <CheckIcon className="h-5 w-5 mr-1" />
              ) : (
                <ClipboardIcon className="h-5 w-5 mr-1" />
              )}
              {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!prompt}
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={handleDeletePrompt}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-100 dark:bg-red-800 dark:hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={!prompt || isLoading}
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        {!prompt ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            </div>
          </div>
        ) : isEditing ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <form onSubmit={handleUpdatePrompt} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter a title for your prompt"
                />
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prompt Body
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-teal-500 sm:text-sm font-mono"
                  placeholder="Enter your prompt text here"
                />
              </div>
              
              <div>
                <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Folder
                </label>
                <select
                  id="folder"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option value="">Select a folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag.id)
                          ? 'bg-teal-600 text-white dark:bg-teal-700 dark:text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                  
                  {tags.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No tags available. Create some tags first.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {prompt.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              <span className="mr-4">
                Folder: <span className="font-medium">{prompt.folder.name}</span>
              </span>
              <span className="mr-4">
                Copied: <span className="font-medium">{prompt.copyCount} times</span>
              </span>
              <span>
                Created: <span className="font-medium">{new Date(prompt.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
            
            {prompt.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag: Tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 font-mono text-sm whitespace-pre-wrap break-words">
              {prompt.body}
            </div>
          </div>
        )}
      </div>
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
