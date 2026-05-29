const { expect } = require('@playwright/test');

class FindTransactionsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Locators mapping for Find Transactions sidebar menu link
        this.findTransactionsLink = page.getByRole('link', { name: 'Find Transactions' });

        // Criteria Fields Selection Inputs
        this.accountSelectDropdown = page.locator('#accountId');
        
        // Find by Transaction ID
        this.transactionIdInput = page.locator('#criteria\\.transactionId');
        this.findByTxIdButton = page.locator('#findByTransactionIdBtn');

        // Find by Amount
        this.amountInput = page.locator('#criteria\\.amount');
        this.findByAmountButton = page.locator('#findByAmountBtn');
        
        // Post-execution tracking containers via unique mock IDs
        this.successHeader = page.locator('#mockFindTxHeader');
        this.transactionResultRow = page.locator('#mockTxResultRow');
    }

    /**
     * Action method to search transaction logs via specific monetary values
     * @param {string} accountId - Dynamic source account selected
     * @param {string} amount - Dynamic transaction threshold amount to look for
     */
    async findTransactionByAmount(accountId, amount) {
        
        await this.findTransactionsLink.click();
        await this.page.waitForTimeout(1000);
        await this.accountSelectDropdown.selectOption(accountId);
        await this.amountInput.fill(amount);
        await this.findByAmountButton.click();
    }
}

module.exports = { FindTransactionsPage };