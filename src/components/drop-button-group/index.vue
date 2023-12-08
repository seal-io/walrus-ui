<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import {
    defineComponent,
    PropType,
    toRefs,
    h,
    compile,
    Component,
    ref
  } from 'vue';
  import ADropdownButton from '@arco-design/web-vue/es/dropdown/dropdown-button';
  import { MoreAction } from '@/views/config/interface';
  import ButtonList from './button-list.vue';

  export default defineComponent({
    emits: ['click', 'select'],
    props: {
      actions: {
        type: Array as PropType<MoreAction[]>,
        default() {
          return [];
        }
      },
      layout: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default() {
          return 'vertical';
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit, slots }) {
      const { t } = i18n.global;
      const { actions, layout, loading } = toRefs(props);

      const handleClickItem = (e, item) => {
        if (item.disabled) {
          e.stopPropagation();
        }
      };
      const handleClick = (data) => {
        emit('select', data.value);
      };
      const handleSelect = (val) => {
        emit('select', val);
      };

      const renderVertical = () => {
        return (
          <ADropdownButton
            size="small"
            class="action-dropdown"
            onSelect={(val) => handleSelect(val)}
            trigger="hover"
            v-slots={{
              icon: () => {
                return slots.icon
                  ? slots.icon?.()
                  : h(compile('<icon-more-vertical />'), {
                      style: {
                        'font-size': '18px',
                        'stroke-width': 5
                      }
                    });
              },
              content: () => {
                return (
                  <>
                    {_.map(_.tail(actions.value), (item) => {
                      return (
                        <a-doption
                          key={item.value}
                          value={item.value}
                          disabled={!!item.disabled}
                          loading={loading.value}
                        >
                          <a-link
                            type="text"
                            size="small"
                            disabled={!!item.disabled}
                            status={item.status}
                            onClick={(e) => handleClickItem(e, item)}
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
              },
              default: () => {
                return slots.default ? (
                  slots.default?.()
                ) : (
                  <a-tooltip
                    content={t(_.get(_.head(actions.value), 'label') || '')}
                  >
                    <a-link
                      class="mright-0"
                      hoverable={false}
                      loading={loading.value}
                      size="small"
                      disabled={!!_.get(_.head(actions.value), 'disabled')}
                      onClick={() => handleClick(_.head(actions.value))}
                      v-slots={{
                        icon: () => {
                          return _.get(_.head(actions.value), 'iconfont') ? (
                            <i
                              class={[
                                'iconfont',
                                _.get(_.head(actions.value), 'icon')
                              ]}
                            ></i>
                          ) : (
                            h(
                              compile(
                                `<${_.get(
                                  _.head(actions.value),
                                  'icon',
                                  ''
                                )} />`
                              ),
                              {
                                ..._.get(_.head(actions.value), 'props', ''),
                                style: {
                                  color: 'var(--sealblue-6)'
                                },
                                class: ['size-14']
                              }
                            )
                          );
                        }
                      }}
                    ></a-link>
                  </a-tooltip>
                );
              }
            }}
          ></ADropdownButton>
        );
      };
      const renderContent = () => {
        return (
          <>
            {layout.value === 'vertical' ? (
              renderVertical()
            ) : (
              <ButtonList
                actions={actions.value}
                onSelect={(val) => handleSelect(val)}
              ></ButtonList>
            )}
          </>
        );
      };
      return () => <>{!actions.value.length ? null : renderContent()}</>;
    }
  });
</script>

<style lang="less" scoped>
  .action-dropdown {
    .mright-0 {
      position: relative;

      :deep(.arco-link-icon) {
        margin-right: 0;
      }

      &::after {
        position: absolute;
        top: -2px;
        right: -5px;
        bottom: -2px;
        left: -5px;
        display: inline-block;
        content: '';
      }
    }
  }
</style>
