import { MoreAction } from '@/views/config/interface';
import { useUserStore } from '@/store';
import _ from 'lodash';
import { Resources, Actions } from '@/permissions/config';

const userStore = useUserStore();
export const NodeType = {};

export const colors = [
  '#6300D5',
  '#8D74A5',
  '#0084FF',
  '#00C7A5',
  '#6300D5',
  '#8D74A5',
  '#0084FF',
  '#00C7A5',
  '#6300D5',
  '#8D74A5',
  '#0084FF',
  '#00C7A5',
  '#6300D5',
  '#8D74A5',
  '#0084FF',
  '#00C7A5'
];
export const workflowTimeoutOptons = [
  { label: 'workflow.task.timeout.thirty', value: 1800 },
  { label: 'workflow.task.timeout.hour', value: 3600 },
  { label: 'workflow.task.timeout.2hour', value: 7200 }
];

export const retryOptions = [
  {
    label: 'workflow.task.retry.always',
    value: 'Always',
    description: 'workflow.task.retry.always.desc'
  },
  {
    label: 'workflow.task.retry.onfailure',
    value: 'OnFailure',
    description: 'workflow.task.retry.onfailure.desc'
  },
  {
    label: 'workflow.task.retry.onerror',
    value: 'OnError',
    description: 'workflow.task.retry.onerror.desc'
  }
];

export const CustomShape = {
  pipelineNode: 'pipeline-node',
  separatorNode: 'separator-node',
  pipelineEdge: 'pipeline-edge'
};

export const WorkflowStatus = {
  Running: 'Running',
  Completed: 'Completed',
  Pending: 'Pending',
  Failed: 'Failed'
};
export const WorkflowStatusMap = {
  Running: 'Running',
  Completed: 'Ready',
  Pending: 'Pending',
  Error: 'Failed'
};

export const ApprovalTypeMap = {
  OR: 'or',
  AND: 'and'
};
export const approvalTypes = [
  {
    label: 'workflow.task.approval.or',
    description: 'workflow.task.approval.or.desc',
    value: 'or'
  },
  {
    label: 'workflow.task.approval.and',
    description: 'workflow.task.approval.and.desc',
    value: 'and'
  }
];

export const memberList = [
  {
    label: 'tom',
    value: 'tom'
  },
  {
    label: 'jerry',
    value: 'jerry'
  },
  {
    label: 'jack',
    value: 'jack'
  }
];

export const platformRoles = [
  {
    label: '所有者',
    value: 'owner'
  },
  {
    label: '成员',
    value: 'member'
  },
  {
    label: '管理员',
    value: 'admin'
  }
];

export const pipelineRoles = [
  {
    label: '工作流所有者',
    value: 'pipelineOwner'
  },
  {
    label: '工作流/所有权限',
    value: 'pipelineOwnerAll'
  },
  {
    label: '工作流/运行权限',
    value: 'pipelineOwnerRun'
  },
  {
    label: '工作流/查看权限',
    value: 'pipelineOwnerView'
  },
  {
    label: '工作流成员',
    value: 'pipelineMember'
  }
];

export const approvalRoles = [
  {
    label: '成员',
    description: '选择平台成员作为审核人员',
    value: 'member',
    items: memberList
  },
  {
    label: '平台角色',
    description: '选择平台角色作为审核人员',
    value: 'platformRoles',
    items: platformRoles
  },
  {
    label: '工作流角色',
    description: '选择工作流角色作为审核人员',
    value: 'pipelineRoles',
    items: pipelineRoles
  }
];

export const stageSchema = {
  dependencies: [],
  description: '',
  name: '',
  steps: []
};

export const stepSchema = {
  dependencies: [],
  description: '',
  input: {},
  labels: {},
  name: '',
  attributes: {
    // projectID: '',
    // environmentID: '',
    // environment: {
    //   id: ''
    // },
    // name: '',
    // attributes: {},
    // template: {
    //   name: '',
    //   version: ''
    // },
    // jobType: 'apply',
    // timeout: 0
  },
  timeout: 0,
  type: ''
};

export const tools = [
  {
    label: 'applications.environment.graph.fitview',
    value: 'fitCenter',
    icon: 'icon-fit_screen-o'
  },
  {
    label: 'common.button.refresh',
    value: 'refresh',
    compile: true,
    icon: 'icon-sync'
  }
  // {
  //   label: 'common.button.undo',
  //   value: 'undo',
  //   disabled: false,
  //   icon: 'icon-undo'
  // },
  // {
  //   label: 'common.button.redo',
  //   value: 'redo',
  //   disabled: false,
  //   icon: 'icon-redo'
  // }
];

export const moreActions: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Workflows,
        projectID: _.get(currentInfo, 'project.id'),
        actions: [Actions.PUT]
      });
    }
  },
  {
    label: 'common.button.run',
    value: 'apply',
    icon: 'icon-play-circle-fill',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Workflows,
        projectID: _.get(currentInfo, 'project.id'),
        actions: [Actions.POST]
      });
    }
  }
];

export const pipelineDetailActions: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.Workflows,
        projectID: _.get(currentInfo, 'project.id'),
        actions: [Actions.PUT]
      });
    }
  }
];
export const recordActions: MoreAction[] = [
  {
    label: 'common.button.view',
    value: 'view',
    icon: 'iconFont',
    handler: '',
    status: 'normal',
    disabled: false,
    filterFun(currentInfo) {
      return userStore.hasProjectResourceActions({
        resource: Resources.WorkflowExecutions,
        projectID: _.get(currentInfo, 'project.id'),
        actions: [Actions.GET]
      });
    },
    props: {
      type: 'icon-xiangqing'
    }
  }
  // {
  //   label: 'common.button.delete',
  //   value: 'delete',
  //   icon: 'icon-delete',
  //   handler: '',
  //   status: 'danger',
  //   disabled: false,
  //   filterFun(currentInfo) {
  //     return true;
  //   }
  // }
];
export const moreMenu = [
  {
    label: 'common.button.delete',
    value: 'remove',
    status: 'danger',
    icon: 'icon-shanchu'
  }
];
export const NodeSize = {
  width: 180,
  height: 48
};

export const PipelineNodeSize = {
  width: 240,
  height: 130
};
export default {};
