import { InjectionKey } from 'vue';

export interface ProjectEnvironmentContext {
  projectID: string;
  environmentID: string;
  connectors: any[];
  isProjectConnector?: boolean;
}

export const projectEnvCtxInjectionKey: InjectionKey<ProjectEnvironmentContext> =
  Symbol('projectEnvCtxInjectionKey');
