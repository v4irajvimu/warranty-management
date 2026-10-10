import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = 'http://127.0.0.1:4201';

export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  testMatch: '**/authenticated.spec.ts',
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bash apps/office-portal-e2e/start-auth-e2e.sh',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
