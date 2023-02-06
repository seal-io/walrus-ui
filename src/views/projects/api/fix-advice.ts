import axios from 'axios';
import qs from 'query-string';
import { Pagination } from '@/types/global';

export interface FixVulnerItem {
  namespace: string;
  name: string;
  purl: string;
  tags: string[];
  affected: string;
  patched: string;
  cvss: {
    baseSeverity: string;
    exploitabilityScore: string;
  };
  overall: {
    score: string;
    severity: string;
    specific: string;
    system: string;
    version: string;
  };
  description: string;
  cwes: string[];
  modified: string;
  published: string;
  mitigation: string;
  depsPkgName?: string;
  isFromDeps: boolean;
}
export interface VersionInfo {
  version: string;
  releaseTime: string;
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    none: number;
    vulnerabilities: FixVulnerItem[];
  };
}
export interface FixAdviceItem {
  id: string;
  resourceID: string;
  eventID: string;
  type: string;
  isFixable: boolean;
  compatibilityLevel: string;
  compatibilityDetail: {
    summary: string;
  };
  strategy: string;
  filePath: string;
  plugin: object;
  notice?: string;
  softwarePackage: {
    name: string;
    from: VersionInfo;
    to: VersionInfo;
  };
}

export interface ListParams {
  // page: number;
  // perPage: number;
  resourceID: string;
  eventID: string;
  isFixable?: boolean;
  strategy?: string;
  compatibilityLevel?: string;
}
interface ListResult {
  items: FixAdviceItem[];
  pagination: Pagination;
}

export interface LicenseItem {
  displayName: string;
  packageCount: number;
  details: Array<{
    id: number;
    name: string;
    namespace: string;
    tags: string[];
  }>;
}

interface LicenseResult {
  items: LicenseItem[];
  pagination: Pagination;
}

export interface LicenseParams {
  page: number;
  perPage: number;
  resourceID: string;
  eventID?: string;
  version?: string;
  query: string;
}
export function queryFixAdviceList(params: ListParams) {
  return axios.get<ListResult>(`/fix-advices`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryFixAdviceDetail(params: { id: string }) {
  return axios.get<FixAdviceItem>(`/fix-advices/${params.id}`);
}

export function queryResourceLicenses(params: LicenseParams) {
  return axios.get<LicenseResult>(`/resources/${params.resourceID}/licenses`, {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
