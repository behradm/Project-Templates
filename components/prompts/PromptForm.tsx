import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { XMarkIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Folder, Tag, PromptFormData } from '@/types';

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

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {initialData ? 'Edit Prompt' : 'Create New Prompt'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter your prompt text here"
              />
            </div>
            
            <div>
              <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Folder
              </label>
              <Select.Root value={folderId} onValueChange={setFolderId}>
                <Select.Trigger
                  id="folder"
                  className="mt-1 flex justify-between items-center w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  aria-label="Folder"
                >
                  <Select.Value placeholder="Select a folder" />
                  <Select.Icon>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>
                
                <Select.Portal>
                  <Select.Content
                    className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg"
                    position="popper"
                    sideOffset={5}
                  >
                    <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-default">
                      <ChevronUpIcon className="h-4 w-4" />
                    </Select.ScrollUpButton>
                    
                    <Select.Viewport className="p-1">
                      {folders.map((folder) => (
                        <Select.Item
                          key={folder.id}
                          value={folder.id}
                          className="relative flex items-center px-7 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-teal-900 data-[state=checked]:bg-teal-50 dark:data-[state=checked]:bg-teal-900 outline-none cursor-default"
                        >
                          <Select.ItemText>{folder.name}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon className="h-4 w-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    
                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-default">
                      <ChevronDownIcon className="h-4 w-4" />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
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
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
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
