<template>
  <div class="tab-violation-wrap">
    <violationList
      :show-resource-url="true"
      :loading="loading"
      :list="issuesList"
      :resource-list="resourceList"
      :type-list="customTypeMap"
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
  import {
    violationTypeList,
    severityLevel,
    getViolationType,
  } from '@/views/report/configs';
  import useLoading from '@/hooks/loading';
  import { usePluginPolicy } from '@/views/policy/hooks/use-plugin-policy';
  import violationList from '@/views/projects/components/tab-violation/violation-list.vue';
  import { tableListRow } from '@/api/projects';
  import {
    queryApplicationViolations,
    queryAppsItem,
    queryAppsResources,
  } from '../api/applications';

  const emits = defineEmits(['refresh']);
  const { customTypeMap } = usePluginPolicy();
  const { loading, setLoading } = useLoading();
  const { route } = useCallCommon();
  const id = route.query.id as string;
  const eventId = ref('');
  const ignoreType = ref('false');
  const issuesList = ref<issuesItem[]>([]);
  const resourceList = ref<tableListRow[]>([]);
  let violationData: any = {};
  const getResourceData = async () => {
    const { data } = await queryAppsItem({ id });
  };

  const fetchData = async () => {
    const obj = {
      dismissed: ignoreType.value === 'all' ? undefined : ignoreType.value,
    };
    const params = {
      id,
      ...obj,
    };
    try {
      setLoading(true);
      const { data } = await queryApplicationViolations(params);
      violationData = data;
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
  const getAppResourceList = async () => {
    const params = {
      page: 1,
      perPage: 1000,
      id: route.query.id as string,
    };
    const { data } = await queryAppsResources(params);
    resourceList.value = data || [];
  };
  const handleRefresh = async (type?: string) => {
    ignoreType.value = type || ignoreType.value;
    issuesList.value = [];
    await fetchData();
    emits('refresh', violationData);
  };
  const initData = async () => {
    // await getResourceData();
    fetchData();
  };
  initData();
  getAppResourceList();
</script>

<style lang="less" scoped>
  .tab-violation-wrap {
    padding-bottom: 20px;
    // padding: 10px;
  }
</style>
