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
  import { InputWidth } from '@/views/config';
  import sealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import useQueryConnector from './hooks/use-query-connector';
  import { BCWidget } from './api';
  import { BU } from './types';

  export default defineComponent({
    name: 'KuberSelectByNamespace',
    widgets: [
      BU.SecretSelectByNamespace,
      BU.ConfigMapSelectByNamespace,
      BU.StorageClassSelectByNamespace
    ],
    props: {
      modelValue: {
        type: [String],
        default() {
          return '';
        }
      },
      namespace: {
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
    emits: ['update:modelValue', 'change'],
    setup(props, { attrs, emit }) {
      const {
        fetchConnectors,
        connectorID,
        isProjectConnector,
        ProjectEnvironment
      } = useQueryConnector(props);

      const { modelValue, widget, namespace } = toRefs(props);
      const loading = ref(false);
      const extraLoading = ref(false);
      const dataList = ref<{ label: string; value: string }[]>([]);
      const namespaceList = ref<{ label: string; value: string }[]>([]);
      const currentValue = ref('');
      let axiosToken: any = null;
      let extraAxiosToken: any = null;

      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const virtualNamespaceListProps = computed(() => {
        if (namespaceList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const getDataList = async () => {
        try {
          axiosToken?.cancel();
          axiosToken = createAxiosToken();
          loading.value = true;
          const params = {
            connectorID: connectorID.value,
            namespace: currentValue.value
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

      const getNamespaceList = async () => {
        try {
          extraAxiosToken?.cancel();
          extraAxiosToken = createAxiosToken();
          extraLoading.value = true;
          const params = {
            connectorID: connectorID.value
          };
          const handler = _.get(BCWidget, BU.NamespaceSelect);
          const { data } = await handler.request(params, extraAxiosToken.token);
          namespaceList.value = handler.transform(data);
          console.log('namespaceList', namespaceList.value);
          extraLoading.value = false;
        } catch (error) {
          extraLoading.value = false;
          namespaceList.value = [];
        }
      };

      const handlePopupVisibleChange = async (visible: boolean) => {
        if (dataList.value.length || !namespace.value) return;
        if (visible) {
          getDataList();
        }
      };
      const handleNamespacePopupVisibleChange = async (visible: boolean) => {
        if (namespaceList.value.length) return;
        if (visible) {
          getNamespaceList();
        }
      };

      const handleNamespaceChange = (value) => {
        emit('update:modelValue', '');

        setTimeout(() => {
          getDataList();
        }, 100);
      };

      const init = async () => {
        await fetchConnectors();
      };
      onMounted(async () => {
        await init();
      });

      watch(
        () => namespace.value,
        () => {
          currentValue.value = namespace.value;
        },
        {
          immediate: true
        }
      );
      return () => (
        <>
          <div class="group-wrap seal-border-focus bordered">
            <seal-select
              v-model={currentValue.value}
              {...attrs}
              label={'nameSpace'}
              virtual-list-props={virtualNamespaceListProps}
              style={{ flex: 1 }}
              options={namespaceList.value}
              allow-search={true}
              loading={extraLoading.value}
              bordered={false}
              onPopupVisibleChange={(visible) =>
                handleNamespacePopupVisibleChange(visible)
              }
              onChange={handleNamespaceChange}
            ></seal-select>
            <seal-select
              model-value={modelValue.value}
              {...attrs}
              label={widget.value}
              virtual-list-props={virtualListProps}
              style={{ flex: 1 }}
              options={dataList.value}
              allow-search={true}
              loading={loading.value}
              bordered={false}
              onPopupVisibleChange={(visible) =>
                handlePopupVisibleChange(visible)
              }
              onChange={(value: any) => {
                emit('change', value);
                emit('update:modelValue', value);
              }}
            ></seal-select>
          </div>
        </>
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
