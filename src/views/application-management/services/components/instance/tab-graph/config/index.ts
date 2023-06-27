import { MarkerType } from '@vue-flow/core';
import warningStatus from '../img/warning.png';
import errorStatus from '../img/error.png';
import successStatus from '../img/success.png';
import { Status } from '../../../../config';
/**
 * You can pass elements together as a v-model value
 * or split them up into nodes and edges and pass them to the `nodes` and `edges` props of Vue Flow (or useVueFlow composable)
 */

export const statusMap = {
  [Status.Warning]: warningStatus,
  [Status.Error]: errorStatus,
  [Status.Running]: successStatus
};

export const edgeType = {
  Composition: 'Composition',
  Dependency: 'Dependency'
};
export const nodeKindType = {
  Service: 'Service',
  ServiceResource: 'ServiceResource'
};
export default {};
