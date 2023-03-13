<template>
  <div class="template-item">
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
        <div class="title">{{ dataInfo.id }}</div>
        <div class="text">
          {{ dataInfo.description }}
        </div>
      </div>
      <a-button
        type="primary"
        size="small"
        style="width: 88px; margin-top: 10px"
        @click="handleEditTemplate"
      >
        <template #icon>
          <icon-edit></icon-edit>
        </template>
        {{ $t('common.button.edit') }}
      </a-button>
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
  import { toLower } from 'lodash';
  import { repoIcon } from '@/components/provider-icon/config';
  import { useRouter } from 'vue-router';
  import { TemplateRowData } from '../config/interface';

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

  const emits = defineEmits(['change']);
  const router = useRouter();
  const handleEditTemplate = () => {
    // router.push({
    //   name: 'templateDetail',
    //   query: {
    //     id: props.dataInfo.id
    //   }
    // });
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
      margin-left: 10px;

      .text {
        display: -webkit-box;
        overflow: hidden;
        line-height: 20px;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
      }

      .title {
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 16px;
      }
    }

    .arco-checkbox {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
</style>
