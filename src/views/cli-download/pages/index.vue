<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-download', label: 'common.cli.download' }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard>
      <a-descriptions :data="downloadConfig" title="" bordered :column="1">
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
          <span style="display: flex; align-items: center">
            <span v-if="data.os === 'darwin'">
              <i
                class="iconfont icon-macos mright-5 size-16"
                style="color: #2d2d2d"
              ></i>
            </span>
            <span v-if="data.os === 'linux'" class="ft-size0">
              <img
                src="~/assets/images/linux.png"
                alt=""
                style="width: 18px; height: 18px; margin-right: 4px"
              />
            </span>
            <span>{{ label }}</span>
          </span>
        </template>
      </a-descriptions>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
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
  const click = (node) => {
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    node.dispatchEvent(mouseEvent);
  };
  const createDom = (url) => {
    const a = document.createElement('a');
    a.href = url;
    return a;
  };
  const handledownload = (value, data) => {
    const url = downloadCli({
      os: data.os,
      arch: value,
      t: Date.now()
    });
    try {
      const node = createDom(url);
      click(node);
      setTimeout(() => {
        node.remove();
      }, 100);
    } catch (error) {
      // ingore
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
