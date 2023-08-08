<template>
  <div class="template-item" @click="handleView">
    <div class="img-box">
      <span v-if="provider" class="icon-wrap">
        <span
          class="img"
          :style="{
            'background-image': `url(${provider})`
          }"
        ></span>
      </span>
      <span v-else class="icon-wrap">
        <IconFont type="icon-template-1"></IconFont>
      </span>
    </div>
    <div class="content">
      <div>
        <div class="title-wrap">
          <div class="title">
            <StatusLabel
              show-loading
              :size="12"
              :status="{
                status: get(dataInfo, 'status.summaryStatus') || '',
                text: '',
                message: '',
                transitioning: get(dataInfo, 'status.transitioning'),
                error: get(dataInfo, 'status.error')
              }"
            ></StatusLabel>
            <AutoTip :tooltip-props="{ content: dataInfo.name }">
              <a-link
                class="title-text"
                size="small"
                @click.stop="handleView"
                >{{ dataInfo.name }}</a-link
              >
            </AutoTip>
          </div>
          <div class="btn-wrap">
            <moreButtonActions
              v-if="actionList.length"
              :actions="actionList"
              @select="handleSelectAction"
            ></moreButtonActions>
          </div>
        </div>
        <div class="text">
          {{ dataInfo.description }}
        </div>
      </div>
    </div>
    <div class="info">
      <a-space :size="15">
        <span class="val"
          ><icon-clock-circle />
          <span class="val-item">{{
            dayjs(dataInfo.sync?.time || '').format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </span>
        <span class="val"
          ><i class="iconfont icon-database1"></i>
          <span class="val-item">{{ dataInfo.sync?.total }}</span></span
        >
        <span class="val"
          ><i class="iconfont icon-cloud-sync"></i>
          <span class="val-item">{{ dataInfo.sync.succeeded }}</span></span
        >
      </a-space>
    </div>
    <a-checkbox
      class="check-box"
      :value="dataInfo.id"
      :model-value="checked"
      @click.stop="() => {}"
      @change="handleCheckedChange"
    ></a-checkbox>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { OPERATIONHUB } from '@/router/config';
  import { PropType } from 'vue';
  import { toLower, get } from 'lodash';
  import { useRouter } from 'vue-router';
  import { MoreAction } from '@/views/config/interface';
  import moreButtonActions from '@/components/drop-button-group/more-button-actions.vue';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { CatalogRowData } from '../config/interface';

  const props = defineProps({
    provider: {
      type: String,
      default() {
        return '';
      }
    },
    actionList: {
      type: Array as PropType<MoreAction[]>,
      default() {
        return [];
      }
    },
    dataInfo: {
      type: Object as PropType<CatalogRowData>,
      default() {
        return {};
      }
    },
    checked: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const emits = defineEmits(['change', 'select']);
  const router = useRouter();

  const handleView = () => {
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      params: { action: 'view' },
      query: {
        id: props.dataInfo.id,
        name: props.dataInfo.name
      }
    });
  };

  const handleSelectAction = (val) => {
    emits('select', val);
  };
  const handleCheckedChange = (val) => {
    emits('change', val, props.dataInfo.id);
  };
</script>

<style lang="less" scoped>
  .border() {
    border: 1px solid transparent;
  }

  .template-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: inherit;
    height: 220px;
    padding: 10px;
    overflow: hidden;
    background-color: #fff;
    .thumbCard();

    &:hover {
      .thumbCardHover();

      color: inherit;
    }

    .btn-wrap {
      position: absolute;
      top: 8px;
      right: 30px;
      display: flex;
      justify-content: flex-end;
    }

    .img-box {
      flex-basis: 50px;

      .img {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      .icon-wrap {
        display: flex;
        padding: 0;
        background-color: #fff;
      }

      :deep(.arco-icon) {
        color: var(--sealblue-6);
        font-size: 46px;
        opacity: 0.8;
      }
    }

    .info {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .val {
        color: var(--color-text-3);
        opacity: 0.9;
      }

      .val-item {
        margin-left: 4px;
        color: var(--color-text-2);
      }
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 16px;

      .title-wrap {
        display: flex;
        justify-content: space-between;
      }

      .text {
        display: -webkit-box;
        overflow: hidden;
        line-height: 20px;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
      }

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        overflow: hidden;
        font-weight: 500;
        font-size: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;

        .title-text {
          display: inline;
          height: 21px;
          margin-left: 5px;
          font-size: 16px;
          line-height: 32px;
        }
      }
    }

    .arco-checkbox {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
