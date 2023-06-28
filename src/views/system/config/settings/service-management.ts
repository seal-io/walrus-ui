import i18n from '@/locale/index';

export default {
  id: 'ServerManage',
  label: 'system.setting.serverManage',
  parentId: '',
  component: {},
  value: '',
  type: 'layout',
  dataList: [
    {
      id: '',
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
      ]
    },
    {
      id: '',
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
          label: 'system.setting.openAiApiToken',
          parentId: '',
          component: {
            type: 'password',
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
  ]
};
