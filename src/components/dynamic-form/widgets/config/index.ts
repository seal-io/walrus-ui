import { InjectionKey, Ref } from 'vue';

export interface ProjectEnvironmentContext {
  projectID: string;
  environmentID: string;
  connectors: any[];
  isProjectConnector?: boolean;
}

export const projectEnvCtxInjectionKey: InjectionKey<
  Ref<Partial<ProjectEnvironmentContext>>
> = Symbol('projectEnvCtxInjectionKey');
