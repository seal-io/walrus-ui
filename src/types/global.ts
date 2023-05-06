export interface AnyObject {
  [key: string]: unknown;
}

export interface Options {
  value: unknown;
  label: string;
}

export interface NodeOptions extends Options {
  children?: NodeOptions[];
}

export interface GetParams {
  body: null;
  type: string;
  url: string;
}

export interface PostData {
  body: string;
  type: string;
  url: string;
}

export interface Pagination {
  page: number;
  perPage?: number;
  total?: number;
  partial?: boolean;
  totalPage?: number;
}

export type TimeRanger = [string, string];

export type BaseType = string | number;
export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}
