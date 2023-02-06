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
              <a-select
                v-if="activeTab === 'table'"
                v-model="query.direct"
                style="width: 160px"
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
              </a-select>
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
              <a-button
                type="primary"
                size="small"
                :loading="exportLoading"
                style="margin-left: 15px"
                @click="handleDownLoadSbom"
                >{{ $t('sbom.project.download') }}</a-button
              >
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
          <!-- <a-tab-pane key="version" style="margin-bottom: 20px">
            <template #title>
              <span
                ><icon-list />{{
                  $t('projects.detail.dependency.version')
                }}</span
              >
            </template>
            <SbomVersion ref="sbomVersion" :search-key="query"></SbomVersion>
          </a-tab-pane> -->
          <a-tab-pane key="tree" style="margin-bottom: 20px">
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
  import { exportProjectSbom } from '../../api/sbom';
  import SbomList from './sbom-list.vue';
  import SbomTree from './sbom-tree.vue';
  // import SbomVersion from './sbom-version.vue';
  import { directConfigList } from '../../config';

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
  const handleDownLoadSbom = () => {
    // const downloadurl = exportProjectSbom({
    //   repositoryID: route.query.id as string,
    //   versionId: route.query.versionId as string,
    // });
    // FileSaver.saveAs(downloadurl);
    try {
      exportLoading.value = true;
      const url = exportProjectSbom({
        resourceID: route.query.id as string,
        versionId: route.query.versionId as string,
      });
      FileSaver.saveAs(
        url,
        `${props.basicInfo?.namespace}-${props.basicInfo?.name}`
      );
      exportLoading.value = false;
    } catch (error) {
      exportLoading.value = false;
    }
  };
</script>

<style lang="less" scoped>
  .component-wrap {
    .component-tab-wrap {
      :deep(.arco-tabs-nav-type-capsule) {
        padding: 20px 0 0;
        background-color: #fff;
      }
    }
  }
</style>
