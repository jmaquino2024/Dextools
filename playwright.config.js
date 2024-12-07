import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directory where test files are located
  timeout: 180000, // Global test timeout for all tests (in milliseconds)
  retries: 0, // Retry failed tests zero times
  use: {
    headless: true, // Run tests in headless mode
    baseURL: 'http://localhost:3000', // Change this to your application's base URL
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000, // Timeout for individual actions (e.g., clicks, fills, etc.)
    browserName: 'firefox', // Ensure Firefox is being used
    // Specify executablePath to force the use of the stable Firefox version
    executablePath: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe', // Update this path to your stable Firefox installation path
  },
});
