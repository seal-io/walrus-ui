<script lang="tsx">
  import _ from 'lodash';
  import i18n from '@/locale';
  import { defineComponent, ref, PropType, computed, watch } from 'vue';
  import { queryRevisionChange } from '@/views/application-management/services/api';
  import CodeDiffView from '@/components/code-diff-view/index.vue';
  import Copy from '@/components/copy/copy-command.vue';

  export default defineComponent({
    props: {
      runData: {
        type: Object as PropType<any>,
        default() {
          return {};
        }
      },
      fullscreen: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isErrorStatus: {
        type: Boolean,
        default: false
      }
    },
    setup(props, ctx) {
      const diffContent = ref({
        old: '',
        new: ''
      });
      const loading = ref(false);

      const maxHeight = computed(() => {
        if (props.isErrorStatus) {
          return props.fullscreen ? 'calc(100vh - 360px)' : '310px';
        }
        return props.fullscreen ? 'calc(100vh - 325px)' : '310px';
      });

      const isNoChange = computed(() => {
        return _.isEqual(1, 2);
      });

      const getRevisionChange = async () => {
        if (!props.runData.id || !props.runData.resource?.id) {
          return;
        }
        try {
          loading.value = true;
          const { data } = await queryRevisionChange({
            id: props.runData.id,
            serviceID: props.runData.resource?.id
          });
          diffContent.value = {
            old: data?.old?.computedAttributes
              ? JSON.stringify(data?.old?.computedAttributes, null, 2)
              : '',
            new: JSON.stringify(data?.new?.computedAttributes, null, 2)
          };
        } catch (error) {
          diffContent.value = {
            old: '',
            new: ''
          };
        } finally {
          loading.value = false;
        }
      };
      const renderCopyButton = (title, data) => {
        return (
          <div class="title flex flex-justify-between flex-align-center">
            <span>{title}</span>
            <Copy content={data}></Copy>
          </div>
        );
      };

      const renderTitle = () => {
        if (_.isEqual(diffContent.value.old, diffContent.value.new)) {
          return (
            <a-alert
              style={{
                'color': 'var(--color-text-3)',
                'textAlign': 'left',
                'border-radius': 0
              }}
            >
              {i18n.global.t('applications.applications.history.diff.same')}
              {_.isEqual(diffContent.value.old, diffContent.value.new)}
            </a-alert>
          );
        }
        return null;
      };
      watch(
        () => props.runData,
        () => {
          getRevisionChange();
        },
        {
          immediate: true
        }
      );

      return () => (
        <div>
          <a-spin
            loading={loading.value}
            style={{ width: '100%', minHeight: '100px' }}
          >
            <CodeDiffView
              maxHeight={maxHeight.value}
              content={diffContent.value}
              isLeftEmpty={!diffContent.value.old}
              isRightEmpty={!diffContent.value.new}
              class="m-t-10 m-b-10"
              v-slots={{
                title: () => {
                  return renderTitle();
                },
                leftTitle: diffContent.value.old
                  ? () => {
                      return renderCopyButton(
                        i18n.global.t(
                          'resource.revisons.components.beforeChange'
                        ),
                        diffContent.value.old
                      );
                    }
                  : null,
                rightTitle: diffContent.value.new
                  ? () => {
                      return renderCopyButton(
                        i18n.global.t(
                          'resource.revisons.components.afterChange'
                        ),
                        diffContent.value.new
                      );
                    }
                  : null
              }}
            ></CodeDiffView>
          </a-spin>
        </div>
      );
    }
  });
</script>
