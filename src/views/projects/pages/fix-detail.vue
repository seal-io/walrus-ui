<template>
  <div class="fix-advice container">
    <GroupTitle
      :title="$t('projects.fixdetail.title')"
      is-detail
      :bordered="false"
    ></GroupTitle>
    <com-card
      :title="$t('projects.fixdetail.basictitle')"
      style="margin-bottom: 10px"
    >
      <a-descriptions
        class="fix-detail-basic"
        align="center"
        :data="basicInfoData"
        :column="5"
        :bordered="false"
        layout="inline-vertical"
      >
        <template #label="{ label }">
          <span>{{ $t(label) }}</span>
        </template>
        <template #value="{ value, data }">
          <span v-if="data.key === 'compatibilityLevel'">
            <a-tag
              class="s-tag"
              size="small"
              :color="get(compatibilityColor, value)"
              >{{ $t(get(compatibilityMap, value) || '') }}</a-tag
            >
          </span>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </com-card>
    <com-card
      :title="
        get(basicInfo, 'isFixable')
          ? $t('projects.fixdetail.table.fixvuln')
          : $t('projects.fixdetail.table.vulnSum')
      "
    >
      <vuln-card
        :layout="['C', 'H', 'M', 'L', 'N']"
        :vuln-data="{
          critical: vulnerData.critical,
          high: vulnerData.high,
          medium: vulnerData.medium,
          low: vulnerData.low,
          none: vulnerData.none,
        }"
      ></vuln-card>
      <div style="margin-top: 20px" class="sub-title">
        <div style="font-weight: 500">{{
          get(basicInfo, 'isFixable')
            ? $t('projects.fixdetail.table.fixList')
            : $t('projects.fixdetail.table.list')
        }}</div>
        <fixDetailTable :data-list="dataList"></fixDetailTable>
      </div>
      <div
        v-if="dataListAfter.length && get(basicInfo, 'isFixable')"
        style="margin-top: 20px"
      >
        <div style="font-weight: 500">{{
          $t('projects.fixdetail.table.afterFix')
        }}</div>
        <fixDetailTable :data-list="dataListAfter"></fixDetailTable>
      </div>
    </com-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';
  import dayjs from 'dayjs';
  import {
    get,
    capitalize,
    map,
    each,
    cloneDeep,
    assignIn,
    toLower,
    hasIn,
    subtract,
    difference,
    differenceBy,
    add,
    keys,
  } from 'lodash';
  import comCard from '@/components/page-wrap/com-card.vue';
  import GroupTitle from '@/components/group-title/index.vue';
  import vulnCard from '@/views/projects/components/vuln-card.vue';
  import {
    riskColorMap,
    iconMap,
    compatibilityColor,
    compatibilityMap,
    severityMaps,
  } from '@/config/global';
  import {
    fixAdviceBasic,
    getIncomptableReason,
    incompatibleReasonList,
    incompatibleNoUpgradeReasonList,
  } from '../config';
  import { queryFixAdviceDetail, FixVulnerItem } from '../api/fix-advice';
  import fixDetailTable from '../components/fix-detail-table.vue';

  const vulnerData = reactive({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    none: 0,
  });
  const pkgReg = /(?<=upgrading\s+).+(?=,)/gi;
  const basicInfo = reactive({});
  const dataList = ref<FixVulnerItem[]>([]);
  const dataListAfter = ref<FixVulnerItem[]>([]);
  const { route, t } = useCallCommon();

  const getVulnerDataSummary = (
    deps: Record<string, any> = {},
    current: Record<string, any> = {}
  ) => {
    const data: Record<string, any> = {};
    each(keys(deps), (key) => {
      if (key !== 'total') {
        data[key] = add(deps[key], current[key]);
      }
    });
    return data;
  };
  const setVulnerData = (data) => {
    const fromVulnerabilities = getVulnerDataSummary(
      get(
        data,
        'softwarePackage.from.dependencyVulnerabilities.vulnerabilitySummary'
      ),
      get(data, 'softwarePackage.from.vulnerabilities')
    );
    const toVulnerabilities = getVulnerDataSummary(
      get(
        data,
        'softwarePackage.to.dependencyVulnerabilities.vulnerabilitySummary'
      ),
      get(data, 'softwarePackage.to.vulnerabilities')
    );
    Object.assign(vulnerData, {
      critical: subtract(
        fromVulnerabilities?.critical,
        toVulnerabilities?.critical
      ),
      high: subtract(fromVulnerabilities?.high, toVulnerabilities?.high),
      medium: subtract(fromVulnerabilities?.medium, toVulnerabilities?.medium),
      low: subtract(fromVulnerabilities?.low, toVulnerabilities?.low),
      none: subtract(fromVulnerabilities?.none, toVulnerabilities?.none),
    });
  };
  const basicInfoData = computed(() => {
    const list = map(fixAdviceBasic, (o) => {
      const item = cloneDeep(o);
      if (item.key === 'action') {
        item.value = get(basicInfo, 'isFixable')
          ? t('common.button.upgrade')
          : t('common.action.none');
      } else if (item.key === 'softwarePackage.reason') {
        item.value = get(
          (get(basicInfo, 'softwarePackage.reason') || '').match(pkgReg),
          '0'
        )
          ? t(
              getIncomptableReason(
                incompatibleReasonList,
                get(basicInfo, item.key)
              ),
              {
                pkg: get(
                  (get(basicInfo, 'softwarePackage.reason') || '').match(
                    pkgReg
                  ),
                  '0'
                ),
              }
            )
          : t(
              getIncomptableReason(
                incompatibleNoUpgradeReasonList,
                get(basicInfo, 'softwarePackage.reason')
              )
            );
      } else {
        item.value = get(basicInfo, item.key);
      }
      return item;
    }).filter((sItem) => {
      if (!hasIn(sItem, 'isFixable')) {
        return true;
      }
      return get(basicInfo, 'isFixable') ? sItem.isFixable : !sItem.isFixable;
    });
    return list;
  });
  const fetchData = async () => {
    const params = {
      id: route.query.id as string,
    };
    const { data } = await queryFixAdviceDetail(params);

    const dataListFrom: FixVulnerItem[] =
      get(data, 'softwarePackage.from.vulnerabilities.vulnerabilities') || [];
    const dataListTo: FixVulnerItem[] =
      get(data, 'softwarePackage.to.vulnerabilities.vulnerabilities') || [];

    // vuln from deps
    const dataListFromDeps: FixVulnerItem[] = [];
    const fromDeps: FixVulnerItem[] =
      get(
        data,
        'softwarePackage.from.dependencyVulnerabilities.vulnerableDependencies'
      ) || [];

    each(fromDeps, (item) => {
      each(get(item, 'vulnerabilities.vulnerabilities') || [], (vItem) => {
        dataListFromDeps.push({
          ...vItem,
          depsPkgName: item.name,
          isFromDeps: true,
        });
      });
    });
    // vuln to deps
    const dataListToDeps: FixVulnerItem[] = [];
    const toDeps: FixVulnerItem[] =
      get(
        data,
        'softwarePackage.to.dependencyVulnerabilities.vulnerableDependencies'
      ) || [];

    each(toDeps, (item) => {
      each(get(item, 'vulnerabilities.vulnerabilities') || [], (vItem) => {
        dataListToDeps.push({
          ...vItem,
          depsPkgName: item.name,
          isFromDeps: true,
        });
      });
    });

    dataListAfter.value = [...dataListTo, ...dataListToDeps];

    if (get(data, 'isFixable')) {
      dataList.value =
        differenceBy(
          [...dataListFrom, ...dataListFromDeps],
          [...dataListTo, ...dataListToDeps],
          'name'
        ) || [];
    } else {
      dataList.value = [...dataListFrom, ...dataListFromDeps];
    }
    assignIn(basicInfo, data);
    setVulnerData(data);
  };
  fetchData();
</script>

<style lang="less" scoped>
  @import url('../style/desc-card.less');

  .fix-advice {
    .s-tag.arco-tag {
      border-radius: 0;
    }

    .fix-detail-basic {
      :deep(.arco-descriptions-item-label) {
        margin-bottom: 5px;
      }
    }

    .deps-box {
      padding: 10px;
      background-color: var(--color-fill-1);
      border-radius: 4px;
    }

    .summary {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
</style>
