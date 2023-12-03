export interface FieldSchema {
  '_t'?: string | number;
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
  'minItems'?: number;
  'enum'?: any[];
  'items'?: FieldSchema;
  'required'?: string[];
  'isRequired'?: boolean;
  'parentRequired'?: string[];
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
