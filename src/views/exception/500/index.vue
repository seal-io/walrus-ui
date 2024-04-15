<template>
  <div class="container">
    <!-- <Breadcrumb :items="['menu.exception', 'menu.exception.500']" /> -->
    <div class="content">
      <a-result
        class="result"
        status="500"
        :subtitle="$t('exception.result.500.description')"
      />
      <a-button key="back" type="primary" @click="handleBack">
        {{ $t('exception.result.500.back') }}
      </a-button>
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
    name: '500'
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
