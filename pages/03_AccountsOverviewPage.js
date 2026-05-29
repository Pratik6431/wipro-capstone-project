const { expect } = require('@playwright/test');

class AccountsOverviewPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Structural selectors for the financial dashboard layout
        this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
        this.overviewTable = page.locator('#accountTable');
        
        // Target locator to find all rows inside the table body dynamically
        this.tableRows = page.locator('#accountTable tbody tr');
        
        // Total balance cell validation target
        this.totalBalanceCell = page.locator('td:has-text("$")').last();
    }

    /**
     * Action method to navigate to the overview component dashboard
     */
    async navigateToOverview() {
        await this.accountsOverviewLink.click();
        await this.page.waitForTimeout(1000); // Small stabilization wait
    }

    /**
     * Web Table Automation: Verifies if a specific account ID exists inside the rows array
     * @param {string} accountId - The dynamic id extracted from Service 2
     * @returns {Promise<boolean>}
     */
    async verifyAccountExistsInTable(accountId) {
        
        const rowCount = await this.tableRows.count();
        let isFound = false;

        // Iterate through each row and check if the accountId is present in the text
        for (let i = 0; i < rowCount; i++) {
            const rowText = await this.tableRows.nth(i).innerText();
            if (rowText.includes(accountId)) {
                isFound = true;
                break;
            }
        }
        return isFound;
    }
}

module.exports = { AccountsOverviewPage };