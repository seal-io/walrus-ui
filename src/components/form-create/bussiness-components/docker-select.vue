<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, computed, toRefs } from 'vue';
  import { InputWidth } from '@/views/config';
  import { createAxiosToken } from '@/api/axios-chunk-request';
  import { BU } from './types';
  import { BCWidget } from './api';

  export default defineComponent({
    name: 'DockerSelect',
    widgetType: 'select',
    widgets: [BU.ImageSelect],
    props: {
      modelValue: {
        type: [String, Number, Array],
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

      const handlePopupVisibleChange = async (visible: boolean) => {};

      const fetchImage = async (val) => {
        try {
          axiosToken?.cancel();
          axiosToken = createAxiosToken();
          loading.value = true;
          const handler = _.get(BCWidget, widget.value);
          const { data } = await handler.request({ q: val }, axiosToken.token);
          dataList.value = handler.transform(data);
          loading.value = false;
        } catch (error) {
          loading.value = false;
          dataList.value = [];
        }
      };

      const handleSearch = (val) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fetchImage(val);
        }, 100);
      };

      return () => (
        <>
          <seal-select
            model-value={modelValue.value}
            {...attrs}
            placeholder={attrs.label}
            virtual-list-props={virtualListProps}
            style={{ width: `${InputWidth.LARGE}px` }}
            options={dataList.value}
            allow-search={true}
            loading={loading.value}
            onSearch={(value: string) => {
              handleSearch(value);
            }}
            onInputValueChange={(value: any) => {
              emit('inputValueChange', value);
            }}
            onPopupVisibleChange={(visible) =>
              handlePopupVisibleChange(visible)
            }
            onChange={(value: any) => {
              emit('change', value);
              emit('update:modelValue', value);
            }}
          ></seal-select>
        </>
      );
    }
  });
</script>
