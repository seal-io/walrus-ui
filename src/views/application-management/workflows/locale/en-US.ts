export default {
  'applications.workflow.create': 'New Workflow',
  'applications.workflow.edit': 'Edit Workflow',
  'applications.workflow.view': 'View Workflow',
  'applications.workflow.name': 'Workflow',
  'applications.workflow.filter.holder': 'please enter workflow',
  'applications.workflow.table.status': 'Recently Running Status',
  'applications.workflow.table.stage': 'Recently Running Stage',
  'applications.workflow.table.trigger': 'Trigger Information',
  'applications.workflow.table.currentStatus': 'Running Status',
  'applications.workflow.table.startTime': 'Started Running Time',
  'applications.workflow.table.runDetails': 'Running Details',
  'applications.workflow.table.duration': 'Duration',
  'applications.workflow.table.runmsg': 'Running Successfully!',
  'applications.workflow.table.update': 'Recently Started Running Time',
  'workflow.form.rules.displayName': 'Workflow name required',
  'workflow.form.rules.name': 'Workflow ID required',
  'workflow.form.displayName': 'Workflow Name',
  'workflow.form.name': 'Workflow ID',
  'workflow.form.timeout': 'Timeout',
  'workflow.step.modal.title': '{action} Workflow Task',
  'workflow.step.form.env': 'Deployment Environment',
  'workflow.stage.add.task': 'Add Task',
  'workflow.stage.add.taskName': 'Task Name',
  'workflow.stage.add.approvalMode': 'Approval Mode',
  'workflow.stage.add.approvalUser': 'Approvers',
  'workflow.stage.add.paratask': 'Parallel Task',
  'workflow.stage.add.parallelism': 'Limit tasks running in parallel',
  'workflow.stage.add.title': 'New Stage',
  'workflow.stage.add.button': 'Add New Stage',
  'workflow.stage.records': 'Records',
  'workflow.stage.recently.result': 'Recently Running Result',
  'workflow.stage.approve': 'Approval',
  'workflow.task.rules.taskName': 'task name required',
  'workflow.task.rules.approvalMode': 'please select approval mode',
  'workflow.task.rules.approvalUser': 'please select approval users',
  'workflow.task.form.manualapproval': 'Manual Approval',
  'workflow.task.form.deployservice': 'Create Task',
  'workflow.task.form.selectTask': 'Select Task Type',
  'workflow.task.form.fillin': 'Fill in the Form',
  'workflow.task.form.selectenv': 'Select Environment',
  'workflow.task.form.deployEnv': 'Deployment Environment',
  'workflow.task.run.order': 'The {order} Running',
  'workflow.task.run.user': 'Executor',
  'workflow.task.approval.or': 'Concurrent Approval',
  'workflow.task.approval.and': 'Collective Approval',
  'workflow.task.approval.or.desc':
    'Approval is granted or denied if any one of the approvers agrees or rejects.',
  'workflow.task.approval.and.desc': 'All approvers must agree.',
  'workflow.task.timeout.thirty': '30 minutes',
  'workflow.task.timeout.hour': '1 hour',
  'workflow.task.timeout.2hour': '2 hours',
  'workflow.task.retry.policy': 'Retry Policy',
  'workflow.task.retry.count': 'Retry Times',
  'workflow.task.retry.always': 'Always',
  'workflow.task.retry.onfailure': 'OnFailure',
  'workflow.task.retry.onerror': 'OnError',
  'workflow.task.retry.always.desc': 'Retry all failed steps',
  'workflow.task.retry.onfailure.desc':
    'Retry steps whose main container is marked as failed in Kubernetes',
  'workflow.task.retry.onerror.desc':
    'Retry steps that encounter Argo controller errors, or whose init or wait containers fail'
};
