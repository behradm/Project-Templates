import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type SearchBarProps = {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-secondary text-white placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition"
          />
        </div>
      </div>
    </div>
  );
}
