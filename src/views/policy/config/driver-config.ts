import { DriverOptions } from '@/utils/driver';
import { nextTick } from 'vue';
import i18n from '@/locale';

export function steps(
  driver: any,
  { showExpression, showForm, isWhite }
): Array<DriverOptions> {
  const listBlack = [
    {
      element: '#policy-formdata-type',
      popover: {
        className: 'sl-driver-popover',
        title: i18n.global.t('policy.detail.driver.policyType'),
        description: i18n.global.t('policy.detail.driver.policyTypeDesc'),
        // position: 'bottom'
      },
    },
  ];
  const listWhite = [
    {
      element: '#policy-formdata-category',
      popover: {
        className: 'sl-driver-popover',
        title: i18n.global.t('policy.detail.driver.policyGroup'),
        description: i18n.global.t('policy.detail.driver.policyGroupDesc'),
        // position: 'bottom'
      },
    },
    {
      element: '#policy-formdata-type',
      popover: {
        className: 'sl-driver-popover',
        title: i18n.global.t('policy.detail.driver.policyType'),
        description: i18n.global.t('policy.detail.driver.policyTypeDesc'),
        // position: 'bottom'
      },
    },
  ];
  const result = [
    {
      element: '#policy-condition-box',
      popover: {
        className: 'sl-driver-popover',
        title: i18n.global.t('policy.detail.driver.formType'),
        description: i18n.global.t('policy.detail.driver.formTypeDesc'),
        position: 'bottom',
      },
      onNext: () => {
        driver.preventMove();
        showExpression();
        nextTick(() => {
          setTimeout(() => {
            driver.moveNext();
          }, 300);
        });
      },
    },
    {
      element: '#policy-formdata-expr',
      popover: {
        className: 'sl-driver-popover',
        title: i18n.global.t('policy.detail.driver.expressionType'),
        description: i18n.global.t('policy.detail.driver.expressionTypeDesc'),
        position: 'bottom',
      },
      onPrevious: () => {
        driver.preventMove();
        showForm();
        nextTick(() => {
          setTimeout(() => {
            driver.movePrevious();
          }, 300);
        });
      },
    },
    // {
    //   element: '#policy-field-map',
    //   popover: {
    //     className: 'sl-driver-popover',
    //     title: '约束条件可配置字段',
    //     description:
    //       '在这里显示为表达式可配置的条件字段, 不同的策略类型对应不同的字段',
    //     // position: 'bottom'
    //   },
    // },
  ];
  return isWhite ? listWhite.concat(result) : listBlack.concat(result);
}
export default {};
