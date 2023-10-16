export interface Step {
  id?: string;
  dependencies: string[];
  description: string;
  input: object;
  labels: object;
  status?: Record<string, any>;
  name: string;
  spec: Record<string, any>;
}
export interface Stage {
  id?: string;
  dependencies: string[];
  description: string;
  name: string;
  steps: Step[];
}

export interface PipelineRow {
  createTime: string;
  description: string;
  displayName: string;
  environmentID: string;
  id: string;
  name: string;
  executions: Array<Step>;
  labels: object;
  project: {
    id: string;
    name: string;
  };
  stageIds: string[];
  status: object;
  type: string;
  updateTime: string;
  stages: Stage[];
}
