<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-download', label: 'common.cli.download' }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard top-gap>
      <a-descriptions
        :data="downloadConfig"
        :title="$t('common.cli.download')"
        bordered
        :column="1"
      >
        <template #value="{ data, value }">
          <a-space :size="12">
            <a-link
              v-for="item in value"
              :key="item"
              @click="handledownload(item, data)"
              >{{ item }}
            </a-link>
          </a-space>
        </template>
        <template #label="{ data, label }">
          <span v-if="data.os === 'darwin'">
            <i class="iconfont icon-macos mright-5"></i>
          </span>
          <span v-if="data.os === 'linux'">
            <i class="iconfont icon-linux mright-5"></i>
          </span>
          <span>{{ label }}</span>
        </template>
      </a-descriptions>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import FileSaver from 'file-saver';
  import { downloadConfig } from '../config';
  import { downloadCli } from '../api';

  const props = defineProps({
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const handledownload = (value, data) => {
    try {
      const url = downloadCli({
        os: data.os,
        arch: value
      });
      FileSaver.saveAs(url, 'seal-cli');
    } catch (error) {
      console.log(error);
    }
  };
</script>

<style lang="less" scoped>
  .container {
    .opts-item {
      position: relative;
      padding-left: 20px;

      :deep(.arco-icon) {
        position: absolute;
      }

      .label {
        margin-left: 10px;
      }
    }
  }
</style>
