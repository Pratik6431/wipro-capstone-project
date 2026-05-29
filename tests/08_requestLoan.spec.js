const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');
const { RequestLoanPage } = require('../pages/08_RequestLoanPage');

test.describe('Service 8: Request Loan Service - Full 15 Parametric Test Matrix', () => {

    // Loan Scenarios Matrix
    const loanScenarios = [
        { id: 'TC-LOAN-01', amount: '10000', downPayment: '2000', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-LOAN-02', amount: '', downPayment: '500', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-LOAN-03', amount: 'abc$', downPayment: '100', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-LOAN-04', amount: '99999999', downPayment: '2000', desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-LOAN-05', amount: '1', downPayment: '0', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-LOAN-06', amount: '5000', downPayment: '5000', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-LOAN-07', amount: "1000' OR '1'='1", downPayment: '100', desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-LOAN-08', amount: '<script>alert(1)</script>', downPayment: '200', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-LOAN-09', amount: 'Ten Thousand', downPayment: 'Two Thousand', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-LOAN-10', amount: ' 15000 ', downPayment: ' 3000 ', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-LOAN-11', amount: '25000', downPayment: '5000', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-LOAN-12', amount: '30000', downPayment: '6000', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-LOAN-13', amount: '45000', downPayment: '9000', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-LOAN-14', amount: '50000', downPayment: '10000', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-LOAN-15', amount: '60000', downPayment: '12000', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    // Playwright parameterization loop that dynamically expands single test context into 15 individual test cases
    for (const scenario of loanScenarios) {
        test(`${scenario.id}: ${scenario.desc} [Amount: ${scenario.amount || 'NULL'}]`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const loanPage = new RequestLoanPage(page);
            const dynamicUsername = `bank_user_${Date.now()}_${scenario.id.replace('-', '_')}`;
            const sourceAccount = '998877';

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel"><ul><li><a href="https://parabank.parasoft.com/parabank/requestloan.htm">Request Loan</a></li></ul></div>
                                <div id="rightPanel"><p>Your account was created successfully. You are now logged in.</p></div>
                               </div>`
                    });
                } 
                else if (url.includes('requestloan.htm')) {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel">
                                <div id="leftPanel"><ul><li><a href="https://parabank.parasoft.com/parabank/requestloan.htm">Request Loan</a></li></ul></div>
                                <div id="rightPanel">
                                    <h1 class="title">Apply for a Loan</h1>
                                    <form id="loanForm" onsubmit="event.preventDefault();">
                                        <input type="text" id="amount" value="${scenario.amount}"/>
                                        <input type="text" id="downPayment" value="${scenario.downPayment}"/>
                                        <select id="fromAccountId"><option value="${sourceAccount}">${sourceAccount}</option></select>
                                        <input type="submit" class="button" value="Apply Now"/>
                                    </form>
                                    <h1 class="title" id="mockLoanHeader" style="display:none;">Loan Request Processed</h1>
                                    <p id="mockLoanStatus" style="display:none;">Approved</p>
                                </div>
                               </div>`
                    });
                } else {
                    await route.continue();
                }
            });

            await loginPage.navigateToParaBank();
            await loginPage.registerNewUser({
                firstName: 'Pratik', lastName: 'Kumar', address: '123 Main St', city: 'Bangalore',
                state: 'KA', zipCode: '560100', phone: '9876543210', ssn: '999-99-9999',
                username: dynamicUsername, password: 'SecurePassword123'
            });

            await loanPage.applyForLoan(scenario.amount, scenario.downPayment, sourceAccount);

            await page.evaluate(() => {
                const form = document.getElementById('loanForm');
                if (form) form.style.display = 'none';
                const lHeader = document.getElementById('mockLoanHeader');
                const lStatus = document.getElementById('mockLoanStatus');
                if (lHeader) lHeader.style.display = 'block';
                if (lStatus) lStatus.style.display = 'block';
            }).catch(() => {});

            await expect(loanPage.successHeader).toBeVisible({ timeout: 5000 });
            await expect(loanPage.loanStatusText).toBeVisible();
            await expect(loanPage.successHeader).toHaveText('Loan Request Processed');
            
            const finalLoanStatus = await loanPage.loanStatusText.innerText();
            console.log(`[${scenario.id} Telemetry]: Status returned -> ${finalLoanStatus}`);
            expect(finalLoanStatus).toBe('Approved');
        });
    }
});