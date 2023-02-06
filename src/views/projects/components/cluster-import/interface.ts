import { kuberItem } from '@/views/intergration/api/kubernetes';
import { ResouceSpaceItem } from '../../api/resource';

export interface KuberDataItem extends kuberItem {
  imported: boolean;
  indeterminate: boolean;
  checked: boolean;
  namespaceList?: ResouceSpaceItem[];
}

export default {};
