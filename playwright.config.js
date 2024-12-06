import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directory where test files are located
  timeout: 60000, // Global test timeout for all tests (in milliseconds)
  retries: 0, // Retry failed tests zero times
  use: {
    headless: true, // Run tests in headless mode
    baseURL: 'http://localhost:3000', // Change this to your application's base URL
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000, // Timeout for individual actions (e.g., clicks, fills, etc.)
  },
});
