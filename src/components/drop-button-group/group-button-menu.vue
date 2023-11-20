<script lang="tsx">
  import { defineComponent, PropType, toRefs, h, compile } from 'vue';
  import { MoreAction } from '@/views/config/interface';
  import _ from 'lodash';
  import i18n from '@/locale';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';

  export default defineComponent({
    emits: ['select', 'click'],
    props: {
      actions: {
        type: Array as PropType<MoreAction[]>,
        default() {
          return [];
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const { actions, loading } = toRefs(props);
      const { t } = i18n.global;

      const handleClick = (data) => {
        emit('select', data.value);
      };
      const handleSelect = (val) => {
        emit('select', val);
      };
      return () => (
        <div class="group-button-menu">
          <ADropdownButton
            style="border-radius: var(--border-radius-small); overflow: hidden"
            onSelect={(val) => handleSelect(val)}
            v-slots={{
              default: () => {
                return (
                  <a-button
                    loading={loading.value}
                    type="primary"
                    onClick={() => handleClick(_.head(actions.value))}
                  >
                    {t(_.get(_.head(actions.value), 'label') || '')}
                  </a-button>
                );
              },
              icon: () => {
                return (
                  <a-button
                    type="primary"
                    style="padding:10px"
                    disabled={loading.value}
                  >
                    <icon-down />
                  </a-button>
                );
              },
              content: () => {
                return (
                  <>
                    {_.map(_.tail(actions.value), (item) => {
                      return (
                        <a-doption
                          key={item.value}
                          value={item.value}
                          disabled={!!item.disabled || loading.value}
                          loading={loading.value}
                        >
                          <a-link
                            type="text"
                            size="small"
                            disabled={!!item.disabled || loading.value}
                            status={item.status}
                          >
                            <span class="flex flex-align-center">
                              <span>
                                {item.iconfont ? (
                                  <i
                                    class={[item.icon, 'iconfont size-14']}
                                    style={{ ...item.style }}
                                  ></i>
                                ) : (
                                  h(compile(`<${item.icon}/>`), {
                                    ...item.props,
                                    style: {
                                      ...item.style
                                    },
                                    class: ['size-14']
                                  })
                                )}
                              </span>
                              <span class="mleft-5">{t(item.label)}</span>
                            </span>
                          </a-link>
                        </a-doption>
                      );
                    })}
                  </>
                );
              }
            }}
          ></ADropdownButton>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .group-button-menu {
    :deep(.arco-btn-group) {
      .arco-btn-secondary:first-child {
        padding: 0;
      }
    }
  }
</style>
