<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { defineComponent, ref } from 'vue';
  import {
    validateLabelNameRegx,
    InputWidth,
    validateInputLength,
    ModalAction
  } from '@/views/config';
  import GroupTitle from '@/components/group-title/index.vue';

  export default defineComponent({
    props: {
      formData: {
        type: Object,
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

      const renderFiltering = () => {
        return (
          <>
            <a-form-item
              label="Include Regular Expression"
              field="includRegexp"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
              v-slots={{
                extra: () => (
                  <span>
                    Include templates name match the given regular expression
                  </span>
                )
              }}
            >
              <seal-input
                modelValue={props.formData.includRegexp}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    includRegexp: _.trim(val)
                  });
                }}
                label="Include Regular Expression"
                required={true}
                style={{ width: `${InputWidth.LARGE}px` }}
              ></seal-input>
            </a-form-item>
            <a-form-item
              label="Exclude Regular Expression"
              field="excludeRegexp"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
              v-slots={{
                extra: () => (
                  <span>
                    Exclude templates name match the given regular expression
                  </span>
                )
              }}
            >
              <seal-input
                modelValue={props.formData.excludeRegexp}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    excludeRegexp: _.trim(val)
                  });
                }}
                label="Exclude Regular Expression"
                required={true}
                style={{ width: `${InputWidth.LARGE}px` }}
              ></seal-input>
            </a-form-item>
          </>
        );
      };
      return () => (
        <>
          <GroupTitle
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
          </a-form-item>
          <GroupTitle title="Filtering" bordered={false} flexStart></GroupTitle>
          <a-form-item
            label="Enable Filtering"
            field="enableFiltering"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-switch
              size="small"
              modelValue={props.formData.enableFiltering}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  enableFiltering: val
                });
              }}
              label="Enable Filtering"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-switch>
          </a-form-item>
          {renderFiltering()}
        </>
      );
    }
  });
</script>
