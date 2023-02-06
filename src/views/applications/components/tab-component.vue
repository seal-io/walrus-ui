<template>
  <div class="component-wrap">
    <a-space direction="vertical" :size="20" fill>
      <div>
        <!-- <GroupTitle :title="$t('projects.detail.dependency')"></GroupTitle> -->
        <a-tabs
          lazy-load
          class="component-tab-wrap"
          default-active-key="group"
          :active-key="activeTab"
          type="capsule"
          @change="handleTabChange"
        >
          <template #extra>
            <a-space style="margin-bottom: 0">
              <!-- <a-select
              style="width: 160px"
                  v-model="query.direct"
                  size="small"
                  :placeholder="$t('resource.detail.components.relation')"
                  allow-clear
                  @change="handlerSearch"
                >
                  <a-option
                    v-for="item in directConfigList"
                    :key="item.value"
                    :value="item.value"
                    >{{ $t(item.label) }}</a-option
                  >
                </a-select> -->
              <a-input
                v-model="query.query"
                size="small"
                allow-clear
                :placeholder="$t('sbom.filter.name')"
                @clear="handlerSearch"
                @change="handlerSearch"
                @press-enter="handlerSearch"
              >
                <template #prefix>
                  <icon-search />
                </template>
              </a-input>
              <!-- <a-button
                type="primary"
                size="small"
                :loading="exportLoading"
                style="margin-left: 15px"
                @click="handleDownLoadSbom"
                >{{ $t('sbom.project.download') }}</a-button
              > -->
              <a-dropdown size="small">
                <a-button type="primary" size="small">
                  {{ $t('sbom.project.download') }}
                  <icon-down style="margin-left: 0" />
                </a-button>
                <template #content>
                  <a-doption style="padding: 0; line-height: 32px">
                    <a-button
                      type="text"
                      size="small"
                      style="padding: 0 8px"
                      :loading="exportLoading"
                      @click="handleDownLoadSbom(false)"
                      ><icon-common style="margin-right: 4px" />{{
                        $t('applications.detail.export.seprate')
                      }}</a-button
                    >
                  </a-doption>
                  <a-doption style="padding: 0; line-height: 32px">
                    <a-button
                      type="text"
                      size="small"
                      style="padding: 0 8px"
                      :loading="exportLoading"
                      @click="handleDownLoadSbom(true)"
                      ><icon-layers style="margin-right: 4px" />{{
                        $t('applications.detail.merge')
                      }}</a-button
                    >
                  </a-doption>
                </template>
              </a-dropdown>
              <!-- <a-button type="primary" style="margin-left: 15px" @click="handleReset">{{
                  $t('common.button.reset')
                }}</a-button> -->
            </a-space>
          </template>
          <a-tab-pane key="table">
            <template #title>
              <span
                ><icon-list />{{ $t('projects.detail.dependency.list') }}</span
              >
            </template>
            <SbomList ref="sbomList" :query="query"></SbomList>
          </a-tab-pane>
          <a-tab-pane key="version">
            <template #title>
              <span
                ><icon-list />{{
                  $t('projects.detail.dependency.version')
                }}</span
              >
            </template>
            <SbomVersion ref="sbomVersion" :search-key="query"></SbomVersion>
          </a-tab-pane>
          <a-tab-pane key="tree">
            <template #title>
              <span
                ><icon-mind-mapping />{{
                  $t('projects.detail.dependency.tree')
                }}</span
              >
            </template>
            <SbomTree ref="sbomTree" :search-key="query"></SbomTree>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import FileSaver from 'file-saver';
  import { directConfigList } from '@/views/projects/config';
  import { exportProjectSbom } from '../api/applications';
  import SbomList from './sbom-list.vue';
  import SbomTree from './sbom-tree.vue';
  import SbomVersion from './sbom-version.vue';

  const props = defineProps({
    basicInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const route = useRoute();
  const activeTab = ref('table');
  const exportLoading = ref(false);
  const handleTabChange = (key) => {
    activeTab.value = key;
  };
  const query = reactive({
    query: '',
    direct: '',
  });
  const handlerSearch = () => {
    // if (activeTab.value === 'tree') {
    //   sbomTree.value.updateData()
    // } else {
    //   sbomList.value.handleFilter();
    // }
  };
  const handleDownLoadSbom = (flag: boolean) => {
    // const downloadurl = exportProjectSbom({
    //   id: route.query.id as string,
    //   merge: true,
    // });
    // FileSaver.saveAs(downloadurl);
    try {
      exportLoading.value = true;
      const url = exportProjectSbom({
        id: route.query.id as string,
        merge: flag,
      });
      FileSaver.saveAs(url, `${props.basicInfo?.name}-sbom`);
      exportLoading.value = false;
    } catch (error) {
      exportLoading.value = false;
    }
  };
</script>

<style lang="less" scoped>
  .component-wrap {
    :deep(.arco-tabs-nav) {
      flex-direction: row-reverse;
      padding: 10px;
      padding-bottom: 0;
      background-color: var(--color-fill-2);

      .filter-wrap {
        .arco-input-wrapper {
          background-color: #fff;
        }
      }
    }

    .button-wrap {
      :deep(.arco-btn-secondary) {
        padding: 0 1px;

        .arco-btn-size-small {
          height: 26px;
          padding: 0 10px;
        }
      }
    }

    .component-tab-wrap {
      :deep(.arco-tabs-nav-type-capsule) {
        padding: 20px 0 0;
        background-color: #fff;
      }
    }
  }
</style>
