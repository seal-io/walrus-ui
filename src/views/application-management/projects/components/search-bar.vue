<template>
  <div class="list-view-wrap">
    <!-- <FilterBox>
      <template #params>
        <a-input v-model="queryParams.fullName" allow-clear style="width: 240px"
          :placeholder="$t('resource.list.holder.name')" @clear="handlerSearch" @change="handlerSearch"
          @press-enter="handlerSearch">
          <template #prefix>
            <icon-search />
          </template>
        </a-input>
        <a-button type="primary" status="warning">{{ $t('common.button.delete') }}</a-button>
      </template>
    </FilterBox> -->
  </div>
</template>

<script lang="ts" setup>
  import FilterBox from '@/components/filter-box/index.vue';
</script>

<style></style>
