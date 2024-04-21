<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    ref,
    reactive,
    PropType,
    computed,
    defineComponent,
    withModifiers
  } from 'vue';
  import { validateUserNameRegx, validateInputLength } from '@/views/config';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import SealInputPassword from '@/components/seal-form/components/seal-input-password.vue';
  import SealInput from '@/components/seal-form/components/seal-input.vue';
  import SealSwitch from '@/components/seal-form/components/seal-switch.vue';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import {
    GlobalNamespace,
    createSubjectProvider,
    updateSubjectProvider
  } from '../api';
  import {
    ResourceKinds,
    apiVersion,
    ProviderTypes,
    ProviderSpecConfig,
    FieldType
  } from '../config';
  import stepsMap from '../config/instructions';
  import { FormData } from '../config/interface';

  export default defineComponent({
    emits: ['update:show', 'update:action', 'save'],
    props: {
      action: {
        type: String,
        default() {
          return 'create'; // create, edit
        }
      },
      show: {
        type: Boolean,
        default() {
          return false;
        }
      },
      dataInfo: {
        type: Object as PropType<FormData>,
        default() {
          return {};
        }
      }
    },
    setup(props, { emit }) {
      const siteOrigin = window.location.origin;
      const { t } = i18n.global;
      const submitLoading = ref(false);
      const formref = ref();
      const showAdavanced = ref(false);
      const configOptions = ref([]);
      const formData = ref<FormData>({
        apiVersion,
        kind: ResourceKinds.SubjectProvider,
        metadata: {
          name: '',
          namespace: GlobalNamespace
        },
        spec: {
          description: '',
          displayName: '',
          type: ProviderTypes.GitHub,
          externalConfig: {
            github: {
              clientID: '',
              clientSecret: ''
            }
          }
        },
        status: {
          loginWithPassword: false
        }
      });

      const operationSteps = computed(() => {
        const steps = stepsMap[formData.value.spec.type];
        return steps?.({
          origin: siteOrigin
        });
      });

      const providerList = computed(() => {
        return _.map(_.keys(ProviderTypes), (key) => {
          return {
            label: key,
            value: ProviderTypes[key]
          };
        });
      });

      const handleTypeChange = (value) => {
        const config = ProviderSpecConfig[value];
        formData.value.spec.type = value;
        formData.value.spec.externalConfig = {
          [_.toLower(value)]: {
            ..._.reduce(
              config,
              (result, item) => {
                result[item.key] = item.default;
                return result;
              },
              {}
            )
          }
        } as any;
      };
      const handleBeforeOpen = () => {
        if (props.action === 'edit') {
          formData.value = _.cloneDeep(props.dataInfo);
        }
      };

      const handleBeforeClose = () => {
        formref.value.resetFields();
        formData.value = {
          apiVersion,
          kind: ResourceKinds.SubjectProvider,
          metadata: {
            name: '',
            namespace: GlobalNamespace
          },
          spec: {
            description: '',
            displayName: '',
            type: ProviderTypes.GitHub,
            externalConfig: {
              github: {
                clientID: '',
                clientSecret: ''
              }
            }
          },
          status: {
            loginWithPassword: false
          }
        };
      };

      const handleCancel = () => {
        emit('update:show', false);
      };

      const handleOk = async () => {
        const res = await formref.value.validate();
        if (res) return;
        submitLoading.value = true;
        try {
          if (props.action === 'create') {
            await createSubjectProvider({
              data: formData.value,
              namespace: GlobalNamespace
            });
          } else {
            await updateSubjectProvider({
              data: formData.value,
              namespace: GlobalNamespace,
              name: formData.value.metadata.name
            });
          }
          emit('save');
          emit('update:show', false);
        } catch (error) {
          console.error(error);
        } finally {
          submitLoading.value = false;
        }
      };

      const renderFooter = () => {
        return (
          <EditPageFooter
            style={{ 'margin-top': 0 }}
            v-slots={{
              save: () => {
                return (
                  <a-button
                    loading={submitLoading.value}
                    type="primary"
                    class="cap-title cancel-btn"
                    onClick={() => {
                      handleOk();
                    }}
                  >
                    {t('common.button.confirm')}
                  </a-button>
                );
              },
              cancel: () => {
                return (
                  <a-button
                    type="outline"
                    class="cap-title cancel-btn"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    {t('common.button.cancel')}
                  </a-button>
                );
              }
            }}
          ></EditPageFooter>
        );
      };

      const renderOptions = (options) => {
        if (!options || options.length === 0) {
          return null;
        }
        return _.map(options, (item, index) => {
          let Component: any = null;
          if (item.type === FieldType.boolean) {
            Component = SealSwitch;
          } else {
            Component =
              item.type === FieldType.password ? SealInputPassword : SealInput;
          }

          return (
            <a-form-item
              hide-label
              key={`spec.externalConfig.${_.toLower(
                formData.value.spec.type
              )}.${item.key}`}
              field={`spec.externalConfig.${_.toLower(
                formData.value.spec.type
              )}.${item.key}`}
              validate-trigger={['change', 'input']}
              rules={[
                {
                  required: item.required,
                  message: t('common.form.rule.input', { name: item.label })
                }
              ]}
            >
              <Component
                model-value={_.get(
                  formData.value,
                  `spec.externalConfig.${_.toLower(formData.value.spec.type)}.${
                    item.key
                  }`,
                  ''
                )}
                onUpdate:modelValue={(val) => {
                  _.set(
                    formData.value,
                    `spec.externalConfig.${_.toLower(
                      formData.value.spec.type
                    )}.${item.key}`,
                    _.trim(val)
                  );
                }}
                onChange={(val) => {
                  _.set(
                    formData.value,
                    `spec.externalConfig.${_.toLower(
                      formData.value.spec.type
                    )}.${item.key}`,
                    val
                  );
                }}
                size={item.type === FieldType.boolean ? 'small' : 'medium'}
                label={t(item.label)}
                required={item.required}
                style={{ width: '100%' }}
              ></Component>
            </a-form-item>
          );
        });
      };
      const renderAdvancedOptions = () => {
        const advancedOptions = _.filter(configOptions.value, (item) => {
          return item.key === 'AdvancedOptions';
        });
        return (
          <>
            {advancedOptions.length > 0 && (
              <div title="Advanced Options">
                <div
                  class="flex"
                  style={{
                    borderBottom: '1px solid var(--color-border-2)',
                    marginBottom: '12px'
                  }}
                >
                  <a-link
                    class="size-14"
                    type="text"
                    style={{
                      padding: '4px 2px',

                      fontSize: 'var(--font-size-large)'
                    }}
                    onClick={() => {
                      showAdavanced.value = !showAdavanced.value;
                    }}
                    v-slots={{
                      icon: () => {
                        return <icon-settings />;
                      }
                    }}
                  >
                    Advanced Options
                  </a-link>
                </div>
                {showAdavanced.value &&
                  renderOptions(advancedOptions?.[0]?.options)}
              </div>
            )}
          </>
        );
      };
      const renderProviderConfig = () => {
        configOptions.value =
          ProviderSpecConfig[formData.value.spec.type || 'GitHub'];
        const basicOptions = _.filter(configOptions.value, (item) => {
          return item.key !== 'AdvancedOptions';
        });

        return <>{renderOptions(basicOptions)}</>;
      };

      const renderSteps = () => {
        return (
          <>
            {_.map(operationSteps.value, (item, index) => {
              return (
                <div
                  class="step-item"
                  style={{
                    padding: '4px 0',
                    lineHeight: '22px',
                    wordBreak: 'break-all',
                    fontSize: 'var(--font-size-small)',
                    color: 'var(--color-text-3)'
                  }}
                  key={index}
                >
                  {index + 1}. <span v-html={item}></span>
                </div>
              );
            })}
          </>
        );
      };
      return () => (
        <a-modal
          top="5%"
          closable={false}
          align-center={false}
          width={900}
          ok-text={t('common.button.save')}
          visible={props.show}
          mask-closable={false}
          body-style={{
            'max-height': '500px',
            'overflow': 'auto',
            'line-height': 1
          }}
          modal-class="user-modal"
          unmount-on-close
          title={
            props.action === 'edit'
              ? t('profile.account.edit')
              : t('profile.account.create')
          }
          onCancel={() => {
            handleCancel();
          }}
          onOk={() => {
            handleOk();
          }}
          onBeforeOpen={() => {
            handleBeforeOpen();
          }}
          onBeforeClose={() => {
            handleBeforeClose();
          }}
          v-slots={{
            footer: () => {
              return renderFooter();
            }
          }}
        >
          <div class="flex">
            <a-form
              ref={(el) => {
                formref.value = el;
              }}
              model={formData.value}
              auto-label-width
              style={{ flex: 1 }}
            >
              <a-form-item
                hide-label
                field="metadata.name"
                validate-trigger={['change', 'input']}
                rules={[
                  {
                    required: true,
                    match: validateUserNameRegx,
                    message: t('account.create.rules.username')
                  }
                ]}
              >
                <seal-input
                  v-model={[
                    formData.value.metadata.name,
                    'modelValue',
                    ['trim']
                  ]}
                  label={t('profile.account.name')}
                  required={true}
                  popupInfo={`名称须与回调地址${siteOrigin}/identify/callback/{provider}中的provider一致`}
                  max-length={validateInputLength.NAME}
                  show-word-limit
                  style={{ width: '100%' }}
                  disabled={props.action === 'edit'}
                ></seal-input>
              </a-form-item>
              <a-form-item
                hide-label
                field="spec.displayName"
                validate-trigger={['change', 'input']}
              >
                <seal-input
                  v-model={[
                    formData.value.spec.displayName,
                    'modelValue',
                    ['trim']
                  ]}
                  label={t('settings.user.nickName')}
                  max-length={validateInputLength.NAME}
                  show-word-limit
                  style={{ width: '100%' }}
                ></seal-input>
              </a-form-item>
              <a-form-item
                hide-label
                validate-trigger={['change', 'input']}
                rules={[
                  {
                    required: false,
                    message: t('propfile.account.settings.rules.role')
                  }
                ]}
              >
                <seal-select
                  v-model={formData.value.spec.type}
                  label={t('common.table.type')}
                  onChange={(val) => handleTypeChange(val)}
                  style={{ width: '100%' }}
                  v-slots={{
                    prefix: () => {
                      return (
                        <ProviderIcon
                          provider={_.toLower(formData.value.spec?.type || '')}
                        ></ProviderIcon>
                      );
                    }
                  }}
                >
                  {_.map(providerList.value, (item, index) => {
                    return (
                      <a-option key={index} value={item.value}>
                        <ProviderIcon
                          provider={_.toLower(item.value)}
                        ></ProviderIcon>
                        <span class="m-l-10">{t(item.label)}</span>
                      </a-option>
                    );
                  })}
                </seal-select>
              </a-form-item>
              {renderProviderConfig()}
              <a-form-item label={t('common.table.description')} hide-label>
                <seal-textarea
                  v-model={formData.value.spec.description}
                  label={t('common.table.description')}
                  max-length={validateInputLength.DESC}
                  show-word-limit
                  style={{ width: '100%' }}
                  auto-size={{ minRows: 4, maxRows: 6 }}
                ></seal-textarea>
              </a-form-item>
              {renderAdvancedOptions()}
            </a-form>
            <div
              class="steps"
              style={{
                width: '360px',
                padding: '0 20px'
              }}
            >
              <div class="m-b-20">
                {formData.value.spec.type}
                <span class="m-l-5">{t('common.settings.instructions')}</span>
              </div>
              {renderSteps()}
            </div>
          </div>
        </a-modal>
      );
    }
  });
</script>
