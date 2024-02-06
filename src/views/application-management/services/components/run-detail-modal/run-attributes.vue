<script lang="tsx">
  import i18n from '@/locale';
  import { defineComponent, ref, PropType, computed, watch } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import CodeDiffView from '@/components/code-diff-view/index.vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import {
    yaml2Json,
    json2Yaml
  } from '@/components/form-create/config/yaml-parse';
  import Copy from '@/components/copy/copy-command.vue';
  // import HighlightBlock from '@/components/highlight-block/index.vue';

  export default defineComponent({
    name: 'AttributesContent',
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
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
          value: 'history'
        }
      ];

      const iconList = [
        {
          icon: 'icon-yaml',
          view: 'yaml',
          iconfont: true
        },
        {
          icon: 'icon-code',
          view: 'json',
          iconfont: false
        }
      ];

      const type = ref('config');
      const activeKey = ref('yaml');
      const yamlAttributes = ref('');

      watch(
        () => props.runData?.computedAttributes,
        (newVal) => {
          yamlAttributes.value = json2Yaml(newVal);
        },
        {
          immediate: true
        }
      );

      const handleToggle = (val) => {
        ctx.emit('change', val);
      };

      const renderLeftTitle = (data) => {
        return (
          <div class="title">
            <span></span>
            <Copy content={data}></Copy>
          </div>
        );
      };
      const renderRightTitle = (data) => {
        return (
          <div class="title">
            <span></span>
            <Copy content={data}></Copy>
          </div>
        );
      };
      return () => (
        <div class="content">
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
            class="attributes-tabs"
            default-active-key={type.value}
            v-model:activeKey={type.value}
          >
            <a-tab-pane key="config">
              <IconBtnGroup
                class="m-b-10"
                v-model:active={activeKey.value}
                icon-list={iconList}
                onChange={(val) => handleToggle(val)}
              ></IconBtnGroup>
              <div>
                {activeKey.value === 'yaml' ? (
                  <AceEditor
                    ref="yaml_editor"
                    read-only
                    key="yaml_editor"
                    editorId="yaml_editor"
                    editor-default-value={yamlAttributes.value}
                    lang="yaml"
                    height={380}
                  ></AceEditor>
                ) : (
                  <AceEditor
                    ref="json_editor"
                    read-only
                    key="json_editor"
                    editorId="json_editor"
                    editor-default-value={JSON.stringify(
                      props.runData?.computedAttributes,
                      null,
                      2
                    )}
                    lang="json"
                    height={380}
                  ></AceEditor>
                )}
              </div>
            </a-tab-pane>
            <a-tab-pane key="history">
              <a-alert
                class="m-t-10"
                style={{ color: 'var(--color-text-3)', textAlign: 'left' }}
              >
                {i18n.global.t('applications.applications.history.diff.same')}
              </a-alert>
              <CodeDiffView
                content={props.diffContent}
                class="m-t-10"
                v-slots={{
                  leftTitle: (data) => {
                    return renderLeftTitle(data);
                  },
                  rightTitle: (data) => {
                    return renderRightTitle(data);
                  }
                }}
              ></CodeDiffView>
            </a-tab-pane>
          </a-tabs>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .content {
    .flex {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .attributes-tabs {
      :deep(.arco-tabs-content) {
        padding-top: 0;
      }

      :deep(.arco-tabs-nav-tab) {
        display: none;
      }
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
