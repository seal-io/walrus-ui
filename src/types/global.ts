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

export interface ListResult<T> {
  items: T[];
  apiVersion: string;
  kind: string;
  metadata: object;
  pagination: Pagination;
}

export type TimeRanger = [string, string];

export type BaseType = string | number;
export interface GeneralChart {
  xAxis: string[];
  data: Array<{ name: string; value: number[] }>;
}

export interface ListQuery {
  name?: string;
  namespace?: string;
  fieldSelector?: string;
  labelSelector?: string;
  limit?: number;
  fields?: string[];
}

export interface AxiosRequestPayload {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    [key: string]: any;
  };
  spec?: Record<string, any>;
  status?: Record<string, any>;
}

export interface RequestCallbackArgs {
  data: AxiosRequestPayload;
  namespace: string;
  name?: string;
}

export interface DataListItem {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    [key: string]: any;
  };
  spec: Record<string, any>;
  status: Record<string, any>;
}
