# Adversarial Deal Simulator (ADS)

**Repository Name:** `adversarial-deal-simulator`  
**Description:** A deterministic, rule-based intelligence engine for credit agreement analysis. ADS identifies structural vulnerabilities and contractual loopholes by cross-referencing negative covenants, investment baskets, and guarantee release mechanisms.

---

## Overview

The Adversarial Deal Simulator is designed for institutional credit analysts, distressed debt investors, and legal professionals. Unlike standard NLP tools, ADS uses a logic-first approach to simulate how sophisticated borrowers might exploit specific clause combinations (e.g., J.Crew-style asset transfers or Serta-style non-pro-rata priming).

### Key Features
- **Adversarial Scenario Simulation:** Projects hypothetical borrower actions based on explicit contractual "vacuums."
- **Clause-Level Evidence Linking:** Every risk flag is linked to a verbatim section of the source document with cryptographic hash referencing.
- **Risk Vector Analysis:** Quantifies impact across three distinct dimensions: Recovery Risk, Control Risk, and Timing Risk.
- **Structural Risk Index:** A high-level weighted score of the agreement's overall structural integrity.
- **Comparison View:** Toggle between "Base Case" (standard interpretation) and "Adversarial Case" (loophole highlighting).

---

## Technology Stack
- **Frontend:** React 19 (ESM)
- **Styling:** Tailwind CSS (Modern SaaS Aesthetic)
- **Intelligence Engine:** Gemini 3 Pro (Logic & Reasoning), Gemini 3 Flash (Extraction)
- **State Management:** React Context / Hooks

---

## Deployment Configuration

### Environment Variables
To deploy this application (e.g., on Vercel), you must configure the following environment variable:

| Variable | Description | Required |
| :--- | :--- | :--- |
| `API_KEY` | The primary API key for the underlying intelligence engine. | Yes |

### Vercel Setup
1.  **Create Project:** Import the repository into Vercel.
2.  **Environment Variables:** Navigate to `Settings > Environment Variables`.
3.  **Add Key:** Add a new variable named `API_KEY` and paste your project key.
4.  **Deploy:** The application is configured for zero-config deployment with standard React build settings.

---

## Architecture of Analysis

The analysis follows a deterministic three-stage pipeline:
1.  **Ingestion:** Verbatim extraction of critical definitions and negative covenants.
2.  **Rule Application:** Cross-referencing "Permitted Investment" baskets against "Lien Release" and "Unrestricted Subsidiary" definitions.
3.  **Simulation:** Generating the most probable adversarial path permitted by the identified language.

---

## Disclaimers

- **Non-Legal Advice:** This system provides deterministic rule-based analysis of text. It does not provide legal conclusions or legal advice.
- **No Speculation:** Analysis is limited to the explicit text provided in the document.
- **Institutional Use:** Designed as a decision-support tool for regulated professionals.

---

© 2024 ADS Terminal // Institutional Risk Intelligence