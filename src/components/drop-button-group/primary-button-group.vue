<script lang="tsx">
  import { defineComponent, PropType, toRefs, h, compile } from 'vue';
  import i18n from '@/locale';
  import _ from 'lodash';

  interface MoreAction {
    label: string;
    value: string;
    icon?: string;
    iconfont?: boolean;
    disabled?: boolean;
  }
  export default defineComponent({
    emits: ['select'],
    props: {
      actions: {
        type: Array as PropType<MoreAction[]>,
        default() {
          return [];
        }
      },
      btnText: {
        type: String,
        default() {
          return '';
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      trigger: {
        type: String,
        default() {
          return 'click';
        }
      },
      position: {
        type: String,
        default() {
          return 'bl';
        }
      },
      itemType: {
        type: String as PropType<'button' | 'text'>,
        default() {
          return 'button';
        }
      }
    },
    setup(props, { emit, slots }) {
      const { t } = i18n.global;
      const { actions, btnText } = toRefs(props);

      const handleSelectAction = (value) => {
        const item = _.find(actions.value, (item) => item.value === value);
        emit('select', value, item);
      };
      const renderIcon = (item) => {
        if (item.iconfont) {
          return <i class={['iconfont', item.icon]}></i>;
        }
        return h(compile(`<${item.icon} />`));
      };
      return () => (
        <>
          <a-dropdown
            onSelect={handleSelectAction}
            position={props.position}
            trigger={props.trigger}
            v-slots={{
              content: () => {
                return (
                  <>
                    {_.map(actions.value, (item) => {
                      return (
                        <>
                          {
                            <a-doption
                              key={item.value}
                              value={item.value}
                              label={t(item.label)}
                              disabled={item.disabled}
                            >
                              {slots?.item ? (
                                slots.item({ item })
                              ) : (
                                <a-link
                                  disabled={item.disabled}
                                  v-slots={{
                                    icon: () => (
                                      <>
                                        {item.icon ? (
                                          <>{renderIcon(item)}</>
                                        ) : null}
                                      </>
                                    )
                                  }}
                                  style={{
                                    fontSize: 'var(--font-size-small)',
                                    fontWeight: 500
                                  }}
                                >
                                  {props.itemType === 'text' ? (
                                    <span
                                      style={{
                                        color: item.disabled
                                          ? 'var(--color-text-4)'
                                          : 'var(--color-text-2)'
                                      }}
                                    >
                                      {t(item.label)}
                                    </span>
                                  ) : (
                                    t(item.label)
                                  )}
                                </a-link>
                              )}
                            </a-doption>
                          }
                        </>
                      );
                    })}
                  </>
                );
              }
            }}
          >
            {slots.default ? (
              slots.default()
            ) : (
              <a-button type="primary" loading={props.loading}>
                {btnText.value}
                <icon-down class="mleft-5" />
              </a-button>
            )}
          </a-dropdown>
        </>
      );
    }
  });
</script>
