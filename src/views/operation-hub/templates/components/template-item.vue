<template>
  <div class="template-item" @click="handleEditTemplate">
    <div class="img-box">
      <span
        class="img"
        :style="{
          'background-image': `url(${repoIcon[toLower(provider)]})`
        }"
      ></span>
    </div>
    <div class="content">
      <div class="text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
        deleniti sapiente quos ad maxime? Dignissimos natus nobis itaque
        molestiae ab tempore, assumenda numquam, aut corporis deleniti maxime
        delectus blanditiis cupiditate?
      </div>
      <a-button
        type="primary"
        size="small"
        style="width: 88px; margin-top: 10px"
        @click="handleEditTemplate"
        >{{ $t('common.button.edit') }}</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { toLower } from 'lodash';
  import { repoIcon } from '@/components/provider-icon/config';
  import { useRouter } from 'vue-router';

  defineProps({
    provider: {
      type: String,
      default() {
        return '';
      }
    }
  });

  const router = useRouter();
  const handleEditTemplate = () => {
    router.push({
      name: 'templateDetail'
    });
  };
</script>

<style lang="less" scoped>
  .template-item {
    display: flex;
    height: 140px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid transparent;
    box-shadow: 0 0 4px var(--color-border-2);
    .thumbCard();

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
    }
  }
</style>
