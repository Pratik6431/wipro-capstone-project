const { expect } = require('@playwright/test');

class UpdateProfilePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Navigation sidebar item link mapping
        this.updateProfileLink = page.getByRole('link', { name: 'Update Contact Info' });

        // Update Profile Input Form Fields Locators
        this.firstNameInput = page.locator('input[name="customer.firstName"]');
        this.lastNameInput = page.locator('input[name="customer.lastName"]');
        this.addressInput = page.locator('input[name="customer.address.street"]');
        this.cityInput = page.locator('input[name="customer.address.city"]');
        this.stateInput = page.locator('input[name="customer.address.state"]');
        this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
        this.phoneInput = page.locator('input[name="customer.phoneNumber"]');

        // Form Submit Action button
        this.updateProfileButton = page.locator('input[value="Update Profile"]');

        // Post-execution safe layout confirmation tags via unique IDs
        this.successHeader = page.locator('#mockUpdateHeader');
        this.successMessage = page.locator('#mockUpdateStatus');
    }

    /**
     * Action method to update user profile information fields dynamically
     * @param {Object} newDetails - Object holding the updated string coordinates
     */
    async updateContactInformation(newDetails) {
        
        await this.updateProfileLink.click();
        await this.page.waitForTimeout(1000);
        await this.firstNameInput.fill(newDetails.firstName);
        await this.lastNameInput.fill(newDetails.lastName);
        await this.addressInput.fill(newDetails.address);
        await this.cityInput.fill(newDetails.city);
        await this.stateInput.fill(newDetails.state);
        await this.zipCodeInput.fill(newDetails.zipCode);
        await this.phoneInput.fill(newDetails.phone);
        await this.updateProfileButton.click();
    }
}

module.exports = { UpdateProfilePage };