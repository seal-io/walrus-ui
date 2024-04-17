<template>
  <TableList :scope="VariableScope.SYSTEM"></TableList>
</template>

<script lang="ts" setup>
  import TableList from '@/views/application-management/variables/components/table-list.vue';
  import { VariableScope } from '@/views/application-management/variables/config';
</script>

<style lang="less" scoped></style>
