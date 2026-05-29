const { expect } = require('@playwright/test');

class TransferFundsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Locators mapping
        this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
        this.amountInput = page.locator('#amount');
        this.fromAccountDropdown = page.locator('#fromAccountId');
        this.toAccountDropdown = page.locator('#toAccountId');
        this.transferButton = page.locator('input[value="Transfer"]');
        this.successHeader = page.locator('#mockTxHeader'); 
        this.transferStatusText = page.locator('#mockTxStatus');
    }

    /**
     * Action method to execute fund transfer parameters
     */
    async transferMoney(amount, fromAccount, toAccount) {
        await this.transferFundsLink.click();
        await this.page.waitForTimeout(1000); 

        await this.amountInput.fill(amount);
        await this.fromAccountDropdown.selectOption(fromAccount);
        await this.toAccountDropdown.selectOption(toAccount);

        await this.transferButton.click();
    }
}

module.exports = { TransferFundsPage };