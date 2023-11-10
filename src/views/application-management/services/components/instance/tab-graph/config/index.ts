import realizationImg from '@/assets/images/realization.png';
import depsImg from '@/assets/images/dependency.png';
import compImg from '@/assets/images/composition.png';
import warningStatus from '../img/warning.png';
import errorStatus from '../img/error.png';
import successStatus from '../img/success.png';
import { Status } from '../../../../config';

export const statusMap = {
  [Status.Warning]: warningStatus,
  [Status.Error]: errorStatus,
  [Status.Running]: successStatus
};

export const edgeType = {
  Composition: 'Composition',
  Dependency: 'Dependency',
  Realization: 'Realization'
};

export const customeLegend = [
  { label: edgeType.Composition, type: edgeType.Composition, icon: compImg },
  { label: edgeType.Dependency, type: edgeType.Dependency, icon: depsImg },
  {
    label: edgeType.Realization,
    type: edgeType.Realization,
    icon: realizationImg
  }
];
export const nodeKindType = {
  Service: 'Resource',
  ServiceResource: 'ResourceComponent',
  ServiceResourceGroup: 'ResourceComponentGroup'
};

export const strokeStyle = {};
export default {};
