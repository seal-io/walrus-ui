export interface Step {
  dependencies: string[];
  description: string;
  input: object;
  labels: object;
  name: string;
  spec: Record<string, any>;
}
export interface Stage {
  dependencies: string[];
  description: string;
  name: string;
  steps: Step[];
}
