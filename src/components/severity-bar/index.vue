<template>
  <div>
    <a-space :size="3">
      <slot name="label"></slot>
      <StatusLabel
        v-if="layout.includes('C')"
        :label="$t('projects.table.critical')"
        color="203, 39, 45"
        :value="get(severity, 'critical')"
      />
      <StatusLabel
        v-if="layout.includes('H')"
        :label="$t('projects.table.high')"
        color="245, 63, 63"
        :value="get(severity, 'high')"
      />
      <StatusLabel
        v-if="layout.includes('M')"
        :label="$t('projects.table.middle')"
        color="255, 180, 0"
        :value="get(severity, 'medium')"
      />
      <StatusLabel
        v-if="layout.includes('L')"
        :label="$t('projects.table.low')"
        color="134, 144, 156"
        :value="get(severity, 'low')"
      />
      <StatusLabel
        v-if="layout.includes('N')"
        :label="$t('projects.table.none')"
        color="134, 144, 156"
        :value="get(severity, 'none')"
      />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { PropType } from 'vue';
  import StatusLabel from './status-label.vue';

  defineProps({
    layout: {
      type: Array as PropType<string[]>,
      default() {
        return ['C', 'H', 'M', 'L', 'N'];
      },
    },
    severity: {
      type: Object,
      default() {
        return {};
      },
    },
  });
</script>

<style></style>
