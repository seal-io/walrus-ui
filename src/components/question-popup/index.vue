<template>
  <div class="box">
    <a-tag>
      <icon-bulb class="stroke-w-4" style="color: var(--color-text-3)" />
    </a-tag>
    <a-link
      v-if="link.length === 1"
      class="mleft-5 font-12"
      :href="get(link[0], currentLocale)"
      :hoverable="true"
      target="_blank"
      >{{ $t('common.help.need') }}</a-link
    >
    <a-tooltip
      v-if="link.length > 1"
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
          <div
            v-for="(item, index) in link"
            :key="index"
            style="line-height: 22px"
          >
            <a-link
              :href="item[currentLocale]"
              class="font-12"
              :hoverable="true"
              target="_blank"
              >{{ $t(item.label || '') }}</a-link
            >
          </div>
        </div>
      </template>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import useLocale from '@/hooks/locale';
  import { PropType } from 'vue';

  interface Link {
    'label'?: string;
    'zh-CN': string;
    'en-US': string;
  }
  defineProps({
    link: {
      type: Array as PropType<Link[]>,
      default() {
        return [];
      }
    }
  });

  const { currentLocale } = useLocale();
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    align-items: center;
    width: max-content;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-large);
  }
</style>
