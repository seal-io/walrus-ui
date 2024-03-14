<script lang="tsx">
  import { defineComponent, computed, watch, ref } from 'vue';
  import {
    RevisionStatus,
    RevisionWatchStatus
  } from '@/views/application-management/services/config';
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
      },
      isErrorStatus: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const maxHeight = computed(() => {
        if (props.isErrorStatus) {
          return props.fullscreen ? 'calc(100vh - 360px)' : '310px';
        }
        return props.fullscreen ? 'calc(100vh - 320px)' : '310px';
      });

      const runStatus = computed(() => {
        return props.runData?.status?.summaryStatus;
      });

      const renderStaticLogs = () => {
        if (props.runData?.record) {
          return (
            <StaticLogs
              maxHeight={maxHeight.value}
              record={props.runData?.record}
              fullscreen={props.fullscreen}
            ></StaticLogs>
          );
        }
        if (props.runData?.planRecord) {
          return (
            <>
              <StaticLogs
                maxHeight={maxHeight.value}
                record={props.runData?.planRecord}
                fullscreen={props.fullscreen}
              ></StaticLogs>
            </>
          );
        }
        return null;
      };

      const renderWatchLogs = () => {
        return (
          <>
            <WatchLogs
              maxHeight={maxHeight.value}
              show={props.show}
              fullscreen={props.fullscreen}
              runData={props.runData}
              key={
                runStatus.value === RevisionStatus.Running
                  ? 'running'
                  : 'planning'
              }
            ></WatchLogs>
          </>
        );
      };

      return () => (
        <div class="logs-box">
          {RevisionWatchStatus.includes(runStatus.value)
            ? renderWatchLogs()
            : renderStaticLogs()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .logs-box {
    .title {
      padding: 6px 0;
      color: var(--color-text-3);
      text-align: left;
    }
  }
</style>
