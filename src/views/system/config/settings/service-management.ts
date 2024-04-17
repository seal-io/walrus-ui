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
          id: 'serve-url',
          key: 'serve-url',
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
          id: 'enable-telemetry',
          key: 'enable-telemetry',
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
      label: 'system.setting.subjectLoginExpirationSeconds',
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
          id: 'subject-login-expiration-seconds',
          key: 'subject-login-expiration-seconds',
          label: 'system.setting.subjectLoginExpirationSeconds',
          desc: '',
          parentId: '',
          component: {
            type: 'number',
            required: false,
            match: '',
            message: '',
            binds: {
              min: 3600
            }
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
          id: 'enable-remote-tls-verify',
          key: 'enable-remote-tls-verify',
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
    // {
    //   id: '',
    //   key: '',
    //   label: 'system.setting.resourceDefinition',
    //   value: '',
    //   type: 'groupTitle',
    //   component: {},
    //   parentId: '',
    //   isEditable: false,
    //   style: {
    //     fontWeight: 500,
    //     marginTop: '10px',
    //     marginBottom: '15px'
    //   },
    //   subGroup: [
    //     {
    //       id: 'EnableBuiltinResourceDefinition',
    //       key: 'EnableBuiltinResourceDefinition',
    //       label: 'system.setting.enableBuiltinDefinition',
    //       desc: '',
    //       parentId: '',
    //       component: {
    //         type: 'switch',
    //         required: false,
    //         match: '',
    //         message: ''
    //       },
    //       value: '',
    //       type: 'boolean'
    //     }
    //   ]
    // },
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
          id: 'enable-builtin-catalog',
          key: 'enable-builtin-catalog',
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
          id: 'enable-sync-catalog',
          key: 'enable-sync-catalog',
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
    }
    // {
    //   id: '',
    //   key: '',
    //   label: 'system.setting.task.enhance',
    //   value: '',
    //   type: 'groupTitle',
    //   component: {},
    //   parentId: '',
    //   isEditable: false,
    //   style: {
    //     fontWeight: 500,
    //     marginTop: '10px',
    //     marginBottom: '15px'
    //   },
    //   subGroup: [
    //     {
    //       id: 'OpenAiApiToken',
    //       key: 'OpenAiApiToken',
    //       label: 'system.setting.openAiApiToken',
    //       parentId: '',
    //       component: {
    //         type: 'password',
    //         required: false
    //       },
    //       value: '',
    //       type: 'string'
    //     }
    //   ]
    // }
  ]
};

export default serviceManagement;
