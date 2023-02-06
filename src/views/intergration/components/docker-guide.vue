<template>
  <div>
    <dockerGuideEn
      v-if="lang === 'en'"
      :proxy-name="proxyName"
      :upstream-url="upstreamUrl || ''"
      :proxy-url="proxyUrl"
    ></dockerGuideEn>
    <dockerGuideZh
      v-if="lang === 'zh'"
      :proxy-name="proxyName"
      :upstream-url="upstreamUrl || ''"
      :proxy-url="proxyUrl"
    ></dockerGuideZh>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dockerGuideEn from './docker-guide-en.vue';
  import dockerGuideZh from './docker-guide-zh.vue';

  defineProps({
    proxyName: {
      type: String,
      default() {
        return '';
      },
    },
    proxyUrl: {
      type: String,
      default() {
        return '';
      },
    },
    upstreamUrl: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const { locale } = useI18n();
  const lang = computed(() => {
    return locale.value === 'zh-CN' ? 'zh' : 'en';
  });
</script>

<style></style>
