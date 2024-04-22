<template>
  <div class="container">
    <!-- <Breadcrumb :items="['menu.exception', 'menu.exception.404']" /> -->
    <div class="content">
      <a-result
        class="result"
        status="404"
        :subtitle="route.query.err || $t('exception.result.404.description')"
      >
      </a-result>
      <div class="operation-row">
        <a-button key="back" type="primary" @click="handleBack">
          {{ $t('exception.result.404.back') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useCallCommon from '@/hooks/use-call-common';

  const { router, route } = useCallCommon();

  const handleBack = () => {
    if (route.query.back) {
      router.replace({ name: route.query.back as string });
    } else {
      router.back();
    }
  };
</script>

<script lang="ts">
  export default {
    name: '404'
  };
</script>

<style scoped lang="less">
  .container {
    height: calc(100vh - 160px);
    padding: 0 20px 20px 20px;

    :deep(.content) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      background-color: var(--color-bg-1);
      border-radius: var(--border-radius-small);
    }
  }
</style>
