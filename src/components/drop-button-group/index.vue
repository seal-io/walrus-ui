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
    ref,
    withModifiers
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
      },
      size: {
        type: String as PropType<'small' | 'medium' | 'large'>,
        default: 'small'
      },
      trigger: {
        type: String as PropType<'click' | 'hover'>,
        default: 'hover'
      }
    },
    setup(props, { emit, slots, attrs }) {
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
            trigger={props.trigger}
            size={props.size}
            class={['action-dropdown']}
            onSelect={(val) => handleSelect(val)}
            onClick={(e) => {
              e.stopPropagation();
              if (_.get(_.head(actions.value), 'disabled')) {
                return;
              }
              handleClick(_.head(actions.value));
            }}
            v-slots={{
              icon: () => {
                return slots.icon
                  ? slots.icon?.()
                  : h(compile('<icon-more-vertical />'), {
                      style: {
                        'font-size': '14px',
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
                                    class={[item.icon, 'iconfont size-12']}
                                    style={{
                                      marginRight: '8px',
                                      ...item.style
                                    }}
                                  ></i>
                                ) : (
                                  h(compile(`<${item.icon}/>`), {
                                    ...item.props,
                                    style: {
                                      marginRight: '8px',
                                      ...item.style
                                    },
                                    class: ['size-12']
                                  })
                                )}
                              </span>
                              <span
                                style={{ fontSize: 'var(--font-size-small)' }}
                              >
                                {t(item.label)}
                              </span>
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
                      style={{ lineHeight: 1 }}
                      hoverable={false}
                      loading={loading.value}
                      size="small"
                      disabled={!!_.get(_.head(actions.value), 'disabled')}
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

    .arco-link.arco-link-disabled {
      :deep(.arco-link-icon) {
        color: var(--color-link-light-3) !important;
      }

      color: var(--color-link-light-3) !important;
    }
  }
</style>
