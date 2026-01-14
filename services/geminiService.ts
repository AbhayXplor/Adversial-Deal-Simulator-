import { GoogleGenAI, Type } from "@google/genai";
import { Clause, RiskAnalysis, RiskSeverity, APIConfig } from "../types.ts";

export const analyzeCreditAgreement = async (
  text: string, 
  config: APIConfig,
  onProgress: (p: number) => void
): Promise<{ clauses: Clause[], risks: RiskAnalysis[] }> => {
  // Use custom key if provided, otherwise fallback to env
  const apiKey = config.customKey.trim() !== '' ? config.customKey : (process.env.API_KEY || '');
  
  if (!apiKey) {
    throw new Error("No API Key provided. Please set a custom key in settings or ensure API_KEY env is set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  onProgress(15);
  
  // Phase 1: Clause Extraction
  const extractionResponse = await ai.models.generateContent({
    model: config.extractionModel || 'gemini-3-flash-preview',
    contents: `Analyze this credit agreement. Extract verbatim clauses for: Unrestricted Subsidiaries, Investments, Debt Incurrence, Asset Transfers, and Change of Control.
    Document Text: ${text.substring(0, 45000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            sectionReference: { type: Type.STRING },
            text: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["id", "category", "sectionReference", "text", "summary"]
        }
      }
    }
  });

  onProgress(45);
  const extractedClauses: Clause[] = JSON.parse(extractionResponse.text || "[]");

  // Phase 2: Adversarial Risk Identification
  const riskResponse = await ai.models.generateContent({
    model: config.reasoningModel || 'gemini-3-pro-preview',
    contents: `Acting as an adversarial credit analyst, identify structural vulnerabilities in these clauses. 
    Focus on: Unrestricted Subsidiaries, Asset Transfer Leakage, Debt Incurrence, Cure Period Abuse, and Change of Control.
    
    For each risk, define a specific "Adversarial Scenario" where a borrower exploits the language.
    Determine Impact Levels (Low/Medium/High) for Recovery, Control, and Timing risks.
    Identify the specific verbatim phrase within the clause that creates the loophole (adversarialHighlight).

    Clauses: ${JSON.stringify(extractedClauses)}`,
    config: {
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING, enum: Object.values(RiskSeverity) },
            affectedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            ruleLogic: { type: Type.STRING },
            ruleLabel: { type: Type.STRING },
            evidenceSnippet: { type: Type.STRING },
            scenarioTitle: { type: Type.STRING },
            scenarioNarrative: { type: Type.STRING },
            scenarioImpact: { type: Type.STRING },
            recoveryRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            controlRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            timingRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            adversarialHighlight: { type: Type.STRING }
          },
          required: [
            "id", "title", "category", "description", "severity", "affectedClauses", 
            "ruleLogic", "ruleLabel", "evidenceSnippet", "scenarioTitle", 
            "scenarioNarrative", "scenarioImpact", "recoveryRisk", "controlRisk", 
            "timingRisk", "adversarialHighlight"
          ]
        }
      }
    }
  });

  onProgress(100);
  const risks: RiskAnalysis[] = JSON.parse(riskResponse.text || "[]");
  return { clauses: extractedClauses, risks };
};