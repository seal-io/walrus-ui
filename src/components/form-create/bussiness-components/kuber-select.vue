<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, computed, toRefs, inject } from 'vue';
  import { InputWidth } from '@/views/config';
  import { CheckConnectorCatagory } from './types';
  import { BCWidget, queryKuberEnvironmentConnector } from './api';

  export default defineComponent({
    name: 'BuSelect',
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
    emits: ['update:modelValue', 'change', 'inputValueChange'],
    setup(props, { attrs, emit }) {
      const KuberEnvironment = inject('KuberEnvironment', {
        environmentID: '',
        projectID: ''
      });
      console.log('environmentID----------', KuberEnvironment);
      const connectorID = ref('');
      const { modelValue, widget } = toRefs(props);
      const loading = ref(false);
      const dataList = ref<{ label: string; value: string }[]>([]);
      const virtualListProps = computed(() => {
        if (dataList.value.length > 20) {
          return {
            height: 200
          };
        }
        return undefined;
      });

      const fetchConnectors = async () => {
        const { environmentID, projectID } = KuberEnvironment;

        if (!environmentID || !projectID) return;
        const { data } = await queryKuberEnvironmentConnector({
          environmentID,
          projectID
        });
        const connectorData = _.find(data.connectors, (item) => {
          return item.connector.type === CheckConnectorCatagory(widget.value);
        });
        connectorID.value = connectorData?.connector.id;
      };

      const handlePopupVisibleChange = async (visible: boolean) => {
        if (!widget.value || dataList.value.length) return;
        if (visible) {
          await fetchConnectors();

          const handler = _.get(BCWidget, widget.value);
          const { data } = await handler.request({
            connectorID: connectorID.value
          });
          dataList.value = handler.transform(data);
        }
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
