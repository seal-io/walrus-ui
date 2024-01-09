export default {
  'menu.system.setting': 'System Settings',
  'menu.system.user': 'Users Management',
  'menu.system.config': 'Configuration Management',
  'system.rules.value': 'Value is required.',
  'system.rules.url': 'Server address is required.',
  'user.password.modify': 'Modify Password',
  'user.password.default.modify': 'Modify Default Password',
  'user.password.oldPassword': 'Old password',
  'user.password.newPassword': 'New password',
  'user.password.confirmPassword': 'Confirm new password',
  'user.password.rules.oldpassword': 'Please enter old password',
  'user.password.rules.newpassword': 'Please enter new password',
  'user.password.rules.confirmpassword': 'Please enter the new password again',
  'user.password.rules.comparepassword':
    'The two new password entries are inconsisten',
  'user.login.info': 'Login information verification failed, please retry',
  'user.login.validate': 'Verification Failed',
  'user.login.relogin': 'Re-Login',
  'system.setting.serverManage': 'Server',
  'system.setting.apiToken': 'API Tokens',
  'system.setting.serverurl': 'Server Address',
  'system.setting.interceptor': 'Analysis Management',
  'system.setting.mavenRepo': 'Repository URL',
  'system.setting.mavenRepo.desc':
    'Used to retrieve non-extranet-visible Maven repository artifacts during source code inspection',
  'system.setting.rules.mavenRepo': 'The address must be http or https.',
  'system.setting.pulldependce': 'whether to search online',
  'system.setting.pulldependce.desc':
    'Used to retrieve the transitive dependencies of the component, the latest version and license information of the component, etc',
  'system.setting.proxyManage': 'Proxy Management',
  'system.setting.wildDomain': 'Generic Domain',
  'system.setting.wildDomain.desc':
    'Used for proxy address composition and TLS certificate verification',
  'system.setting.tls': 'TLS mode',
  'system.setting.tls.desc':
    'Used to specify the TLS mode used for proxy access',
  'system.setting.customize': 'customize',
  'system.setting.customize.desc':
    'Use https mode in proxy addresses. The uploaded service certificate needs to support the above generic domain name as the DNS name. It is worth noting that if the service certificate is issued by a non-authoritative authority, the client (such as Maven, Docker) needs to complete the trust in advance.',
  'system.setting.terminate': 'Proxy terminate',
  'system.setting.terminate.desc':
    'Use https mode in proxy addresses. No service certificate is required, but a pre-proxy service is required for processing.',
  'system.setting.acme': 'Apply automatically',
  'system.setting.acme.desc':
    'Use https mode in proxy addresses. The service certificate is applied in the ACME DNS-01 mode, and the port 53 of the currently deployed machine needs to be opened to receive the UDP authentication request from the certificate provider',
  'system.setting.disabled': 'Disabled',
  'system.setting.disabled.desc': 'Use http mode in proxy addresses.',
  'system.setting.customize.lisence': 'customize certificate',
  'system.setting.customize.key': 'Customize private key',
  'system.setting.rules.genericdomain':
    'The generic domain name format is incorrect',
  'system.setting.offlineManage': 'Offline management',
  'system.setting.offlineManage.httpProxy':
    'The http protocol uses the proxy service address',
  'system.setting.offlineManage.httpProxy.desc':
    'HTTP outbound traffic for proxying non-TLS in offline environment',
  'system.setting.offlineManage.httpsProxy':
    'The https protocol uses the proxy service address',
  'system.setting.offlineManage.httpsProxy.desc':
    'HTTP outbound traffic for proxying TLS in offline environment',
  'system.setting.offlineManage.allProxy': 'Proxy service address',
  'system.setting.offlineManage.allProxy.desc':
    'Used to proxy all outbound traffic in an offline environment',
  'system.setting.offlineManage.noProxy':
    "Do not use a proxy's domain name or IP",
  'system.setting.offlineManage.noProxy.desc':
    'Used to not proxy outbound traffic for matching domain names and IPs in offline environment',
  'system.setting.rules.socks':
    'Only addresses for socks4 and socks5 protocols.',
  'system.setting.offlineManage.noProxy.extra':
    "List of IPs and domain names with ',' separated;supporting fuzzy matching;e.g.:192.168.0.*,*ip.net.",
  'system.setting.rules.noProxy': 'The input format is incorrect',
  'system.setting.TokenRefreshCronExpr': 'System token refresh cycle',
  'system.setting.TokenRefreshCronExpr.desc':
    'The system token is used for third-party service call authentication and is refreshed every 6 hours by default',
  'system.setting.ScanCheckCronExpr': 'Resource scan check cycle',
  'system.setting.ScanCheckCronExpr.desc':
    'Periodically check whether to perform a scan on the project, by default every 1 hour',
  'system.setting.MetaSyncCronExpr': 'Data synchronization period',

  'system.setting.cron.desc': 'The format is a cron expression',
  'system.setting.rules.cron': 'The expression is not in the correct format',
  'system.setting.cron.extra':
    'Cron expression: seconds  minute  hour  day(month)  month  day(week).',
  'system.setting.analyze.goproxy.desc':
    'The repository(GOPROXY) is used for resolving Go modules and fetching module information',
  'system.setting.analyze.goprivate.desc':
    'The GOPRIVATE environment variable controls which modules the go command considers to be private and should therefore not use the proxy or checksum database.',
  'system.setting.analyze.gonoproxy.desc':
    'List of glob patterns of module path prefixes that should always be fetched directly or that should not be compared against the checksum database.',
  'system.setting.analyze.repoconfig': 'Repository Configuration',
  'system.setting.rule.openai': 'Openai api token is required.',
  'system.setting.task': 'Task',
  'system.setting.task.basic': 'Basic',
  'system.setting.task.basicmng': 'Basic',
  'system.setting.task.finops': 'FinOps',
  'system.setting.task.enhance': 'Enhanced',
  'system.setting.deployment': 'Deployment',
  'system.setting.deployment.basic': 'Basic',
  'system.setting.deployment.proxy': 'Proxy',
  'system.setting.openAiApiToken': 'OpenAI API Token',
  'system.setting.TerraformDeployerImage': 'Deployer Image',
  'system.setting.DeployerNetworkMirrorUrl': 'Deployer Network Mirror URL',
  'system.setting.DeployerNetworkMirrorUrl.desc':
    'Configure networking mirroring for the Deployer.',
  'system.setting.DeployerNetworkMirrorUrl.extra':
    'Please input <span style="color: var(--color-text-1);margin: 0 4px;">https://walrus-mirror-hermitcrab.walrus-system/v1/providers/</span> if consumes the built-in Deployer network mirroring service.',
  'system.setting.ConnectorCheckCronExpr': 'Check Connector Status',
  'system.setting.ConnectorCheckCronExpr.desc':
    'The default is to execute every 5 minutes',
  'system.setting.ResourceStatusCheckCronExpr':
    'Check resource component status',
  'system.setting.ServiceDependencyCheckCronExpr':
    'Check resource dependency status',
  'system.setting.ServiceDependencyCheckCronExpr.desc':
    'The default is to execute every 30 seconds',
  'system.setting.ResourceStatusCheckCronExpr.desc':
    'The default is to execute every 1 minute',
  'system.setting.ResourceLabelApplyCronExpr': 'Marking resources',
  'system.setting.ResourceLabelApplyCronExpr.desc':
    'The default is to execute every 2 minutes',
  'system.setting.CostCollectCronExpr': 'Collect usage costs',
  'system.setting.CostCollectCronExpr.desc':
    'The default is to execute every hour',
  'system.setting.drift.title': 'Drift detection',
  'system.setting.drift.check': 'Whether drift detection',
  'system.setting.drift.cronExpr': 'Detection drift task settings',
  'system.setting.drift.check.desc':
    'Monitor whether the remote configuration of the service has changed',
  'system.setting.templateLib': 'Template Catalog',
  'system.setting.resourceDefinition': 'Resource Definition',
  'system.setting.enableBuiltinCatalog': 'Use built-in catalog',
  'system.setting.enableBuiltinDefinition': 'Use built-in resource definition',
  'system.setting.enableBuiltinCatalog.desc':
    'After disabled, the built-in catalog can be removed from the catalog, suitable for offline scenarios. If the built-in catalog is deleted and reopened, it will be re-added during the next Walrus restart',
  'system.setting.SkipRemoteTLSVerify': 'Skip certificate authentication',
  'system.setting.SkipRemoteTLSVerify.title': 'Certificate',
  'system.setting.SkipRemoteTLSVerify.desc':
    'After enabled, SSL certificate verification will no longer be performed when refreshing the catalogs, templates, and downloading templates.',
  'system.setting.enableSyncCatalog':
    'Whether to synchronize the template catalog data',
  'system.setting.enableSyncCatalog.desc':
    'If enable, the template catalog data will be synchronized at 1:00 every day',
  'system.user.visitor': 'General User',
  'system.user.admin': 'Administrator',
  'system.user.engineer': 'Manager',
  'account.settings.apikeys': 'API Keys',
  'account.settings.title': 'Account Settings',
  'account.settings.tokens.new': 'New Key',
  'account.settings.tokens.name': 'Name',
  'account.settings.tokens.expiration': 'Expiration',
  'account.settings.tokens.button': 'New Key',
  'account.settings.expire.week': '1 week',
  'account.settings.expire.month': '1 month',
  'account.settings.expire.six': 'six months',
  'account.settings.expire.year': '1 year',
  'account.settings.expire.never': 'never',
  'account.settings.expired': 'Expired',
  'account.settings.expireSoon': 'Expiring soon',
  'account.settings.token.rules.name': 'API key is required',
  'account.settings.token.rules.expire': 'Expiration time is required.',
  'account.settings.token.expireDate': 'Expire date',
  'account.settings.token.desc': 'API keys can be used to access Walrus API.',
  'account.settings.token.tips':
    'Make sure to copy your personal access key now. You won’t be able to see it again!',
  'account.settings.clear.tips': 'Save, the following settings will be cleared',
  'account.create.rules.username':
    'Can only contain alphanumeric, _, -, cannot have consecutive _, -, start or end with alphanumeric',
  'account.create.rules.password': 'Password is required.'
};
