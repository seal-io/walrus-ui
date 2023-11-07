export interface MatchingRule {
  attributes: Record<string, any>;
  name: string;
  selector: {
    environmentLabels: Record<string, any>;
    environmentName: string;
    environmentType: string;
    projectName: string;
    resourceLabels: Record<string, any>;
  };
  templateVersion: {
    id: string;
    name: string;
    version: string;
    project: {
      id: string;
      name: string;
    };
    template: {
      id: string;
    };
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
  createTime: string;
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
  templateVersion: {
    id: '',
    name: '',
    version: '',
    project: {
      id: '',
      name: ''
    },
    template: {
      id: ''
    }
  }
};
export default {};
