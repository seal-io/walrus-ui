<template>
  <div>
    <NavBar></NavBar>
    <!-- <Breadcrumb :items="['menu.exception', 'menu.exception.403']" /> -->
    <ComCard class="content-wrap">
      <div class="content">
        <a-result
          class="result"
          status="403"
          :subtitle="route.query.err || $t('exception.result.403.description')"
        />
        <div class="operation-row">
          <a-button key="back" type="primary" @click="handleBack">
            {{ $t('exception.result.403.back') }}
          </a-button>
        </div>
      </div>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import NavBar from '@/components/navbar/index.vue';
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
    name: '403'
  };
</script>

<style scoped lang="less">
  .content-wrap {
    height: calc(100vh - 48px);
    background-color: var(--color-white);
  }

  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background-color: var(--color-bg-1);
    border-radius: var(--border-radius-small);

    .operation-row {
      text-align: center;
    }
  }
</style>
