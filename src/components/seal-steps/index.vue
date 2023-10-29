<template>
  <div class="steps-box">
    <div v-for="(item, index) in steps" :key="index" class="wrap">
      <a-tooltip
        :content="
          item.status === 'Error' && item.info
            ? `${item.title}: ${item.info}`
            : item.title
        "
      >
        <span class="label">{{ item.title }}</span>
      </a-tooltip>
      <span
        class="item"
        :class="{ [item.status]: true, last: index === steps.length - 1 }"
      >
        <span class="title">
          <!-- <a-tooltip
            v-if="item.status === 'Error' && item.info"
            :content="item.info"
          >
            <icon-exclamation />
          </a-tooltip> -->
        </span>
      </span>
      <!-- <span
        v-if="index !== steps.length - 1"
        class="seperator"
        :class="[{ [item.status]: item.status !== 'Error' }]"
      ></span> -->
    </div>
  </div>
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

    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 45px;
      margin-right: 5px;

      .label {
        width: 50px;
        margin-bottom: 5px;
        padding: 0 4px;
        overflow: hidden;
        color: var(--color-text-2);
        font-size: 12px;
        white-space: nowrap;
        text-align: center;
        text-overflow: ellipsis;
      }

      &:last-child {
        flex: initial;
      }
    }

    .seperator {
      flex: 1;
      min-width: 20px;
      max-width: 60px;
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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 8px;
      height: 8px;
      color: var(--color-text-2);
      font-size: 12px;
      background-color: var(--color-fill-3);
      border-radius: 50%;

      &::after {
        position: absolute;
        left: 10px;
        display: inline-block;
        width: 39px;
        height: 1px;
        background-color: var(--color-border-2);
        content: '';
      }

      &.last::after {
        display: none;
      }

      &.Ready {
        color: #fff;
        background-color: var(--seal-color-success);

        &::after {
          background-color: var(--seal-color-success);
        }
      }

      &.Error {
        color: #fff;
        background-color: var(--seal-color-error);

        &::after {
          background-color: var(--seal-color-error);
        }
      }

      &.Running {
        color: #fff;
        background-color: var(--seal-color-warning);

        &::after {
          background-color: var(--seal-color-warning);
        }
      }

      &.Pending {
        color: #fff;
        background-color: var(--color-fill-3);

        &::after {
          background-color: var(--color-border-2);
        }
      }

      .title {
        display: flex;
        font-size: 12px;
      }
    }
  }
</style>
