export interface MatchingRule {
  id?: string;
  pageAction?: string;
  attributes: Record<string, any>;
  name: string;
  selector: {
    environmentLabels?: Record<string, any>;
    environmentNames?: string[];
    environmentTypes?: string[];
    projectNames?: Array<string>;
    projectLabels?: Record<string, any>;
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
  uiSchema?: any;
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
    environmentNames: [],
    environmentTypes: [],
    projectNames: [],
    resourceLabels: {},
    projectLabels: {}
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
