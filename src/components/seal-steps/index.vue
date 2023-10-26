<template>
  <span class="steps-box">
    <span v-for="(item, index) in steps" :key="index" class="wrap">
      <span class="item" :class="[item.status]">
        <span class="title">
          <a-tooltip
            v-if="item.status === 'Error' && item.info"
            :content="item.info"
          >
            <icon-exclamation />
          </a-tooltip>
        </span>
      </span>
      <span
        v-if="index !== steps.length - 1"
        class="seperator"
        :class="[{ [item.status]: item.status !== 'Error' }]"
      ></span>
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';

  interface Step {
    title: string;
    info: string;
    status: string; // 'Ready' | 'Error' | 'Running' | 'Pending'
  }

  const props = defineProps({
    steps: {
      type: Array as PropType<Step[]>,
      default() {
        return [];
      }
    }
  });
</script>

<style lang="less" scoped>
  .steps-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .wrap {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;

      &:last-child {
        flex: initial;
      }
    }

    .seperator {
      flex: 1;
      height: 1px;
      margin: 0 6px;
      background-color: var(--color-border-2);

      &.Ready {
        color: #fff;
        background-color: var(--seal-color-success);
      }

      &.Error {
        color: #fff;
        background-color: var(--seal-color-error);
      }

      &.Running {
        color: #fff;
        background-color: var(--seal-color-warning);
      }

      &.Pending {
        color: #fff;
        background-color: var(--color-border-2);
      }
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      color: var(--color-text-2);
      font-size: 12px;
      background-color: var(--color-fill-3);
      border-radius: 50%;

      &.Ready {
        color: #fff;
        background-color: var(--seal-color-success);
      }

      &.Error {
        color: #fff;
        background-color: var(--seal-color-error);
      }

      &.Running {
        color: #fff;
        background-color: var(--seal-color-warning);
      }

      &.Pending {
        color: #fff;
        background-color: var(--color-fill-3);
      }

      .title {
        display: flex;
        font-size: 12px;
      }
    }
  }
</style>
