import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/types';

export type SearchBarProps = {
  value?: string;
  onChange?: (query: string) => void;
  placeholder?: string;
  onSearch?: React.Dispatch<React.SetStateAction<string>>;
  onTagFilter?: React.Dispatch<React.SetStateAction<string[]>>;
  tags?: Tag[];
};

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  onTagFilter, 
  tags = [],
  placeholder = "Search..." 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Handle both old and new interfaces
  const handleChange = (query: string) => {
    setSearchQuery(query);
    if (onChange) onChange(query);
    if (onSearch) onSearch(query);
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    setSelectedTags(newTags);
    if (onTagFilter) onTagFilter(newTags);
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={value !== undefined ? value : searchQuery}
              onChange={(e) => handleChange(e.target.value)}
              className="bg-[#011B1F] border border-[#334155] rounded-md py-2 pl-10 pr-10 w-full text-white focus:outline-none focus:ring-2 focus:ring-[#FA3811] focus:border-transparent text-sm font-normal"
            />
            {(value !== undefined ? value : searchQuery) && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => handleChange("")}
                  className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag.id);
            let tagColorClass = 'bg-gray-700';
            
            // Use the predefined color classes instead of inline styles
            if (tag.color !== undefined) {
              const colorIndex = tag.color % 10;
              switch (colorIndex) {
                case 0: tagColorClass = 'bg-[#FF5733]'; break; // Red
                case 1: tagColorClass = 'bg-[#28A745]'; break; // Green
                case 2: tagColorClass = 'bg-[#007BFF]'; break; // Blue
                case 3: tagColorClass = 'bg-[#FFC107]'; break; // Yellow
                case 4: tagColorClass = 'bg-[#6F42C1]'; break; // Purple
                case 5: tagColorClass = 'bg-[#17A2B8]'; break; // Cyan
                case 6: tagColorClass = 'bg-[#FD7E14]'; break; // Orange
                case 7: tagColorClass = 'bg-[#E83E8C]'; break; // Pink
                case 8: tagColorClass = 'bg-[#20C997]'; break; // Teal
                case 9: tagColorClass = 'bg-[#6610F2]'; break; // Indigo
                default: tagColorClass = 'bg-gray-700';
              }
            }
            
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagColorClass} ${isSelected ? 'ring-2 ring-white' : ''}`}
              >
                {tag.name}
                {isSelected && (
                  <XMarkIcon className="w-3 h-3 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
