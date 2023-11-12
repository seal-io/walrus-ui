<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, computed, toRefs, inject } from 'vue';
  import { InputWidth } from '@/views/config';
  import { CheckConnectorCatagory, BU } from './types';
  import { BCWidget, queryEnvironmentConnector } from './api';
  import useQueryConnector from './hooks/use-query-connector';

  export default defineComponent({
    name: 'KuberSelect',
    widgets: [
      BU.NamespaceSelect,
      BU.SecretSelect,
      BU.ConfigMapSelect,
      BU.StorageClassSelect,
      BU.AWSRegion,
      BU.AWSInstanceType
    ],
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
      // const ProjectEnvironment = inject('InjectProjectEnvironmentKey', {
      //   environmentID: '',
      //   projectID: ''
      // });
      const {
        fetchConnectors,
        connectorID,
        isProjectConnector,
        ProjectEnvironment
      } = useQueryConnector(props);
      // const connectorID = ref('');
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

      // const fetchConnectors = async () => {
      //   try {
      //     const { environmentID, projectID } = ProjectEnvironment;

      //     if (!environmentID || !projectID) return;

      //     const { data } = await queryEnvironmentConnector({
      //       environmentID,
      //       projectID
      //     });
      //     const connectorData = _.find(data.connectors, (item) => {
      //       return item.connector.type === CheckConnectorCatagory(widget.value);
      //     });
      //     connectorID.value = connectorData?.connector.id;
      //   } catch (error) {
      //     // eslint-disable-next-line no-console
      //   }
      // };

      const handlePopupVisibleChange = async (visible: boolean) => {
        if (!widget.value || dataList.value.length) return;
        if (visible) {
          try {
            loading.value = true;
            await fetchConnectors();

            const handler = _.get(BCWidget, widget.value);
            const { data } = await handler.request({
              connectorID: connectorID.value
            });
            dataList.value = handler.transform(data);
            loading.value = false;
          } catch (error) {
            loading.value = false;
            dataList.value = [];
          }
        }
      };

      return () => (
        <>
          <seal-select
            model-value={modelValue.value}
            {...attrs}
            placeholder={attrs.label}
            virtual-list-props={virtualListProps}
            style={{ width: `100%` }}
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
