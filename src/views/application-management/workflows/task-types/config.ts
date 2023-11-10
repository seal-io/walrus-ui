export const TaskTypes = {
  APPROVAL: 'approval',
  SERVICE: 'service',
  RESOURCE: 'resource'
};

export const TaskTypeList = [
  {
    title: 'workflow.task.form.manualapproval',
    value: TaskTypes.APPROVAL,
    description: 'workflow.task.form.manualapproval',
    icon: 'icon-jiaoseshouquan'
  },
  {
    title: 'workflow.task.form.deployservice',
    value: TaskTypes.SERVICE,
    description: 'workflow.task.form.deployservice',
    icon: 'icon-fuwu'
  }
];

export const stepList = [
  { label: 'workflow.task.form.selectTask', value: 'taskType' },
  {
    label: 'workflow.task.form.selectenv',
    value: 'env',
    taskType: TaskTypes.SERVICE,
    description: 'workflow.task.form.deployEnv'
  },
  { label: 'workflow.task.form.fillin', value: 'form' }
];

export default {};