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
}
