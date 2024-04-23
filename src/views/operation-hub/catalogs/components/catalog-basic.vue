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
  import ProviderIcon from '@/components/provider-icon/index.vue';
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
      const sealCatalog = 'https://github.com/walrus-catalog';
      const authentication = ref('none');

      const providers = [
        {
          label: 'GitHub',
          value: 'Github'
        },
        {
          label: 'GitLab',
          value: 'Gitlab'
        },
        {
          label: 'Gitee',
          value: 'Gitee'
        }
      ];

      const AuthenticationOptions = [
        {
          label: 'None',
          value: 'none'
        },
        {
          label: 'Bearer Token',
          value: 'bearer'
        }
      ];

      const handleSecretRefChange = () => {
        ctx.emit('update:formData', {
          ...props.formData,
          spec: {
            ...props.formData.spec,
            vcsSource: {
              ...props.formData.spec.vcsSource
            }
          }
        });
      };

      return () => (
        <>
          <GroupTitle
            style={{ marginBottom: 0 }}
            title={t('common.title.basicInfo')}
            bordered={false}
            flexStart
          ></GroupTitle>
          <a-form-item
            label={t('operation.connectors.table.name')}
            field="metadata.name"
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
              modelValue={props.formData.metadata.name}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  metadata: {
                    ...props.formData.metadata,
                    name: val
                  }
                });
              }}
              label={t('operation.connectors.table.name')}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              max-length={validateInputLength.NAME}
              show-word-limit
            ></seal-input>
          </a-form-item>
          {/* <a-form-item
            label="Template Format"
            field="spec.templateFormat"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.spec.templateFormat}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    templateFormat: val
                  }
                });
              }}
              label="Template Format"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          </a-form-item> */}
          <a-form-item
            label={t('common.table.description')}
            field="sepc.description"
            hide-asterisk
            hide-label={true}
            validate-trigger={['change', 'input']}
          >
            <seal-textarea
              modelValue={props.formData.spec.description}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    description: val
                  }
                });
              }}
              label={t('common.table.description')}
              auto-size={{ minRows: 3, maxRows: 4 }}
              style={{ width: `${InputWidth.LARGE}px` }}
              max-length={validateInputLength.DESC}
              show-word-limit
            ></seal-textarea>
          </a-form-item>

          <a-form-item
            field="spec.vcsSource.platform"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.spec.vcsSource.platform}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    vcsSource: {
                      ...props.formData.spec.vcsSource,
                      platform: val
                    }
                  }
                });
              }}
              label={t('common.table.type')}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              v-slots={{
                prefix: () => (
                  <ProviderIcon
                    provider={_.toLower(
                      props.formData.spec.vcsSource.platform || ''
                    )}
                  ></ProviderIcon>
                )
              }}
            >
              {_.map(providers, (item) => (
                <a-option key={item.value} value={item.value}>
                  <ProviderIcon provider={_.toLower(item.value)}></ProviderIcon>
                  <span style="margin-left: 5px">{item.label}</span>
                </a-option>
              ))}
            </seal-select>
          </a-form-item>
          <a-form-item
            label="URL"
            field="spec.vcsSource.url"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
            validate-trigger={['change', 'input']}
            v-slots={{
              extra: () => {
                return (
                  <span>
                    {t('catalogs.form.source.desc', {
                      url: sealCatalog
                    })}
                  </span>
                );
              }
            }}
          >
            <seal-input
              modelValue={props.formData.spec.vcsSource.url}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    vcsSource: {
                      ...props.formData.spec.vcsSource,
                      url: val
                    }
                  }
                });
              }}
              label="URL"
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-input>
          </a-form-item>
          {/* <a-form-item
            label={t('operation.templates.form.authentication')}
            field="spec.vcsSource.secretRef"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              v-model={authentication.value}
              onChange={(val) => {
                handleSecretRefChange();
              }}
              label={t('operation.templates.form.authentication')}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              options={AuthenticationOptions}
            ></seal-select>
          </a-form-item> */}
          {/* {authentication.value === 'bearer' && (
            <a-form-item
              label="Token"
              field="spec.vcsSource.token"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
            >
              <seal-input
                modelValue={props.formData.spec.vcsSource.token}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    spec: {
                      ...props.formData.spec,
                      vcsSource: {
                        ...props.formData.spec.vcsSource,
                        token: val
                      }
                    }
                  });
                }}
                label="Token"
                required={true}
                style={{ width: `${InputWidth.LARGE}px` }}
              ></seal-input>
            </a-form-item>
          )} */}
        </>
      );
    }
  });
</script>
