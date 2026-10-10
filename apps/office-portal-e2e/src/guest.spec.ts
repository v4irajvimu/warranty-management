import { expect, test } from '@playwright/test';

test('redirects guests from the dashboard to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await expect(page.getByText('Firebase is not configured')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeDisabled();
});

test('redirects deep links to login', async ({ page }) => {
  for (const path of ['/users', '/reports', '/settings']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login$/);
  }
});

test('navigates between login and register', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: 'Need an account? Register' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(
    page.getByRole('heading', { name: 'Create account' }),
  ).toBeVisible();
  await expect(page.getByText('At least 6 characters')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Create account' }),
  ).toBeDisabled();

  await page
    .getByRole('link', { name: 'Already have an account? Sign in' })
    .click();
  await expect(page).toHaveURL(/\/login$/);
});
