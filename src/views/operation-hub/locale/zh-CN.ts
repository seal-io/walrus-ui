export default {
  'operation.connectors.menu': '连接器',
  'operation.connectors.create': '新建连接器',
  'operation.connectors.table.holder': '请输入连接器',
  'operation.connectors.category.holder': '请选择类型',
  'operation.connectors.table.name': '名称',
  'operation.connectors.table.type': '类型',
  'operation.connectors.table.connector': '连接器',
  'operation.connectors.table.status': '状态',
  'operation.connectors.finops.enable': '开启',
  'operation.connectors.finops.disable': '未开启',
  'operation.connectors.table.coststatus': '成本数据信息',
  'operation.connectors.table.enableFin': '启用成本分析',
  'operation.connectors.table.install': '重装成本分析工具',
  'operation.connectors.table.fetch': '同步成本数据',
  'operation.connectors.ready.tips': '集群成本分析工具为可用状态',
  'operation.connectors.error.tips': '集群成本分析工具不可用，尝试重装',
  'operation.connectors.title.edit': '编辑{type}连接器',
  'operation.connectors.title.view': '{type}连接器详情',
  'operation.connectors.title.new': '新建{type}连接器',
  'operation.connectors.detail.clusterName': '集群名称',
  'operation.connectors.detail.readfile': '从文件读取',
  'operation.connectors.detail.fileformat': '文件格式: yaml或文本文件',
  'operation.connectors.rules.name': '集群名称必填',
  'operation.connectors.rules.kubeconfig': 'kubeconfig为必填',
  'operation.connectors.rules.kubeconfigTips': '可从文件读取或者直接输入',
  'operation.connectors.rules.enable': '启用成本分析',
  'operation.connectors.reinstall.tips': '重装历史数据将被删除',
  'operation.connectors.reinstall.button': '确定重装',
  'operation.connectors.table.versioncontrol': '版本控制',
  'operation.connectors.reinstall.custom': '自定义',
  'operation.connectors.reinstall.cloudProvider': '云厂商',
  'operation.connectors.status.ready': '集群成本分析工具为可用状态',
  'operation.connectors.status.error': '集群成本分析工具不可用，尝试重装',
  'operation.connectors.form.finopsenable': '成本分析器',
  'operation.connectors.form.name': '名称',
  'operation.connectors.form.type': '类型',
  'operation.connectors.form.attribute': '属性',
  'operation.connectors.rule.name': '名称必填',
  'operation.connectors.type.rule': '类型必选',
  'operation.connectors.rule.type': '类型必填',
  'operation.connectors.accesstoken.rule': 'access token 必填',
  'operation.connectors.attribute.rule': '属性必填',
  'operation.connectors.attribute.visible': '可见',
  'operation.connectors.attribute.invisible': '不可见',
  'operation.connectors.attribute.sensitive': '是否敏感',
  'operation.connectors.attribute.sensitive.tips':
    '若为敏感则保存后不可见，编辑时需重新输入',
  'operation.environments.menu': '环境',
  'operation.environments.create': '新建环境',
  'operation.environments.edit': '编辑环境',
  'operation.environments.view': '环境详情',
  'operation.environments.table.holder': '请输入环境',
  'operation.environments.table.list': '环境列表',
  'operation.environments.table.name': '名称',
  'operation.environments.table.env': '环境',
  'operation.environments.rule.name': '名称必填',
  'operation.environments.table.description': '描述',
  'operation.environments.detail.addConnector': '添加连接器',
  'operation.environments.detail.holder': '请选择连接器',
  'operation.environments.name.tips':
    '由字母、数字或"-"、"_"组成，以字母或数字开头和结尾',
  'operation.templates.menu': '模板',
  'operation.secret.menu': '全局密钥',
  'operation.secret.name': '密钥',
  'operation.secret.name.tips': '由字母、数字、"_"组成，不能以数字开头',
  'operation.secret.content': '内容',
  'operation.secret.tips': `密钥的作用为在创建应用时，配置模板中的相关参数时使用。全局密钥可使用于所有项目的应用。使用方法：在输入框中输入{'$'}<span></span>{'{'}secret.密钥名称{'}'}。`,
  'operation.secret.rule.content': '内容必填',
  'operation.secret.rule.name': '名称必填',
  'operation.templates.table.title': '模板列表',
  'operation.templates.table.name': '模板',
  'operation.templates.table.holder': '请输入模板',
  'operation.templates.type.holder': '请选择模板类型',
  'operation.templates.detail.edit': '编辑模板',
  'operation.templates.detail.add': '新建模板',
  'operation.templates.detail.view': '模板详情',
  'operation.templates.button.gpt': 'AI编写模板',
  'operation.templates.detail.source': '来源',
  'operation.templates.detail.version': '版本',
  'operation.templates.detail.icon': '图标',
  'operation.templates.detail.reademe': '说明',
  'operation.templates.detail.inputs': '输入',
  'operation.templates.detail.example': '请选择示例',
  'operation.templates.detail.gptcreate': '生成',
  'operation.templates.detail.explain': '解释',
  'operation.templates.detail.explainInfo': '解释信息',
  'operation.templates.detail.correction': '纠错',
  'operation.templates.detail.correctionview': '查看纠错说明',
  'operation.templates.detail.nocorrection': '无纠错信息',
  'operation.templates.detail.receiveFix': '接受修复',
  'operation.templates.detail.cancelFix': '放弃修复',
  'operation.templates.detail.outputs': '输出',
  'operation.templates.detail.type.tips':
    '复合类型及嵌套类型，数组中第一个为主类型，第二个为子类型',
  'operation.templates.table.type': '类型',
  'operation.templates.rules.name': '名称必填',
  'operation.templates.rules.sourece': '来源必填',
  'operation.templates.gpt.create': '创建PR',
  'operation.templates.create.title': '创建PR',
  'operation.templates.edit.title': '编辑PR',
  'operation.templates.pr.done': 'PR创建成功',
  'operation.templates.pr.handle': '前往处理PR',
  'operation.templates.detail.receiveFix.tips': '确定接受修复？',
  'operation.templates.detail.cancelFix.tips': '确定放弃修复？',
  'operation.templates.detail.form.connector': '连接器',
  'operation.templates.detail.form.repo': '代码仓库',
  'operation.templates.detail.form.branch': '分支',
  'operation.templates.detail.form.locationfile': '提交路径',
  'operation.templates.detail.rule.connector': '连接器必选',
  'operation.templates.detail.rule.repo': '代码仓库必选',
  'operation.templates.detail.rule.branch': '分支必选',
  'operation.templates.detail.rule.locationfile': '提交路径必填'
};
