const { expect } = require('@playwright/test');

class RequestLoanPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Navigation item element map
        this.requestLoanLink = page.getByRole('link', { name: 'Request Loan' });

        // Request Loan Numeric Input Form Fields Locators
        this.loanAmountInput = page.locator('#amount');
        this.downPaymentInput = page.locator('#downPayment');
        this.fromAccountSelect = page.locator('#fromAccountId');

        // Form Submit Action button
        this.applyNowButton = page.locator('input[value="Apply Now"]');

        // Post-execution dynamic check locators via unique IDs
        this.successHeader = page.locator('#mockLoanHeader');
        this.loanStatusText = page.locator('#mockLoanStatus');
    }

    /**
     * Action method to execute logical boundary loan applications
     * @param {string} amount - Loan amount requested
     * @param {string} downPayment - Down payment capability numeric value
     * @param {string} accountId - Source account validation token
     */
    async applyForLoan(amount, downPayment, accountId) {
        // Step 1: Open the Request Loan sidebar layout component
        await this.requestLoanLink.click();
        await this.page.waitForTimeout(1000); // Stabilization wait for form layout sync

        // Step 2: Populate required numerical boundary constraints fields
        await this.loanAmountInput.fill(amount);
        await this.downPaymentInput.fill(downPayment);

        // Step 3: Select source account link context
        await this.fromAccountSelect.selectOption(accountId);

        // Step 4: Click the logical execution trigger action button
        await this.applyNowButton.click();
    }
}

module.exports = { RequestLoanPage };