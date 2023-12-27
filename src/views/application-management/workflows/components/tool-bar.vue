<script lang="tsx">
  import { PropType, defineComponent, toRefs, h, compile } from 'vue';
  import { useI18n } from 'vue-i18n';

  interface ToolItem {
    label: string;
    value: string;
    icon: string;
    disabled?: boolean;
    compile?: boolean;
  }
  export default defineComponent({
    emits: ['select'],
    props: {
      toolList: {
        type: Array as PropType<ToolItem[]>,
        default() {
          return [];
        }
      }
    },
    setup(props, { emit }) {
      const { t } = useI18n();
      const { toolList } = toRefs(props);
      const handleClickItem = (item) => {
        if (item.disabled) return;
        emit('select', item.value);
      };

      return () => (
        <a-space class="toolbar" size={10}>
          {toolList.value.map((item) => {
            return (
              <a-tooltip key={item.value} content={t(item.label)}>
                {item.compile ? (
                  h(compile(`<${item.icon} class="icon"/>`))
                ) : (
                  <span
                    class={[
                      'iconfont icon',
                      item.icon,
                      { disabled: item.disabled }
                    ]}
                    onClick={() => handleClickItem(item)}
                  ></span>
                )}
              </a-tooltip>
            );
          })}
        </a-space>
      );
    }
  });
</script>

<style lang="less" scoped>
  .toolbar {
    :deep(.arco-space-item) {
      padding: 4px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 2px;
      cursor: pointer;
    }

    .icon {
      color: var(--color-text-2);
      font-size: 16px;

      &:hover {
        color: rgb(var(--arcoblue-5));
        transform: scale(1.1);
        transition: all 0.3s var(--seal-transition-func);
      }

      &.disabled {
        color: var(--color-text-3);
        cursor: not-allowed;

        &:hover {
          transform: scale(1);
        }
      }
    }
  }
</style>
