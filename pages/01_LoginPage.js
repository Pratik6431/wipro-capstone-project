const { expect } = require('@playwright/test');

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        
        // Login Locators
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.registrationLink = page.getByRole('link', { name: 'Register' });

        // Registration Form Locators
        this.firstNameInput = page.locator('input[name="customer.firstName"]');
        this.lastNameInput = page.locator('input[name="customer.lastName"]');
        this.addressInput = page.locator('input[name="customer.address.street"]');
        this.cityInput = page.locator('input[name="customer.address.city"]');
        this.stateInput = page.locator('input[name="customer.address.state"]');
        this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
        this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
        this.ssnInput = page.locator('input[name="customer.ssn"]');
        
        // Credentials inputs for registration
        this.regUsernameInput = page.locator('input[name="customer.username"]');
        this.regPasswordInput = page.locator('input[name="customer.password"]');
        // Standardize the confirm password locator using repeatedPassword ID
        this.regConfirmPasswordInput = page.locator('#repeatedPassword');
        this.registerButton = page.locator('input[value="Register"]');
    }

    async navigateToParaBank() {
        await this.page.goto('https://parabank.parasoft.com/');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async registerNewUser(userData) {
        await this.registrationLink.click(); 
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.addressInput.fill(userData.address);
        await this.cityInput.fill(userData.city);
        await this.stateInput.fill(userData.state);
        await this.zipCodeInput.fill(userData.zipCode);
        await this.phoneInput.fill(userData.phone);
        await this.ssnInput.fill(userData.ssn);
        await this.regUsernameInput.fill(userData.username);
        await this.regPasswordInput.fill(userData.password);
        await this.regConfirmPasswordInput.fill(userData.password);
        await this.registerButton.click(); 
    }
}

module.exports = { LoginPage };