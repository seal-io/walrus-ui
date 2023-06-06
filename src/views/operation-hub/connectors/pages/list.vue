<template>
  <comCard borderless :top-gap="topGap" class="connectors" v-bind="attrs">
    <a-tabs
      lazy-load
      :direction="direction"
      class="page-line-tabs"
      :class="[showType]"
      :active-key="activeKey"
      type="line"
      @change="handleTabChange"
    >
      <a-tab-pane
        v-for="item in connectorTypeList"
        :key="item.value"
        :disabled="!item.enable"
        :title="$t(item.label)"
      >
        <Component :is="connectorsMap[item.com]"></Component>
      </a-tab-pane>
    </a-tabs>
  </comCard>
</template>

<script lang="ts" setup>
  import { ref, markRaw, provide, PropType, useAttrs } from 'vue';
  import { connectorTypeList } from '../config';
  import connectorKubernetes from '../components/connector-kubernetes.vue';
  import connectorCustom from '../components/connector-custom.vue';
  import connectorCloud from '../components/connector-cloud.vue';
  import connectorScm from '../components/connector-scm.vue';

  defineProps({
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default() {
        return 'horizontal';
      }
    },
    topGap: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showType: {
      type: String,
      default() {
        return 'page';
      }
    }
  });
  const connectorsMap = {
    kubernetes: markRaw(connectorKubernetes),
    custom: markRaw(connectorCustom),
    cloud: markRaw(connectorCloud),
    versionControl: markRaw(connectorScm)
  };
  const attrs = useAttrs();
  const activeKey = ref('Kubernetes');

  provide('activeKey', activeKey);
  const handleTabChange = (val) => {
    activeKey.value = val;
  };
</script>

<script lang="ts">
  export default {
    name: 'ConnectorsList'
  };
</script>

<style lang="less" scoped>
  .connectors {
    :deep(.arco-tabs-tab) {
      justify-content: center;
      width: 75px;
    }

    :deep(.arco-tabs-nav-vertical) {
      .arco-tabs-tab {
        width: auto;
        margin-left: 20px;
        padding: 0;
      }

      .arco-tabs-nav-ink {
        width: 3px;
        border-radius: 0 2px 2px 0;
      }
    }
  }
</style>
