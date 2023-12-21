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
      }
    },
    setup(props, { emit, slots }) {
      const { t } = i18n.global;
      const { actions, btnText } = toRefs(props);

      const handleSelectAction = (value) => {
        emit('select', value);
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
                                style={{ fontSize: 'var(--font-size-small)' }}
                              >
                                {t(item.label)}
                              </a-link>
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
