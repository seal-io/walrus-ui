<template>
  <div>
    <NavBar></NavBar>
    <ComCard>
      <a-result
        class="result"
        status="404"
        :subtitle="$t('exception.result.404.description')"
      >
      </a-result>
      <div class="operation-row">
        <a-button key="back" type="primary" @click="back">
          {{ $t('common.button.back') }}
        </a-button>
      </div>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import NavBar from '@/components/navbar/index.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const back = () => {
    // warning： Go to the node that has the permission
    router.back();
  };
</script>

<style scoped lang="less">
  .operation-row {
    text-align: center;
  }
</style>
