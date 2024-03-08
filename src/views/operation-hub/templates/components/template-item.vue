<template>
  <div
    class="template-item"
    :class="{ dark: appStore.theme === 'dark' }"
    @click="handleView"
  >
    <div class="img-box">
      <span v-if="provider" class="icon-wrap">
        <span class="img">
          <img :src="provider" alt="" @error="handleLoadImgError" />
        </span>
      </span>
      <span v-else class="icon-wrap">
        <i class="iconfont icon-template-1"></i>
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
            <AutoTip>
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
              trigger="hover"
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
  import TemplateImg from '@/assets/images/template.png';
  import { PropType, computed, ref, watch } from 'vue';
  import { MoreAction } from '@/views/config/interface';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/store';
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
  const appStore = useAppStore();

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

  const handleLoadImgError = (e) => {
    e.target.src = TemplateImg;
  };
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
    .thumbCard();

    &:hover {
      .thumbCardHover();

      color: inherit;
    }

    .btn-wrap {
      position: relative;
      top: -5px;
      right: 2px;
      margin-left: 10px;
    }

    // &.dark {
    //   .img {
    //     filter: invert(1) hue-rotate(180deg);
    //   }
    // }
    .img-box {
      flex-basis: 50px;
      padding: 16px;

      .img {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .icon-wrap {
        display: flex;
        padding: 0;
        background-color: var(--color-white-1);

        .iconfont {
          color: rgb(var(--primary-5));
          font-size: 50px !important;
        }
      }

      :deep(.arco-icon) {
        color: rgb(var(--primary-5));
        font-size: 46px;
      }
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      width: calc(100% - 80px);
      padding: 16px 30px 16px 0;

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
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-large);
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
      top: 16px;
      right: 14px;
    }
  }
</style>
