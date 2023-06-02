<template>
  <span class="label-wrapper">
    <a-link
      v-if="
        userStore.hasProjectResourceActions({
          projectID: projectId,
          resource: Resources.ApplicationInstances,
          actions: ['GET']
        })
      "
      style="display: inline"
      @click="handleViewInstance"
    >
      <span class="dot" :class="[get(statusMap, status) || status]"></span>
      <slot name="label"
        ><span>{{ label }}</span></slot
      >
    </a-link>
    <span v-else style="padding: 1px 4px">
      <span class="dot" :class="[get(statusMap, status) || status]"></span>
      <slot name="label"
        ><span>{{ label }}</span></slot
      >
    </span>
  </span>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Resources } from '@/permissions/config';

  const props = defineProps({
    status: {
      type: String,
      default() {
        return 'running';
      }
    },
    label: {
      type: String,
      default() {
        return '';
      }
    },
    statusMap: {
      type: Object, // {running: string, warning: string, error: string}
      default() {
        return {};
      }
    },
    instanceId: {
      type: String,
      default() {
        return '';
      }
    },
    applicationId: {
      type: String,
      default() {
        return '';
      }
    },
    projectId: {
      type: String,
      default() {
        return '';
      }
    }
  });
  const userStore = useUserStore();
  const router = useRouter();
  const handleViewInstance = () => {
    router.push({
      name: 'ApplicationsDetail',
      params: {
        projectId: props.projectId,
        action: 'view'
      },
      query: {
        id: props.applicationId,
        instanceId: props.instanceId
      }
    });
  };
</script>

<style lang="less" scoped>
  .label-wrapper {
    padding: 2px;
    background-color: var(--seal-color-bg);
    border-radius: 2px;

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
      border-radius: 50%;

      &.running {
        background-color: var(--seal-color-success);
      }

      &.warning {
        background-color: var(--seal-color-warning);
      }

      &.error {
        background-color: var(--seal-color-error);
      }
    }
  }
</style>
