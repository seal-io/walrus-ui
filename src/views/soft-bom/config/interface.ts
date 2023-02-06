export interface ScoreCardItem {
  value: string;
  label: string;
  name?: string;
  localeLabel?: string;
  color?: string;
  documentation?: {
    short: string;
    url: string;
  };
  score?: number;
  reason?: string;
  details?: string[];
}
export interface BasicItem {
  value: string;
  label: string;
  key?: string;
}
export interface LicenseItem {
  license: { id: string };
}
export interface VulnerItem {
  id: number;
  affected: string;
  cvss: object;
  cwes: string[];
  deprecated: boolean;
  description: string;
  name: string;
  namespace: string;
  patched: string[];
  references: string[];
  reviewed: boolean;
  summary: string;
  tags: string[];
}
export interface TableRowData {
  id: string;
  name: string;
  version: string;
  namespace: string;
  licenses: string;
  latestVersion: string;
  packageSystem: string;
  purl: string;
  language: string;
  repositoryIDs: string[];
}
export default {};
