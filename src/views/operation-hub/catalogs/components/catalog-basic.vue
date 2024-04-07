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
      return () => (
        <>
          <GroupTitle
            title={t('common.title.basicInfo')}
            bordered={false}
            flexStart
          ></GroupTitle>
          <a-form-item
            label={t('operation.connectors.table.name')}
            field="name"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
            validate-trigger={['change', 'input']}
            rules={[
              {
                required: true,
                message: t('common.rule.name')
              },
              {
                required: true,
                match: validateLabelNameRegx,
                message: t('common.validate.labelName')
              }
            ]}
          >
            <seal-input
              modelValue={props.formData.name}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  name: _.trim(val)
                });
              }}
              label={t('operation.connectors.table.name')}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              max-length={validateInputLength.NAME}
              show-word-limit
            ></seal-input>
          </a-form-item>
          <a-form-item
            label="Template Format"
            field="templateFormat"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.templateFormat}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  templateFormat: val
                });
              }}
              label="Template Format"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          </a-form-item>
          <a-form-item
            label={t('operation.connectors.table.description')}
            field="description"
            hide-asterisk
            hide-label={true}
            validate-trigger={['change', 'input']}
          >
            <seal-textarea
              modelValue={props.formData.description}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  description: val
                });
              }}
              label={t('operation.connectors.table.name')}
              auto-size={{ minRows: 3, maxRows: 4 }}
              style={{ width: `${InputWidth.LARGE}px` }}
              max-length={validateInputLength.DESC}
              show-word-limit
            ></seal-textarea>
          </a-form-item>
          <GroupTitle title="Storage" bordered={false} flexStart></GroupTitle>
          <a-form-item
            label="Storage Type"
            field="storageType"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.storageType}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  storageType: val
                });
              }}
              label="Storage Type"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          </a-form-item>
          <a-form-item
            label="URL"
            field="url"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
            validate-trigger={['change', 'input']}
          >
            <seal-input
              modelValue={props.formData.url}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  url: _.trim(val)
                });
              }}
              label="URL"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-input>
          </a-form-item>
          <a-form-item
            label="Authentication"
            field="authentication"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.authentication}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  authentication: val
                });
              }}
              label="Authentication"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          </a-form-item>
          <a-form-item
            label="Token"
            field="token"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
            validate-trigger={['change', 'input']}
          >
            <seal-input
              modelValue={props.formData.token}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  token: _.trim(val)
                });
              }}
              label="Token"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-input>
          </a-form-item>
        </>
      );
    }
  });
</script>
