export const TaskTypes = {
  APPROVAL: 'approval',
  SERVICE: 'service'
};

export const TaskTypeList = [
  {
    title: '人工审核',
    value: TaskTypes.APPROVAL,
    description: '人工审核',
    icon: 'icon-jiaoseshouquan'
  },
  {
    title: '部署服务',
    value: TaskTypes.SERVICE,
    description: '部署服务',
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
