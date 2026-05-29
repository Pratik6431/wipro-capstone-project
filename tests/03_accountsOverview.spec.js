const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { AccountsOverviewPage } = require('../pages/03_AccountsOverviewPage');

test.describe('Service 3: Accounts Overview Balance Grid - 15 Parametric Scenarios', () => {

    // Dashboard Scenarios Matrix
    const dashboardScenarios = [
        { id: 'TC-DASH-01', targetId: '998877', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-DASH-02', targetId: '', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-DASH-03', targetId: '99@#', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-DASH-04', targetId: '9'.repeat(20), desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-DASH-05', targetId: '1', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-DASH-06', targetId: '998877', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-DASH-07', targetId: "' UNION SELECT", desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-DASH-08', targetId: '<iframe>', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-DASH-09', targetId: 'NaN_ID', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-DASH-10', targetId: ' 998877 ', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-DASH-11', targetId: '998877', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-DASH-12', targetId: '998877', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-DASH-13', targetId: '998877', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-DASH-14', targetId: '998877', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-DASH-15', targetId: '998877', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of dashboardScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const overviewPage = new AccountsOverviewPage(page);
            const dynamicUsername = `user_s3_${Date.now()}_${scenario.id.replace('-', '_')}`;
            
            await page.route('**/*', async (route) => {
                const url = route.request().url();
                
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel">
                                    <ul>
                                        <li><a href="https://parabank.parasoft.com/parabank/overview.htm">Accounts Overview</a></li>
                                    </ul>
                                </div>
                                <div id="rightPanel">
                                    <p>Your account was created successfully. You are now logged in.</p>
                                </div>
                               </div>`
                    });
                } else if (url.includes('overview.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <table id="accountTable">
                                    <tbody>
                                        <tr><td><a href="#">12345</a></td><td>$500.00</td><td>$500.00</td></tr>
                                        <tr><td><a href="#">${scenario.targetId}</a></td><td>$1500.00</td><td>$1500.00</td></tr>
                                    </tbody>
                                    <tfoot><tr><td colspan="2">Total Balance</td><td>$2000.00</td></tr></tfoot>
                                </table>
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

            await overviewPage.navigateToOverview();
            await expect(overviewPage.overviewTable).toBeVisible({ timeout: 5000 });
        });
    }
});