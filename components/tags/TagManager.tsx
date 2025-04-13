import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { mutate } from 'swr';

// More distinctive color palette for tags
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

type TagManagerProps = {
  existingTags: Tag[];
  onSelect?: (tagId: string) => void;
  selectedTags?: string[];
  triggerElement?: React.ReactNode;
};

export default function TagManager({ existingTags, onSelect, selectedTags = [], triggerElement }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isColorSelected, setIsColorSelected] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    setTags(existingTags);
  }, [existingTags]);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }

    if (selectedColor === null) {
      toast.error('Please select a color for the tag');
      return;
    }

    try {
      const response = await axios.post('/api/tags', {
        name: newTagName.trim(),
        color: selectedColor
      });
      
      // Add the new tag to the list
      setTags([...tags, response.data]);
      
      // Clear the input and color selection
      setNewTagName('');
      setSelectedColor(null);
      setIsColorSelected(false);
      setIsCreatingTag(false);
      
      // Show success message
      toast.success('Tag created successfully');
      
      // Refresh the tags data
      mutate('/api/tags');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleTagSelection = (tagId: string) => {
    if (onSelect) {
      onSelect(tagId);
    }
  };

  const handleSelectColor = (index: number) => {
    setSelectedColor(index);
    setIsColorSelected(true);
  };

  const resetTagCreation = () => {
    setNewTagName('');
    setSelectedColor(null);
    setIsColorSelected(false);
    setIsCreatingTag(false);
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetTagCreation();
        }
      }}>
        <Dialog.Trigger asChild>
          {triggerElement}
        </Dialog.Trigger>
        
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold text-white">
                Manage Tags
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
              </Dialog.Close>
            </div>
            
            {isCreatingTag ? (
              <div className="mb-6">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name..."
                  className="w-full px-3 py-2 mb-4 bg-secondary text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                
                <div className="mb-4">
                  <h3 className="text-white mb-2">Select color: {!isColorSelected && <span className="text-red-500">*</span>}</h3>
                  <div className="flex flex-wrap gap-2">
                    {TAG_COLORS.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectColor(index)}
                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === index ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color.bg }}
                        aria-label={`Color option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateTag}
                    className="flex-1 px-3 py-2 mt-2 bg-accent text-white rounded-md hover:bg-opacity-90 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Tag
                  </button>
                  
                  <button
                    onClick={() => setIsCreatingTag(false)}
                    className="px-3 py-2 mt-2 bg-secondary text-white rounded-md hover:bg-opacity-90 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="max-h-60 overflow-y-auto mb-4">
                  {tags.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No tags created yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const colorIndex = tag.color !== undefined ? tag.color : 0;
                        const tagColor = TAG_COLORS[colorIndex] || TAG_COLORS[0];
                        const isSelected = selectedTags.includes(tag.id);
                        
                        return (
                          <button
                            key={tag.id}
                            onClick={() => handleTagSelection(tag.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${isSelected ? 'ring-2 ring-white' : ''}`}
                            style={{ 
                              backgroundColor: tagColor.bg, 
                              color: tagColor.text 
                            }}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setIsCreatingTag(true)}
                  className="w-full px-3 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 flex items-center justify-center"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  Create New Tag
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      {selectedTags && selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTags.map(selectedTagId => {
            const tag = tags.find(t => t.id === selectedTagId);
            if (!tag) return null;
            
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
      )}
    </>
  );
}
