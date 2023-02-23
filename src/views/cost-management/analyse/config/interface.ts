export interface CostAnalyRow {
  name: string;
  type: string;
  monthSpend: string;
  timeRange: string;
}

export interface FilterItem {
  filterName: string;
  operator: string;
  values: string[];
  includeAll?: boolean;
}
export interface IdleCostFiltersItem {
  clusterName: string;
  connectorID: string;
  includeAll: boolean;
}
export interface ManagementCostFilters {
  clusterName: string;
  connectorID: string;
  includeAll: boolean;
}
export interface ShareCostItem {
  filters: FilterItem[];
  idleCostFilters: IdleCostFiltersItem[];
  managementCostFilters: ManagementCostFilters[];
  sharingStrategy: string;
}
export interface AllocationQueriesItem {
  filters: Array<FilterItem[]>;
  groupBy: string;
  step: string;
  paging: {
    page: number;
    perPage: number;
  };
  shareCosts: ShareCostItem[];
}
export interface PerspectiveRowData {
  id: string;
  name: string;
  createTime: string;
  updateTime: string;
  startTime: string;
  endTime: string;
  builtin: boolean;
  allocationQueries: AllocationQueriesItem[];
}
