import i18n from '@/locale/index';
import { SettingsItem } from '../index';

export const serviceManagement: SettingsItem = {
  id: 'ServerManage',
  label: 'system.setting.serverManage',
  parentId: '',
  component: {},
  value: '',
  type: 'layout',
  dataList: [
    {
      id: '',
      key: '',
      label: 'system.setting.task.basicmng',
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
          id: 'ServeUrl',
          key: 'ServeUrl',
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
        },
        {
          id: 'EnableTelemetry',
          key: 'EnableTelemetry',
          label: 'login.config.join.improvement',
          parentId: '',
          component: {
            type: 'switch',
            required: false,
            match: '',
            message: ''
          },
          value: '',
          type: 'boolean'
        }
      ]
    },
    {
      id: '',
      key: '',
      label: 'system.setting.task.enhance',
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
          id: 'OpenAiApiToken',
          key: 'OpenAiApiToken',
          label: 'system.setting.openAiApiToken',
          parentId: '',
          component: {
            type: 'password',
            required: false
            // validator(val, callback) {
            //   if (val) {
            //     callback();
            //   } else {
            //     callback(i18n.global.t('system.setting.rule.openai'));
            //   }
            // }
          },
          value: '',
          type: 'string'
        }
      ]
    }
  ]
};

export default serviceManagement;
