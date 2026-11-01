import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest does not automatically register React Testing Library cleanup
// unless its test globals are enabled. Avoid leaking DOM between tests.
afterEach(() => {
  cleanup();
});
