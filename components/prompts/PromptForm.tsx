import React, { useState, useEffect } from 'react';
import * as Select from '@radix-ui/react-select';
import { XMarkIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Folder, Tag, PromptFormData } from '@/types';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { mutate } from 'swr';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import TagManager from '@/components/tags/TagManager';

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
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Only render the editor on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle animation state when isOpen changes
  useEffect(() => {
    if (isOpen) {
      // First add to DOM but hidden
      setIsAnimating(true);
      // Then trigger animation after a small delay to ensure proper mount
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      // Start hiding animation
      setIsVisible(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match the duration of the CSS transition
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setFolderId(initialData.folderId);
      setSelectedTags(initialData.tagIds.filter(id => id !== null));
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
    // Reset form states
    setShowNewFolderForm(false);
    setNewFolderName('');
    setShowNewTagForm(false);
    setNewTagName('');
    setSelectedColor(0); // Default to first color
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
    
    // Clean up tags - remove any null values
    const cleanedTagIds = selectedTags.filter(id => id !== null);
    
    try {
      await onSubmit({
        id: initialData?.id,
        title: title.trim(),
        body,
        folderId,
        tagIds: cleanedTagIds,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setError('Failed to save prompt');
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
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

  return (
    <>
      {(isOpen || isAnimating) && (
        <>
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-500 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
          />
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[90%] md:w-[65%] lg:w-[45%] xl:w-[35%] bg-[#032024] shadow-xl z-50 overflow-y-auto transition-transform duration-500 ease-in-out transform"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-normal text-white">
                  {initialData ? 'Edit Prompt' : 'Create Prompt'}
                </h2>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-900/30 text-red-400 text-sm rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                <div>
                  <label htmlFor="title" className="block text-sm font-normal text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[#334155] py-2 px-3 shadow-sm bg-[#011B1F] text-white focus:border-[#FA3811] focus:ring-[#FA3811] focus:ring-opacity-50 sm:text-sm font-normal"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="body" className="block text-sm font-medium text-white">
                    Prompt Body
                  </label>
                  
                  <MarkdownEditor 
                    value={body}
                    onChange={setBody}
                    placeholder="Enter your prompt here... Use markdown for formatting, e.g., ```code``` for code blocks"
                    id="promptBody"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="folder" className="block text-sm font-medium text-gray-300">
                      Folder
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewFolderForm(true)}
                      className="text-[#FA3811] hover:text-[#e53411] text-sm flex items-center transition-colors font-normal"
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
                        className="block w-full rounded-md border border-[#334155] py-2 px-3 shadow-sm bg-[#011B1F] text-white focus:border-[#FA3811] focus:ring-[#FA3811] focus:ring-opacity-50 sm:text-sm font-normal"
                        placeholder="Enter folder name"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCreateFolder}
                          disabled={isCreatingFolder}
                          className="flex-1 px-3 py-1 text-sm text-white bg-[#FA3811] hover:bg-[#e53411] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] transition-colors font-normal"
                        >
                          {isCreatingFolder ? 'Creating...' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewFolderForm(false)}
                          className="px-3 py-1 text-sm text-white bg-[#011B1F] hover:bg-[#032024] border border-[#334155] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#334155] transition-colors font-normal"
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
                  <div className="flex justify-between items-center">
                    <label htmlFor="tags" className="block text-sm font-normal text-gray-300">
                      Tags
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewTagForm(true)}
                      className="text-[#FA3811] hover:text-[#e53411] text-sm flex items-center transition-colors font-normal"
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
                        className="block w-full rounded-md border border-gray-600 py-2 px-3 shadow-sm bg-secondary text-white focus:border-accent focus:ring-accent sm:text-sm"
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
                          disabled={isCreatingTag || selectedColor === null}
                          className="flex-1 px-3 py-1 text-sm text-white bg-[#FA3811] hover:bg-[#e53411] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] transition-colors font-normal"
                        >
                          {isCreatingTag ? 'Creating...' : 'Create Tag'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewTagForm(false)}
                          className="px-3 py-1 text-sm text-white bg-[#011B1F] hover:bg-[#032024] border border-[#334155] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#334155] transition-colors font-normal"
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
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-normal ${
                              selectedTags.includes(tag.id)
                              ? 'ring-2 ring-white' : ''
                            } transition-colors`}
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
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-normal text-white bg-[#011B1F] hover:bg-[#032024] border border-[#334155] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#334155] transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-normal text-white bg-[#FA3811] hover:bg-[#e53411] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FA3811] transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Prompt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
