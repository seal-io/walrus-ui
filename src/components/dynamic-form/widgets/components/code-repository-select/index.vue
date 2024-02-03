<script lang="tsx">
  import _ from 'lodash';
  import {
    defineComponent,
    ref,
    computed,
    toRefs,
    watch,
    inject,
    onMounted
  } from 'vue';
  import i18n from '@/locale';
  import {
    InputWidth,
    InjectSchemaFormStatusKey,
    PageAction
  } from '@/views/config';
  import {
    parentObjectExsits,
    genObjectFieldProperties,
    getCustomColSpan
  } from '@/components/dynamic-form/utils';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import schemaFieldProps from '@/components/dynamic-form/fields/schema-field-props';
  import { FieldSchema } from '@/components/dynamic-form/interface';
  import SealViewItemWrap from '@/components/seal-form/components/seal-view-item-wrap.vue';
  import useQueryConnector from '../../hooks/use-query-connector';
  import { BU } from '../../types';
  import { BCWidget } from '../../api';

  export default defineComponent({
    name: 'CodeRepositorySelect',
    props: {
      ...schemaFieldProps,
      modelValue: {
        type: [String],
        default() {
          return '';
        }
      },
      repository: {
        type: String,
        default() {
          return '';
        }
      },
      branch: {
        type: String,
        default() {
          return '';
        }
      },
      widget: {
        type: String,
        default: ''
      }
    },
    emits: [
      'update:modelValue',
      'change',
      'inputValueChange',
      'search',
      'change'
    ],
    widgets: [BU.CodeRepositorySelect],
    setup(props, { attrs, emit }) {
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );
      const {
        fetchConnectors,
        connectorID,
        isProjectConnector,
        ProjectEnvironment
      } = useQueryConnector(props);
      const childProperties = ref<FieldSchema[]>([]);
      const { widget } = toRefs(props);
      const loading = ref(false);
      const loadingBranch = ref(false);
      const dataList = ref<{ label: string; value: string }[]>([]);
      const branchList = ref<{ label: string; value: string }[]>([]);

      let axiosToken: any = null;
      let branchAxiosToken: any = null;
      let timer: any = null;

      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const repository = computed(() => {
        return _.get(props.uiFormData, [...props.fieldPath, 'url'], '');
      });

      const branch = computed(() => {
        return _.get(props.uiFormData, [...props.fieldPath, 'branch'], '');
      });

      const handleChange = (data) => {
        emit('change', data);
      };
      const getRepos = async (query) => {
        try {
          axiosToken?.cancel();
          axiosToken = createAxiosToken();
          loading.value = true;
          const params = {
            connectorID: connectorID.value,
            projectID: ProjectEnvironment.value.projectID,
            isProjectConnector: isProjectConnector.value,
            query
          };
          const handler = _.get(BCWidget, widget.value);
          const { data } = await handler.request(params, axiosToken.token);
          dataList.value = handler.transform(data);
          loading.value = false;
        } catch (error) {
          loading.value = false;
          dataList.value = [];
        }
      };

      const getBranches = async () => {
        try {
          branchAxiosToken?.cancel();
          branchAxiosToken = createAxiosToken();
          loadingBranch.value = true;
          const params = {
            connectorID: connectorID.value,
            projectID: ProjectEnvironment.value.projectID,
            isProjectConnector: isProjectConnector.value,
            repository: repository.value
          };
          const handler = _.get(BCWidget, widget.value);
          const data = await handler.queryBranches(
            params,
            branchAxiosToken.token
          );
          branchList.value = data;
          loadingBranch.value = false;
        } catch (error) {
          loadingBranch.value = false;
          branchList.value = [];
        }
      };

      const handleSearch = (val) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          getRepos(val);
        }, 100);
      };

      const handlePopupVisibleChange = async (visible: boolean) => {
        if (branchList.value.length || !branch.value) return;
        if (visible) {
          getBranches();
        }
      };
      const handleRepoPopupVisibleChange = async (visible: boolean) => {
        if (dataList.value.length || !repository.value) return;
        if (visible) {
          getRepos(repository.value);
        }
      };

      const handleRepoChange = () => {
        setTimeout(() => {
          getBranches();
        }, 100);
      };
      childProperties.value = genObjectFieldProperties({
        defaultFormData: props.defaultFormData,
        uiFormData: props.uiFormData,
        schema: props.schema,
        fieldPath: props.fieldPath,
        parentSpan: getCustomColSpan(props.schema) || props.schema.colSpan,
        level: props.level + 1
      });
      onMounted(async () => {
        await fetchConnectors();
      });
      const renderURLWidget = (item: FieldSchema) => {
        return (
          <>
            {schemaFormStatus.value !== PageAction.VIEW ? (
              <seal-select
                modelValue={repository.value}
                {...attrs}
                style={{ width: '100%' }}
                label={item.title || item.name}
                virtual-list-props={virtualListProps}
                options={dataList.value}
                allow-search={true}
                loading={loading.value}
                bordered={true}
                allow-create={true}
                onPopupVisibleChange={(visible) =>
                  handleRepoPopupVisibleChange(visible)
                }
                onSearch={(value: string) => {
                  handleSearch(value);
                }}
                onChange={(val) => {
                  _.set(props.formData, [...props.fieldPath, item.name], val);
                  _.set(props.uiFormData, [...props.fieldPath, item.name], val);
                  handleChange(props.formData);
                  handleRepoChange();
                }}
              ></seal-select>
            ) : (
              <SealViewItemWrap
                label={item.title || item.name}
                style="width: 100%"
              >
                {_.get(props.uiFormData, [...props.fieldPath, item.name])}
              </SealViewItemWrap>
            )}
          </>
        );
      };

      const renderBranchWidget = (item: FieldSchema) => {
        return (
          <>
            {schemaFormStatus.value !== PageAction.VIEW ? (
              <seal-select
                modelValue={branch.value}
                {...attrs}
                label={item.title || item.name}
                style={{ width: '100%' }}
                virtual-list-props={virtualListProps}
                options={branchList.value}
                allow-search={true}
                allow-create={true}
                loading={loadingBranch.value}
                bordered={true}
                onPopupVisibleChange={(visible) =>
                  handlePopupVisibleChange(visible)
                }
                onChange={(val: any) => {
                  _.set(props.formData, [...props.fieldPath, item.name], val);
                  _.set(props.uiFormData, [...props.fieldPath, item.name], val);
                  handleChange(props.formData);
                }}
              ></seal-select>
            ) : (
              <SealViewItemWrap
                label={item.title || item.name}
                style="width: 100%"
              >
                {_.get(props.uiFormData, [...props.fieldPath, item.name])}
              </SealViewItemWrap>
            )}
          </>
        );
      };
      return () => (
        <a-form-item
          hide-label={true}
          rules={[
            {
              validator: (value, callback) => {
                if (
                  !parentObjectExsits(props.formData, props.fieldPath) ||
                  !props.required
                ) {
                  callback();
                  return;
                }
                if (!value && value !== 0) {
                  callback(
                    `${i18n.global.t('common.form.rule.input', {
                      name: props.schema.title || props.schema.name
                    })}`
                  );
                } else {
                  callback();
                }
              }
            }
          ]}
          label={props.schema.title || props.schema.name}
          field={_.join(props.fieldPath, '.')}
          validate-trigger={['change']}
        >
          <a-grid cols={12} col-gap={18} style="width: 100%">
            {_.map(childProperties.value, (item, index) => {
              return (
                <a-grid-item
                  span={{ lg: item.colSpan, md: 12, sm: 12, xs: 12 }}
                >
                  {item.name === 'url'
                    ? renderURLWidget(item)
                    : renderBranchWidget(item)}
                </a-grid-item>
              );
            })}
          </a-grid>
        </a-form-item>
      );
    }
  });
</script>

<style lang="less" scoped>
  .group-wrap {
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    :deep(.seal-relative.wrapper) {
      border: none;
      border-radius: 0;

      &.input {
        border-right: 1px solid var(--color-border-2);
      }

      .arco-input-wrapper:not(.arco-input-disabled) {
        border: none;
      }
    }

    :deep(.arco-input-wrapper) {
      border: none;
      border-right: 1px solid var(--color-border-2);
      border-radius: 0;

      &:focus {
        border: none;
      }

      &.arco-input-focus:hover {
        border: none;
      }
    }
  }
</style>
