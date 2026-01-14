# ADS.SIM // Adversarial Deal Simulator

### "Unit Testing" for Billion-Dollar Credit Agreements.

**ADS.SIM** is a deterministic intelligence engine designed to identify structural loopholes in complex credit agreements. It treats legal documentation as "legal code," scanning for adversarial logic patterns that sophisticated borrowers use to strip assets, dilute collateral, and subordinate lenders.

---

## 💡 Inspiration
In the high-stakes world of private credit and distressed debt, a single missing word in a 500-page document can lead to billions in losses (e.g., the infamous J.Crew "Trap Door" or Serta "Uptiering"). Legal risk is often hidden in the *interaction* between disparate clauses. We built ADS to automate the discovery of these "legal bugs" before they manifest as financial losses.

## 🚀 What it does
ADS scans uploaded credit agreements and applies a rule-based logic engine to:
- **Identify Loophole Patterns:** Detects J.Crew, Serta, Chewy, and Incora-style structural weaknesses.
- **Simulate Adversarial Actions:** Projects exactly how a borrower could exploit the specific language found in the agreement.
- **Evidence-Linked Auditing:** Every risk flag is directly linked to verbatim text in the document, ensuring 100% explainability (no "black box" AI hallucinations).
- **Quantify Vector Risk:** Breaks down risk across Recovery, Control, and Timing dimensions.

## 🛠️ How we built it
- **Frontend:** React 19 (ESM) with a high-fidelity SaaS dashboard built in Tailwind CSS.
- **Logic Engine:** Dual-model architecture:
    - **Gemini 3 Flash:** Handles high-volume verbatim clause extraction and indexing.
    - **Gemini 3 Pro:** Performs deep adversarial reasoning and cross-clause dependency analysis.
- **Deterministic Scanning:** We use Structured Outputs (JSON Schema) to ensure the AI adheres to a strict legal-logic framework rather than making speculative claims.

## 🧠 Challenges we ran into
Standard LLMs often struggle with the "cross-referencing" required in legal text (e.g., how a definition in Article I changes the permission of a covenant in Article VI). We solved this by using a multi-pass extraction technique where the model first "indexes" the document's definitions before attempting to find loopholes.

## ✅ Accomplishments that we're proud of
- **100% Determinism:** The system never provides "legal advice"—it highlights what the document *explicitly allows*.
- **High-Fidelity UI:** A terminal-to-SaaS interface that feels like a professional financial terminal.
- **Adversarial Highlighting:** Precisely identifying the 3-4 words in a 10,000-word section that create the vulnerability.

## 📖 What we learned
Legal text is surprisingly similar to code. If-then statements, nested logic, and variable definitions (definitions sections) are the building blocks of contracts. Viewing law through an engineering lens allows for much more predictable risk assessment.

## 🔮 What's next for ADS
- **Remediation Suggestion:** Automatically generating "Redline" fixes to close identified loopholes.
- **Market Benchmarking:** Comparing a deal's structural tightness against thousands of other market precedents.
- **Multi-Document Analysis:** Scanning the interaction between a Credit Agreement and an Intercreditor Agreement simultaneously.

---

## 🛠️ Installation & Deployment

### Environment Variables
To deploy ADS (e.g., on Vercel), add the following:

| Variable | Description |
| :--- | :--- |
| `API_KEY` | Your Gemini API Key (Must support Gemini 3 Pro/Flash) |

### Local Setup
1. Clone the repository.
2. Install dependencies.
3. Ensure `API_KEY` is set in your environment.
4. Run the development server.

---
*Built for the 2024 AI Financial Logic Hackathon.*