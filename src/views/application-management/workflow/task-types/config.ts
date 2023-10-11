export const StepTypes = {
  APPROVAL: 'approval',
  SERVICE: 'service'
};

export const TaskTypeList = [
  {
    title: '人工卡点',
    value: StepTypes.APPROVAL,
    description: '人工卡点',
    icon: 'icon-jiaoseshouquan'
  },
  {
    title: '服务',
    value: StepTypes.SERVICE,
    description: '服务',
    icon: 'icon-fuwu'
  }
];

export default {};
