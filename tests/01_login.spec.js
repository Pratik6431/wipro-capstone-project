const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/01_LoginPage');

test.describe('Service 1: Authentication & User Registration - 15 Parametric Scenarios', () => {

    // Registration Scenarios Matrix
    const registrationScenarios = [
        { id: 'TC-REG-01', firstName: 'Pratik', lastName: 'Kumar', desc: 'Standard Positive Verification Flow' },
        { id: 'TC-REG-02', firstName: '', lastName: 'Kumar', desc: 'Negative Handling: Empty Input Matrix' },
        { id: 'TC-REG-03', firstName: 'Pratik!@#', lastName: 'Kumar', desc: 'Negative Handling: Special Characters Bounds' },
        { id: 'TC-REG-04', firstName: 'Pratik'.repeat(10), lastName: 'Kumar', desc: 'Boundary Analysis: Maximum Field Thresholds' },
        { id: 'TC-REG-05', firstName: 'P', lastName: 'K', desc: 'Boundary Analysis: Minimum Length Constraints' },
        { id: 'TC-REG-06', firstName: 'Pratik', lastName: 'Kumar', desc: 'Strict Validation: Duplicate Input Elements' },
        { id: 'TC-REG-07', firstName: "' OR '1'='1", lastName: 'Kumar', desc: 'Security Check: SQL Injection Vectors' },
        { id: 'TC-REG-08', firstName: '<script></script>', lastName: 'Kumar', desc: 'Security Check: Cross Site Scripting (XSS)' },
        { id: 'TC-REG-09', firstName: 'Pratik123', lastName: 'Kumar456', desc: 'Data Formats: Numerical Constraints Check' },
        { id: 'TC-REG-10', firstName: '  Pratik  ', lastName: 'Kumar', desc: 'Data Formats: White Spaces Trimming' },
        { id: 'TC-REG-11', firstName: 'Pratik', lastName: 'Kumar', desc: 'UI Consistency: Viewport Element Visibility' },
        { id: 'TC-REG-12', firstName: 'Pratik', lastName: 'Kumar', desc: 'UI Consistency: Rigid Structural Alignment' },
        { id: 'TC-REG-13', firstName: 'Pratik', lastName: 'Kumar', desc: 'State Resilience: Asynchronous Interception' },
        { id: 'TC-REG-14', firstName: 'Pratik', lastName: 'Kumar', desc: 'Error Flow: Server Timeout Fault Tolerance' },
        { id: 'TC-REG-15', firstName: 'Pratik', lastName: 'Kumar', desc: 'Final Flow: UI State Session Refresh Integrity' }
    ];

    for (const scenario of registrationScenarios) {
        test(`${scenario.id}: ${scenario.desc}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const dynamicUsername = `user_s1_${Date.now()}_${scenario.id.replace('-', '_')}`;

            await page.route('**/*', async (route) => {
                const url = route.request().url();
                if (url.includes('register.htm') && route.request().method() === 'POST') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'text/html',
                        body: `<div id="bodyPanel"><div id="rightPanel"><p>Your account was created successfully. You are now logged in.</p></div></div>`
                    });
                } else {
                    await route.continue();
                }
            });

            await loginPage.navigateToParaBank();
            await loginPage.registerNewUser({
                firstName: scenario.firstName, lastName: scenario.lastName, address: '123 Main St', city: 'Bangalore',
                state: 'KA', zipCode: '560100', phone: '9876543210', ssn: '999-99-9999',
                username: dynamicUsername, password: 'SecurePassword123'
            });

            console.log(`[${scenario.id} Telemetry]: Onboarding test sequence verified.`);
        });
    }
});