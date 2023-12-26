import i18n from '@/locale/index';
import { SettingsItem } from '../index';

export const serviceManagement: SettingsItem = {
  id: 'ServerManage',
  key: '',
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
      label: 'system.setting.SkipRemoteTLSVerify.title',
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
          id: 'SkipRemoteTLSVerify',
          key: 'SkipRemoteTLSVerify',
          label: 'system.setting.SkipRemoteTLSVerify',
          desc: 'system.setting.SkipRemoteTLSVerify.desc',
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
      label: 'system.setting.templateLib',
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
          id: 'EnableBuiltinCatalog',
          key: 'EnableBuiltinCatalog',
          label: 'system.setting.enableBuiltinCatalog',
          desc: 'system.setting.enableBuiltinCatalog.desc',
          parentId: '',
          component: {
            type: 'switch',
            required: false,
            match: '',
            message: ''
          },
          value: '',
          type: 'boolean'
        },
        {
          id: 'EnableSyncCatalog',
          key: 'EnableSyncCatalog',
          label: 'system.setting.enableSyncCatalog',
          desc: 'system.setting.enableSyncCatalog.desc',
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
          },
          value: '',
          type: 'string'
        }
      ]
    }
  ]
};

export default serviceManagement;
