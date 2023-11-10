export interface MatchingRule {
  attributes: Record<string, any>;
  name: string;
  selector: {
    environmentLabels?: Record<string, any>;
    environmentName?: string;
    environmentType?: string;
    projectName?: string;
    resourceLabels?: Record<string, any>;
  };
  template: {
    id: string;
    name: string;
    version: string;
    template: {
      id: string;
    };
    // project: {
    //   id: string;
    //   name: string;
    // };
  };
}
export interface ResourceDefinitionFormData {
  id?: string;
  name: string;
  type: string;
  description?: string;
  labels?: Record<string, string>;
  matchingRules: MatchingRule[];
}

export interface ResourceDefinitionRowData extends ResourceDefinitionFormData {
  name: string;
  id: string;
  createTime: string;
}

export interface Input {
  name: string;
  type: string;
  description: string;
  default: any;
}

export interface Output {
  name: string;
  description: string;
}

export const definitionFormData = {
  attributes: {},
  name: '',
  selector: {
    environmentLabels: {},
    environmentName: '',
    environmentType: '',
    projectName: '',
    resourceLabels: {}
  },
  template: {
    id: '',
    name: '',
    version: '',
    template: {
      id: ''
    }
  }
};
export default {};
