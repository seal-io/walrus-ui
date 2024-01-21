<script lang="tsx">
  import _, { get } from 'lodash';
  import i18n from '@/locale';
  import useLocale from '@/hooks/locale';
  import { PropType, defineComponent } from 'vue';

  interface Link {
    'label'?: string;
    'zh-CN': string;
    'en-US': string;
  }

  export default defineComponent({
    name: 'QuestionPopup',
    props: {
      link: {
        type: Array as PropType<Link[]>,
        default() {
          return [];
        }
      }
    },
    setup(props, { emit }) {
      const { currentLocale } = useLocale();

      const renderHelpList = () => {
        if (props.link.length > 1) {
          <a-tooltip
            background-color="#fff"
            position="bottom"
            content-style={{
              border: '1px solid var(--color-border-1)',
              padding: '5px 10px'
            }}
            v-slots={{
              content: () => {
                return (
                  <div>
                    {_.map(props.link, (item, index) => {
                      return (
                        <div key={index} style="line-height: 22px">
                          <a-link
                            href={item[currentLocale.value]}
                            class="font-12"
                            hoverable={true}
                            target="_blank"
                          >
                            {i18n.global.t(item.label || '')}
                          </a-link>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            }}
          >
            <a-link class="mleft-5 font-12" target="_blank">
              {i18n.global.t('common.help.need')}
            </a-link>
          </a-tooltip>;
        }
        return null;
      };
      return () => (
        <div class="box">
          <a-tag>
            <icon-bulb class="stroke-w-4" style="color: var(--color-text-3)" />
          </a-tag>
          {props.link.length === 1 ? (
            <a-link
              v-if="link.length === 1"
              class="mleft-5 font-12"
              href={get(props.link[0], currentLocale.value)}
              hoverable={true}
              target="_blank"
            >
              {i18n.global.t('common.help.need')}
            </a-link>
          ) : null}
          {renderHelpList()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    align-items: center;
    width: max-content;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-large);
  }
</style>
