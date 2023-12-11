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
            <i
              v-if="_.get(dataInfo, ['labels', 'walrus.seal.io/category'])"
              class="iconfont icon-shandian in-used mleft-5"
              style="color: var(--seal-color-success)"
            ></i>
            <AutoTip :tooltip-props="{ content: dataInfo.name }">
              <a-link
                class="title-text"
                size="small"
                @click.stop="handleView"
                >{{ dataInfo.name }}</a-link
              >
            </AutoTip>
          </div>
          <span class="btn-wrap">
            <moreButtonActions
              v-if="actionList.length"
              :actions="selectActions"
              @select="handleSelectAction"
            ></moreButtonActions>
          </span>
        </div>
        <div class="text">
          {{ dataInfo.description }}
        </div>
      </div>
    </div>

    <a-checkbox
      v-if="showCheckbox"
      class="check-box"
      :value="dataInfo.id"
      :model-value="checked"
      @click.stop="() => {}"
      @change="handleCheckedChange"
    ></a-checkbox>
  </div>
</template>

<script lang="ts" setup>
  import _, { toLower, get } from 'lodash';
  import { PropType, computed, ref, watch } from 'vue';
  import { MoreAction } from '@/views/config/interface';
  import { useRouter } from 'vue-router';
  import { execSucceed } from '@/utils/monitor';
  import moreButtonActions from '@/components/drop-button-group/more-button-actions.vue';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { TemplateRowData } from '../config/interface';
  import { refreshTemplate, updateTemplate } from '../api';

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
    showCheckbox: {
      type: Boolean,
      default() {
        return true;
      }
    },
    checked: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const emits = defineEmits(['change', 'refresh', 'edit', 'view', 'delete']);
  const router = useRouter();

  const selectActions = computed(() => {
    return props.actionList.map((item) => {
      if (item.value === 'useInService') {
        return {
          ...item,
          label:
            toLower(
              get(props.dataInfo, ['labels', 'walrus.seal.io/category'])
            ) === 'service'
              ? 'operation.templates.button.cancelUseInService'
              : 'operation.templates.button.useInservice'
        };
      }
      return {
        ...item
      };
    });
  });
  const handleEditTemplate = () => {
    emits('edit');
  };
  const handleView = () => {
    emits('view');
  };
  const handleRefresh = async () => {
    try {
      await refreshTemplate({ id: props.dataInfo.id });
      execSucceed();
    } catch (error) {
      // ignore
    }
  };
  const handleUseInService = async () => {
    try {
      const data = {
        ...props.dataInfo,
        labels: {
          'walrus.seal.io/category':
            _.get(props.dataInfo, ['labels', 'walrus.seal.io/category']) ===
            'service'
              ? ''
              : 'service'
        }
      };
      await updateTemplate(data);
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
    if (val === 'useInService') {
      handleUseInService();
    }
    if (val === 'delete') {
      emits('delete');
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
      top: -5px;
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

    // .in-used {
    //   position: absolute;
    //   top: 30px;
    //   right: 10px;
    // }
  }
</style>
