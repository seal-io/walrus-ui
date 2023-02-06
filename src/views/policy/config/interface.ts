export interface ConditionItem {
  conditionType: string;
  value: any;
  operator: string;
}
export interface ProjectItem {
  value: string;
  label: string;
  provider: string;
}
export interface BindingsType {
  isAllResource: boolean;
  isAllProxy: boolean;
  tags: string[];
  proxyIDs: string[];
  repositoryIDs: string[];
}
export interface FormDataType {
  id?: string;
  severity: string;
  action: string;
  name: string;
  code?: string;
  tagsText: string;
  bindings: BindingsType;
  category: string | string[];
  type: string;
  builtIn?: boolean;
  scopeAll?: string;
  scopePartial?: string;
  description: string;
  enabled: boolean;
  expression: string;
  constraint: {
    operator: string;
    conditions: Array<ConditionItem>;
  };
}

export interface ConditionCategoryPropertiesType {
  description: string;
  properties: {
    value: {
      type: string;
      enum: string[];
    };
    operator: {
      type: string;
      enum: string[];
    };
  };
}

export interface OperatorItemConfig {
  valueType: string;
  label: string;
  value: string;
}
export interface ConditionItemConfig {
  conditionType: string;
  description: string;
  valueConfigs: { label: string; value: any }[];
  label: string;
  valueType: string;
  min: number;
  max: number;
  hasOperator: boolean;
  operatorConfigs: OperatorItemConfig[];
  api: string;
  resultPath: string;
}
export interface CategoryItemConfig {
  category: string;
  description: string;
  conditions: ConditionItemConfig[];
}
