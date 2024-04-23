<script lang="tsx">
  import {
    PageAction,
    validateLabelNameRegx,
    validateInputLength,
    InputWidth,
    EnvironmentTypeMap,
    EnvironmentTypeOrder
  } from '@/views/config';
  import { BreadcrumbOptions } from '@/views/config/interface';
  import _, { assignIn, toLower, get, isEqual, cloneDeep } from 'lodash';
  import { OPERATIONHUB } from '@/router/config';
  import { Resources, Actions } from '@/permissions/config';
  import { useUserStore } from '@/store';
  import {
    defineComponent,
    withModifiers,
    ref,
    reactive,
    onMounted,
    computed,
    h,
    compile
  } from 'vue';
  import Autotip from '@arco-design/web-vue/es/_components/auto-tooltip/auto-tooltip';
  import BreadWrapper from '@/components/bread-wrapper/index.vue';
  import Breadcrumb from '@/components/breadcrumb/index.vue';
  import SealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import ComCard from '@/components/page-wrap/com-card.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import { beforeLeaveCallback } from '@/hooks/save-before-leave';
  import useScrollToView from '@/hooks/use-scroll-to-view';
  import { onBeforeRouteLeave } from 'vue-router';
  import EditPageFooter from '@/components/edit-page-footer/index.vue';
  import useCallCommon from '@/hooks/use-call-common';
  import usePageAction from '@/hooks/use-page-action';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import DescriptionTable from '@/components/description-table/index.vue';
  import AutoReadfile from '@/components/seal-form/form-components/auto-readfile.vue';
  import { ConnectorFormData, ProviderKey } from '../config/interface';
  import StatusLabel from '../components/status-label.vue';
  import {
    operationRootBread,
    CloudProviderType,
    cutomeTypeOptions,
    ConnectorCategory,
    CommonCloudProviderKeys,
    AzureRMCloudProviderKeys,
    GoogleCloudProviderKeys
  } from '../config';
  import { googleCloudRegions } from '../config/gcp';
  import { awsRegions, alibabaCloudRegions } from '../config/region';
  import {
    createConnector,
    updateConnector,
    queryItemConnector,
    apiVersion,
    ResourKinds,
    GlobalNamespace
  } from '../api';
  import useConnectorBread from '../hooks/use-connector-bread';

  export default defineComponent({
    name: OPERATIONHUB.ConnectorProviderDetail,
    setup(props, { expose }) {
      const { breadCrumbList, handleSelectChange, setBreadCrumbList } =
        useConnectorBread();
      const { scrollToView } = useScrollToView();
      const userStore = useUserStore();
      const { t, locale, router, route } = useCallCommon();
      const { pageAction, handleEdit } = usePageAction();
      const connectorName = route.query.name as string;
      const projectName = route.params.projectName as string;
      const formref = ref();
      const submitLoading = ref(false);
      const allowCreate = ref(false);
      const regionSelect = ref();
      const providerKeys = ref<ProviderKey[]>([]);
      const credentialsRef = ref();
      let copyFormData: any = {};

      const formData = ref<ConnectorFormData>({
        apiVersion,
        kind: ResourKinds.Connector,
        metadata: {
          name: '',
          namespace: projectName || GlobalNamespace
        },
        spec: {
          description: '',
          applicableEnvironmentType: '',
          type: CloudProviderType.Alibaba,
          category: ConnectorCategory.CloudProvider,
          enableFinOps: false,
          config: {
            version: 'v1',
            data: {
              access_key: {
                value: '',
                sensitive: false,
                type: 'string'
              },
              secret_key: {
                value: '',
                sensitive: true,
                type: 'string'
              },
              region: {
                value: '',
                sensitive: false,
                type: 'string'
              }
            }
          }
        }
      });

      const EnvironmentTypeList = computed(() => {
        // userStore.applicableEnvironmentTypes
        return _.map(_.keys(EnvironmentTypeMap), (item) => {
          return {
            label: t(EnvironmentTypeMap[item] || ''),
            value: item,
            order: EnvironmentTypeOrder[item]
          };
        }).sort((a, b) => a.order - b.order);
      });

      const regionOptions = computed(() => {
        let list: any = [];
        if (formData.value.spec.type === CloudProviderType.Google) {
          list = googleCloudRegions;
        } else if (formData.value.spec.type === CloudProviderType.Azure) {
          list = [];
        } else if (formData.value.spec.type === CloudProviderType.Alibaba) {
          list = alibabaCloudRegions;
        } else if (formData.value.spec.type === CloudProviderType.AWS) {
          list = awsRegions;
        }
        return list.map((item) => {
          const label =
            locale.value === 'zh-CN'
              ? `${item.cnName}(${item.code})`
              : `${item.enName}(${item.code})`;
          return {
            label,
            zones: item.zones || [],
            value: item.code,
            icon: item.emoji
          };
        });
      });

      const zoneOptions = computed(() => {
        const selectedRegion = _.find(regionOptions.value, (item) => {
          return item.value === formData.value.spec.config.data.region?.value;
        });
        return selectedRegion?.zones || [];
      });

      const title = computed(() => {
        if (!connectorName) {
          return t('operation.connectors.title.new', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        if (connectorName && pageAction.value === PageAction.EDIT) {
          return t('operation.connectors.title.edit', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        if (connectorName && pageAction.value === PageAction.VIEW) {
          return t('operation.connectors.title.view', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        return t('operation.connectors.title.edit', {
          type: t('operation.connectors.reinstall.cloudProvider')
        });
      });

      const setProviderKeys = () => {
        if (formData.value.spec.type === CloudProviderType.Azure) {
          providerKeys.value = _.cloneDeep(AzureRMCloudProviderKeys);
        } else if (formData.value.spec.type === CloudProviderType.Google) {
          providerKeys.value = _.cloneDeep(GoogleCloudProviderKeys);
        } else {
          providerKeys.value = _.cloneDeep(CommonCloudProviderKeys);
        }
      };

      const handleAllowCreate = () => {
        allowCreate.value = !allowCreate.value;
        setTimeout(() => {
          regionSelect.value?.focus();
        }, 50);
      };
      const handleTypeChange = () => {
        setProviderKeys();

        const configData = _.reduce(
          providerKeys.value,
          (obj, item) => {
            obj[item.key] = {
              value: '',
              sensitive: item.sensitive,
              type: item.type
            };
            return obj;
          },
          {}
        );
        formData.value.spec.config.data = _.cloneDeep(configData);
      };
      const formatRegionLabel = ({ value }) => {
        const item = regionOptions.value.find((item) => item.value === value);
        return item?.label;
      };
      const handleSubmit = async () => {
        const res = await formref.value?.validate();
        if (!res) {
          try {
            submitLoading.value = true;
            copyFormData = cloneDeep(formData.value);
            if (connectorName) {
              await updateConnector({
                name: connectorName,
                namespace: formData.value.metadata.namespace,
                data: formData.value
              });
            } else {
              await createConnector({
                namespace: formData.value.metadata.namespace,
                data: formData.value
              });
            }
            router.back();
            submitLoading.value = false;
          } catch (error) {
            submitLoading.value = false;
          }
          return true;
        }
        scrollToView();

        return false;
      };
      const getConnectorInfo = async () => {
        handleTypeChange();
        copyFormData = cloneDeep(formData.value);
        if (!connectorName) return;
        try {
          const { data } = await queryItemConnector({
            name: connectorName,
            namespace: projectName
          });
          formData.value = data;
          setProviderKeys();
          copyFormData = cloneDeep(formData.value);
        } catch (error) {
          // ignore
        }
      };
      const cancelCallback = () => {
        if (
          pageAction.value === PageAction.EDIT &&
          route.params.action === PageAction.VIEW
        ) {
          pageAction.value = PageAction.VIEW;
          getConnectorInfo();
          return;
        }
        router.back();
      };
      const handleCancel = () => {
        if (!isEqual(copyFormData, formData.value)) {
          beforeLeaveCallback({
            isCancel: true,
            onOk: () => {
              copyFormData = cloneDeep(formData.value);
              cancelCallback();
            }
          });
        } else {
          cancelCallback();
        }
      };

      const credentialsValidator = (val, callback) => {
        const errors = credentialsRef.value?.validate?.();
        if (errors) {
          callback(errors[0]?.text);
        } else {
          callback();
        }
      };
      const handleRegionChange = (val, item) => {
        formData.value.spec.config.data[item.key].value = val;
        if (_.hasIn(formData.value.spec.config.data, 'zone')) {
          setTimeout(() => {
            formData.value.spec.config.data.zone.value = _.get(
              zoneOptions.value[0],
              'value'
            );
            formref.value?.validateField('spec.config.data.zone.value');
          }, 100);
        }
      };

      const renderProviderConfig = (item) => {
        if (!formData.value.spec?.config?.data[item.key]) {
          return null;
        }
        if (item.key === 'region') {
          return (
            <seal-select
              ref={regionSelect.value}
              v-model={formData.value.spec.config.data[item.key].value}
              allow-create
              allow-search
              label={t('operation.connectors.table.region')}
              required={item.required}
              popup-info={t('operation.connectors.form.region.tips')}
              style={{ width: `${InputWidth.LARGE}px` }}
              onChange={(val) => handleRegionChange(val, item)}
            >
              {_.map(regionOptions.value, (sItem, sIndex) => {
                return (
                  <a-option key={sIndex} value={sItem?.value}>
                    <span>
                      <span class="mright-5">{sItem.icon}</span>
                      {` ${sItem.label}`}
                    </span>
                  </a-option>
                );
              })}
            </seal-select>
          );
        }
        if (item.key === 'zone') {
          return (
            <seal-select
              v-model={formData.value.spec.config.data[item.key].value}
              allow-create
              allow-search
              label={t('operation.connectors.table.zones')}
              options={zoneOptions.value}
              required={item.required}
              popup-info={t('operation.connectors.form.region.tips')}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          );
        }
        if (item.key === 'credentials') {
          return (
            <AutoReadfile
              ref={(el) => {
                credentialsRef.value = el;
              }}
              v-model={formData.value.spec.config.data[item.key].value}
              label={t(item.label)}
              placeholder={t(item.label)}
              popup-info={item.description ? t(item.description) : ''}
              required={item.required}
              minWidth={InputWidth.LARGE}
              tips={t('operation.connectors.detail.jsonformat')}
              viewStatus={pageAction.value === PageAction.VIEW}
            ></AutoReadfile>
          );
        }
        if (item.options) {
          if (
            !formData.value.spec.config.data[item.key].value &&
            !connectorName
          ) {
            formData.value.spec.config.data[item.key].value = item.default;
          }
          return (
            <seal-select
              v-model={formData.value.spec.config.data[item.key].value}
              allow-create
              allow-search
              allow-clear={!item.required}
              label={t(item.label)}
              options={item.options}
              required={item.required}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          );
        }
        if (!item.sensitive) {
          return (
            <seal-input
              v-model={formData.value.spec.config.data[item.key].value}
              label={t(item.label)}
              required={item.required}
              style={{ width: `${InputWidth.LARGE}px` }}
            />
          );
        }
        return (
          <seal-input-password
            v-model={formData.value.spec.config.data[item.key].value}
            label={t(item.label)}
            popup-info={item.description ? t(item.description) : ''}
            required={item.required}
            style={{ width: `${InputWidth.LARGE}px` }}
          ></seal-input-password>
        );
      };

      const renderFooter = () => {
        if (pageAction.value === PageAction.EDIT) {
          return (
            <EditPageFooter
              v-slots={{
                save: () => {
                  return (
                    <a-button
                      type="primary"
                      class="cap-title cancel-btn"
                      loading={submitLoading.value}
                      onClick={() => handleSubmit()}
                    >
                      {t('common.button.save')}
                    </a-button>
                  );
                },
                default: () => {
                  return (
                    <a-button
                      type="outline"
                      class="cap-title cancel-btn"
                      onClick={() => handleCancel()}
                    >
                      {t('common.button.cancel')}
                    </a-button>
                  );
                }
              }}
            ></EditPageFooter>
          );
        }
        return null;
      };
      onBeforeRouteLeave(async (to, from) => {
        if (!isEqual(copyFormData, formData.value)) {
          beforeLeaveCallback({
            to,
            from,
            onOk: () => {
              copyFormData = cloneDeep(formData.value);
              router.push({
                path: to.path as string
              });
            }
          });
          return false;
        }
        return true;
      });
      expose({
        getConnectorInfo,
        handleSubmit
      });
      const init = () => {
        getConnectorInfo();
        setBreadCrumbList();
      };
      init();

      return () => (
        <div>
          <BreadWrapper>
            <Breadcrumb
              menu={
                route.params.projectName
                  ? ({ icon: 'icon-apps' } as BreadcrumbOptions)
                  : undefined
              }
              items={
                route.params.projectName
                  ? ([
                      ...breadCrumbList.value,
                      {
                        type: 'menu.operatorHub.connector',
                        label: title.value
                      }
                    ] as BreadcrumbOptions[])
                  : ([
                      {
                        ...operationRootBread,
                        label: t(operationRootBread.label)
                      },
                      {
                        label: title.value
                      }
                    ] as BreadcrumbOptions[])
              }
              onChange={(val) => handleSelectChange(val)}
            ></Breadcrumb>
          </BreadWrapper>
          <ComCard class="kuber-detail-wrap">
            <GroupTitle
              bordered={false}
              title={t('common.title.basicInfo')}
              flex-start
              show-edit={
                pageAction.value === PageAction.VIEW &&
                (route.params.projectName
                  ? userStore.hasProjectResourceActions({
                      resource: Resources.Connectors,
                      connectorID: connectorName,
                      projectID: route.params.projectName,
                      actions: [Actions.PUT]
                    })
                  : userStore.hasRolesActionsPermission({
                      resource: Resources.Connectors,
                      actions: [Actions.PUT]
                    }))
              }
              onEdit={() => handleEdit()}
            ></GroupTitle>
            <div>
              <a-form
                ref={(val) => {
                  formref.value = val;
                }}
                model={formData.value}
                auto-label-width
                label-align="left"
              >
                <a-form-item
                  label={t('operation.connectors.form.name')}
                  hide-asterisk
                  hide-label={true}
                  field="metadata.name"
                  disabled={!!connectorName}
                  validate-trigger={['change', 'input']}
                  style={{ maxWidth: `${InputWidth.LARGE}px` }}
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
                    modelValue={formData.value.metadata.name}
                    view-status={pageAction.value === PageAction.VIEW}
                    label={t('operation.connectors.form.name')}
                    required={true}
                    style={{ width: `${InputWidth.LARGE}px` }}
                    max-length={validateInputLength.NAME}
                    show-word-limit
                    onUpdate:modelValue={(val) => {
                      formData.value.metadata.name = _.trim(val);
                    }}
                  ></seal-input>
                </a-form-item>
                <a-form-item
                  label={t('operation.connectors.table.environmentType')}
                  hide-label={true}
                  hide-asterisk
                  field="spec.applicableEnvironmentType"
                  disabled={!!connectorName}
                  rules={[
                    {
                      required: true,
                      message: t('operation.connectors.rules.environmentType')
                    }
                  ]}
                >
                  <seal-select
                    v-model={formData.value.spec.applicableEnvironmentType}
                    view-status={pageAction.value === PageAction.VIEW}
                    label={t('operation.connectors.table.environmentType')}
                    required={true}
                    options={EnvironmentTypeList.value}
                    style={{ width: `${InputWidth.LARGE}px` }}
                  ></seal-select>
                </a-form-item>
                <a-form-item
                  label={t('operation.connectors.form.type')}
                  hide-asterisk
                  hide-label={true}
                  field="spec.type"
                  rules={[
                    {
                      required: true,
                      message: t('operation.connectors.type.rule')
                    }
                  ]}
                >
                  <seal-select
                    v-model={formData.value.spec.type}
                    view-status={pageAction.value === PageAction.VIEW}
                    label={t('operation.connectors.form.type')}
                    required={true}
                    style={{ width: `${InputWidth.LARGE}px` }}
                    onChange={(val) => handleTypeChange()}
                    v-slots={{
                      prefix: () => (
                        <ProviderIcon
                          provider={toLower(formData.value.spec.type)}
                        ></ProviderIcon>
                      )
                    }}
                  >
                    {_.map(cutomeTypeOptions, (item, index) => {
                      return (
                        <a-option key={index} value={item.value}>
                          <ProviderIcon
                            provider={toLower(item.value)}
                          ></ProviderIcon>
                          <span style="margin-left: 5px">{item.label}</span>
                        </a-option>
                      );
                    })}
                  </seal-select>
                </a-form-item>
                {pageAction.value === PageAction.VIEW ? (
                  <a-form-item
                    hide-label
                    label={t('operation.connectors.table.status')}
                  >
                    <SealFormItemWrap
                      label={t('operation.connectors.table.status')}
                      style={{ width: `${InputWidth.LARGE}px` }}
                    >
                      <StatusLabel
                        status={get(formData.value, 'status', {})}
                      ></StatusLabel>
                    </SealFormItemWrap>
                  </a-form-item>
                ) : null}
                {pageAction.value === PageAction.EDIT ? (
                  <>
                    {_.map(providerKeys.value, (item) => {
                      return (
                        <div
                          key={item.key}
                          style="display: inline-flex; justify-content: flex-start"
                        >
                          <a-form-item
                            label={item.label}
                            field={`spec.config.data.${item.key}.value`}
                            hide-label={pageAction.value === PageAction.EDIT}
                            hide-asterisk
                            validate-trigger={['change']}
                            rules={[
                              {
                                required: item.required,
                                message: t('common.form.rule.input', {
                                  name: t(item.label)
                                })
                              },
                              {
                                validator:
                                  item.key === 'credentials'
                                    ? credentialsValidator
                                    : null
                              }
                            ]}
                          >
                            {renderProviderConfig(item)}
                          </a-form-item>
                        </div>
                      );
                    })}
                  </>
                ) : null}
                {pageAction.value === PageAction.VIEW ? (
                  <a-form-item
                    label={t('operation.connectors.form.attribute')}
                    hide-label
                    no-style
                    hide-asterisk={true}
                  >
                    <div class="arco-form-item-label m-b-10">
                      <span>{t('operation.connectors.form.attribute')}</span>
                    </div>
                    <DescriptionTable
                      style={{ width: `${InputWidth.LARGE}px` }}
                      data-list={providerKeys.value}
                      v-slots={{
                        value: ({ row }) => (
                          <Autotip
                            tooltip-props={{
                              content: get(
                                formData.value,
                                `spec.config.data.${row.key}.value`
                              )
                            }}
                          >
                            <span>
                              {row.sensitive
                                ? '******'
                                : get(
                                    formData.value,
                                    `spec.config.data.${row.key}.value`
                                  )}
                            </span>
                          </Autotip>
                        )
                      }}
                    ></DescriptionTable>
                  </a-form-item>
                ) : null}
              </a-form>
            </div>
            {renderFooter()}
          </ComCard>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .kuber-detail-wrap {
    .label-wrap {
      display: flex;
      align-items: center;

      .text {
        margin-right: 8px;
      }
    }

    :deep(.arco-select-view-single) {
      .arco-select-view-prefix {
        padding-right: 5px;
      }
    }
  }
</style>
