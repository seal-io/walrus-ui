<template>
  <div>
    <a-grid :cols="4" :col-gap="10">
      <a-grid-item :span="1">
        <violationBarChart
          :loadend="loadend"
          type="vuln"
          :title="$t('report.detail.vulnerability')"
          :data="{
            high: get(violationSummary, 'vulnerability.highSeverityCount'),
            medium: get(violationSummary, 'vulnerability.mediumSeverityCount'),
            low: get(violationSummary, 'vulnerability.lowSeverityCount'),
          }"
        ></violationBarChart>
      </a-grid-item>
      <a-grid-item :span="1">
        <violationBarChart
          :loadend="loadend"
          type="license"
          :title="$t('report.detail.license')"
          :data="{
            high: get(violationSummary, 'license.highSeverityCount'),
            medium: get(violationSummary, 'license.mediumSeverityCount'),
            low: get(violationSummary, 'license.lowSeverityCount'),
          }"
        ></violationBarChart>
      </a-grid-item>
      <a-grid-item :span="1">
        <violationBarChart
          :loadend="loadend"
          type="configure"
          :title="$t('policy.sourceRepo.basicConfig')"
          :data="{
            high: get(violationSummary, 'configuration.highSeverityCount'),
            medium: get(violationSummary, 'configuration.mediumSeverityCount'),
            low: get(violationSummary, 'configuration.lowSeverityCount'),
          }"
        ></violationBarChart>
      </a-grid-item>
      <a-grid-item :span="1">
        <violationBarChart
          :tips="$t('report.detail.other.desc')"
          :loadend="loadend"
          type="other"
          :title="$t('report.detail.customPolicy')"
          :data="{
            high: get(violationSummary, 'other.highSeverityCount'),
            medium: get(violationSummary, 'other.mediumSeverityCount'),
            low: get(violationSummary, 'other.lowSeverityCount'),
          }"
        ></violationBarChart>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import violationBarChart from '@/views/report/components/violation-bar-chart.vue';

  const props = defineProps({
    loadend: {
      type: Boolean,
      default() {
        return false;
      },
    },
    violationSummary: {
      type: Object,
      default() {
        return {};
      },
    },
  });
</script>

<style></style>
