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
  import { OPERATIONHUB } from '@/router/config';
  import { PropType, ref, watch } from 'vue';
  import { MoreAction } from '@/views/config/interface';
  import { toLower, get } from 'lodash';
  import { useRouter } from 'vue-router';
  import { execSucceed } from '@/utils/monitor';
  import moreButtonActions from '@/components/drop-button-group/more-button-actions.vue';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { TemplateRowData } from '../config/interface';

  import { refreshTemplate } from '../api';

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
      type: Object as PropType<TemplateRowData>,
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

  const emits = defineEmits(['change', 'refresh']);
  const router = useRouter();
  const handleEditTemplate = () => {
    router.push({
      name: OPERATIONHUB.TemplateDetail,
      params: { action: 'edit' },
      query: {
        id: props.dataInfo.id,
        name: props.dataInfo.name
      }
    });
  };
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
  const handleRefresh = async () => {
    try {
      await refreshTemplate({ id: props.dataInfo.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleSelectAction = (val) => {
    if (val === 'edit') {
      handleEditTemplate();
    }
    if (val === 'refresh') {
      handleRefresh();
    }
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
    width: inherit;
    height: 140px;
    overflow: hidden;
    // padding: 10px 25px 10px 10px;
    background-color: #fff;
    .thumbCard();

    &:hover {
      .thumbCardHover();

      color: inherit;
    }

    .btn-wrap {
      position: relative;
      top: -4px;
      display: flex;
      justify-content: flex-end;
    }

    .img-box {
      flex-basis: 50px;
      padding: 10px;
      // background-color: var(--color-primary-light-1);
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
        // overflow: hidden;
        background-color: #fff;
        // border-radius: 50%;
        // box-shadow: 0 0 16px 4px var(--color-border-2);
      }

      :deep(.arco-icon) {
        color: var(--sealblue-6);
        font-size: 46px;
        opacity: 0.8;
      }
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      width: calc(100% - 80px);
      padding: 10px 25px 10px 6px;

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
