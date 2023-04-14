<template>
  <div class="template-item" @click="handleView">
    <div class="img-box">
      <span
        v-if="provider"
        class="img"
        :style="{
          'background-image': `url(${provider})`
        }"
      ></span>
      <IconFont v-else type="icon-template-1"></IconFont>
    </div>
    <div class="content">
      <div>
        <div class="title-wrap">
          <div class="title">
            <StatusLabel
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
                @click.stop="handleEditTemplate"
                >{{ dataInfo.id }}</a-link
              >
            </AutoTip>
          </div>
          <div class="btn-wrap">
            <a-dropdown>
              <a-link size="mini" @click.stop="() => {}">
                <template #icon
                  ><icon-more
                    style="margin-right: 0; font-size: 18px; stroke-width: 5"
                /></template>
              </a-link>
              <template #content>
                <a-doption>
                  <a-tooltip :content="$t('common.button.edit')">
                    <a-link @click="handleEditTemplate">
                      <template #icon>
                        <icon-edit></icon-edit>
                      </template>
                    </a-link>
                  </a-tooltip>
                </a-doption>
                <a-doption>
                  <a-tooltip :content="$t('common.button.refresh')">
                    <a-link @click="handleRefresh">
                      <template #icon>
                        <icon-refresh />
                      </template>
                    </a-link>
                  </a-tooltip>
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
    padding: 10px 25px 10px 10px;
    background-color: #fff;
    box-shadow: 0 0 2px var(--color-border-3);
    .thumbCard();
    .border();

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

      .img {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
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
      margin-left: 10px;

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
