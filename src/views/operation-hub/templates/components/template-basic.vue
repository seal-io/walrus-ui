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
  import { TemplateFormData } from '../config/interface';

  export default defineComponent({
    props: {
      formData: {
        type: Object as PropType<TemplateFormData>,
        default: () => ({})
      },
      action: {
        type: String,
        default() {
          return ModalAction.CREATE;
        }
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
          label: 'OCI',
          value: 'OCI'
        },
        {
          label: 'Download URL',
          value: 'DownloadURL'
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
            vcsRepository: {
              ...props.formData.spec.vcsRepository,
              token: ''
            }
          }
        });
      };

      const renderProviderExtra = () => {
        if (props.formData.spec.vcsRepository.platform === 'DownloadURL') {
          return (
            <div>
              URL of helm chart tgz file,
              e.g.:https://stefanprodan.github.io/podinfo/podinfo-6.6.0.tgz
            </div>
          );
        }
        if (props.formData.spec.vcsRepository.platform === 'OCI') {
          return (
            <div>
              OCI image of helm chart, e.g.:oci://podinfo/podinfo?version=6.6.0
            </div>
          );
        }

        return (
          <>
            <div
              style={{
                'line-height': '20px',
                'width': `${InputWidth.LARGE}px`
              }}
            >
              <div>{t('operation.templates.source.description')}</div>
              <div>
                https://github.com/terraform-aws-modules/terraform-aws-vpc
              </div>
            </div>
            <div>
              https://github.com/terraform-aws-modules/terraform-aws-vpc?ref=master
            </div>
          </>
        );
      };

      return () => (
        <>
          {/* <GroupTitle
            style={{ marginBottom: 0 }}
            title={t('common.title.basicInfo')}
            bordered={false}
            flexStart
          ></GroupTitle> */}
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
          <GroupTitle
            style={{ marginBottom: 0 }}
            title="Storage"
            bordered={false}
            flexStart
          ></GroupTitle>
          <a-form-item
            label={t('operation.templates.form.StorageType')}
            field="spec.vcsRepository.platform"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
          >
            <seal-select
              modelValue={props.formData.spec.vcsRepository.platform}
              onChange={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    vcsRepository: {
                      ...props.formData.spec.vcsRepository,
                      platform: val
                    }
                  }
                });
              }}
              label={t('operation.templates.form.StorageType')}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
              v-slots={{
                prefix: () => (
                  <ProviderIcon
                    provider={_.toLower(
                      props.formData.spec.vcsRepository.platform || ''
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
            field="spec.vcsRepository.url"
            hide-asterisk
            hide-label={true}
            disabled={props.action === ModalAction.EDIT}
            validate-trigger={['change', 'input']}
            v-slots={{
              extra: renderProviderExtra
            }}
          >
            <seal-input
              modelValue={props.formData.spec.vcsRepository.url}
              onUpdate:modelValue={(val) => {
                ctx.emit('update:formData', {
                  ...props.formData,
                  spec: {
                    ...props.formData.spec,
                    vcsRepository: {
                      ...props.formData.spec.vcsRepository,
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
          <a-form-item
            label={t('operation.templates.form.authentication')}
            field="spec.vcsRepository.secretRef"
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
          </a-form-item>
          {authentication.value === 'bearer' && (
            <a-form-item
              label="Token"
              field="spec.vcsRepository.token"
              hide-asterisk
              hide-label={true}
              disabled={props.action === ModalAction.EDIT}
              validate-trigger={['change', 'input']}
            >
              <seal-input
                modelValue={props.formData.spec.vcsRepository.token}
                onUpdate:modelValue={(val) => {
                  ctx.emit('update:formData', {
                    ...props.formData,
                    spec: {
                      ...props.formData.spec,
                      vcsRepository: {
                        ...props.formData.spec.vcsRepository,
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
          )}
        </>
      );
    }
  });
</script>
