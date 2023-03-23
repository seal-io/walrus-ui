import {
  wildDomainReg,
  ipReg,
  domainReg,
  validateCron
} from '@/utils/validate';
import i18n from '@/locale/index';
import { split } from 'lodash';
import { ChildrenItem, ValueType, SettingsItem } from './index';

export const settingList: Array<SettingsItem> = [
  {
    id: 'ServerManage',
    label: 'system.setting.serverManage',
    parentId: '',
    editable: true,
    component: {
      type: 'input',
      required: true,
      match: 'urlReg',
      message: 'system.rules.url'
    },
    value: '',
    type: 'layout',
    dataList: [
      {
        id: 'ServeUrl',
        label: 'system.setting.serverurl',
        parentId: '',
        component: {
          type: 'input',
          required: true,
          match: 'urlReg',
          message: 'system.rules.url'
        },
        value: '',
        type: 'string'
      }
      // {
      //   id: 'TokenRefreshCronExpr',
      //   label: 'system.setting.TokenRefreshCronExpr',
      //   desc: 'system.setting.TokenRefreshCronExpr.desc',
      //   parentId: '',
      //   component: {
      //     type: 'input',
      //     required: true,
      //     validator(val, callback) {
      //       if (validateCron(val)) {
      //         callback();
      //       } else {
      //         callback(i18n.global.t('system.setting.rules.cron'));
      //       }
      //     },
      //     extra: 'system.setting.cron.extra',
      //   },
      //   value: '',
      //   type: 'string',
      // },
      // {
      //   id: 'ScanCheckCronExpr',
      //   label: 'system.setting.ScanCheckCronExpr',
      //   desc: 'system.setting.ScanCheckCronExpr.desc',
      //   parentId: '',
      //   component: {
      //     type: 'input',
      //     required: true,
      //     validator(val, callback) {
      //       if (validateCron(val)) {
      //         callback();
      //       } else {
      //         callback(i18n.global.t('system.setting.rules.cron'));
      //       }
      //     },
      //     extra: 'system.setting.cron.extra'
      //   },
      //   value: '',
      //   type: 'string'
      // },
      // {
      //   id: 'MetaSyncCronExpr',
      //   label: 'system.setting.MetaSyncCronExpr',
      //   desc: 'system.setting.MetaSyncCronExpr.desc',
      //   parentId: '',
      //   component: {
      //     type: 'input',
      //     required: true,
      //     validator(val, callback) {
      //       if (validateCron(val)) {
      //         callback();
      //       } else {
      //         callback(i18n.global.t('system.setting.rules.cron'));
      //       }
      //     },
      //     extra: 'system.setting.cron.extra'
      //   },
      //   value: '',
      //   type: 'string'
      // }
    ]
  },
  {
    id: 'openAiToken',
    label: 'OpenAI API Token',
    parentId: '',
    value: '',
    editable: true,
    component: {
      type: 'input',
      required: true
    },
    type: 'layout',
    dataList: [
      {
        id: 'openAiApiToken',
        label: 'openai-api-token',
        parentId: '',
        component: {
          type: 'input',
          required: true,
          validator(val, callback) {
            if (val) {
              callback();
            } else {
              callback(i18n.global.t('system.setting.rule.openai'));
            }
          }
        },
        value: '',
        type: 'string'
      }
    ]
  }
  // {
  //   id: 'InterceptorManage',
  //   label: 'system.setting.interceptor',
  //   parentId: '',
  //   value: '',
  //   editable: true,
  //   component: {
  //     type: 'switch',
  //     required: true
  //   },
  //   type: 'layout',
  //   dataList: [
  //     {
  //       id: 'AnalyzeOnline',
  //       label: 'system.setting.pulldependce',
  //       desc: 'system.setting.pulldependce.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'switch',
  //         required: true
  //       },
  //       type: 'boolean'
  //     },
  //     {
  //       id: 'ApplyVulnerabilityPrioritization',
  //       label: 'system.setting.analyze.ApplyVulnerabilityPrioritization',
  //       desc: 'system.setting.analyze.VulnPrioritization.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'switch',
  //         required: true
  //       },
  //       type: 'boolean'
  //     },
  //     {
  //       id: 'EnableFixAdvice',
  //       label: 'system.setting.analyze.enableFixAdvice',
  //       desc: '',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'switch',
  //         required: true
  //       },
  //       type: 'boolean'
  //     },
  //     {
  //       id: 'FixAdviceMaxEvaluateVersionPerPackage',
  //       label: 'system.setting.analyze.fixAdvice',
  //       desc: 'system.setting.analyze.fixAdvice.desc',
  //       show(formData) {
  //         return formData?.EnableFixAdvice === 'true';
  //       },
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'number',
  //         required: true,
  //         match: '',
  //         message: '',
  //         extra: '',
  //         binds: {
  //           max: 50,
  //           min: 1,
  //           step: 1,
  //           precision: 0
  //         }
  //       },
  //       type: 'number'
  //     },
  //     {
  //       id: '',
  //       label: 'system.setting.analyze.repoconfig',
  //       value: '',
  //       type: 'text',
  //       component: {},
  //       parentId: '',
  //       style: {
  //         'fontWeight': 500,
  //         'marginBottom': '20px',
  //         'padding-bottom': '10px',
  //         'border-bottom': '1px solid #eaecee'
  //       }
  //     },
  //     {
  //       id: '',
  //       label: 'Maven',
  //       value: '',
  //       type: 'text',
  //       component: {},
  //       parentId: '',
  //       style: {
  //         fontWeight: 500,
  //         marginBottom: '15px'
  //       }
  //     },
  //     {
  //       id: 'AnalyzeWithMavenRepository',
  //       label: 'system.setting.mavenRepo',
  //       desc: 'system.setting.mavenRepo.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'input',
  //         required: false,
  //         match: 'urlHttp',
  //         message: 'system.setting.rules.mavenRepo',
  //         extra: 'system.setting.rules.mavenRepo'
  //       },
  //       type: 'string'
  //     },
  //     {
  //       id: '',
  //       label: 'Go Modules',
  //       value: '',
  //       type: 'text',
  //       component: {},
  //       parentId: '',
  //       style: {
  //         fontWeight: 500,
  //         marginTop: '10px',
  //         marginBottom: '15px'
  //       }
  //     },
  //     {
  //       id: 'AnalyzeWithGoModuleRepository',
  //       label: 'system.setting.mavenRepo',
  //       desc: 'system.setting.analyze.goproxy.desc',
  //       editable: true,
  //       parentId: '',
  //       value: {
  //         Repository: '',
  //         GOPRIVATE: '',
  //         GONOPROXY: ''
  //       },
  //       childProperties: [
  //         {
  //           id: 'proxy',
  //           label: 'system.setting.mavenRepo',
  //           desc: 'system.setting.analyze.goproxy.desc',
  //           editable: true,
  //           parentId: '',
  //           value: '',
  //           component: {
  //             type: 'input',
  //             required: false,
  //             match: 'urlReg',
  //             message: 'system.rules.url',
  //             extra: ''
  //           },
  //           type: 'string'
  //         },
  //         {
  //           id: 'private',
  //           label: 'Private',
  //           desc: 'system.setting.analyze.goprivate.desc',
  //           parentId: '',
  //           editable: true,
  //           value: '',
  //           component: {
  //             type: 'input',
  //             required: false,
  //             match: '',
  //             message: '',
  //             extra: ''
  //           },
  //           type: 'string'
  //         },
  //         {
  //           id: 'noProxy',
  //           label: 'NoProxy',
  //           desc: 'system.setting.analyze.gonoproxy.desc',
  //           parentId: '',
  //           editable: true,
  //           value: '',
  //           component: {
  //             type: 'input',
  //             required: false,
  //             match: '',
  //             message: '',
  //             extra: ''
  //           },
  //           type: 'string'
  //         }
  //       ],
  //       component: {
  //         type: 'input',
  //         required: false,
  //         match: 'urlReg',
  //         message: '',
  //         extra: ''
  //       },
  //       type: 'string'
  //     }
  //   ]
  // },
  // {
  //   id: 'ProxyManage',
  //   label: 'system.setting.proxyManage',
  //   parentId: '',
  //   hidden: false,
  //   editable: true,
  //   type: 'layout',
  //   value: '',
  //   component: {
  //     type: 'input',
  //     required: false
  //   },
  //   dataList: [
  //     {
  //       id: 'ProxyWildcardDomainName',
  //       label: 'system.setting.wildDomain',
  //       desc: 'system.setting.wildDomain.desc',
  //       parentId: '',
  //       component: {
  //         type: 'input',
  //         required: true,
  //         validator: (val, callback) => {
  //           const reg = wildDomainReg;
  //           if (reg.test(val)) {
  //             callback();
  //           } else {
  //             callback(i18n.global.t('system.setting.rules.genericdomain'));
  //           }
  //         }
  //       },
  //       value: '',
  //       type: 'string'
  //     },
  //     {
  //       id: 'ProxyTLS',
  //       label: 'system.setting.tls',
  //       desc: 'system.setting.tls.desc',
  //       parentId: '',
  //       component: {
  //         type: 'select',
  //         required: true
  //       },
  //       type: 'string',
  //       // value: 'ProxyTLSAcmeGen',
  //       value: '',
  //       children: [
  //         {
  //           id: 'Customize',
  //           value: 'Customize',
  //           label: 'system.setting.customize',
  //           desc: 'system.setting.customize.desc'
  //         },
  //         {
  //           id: 'Terminate',
  //           value: 'Terminate',
  //           label: 'system.setting.terminate',
  //           desc: 'system.setting.terminate.desc'
  //         },
  //         {
  //           id: 'ACME',
  //           value: 'ACME',
  //           label: 'system.setting.acme',
  //           desc: 'system.setting.acme.desc'
  //         },
  //         {
  //           id: 'Disable',
  //           value: 'Disable',
  //           label: 'system.setting.disabled',
  //           desc: 'system.setting.disabled.desc'
  //         }
  //       ]
  //     },
  //     {
  //       id: 'ProxyTLSCustomizeCrt',
  //       label: 'system.setting.customize.lisence',
  //       parentId: 'ProxyTLS',
  //       parentValue: 'Customize',
  //       component: {
  //         type: 'textarea',
  //         required: true
  //       },
  //       value: '',
  //       type: 'string'
  //     },
  //     {
  //       id: 'ProxyTLSCustomizeKey',
  //       label: 'system.setting.customize.key',
  //       parentId: 'ProxyTLS',
  //       parentValue: 'Customize',
  //       component: {
  //         type: 'textarea',
  //         required: true
  //       },
  //       value: '',
  //       type: 'string'
  //     }
  //   ]
  // },
  // {
  //   id: 'offlineManage',
  //   label: 'system.setting.offlineManage',
  //   parentId: '',
  //   value: '',
  //   editable: true,
  //   component: {
  //     type: 'input',
  //     required: true
  //   },
  //   type: 'layout',
  //   dataList: [
  //     {
  //       id: 'HTTPProxy',
  //       // label: 'system.setting.offlineManage.httpProxy',
  //       label: 'http_proxy',
  //       desc: 'system.setting.offlineManage.httpProxy.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'input',
  //         required: false,
  //         match: 'urlHttp',
  //         message: 'system.setting.rules.mavenRepo'
  //       },
  //       type: 'string'
  //     },
  //     {
  //       id: 'HTTPSProxy',
  //       // label: 'system.setting.offlineManage.httpsProxy',
  //       label: 'https_proxy',
  //       desc: 'system.setting.offlineManage.httpsProxy.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'input',
  //         required: false,
  //         match: 'urlHttp',
  //         message: 'system.setting.rules.mavenRepo'
  //       },
  //       type: 'string'
  //     },
  //     {
  //       id: 'AllProxy',
  //       // label: 'system.setting.offlineManage.allProxy',
  //       label: 'all_proxy',
  //       desc: 'system.setting.offlineManage.allProxy.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'input',
  //         required: false,
  //         match: 'scoksReg',
  //         message: 'system.setting.rules.socks',
  //         extra: 'system.setting.rules.socks'
  //       },
  //       type: 'string'
  //     },
  //     {
  //       id: 'NoProxy',
  //       // label: 'system.setting.offlineManage.noProxy',
  //       label: 'no_proxy',
  //       desc: 'system.setting.offlineManage.noProxy.desc',
  //       parentId: '',
  //       value: '',
  //       component: {
  //         type: 'input',
  //         required: false,
  //         validator: (val, callback) => {
  //           const ip = ipReg;
  //           const domain = domainReg;
  //           const valList = split(val, ',') || [];
  //           if (
  //             !val ||
  //             valList.every((item) => ip.test(item) || domain.test(item))
  //           ) {
  //             callback();
  //           } else {
  //             callback(i18n.global.t('system.setting.rules.noProxy'));
  //           }
  //         },
  //         extra: 'system.setting.offlineManage.noProxy.extra'
  //       },
  //       type: 'string'
  //     }
  //   ]
  // }
];
export default {
  settingList
};
