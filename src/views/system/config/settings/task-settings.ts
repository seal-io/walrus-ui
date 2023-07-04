import { validateCron } from '@/utils/validate';
import i18n from '@/locale/index';

export default {
  id: 'TaskSettings',
  label: 'system.setting.task',
  parentId: '',
  component: {},
  value: '',
  type: 'layout',
  dataList: [
    {
      id: '',
      label: 'system.setting.task.basic',
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
          id: 'ConnectorStatusSyncCronExpr',
          label: 'system.setting.ConnectorCheckCronExpr',
          desc: 'system.setting.ConnectorCheckCronExpr.desc',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            validator(val, callback) {
              if (validateCron(val)) {
                callback();
              } else {
                callback(i18n.global.t('system.setting.rules.cron'));
              }
            },
            extra: 'system.setting.cron.extra'
          },
          value: '',
          type: 'string'
        },
        {
          id: 'ResourceStatusSyncCronExpr',
          label: 'system.setting.ResourceStatusCheckCronExpr',
          desc: 'system.setting.ResourceStatusCheckCronExpr.desc',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            validator(val, callback) {
              if (validateCron(val)) {
                callback();
              } else {
                callback(i18n.global.t('system.setting.rules.cron'));
              }
            },
            extra: 'system.setting.cron.extra'
          },
          value: '',
          type: 'string'
        },
        {
          id: 'ServiceRelationshipCheckCronExpr',
          label: 'system.setting.ServiceDependencyCheckCronExpr',
          desc: 'system.setting.ServiceDependencyCheckCronExpr.desc',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            validator(val, callback) {
              if (validateCron(val)) {
                callback();
              } else {
                callback(i18n.global.t('system.setting.rules.cron'));
              }
            },
            extra: 'system.setting.cron.extra'
          },
          value: '',
          type: 'string'
        }
      ]
    },
    {
      id: '',
      label: 'system.setting.task.finops',
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
          id: 'ResourceLabelApplyCronExpr',
          label: 'system.setting.ResourceLabelApplyCronExpr',
          desc: 'system.setting.ResourceLabelApplyCronExpr.desc',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            validator(val, callback) {
              if (validateCron(val)) {
                callback();
              } else {
                callback(i18n.global.t('system.setting.rules.cron'));
              }
            },
            extra: 'system.setting.cron.extra'
          },
          value: '',
          type: 'string'
        },
        {
          id: 'ConnectorCostCollectCronExpr',
          label: 'system.setting.CostCollectCronExpr',
          desc: 'system.setting.CostCollectCronExpr.desc',
          parentId: '',
          component: {
            type: 'input',
            required: true,
            validator(val, callback) {
              if (validateCron(val)) {
                callback();
              } else {
                callback(i18n.global.t('system.setting.rules.cron'));
              }
            },
            extra: 'system.setting.cron.extra'
          },
          value: '',
          type: 'string'
        }
      ]
    }
  ]
};
