import { test } from '@playwright/test';
import { describe } from 'node:test';
import testData from '../fixtures/herokuFixture.json';
import { LoginPage } from '../pageObjects/herokuLogin.po';

// Navigate to login page before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

describe('Valid Login',  () => {
  test('Login with valid credentials', async({ page }) => {
    const login = new LoginPage(page);
    await login.login(testData.validUser.username, testData.validUser.password);
    await login.verifyValidLogin();
  });
})

describe('Invalid Login',  () => {
  test('Login with invalid useranme', async ({ page }) => {
    const loginclass = new LoginPage(page);
    await loginclass.login(testData.invalidUser.username, testData.validUser.password);
    await loginclass.verifyInvalidUsername();
  });
  
  test('Login with invalid password', async({ page }) => {
    const login = new LoginPage(page);
    await login.login(testData.validUser.username, testData.invalidUser.password);
    await login.verifyInvalidPassword();
  });

})



