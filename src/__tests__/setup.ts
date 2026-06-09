/// <reference types="jest" />
// Jest setup file for DateDreamer tests
import '@testing-library/jest-dom';

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
(window as unknown as {ResizeObserver?: any}).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
(window as unknown as {IntersectionObserver?: any}).IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
});

// Dummy test to prevent Jest from failing
describe('Setup', () => {
  test('should load setup file', () => {
    expect(true).toBe(true);
  });
});
