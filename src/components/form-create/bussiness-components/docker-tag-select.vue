<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, computed, toRefs, watch } from 'vue';
  import { InputWidth } from '@/views/config';
  import sealFormItemWrap from '@/components/seal-form/components/seal-form-item-wrap.vue';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import { BU } from './types';
  import { BCWidget } from './api';

  export default defineComponent({
    name: 'DockerTagSelect',
    widgets: [BU.ImageTagSelect],
    props: {
      modelValue: {
        type: [String],
        default() {
          return '';
        }
      },
      widget: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue', 'change', 'inputValueChange', 'search'],
    setup(props, { attrs, emit }) {
      const { modelValue, widget } = toRefs(props);
      const loading = ref(false);
      const dataList = ref<{ label: string; value: string }[]>([]);
      const query = ref('');
      const tag = ref('');
      let axiosToken: any = null;
      let timer: any = null;

      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const initQuery = () => {
        const list = _.split(modelValue.value, ':');
        [query.value, tag.value] = list;
      };
      const fetchImage = async (params) => {
        try {
          axiosToken?.cancel();
          axiosToken = createAxiosToken();
          loading.value = true;
          const handler = _.get(BCWidget, widget.value);
          const { data } = await handler.request(params, axiosToken.token);
          dataList.value = handler.transform(data);
          loading.value = false;
        } catch (error) {
          loading.value = false;
          dataList.value = [];
        }
      };

      const handleSearch = (val) => {
        const list = _.split(val, '/');
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetchImage({
            user: list[0],
            repository: list[1]
          });
        }, 100);
      };

      const handlePopupVisibleChange = async (visible: boolean) => {
        if (dataList.value.length) return;
        if (visible) {
          const val = _.split(query.value, '/');
          fetchImage({
            user: val[0],
            repository: val[1]
          });
        }
      };
      watch(
        () => modelValue.value,
        (val) => {
          initQuery();
        },
        { immediate: true }
      );
      return () => (
        <>
          <div class="group-wrap seal-border-focus bordered">
            <seal-input
              class="input"
              v-model={[query.value, ['trim']]}
              placeholder={'用户名/镜像名'}
              style="width: 180px"
              allow-clear
              allow-search
              onChange={handleSearch}
            ></seal-input>
            <seal-select
              v-model={tag.value}
              {...attrs}
              label={'镜像标签'}
              virtual-list-props={virtualListProps}
              style={{ flex: 1 }}
              options={dataList.value}
              allow-search={true}
              loading={loading.value}
              bordered={false}
              onInputValueChange={(value: any) => {
                emit('inputValueChange', value);
              }}
              onPopupVisibleChange={(visible) =>
                handlePopupVisibleChange(visible)
              }
              onChange={(value: any) => {
                emit('change', `${query.value}:${tag.value}`);
                emit('update:modelValue', `${query.value}:${tag.value}`);
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
