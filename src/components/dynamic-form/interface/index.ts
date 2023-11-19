export interface FieldSchema {
  'name': string;
  'title'?: string;
  'fieldPath': string[];
  'type': string;
  'default': any;
  'description': string;
  'multipleOf'?: number;
  'readOnly'?: boolean;
  'writeOnly'?: boolean;
  'externalDocs'?: string;
  'examples'?: string;
  'minimum'?: number;
  'maximum'?: number;
  'maxLength'?: number;
  'minLength'?: number;
  'enum'?: any[];
  'items'?: FieldSchema;
  'required'?: string[];
  'parentRequired'?: string[];
  'halfGrid'?: boolean;
  'colSpan'?: number;
  'properties'?: FieldSchema;
  'additionalProperties'?: FieldSchema;
  'options'?: { label: string; value: string }[];
  'label'?: string;
  'format'?: string;
  'x-walrus-ui'?: Record<string, any>;
}

export interface Group {
  [group: string]: {
    groupOrder: number;
    schema: Record<string, FieldSchema>[];
  };
}

export interface FormGroup {
  group: string;
  groupOrder: number;
  schema: FieldSchema;
}

export interface Option {
  label: string;
  value: string;
}

export default {};
