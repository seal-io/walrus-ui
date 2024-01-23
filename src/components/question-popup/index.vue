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
      },
      title: {
        type: String,
        default: ''
      },
      groupList: {
        type: Array as PropType<any[]>,
        default() {
          return [];
        }
      }
    },
    setup(props, { emit, slots }) {
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

      const renderGroupList = () => {
        if (props.groupList.length > 0) {
          return (
            <>
              {_.map(props.groupList, (item) => {
                return (
                  <>
                    {item.title ? (
                      <div class="title">{i18n.global.t(item.title)}</div>
                    ) : null}
                    <ul class="content">
                      {_.map(item?.texts, (sItem, index) => {
                        return (
                          <li key={index} class="item">
                            {i18n.global.t(sItem?.value)}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })}
              {props.link.length === 1 ? (
                <a-link
                  v-if="link.length === 1"
                  class="font-12 p-0"
                  href={get(props.link[0], currentLocale.value)}
                  hoverable={true}
                  target="_blank"
                >
                  <i class="iconfont icon-shouzhi m-r-5"></i>
                  {i18n.global.t('common.help.need')}
                </a-link>
              ) : null}
            </>
          );
        }
        return null;
      };
      const renderDescriptions = () => {
        return (
          <>
            {props.title ? (
              <div class="title">{i18n.global.t(props.title)}</div>
            ) : null}
            <ul class="content">
              {_.map(slots.default?.(), (item, index) => {
                return (
                  <li key={index} class="item">
                    {item}
                  </li>
                );
              })}
            </ul>
            {props.link.length === 1 ? (
              <a-link
                v-if="link.length === 1"
                class="font-12 p-0"
                href={get(props.link[0], currentLocale.value)}
                hoverable={true}
                target="_blank"
              >
                <i class="iconfont icon-shouzhi m-r-5"></i>
                {i18n.global.t('common.help.need')}
              </a-link>
            ) : null}
          </>
        );
      };
      return () => (
        <div class="box">
          <div class="description">
            <a-tag color="rgb(var(--primary-5))">
              <icon-bulb />
            </a-tag>

            {props.groupList.length ? renderGroupList() : renderDescriptions()}
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .box {
    position: relative;
    display: flex;
    align-items: flex-start;
    min-width: 260px;
    max-width: 400px;
    height: max-content;
    padding: 20px;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-large);
    background-color: var(--color-fill-2);
    border-radius: var(--border-radius-small);

    .pin-icon {
      position: absolute;
      top: 0;
      right: 0;
      color: rgb(var(--primary-5));
    }

    .description {
      .title {
        margin-top: 16px;
        font-size: 12px;
      }

      .content {
        margin: 12px 0;
        padding-left: 16px;
        color: var(--color-text-3);
        font-size: var(--font-size-small);
      }

      .item {
        line-height: 1.6;
      }
    }
  }
</style>
