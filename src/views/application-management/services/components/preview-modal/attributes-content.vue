<script lang="tsx">
  import { defineComponent, ref, PropType } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import CodeDiffView from '@/components/code-diff-view/index.vue';

  export default defineComponent({
    name: 'AttributesContent',
    props: {
      defaultValue: {
        type: String,
        default: ''
      },
      diffContent: {
        type: Object as PropType<{ old: string; new: string }>,
        default: () => ({})
      }
    },
    setup(props, ctx) {
      const attributesOptions = [
        {
          label: 'Configuration',
          value: 'config'
        },
        {
          label: 'Change History',
          value: 'attributes'
        }
      ];

      const type = ref('config');
      return () => (
        <div>
          <div class="flex ">
            <i class="iconfont icon-filter2"></i>
            <a-select
              bordered={false}
              v-model={type.value}
              options={attributesOptions}
              style={{ width: '160px' }}
            ></a-select>
          </div>
          <a-tabs
            default-active-key={type.value}
            v-model:activeKey={type.value}
          >
            <a-tab-pane key="config">
              <AceEditor
                ref="editor_instance"
                read-only
                editor-default-value={props.defaultValue}
                lang="yaml"
                height={380}
              ></AceEditor>
            </a-tab-pane>
            <a-tab-pane key="attributes">
              <CodeDiffView content={props.diffContent}></CodeDiffView>
            </a-tab-pane>
          </a-tabs>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
