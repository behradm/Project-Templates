import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { XMarkIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Folder, Tag, PromptFormData } from '@/types';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Import SimpleMDE dynamically with SSR disabled to prevent "navigator is not defined" error
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
);

// This handles the CSS import client-side to prevent SSR issues
const ClientOnlyStyle = () => {
  useEffect(() => {
    // We need to use require here as a dynamic import since it's CSS
    require('easymde/dist/easymde.min.css');
  }, []);
  
  return null;
};

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

type PromptFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromptFormData) => Promise<void>;
  folders: Folder[];
  tags: Tag[];
  initialData?: {
    id: string;
    title: string;
    body: string;
    folderId: string;
    tagIds: string[];
  };
};

export default function PromptForm({
  isOpen,
  onClose,
  onSubmit,
  folders,
  tags,
  initialData,
}: PromptFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [folderId, setFolderId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only render the editor on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Markdown editor options
  const mdeOptions = {
    spellChecker: false,
    toolbar: ["bold", "italic", "heading", "|", "code", "quote", "|", "unordered-list", "ordered-list", "|", "link", "preview"] as const,
    status: false,
    autofocus: false,
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setFolderId(initialData.folderId);
      setSelectedTags(initialData.tagIds);
    } else {
      // Set default folder if available
      if (folders.length > 0) {
        const generalFolder = folders.find(folder => folder.name === 'General');
        setFolderId(generalFolder?.id || folders[0].id);
      }
      setTitle('');
      setBody('');
      setSelectedTags([]);
    }
    // Reset folder form state when modal opens/closes
    setShowNewFolderForm(false);
    setNewFolderName('');
  }, [initialData, folders, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!body.trim()) {
      setError('Prompt body is required');
      return;
    }
    
    if (!folderId) {
      setError('Please select a folder');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({ title, body, folderId, tagIds: selectedTags });
      onClose();
    } catch (err) {
      console.error('Error submitting prompt:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-primary p-6 shadow-xl overflow-y-auto animate-slide-in-right">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-medium text-white">
              {initialData ? 'Edit Prompt' : 'Create Prompt'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-900/30 text-red-400 text-sm rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-secondary text-white focus:border-accent focus:ring-accent sm:text-sm"
                placeholder="Enter a title for your prompt"
              />
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-300">
                Prompt Body
              </label>
              
              {/* Add the CSS only on the client side */}
              <ClientOnlyStyle />
              
              {isMounted ? (
                <div className="markdown-editor-wrapper dark-theme mt-1">
                  <SimpleMDE 
                    value={body}
                    onChange={setBody}
                    options={mdeOptions}
                    className="markdown-editor"
                  />
                </div>
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
                    className="block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-secondary text-white focus:border-accent focus:ring-accent sm:text-sm"
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
                      className="px-3 py-1 text-sm text-white bg-secondary hover:bg-opacity-90 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Select.Root value={folderId} onValueChange={setFolderId}>
                  <Select.Trigger
                    id="folder"
                    className="mt-1 flex justify-between items-center w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-secondary text-white focus:border-accent focus:ring-accent sm:text-sm"
                    aria-label="Folder"
                  >
                    <Select.Value placeholder="Select a folder" />
                    <Select.Icon>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </Select.Icon>
                  </Select.Trigger>
                  
                  <Select.Portal>
                    <Select.Content
                      className="overflow-hidden rounded-md border border-gray-600 bg-secondary shadow-lg z-50"
                      position="popper"
                      sideOffset={5}
                    >
                      <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-secondary text-gray-300 cursor-default">
                        <ChevronUpIcon className="h-4 w-4" />
                      </Select.ScrollUpButton>
                      
                      <Select.Viewport className="p-1">
                        {folders.map((folder) => (
                          <Select.Item
                            key={folder.id}
                            value={folder.id}
                            className="relative flex items-center px-7 py-2 rounded-md text-sm text-white hover:bg-primary data-[state=checked]:bg-primary outline-none cursor-default"
                          >
                            <Select.ItemText>{folder.name}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                              <CheckIcon className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      
                      <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-secondary text-gray-300 cursor-default">
                        <ChevronDownIcon className="h-4 w-4" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
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
                    No tags available. Create some tags first.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-secondary hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-opacity-90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
