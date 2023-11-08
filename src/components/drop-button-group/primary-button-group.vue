<script lang="tsx">
  import { defineComponent, PropType, toRefs } from 'vue';
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
      actionList: {
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
      }
    },
    setup(props, { emit, slots }) {
      const { t } = i18n.global;
      const { actionList, btnText } = toRefs(props);

      const handleSelectAction = (value) => {
        emit('select', value);
      };
      return () => (
        <>
          <a-dropdown
            onSelect={handleSelectAction}
            v-slots={{
              content: () => {
                return (
                  <>
                    {_.map(actionList.value, (item) => {
                      return (
                        <>
                          {
                            <a-doption
                              key={item.value}
                              value={item.value}
                              label={t(item.label)}
                              disabled={item.disabled}
                              v-slots={{
                                icon: () => (
                                  <>
                                    {item.icon ? (
                                      <i
                                        class={['iconfont', item.icon]}
                                        style="color: var(--sealblue-6);font-size: 16px;font-weight: 700"
                                      ></i>
                                    ) : null}
                                  </>
                                )
                              }}
                            >
                              {t(item.label)}
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
              <a-button type="primary">
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
