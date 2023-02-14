<template>
  <div class="templates">
    <a-grid :cols="24" :col-gap="15" :row-gap="15">
      <a-grid-item
        v-for="item in templateTypeList"
        :key="item.value"
        :span="{ lg: 6, md: 8, sm: 12, xs: 24 }"
      >
        <TemplateItem :provider="item.value"></TemplateItem>
      </a-grid-item>
      <a-grid-item :span="{ lg: 6, md: 8, sm: 12, xs: 24 }">
        <thumbButton @click="handleCreateTemplate"></thumbButton>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script lang="ts" setup>
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import { useRouter } from 'vue-router';
  import TemplateItem from '../components/template-item.vue';
  import { templateTypeList } from '../config';

  const router = useRouter();
  const handleCreateTemplate = () => {
    router.push({
      name: 'templateDetail'
    });
  };
</script>

<style lang="less" scoped>
  .templates {
    margin-top: 20px;
    padding-right: 2px;
  }
</style>
