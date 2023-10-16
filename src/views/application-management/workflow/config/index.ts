import { MoreAction } from '@/views/config/interface';

export const NodeType = {};

export const CustomShape = {
  pipelineNode: 'pipeline-node',
  separatorNode: 'separator-node',
  pipelineEdge: 'pipeline-edge'
};

export const approvalTypes = [
  {
    label: '或签',
    description: '所有审批人中只要有一名同意或拒绝即可',
    value: 'or'
  },
  {
    label: '会签',
    description: '必须所有审批人都同意',
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
    label: '流水线所有者',
    value: 'pipelineOwner'
  },
  {
    label: '流水线/所有权限',
    value: 'pipelineOwnerAll'
  },
  {
    label: '流水线/运行权限',
    value: 'pipelineOwnerRun'
  },
  {
    label: '流水线/查看权限',
    value: 'pipelineOwnerView'
  },
  {
    label: '流水线成员',
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
    label: '流水线角色',
    description: '选择流水线角色作为审核人员',
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
  spec: {
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
      return true;
    }
  }
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
  width: 220,
  height: 80
};
export default {};
