<template>
  <div class="vuln-wrap">
    <a-grid :cols="layout.length" :col-gap="12">
      <a-grid-item v-if="layout.includes('C')" class="critical">
        <div class="value-wrap">
          <div class="label">{{ $t('projects.risk.critical') }}</div>
          <div class="value">{{ vulnData.critical }}</div>
        </div>
      </a-grid-item>
      <a-grid-item v-if="layout.includes('H')" class="high">
        <div class="value-wrap">
          <div class="label">{{ $t('projects.risk.high') }}</div>
          <div class="value">{{ vulnData.high }}</div>
        </div>
      </a-grid-item>
      <a-grid-item v-if="layout.includes('M')" class="medium">
        <div class="value-wrap">
          <div class="label">{{ $t('projects.risk.middle') }}</div>
          <div class="value">{{ vulnData.medium }}</div>
        </div>
      </a-grid-item>
      <a-grid-item v-if="layout.includes('L')" class="low">
        <div class="value-wrap">
          <div class="label">{{ $t('projects.risk.low') }}</div>
          <div class="value">{{ vulnData.low }}</div>
        </div>
      </a-grid-item>
      <a-grid-item v-if="layout.includes('N')" class="none">
        <div class="value-wrap">
          <div class="label">{{ $t('projects.risk.none') }}</div>
          <div class="value">{{ vulnData.none }}</div>
        </div>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    vulnData: {
      type: Object as PropType<{
        critical?: number | string;
        high?: number | string;
        medium?: number | string;
        low?: number | string;
        none?: number | string;
      }>,
      default() {
        return {};
      },
    },
    layout: {
      type: Array,
      default() {
        return ['H', 'M', 'L'];
      },
    },
  });
</script>

<style lang="less" scoped>
  @import url('../style/vuln.less');
</style>
