// jest.setup.js
import '@testing-library/jest-dom'

// Mock the SWR hook
jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
