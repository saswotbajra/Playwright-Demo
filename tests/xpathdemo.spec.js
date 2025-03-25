import { expect, test } from '@playwright/test';
import { LoginPage } from '../pageObjects/login.po';

// Navigate to login page before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/practice-test-login/');
});

// run test with valid credentials
test('Login using valid credentials', async ({ page }) => {
  await page.locator("//input[@id='username']").fill('student');
  await page.locator("//input[@id='password']").fill('Password123');
  await page.locator("//input[@id='password']//following::button").click();
  // await page.click('#submit');
  
  await expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');
})

// run test with invalid username credentials
test('Login using invalid username', async ({ page }) => {
  await page.locator("//input[@id='username']").fill('incorrectusername');
  await page.locator("//input[@id='password']").fill('Password123');
  await page.locator("//button[@id='submit']").click();

  expect(await page.locator('#error').textContent()).toBe('Your username is invalid!');
})

// run test with invalid password credentials
test('Login using invalid password', async ({ page }) => {
  await page.locator("//input[@id='username']").fill('student');
  await page.locator("//input[@id='password']").fill('icorrectpassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  
  expect(await page.locator('#error').textContent()).toBe('Your password is invalid!');
})
