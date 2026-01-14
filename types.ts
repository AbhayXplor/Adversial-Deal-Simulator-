export enum RiskSeverity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface Clause {
  id: string;
  category: string;
  sectionReference: string;
  text: string;
  summary: string;
}

export type ImpactLevel = 'Low' | 'Medium' | 'High';

export interface RiskAnalysis {
  id: string;
  title: string;
  category: string;
  description: string;
  severity: RiskSeverity;
  affectedClauses: string[];
  ruleLogic: string;
  ruleLabel: string;
  evidenceSnippet: string;
  scenarioTitle: string;
  scenarioNarrative: string;
  scenarioImpact: string;
  recoveryRisk: ImpactLevel;
  controlRisk: ImpactLevel;
  timingRisk: ImpactLevel;
  adversarialHighlight: string;
}

export interface APIConfig {
  customKey: string;
  reasoningModel: string;
  extractionModel: string;
}

export interface ProjectState {
  fileName: string | null;
  content: string | null;
  clauses: Clause[];
  risks: RiskAnalysis[];
  isAnalyzing: boolean;
  analysisProgress: number;
  view: 'landing' | 'simulator';
  showAdversarial: boolean;
  apiConfig: APIConfig;
}