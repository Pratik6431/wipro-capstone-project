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
├── pages/                 # Page Object Classes (Locators & Core Actions)
│   ├── LoginPage.js
│   ├── NewAccountPage.js
│   ├── AccountOverviewPage.js
│   ├── TransferFundsPage.js
│   ├── BillPayPage.js
│   ├── TransactionSearchPage.js
│   ├── CustomerSupportPage.js
│   └── AdminPage.js
├── tests/                 # 120 Automated Test Scripts (.spec.js files)
│   ├── authentication.spec.js
│   ├── newAccount.spec.js
│   ├── accountOverview.spec.js
│   ├── transferFunds.spec.js
│   ├── billPay.spec.js
│   ├── transactionSearch.spec.js
│   ├── customerSupport.spec.js
│   └── internalApi.spec.js
├── playwright.config.js   # Main Playwright global test execution properties
├── package.json           # Project metadata, custom CLI scripts, and dependencies
└── README.md              # Project documentation (This file)
