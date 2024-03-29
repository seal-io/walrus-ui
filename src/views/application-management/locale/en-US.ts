export default {
  'applications.applications.menu': 'Applications',
  'applications.applications.create': 'New Service',
  'applications.applications.create.resource': 'New Resource',
  'applications.applications.create.serviceResource': 'New',
  'applications.applications.add.member': 'Add Members',
  'applications.applications.edit': 'Edit Service',
  'applications.applications.clone': 'Clone Resource',
  'applications.applications.edit.resource': 'Edit Resource',
  'applications.applications.detail.resource': 'Resource Details',
  'applications.applications.detail': 'Service Details',
  'applications.applications.secret': 'Variable',
  'applications.applications.secret.value': 'Value',
  'applications.applications.secret.holder': 'please enter a variable',
  'applications.applications.secret.scope': 'Scope',
  'applications.applications.configuration.create': 'Add Template',
  'applications.applications.table.name': 'Application',
  'applications.applications.table.module': 'Template',
  'applications.applications.service.title': 'service',
  'applications.applications.resource.title': 'resource',
  'applications.applications.table.service': 'Service',
  'applications.applications.table.resource': 'Resource',
  'applications.applications.table.latestRun': 'Latest Run',
  'applications.applications.table.latestStatus': 'Latest Run Status',
  'applications.applications.table.overview': 'Overview',
  'applications.applications.table.resourceType': 'Resource Type',
  'applications.applications.table.status': 'Status',
  'applications.applications.table.type': 'Type',
  'applications.applications.table.content': 'Content',
  'applications.applications.table.target': 'Target',
  'applications.applications.table.holder': 'please enter a name',
  'applications.applications.project.holder': 'please select a project',
  'applications.applications.form.name': 'Name',
  'applications.applications.form.label': 'Labels',
  'applications.applications.form.key': 'Key',
  'applications.applications.form.value': 'Value',
  'applications.applications.form.useTemplate': 'Use Template',
  'applications.applications.detail.configuration': 'Configuration',
  'applications.applications.form.description': 'Description',
  'applications.applications.rule.name': 'Name is required.',
  'applications.module.rule.name': 'Name is required.',
  'applications.applications.rule.allName':
    'Consists of lowercase letters, numbers or "-", starts with a letter and ends with a letter or number',
  'applications.module.name.tips':
    'consists of letters, numbers, underscores, cannot start with a number',
  'applications.module.rule.name.tips':
    'consisting of letters, numbers, and underscores, and cannot start with a number',
  'applications.module.title.edit': 'Edit Template',
  'applications.module.title.view': 'Template Details',
  'applications.module.title.new': 'Add Template',
  'applications.applications.table.template': 'Generate a template',
  'applications.applications.table.currentval': 'Current Value',
  'applications.applications.table.recommendation': 'Recommendation',
  'applications.applications.container.holder': 'please select a container',
  'applications.applications.detail.env': 'Environment',
  'applications.applications.detail.basic': 'Basic Information',
  'applications.applications.title.edit': 'Edit Application',
  'applications.applications.title.view': 'Application Details',
  'applications.applications.title.clone': 'Clone Application',
  'applications.applications.detail.info': 'Application Information',
  'applications.applications.instance.deleteTips':
    'Do not clean up underlying components',
  'applications.applications.instance.application': 'Application',
  'applications.applications.instance.status': 'Status',
  'applications.applications.instance.history': 'Runs',
  'applications.applications.instance.accessUrl': 'Endpoints',
  'applications.applications.instance.resource': 'Component Information',
  'applications.applications.instance.resource.tips':
    'When the connector of the environment is customized, the resources and outputs of the service are static data, which will be updated when the service is upgraded',
  'applications.applications.instance.endpoint': 'URL',
  'applications.applications.instance.log': 'Logs',
  'applications.applications.instance.value': 'Value',
  'applications.applications.instance.cloneName':
    'please enter a new service name',
  'applications.applications.instance.clonetitle': 'Clone Service ({from})',
  'applications.applications.logs.live': 'Running Logs',
  'applications.instance.rule.env': 'The deployment environment is required.',
  'applications.instance.env.tips':
    'environments without connectors are not available',
  'applications.instance.tab.resource': 'Components',
  'applications.instance.tab.resource.holder': 'please enter a component name',
  'applications.instance.tab.resourceName': 'Resource Name',
  'applications.instance.tab.log': 'Logs',
  'applications.instance.tab.term': 'Terminal',
  'applications.instance.tab.graph': 'Dependency Graph',
  'applications.instance.tab.output': 'Outputs',
  'applications.applications.history.version': 'Version',
  'applications.applications.history.operator': 'Operator',
  'applications.applications.history.clone': 'Clone',
  'applications.applications.history.rollbackapp': 'Revision Rollback',
  'applications.applications.history.rollbackinstance': 'Service Rollback',
  'applications.applications.history.deploymentTime': 'Deployment Time',
  'applications.applications.history.execTime': 'Execution Time',
  'applications.applications.history.changes': 'Changes',
  'applications.applications.history.rollback': 'Rollback',
  'applications.applications.history.detail': 'Run Details',
  'applications.applications.history.latest': 'Latest Run Details',
  'applications.applications.history.changeList': 'Change History',
  'applications.applications.history.running': 'Deployment Logs',
  'applications.applications.history.diff.title':
    'Comparison between the current version and the target version configuration',
  'applications.applications.history.diff.upgrade':
    'Comparison between the current version and the latest version configuration',
  'applications.applications.history.change.title':
    'Comparison with previous version configuration',
  'applications.applications.history.diff.remove':
    'marker as the latest version configuration',
  'applications.applications.history.diff.same': 'no change in configuration',
  'applications.applications.history.diff.add':
    'marker as current version configuration',
  'applications.applications.logs.holder': 'please select an object',
  'applications.applications.modules.title': 'Templates',
  'applications.applications.labels.title': 'Add labels',
  'applications.applications.tags.title': 'Tags',
  'applications.applications.tags.button': 'Add tags',
  'applications.applications.rules.modules': 'Template is required.',
  'applications.applications.rules.versions': 'Version is required.',
  'applications.applications.rules.reourceType': 'Resource type is required.',
  'applications.applications.modules.tips': 'Required for new applications',
  'applications.applications.modules.params.title':
    'To use variables, output properties in related services, the method is as follows:',
  'applications.applications.modules.params.tips1': `1. Use the secret: you can enter {'$'}{'{'}secret.secretName{'}'} in the input box`,
  'applications.applications.modules.params.tips2': `1. Use global or project variables: you can enter {'$'}{'{'}var.variableName{'}'} in the input box`,
  'applications.applications.modules.params.tips3': `2. Use the attributes in the service: you can enter {'$'}{'{'}service.serviceName.attributeName{'}'} in the input box`,
  'applications.applications.modules.params.tips4': `2. Use the attributes in the resource: you can enter {'$'}{'{'}resource.resourceName.attributeName{'}'} in the input box`,
  'applications.applications.modules.params.flowvar': `Use the variables defined in current workflow: you can enter {'$'}{'{'}workflow.var.variableName{'}'} in the input box`,
  'applications.applications.rule.modules.name': 'Duplicate resource found.',
  'applications.applications.variables.title': 'Variables',
  'applications.applications.variables.button': 'New Variable',
  'applications.applications.variables.label': 'Variable Name',
  'applications.applications.modules.button': 'New Template',
  'applications.applications.button.upgrade': 'Upgrade',
  'applications.workflows.menu': 'Workflows',
  'applications.workflows.create': 'New Workflow',
  'applications.projects.menu': 'Projects',
  'applications.projects.table.project': 'Project',
  'applications.projects.authorize.title': 'Role Authorization',
  'applications.projects.authorize.account': 'please select an user',
  'applications.projects.authorize.role': 'please assign a role',
  'applications.projects.create': 'New Project',
  'applications.projects.edit': 'Edit Project',
  'applications.projects.table.name': 'Project',
  'applications.projects.search.holder': 'please enter a project',
  'applications.projects.form.label': 'Labels',
  'applications.projects.rule.name': 'Name is required.',
  'applications.projects.role.owner': 'Owner',
  'applications.projects.role.member': 'Member',
  'applications.projects.role.select': 'please select members',
  'applications.projects.role.holder': 'please enter a member',
  'applications.projects.role.viewer': 'Viewer',
  'applications.secret.create': 'New Variable',
  'applications.member.table.name': 'Member',
  'applications.secret.rules.value': 'Variable value is required.',
  'applications.secret.name.tips':
    'consists of letters, numbers, underscores, cannot start with a number',
  'applications.secret.edit': 'Edit Variable',
  'applications.secret.value': 'Variable',
  'applications.secret.form.name': 'Content',
  'applications.secret.form.tips': `The function of the secret is to use it when configuring the relevant parameters in the template when creating the application. Project secret are used only in apps for the specified project. Useage: Enter {'$'}<span></span>{'{'}secret.secretName{'}'} in the input box`,
  'applications.endpoint.access': 'Access Points',
  'applications.service.rollback.version.label': 'Select Version',
  'applications.service.rollback.version.holder': 'please select a version',
  'applications.service.rollback.config.compare': 'Configuration Comparison',
  'applications.service.clone': 'Clone',
  'applications.service.batchDeploy': 'Deploy',
  'applications.service.importyaml': 'Import YAML',
  'applications.service.graph.menu': 'Resource Executable',
  'applications.service.resource.drift': 'Resource Drift',
  'applications.service.resource.hasDrift': 'Existence drift',
  'applications.service.resource.driftInfo': 'Drift Info',
  'applications.service.resource.isDrifted': 'Drifted',
  'applications.service.resource.sync': 'Configuration Synchronization',
  'applications.environment.clone': 'Clone Environment',
  'applications.environment.table.status': 'Resources Status',
  'applications.environment.clone.variable': 'Select variables',
  'applications.environment.clone.target': 'Target Environments',
  'applications.environment.clone.env.rules':
    'Target Environments is required.',
  'applications.environment.graph.fitview': 'Fit View',
  'applications.environment.type': 'Environment Type',
  'applications.environment.rule.type': 'Environment Type is required.',
  'applications.environment.graph.cancelfullscreen': 'Exit Full Screen',
  'applications.environment.graph.fullscreen': 'Full Screen',
  'applications.environment.graph.show': 'Show Components',
  'applications.environment.graph.hide': 'Hide Components',
  'applications.environment.connector.tips':
    'Please select an environment type',
  'applications.variable.scope.project': 'Project',
  'applications.variable.scope.envrionment': 'Environment',
  'applications.variable.scope.global': 'Global',
  'applications.resource.log.lastlines': 'Last Lines',
  'applications.resource.log.showtime': 'Show Timestamp',
  'applications.resource.log.lastlog': 'Last Run Log',
  'applications.resource.log.breakLine': 'Word Wrap',
  'applications.service.stop.tips': 'Stop the {type}!',
  'applications.service.stop.env': 'Stop the environment!',
  'applications.service.stop.confirm':
    'The underlying component will be removed, are you sure you want to stop?',
  'applications.service.revision.runtime': 'Computed Configuration',
  'applications.service.revision.custom': 'User-supplied Configuration',
  'project.result.title': 'No project created yet',
  'project.result.subTitle':
    'The project name is unique in walrus, you can create here',
  'project.result.nodata.title': 'No project found',
  'project.resource.result.title': 'No resource created yet',
  'project.resource.result.subTitle': 'You can create here or import from YAML',
  'resource.runs.result.title': 'No run has been performed yet',
  'resource.runs.result.subTitle':
    'After running the operation, you can view the latest running status',
  'resource.components.result.title': 'No components generated yet',
  'resource.components.result.subTitle':
    'Components are the entities generated by the resource deployment',
  'resource.endpoints.result.title': 'No access address generated yet',
  'resource.endpoints.result.subTitle':
    'Configure ports in the template, and the access address will be automatically generated after deployment.',
  'resource.outputs.result.title': 'No outputs generated yet',
  'resource.outputs.result.subTitle': '',
  'resource.revisions.result.title': 'No run created yet',
  'resource.revisions.result.subTitle':
    'Each deployment will generate a run, and the latest run cannot be deleted.',
  'resource.revisons.detail.components': 'Components Changes',
  'resource.revisons.detail.attributes': 'Configuration',
  'resource.revisons.filter.types': 'All Types',
  'resource.revisons.filter.status': 'All Statuses',
  'resource.revisons.table.duration': 'Duration',
  'resource.revisons.components.changes': 'The task is running with no changes',
  'resource.revisons.components.nochanges': 'No any changes',
  'resource.revisons.components.beforeChange': 'Before Change',
  'resource.revisons.components.afterChange': 'After Change',
  'resource.revisons.components.change.create': 'Add',
  'resource.revisons.components.change.delete': 'Delete',
  'resource.revisons.components.change.update': 'Update',
  'resource.revisons.components.change.nochange': 'No Change',
  'resource.revisons.components.planning': 'The task is running...'
};
