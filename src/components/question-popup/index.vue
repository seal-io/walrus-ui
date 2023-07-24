<template>
  <div class="box">
    <a-tag>
      <icon-bulb class="stroke-w-4" style="color: var(--color-text-3)" />
    </a-tag>
    <a-link
      v-if="!Array.isArray(link)"
      class="mleft-5 font-12"
      :href="link"
      :hoverable="true"
      target="_blank"
      >{{ $t('common.help.need') }}</a-link
    >
    <a-tooltip
      v-if="Array.isArray(link)"
      background-color="#fff"
      position="bottom"
      :content-style="{
        border: '1px solid var(--color-border-1)',
        padding: '5px 10px'
      }"
    >
      <a-link class="mleft-5 font-12" target="_blank">{{
        $t('common.help.need')
      }}</a-link>
      <template #content>
        <div>
          <div v-for="item in link" :key="item.url" style="line-height: 22px">
            <a-link
              :href="item.url"
              class="font-12"
              :hoverable="true"
              target="_blank"
              >{{ $t(item.label) }}</a-link
            >
          </div>
        </div>
      </template>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  interface Link {
    label: string;
    url: string;
  }
  defineProps({
    link: {
      type: [String, Array] as PropType<string | Link[]>,
      default: ''
    }
  });
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    align-items: center;
  }
</style>
