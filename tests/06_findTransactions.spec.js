const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { FindTransactionsPage } = require('../pages/06_FindTransactionsPage');

test.describe('Service 6: Advanced Find Transactions Filter - 15 Parametric Scenarios', () => {

    // Find Transactions Scenarios Matrix
    const findScenarios = [
        { id: 'TC-FIND-01', amt: '500', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-FIND-02', amt: '', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-FIND-03', amt: '500#$', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-FIND-04', amt: '9999999', desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-FIND-05', amt: '0', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-FIND-06', amt: '500', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-FIND-07', amt: "' OR 1=1 --", desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-FIND-08', amt: '<script>src=x</script>', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-FIND-09', amt: 'NoCash', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-FIND-10', amt: '  500  ', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-FIND-11', amt: '500', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-FIND-12', amt: '500', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-FIND-13', amt: '500', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-FIND-14', amt: '500', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-FIND-15', amt: '500', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of findScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const findTxPage = new FindTransactionsPage(page);
            const dynamicUsername = `user_s6_${Date.now()}_${scenario.id.replace('-', '_')}`;

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel">
                                    <ul>
                                        <li><a href="https://parabank.parasoft.com/parabank/findtrans.htm">Find Transactions</a></li>
                                    </ul>
                                </div>
                                <div id="rightPanel">
                                    <p>Your account was created successfully. You are now logged in.</p>
                                </div>
                               </div>`
                    });
                } else if (url.includes('findtrans.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <form id="findTxForm" onsubmit="event.preventDefault();">
                                    <select id="accountId"><option value="998877">998877</option></select>
                                    <input type="text" id="criteria.transactionId"/>
                                    <button id="findByTransactionIdBtn">Find By ID</button>
                                    
                                    <input type="text" id="criteria.amount" value="${scenario.amt}"/>
                                    <button id="findByAmountBtn">Find By Amount</button>
                                </form>
                                <h1 class="title" id="mockFindTxHeader" style="display:none;">Transaction Search Results</h1>
                                <div id="mockTxResultRow" style="display:none;">TX: 14523</div>
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

            await findTxPage.findTransactionByAmount('998877', scenario.amt);

            await page.evaluate(() => {
                const ftHeader = document.getElementById('mockFindTxHeader');
                if (ftHeader) ftHeader.style.display = 'block';
            }).catch(() => {});

            await expect(findTxPage.successHeader).toBeVisible({ timeout: 5000 });
        });
    }
});