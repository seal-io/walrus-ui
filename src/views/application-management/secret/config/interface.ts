export interface SecretRow {
  id: string;
  name: string;
  createTime: string;
}
export interface SecretFormData {
  name: string;
  value: string;
  id?: string;
  project: {
    id: string | number;
  };
}

export interface Variable {
  name: string;
  type: string;
  default: any;
  visible: boolean;
}
