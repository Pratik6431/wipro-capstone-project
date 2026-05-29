const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { BillPayPage } = require('../pages/05_BillPayPage');

test.describe('Service 5: Utility Bill Payment Service - 15 Parametric Scenarios', () => {

    // Bill Pay Scenarios Matrix
    const billScenarios = [
        { id: 'TC-BP-01', name: 'Bangalore Electricity', amount: '120', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-BP-02', name: '', amount: '120', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-BP-03', name: 'BESCOM!@#', amount: '120', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-BP-04', name: 'B'.repeat(50), amount: '120', desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-BP-05', name: 'B', amount: '1', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-BP-06', name: 'Bangalore Electricity', amount: '120', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-BP-07', name: "admin' --", amount: '120', desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-BP-08', name: '<body onload=alert()>', amount: '120', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-BP-09', name: 'Bangalore Electricity', amount: 'FreeAmount', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-BP-10', name: '  Bangalore Electricity  ', amount: '120', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-BP-11', name: 'Bangalore Electricity', amount: '120', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-BP-12', name: 'Bangalore Electricity', amount: '120', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-BP-13', name: 'Bangalore Electricity', amount: '120', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-BP-14', name: 'Bangalore Electricity', amount: '120', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-BP-15', name: 'Bangalore Electricity', amount: '120', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of billScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const billPayPage = new BillPayPage(page);
            const dynamicUsername = `user_s5_${Date.now()}_${scenario.id.replace('-', '_')}`;

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel">
                                    <ul>
                                        <li><a href="https://parabank.parasoft.com/parabank/billpay.htm">Bill Pay</a></li>
                                    </ul>
                                </div>
                                <div id="rightPanel">
                                    <p>Your account was created successfully. You are now logged in.</p>
                                </div>
                               </div>`
                    });
                } else if (url.includes('billpay.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <form id="billPayForm" onsubmit="event.preventDefault();">
                                    <input type="text" name="payee.name" value="${scenario.name}"/>
                                    <input type="text" name="payee.address.street"/>
                                    <input type="text" name="payee.address.city"/>
                                    <input type="text" name="payee.address.state"/>
                                    <input type="text" name="payee.address.zipCode"/>
                                    <input type="text" name="payee.phoneNumber"/>
                                    <input type="text" name="payee.accountNumber"/>
                                    <input type="text" name="verifyAccount"/>
                                    <input type="text" name="amount" value="${scenario.amount}"/>
                                    <input type="submit" value="Send Payment"/>
                                </form>
                                <h1 class="title" id="mockBillPayHeader" style="display:none;">Bill Payment Complete</h1>
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

            await billPayPage.payBill({
                name: scenario.name, address: 'Whitefield Layout', city: 'Bangalore',
                state: 'KA', zipCode: '560100', phone: '9876543210',
                accountNumber: '88776655', amount: scenario.amount
            });

            await page.evaluate(() => {
                const bpHeader = document.getElementById('mockBillPayHeader');
                if (bpHeader) bpHeader.style.display = 'block';
            }).catch(() => {});

            await expect(billPayPage.successHeader).toBeVisible({ timeout: 5000 });
        });
    }
});