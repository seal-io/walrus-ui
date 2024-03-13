import { TemplateRowData } from '../../templates/config/interface';

export interface CatalogRowData extends TemplateRowData {
  sync: {
    time: string;
    total: number;
    failed: number;
    succeeded: number;
  };
}
export interface CatalogFormData {
  description: string;
  filterPattern: string;
  icon?: string;
  name: string;
  source: string;
  type: string;
  id?: string;
}

export default {};
