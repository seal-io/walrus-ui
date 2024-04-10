<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { defineComponent, PropType, ref } from 'vue';
  import {
    validateLabelNameRegx,
    InputWidth,
    validateInputLength,
    ModalAction
  } from '@/views/config';
  import GroupTitle from '@/components/group-title/index.vue';
  import { CatalogFormData } from '../config/interface';

  export default defineComponent({
    props: {
      formData: {
        type: Object as PropType<CatalogFormData>,
        default: () => ({})
      },
      action: {
        type: String,
        default: ''
      }
    },
    emits: ['update:formData'],
    setup(props, ctx) {
      const { t } = i18n.global;
      const enableFiltering = ref(false);

      const handleEnableChange = (val) => {
        if (!enableFiltering.value) {
          ctx.emit('update:formData', {
            ...props.formData,
            spec: {
              ...props.formData.spec,
              filtering: {
                includeFilter: '',
                excludeFilter: ''
              }
            }
          });
        }
      };

      const renderFiltering = () => {
        return (
          <>
            <a-form-item
              label={t('operation.templates.form.includeFilter')}
              field="spec.filtering.includeFilter"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
              v-slots={{
                extra: () => (
                  <span>
                    {t('operation.templates.form.excludeFilter.desc')}
                  </span>
                )
              }}
            >
              <seal-input
                modelValue={props.formData.spec.filtering.includeFilter}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    spec: {
                      ...props.formData.spec,
                      filtering: {
                        ...props.formData.spec.filtering,
                        includeFilter: _.trim(val)
                      }
                    }
                  });
                }}
                label={t('operation.templates.form.includeFilter')}
                required={false}
                style={{ width: `${InputWidth.LARGE}px` }}
              ></seal-input>
            </a-form-item>
            <a-form-item
              label={t('operation.templates.form.excludeFilter')}
              field="spec.filtering.excludeFilter"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
              v-slots={{
                extra: () => (
                  <span>
                    {t('operation.templates.form.excludeFilter.desc')}
                  </span>
                )
              }}
            >
              <seal-input
                modelValue={props.formData.spec.filtering.excludeFilter}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    spec: {
                      ...props.formData.spec,
                      filtering: {
                        ...props.formData.spec.filtering,
                        excludeFilter: _.trim(val)
                      }
                    }
                  });
                }}
                label={t('operation.templates.form.includeFilter')}
                required={false}
                style={{ width: `${InputWidth.LARGE}px` }}
              ></seal-input>
            </a-form-item>
          </>
        );
      };
      return () => (
        <>
          {/* <GroupTitle
            title="OCI Registry Authorization"
            bordered={false}
            flexStart
          ></GroupTitle>
          <a-form-item
            label="Auth Type"
            field="authType"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.authType}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  authType: val
                });
              }}
              label="Auth Type"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          </a-form-item> */}
          <GroupTitle
            style={{ marginBottom: 0 }}
            title="Advance"
            bordered={false}
            flexStart
          ></GroupTitle>
          <a-form-item
            label="Enable Filtering"
            field="enableFiltering"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-switch
              size="small"
              v-model={enableFiltering.value}
              label="Enable Filtering"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              onChange={(val) => {
                handleEnableChange(val);
              }}
            ></seal-switch>
          </a-form-item>
          {enableFiltering.value && renderFiltering()}
        </>
      );
    }
  });
</script>
