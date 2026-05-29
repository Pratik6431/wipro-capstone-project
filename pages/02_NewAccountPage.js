const { expect } = require('@playwright/test');

class NewAccountPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Clean locators using id and input properties
        this.openNewAccountLink = page.getByRole('link', { name: 'Open New Account' });
        this.accountTypeDropdown = page.locator('#type'); 
        this.fromAccountDropdown = page.locator('#fromAccountId');
        this.openNewAccountButton = page.locator('input[value="Open New Account"]');
        this.successHeader = page.locator('#mockSuccessHeader');
        this.newAccountIdLink = page.locator('#newAccountId');
    }

    /**
     * Core action method to open banking account
     * @param {string} accountType - Accepts 'SAVINGS' or 'CHECKING'
     */
    async openBankAccount(accountType = 'SAVINGS') {
        // Click menu link
        await this.openNewAccountLink.click();

        if (accountType && accountType.toUpperCase() === 'SAVINGS') {
            await this.accountTypeDropdown.selectOption({ value: '1' }); // '1' is for SAVINGS
        } else {
            await this.accountTypeDropdown.selectOption({ value: '0' }); // '0' is for CHECKING
        }

        // Short stabilization pause
        await this.page.waitForTimeout(1000);
        
        // Submit form
        await this.openNewAccountButton.click();
    }
}

module.exports = { NewAccountPage };