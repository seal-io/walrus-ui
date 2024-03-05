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
      }
    },
    setup(props, ctx) {
      const diffContent = ref({
        old: '',
        new: ''
      });
      const loading = ref(false);

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
          <div class="title flex flex-justify-between">
            <span>{title}</span>
            <Copy content={data}></Copy>
          </div>
        );
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
          {_.isEqual(diffContent.value.old, diffContent.value.new) ? (
            <a-alert
              class="m-t-10"
              style={{ color: 'var(--color-text-3)', textAlign: 'left' }}
            >
              {i18n.global.t('applications.applications.history.diff.same')}
            </a-alert>
          ) : null}
          <a-spin loading={loading.value} style={{ width: '100%' }}>
            <CodeDiffView
              content={diffContent.value}
              class="m-t-10 m-b-10"
              v-slots={{
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
