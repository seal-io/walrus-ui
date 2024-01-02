import i18n from '@/locale/index';
import { wildDomainReg, ipReg, domainReg } from '@/utils/validate';
import _ from 'lodash';
import { SettingsItem } from '../index';

export const deployManagement: SettingsItem = {
  id: 'Deploymanagement',
  label: 'system.setting.deployment',
  parentId: '',
  component: {},
  value: '',
  type: 'layout',
  dataList: [
    {
      id: '',
      key: '',
      label: 'system.setting.deployment.basic',
      value: '',
      type: 'groupTitle',
      component: {},
      parentId: '',
      isEditable: false,
      style: {
        fontWeight: 500,
        marginTop: '10px',
        marginBottom: '15px'
      },
      subGroup: [
        {
          id: 'DeployerImage',
          key: 'DeployerImage',
          label: 'system.setting.TerraformDeployerImage',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            match: '',
            message: ''
          },
          value: '',
          type: 'string'
        },
        {
          id: 'DeployerNetworkMirrorUrl',
          key: 'DeployerNetworkMirrorUrl',
          label: 'system.setting.DeployerNetworkMirrorUrl',
          desc: 'system.setting.DeployerNetworkMirrorUrl.desc',
          showExtra: true,
          extraHtml: true,
          parentId: '',
          component: {
            type: 'input',
            required: false,
            match: '',
            message: '',
            extra: 'system.setting.DeployerNetworkMirrorUrl.extra'
          },
          value: '',
          type: 'string'
        }
      ]
    },
    {
      id: '',
      key: '',
      label: 'system.setting.deployment.proxy',
      value: '',
      type: 'groupTitle',
      component: {},
      parentId: '',
      isEditable: false,
      style: {
        fontWeight: 500,
        marginTop: '10px',
        marginBottom: '15px'
      },
      subGroup: [
        {
          id: 'DeployerHttpProxy',
          key: 'DeployerHttpProxy',
          // label: 'system.setting.offlineManage.httpProxy',
          label: 'HTTP_PROXY',
          desc: 'system.setting.offlineManage.httpProxy.desc',
          parentId: '',
          value: '',
          component: {
            type: 'input',
            required: false,
            match: 'urlHttp',
            message: 'system.setting.rules.mavenRepo',
            extra: 'system.setting.rules.mavenRepo'
          },
          type: 'string'
        },
        {
          id: 'DeployerHttpsProxy',
          key: 'DeployerHttpsProxy',
          // label: 'system.setting.offlineManage.httpsProxy',
          label: 'HTTPS_PROXY',
          desc: 'system.setting.offlineManage.httpsProxy.desc',
          parentId: '',
          value: '',
          component: {
            type: 'input',
            required: false,
            match: 'urlHttp',
            message: 'system.setting.rules.mavenRepo',
            extra: 'system.setting.rules.mavenRepo'
          },
          type: 'string'
        },
        {
          id: 'DeployerAllProxy',
          key: 'DeployerAllProxy',
          // label: 'system.setting.offlineManage.allProxy',
          label: 'ALL_PROXY',
          desc: 'system.setting.offlineManage.allProxy.desc',
          parentId: '',
          value: '',
          component: {
            type: 'input',
            required: false,
            match: 'scoksReg',
            message: 'system.setting.rules.socks',
            extra: 'system.setting.rules.socks'
          },
          type: 'string'
        },
        {
          id: 'DeployerNoProxy',
          key: 'DeployerNoProxy',
          // label: 'system.setting.offlineManage.noProxy',
          label: 'NO_PROXY',
          desc: 'system.setting.offlineManage.noProxy.desc',
          parentId: '',
          value: '',
          component: {
            type: 'input',
            required: false,
            // validator: (val, callback) => {
            //   const valList = _.split(val, ',') || [];
            //   if (
            //     !val ||
            //     valList.every((item) => ipReg.test(item) || ipDomain.test(item))
            //   ) {
            //     callback();
            //   } else {
            //     callback(
            //       i18n.global.t('system.setting.offlineManage.noProxy.extra')
            //     );
            //   }
            // },
            extra: 'system.setting.offlineManage.noProxy.extra'
          },
          type: 'string'
        }
      ]
    }
  ]
};

export default deployManagement;
