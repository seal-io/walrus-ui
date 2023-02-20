<template>
  <div class="thumb-wrapper">
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
  import { ref } from 'vue';
  import thumbButton from '@/components/buttons/thumb-button.vue';
  import TemplateItem from './template-item.vue';

  const templateTypeList = ref<{ label: string; value: string }[]>([]);
  const emits = defineEmits(['create']);
  const handleCreateTemplate = () => {
    emits('create');
  };
</script>

<style></style>
