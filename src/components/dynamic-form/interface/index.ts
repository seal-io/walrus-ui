export interface FieldSchema {
  '_t'?: string | number;
  'name': string;
  'arrayItemProperty'?: boolean;
  'title'?: string;
  'fieldPath': string[];
  'type': string;
  'default': any;
  'description': string;
  'multipleOf'?: number;
  'readOnly'?: boolean;
  'writeOnly'?: boolean;
  'externalDocs'?: object;
  'examples'?: string;
  'minimum'?: number;
  'maximum'?: number;
  'maxLength'?: number;
  'minLength'?: number;
  'minItems'?: number;
  'maxItems'?: number;
  'isItemsProperty'?: boolean;
  'isItems'?: boolean;
  'enum'?: any[];
  'items'?: FieldSchema;
  'required'?: string[];
  'isRequired'?: boolean;
  'parentRequired'?: string[];
  'parentSpan'?: number;
  'halfGrid'?: boolean;
  'level': number;
  'colSpan'?: number;
  'nullable'?: boolean;
  'originNullable'?: boolean;
  'properties'?: FieldSchema;
  'additionalProperties'?: FieldSchema;
  'options'?: { label: string; value: string }[];
  'label'?: string;
  'format'?: string;
  'x-walrus-ui'?: Record<string, any>;
}

// custom keywords and type map
export const customFields = {
  'x-walrus-ui': {
    type: 'object'
  },
  'fieldPath': {
    type: 'array'
  },
  'halfGrid': {
    type: 'boolean'
  },
  'colSpan': {
    type: 'number'
  },
  'originNullable': {
    type: 'boolean'
  },
  'level': {
    type: 'number'
  },
  'isRequired': {
    type: 'boolean'
  },
  'parentRequired': {
    type: 'array'
  },
  '_t': {
    type: 'string'
  },
  'options': {
    type: 'array'
  },
  'name': {
    type: 'string'
  }
};
export interface Group {
  [group: string]: {
    hidden: boolean;
    schema: Record<string, FieldSchema>[];
  };
}

export interface FormGroup {
  group: string;
  hidden: boolean;
  groupOrder: number;
  schema: FieldSchema;
}

export interface Option {
  label: string;
  value: string;
}

export default {};
