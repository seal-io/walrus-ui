<script lang="tsx">
  import _ from 'lodash';
  import { defineComponent, ref, PropType, computed, watch } from 'vue';
  import AceEditor from '@/components/ace-editor/index.vue';
  import IconBtnGroup from '@/components/icon-btn-group/index.vue';
  import {
    yaml2Json,
    json2Yaml
  } from '@/components/form-create/config/yaml-parse';
  import ServiceInfo from '@/views/application-management/services/components/service-info.vue';

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

      const activeKey = ref('form');
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

      return () => (
        <div class="content">
          <IconBtnGroup
            class="btn-group m-b-10"
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
