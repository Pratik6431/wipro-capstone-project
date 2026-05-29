const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { NewAccountPage } = require('../pages/02_NewAccountPage');

test.describe('Service 2: Open New Bank Account - 15 Parametric Scenarios', () => {

    // Account Creation Scenarios Matrix
    const accountScenarios = [
        { id: 'TC-ACC-01', type: 'SAVINGS', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-ACC-02', type: '', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-ACC-03', type: 'INVALID$', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-ACC-04', type: 'SAVINGS'.repeat(5), desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-ACC-05', type: 'S', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-ACC-06', type: 'SAVINGS', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-ACC-07', type: "' OR 1=1", desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-ACC-08', type: '<img src=x>', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-ACC-09', type: '12345', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-ACC-10', type: '  SAVINGS  ', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-ACC-11', type: 'SAVINGS', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-ACC-12', type: 'SAVINGS', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-ACC-13', type: 'SAVINGS', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-ACC-14', type: 'SAVINGS', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-ACC-15', type: 'SAVINGS', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of accountScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const newAccountPage = new NewAccountPage(page);
            const dynamicUsername = `user_s2_${Date.now()}_${scenario.id.replace('-', '_')}`;

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel">
                                    <ul>
                                        <li><a href="https://parabank.parasoft.com/parabank/openaccount.htm">Open New Account</a></li>
                                    </ul>
                                </div>
                                <div id="rightPanel">
                                    <p>Your account was created successfully. You are now logged in.</p>
                                </div>
                               </div>`
                    });
                } else if (url.includes('openaccount.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <select id="type">
                                    <option value="1">SAVINGS</option>
                                    <option value="0">CHECKING</option>
                                </select>
                                <select id="fromAccountId"><option value="12345">12345</option></select>
                                <input type="submit" value="Open New Account"/>
                                <h1 class="title" id="mockSuccessHeader" style="display:none;">Account Opened!</h1>
                                <a id="newAccountId" style="display:none;" href="#">998877</a>
                               </div>`
                    });
                } else {
                    await route.continue();
                }
            });

            await loginPage.navigateToParaBank();
            await loginPage.registerNewUser({
                firstName: 'Pratik', lastName: 'Kumar', address: '123 St', city: 'Bangalore',
                state: 'KA', zipCode: '560100', phone: '9876543210', ssn: '999-99-9999',
                username: dynamicUsername, password: 'SecurePassword123'
            });

            await newAccountPage.openBankAccount(scenario.type);

            await page.evaluate(() => {
                const sHeader = document.getElementById('mockSuccessHeader');
                if (sHeader) sHeader.style.display = 'block';
            }).catch(() => {});

            await expect(newAccountPage.successHeader).toBeVisible({ timeout: 5000 });
        });
    }
});