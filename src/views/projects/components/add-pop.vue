<template>
  <div class="add-pop-wrap">
    <a-grid :cols="cols">
      <a-grid-item
        v-for="item in repoMapList"
        v-show="repoMapList.length"
        :key="item.provider"
        @click="handleClickRepoConfig(item)"
      >
        <div class="btn-item">
          <span
            class="img"
            :style="{ 'background-image': `url(${repoIcon[item.provider]})` }"
          ></span>
          <span class="text">{{
            item.langFormat ? $t(item.text) : item.text
          }}</span>
        </div>
      </a-grid-item>
      <a-grid-item @click="handleToIntegration">
        <div class="btn-item">
          <span class="img icon">
            <icon-plus />
          </span>
          <span class="text">{{ $t('projects.table.other') }}</span>
        </div>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { repoIcon } from '@/views/intergration/config';
  import { PopupItem } from '../config/interface';

  const props = defineProps({
    repoMapList: {
      type: Array as PropType<PopupItem[]>,
      default() {
        return [];
      },
    },
  });
  const emits = defineEmits(['click']);
  const router = useRouter();
  const cols = computed(() => {
    return props.repoMapList.length + 1;
  });
  const handleToIntegration = () => {
    router.push({
      name: 'allIntegration',
    });
  };
  const handleToPublic = () => {
    router.push({
      name: 'publicRepo',
    });
  };
  const handleClickRepoConfig = (item: PopupItem) => {
    // if (['dockerhub', 'oci'].includes(item.provider)) {
    //   emits('click', item);
    //   return;
    // }
    if (!item.page) {
      emits('click', item);
      return;
    }
    router.push({
      name: item.page as string,
      query: {
        id: item.id,
      },
    });
  };
</script>

<style lang="less" scoped>
  .add-pop-wrap {
    :deep(.arco-grid-item) {
      border-right: 1px solid var(--seal-border-gray);

      &:last-child {
        border-right: none;
      }

      cursor: pointer;

      &:hover {
        background-color: var(--color-fill-2);
      }

      &:last-child .btn-item {
        border-right: none;
      }

      .btn-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        // border-right: 1px solid var(--seal-border-gray);
      }

      .text {
        display: inline-block;
        box-sizing: border-box;
        width: 50px;
        margin-top: 10px;
        // line-height: 20px;
        text-align: center;
        text-transform: capitalize;
        word-break: break-word;
      }

      .img {
        display: inline-block;
        width: 40px;
        height: 40px;
        // margin-bottom: 10px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;

        &.github {
          background-image: url('../../intergration/images/github.png');
        }

        &.gitlab {
          background-image: url('../../intergration/images/gitlab.png');
        }

        &.icon {
          font-size: 40px;
        }
      }
    }
  }
</style>
