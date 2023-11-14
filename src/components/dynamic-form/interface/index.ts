export interface FieldSchema {
  name: string;
  title?: string;
  fieldPath: string[];
  type: string;
  default: any;
  description: string;
  multipleOf?: number;
  readOnly?: boolean;
  writeOnly?: boolean;
  externalDocs?: string;
  examples?: string;
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  minLength?: number;
  enum?: any[];
  items?: FieldSchema;
  required?: string[];
  properties?: FieldSchema;
  additionalProperties?: any;
  options?: { label: string; value: string }[];
  label?: string;
  format?: string;
}

export interface Group {
  [group: string]: Record<string, FieldSchema>[];
}

export interface FormGroup {
  group: string;
  schema: FieldSchema;
}

export interface Option {
  label: string;
  value: string;
}

export default {};
