export const TaskTypes = {
  APPROVAL: 'approval',
  SERVICE: 'service'
};

export const TaskTypeList = [
  {
    title: '人工卡点',
    value: TaskTypes.APPROVAL,
    description: '人工卡点',
    icon: 'icon-jiaoseshouquan'
  },
  {
    title: '服务',
    value: TaskTypes.SERVICE,
    description: '服务',
    icon: 'icon-fuwu'
  }
];

export const stepList = [
  { label: '选择任务类型', value: 'taskType' },
  {
    label: '选择环境',
    value: 'env',
    taskType: TaskTypes.SERVICE,
    description: '服务部署环境'
  },
  { label: '填写表单', value: 'form' }
];

export default {};
