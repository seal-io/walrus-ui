<script lang="tsx">
  import { defineComponent, computed, ref } from 'vue';
  import { RevisionWatchStatus } from '@/views/application-management/services/config';
  import StaticLogs from '../logs/static-logs.vue';
  import WatchLogs from '../logs/watch-logs.vue';

  export default defineComponent({
    name: 'RunLogs',
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
      },
      show: {
        type: Boolean,
        default: false
      },
      fullscreen: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const maxHeight = computed(() => {
        return props.fullscreen ? 'calc(100vh - 310px)' : '310px';
      });

      const renderStatusLogs = () => {
        return (
          <div>
            {props.runData?.planRecord ? (
              <StaticLogs
                maxHeight={maxHeight.value}
                record={props.runData?.planRecord}
                fullscreen={props.fullscreen}
              ></StaticLogs>
            ) : null}
            {props.runData?.record ? (
              <StaticLogs
                maxHeight={maxHeight.value}
                record={props.runData?.record}
                fullscreen={props.fullscreen}
              ></StaticLogs>
            ) : null}
          </div>
        );
      };

      return () => (
        <div class="logs-content">
          {RevisionWatchStatus.includes(
            props.runData?.status?.summaryStatus
          ) ? (
            <WatchLogs
              maxHeight={maxHeight.value}
              show={props.show}
              fullscreen={props.fullscreen}
              runData={props.runData}
            ></WatchLogs>
          ) : (
            <>{renderStatusLogs()}</>
          )}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped></style>
