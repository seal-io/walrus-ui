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
  import { createConnector, updateConnector, queryItemConnector } from '../api';
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
      const id = route.query.id as string;
      const formref = ref();
      const submitLoading = ref(false);
      const allowCreate = ref(false);
      const regionSelect = ref();
      const providerKeys = ref<ProviderKey[]>([]);
      let copyFormData: any = {};

      const formData = ref<any>({
        name: '',
        configData: {
          access_key: {
            value: '',
            visible: true,
            type: 'string'
          },
          secret_key: {
            value: '',
            visible: false,
            type: 'string'
          },
          region: {
            value: '',
            visible: true,
            type: 'string'
          }
        },
        description: '',
        configVersion: 'v1',
        applicableEnvironmentType: '',
        type: CloudProviderType.Alibaba,
        category: ConnectorCategory.CloudProvider,
        enableFinOps: false
      });

      const EnvironmentTypeList = computed(() => {
        return _.map(userStore.applicableEnvironmentTypes, (item) => {
          return {
            label: t(EnvironmentTypeMap[item] || ''),
            value: item,
            order: EnvironmentTypeOrder[item]
          };
        }).sort((a, b) => a.order - b.order);
      });

      const regionOptions = computed(() => {
        let list: any = [];
        if (formData.value.type === CloudProviderType.Google) {
          list = googleCloudRegions;
        } else if (formData.value.type === CloudProviderType.AzureRM) {
          list = [];
        } else if (formData.value.type === CloudProviderType.Alibaba) {
          list = alibabaCloudRegions;
        } else if (formData.value.type === CloudProviderType.AWS) {
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
          return item.value === formData.value.configData?.region?.value;
        });
        console.log('selectedRegion===', selectedRegion);
        return selectedRegion?.zones || [];
      });

      const title = computed(() => {
        if (!id) {
          return t('operation.connectors.title.new', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        if (id && pageAction.value === PageAction.EDIT) {
          return t('operation.connectors.title.edit', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        if (id && pageAction.value === PageAction.VIEW) {
          return t('operation.connectors.title.view', {
            type: t('operation.connectors.reinstall.cloudProvider')
          });
        }
        return t('operation.connectors.title.edit', {
          type: t('operation.connectors.reinstall.cloudProvider')
        });
      });

      const setProviderKeys = () => {
        if (formData.value.type === CloudProviderType.AzureRM) {
          providerKeys.value = _.cloneDeep(AzureRMCloudProviderKeys);
        } else if (formData.value.type === CloudProviderType.Google) {
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
              visible: item.visible,
              type: item.type
            };
            return obj;
          },
          {}
        );
        formData.value.configData = configData;
      };
      const formatRegionLabel = ({ value }) => {
        const item = regionOptions.value.find((item) => item.value === value);
        return item?.label;
      };
      const handleSubmit = async () => {
        const res = await formref.value?.validate();
        console.log('res===', res, formref.value, formData.value);
        if (!res) {
          try {
            submitLoading.value = true;
            copyFormData = cloneDeep(formData.value);
            if (id) {
              await updateConnector(formData.value);
            } else {
              await createConnector(formData.value);
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
        if (!id) return;
        try {
          const { data } = await queryItemConnector({ id });
          formData.value = data;
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

      const handleRegionChange = (val, item) => {
        setTimeout(() => {
          if (_.hasIn(formData.value.configData, 'zone')) {
            formData.value.configData.zone.value = _.get(
              zoneOptions.value[0],
              'value'
            );
          }
        }, 100);
      };

      const renderProviderConfig = (item) => {
        if (item.key === 'region') {
          return (
            <seal-select
              ref={regionSelect.value}
              v-model={formData.value.configData[item.key].value}
              allow-create
              allow-search
              label={t('operation.connectors.table.region')}
              required={true}
              popup-info={t('operation.connectors.form.region.tips')}
              style={{ width: `${InputWidth.LARGE}px` }}
              onChange={(val) => handleRegionChange(val, item)}
            >
              {_.map(regionOptions.value, (sItem, sIndex) => {
                return (
                  <a-option key={sIndex} value={sItem.value}>
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
              v-model={formData.value.configData[item.key].value}
              allow-create
              allow-search
              label={t('operation.connectors.table.zones')}
              options={zoneOptions.value}
              required={true}
              popup-info={t('operation.connectors.form.region.tips')}
              style={{ width: `${InputWidth.LARGE}px` }}
            ></seal-select>
          );
        }
        if (item.visible) {
          return (
            <seal-input
              v-model={formData.value.configData[item.key].value}
              label={t(item.label)}
              required={true}
              style={{ width: `${InputWidth.LARGE}px` }}
            />
          );
        }
        return (
          <seal-input-password
            v-model={formData.value.configData[item.key].value}
            label={t(item.label)}
            required={true}
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
                route.params.projectId
                  ? ({ icon: 'icon-apps' } as BreadcrumbOptions)
                  : undefined
              }
              items={
                route.params.projectId
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
                (route.params.projectId
                  ? userStore.hasProjectResourceActions({
                      resource: Resources.Connectors,
                      connectorID: id,
                      projectID: route.params.projectId,
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
                  field="name"
                  disabled={!!id}
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
                    modelValue={formData.value.name}
                    view-status={pageAction.value === PageAction.VIEW}
                    label={t('operation.connectors.form.name')}
                    required={true}
                    style={{ width: `${InputWidth.LARGE}px` }}
                    max-length={validateInputLength.NAME}
                    show-word-limit
                    onUpdate:modelValue={(val) => {
                      formData.value.name = _.trim(val);
                    }}
                  ></seal-input>
                </a-form-item>
                <a-form-item
                  label={t('operation.connectors.table.environmentType')}
                  hide-label={true}
                  hide-asterisk
                  field="applicableEnvironmentType"
                  disabled={!!id}
                  rules={[
                    {
                      required: true,
                      message: t('operation.connectors.rules.environmentType')
                    }
                  ]}
                >
                  <seal-select
                    v-model={formData.value.applicableEnvironmentType}
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
                  field="type"
                  rules={[
                    {
                      required: true,
                      message: t('operation.connectors.type.rule')
                    }
                  ]}
                >
                  <seal-select
                    v-model={formData.value.type}
                    view-status={pageAction.value === PageAction.VIEW}
                    label={t('operation.connectors.form.type')}
                    required={true}
                    style={{ width: `${InputWidth.LARGE}px` }}
                    onChange={(val) => handleTypeChange()}
                    v-slots={{
                      prefix: () => (
                        <ProviderIcon
                          provider={toLower(formData.value.type)}
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
                        status={{
                          status:
                            get(formData.value, 'status.summaryStatus') || '',
                          text: get(formData.value, 'status.summaryStatus'),
                          message:
                            get(
                              formData.value,
                              'status.summaryStatusMessage'
                            ) || '',
                          transitioning: get(
                            formData.value,
                            'status.transitioning'
                          ),
                          error: get(formData.value, 'status.error')
                        }}
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
                            field={`configData.${item.key}.value`}
                            hide-label={pageAction.value === PageAction.EDIT}
                            hide-asterisk
                            validate-trigger={['change']}
                            rules={[
                              {
                                required: true,
                                message: t('common.form.rule.input', {
                                  name: item.label
                                })
                              }
                            ]}
                          >
                            <div>{renderProviderConfig(item)}</div>
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
                                `configData.${row.key}.value`
                              )
                            }}
                          >
                            <span>
                              {!row.visible
                                ? '******'
                                : get(
                                    formData.value,
                                    `configData.${row.key}.value`
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
