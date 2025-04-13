import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Prompt, Folder, Tag, PromptFormData } from '@/types';
import { ArrowLeftIcon, ClipboardIcon, PencilIcon, TrashIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import { prisma } from '@/lib/prisma';

// More distinctive color palette for tags - must match TagManager
const TAG_COLORS = [
  { bg: '#FF5733', text: '#FFFFFF' }, // Red
  { bg: '#28A745', text: '#FFFFFF' }, // Green
  { bg: '#007BFF', text: '#FFFFFF' }, // Blue
  { bg: '#FFC107', text: '#000000' }, // Yellow
  { bg: '#6F42C1', text: '#FFFFFF' }, // Purple
  { bg: '#17A2B8', text: '#FFFFFF' }, // Cyan
  { bg: '#FD7E14', text: '#FFFFFF' }, // Orange
  { bg: '#E83E8C', text: '#FFFFFF' }, // Pink
  { bg: '#20C997', text: '#FFFFFF' }, // Teal
  { bg: '#6610F2', text: '#FFFFFF' }, // Indigo
];

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
  const [isMounted, setIsMounted] = useState(false);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<number | null>(0);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  
  // Only render the editor on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Fetch the prompt
  const { data: prompt, error: promptError } = useSWR(
    typeof promptId === 'string' ? `/api/prompts/${promptId}` : null,
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
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    if (selectedColor === null) {
      toast.error('Please select a color for the tag');
      return;
    }
    
    setIsCreatingTag(true);
    
    try {
      const response = await axios.post('/api/tags', {
        name: newTagName.trim(),
        color: selectedColor
      });
      
      // Add the new tag to the list and select it
      const newTag = response.data;
      if (newTag && newTag.id) {
        setSelectedTags(prev => [...prev.filter(id => id !== null), newTag.id]);
      }
      
      // Clear the input and reset form
      setNewTagName('');
      setSelectedColor(0);
      setShowNewTagForm(false);
      setIsCreatingTag(false);
      
      // Show success message
      toast.success('Tag created successfully');
      
      // Refresh the tags data
      mutate('/api/tags');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
      setIsCreatingTag(false);
    }
  };
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty');
      return;
    }

    setIsCreatingFolder(true);

    try {
      const response = await axios.post('/api/folders', { name: newFolderName.trim() });
      const newFolder = response.data;
      
      // Set the newly created folder as the selected folder
      setFolderId(newFolder.id);
      
      // Reset the form
      setShowNewFolderForm(false);
      setNewFolderName('');
      
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    } finally {
      setIsCreatingFolder(false);
    }
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
          <div className="bg-secondary shadow rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Prompt Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              The prompt you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => router.push('/prompts')}
              className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
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
            className="flex items-center text-accent hover:text-white"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-accent hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
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
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-accent hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                  disabled={!prompt}
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </button>
                
                <button
                  onClick={handleDeletePrompt}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
          <div className="bg-secondary shadow rounded-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-primary rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-primary rounded w-1/4 mb-8"></div>
              <div className="h-32 bg-primary rounded mb-4"></div>
            </div>
          </div>
        ) : isEditing ? (
          <div className="bg-secondary shadow rounded-lg p-8">
            <form onSubmit={handleUpdatePrompt} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-primary text-white focus:border-accent focus:ring-accent sm:text-sm"
                  placeholder="Enter a title for your prompt"
                />
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-white">
                  Prompt Body
                </label>
                
                {isMounted ? (
                  <MarkdownEditor 
                    value={body}
                    onChange={setBody}
                    placeholder="Enter your prompt here... Use markdown for formatting, e.g., ```code``` for code blocks"
                    id="promptDetailEditor"
                  />
                ) : (
                  <textarea 
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-secondary text-white focus:border-accent focus:ring-accent sm:text-sm h-40"
                    placeholder="Loading editor..."
                  />
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="folder" className="block text-sm font-medium text-gray-300">
                    Folder
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewFolderForm(true)}
                    className="text-accent hover:text-white text-sm flex items-center"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    New Folder
                  </button>
                </div>
                
                {showNewFolderForm ? (
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-primary text-white focus:border-accent focus:ring-accent sm:text-sm"
                      placeholder="Enter folder name"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateFolder}
                        disabled={isCreatingFolder}
                        className="flex-1 px-3 py-1 text-sm text-white bg-accent hover:bg-opacity-90 rounded-md"
                      >
                        {isCreatingFolder ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewFolderForm(false)}
                        className="px-3 py-1 text-sm text-white bg-primary hover:bg-opacity-90 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <select
                    id="folder"
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-primary text-white focus:border-accent focus:ring-accent sm:text-sm"
                  >
                    <option value="">Select a folder</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tags
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewTagForm(true)}
                    className="text-accent hover:text-white text-sm flex items-center"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    New Tag
                  </button>
                </div>
                
                {showNewTagForm ? (
                  <div className="mt-1 space-y-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      className="block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-primary text-white focus:border-accent focus:ring-accent sm:text-sm"
                      placeholder="Enter tag name"
                    />
                    
                    <div className="mb-2">
                      <h3 className="text-white text-sm mb-2">Select color:</h3>
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map((color, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedColor(index)}
                            className={`w-6 h-6 rounded-full ${selectedColor === index ? 'ring-2 ring-white' : 'hover:ring-1 hover:ring-gray-300'}`}
                            style={{ backgroundColor: color.bg }}
                            aria-label={`Color option ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCreateTag}
                        disabled={isCreatingTag}
                        className="flex-1 px-3 py-1 text-sm text-white bg-accent hover:bg-opacity-90 rounded-md"
                      >
                        {isCreatingTag ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewTagForm(false)}
                        className="px-3 py-1 text-sm text-white bg-primary hover:bg-opacity-90 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((tag) => {
                      // Get the tag color
                      const colorIndex = tag.color !== undefined ? tag.color : 0;
                      const tagColor = TAG_COLORS[colorIndex] || TAG_COLORS[0];
                      
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            selectedTags.includes(tag.id)
                            ? 'ring-2 ring-white' : ''
                          }`}
                          style={{ 
                            backgroundColor: tagColor.bg, 
                            color: tagColor.text 
                          }}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                    
                    {tags.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No tags available. Use the "New Tag" button to create some.
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-primary hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-secondary shadow rounded-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {prompt.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6">
              <span className="mr-4 mb-2">
                Folder: <span className="font-medium">{prompt.folder.name}</span>
              </span>
              <span className="mr-4 mb-2">
                Copied: <span className="font-medium">{prompt.copyCount} times</span>
              </span>
              <span className="mb-2">
                Created: <span className="font-medium">{new Date(prompt.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
            
            {prompt.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag: Tag) => {
                    // Get the tag color
                    const colorIndex = tag.color !== undefined ? tag.color : 0;
                    const tagColor = TAG_COLORS[colorIndex] || TAG_COLORS[0];
                    
                    return (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: tagColor.bg, 
                          color: tagColor.text 
                        }}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Display prompt content with proper code formatting */}
            <div className="bg-primary p-4 rounded-md overflow-auto">
              {/* Replace simple pre tag with a markdown renderer */}
              <div 
                className="prose prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-300 prose-pre:p-4 prose-pre:rounded-md max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: typeof window !== 'undefined' 
                    ? require('marked').parse(prompt.body, { 
                        gfm: true,
                        breaks: true,
                        highlight: function(code: string, lang: string) {
                          try {
                            if (typeof window !== 'undefined' && lang) {
                              const hljs = require('highlight.js');
                              if (hljs.getLanguage(lang)) {
                                return hljs.highlight(code, { language: lang }).value;
                              }
                            }
                          } catch (err) {
                            console.error(err);
                          }
                          return code;
                        }
                      }) 
                    : prompt.body
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log('[getServerSideProps] Attempting to load prompt detail page...');
  
  // Instead of redirecting immediately, let's allow the page to load
  // and handle auth on the client side where it seems to be working better
  return {
    props: {}, // Empty props - we'll fetch everything client-side
  };
};
