<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { defineComponent, ref, PropType, computed, watch } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import CodeDiffView from '@/components/code-diff-view/index.vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import {
    yaml2Json,
    json2Yaml
  } from '@/components/form-create/config/yaml-parse';
  import Copy from '@/components/copy/copy-command.vue';
  import { queryRevisionChange } from '../../api';
  import ServiceInfo from '../service-info.vue';

  export default defineComponent({
    name: 'AttributesContent',
    props: {
      runData: {
        type: Object,
        default() {
          return {};
        }
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
          icon: 'icon-jibenxinxi',
          view: 'form',
          iconfont: true
        },
        {
          icon: 'icon-code',
          view: 'yaml',
          iconfont: false
        }
      ];

      const type = ref('config');
      const activeKey = ref('form');
      const yamlAttributes = ref('');
      const diffContent = ref({
        old: '',
        new: ''
      });

      watch(
        () => props.runData?.computedAttributes,
        (newVal) => {
          yamlAttributes.value = json2Yaml(newVal);
        },
        {
          immediate: true
        }
      );

      const getRevisionChange = async () => {
        try {
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
        }
      };
      const handleToggle = (val) => {
        if (val === 'history') {
          getRevisionChange();
        }
      };

      const renderCopyButton = (data) => {
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
              style={{ width: '140px' }}
              onChange={(val) => handleToggle(val)}
            ></a-select>
          </div>
          <a-tabs
            class="attributes-tabs"
            default-active-key={type.value}
            v-model:activeKey={type.value}
          >
            <a-tab-pane key="config">
              <IconBtnGroup
                class="btn-group"
                v-model:active={activeKey.value}
                icon-list={iconList}
              ></IconBtnGroup>
              <div>
                {activeKey.value === 'form' ? (
                  <ServiceInfo></ServiceInfo>
                ) : (
                  <AceEditor
                    ref="yaml_editor"
                    read-only
                    key="yaml_editor"
                    editorId="yaml_editor"
                    editor-default-value={yamlAttributes.value}
                    lang="yaml"
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
                content={diffContent.value}
                class="m-t-10"
                v-slots={{
                  leftTitle: diffContent.value.old
                    ? () => {
                        return renderCopyButton(diffContent.value.old);
                      }
                    : null,
                  rightTitle: diffContent.value.new
                    ? () => {
                        return renderCopyButton(diffContent.value.new);
                      }
                    : null
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
      .btn-group {
        margin-top: 8px;
        margin-bottom: 10px;
      }

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
