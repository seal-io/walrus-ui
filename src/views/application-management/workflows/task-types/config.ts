import { ServiceDataType } from '@/views/application-management/services/config';

export const TaskTypes = {
  APPROVAL: 'approval',
  SERVICE: ServiceDataType.service,
  RESOURCE: ServiceDataType.resource
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
    description: ''
  },
  {
    label: 'workflow.task.form.fillin',
    value: 'form',
    taskType: TaskTypes.SERVICE,
    description: 'workflow.task.form.info.service'
  },
  {
    label: 'workflow.task.form.fillin',
    value: 'form',
    taskType: TaskTypes.APPROVAL,
    description: 'workflow.task.form.info.approval'
  }
];

export default {};
