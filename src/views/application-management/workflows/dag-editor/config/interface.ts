interface Step {
  template: string;
  name: string;
  metadata?: object;
  [key: string]: any;
  activeDeadlineSeconds?: number;
  retryStrategy?: {
    limit?: number;
    retryPolicy?: string;
  };
  arguments?: {
    parameters?: {
      name: string;
      value: string;
    }[];
  };
}

export interface WorkflowTemplate {
  name: string;
  metadata?: object;
  inputs?: object;
  outputs?: object;
  dag?: {
    tasks: Step[];
  };
  [key: string]: any;
  steps?: Step[][];
}

export interface Workflow {
  workflow: {
    metadata: {
      name: string;
      [key: string]: any;
    };
    spec: {
      entrypoint: string;
      activeDeadlineSeconds?: number;
      parallelism?: number;
      templates: WorkflowTemplate[];
    };
  };
}

export default {};
