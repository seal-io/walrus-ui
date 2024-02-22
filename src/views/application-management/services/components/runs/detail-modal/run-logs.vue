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
      }
    },
    setup(props, { emit }) {
      const maxHeight = computed(() => {
        return props.fullscreen ? 'calc(100vh - 310px)' : '310px';
      });

      // watch(
      //   () => props.runData,
      //   () => {
      //     console.log('props.runData=============', props.runData);
      //   },
      //   {
      //     immediate: true,
      //     deep: true
      //   }
      // );
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
              <div class="title">
                <i class="iconfont icon-rizhi"></i> <span>Planned Logs</span>
              </div>
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
            {RevisionWatchStatus.includes(
              props.runData?.status?.summaryStatus
            ) ? (
              <>
                <div class="title">
                  <i class="iconfont icon-rizhi m-r-5"></i>
                  <span>
                    {props.runData?.status?.summaryStatus ===
                    RevisionStatus.Running
                      ? 'Running Logs'
                      : 'Planning Logs'}
                  </span>
                </div>
                <WatchLogs
                  maxHeight={maxHeight.value}
                  show={props.show}
                  fullscreen={props.fullscreen}
                  runData={props.runData}
                ></WatchLogs>
              </>
            ) : null}
          </>
        );
      };

      return () => (
        <div class="logs-box">
          {renderStaticLogs()}
          {renderWatchLogs()}
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
