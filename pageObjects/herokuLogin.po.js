const { expect } = require('@playwright/test');

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = '//input[@id="email"]';
    this.passwordInput = '//input[@id="password"]';
    this.loginButton = '//button[@id="submit"]';
    this.logOut = '//button[@id="logout"]';
    // this.loginValidation = '//h1[@class="post-title"]';
    this.alertMessage = '#error';
  }

  async login(username, password) {
    await this.page.locator(this.usernameInput).fill(username);
    await this.page.locator(this.passwordInput).fill(password);
    await this.page.locator(this.loginButton).click();
  }

  async verifyValidLogin() {
    const loginValidation = await this.page.locator(this.logOut);
    await this.page.waitForTimeout(2000);
    await expect(loginValidation).toBeVisible();
  }

  async verifyInvalidUsername() {
    const InvalidLogin = await this.page.locator(this.alertMessage);
    await expect(InvalidLogin).toHaveText('Incorrect username or password');
  }

  async verifyInvalidPassword() {
    const InvalidLogin = await this.page.locator(this.alertMessage);
    await expect(InvalidLogin).toHaveText('Incorrect username or password');
  }

}
