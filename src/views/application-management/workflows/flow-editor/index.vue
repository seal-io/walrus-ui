<script lang="tsx">
  import { useAppStore } from '@/store';
  import { defineComponent, ref } from 'vue';
  import { useResizeObserver } from '@vueuse/core';

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
      const graphIns: any = null;
      const container = ref();
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

      return () => (
        <div class={['wrapper', { dark: appStore.theme === 'dark' }]}>
          <a-spin style="width: 100%" loading={props.loading}>
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
                style="width: 100%; height: 100%"
                class="content-container"
              ></div>
            </div>
          </a-spin>
        </div>
      );
    }
  });
</script>

<style scoped></style>
