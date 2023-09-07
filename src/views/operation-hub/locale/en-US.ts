export default {
  'operation.connectors.menu': 'Connectors',
  'operation.connectors.create': 'New Connector',
  'operation.connectors.table.holder': 'please enter a connector',
  'operation.connectors.category.holder': 'please choose a category',
  'operation.connectors.table.name': 'Name',
  'operation.connectors.table.type': 'Type',
  'operation.connectors.table.connector': 'Connector',
  'operation.connectors.table.status': 'Status',
  'operation.connectors.table.region': 'Region',
  'operation.connectors.finops.enable': 'Enable',
  'operation.connectors.finops.disable': 'Disable',
  'operation.connectors.table.coststatus': 'Cost Data Information',
  'operation.connectors.table.enableFin': 'Enable Cost Analysis',
  'operation.connectors.table.install': 'Reinstalling Cost Analysis Tool',
  'operation.connectors.table.fetch': 'Synchronize cost data',
  'operation.connectors.ready.tips':
    'The cluster cost analysis tool is available',
  'operation.connectors.error.tips':
    'The cluster cost analysis tool is unavailable, try reinstalling',
  'operation.connectors.detail.readfile': 'Read from a file',
  'operation.connectors.title.edit': 'Edit {type} Connector',
  'operation.connectors.title.view': '{type} Connector Details',
  'operation.connectors.title.new': 'New {type} Connector',
  'operation.connectors.detail.fileformat': 'File format: yaml or text file',
  'operation.connectors.detail.clusterName': 'Cluster Name',
  'operation.connectors.rules.name': 'cluster name is required',
  'operation.connectors.rules.kubeconfig': 'kubeconfig is required',
  'operation.connectors.rules.kubeconfigTips':
    'can be read from a file or entered directly',
  'operation.connectors.rules.enable': 'Enable cost analysis',
  'operation.connectors.reinstall.tips': 'Reload history data will be deleted',
  'operation.connectors.reinstall.button': 'Sure to reinstall',
  'operation.connectors.table.versioncontrol': 'Version Control',
  'operation.connectors.reinstall.custom': 'Custom',
  'operation.connectors.reinstall.cloudProvider': 'Cloud Provider',
  'operation.connectors.status.ready':
    'the cluster cost analysis tool is available',
  'operation.connectors.status.error':
    'the cluster cost analysis tool is unavailable, try reinstalling',
  'operation.connectors.form.finopsenable': 'Enable Cost Analysis',
  'operation.connectors.form.name': 'Name',
  'operation.connectors.form.type': 'Type',
  'operation.connectors.form.region.tips':
    'Custom: Enter your region code and press Enter to confirm',
  'operation.connectors.form.attribute': 'Attributes',
  'operation.connectors.rule.name': 'name is required',
  'operation.connectors.type.rule': 'type is required',
  'operation.connectors.rule.type': 'type is required',
  'operation.connectors.accesstoken.rule': 'access token is required',
  'operation.connectors.attribute.rule': 'attributes is required',
  'operation.connectors.attribute.visible': 'visible',
  'operation.connectors.attribute.invisible': 'invisible',
  'operation.connectors.attribute.sensitive': 'Sensitive',
  'operation.connectors.attribute.sensitive.tips':
    'If it is sensitive, it will not be visible after saving, and it needs to be re-entered when editing',
  'operation.environments.menu': 'Environments',
  'operation.environments.create': 'New Environment',
  'operation.environments.edit': 'Edit Environment',
  'operation.environments.view': 'Environment Details',
  'operation.environments.table.holder': 'please enter an environment',
  'operation.environments.table.name': 'Name',
  'operation.environments.table.env': 'Environment',
  'operation.environments.rule.name': 'name is required',
  'operation.environments.table.description': 'Description',
  'operation.environments.detail.addConnector': 'Add Connector',
  'operation.environments.detail.holder': 'please select connector',
  'operation.environments.name.tips':
    'consists of letters, numbers or "-"、"_", starts and ends with a letter or number',
  'operation.templates.menu': 'Templates',
  'operation.secret.menu': 'Global Secrets',
  'operation.secret.name': 'Secret',
  'operation.secret.tips': `The function of the secret is to use it when configuring the relevant parameters in the template when creating the application. A global secret can be used for all project applications. Useage: Enter {'$'}<span></span>{'{'}secret.secretName{'}'} in the input box.`,
  'operation.secret.name.tips':
    'consists of letters, numbers, "_", cannot start with a number',
  'operation.secret.content': 'Content',
  'operation.secret.rule.content': 'content is required',
  'operation.secret.rule.name': 'name is required',
  'operation.templates.table.title': 'Template List',
  'operation.templates.table.name': 'Template',
  'operation.templates.table.catalog': 'Catalog',
  'operation.templates.table.holder': 'please enter a template',
  'operation.templates.catalogId.holder': 'please select a catalog',
  'operation.templates.table.catalogId': 'ID',
  'operation.templates.type.holder': 'please select a template type',
  'operation.templates.detail.edit': 'Edit Template',
  'operation.templates.detail.add': 'New Template',
  'operation.templates.detail.view': 'Template Details',
  'operation.templates.button.gpt': 'AI Draft Template',
  'operation.templates.detail.source': 'Source',
  'operation.templates.detail.version': 'Version',
  'operation.templates.detail.icon': 'Icon',
  'operation.templates.detail.reademe': 'Readme',
  'operation.templates.detail.inputs': 'Inputs',
  'operation.templates.detail.outputs': 'Outputs',
  'operation.templates.detail.example': 'please select an example',
  'operation.templates.detail.gptcreate': 'Generate',
  'operation.templates.detail.explain': 'Explain',
  'operation.templates.detail.explainInfo': 'Explain Information',
  'operation.templates.detail.correction': 'Correction',
  'operation.templates.detail.correctionview': 'View correction information',
  'operation.templates.detail.nocorrection': 'No correction information',
  'operation.templates.detail.receiveFix': 'Accept Fix',
  'operation.templates.detail.cancelFix': 'Drop Fix',
  'operation.templates.detail.type.tips':
    'Composite type and nested type, the first in the array is the main type, and the second is the subtype',
  'operation.templates.table.type': 'Type',
  'operation.templates.rules.name': 'name is required',
  'operation.templates.rules.source': 'source is required',
  'operation.templates.gpt.create': 'Create a PR',
  'operation.templates.create.title': 'Create PR',
  'operation.templates.pr.done': 'PR created successfully',
  'operation.templates.pr.handle': 'Go to handle PR',
  'operation.templates.detail.receiveFix.tips':
    'Are you sure you want to accept the fix?',
  'operation.templates.detail.cancelFix.tips':
    'Are you sure you want to drop the fix?',
  'operation.templates.detail.form.connector': 'Connector',
  'operation.templates.detail.form.repo': 'Repository',
  'operation.templates.detail.form.branch': 'Branch',
  'operation.templates.detail.form.locationfile': 'Submission Path',
  'operation.templates.detail.rule.connector': 'connector is required',
  'operation.templates.detail.rule.repo': 'repository is required',
  'operation.templates.detail.rule.branch': 'branch is required',
  'operation.templates.detail.rule.locationfile': 'submission path is required'
};
