<template>
  <div>
    <mavenGuideEn
      v-if="lang === 'en'"
      :proxy-name="proxyName"
      :upstream-url="upstreamUrl || ''"
      :proxy-url="proxyUrl"
    ></mavenGuideEn>
    <mavenGuideZh
      v-if="lang === 'zh'"
      :proxy-name="proxyName"
      :upstream-url="upstreamUrl || ''"
      :proxy-url="proxyUrl"
    ></mavenGuideZh>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import mavenGuideEn from './maven-guide-en.vue';
  import mavenGuideZh from './maven-guide-zh.vue';

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
