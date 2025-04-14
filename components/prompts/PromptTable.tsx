import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ClipboardIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Prompt, Tag } from '@/types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { mutate } from 'swr';

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

type PromptTableProps = {
  prompts: (Prompt & { tags: Tag[] })[];
  onCopy: (id: string, body: string) => Promise<void> | void;
  onEdit: (id: string) => Promise<boolean> | void;
  onDelete?: (id: string) => Promise<void> | void;
  allTags?: Tag[];
};

export default function PromptTable({ prompts, onCopy, onEdit, onDelete, allTags = [] }: PromptTableProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTagPromptId, setActiveTagPromptId] = useState<string | null>(null);
  const [isTagging, setIsTagging] = useState(false);
  const [localPrompts, setLocalPrompts] = useState<(Prompt & { tags: Tag[] })[]>(prompts);

  // Update local prompts when props change
  React.useEffect(() => {
    setLocalPrompts(prompts);
  }, [prompts]);

  const handleCopy = async (id: string, body: string) => {
    await onCopy(id, body);
    setCopiedId(id);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const toggleTagDropdown = (e: React.MouseEvent, promptId: string) => {
    e.stopPropagation();
    if (activeTagPromptId === promptId) {
      setActiveTagPromptId(null);
    } else {
      setActiveTagPromptId(promptId);
    }
  };

  const closeTagDropdown = () => {
    setActiveTagPromptId(null);
  };

  const handleExistingTagClick = (e: React.MouseEvent, promptId: string, tagId: string) => {
    e.stopPropagation();
    // First show the dropdown
    setActiveTagPromptId(promptId);
  };

  const handleTagToggle = async (e: React.MouseEvent, promptId: string, tagId: string, promptTags: Tag[]) => {
    e.stopPropagation();
    
    // Check if the tag is already assigned to the prompt
    const isTaggedAlready = promptTags.some(tag => tag.id === tagId);
    
    setIsTagging(true);
    
    try {
      if (isTaggedAlready) {
        // Remove tag - update UI immediately before API call
        setLocalPrompts(currentPrompts => 
          currentPrompts.map(prompt => {
            if (prompt.id === promptId) {
              return {
                ...prompt,
                tags: prompt.tags.filter(tag => tag.id !== tagId)
              };
            }
            return prompt;
          })
        );
        
        // Then make API call
        await axios.delete(`/api/prompts/${promptId}/tags/${tagId}`);
        toast.success('Tag removed');
      } else {
        // Find the tag to add
        const tagToAdd = allTags.find(tag => tag.id === tagId);
        
        if (tagToAdd) {
          // Add tag - update UI immediately before API call
          setLocalPrompts(currentPrompts => 
            currentPrompts.map(prompt => {
              if (prompt.id === promptId) {
                return {
                  ...prompt,
                  tags: [...prompt.tags, tagToAdd]
                };
              }
              return prompt;
            })
          );
          
          // Then make API call
          await axios.post(`/api/prompts/${promptId}/tags`, { tagId });
          toast.success('Tag added');
        }
      }
      
      // Refresh the prompts data in the background
      mutate(`/api/prompts${window.location.search}`);
    } catch (error) {
      // Revert optimistic update if there's an error
      setLocalPrompts(prompts);
      console.error('Error toggling tag:', error);
      toast.error('Failed to update tag');
    } finally {
      setIsTagging(false);
    }
  };

  if (localPrompts.length === 0) {
    return (
      <div className="text-center py-12 bg-[#011B1F] shadow rounded-lg">
        <p className="text-gray-400 font-normal">No prompts found. Create your first prompt!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#334155]">
        <thead className="bg-[#011B1F]">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-normal text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-normal text-gray-300 uppercase tracking-wider">
              Tags
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-normal text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-[#334155]">
          {localPrompts.map((prompt) => (
            <tr 
              key={prompt.id} 
              className="hover:bg-[#02272D] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/prompts/${prompt.id}`;
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-normal text-white">{prompt.title}</div>
                <div className="text-sm font-normal text-gray-300 truncate max-w-xs">
                  {prompt.body.substring(0, 60)}{prompt.body.length > 60 ? '...' : ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-wrap gap-1 items-center">
                  {prompt.tags.map((tag) => {
                    // Get the tag color
                    const colorIndex = tag.color !== undefined ? tag.color : 0;
                    const tagColor = TAG_COLORS[colorIndex] || TAG_COLORS[0];
                    
                    return (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal cursor-pointer"
                        style={{ 
                          backgroundColor: tagColor.bg, 
                          color: tagColor.text 
                        }}
                        onClick={(e) => handleExistingTagClick(e, prompt.id, tag.id)}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                  <button
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-white bg-[#011B1F] border border-[#334155] hover:bg-[#032024] cursor-pointer ml-1 transition-colors"
                    onClick={(e) => toggleTagDropdown(e, prompt.id)}
                  >
                    {prompt.tags.length === 0 ? "Add tags" : "Add tags"}
                  </button>
                  
                  {activeTagPromptId === prompt.id && (
                    <div className="absolute mt-1 z-10 bg-[#032024] shadow-lg rounded-md border border-[#334155] p-2 max-w-xs">
                      <div className="mb-2 flex justify-between items-center">
                        <h4 className="text-white text-sm font-normal">Manage tags</h4>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors" 
                          onClick={closeTagDropdown}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="max-h-40 overflow-y-auto">
                        {allTags.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-2">
                            <p className="text-sm text-gray-400 font-normal mb-2">No tags available</p>
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                document.getElementById('tag-manager-button')?.click();
                                closeTagDropdown();
                              }}
                              className="text-[#FA3811] hover:text-[#e53411] text-sm transition-colors font-normal"
                            >
                              Create new tag
                            </a>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            {allTags.map(tag => {
                              const isAssigned = prompt.tags.some(t => t.id === tag.id);
                              const colorIndex = tag.color !== undefined ? tag.color : 0;
                              const tagColor = TAG_COLORS[colorIndex] || TAG_COLORS[0];
                              
                              return (
                                <button
                                  key={tag.id}
                                  className={`flex items-center px-2 py-1 text-sm font-normal text-left rounded hover:bg-[#02272D] ${isTagging ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
                                  onClick={(e) => handleTagToggle(e, prompt.id, tag.id, prompt.tags)}
                                  disabled={isTagging}
                                >
                                  <span
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: tagColor.bg }}
                                  />
                                  <span className="text-white">{tag.name}</span>
                                  {isAssigned && (
                                    <svg className="ml-auto h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })}
                            
                            <div className="border-t border-gray-700 my-1 pt-1">
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  document.getElementById('tag-manager-button')?.click();
                                  closeTagDropdown();
                                }}
                                className="flex items-center text-[#FA3811] hover:text-[#e53411] text-sm transition-colors"
                              >
                                <PlusIcon className="h-3 w-3 mr-1" />
                                Create new tag
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-normal">
                <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.body)}
                    className="text-[#FA3811] hover:text-[#e53411] transition-colors"
                    aria-label="Copy to clipboard"
                  >
                    {copiedId === prompt.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/prompts/${prompt.id}`;
                    }}
                    className="text-[#FA3811] hover:text-[#e53411] transition-colors"
                    aria-label="Edit prompt details"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
