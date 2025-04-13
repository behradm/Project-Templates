import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PromptTable from '../components/prompts/PromptTable';
import { Prompt, Tag } from '@/types';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/prompts',
    pathname: '/prompts',
    query: {},
    asPath: '/prompts',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn()
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null)
  }),
}));

// Mock window.location
const originalLocation = window.location;

describe('Prompt Navigation', () => {
  beforeEach(() => {
    // Mock window.location with properties we need
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'http://localhost:3000/prompts' }
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation
    });
    jest.clearAllMocks();
  });

  test('Clicking on a prompt row redirects to the prompt detail page', () => {
    const mockPrompts: (Prompt & { tags: Tag[] })[] = [
      {
        id: 'test-prompt-id-1',
        title: 'Test Prompt 1',
        body: 'This is a test prompt body',
        tags: [],
        userId: 'user-1',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        copyCount: 0,
        photoUrls: []
      },
    ];

    render(
      <PromptTable
        prompts={mockPrompts}
        onCopy={jest.fn()}
        onEdit={jest.fn()}
        allTags={[]}
      />
    );

    // Find and click the prompt row
    const promptRow = screen.getByText('Test Prompt 1').closest('tr');
    if (promptRow) {
      fireEvent.click(promptRow);
    }

    // Verify that window.location.href was updated correctly
    expect(window.location.href).toBe(`/prompts/${mockPrompts[0].id}`);
  });

  test('Clicking on edit button redirects to the prompt detail page', () => {
    const mockPrompts: (Prompt & { tags: Tag[] })[] = [
      {
        id: 'test-prompt-id-1',
        title: 'Test Prompt 1',
        body: 'This is a test prompt body',
        tags: [],
        userId: 'user-1',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        copyCount: 0,
        photoUrls: []
      },
    ];

    render(
      <PromptTable
        prompts={mockPrompts}
        onCopy={jest.fn()}
        onEdit={jest.fn()}
        allTags={[]}
      />
    );

    // Find the edit button and click it
    const editButton = screen.getByLabelText('Edit prompt details');
    fireEvent.click(editButton);

    // Verify that window.location.href was updated correctly
    expect(window.location.href).toBe(`/prompts/${mockPrompts[0].id}`);
  });
});
