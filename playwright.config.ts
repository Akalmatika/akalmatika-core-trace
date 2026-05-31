import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'Mobile 320x640',
      use: { 
        ...devices['iPhone SE'], 
        viewport: { width: 320, height: 640 },
        isMobile: true
      },
    },
    {
      name: 'Mobile 360x740',
      use: { 
        ...devices['Galaxy S8'], 
        viewport: { width: 360, height: 740 },
        isMobile: true
      },
    },
    {
      name: 'Mobile 375x812',
      use: { 
        ...devices['iPhone X'], 
        viewport: { width: 375, height: 812 },
        isMobile: true
      },
    },
    {
      name: 'Mobile 390x844',
      use: { 
        ...devices['iPhone 12'], 
        viewport: { width: 390, height: 844 },
        isMobile: true
      },
    },
    {
      name: 'Mobile 414x896',
      use: { 
        ...devices['iPhone 11 Pro Max'], 
        viewport: { width: 414, height: 896 },
        isMobile: true
      },
    },
    {
      name: 'Mobile 430x932',
      use: { 
        ...devices['iPhone 14 Pro Max'], 
        viewport: { width: 430, height: 932 },
        isMobile: true
      },
    },
    {
      name: 'Tablet 768x1024',
      use: { 
        ...devices['iPad Mini'], 
        viewport: { width: 768, height: 1024 },
        isMobile: true
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
