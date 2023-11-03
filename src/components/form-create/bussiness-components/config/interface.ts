export interface Caller {
  [k: string]: (params: any, token?) => Promise<any>;
  transform: (res: any, params?) => any;
}

export interface Item {
  label: string;
  value: string;
}

export default {};
