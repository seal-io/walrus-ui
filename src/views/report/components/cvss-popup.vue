<template>
  <div>
    <a-space direction="horizontal">
      <span>EPSS:</span>
      <span v-if="get(vulnerabilityInfo, 'epss.score') > 0">{{
        `${round(get(vulnerabilityInfo, 'epss.score') * 100, 2)}%`
      }}</span>
      <span v-else>{{ $t('common.data.none') }}</span>
    </a-space>
    <div></div>
    <a-space>
      <span>CVSS: </span>
      <span v-if="!get(vulnerabilityInfo, 'cvss.vectorString')">{{
        $t('common.data.none')
      }}</span>
      <span v-else-if="get(vulnerabilityInfo, 'cvss.baseScore') > 0">{{
        get(vulnerabilityInfo, 'cvss.baseScore')
      }}</span>
      <span
        v-if="
          get(vulnerabilityInfo, 'cvss.baseSeverity') &&
          get(vulnerabilityInfo, 'cvss.baseSeverity') !== 'NONE'
        "
        >{{
          $t(
            vulnerSeverityMaps[
              toLower(get(vulnerabilityInfo, 'cvss.baseSeverity'))
            ] || ''
          )
        }}</span
      >
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { get, round, toLower } from 'lodash';

  const props = defineProps({
    vulnerabilityInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  });
  const vulnerSeverityMaps = {
    critical: 'report.detail.critical',
    high: 'report.detail.high',
    medium: 'report.detail.medium',
    low: 'report.detail.low',
  };
</script>

<style></style>
