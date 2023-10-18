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
  parallelism: number;
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

export interface PipelineRecordsRow {
  createTime: string;
  updateTime: string;
  description: string;
  duration: number;
  id: string;
  input: string;
  labels: object;
  name: string;
  progress: string;
  project: object;
  record: string;
  stageExecutionIds: string[];
  status: object;
  subjectID: string;
}
