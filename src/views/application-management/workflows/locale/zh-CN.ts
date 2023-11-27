export default {
  'applications.workflow.create': '新建工作流',
  'applications.workflow.edit': '编辑工作流',
  'applications.workflow.view': '查看工作流',
  'applications.workflow.name': '工作流',
  'applications.workflow.filter.holder': '请输入工作流',
  'applications.workflow.table.status': '最近运行状态',
  'applications.workflow.table.stage': '最近运行阶段',
  'applications.workflow.table.trigger': '触发信息',
  'applications.workflow.table.update': '最近运行时间',
  'applications.workflow.table.currentStatus': '运行状态',
  'applications.workflow.table.startTime': '运行时间',
  'applications.workflow.table.runDetails': '运行详情',
  'applications.workflow.table.duration': '持续时间',
  'applications.workflow.table.runmsg': '运行成功！',
  'workflow.form.rules.displayName': '工作流名称必填',
  'workflow.form.rules.name': '工作流ID必填',
  'workflow.form.displayName': '工作流名称',
  'workflow.form.name': '工作流ID',
  'workflow.form.timeout': '超时时间',
  'workflow.step.modal.title': '{action}工作流步骤',
  'workflow.step.form.env': '目标环境',
  'workflow.stage.add.task': '添加步骤',
  'workflow.stage.add.taskName': '步骤名称',
  'workflow.stage.add.approvalMode': '审核方式',
  'workflow.stage.add.approvalUser': '审核人员',
  'workflow.stage.add.paratask': '并行步骤',
  'workflow.stage.add.parallelism': '最大并行运行步骤数',
  'workflow.stage.add.title': 'stage-{order}',
  'workflow.stage.add.button': '添加新阶段',
  'workflow.stage.records': '运行记录',
  'workflow.stage.recently.result': '最近运行结果',
  'workflow.stage.approve': '审批',
  'workflow.task.rules.taskName': '步骤名称必填',
  'workflow.task.rules.approvalMode': '请选择审核方式',
  'workflow.task.rules.approvalUser': '请选择审核人员',
  'workflow.task.form.manualapproval': '人工审核',
  'workflow.task.form.deployservice': '部署服务',
  'workflow.task.form.selectTask': '选择步骤类型',
  'workflow.task.form.fillin': '填写表单',
  'workflow.task.form.selectenv': '基本配置',
  'workflow.task.form.deployEnv': '目标环境',
  'workflow.task.form.info.service': '服务配置',
  'workflow.task.form.info.approval': '审核信息',
  'workflow.task.run.order': '第 {order} 次运行',
  'workflow.task.run.user': '执行人',
  'workflow.task.run.stage': '请添加有效的步骤',
  'workflow.task.approval.or': '或签',
  'workflow.task.approval.and': '会签',
  'workflow.task.approval.or.desc': '所有审批人中只要有一名同意或拒绝即可',
  'workflow.task.approval.and.desc': '必须所有审批人都同意',
  'workflow.task.timeout.thirty': '30分钟',
  'workflow.task.timeout.hour': '1小时',
  'workflow.task.timeout.2hour': '2小时',
  'workflow.task.retry.policy': '重试策略',
  'workflow.task.retry.count': '重试次数',
  'workflow.task.variable.runtieEditable': '运行时设置',
  'workflow.task.retry.always': '总是',
  'workflow.task.retry.onfailure': '失败时',
  'workflow.task.retry.onerror': '出错时',
  'workflow.task.retry.always.desc': '重试所有失败的步骤',
  'workflow.task.retry.onfailure.desc':
    '重试 Kubernetes 中主容器被标记为失败的步骤',
  'workflow.task.retry.onerror.desc':
    '重试遇到 Argo 控制器错误或 init 或 wait 容器失败的步骤',
  'workflow.button.stop': '停止',
  'workflow.table.run.config': '运行配置'
};
