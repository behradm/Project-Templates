import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusIcon, FolderIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Folder } from '@/types';

type SidebarProps = {
  folders: Folder[];
  onCreateFolder: () => void;
}

export default function Sidebar({ folders, onCreateFolder }: SidebarProps) {
  const router = useRouter();
  const { folderId } = router.query;
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`h-full bg-[#011B1F] border-r border-[#334155] transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="p-4 flex items-center justify-between">
        <h2 className={`text-lg font-normal text-white ${!isOpen && 'sr-only'}`}>
          Folders
        </h2>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            )}
          </svg>
        </button>
      </div>
      
      <div className="px-3 py-2">
        <Link
          href="/prompts"
          className={`flex items-center px-3 py-2 text-sm font-normal rounded-md ${
            !folderId
              ? 'bg-primary text-accent'
              : 'text-white hover:bg-primary hover:bg-opacity-50'
          }`}
        >
          <HomeIcon className={`mr-3 h-5 w-5 ${!folderId ? 'text-accent' : 'text-white'}`} />
          {isOpen && <span>All Prompts</span>}
        </Link>
      </div>

      <div className="px-3 pt-2 pb-2 space-y-1">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/folders/${folder.id}`}
            className={`flex items-center px-3 py-2 text-sm font-normal rounded-md ${
              folderId === folder.id
                ? 'bg-primary text-accent'
                : 'text-white hover:bg-primary hover:bg-opacity-50'
            }`}
          >
            <FolderIcon className={`mr-3 h-5 w-5 ${folderId === folder.id ? 'text-accent' : 'text-white'}`} />
            {isOpen && <span className="truncate">{folder.name}</span>}
          </Link>
        ))}
      </div>
      
      <div className="px-3 py-3 mt-auto">
        <button
          onClick={onCreateFolder}
          className="flex items-center w-full px-3 py-2 text-sm font-normal text-white hover:bg-primary hover:bg-opacity-50 rounded-full transition-colors"
        >
          <PlusIcon className="mr-3 h-5 w-5 text-[#FA3811]" />
          {isOpen && <span>New Folder</span>}
        </button>
      </div>
    </div>
  );
}
