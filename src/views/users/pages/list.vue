<template>
  <div>
    <BreadWrapper>
      <Breadcrumb
        :menu="{
          icon: 'icon-users-o',
          iconfont: true,
          label: $t('menu.systemsettings.user')
        }"
      ></Breadcrumb>
    </BreadWrapper>
    <ComCard padding="0">
      <HeaderInfo :info="{ name: $t('menu.systemsettings.user') }">
        <template #icon>
          <i class="iconfont icon-users"></i>
        </template>
      </HeaderInfo>
      <ComCard>
        <Users></Users>
      </ComCard>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import { USERS } from '@/router/config';
  import { QAlinkMap } from '@/views/config';
  import QuestionPopup from '@/components/question-popup/index.vue';
  import HeaderInfo from '@/components/header-info/index.vue';
  import Users from '@/views/system/pages/users.vue';
</script>

<script lang="ts">
  export default {
    name: USERS.List
  };
</script>
