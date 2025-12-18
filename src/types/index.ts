export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ToolConfig {
  id: string;
  name: string;
  category: string;
  icon: string;
  component: React.ComponentType;
  route: string;
  description?: string;
}

export type ToolCategory = 'math' | 'text' | 'convert' | 'image' | 'dev' | 'other';
