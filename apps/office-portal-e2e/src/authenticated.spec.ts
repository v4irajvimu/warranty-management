import { expect, test, type Page } from '@playwright/test';

const user = {
  email: 'user@example.com',
  password: 'password123',
  name: 'Regular User',
};

const admin = {
  email: 'admin@example.com',
  password: 'password123',
  name: 'Admin User',
};

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('rejects a short registration password before calling Firebase', async ({
  page,
}) => {
  await page.goto('/register');
  await page.getByLabel('Full name').fill('New Person');
  await page.getByLabel('Email').fill('short@example.com');
  await page.getByLabel('Password').fill('123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(
    page.getByText('Password must be at least 6 characters.'),
  ).toBeVisible();
});

test('signs in a regular user without the users area', async ({ page }) => {
  await signIn(page, user.email, user.password);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeVisible();
  await expect(page.getByText(`Welcome back, ${user.name}`)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Users' })).toHaveCount(0);

  await page.goto('/users');
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeVisible();
});

test('signs in an admin and opens users', async ({ page }) => {
  await signIn(page, admin.email, admin.password);
  await page.getByRole('link', { name: 'Users' }).first().click();
  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Alex Morgan')).toBeVisible();
});

test('signs out back to login', async ({ page }) => {
  await signIn(page, user.email, user.password);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open profile' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});

test('registers a new user onto the dashboard', async ({ page }) => {
  const email = `new-user-${Date.now()}@example.com`;
  await page.goto('/register');
  await page.getByLabel('Full name').fill('New User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }),
  ).toBeVisible();
  await expect(page.getByText('Welcome back, New User')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Users' })).toHaveCount(0);
});
