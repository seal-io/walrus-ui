<template>
  <div class="components-detail-wrap">
    <div class="container">
      <GroupTitle class="g-title" :bordered="false" is-detail>
        <template #title>
          <!-- <a-link
            type="text"
            size="small"
            class="back-btn"
            @click="handleBack"
            >{{ $t('common.button.back') }}</a-link
          >
          <a-divider direction="vertical" class="divider"></a-divider> -->
          <span>{{ $t('sbom.component.detail.title') }}</span>
        </template>
      </GroupTitle>
      <a-card
        class="general-card q-s-w-card"
        :bordered="false"
        style="margin-bottom: 10px"
      >
        <a-descriptions
          class="com-info"
          :column="2"
          :align="{ label: 'left', value: 'left' }"
          :title="$t('sbom.component.detail.basic')"
          :data="basicDataList"
          layout="inline-horizontal"
        >
          <template #label="{ label }"
            ><span>{{ $t(label) }}</span></template
          >
          <template #value="{ value, data }">
            <div
              v-if="data.key === 'dependencyTrails' && value && value.length"
            >
              <a-breadcrumb
                v-for="(item, index) in value"
                :key="index"
                style="display: flex; flex-wrap: wrap"
              >
                <template #separator><icon-right></icon-right></template>
                <a-breadcrumb-item v-for="(sItem, sIndex) in item" :key="sIndex"
                  ><icon-font
                    :type="get(iconMap, sItem.type)"
                    :size="14"
                    style="margin-right: 2px"
                  />{{ sItem.displayName }}
                </a-breadcrumb-item>
              </a-breadcrumb>
            </div>
            <span v-else-if="data.key === 'name'" class="pkg-name">{{
              value
            }}</span>
            <span v-else class="pkg-version">{{ value }}</span>
          </template>
        </a-descriptions>
      </a-card>
      <a-card class="general-card q-s-w-card content" :bordered="false">
        <!-- <a-divider style="margin-bottom: 40px;"></a-divider> -->
        <a-row :gutter="15">
          <a-col
            :span="
              score > -1 || get(componentDetailInfo, 'project.name') ? 16 : 24
            "
          >
            <VulnerList :data-list="vulnerList"></VulnerList>
            <!-- <a-divider></a-divider> -->
            <LicenseTable
              :data-list="licenseList"
              style="margin-top: 30px"
            ></LicenseTable>
          </a-col>
          <a-col
            v-if="score > -1 || get(componentDetailInfo, 'project.name')"
            :span="8"
          >
            <div
              v-show="get(componentDetailInfo, 'project.name')"
              class="pro-info"
            >
              <div class="arco-list-header">{{
                $t('sbom.component.basic.component')
              }}</div>
              <a-divider></a-divider>
              <div class="pro-name">
                <span style="font-weight: 500">
                  <a-link
                    v-if="get(componentDetailInfo, 'project.reference')"
                    :href="get(componentDetailInfo, 'project.reference')"
                    target="_blank"
                    >{{ get(componentDetailInfo, 'project.name') }}<icon-link
                  /></a-link>
                  <span v-else>{{
                    get(componentDetailInfo, 'project.name')
                  }}</span>
                </span>
                <div style="margin-top: 5px">{{
                  get(componentDetailInfo, 'project.description')
                }}</div>
              </div>
            </div>
            <div v-show="score > -1" class="ossf-wrap">
              <div class="ossf">OpenSSF ScoreCard</div>
              <ScoreGauge
                :score="score"
                :color="getSeverity(score)"
                :show-label="true"
              >
                <template #default>
                  <span
                    >{{ $t('sbom.component.basic.updateTime') }}
                    <span>{{
                      get(componentDetailInfo, 'project.scorecard.date')
                    }}</span></span
                  >
                </template>
              </ScoreGauge>
              <a-divider></a-divider>
              <ScoreCard :data-list="scoreDataList"></ScoreCard>
              <div class="desc" v-html="$t('sbom.component.detail.tips')">
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { assignIn, filter, get, map } from 'lodash';
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { PackageURL } from 'packageurl-js';
  import GroupTitle from '@/components/group-title/index.vue';
  import ProviderIcon from '@/components/provider-icon/index.vue';
  import { queryComponentDetail } from '@/views/projects/api/sbom';
  import { severityColor } from '@/config/global';
  import ScoreCard from '../components/score-card.vue';
  import ScoreGauge from '../components/score-gauge.vue';
  import VulnerList from '../components/vulner-list.vue';
  import LicenseTable from '../components/license-table.vue';
  import {
    ScoreCardItem,
    LicenseItem,
    BasicItem,
    VulnerItem,
  } from '../config/interface';
  import { scoreCardConfigList, componentInfoList, iconMap } from '../config';
  import detailData from '../config/detail-data';

  const router = useRouter();
  const route = useRoute();
  const score = ref(-1);
  const basicDataList = ref<BasicItem[]>([]);
  const vulnerList = ref<VulnerItem[]>([]);
  let componentDetailInfo = reactive({});
  const scoreDataList = ref<ScoreCardItem[]>([]);
  const licenseList = ref<LicenseItem[]>([]);
  const handleBack = () => {
    router.back();
  };
  const getSeverity = (val) => {
    console.log('val===', val);
    if (val > 0 && val < 3) {
      return severityColor.high;
    }
    if (val >= 3 && val < 7) {
      return severityColor.medium;
    }
    if (val >= 7) {
      return severityColor.low;
    }
    return severityColor.none;
  };
  const setScoreDataList = (arr) => {
    const list = filter(arr, (item) => {
      return item.score > -1;
    });
    const scoreDataMap = scoreCardConfigList.reduce((obj, item) => {
      obj[item.key] = item.localeLabel;
      return obj;
    }, {});
    scoreDataList.value = map(list, (item) => {
      return {
        ...item,
        value: `${item.score}/10`,
        label: item.name,
        color: getSeverity(item.score),
        localeLabel: scoreDataMap[item.name],
      };
    });
  };
  const getComponentDetail = async () => {
    try {
      const params = {
        id: route.query.id as string,
        resourceID: route.query.repositoryID as string,
        version: route.query.version as string,
      };
      const { data } = await queryComponentDetail(params);
      componentDetailInfo = assignIn(componentDetailInfo, data);
      // const data = detailData;
      // score
      score.value = get(data, 'project.scorecard.score') || -1;

      // scoreDataList
      const scoreCheckList =
        get(data, 'project.scorecard.check') || ([] as Array<ScoreCardItem>);
      setScoreDataList(scoreCheckList);
      // set basic Data
      basicDataList.value = componentInfoList.map((item) => {
        item.value = data[item.key] || '--';
        if (item.key === 'name') {
          const packageInfo = PackageURL.fromString(data.purl);
          if (data.purl) {
            item.value = packageInfo.namespace
              ? `${packageInfo.namespace}/${packageInfo.name}@${packageInfo.version}`
              : `${packageInfo.name}@${packageInfo.version}`;
          } else {
            item.value = data.name;
          }
        }
        return item;
      });

      // vulnerabilities data
      vulnerList.value = get(data, 'vulnerabilities') || [];

      // licenses data
      licenseList.value = get(data, 'licenses') || [];
    } catch (error) {
      console.log(error);
    }
  };
  onMounted(() => {
    getComponentDetail();
  });
</script>

<style lang="less" scoped>
  .components-detail-wrap {
    :deep(.arco-breadcrumb-item-separator) {
      margin: 0 0;
    }

    .g-title {
      margin-bottom: 10px;
      border-bottom: 1px solid #fff;

      .arco-link {
        line-height: 1;
      }

      .divider {
        border-left: 1px solid var(--color-neutral-3);
      }
    }

    .container {
      :deep(.arco-card-body) {
        padding: 20px 20px 20px 20px;
      }

      .content {
        :deep(.arco-card-body) {
          padding-bottom: 40px;
        }
      }
    }

    .pro-info {
      .pro-name {
        padding: 10px 15px;
        line-height: 1.5;
        background: var(--color-fill-1);
        border-radius: 4px;

        :deep(.arco-link) {
          display: block;
          font-size: 18px;
          text-align: center;
        }
      }
    }

    .ossf-wrap {
      margin-top: 10px;
      padding: 15px 10px 20px;
      background-color: var(--color-fill-1);
      border-radius: 4px;
    }

    .ossf {
      margin-bottom: 20px;
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      word-spacing: 8px;
    }

    .desc {
      margin-top: 20px;
      padding: 0 10px;
      font-size: 15px;
      line-height: 1.6;
    }

    :deep(.arco-breadcrumb-item) {
      color: var(--color-text-1);
      font-weight: 400;
    }

    .com-info {
      :deep(.arco-descriptions-body) {
        padding: 0;
        background-color: var(--color-fill-1);
        border: none;
        border-radius: var(--border-radius-medium);

        .arco-descriptions-table {
          border-collapse: separate;
          border-spacing: 10px;
        }

        // .arco-descriptions-item-value {
        //   font-weight: 500;
        // }
        .arco-descriptions-item {
          // background: #fff;
          padding: 0 10px;
          border-radius: var(--border-radius-medium);

          .pkg-name {
            font-weight: 700;
            font-size: 24px;
          }

          .pkg-version {
            padding: 0 20px;
          }
        }

        .arco-descriptions-item-label-inline {
          display: line-block;
          min-width: max-content;
        }
      }
    }
  }
</style>
