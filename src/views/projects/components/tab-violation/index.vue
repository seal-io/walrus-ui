<template>
  <div class="tab-violation-wrap">
    <violationList
      :loading="loading"
      :list="issuesList"
      :type-list="[]"
      @refresh="handleRefresh"
    ></violationList>
  </div>
</template>

<script lang="ts" setup>
  import { each, get, toLower, cloneDeep } from 'lodash';
  import { ref, onMounted } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import {
    getEventReport,
    violationsItem,
    issuesItem,
  } from '@/views/report/api/report';
  import { queryResourceItem } from '@/api/projects';
  import {
    violationTypeList,
    severityLevel,
    getViolationType,
  } from '@/views/report/configs';
  import useLoading from '@/hooks/loading';
  import violationList from './violation-list.vue';

  const emits = defineEmits(['refresh']);
  const { loading, setLoading } = useLoading();
  const { route } = useCallCommon();
  const id = route.query.id as string;
  const eventId = ref('');
  const ignoreType = ref('false');
  const issuesList = ref<issuesItem[]>([]);
  let eventReportData: any = {};

  const getResourceData = async () => {
    const { data } = await queryResourceItem({ id });
    eventId.value = data?.lastEvaluationEventID || '';
  };

  const fetchData = async () => {
    const obj = {
      dismissed: ignoreType.value === 'all' ? undefined : ignoreType.value,
    };
    const params = {
      id: eventId.value,
      ...obj,
    };
    try {
      setLoading(true);
      const { data } = await getEventReport(params);
      eventReportData = data;
      const violationsList = data?.violationBundles || ([] as violationsItem[]);
      if (!violationsList.length) {
        issuesList.value = [];
      }
      each(violationsList, (item) => {
        each(item.violations, (sItem) => {
          const vulnerabilityValue =
            get(sItem, 'vulnerability.cvss.baseSeverity') || 'low';
          issuesList.value.push({
            ...cloneDeep(sItem),
            severityValue: severityLevel[toLower(sItem.severity)],
            vulnerabilityValue: severityLevel[toLower(vulnerabilityValue)],
            policy: {
              ...cloneDeep(item.policy),
            },
            violationType: getViolationType(sItem) as string,
          });
        });
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleRefresh = async (type?: string) => {
    ignoreType.value = type || ignoreType.value;
    issuesList.value = [];
    await fetchData();
    emits('refresh', eventReportData);
  };
  const initData = async () => {
    await getResourceData();
    fetchData();
  };
  initData();
</script>

<style lang="less" scoped>
  .tab-violation-wrap {
    // padding: 10px;
  }
</style>
