<script lang="tsx">
  import '@antv/x6-vue-shape';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useAppStore } from '@/store';
  import { useResizeObserver } from '@vueuse/core';
  import createGraph from './core/graph';

  export default defineComponent({
    props: {
      containerHeight: {
        type: String,
        default: '100%'
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      let graphIns: any = null;
      const container = ref();
      const stencilContainer = ref();
      const graphWrapper = ref();
      const appStore = useAppStore();
      const width = ref(0);
      const height = ref(0);

      useResizeObserver(graphWrapper, (entries) => {
        const entry = entries[0];
        const { width: boxWidth, height: boxHeight } = entry.contentRect;
        width.value = boxWidth;
        height.value = boxHeight < 600 ? 600 : boxHeight;
        if (boxHeight < 600) {
          graphWrapper.value.style.height = '600px';
        }
        if (!width.value || !height.value) return;
        graphIns?.resize(width.value, height.value);
      });

      const init = () => {
        // register custom node

        // register custom edge

        graphIns = createGraph({
          container,
          width: width.value,
          height: height.value,
          stencilContainer
        });

        // event
      };

      onMounted(() => {
        init();
      });
      return () => (
        <div class={['wrapper', { dark: appStore.theme === 'dark' }]}>
          <a-spin
            style={{ width: '100%' }}
            loading={props.loading}
            class="spin"
          >
            <div
              class="stencil"
              ref={(el) => {
                stencilContainer.value = el;
              }}
            ></div>
            <div
              ref={(el) => {
                graphWrapper.value = el;
              }}
              class="graphWrapper"
              style={{
                height: `max(${props.containerHeight},600px)`,
                width: '100%'
              }}
            >
              <div
                ref={(el) => {
                  container.value = el;
                }}
                style={{ width: '100%', height: '100%' }}
                class="content-container"
              ></div>
            </div>
          </a-spin>
        </div>
      );
    }
  });
</script>

<style scoped lang="less">
  .spin {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-left: 220px;

    .stencil {
      position: absolute;
      top: 0;
      left: 20px;
      width: 200px;
      height: 100%;
      overflow-y: auto;
      background-color: var(--color-fill-2);
    }
  }
</style>
