
export const ADVERSARIAL_PATTERNS = [
  {
    name: "J.Crew / Unrestricted Subsidiary Trap",
    description: "Identifies whether specific investment baskets allow for the transfer of material IP or assets to unrestricted subsidiaries, potentially removing them from the collateral package.",
    logic: "Cross-references 'Investments' baskets with 'Negative Pledge' exceptions and 'Unrestricted Subsidiary' definitions."
  },
  {
    name: "Serta-style Non-Pro-Rata Priming",
    description: "Detects language in the 'Amendments' or 'Required Lenders' sections that could allow a subset of lenders to modify payment priority or collateral rights without 100% lender consent.",
    logic: "Analyzes 'Sacred Rights' clauses for omissions regarding payment subordination or 'uptiering' transactions."
  },
  {
    name: "Chewy-style Automatic Release",
    description: "Scans for automatic guarantee or lien releases triggered by 'Investments' or 'Asset Sales' to non-wholly owned subsidiaries.",
    logic: "Examines 'Guarantees' and 'Lien Release' sections for mandatory discharge upon transfer to a non-guarantor affiliate."
  },
  {
    name: "EBITDA Add-back Dilution",
    description: "Flags excessive or uncapped 'Expected Synergies' or 'Restructuring Costs' that artificially inflate Consolidated EBITDA for covenant compliance.",
    logic: "Calculates the interaction between 'Consolidated EBITDA' definitions and 'Negative Covenant' leverage ratios."
  }
];

export const SYSTEM_LIMITATIONS = [
  "This system does not provide legal advice or legal conclusions.",
  "The analysis is deterministic and rule-based, focusing only on explicit contractual language.",
  "It does not predict transaction likelihood or market outcomes.",
  "The system does not assess the creditworthiness of any entity.",
  "It is not a substitute for professional legal or financial counsel."
];
