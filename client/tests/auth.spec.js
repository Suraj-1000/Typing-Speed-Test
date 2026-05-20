import { test, expect } from '@playwright/test';

test.describe('Typing Velocity - Authentication Flows', () => {

  test.beforeEach(async ({ page }) => {
    // Intercept checking authentication on launch and return unauthenticated state (401)
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not authenticated' }),
      });
    });
  });

  test('should display login and register navigation buttons', async ({ page }) => {
    await page.goto('/');

    // Check header links
    const loginLink = page.locator('header nav a:has-text("Login")');
    const registerLink = page.locator('header nav a:has-text("Register")');

    await expect(loginLink).toBeVisible();
    await expect(registerLink).toBeVisible();
  });

  test('should navigate to login page and handle successful login with mock data', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to Login page
    await page.click('header nav a:has-text("Login")');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h2')).toContainText('Welcome Back');

    // Setup mock login response
    const mockUser = {
      id: 100,
      username: 'speedtyper',
      email: 'speedy@velocity.com',
      level: 5,
      xp: 450
    };

    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // Mock subsequent profile check (me) as logged in
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // Fill credentials
    await page.locator('input[type="text"]').fill('speedtyper');
    await page.locator('input[type="password"]').fill('superpassword');

    // Click login button
    await page.click('button[type="submit"]');

    // We should be redirected back to the Home page
    await expect(page).toHaveURL(/\//);

    // Header should display the logged-in user profile with level details
    const profileInfo = page.locator('header nav > span');
    await expect(profileInfo).toContainText('speedtyper');
    await expect(profileInfo).toContainText('Lvl 5');
  });

  test('should show error alert when login fails', async ({ page }) => {
    await page.goto('/login');

    // Setup mock login failure (400 Bad Request)
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid username or password' }),
      });
    });

    // Fill credentials
    await page.locator('input[type="text"]').fill('wronguser');
    await page.locator('input[type="password"]').fill('wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Assert error alert displays
    const errorAlert = page.locator('div:has-text("Invalid username or password")').first();
    await expect(errorAlert).toBeVisible();
  });

  test('should navigate to register page and register user successfully', async ({ page }) => {
    await page.goto('/');

    // Navigate to Register page
    await page.click('header nav a:has-text("Register")');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('h2')).toContainText('Create Account');

    const mockNewUser = {
      id: 200,
      username: 'fastfingers',
      email: 'fast@fingers.com',
      level: 1,
      xp: 0
    };

    // Setup mock register response
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockNewUser),
      });
    });

    // Mock subsequent profile check (me) as logged in
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockNewUser),
      });
    });

    // Fill registration info
    await page.locator('input[type="text"]').fill('fastfingers');
    await page.locator('input[type="email"]').fill('fast@fingers.com');
    await page.locator('input[type="password"]').fill('greatpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Redirect to home
    await expect(page).toHaveURL(/\//);

    // Profile details in header should update
    const profileInfo = page.locator('header nav > span');
    await expect(profileInfo).toContainText('fastfingers');
    await expect(profileInfo).toContainText('Lvl 1');
  });

  test('should support logout', async ({ page }) => {
    // Start with logged in state
    const mockUser = {
      id: 100,
      username: 'speedtyper',
      email: 'speedy@velocity.com',
      level: 5,
      xp: 450
    };

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    await page.goto('/');

    const profileInfo = page.locator('header nav > span');
    await expect(profileInfo).toContainText('speedtyper');

    // Setup mock logout
    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Logged out successfully' }),
      });
    });

    // Now intercept next me requests as 401
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not authenticated' }),
      });
    });

    // Click logout
    await page.click('button:has-text("Logout")');

    // Check we are back to guest header (Login/Register buttons visible)
    const loginLink = page.locator('header nav a:has-text("Login")');
    await expect(loginLink).toBeVisible();
  });

  test('should show error alert when registration fails', async ({ page }) => {
    await page.goto('/register');

    // Setup mock register failure (400 Bad Request)
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Username or email already exists' }),
      });
    });

    // Fill registration info
    await page.locator('input[type="text"]').fill('existinguser');
    await page.locator('input[type="email"]').fill('existing@user.com');
    await page.locator('input[type="password"]').fill('somepassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Assert error alert displays
    const errorAlert = page.locator('div:has-text("Username or email already exists")').first();
    await expect(errorAlert).toBeVisible();
  });
});
