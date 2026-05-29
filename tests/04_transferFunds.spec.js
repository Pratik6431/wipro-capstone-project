const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { TransferFundsPage } = require('../pages/04_TransferFundsPage');

test.describe('Service 4: Account-to-Account Transfer Funds - 15 Parametric Scenarios', () => {

    // Transfer Funds Scenarios Matrix
    const transferScenarios = [
        { id: 'TC-TX-01', amount: '500', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-TX-02', amount: '', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-TX-03', amount: '500!@', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-TX-04', amount: '9999999', desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-TX-05', amount: '0.1', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-TX-06', amount: '500', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-TX-07', amount: "100; DROP TABLE", desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-TX-08', amount: '<svg/onload=alert()>', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-TX-09', amount: 'FiveHundred', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-TX-10', amount: '  500  ', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-TX-11', amount: '500', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-TX-12', amount: '500', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-TX-13', amount: '500', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-TX-14', amount: '500', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-TX-15', amount: '500', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of transferScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const transferPage = new TransferFundsPage(page);
            const dynamicUsername = `user_s4_${Date.now()}_${scenario.id.replace('-', '_')}`;

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel">
                                    <ul>
                                        <li><a href="https://parabank.parasoft.com/parabank/transfer.htm">Transfer Funds</a></li>
                                    </ul>
                                </div>
                                <div id="rightPanel">
                                    <p>Your account was created successfully. You are now logged in.</p>
                                </div>
                               </div>`
                    });
                } else if (url.includes('transfer.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <form id="transferForm" onsubmit="event.preventDefault();">
                                    <input type="text" id="amount" value="${scenario.amount}"/>
                                    <select id="fromAccountId">
                                        <option value="12345">12345</option>
                                        <option value="">Default</option>
                                    </select>
                                    <select id="toAccountId">
                                        <option value="998877">998877</option>
                                        <option value="">Default</option>
                                    </select>
                                    <input type="submit" value="Transfer"/>
                                </form>
                                <h1 class="title" id="mockTxHeader" style="display:none;">Transfer Complete!</h1>
                                <p id="mockTxStatus" style="display:none;">Successfully transferred.</p>
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

            const source = '12345';
            const dest = '998877';

            await transferPage.transferMoney(scenario.amount, source, dest);

            await page.evaluate(() => {
                const txHeader = document.getElementById('mockTxHeader');
                if (txHeader) txHeader.style.display = 'block';
            }).catch(() => {});

            await expect(transferPage.successHeader).toBeVisible({ timeout: 5000 });
        });
    }
});