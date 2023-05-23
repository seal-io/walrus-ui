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
                status: get(dataInfo, 'status'),
                text: '',
                message: '',
                transitioning: get(dataInfo, 'status') === 'Initializing',
                error: get(dataInfo, 'status') === 'Error'
              }"
            ></StatusLabel>
            <AutoTip :tooltip-props="{ content: dataInfo.id }">
              <a-link
                class="title-text"
                size="small"
                @click.stop="handleView"
                >{{ dataInfo.id }}</a-link
              >
            </AutoTip>
          </div>
          <div class="btn-wrap">
            <a-dropdown
              size="small"
              style="line-height: 30px"
              position="bl"
              @select="handleSelectAction"
            >
              <a-link size="mini" @click.stop="() => {}">
                <template #icon
                  ><icon-more
                    style="margin-right: 0; font-size: 18px; stroke-width: 5"
                /></template>
              </a-link>
              <template #content>
                <a-doption
                  v-for="(item, index) in actionList"
                  :key="index"
                  :value="item.value"
                  :style="{
                    lineHeight: '28px',
                    color: 'var(--color-text-2)'
                  }"
                >
                  <component
                    :is="item.icon"
                    style="margin-right: 8px"
                  ></component
                  >{{ $t(item.label) }}
                </a-doption>
              </template>
            </a-dropdown>
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
  import { PropType } from 'vue';
  import { toLower, get } from 'lodash';
  import { useRouter } from 'vue-router';
  import { execSucceed } from '@/utils/monitor';
  import StatusLabel from '../../connectors/components/status-label.vue';
  import { TemplateRowData } from '../config/interface';
  import { actionList } from '../config';
  import { refreshModules } from '../api';

  const props = defineProps({
    provider: {
      type: String,
      default() {
        return '';
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
      name: 'TemplateDetail',
      params: { action: 'edit' },
      query: {
        id: props.dataInfo.id
      }
    });
  };
  const handleView = () => {
    router.push({
      name: 'TemplateDetail',
      params: { action: 'view' },
      query: {
        id: props.dataInfo.id
      }
    });
  };
  const handleRefresh = async () => {
    try {
      await refreshModules({ id: props.dataInfo.id });
      execSucceed();
    } catch (error) {
      console.log(error);
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
    console.log('val:', val);
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
      padding: 10px 8px;
      background-color: var(--color-primary-light-1);

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
        overflow: hidden;
        background-color: #fff;
        border-radius: 50%;
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
      // margin-left: 10px;
      padding: 10px 25px 10px 10px;

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
      right: 5px;
    }
  }
</style>
