<template>
  <div>
    <BreadWrapper>
      <Breadcrumb :menu="{ icon: 'icon-apps', label: 'DAG' }"></Breadcrumb>
    </BreadWrapper>
    <ComCard>
      <DagEditor style="height: calc(100vh - 110px)"></DagEditor>
    </ComCard>
  </div>
</template>

<script lang="ts" setup>
  import DagEditor from '../dag-editor/index.vue';
</script>

<style lang="scss" scoped></style>
