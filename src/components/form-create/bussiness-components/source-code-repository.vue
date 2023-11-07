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
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import sealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import useQueryConnector from './hooks/use-query-connector';
  import { BU } from './types';
  import { BCWidget } from './api';

  export default defineComponent({
    name: 'SourceCodeRepository',
    widgets: [BU.GitHubRepository],
    props: {
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
      'update:branch',
      'update:repository'
    ],
    setup(props, { attrs, emit }) {
      const {
        fetchConnectors,
        connectorID,
        isProjectConnector,
        ProjectEnvironment
      } = useQueryConnector(props);
      const { modelValue, widget, repository, branch } = toRefs(props);
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

      const getRepos = async (query) => {
        try {
          axiosToken?.cancel();
          axiosToken = createAxiosToken();
          loading.value = true;
          const params = {
            connectorID: connectorID.value,
            projectID: ProjectEnvironment.projectID,
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
            projectID: ProjectEnvironment.projectID,
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
        if (dataList.value.length) return;
        if (visible) {
          getRepos(repository.value);
        }
      };

      const handleRepoChange = (value) => {
        emit('update:repository', value);
        emit('update:branch', '');
        setTimeout(() => {
          getBranches();
        }, 100);
      };
      onMounted(async () => {
        await fetchConnectors();
      });
      return () => (
        <>
          <div class="group-wrap seal-border-focus bordered">
            <seal-select
              v-model={repository.value}
              {...attrs}
              label={'项目'}
              virtual-list-props={virtualListProps}
              style={{ flex: 1 }}
              options={dataList.value}
              allow-search={true}
              loading={loading.value}
              bordered={false}
              allow-create={true}
              onPopupVisibleChange={(visible) =>
                handleRepoPopupVisibleChange(visible)
              }
              onSearch={(value: string) => {
                handleSearch(value);
              }}
              onChange={handleRepoChange}
            ></seal-select>
            <seal-select
              v-model={branch.value}
              {...attrs}
              label={'分支'}
              virtual-list-props={virtualListProps}
              style={{ flex: 1 }}
              options={branchList.value}
              allow-search={true}
              allow-create={true}
              loading={loadingBranch.value}
              bordered={false}
              onPopupVisibleChange={(visible) =>
                handlePopupVisibleChange(visible)
              }
              onChange={(value: any) => {
                branch.value = value;
                emit('update:branch', value);
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
