import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Login using valid credentials', async ({ page }) => {
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('Password123');
  await page.click('#submit');
  
  await expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');
})

test('Login using invalid username', async ({ page }) => {
  await page.getByLabel('Username').fill('incorrectusername');
  await page.getByLabel('Password').fill('Password123');
  await page.click('#submit');
  
  expect(await page.locator('#error').textContent()).toBe('Your username is invalid!');
})

test('Login using invalid password', async ({ page }) => {
  await page.getByLabel('Username').fill('student');
  await page.getByLabel('Password').fill('incorrectPassword');
  await page.click('#submit');
  
  expect(await page.locator('#error').textContent()).toBe('Your password is invalid!');
})