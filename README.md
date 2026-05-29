#  ParaBank Automated QA Capstone Project

> **End-to-End Automated Banking Regression Suite built using Playwright (JavaScript) with Page Object Model (POM).**

This repository contains a robust, highly parallelized, and industry-standard automation framework built from scratch to test the core banking workflows of the **ParaBank** web application. The suite covers exactly **8 micro-banking services** with **15 rigorously designed test cases each**, executing a total of **exactly 120 distinct test scenarios**.

##  Project Scope & Core Objectives
* **Target Application:** ParaBank (Parasoft Demo Banking)
* **Target Application URL:** [https://parabank.parasoft.com/](https://parabank.parasoft.com/)
* **Automation Engine:** Playwright Test Runner
* **Programming Language:** JavaScript (ES6+ Standards)
* **Design Pattern:** Page Object Model (POM)
* **Total Scope:** 8 Services × 15 Test Cases = **Exactly 120 Test Cases**

---

##  Tech Stack & Core Dependencies
* **Node.js** (v18+ recommended)
* **Playwright Test** (Core automation framework)
* **Allure Playwright** (Advanced professional test reporting)
* **Dotenv** (Environment variables configuration management)

---

##  Framework Architecture & Folder Structure

The project implements the **Page Object Model (POM)** pattern to clean separate test assertions from UI element locators:

```text
wipro-capstone-project/
├── .github/                            # GitHub Actions workflows / CI configuration
├── allure-report/                      # Generated Allure HTML test reports
├── allure-results/                     # Raw test results used by Allure
├── node_modules/                       # Node.js dependencies and packages
├── pages/                              # Page Object Classes (Locators & Core Actions)
│   ├── 01_LoginPage.js
│   ├── 02_NewAccountPage.js
│   ├── 03_AccountOverviewPage.js
│   ├── 04_TransferFundsPage.js
│   ├── 05_BillPayPage.js
│   ├── 06_TransactionSearchPage.js
│   ├── 07_CustomerSupportPage.js
│   └── 08_AdminPage.js
├── playwright-report/                  # Default Playwright HTML report outputs
│   └── index.html
├── test-results/                       # Artifacts from failed tests (screenshots/videos)
├── tests/                              # 120 Automated Test Scripts (.spec.js files)
│   ├── 01_authentication.spec.js
│   ├── 02_newAccount.spec.js
│   ├── 03_accountOverview.spec.js
│   ├── 04_transferFunds.spec.js
│   ├── 05_billPay.spec.js
│   ├── 06_transactionSearch.spec.js
│   ├── 07_customerSupport.spec.js
│   └── 08_internalApi.spec.js
├── .gitignore                          # Files and folders ignored by Git
├── package-lock.json                   # Locked versions of project dependencies
├── package.json                        # Project metadata, custom CLI scripts, and dependencies
├── playwright.config.js                # Main Playwright global test execution properties
├── README.md                           # Project documentation (This file)
└── wipro-capstone-project-documentation.pdf  # Project documentation artifact
