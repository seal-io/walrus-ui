export default {
  'menu.system.setting': '系统设置',
  'system.rules.value': '值不能为空',
  'system.rules.url': 'URL格式不正确',
  'user.password.modify': '修改密码',
  'user.password.default.modify': '修改默认密码',
  'user.password.oldPassword': '原密码',
  'user.password.newPassword': '新密码',
  'user.password.confirmPassword': '确认新密码',
  'user.password.rules.oldpassword': '请输入原密码',
  'user.password.rules.newpassword': '请输入新密码',
  'user.password.rules.confirmpassword': '请再次输入新密码',
  'user.password.rules.comparepassword': '两次新密码输入不一致',
  'user.login.info': '登录信息验证失败，请重新登录',
  'user.login.validate': '验证失败',
  'user.login.relogin': '重新登录',
  'system.setting.serverManage': '服务管理',
  'system.setting.serverurl': '服务器地址',
  'system.setting.interceptor': '分析管理',
  'system.setting.pulldependce': '是否联网检索',
  'system.setting.pulldependce.desc':
    '用于检索构件的传递依赖、构件的最新版本及许可证信息等',
  'system.setting.proxyManage': '代理管理',
  'system.setting.mavenRepo': '仓库地址',
  'system.setting.mavenRepo.desc':
    '用于在源码检查过程中检索非外网可见的 Maven 仓库构件',
  'system.setting.rules.mavenRepo': '仅接受http 和 https的URL',
  'system.setting.wildDomain': '泛域名',
  'system.setting.wildDomain.desc': '用于代理地址组成及TLS证书验证',
  'system.setting.tls': 'TLS模式',
  'system.setting.tls.desc': '用于指定代理访问使用的TLS模式',
  'system.setting.customize': '自定义',
  'system.setting.customize.desc':
    '在代理地址中使用 https 模式。上传的服务证书需要支持上方的泛域名作为DNS名称。值得注意的是，如果服务证书是由非权威机构签发，需要客户端（例如 Maven，Docker）提前完成信任。',
  'system.setting.terminate': '代理终止',
  'system.setting.terminate.desc':
    '在代理地址中使用 https 模式。无需服务证书，但需要前置的代理服务进行处理。',
  'system.setting.acme': '自动申请',
  'system.setting.acme.desc':
    '在代理地址中使用 https 模式。服务证书使用ACME DNS-01模式申请，需要开放当前部署机器的53端口接收来自证书提供商的UDP认证请求',
  'system.setting.disabled': '禁用',
  'system.setting.disabled.desc': '在代理地址中使用 http 模式。',
  'system.setting.customize.lisence': '自定义证书',
  'system.setting.customize.key': '自定义私钥',
  'system.setting.rules.genericdomain': '泛域名格式不正确',
  'system.setting.offlineManage': '离线管理',
  'system.setting.offlineManage.httpProxy': 'http协议使用代理服务地址',
  'system.setting.offlineManage.httpProxy.desc':
    '用于在离线环境下代理非 TLS 的 HTTP 出站流量',
  'system.setting.offlineManage.httpsProxy': 'https协议使用代理服务地址',
  'system.setting.offlineManage.httpsProxy.desc':
    '用于在离线环境下代理 TLS 的 HTTP 出站流量',
  'system.setting.offlineManage.allProxy': '代理服务地址',
  'system.setting.offlineManage.allProxy.desc':
    '用于在离线环境下代理所有的出站流量',
  'system.setting.offlineManage.noProxy': '不使用代理的域名或IP',
  'system.setting.offlineManage.noProxy.desc':
    '用于在离线环境下不代理匹配的域名和IP的出站流量',
  'system.setting.offlineManage.noProxy.extra':
    '逗号分割的IP列表、域名列表，支持模糊匹配；例：192.168.0.*,*ip.net',
  'system.setting.rules.noProxy': '输入格式不正确',
  'system.setting.rules.socks': '仅接受socks4和socks5协议的地址',
  'system.setting.TokenRefreshCronExpr': '系统令牌刷新周期',
  'system.setting.TokenRefreshCronExpr.desc':
    '系统令牌用于第三方服务调用认证，默认每隔6小时刷新一次',
  'system.setting.ScanCheckCronExpr': '资源扫描检查周期',
  'system.setting.ScanCheckCronExpr.desc':
    '定期检查是否对项目执行扫描，默认每隔1小时检查一次',
  'system.setting.MetaSyncCronExpr': '数据同步周期',
  'system.setting.MetaSyncCronExpr.desc':
    '定期同步数据，包括但不限于许可证和漏洞，默认每隔24小时同步一次',
  'system.setting.cron.desc': '输入的格式为 cron 表达式',
  'system.setting.rules.cron': '表达式输入有误',
  'system.setting.cron.extra': 'cron 表达式：秒 分 小时 日 月 星期',
  'system.setting.analyze.ApplyVulnerabilityPrioritization':
    '是否应用漏洞优先级(试验性)',
  'system.setting.analyze.VulnPrioritization.desc':
    '关闭时，对于检索的漏洞结果，将基于漏洞的 CVSS 基础分进行排序；变更当前设置，可能影响新检索的漏洞结果及历史忽略问题',
  'system.setting.analyze.fixAdvice': '每次修复单个包最多分析的版本数量',
  'system.setting.analyze.fixAdvice.desc':
    '增加分析版本数量将会增加生成修复建议的时间',
  'system.setting.analyze.goproxy.desc':
    '用于设置 Go 环境变量 GOPROXY，解析 Go 模块和获取模块信息',
  'system.setting.analyze.goprivate.desc':
    '用于设置 Go 环境变量 GOPRIVATE，配置私有模块，将跳过使用代理或校验和数据库',
  'system.setting.analyze.gonoproxy.desc':
    '用于设置 Go 环境变量 GONOPROXY，配置需要跳过使用代理或校验和数据库的模块',
  'system.setting.analyze.repoconfig': '仓库配置',
  'system.setting.analyze.enableFixAdvice': '是否开启修复建议',
  'system.setting.rule.openai': 'openai api token 必填',
  'system.setting.task': '任务设置',
  'system.setting.task.basic': '基础任务',
  'system.setting.task.basicmng': '基础管理',
  'system.setting.task.finops': 'FinOps任务',
  'system.setting.task.enhance': '增强管理',
  'system.setting.openAiApiToken': 'OpenAI API令牌',
  'system.setting.TerraformDeployerImage': 'Terraform部署镜像',
  'system.setting.ConnectorCheckCronExpr': '检查连接器状态',
  'system.setting.ConnectorCheckCronExpr.desc': '默认是每10分钟执行一次',
  'system.setting.ResourceStatusCheckCronExpr': '检查应用资源状态',
  'system.setting.ResourceStatusCheckCronExpr.desc': '默认是每1分钟执行一次',
  'system.setting.ResourceLabelApplyCronExpr': '标记应用资源',
  'system.setting.ResourceLabelApplyCronExpr.desc': '默认是每2分钟执行一次',
  'system.setting.CostCollectCronExpr': '收集使用成本',
  'system.setting.CostCollectCronExpr.desc': '默认是每小时执行一次'
};
