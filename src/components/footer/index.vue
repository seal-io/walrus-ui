<template>
  <a-layout-footer class="footer">
    <div class="content-wrap">
      <a-space direction="vertical" :size="4">
        <a-space class="box">
          <a-link
            v-for="(item, index) in footerLinks"
            :key="index"
            :href="item.value"
            target="_blank"
            class="item"
            >{{ $t(item.label) }}</a-link
          >
          <a-link class="item" @click="handleShowVersion">{{
            getVersion(get(versionInfo, 'server'))
          }}</a-link>
        </a-space>
        <div class="copy-right"
          >&copy;{{ new Date().getFullYear() }}
          {{ $t('settings.company') }}</div
        >
      </a-space>
    </div>
  </a-layout-footer>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import { ref, onMounted } from 'vue';
  import {
    useAppVersion,
    showVersionModal,
    versionData,
    getVersion
  } from '@/hooks/fetch-app-version';

  const versionInfo = ref({});
  const footerLinks = [
    { label: 'settings.help', value: 'https://seal-io.github.io/docs/' }
    // { label: 'settings.document', value: 'https://seal-io.github.io/docs/' },
    // { label: 'settings.privacy', value: 'provite' },
    // { label: 'settings.policies', value: 'policy' },
  ];
  const getAppVersion = async () => {
    versionInfo.value = await useAppVersion();
  };
  const handleShowVersion = () => {
    showVersionModal(versionInfo.value as versionData);
  };
  onMounted(() => {
    getAppVersion();
  });
</script>

<style lang="less" scoped>
  @footer-height: 56px;

  .footer {
    height: @footer-height;
    color: var(--color-text-2);
    text-align: center;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    background-color: #fff;

    .box {
    }

    .content-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .version {
      margin-left: 10px;
      color: rgb(var(--arcoblue-6));
      cursor: pointer;

      &:hover {
        color: rgba(var(--arcoblue-6), 0.8);
      }
    }
  }
</style>
