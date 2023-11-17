import { validateCron } from '@/utils/validate';
import i18n from '@/locale/index';
import { SettingsItem } from '../index';

export const taskSettings: SettingsItem = {
  id: 'TaskSettings',
  label: 'system.setting.task',
  parentId: '',
  component: {},
  value: '',
  type: 'layout',
  dataList: [
    {
      id: '',
      key: '',
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
          key: 'ConnectorStatusSyncCronExpr',
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
          id: 'ResourceComponentStatusSyncCronExpr',
          key: 'ResourceComponentStatusSyncCronExpr',
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
          id: 'ResourceRelationshipCheckCronExpr',
          key: 'ResourceRelationshipCheckCronExpr',
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
    // {
    //   id: '',
    //   key: '',
    //   desc: '',
    //   parentId: '',
    //   value: '',
    //   component: {},
    //   label: 'system.setting.drift.title',
    //   type: 'groupTitle',
    //   isEditable: false,
    //   style: {
    //     fontWeight: 500,
    //     marginTop: '10px',
    //     marginBottom: '15px'
    //   },
    //   subGroup: [
    //     {
    //       id: 'EnableDriftDetection',
    //       key: 'EnableDriftDetection',
    //       label: 'system.setting.drift.check',
    //       desc: 'system.setting.drift.check.desc',
    //       parentId: '',
    //       component: {
    //         type: 'switch',
    //         required: false,
    //         match: '',
    //         message: ''
    //       },
    //       value: '',
    //       type: 'string'
    //     },
    //     {
    //       id: 'ServiceDriftDetectCronExpr',
    //       key: 'ServiceDriftDetectCronExpr',
    //       label: 'system.setting.drift.cronExpr',
    //       desc: 'system.setting.CostCollectCronExpr.desc',
    //       parentId: '',
    //       component: {
    //         type: 'input',
    //         required: true,
    //         validator(val, callback) {
    //           if (validateCron(val)) {
    //             callback();
    //           } else {
    //             callback(i18n.global.t('system.setting.rules.cron'));
    //           }
    //         },
    //         extra: 'system.setting.cron.extra'
    //       },
    //       value: '',
    //       type: 'string'
    //     }
    //   ]
    // },
    {
      id: '',
      key: '',
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
          id: 'ResourceComponentLabelApplyCronExpr',
          key: 'ResourceComponentLabelApplyCronExpr',
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
          key: 'ConnectorCostCollectCronExpr',
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

export default taskSettings;
