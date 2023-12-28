<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{ icon: 'icon-settings', label: $t('menu.systemsettings') }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.systemsettings') }">
        <template #icon>
          <i class="iconfont icon-custom"></i>
        </template>
      </HeaderInfo>
      <ComCard padding="0 var(--card-content-padding) 20px">
        <Settings></Settings>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { QAlinkMap } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Settings from './setting.vue';
</script>
