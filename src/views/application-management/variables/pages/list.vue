<template>
  <div>
    <TableList :scope="VariableScope.PROJECT"></TableList>
  </div>
</template>

<script lang="ts" setup>
  import TableList from '../components/table-list.vue';
  import { VariableScope } from '../config';
</script>
