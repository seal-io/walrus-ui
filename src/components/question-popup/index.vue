<script lang="tsx">
  import _, { get } from 'lodash';
  import i18n from '@/locale';
  import useLocale from '@/hooks/locale';
  import { PropType, defineComponent, ref, computed, watch } from 'vue';

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
      },
      height: {
        type: String,
        default() {
          return '120px';
        }
      }
    },
    setup(props, { emit, slots }) {
      const { currentLocale } = useLocale();
      const activeIndex = ref(1);

      const currentData = computed(() => {
        return props.groupList[activeIndex.value - 1];
      });

      watch(
        () => props.groupList,
        () => {
          activeIndex.value = 1;
        },
        {
          immediate: true
        }
      );

      const handlePre = () => {
        if (activeIndex.value > 1) {
          activeIndex.value -= 1;
        }
      };

      const handleNext = () => {
        if (activeIndex.value < props.groupList.length) {
          activeIndex.value += 1;
        }
      };
      const renderHelpList = () => {
        if (props.link.length > 1) {
          <a-tooltip
            background-color="var(--color-white)"
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
                    <span class="title-wrap">
                      <span class="flex flex-align-center">
                        <a-tag color="rgb(var(--primary-5))" class="m-r-10">
                          <icon-bulb />
                        </a-tag>
                        {item.title ? (
                          <div class="title">{i18n.global.t(item.title)}</div>
                        ) : null}
                      </span>
                    </span>
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
      const renderPagination = () => {
        if (props.groupList.length > 1) {
          return (
            <a-space>
              <a-link
                onClick={() => handlePre()}
                disabled={activeIndex.value <= 1}
              >
                <icon-left />
              </a-link>
              <span class="pagination">
                {activeIndex.value}/{props.groupList.length}
              </span>
              <a-link
                onClick={() => handleNext()}
                disabled={activeIndex.value >= props.groupList.length}
              >
                <icon-right />
              </a-link>
            </a-space>
          );
        }
        return null;
      };
      const renderDescriptions = () => {
        return (
          <>
            <span class="title-wrap">
              <span class="flex flex-align-center">
                <a-tag color="rgb(var(--primary-5))" class="m-r-10">
                  <icon-bulb />
                </a-tag>
                <div class="title">
                  {i18n.global.t(currentData.value.title)}
                </div>
              </span>
              {renderPagination()}
            </span>
            <ul class="content">
              <li class="item">
                {i18n.global.t(currentData.value?.texts[0]?.value)}
              </li>
            </ul>
            <a-link
              class="font-12 p-0"
              href={get(currentData.value?.links?.[0], currentLocale.value)}
              hoverable={true}
              target="_blank"
            >
              <i class="iconfont icon-shouzhi m-r-5"></i>
              {i18n.global.t('common.help.need')}
            </a-link>
          </>
        );
      };
      return () => (
        <div class="box">
          <div class="description">{renderDescriptions()}</div>
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
    border: 1px solid var(--color-border-2);
    // background-color: rgb(243 246 250 / 50%);
    border-radius: var(--border-radius-small);

    .pin-icon {
      position: absolute;
      top: 0;
      right: 0;
      color: rgb(var(--primary-5));
    }

    .description {
      .title-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .pagination {
        color: var(--color-text-3);
        font-size: 12px;
      }

      .title {
        margin-left: 0;
        font-size: 12px;
      }

      .content {
        margin: 0;
        padding: 12px 0;
        color: var(--color-text-3);
        font-size: var(--font-size-small);
      }

      .item {
        line-height: 1.6;
        list-style: none;
      }
    }
  }
</style>
