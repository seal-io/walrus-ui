<template>
  <div class="list-box">
    <ThumbCard
      v-for="(item, index) in dataList"
      :key="index"
      class="item"
      :active="item.name === currentName"
      @click="() => handleClick(item)"
    >
      <span class="img">
        <img :src="joinUrl(item.icon)" alt="" />
      </span>
      <span class="text">
        <span class="title">
          <AutoTip>
            {{ item.name }}
          </AutoTip>
        </span>
        <a-link class="readme-btn" @click.stop="() => handleShowReadme(item)"
          >readme</a-link
        >
      </span>
    </ThumbCard>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref, watch } from 'vue';
  import ThumbCard from '@/components/thumb-card/index.vue';

  const props = defineProps({
    dataList: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      }
    },
    refresh: {
      type: Number,
      default: 0
    }
  });
  const serverUrl = window.location.origin;
  const emits = defineEmits(['select', 'showReadme']);
  const currentName = ref('');

  const joinUrl = (path) => {
    const url = new URL(path, `${serverUrl}/walrus-file-hub/`);
    return url.href;
  };
  const handleClick = (item) => {
    if (currentName.value === item.name) {
      return;
    }
    currentName.value = item.name;
    emits('select', item);
  };
  const handleShowReadme = (item) => {
    currentName.value = item.name;
    emits('showReadme', item);
  };
  watch(
    () => props.refresh,
    () => {
      currentName.value = '';
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped>
  .list-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 15px;
    font-size: var(--font-size-small);

    .item {
      position: relative;
      display: flex;
      align-items: center;
      width: 200px;
      height: 100px;
      margin-bottom: 10px;
      padding: 10px;
      background-color: var(--color-white-1);

      .text {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 115px;
        margin-left: 10px;
      }

      .title {
        width: 100%;
        margin-bottom: 5px;
        font-size: var(--font-size-medium);
        text-align: left;
      }

      .img {
        display: flex;
        width: 50px;
        height: 50px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .readme-btn {
        justify-content: flex-start;
        width: fit-content;
        padding: 0;
      }
    }
  }
</style>
