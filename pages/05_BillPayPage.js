const { expect } = require('@playwright/test');

class BillPayPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Locators mapping for Bill Pay sidebar navigation link
        this.billPayLink = page.getByRole('link', { name: 'Bill Pay' });

        // Complex Form Fields Input Locators
        this.payeeNameInput = page.locator('input[name="payee.name"]');
        this.addressInput = page.locator('input[name="payee.address.street"]');
        this.cityInput = page.locator('input[name="payee.address.city"]');
        this.stateInput = page.locator('input[name="payee.address.state"]');
        this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
        this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
        this.accountInput = page.locator('input[name="payee.accountNumber"]');
        this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
        this.amountInput = page.locator('input[name="amount"]');
        
        // Form Submission Trigger button
        this.sendPaymentButton = page.locator('input[value="Send Payment"]');

        // Post-execution safe verification locators via unique IDs
        this.successHeader = page.locator('#mockBillPayHeader');
        this.successStatusMessage = page.locator('#mockBillPayStatus');
    }

    /**
     * Comprehensive action method to complete bill payment workflows
     * @param {Object} billDetails - Object containing all payee string attributes
     */
    async payBill(billDetails) {
       
        await this.billPayLink.click();
        await this.page.waitForTimeout(1000);

        await this.payeeNameInput.fill(billDetails.name);
        await this.addressInput.fill(billDetails.address);
        await this.cityInput.fill(billDetails.city);
        await this.stateInput.fill(billDetails.state);
        await this.zipCodeInput.fill(billDetails.zipCode);
        await this.phoneInput.fill(billDetails.phone);
        await this.accountInput.fill(billDetails.accountNumber);
        await this.verifyAccountInput.fill(billDetails.accountNumber);
        await this.amountInput.fill(billDetails.amount);

        await this.sendPaymentButton.click();
    }
}

module.exports = { BillPayPage };