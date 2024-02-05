<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, toRef } from 'vue';
  import { StatusColor } from '@/views/config';
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
    emits: ['apply', 'cancel'],
    setup(props, { slots, emit }) {
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

      const renderChanges = ({ data, value }) => {
        return (
          <div class="data">
            <span class="add" style={{ color: StatusColor.success.color5 }}>
              <icon-plus /> 8
            </span>
            <span class="update" style={{ color: StatusColor.warning.color5 }}>
              <i class={['icon-wave-sine iconfont']}></i> 10
            </span>
            <span class="delete" style={{ color: StatusColor.error.color5 }}>
              <icon-minus /> 2
            </span>
          </div>
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
              value: ({ data, value }) => {
                if (data.key === 'changes') {
                  return renderChanges({ data, value });
                }
                return value;
              }
            }}
          ></BasicInfo>
          <a-space direction="vertical" size={20}>
            <a-button
              status="success"
              type="primary"
              style={{ width: '95px' }}
              onClick={() => {
                emit('apply', true);
              }}
            >
              <i class={['iconfont icon-sendfasong m-r-5']}></i>
              <span>{i18n.global.t('common.button.apply')}</span>
            </a-button>
            <a-button
              type="outline"
              style={{ width: '95px' }}
              onClick={() => {
                emit('apply', false);
              }}
            >
              <icon-stop class="m-r-5" />
              <span>{i18n.global.t('common.button.cancel')}</span>
            </a-button>
          </a-space>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .data {
    display: flex;
    align-items: center;

    .add,
    .update,
    .delete {
      margin-right: 10px;
    }
  }

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
