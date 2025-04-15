import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FolderFormData } from '@/types';

type FolderFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FolderFormData) => Promise<void>;
  initialData?: {
    id: string;
    name: string;
    description?: string;
  };
};

export default function FolderForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: FolderFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({ name, description });
      onClose();
    } catch (err) {
      console.error('Error submitting folder:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#032024] p-6 rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-normal text-white">
              {initialData ? 'Edit Folder' : 'Create New Folder'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-gray-400 hover:text-white transition-colors"
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
              <label htmlFor="name" className="block text-sm font-normal text-gray-300">
                Folder Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#334155] py-2 px-3 bg-[#011B1F] text-white focus:border-[#FA3811] focus:ring-[#FA3811] sm:text-sm"
                placeholder="Enter a name for your folder"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-normal text-gray-300">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-[#334155] py-2 px-3 bg-[#011B1F] text-white focus:border-[#FA3811] focus:ring-[#FA3811] sm:text-sm"
                placeholder="Describe the purpose of this folder"
              />
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
                {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
