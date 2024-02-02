<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, toRef } from 'vue';
  import useBasicInfoData from '@/views/application-management/projects/hooks/use-basicInfo-data';
  import StatusLabel from '@/views/operation-hub/connectors/components/status-label.vue';
  import BasicInfo from '../basic-info.vue';
  import { runBasicConfig } from '../../config';

  export default defineComponent({
    props: {
      dataInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      layout: {
        type: String,
        default: 'horizontal'
      }
    },
    setup(props, { slots }) {
      const info = toRef(props, 'dataInfo');
      const basicDataList = useBasicInfoData(runBasicConfig, info);

      const renderStatus = () => {
        const item = info.value;
        return (
          <>
            <StatusLabel
              zoom={0.9}
              status={{
                status: _.get(item, 'status.summaryStatus') || '',
                inactive: _.get(item, 'status.inactive'),
                text: _.get(item, 'status.summaryStatus'),
                message: _.get(item, 'status.summaryStatusMessage') || '',
                transitioning: _.get(item, 'status.transitioning'),
                error: _.get(item, 'status.error')
              }}
            ></StatusLabel>
          </>
        );
      };
      return () => (
        <div class="wrap">
          <div class="title">
            <span>resouce-name</span>
            <span class="status">{renderStatus()}</span>
          </div>
          <BasicInfo
            class="basic-info"
            data-info={basicDataList.value}
            cols={2}
            layout={props.layout}
            v-slots={{
              value: slots.value
                ? (data) => {
                    return slots.value?.(data);
                  }
                : null
            }}
          ></BasicInfo>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .wrap {
    display: flex;
    padding: 10px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      display: flex;
      flex-basis: 160px;
      flex-direction: column;
      align-items: flex-start;
      margin-right: 20px;

      .status {
        margin-top: 10px;
      }
    }

    .basic-info {
      flex: 1;
    }

    :deep(.arco-descriptions-row) {
      .arco-descriptions-item,
      .arco-descriptions-item-label,
      .arco-descriptions-item-value {
        line-height: 2;
      }
    }
  }
</style>
