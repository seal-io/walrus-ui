export const NodeType = {};

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
export default {};
