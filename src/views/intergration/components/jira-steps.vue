<template>
  <div class="setting-steps-wrap">
    <a-space direction="vertical" :size="12" class="create-steps">
      <span class="cap-title">{{
        $t('intergration.createApp.title', { repo: capitalize(repo) })
      }}</span>
      <ul class="steps-wrap">
        <li>
          <span class="step">{{ $t('intergration.createApp.step1') }}</span>
        </li>
        <li>
          <div class="step">{{ $t('intergration.createApp.jira.step2') }}</div>
          <div class="step sub">{{
            $t('intergration.createApp.jira.step2.2')
          }}</div>
        </li>
        <li>
          <div class="step">{{ $t('intergration.createApp.jira.step3') }}</div>
          <div class="step sub">{{
            $t('intergration.createApp.jira.step3.1')
          }}</div>
          <div class="step sub">{{
            $t('intergration.createApp.jira.step3.2')
          }}</div>
          <div class="step sub">{{
            $t('intergration.createApp.jira.step3.3')
          }}</div>
        </li>
        <!-- <div class="step sub"
            >{{ $t('intergration.createApp.step2.3') }}
            <a-link>{{ homeUrl }}</a-link
            ><copy :content="homeUrl"></copy
          ></div> -->
        <li>
          <div class="step">{{ $t('intergration.createApp.jira.step4') }}</div>
          <div class="step sub"
            >{{ $t('intergration.createApp.jira.step4.1') }}
            <a-link>{{ callbackUrl }}</a-link>
            <copy :content="callbackUrl"></copy
          ></div>
        </li>
        <li>
          <span class="step">{{
            $t('intergration.createApp.jira.step5')
          }}</span>
        </li>
        <li>
          <span class="step">{{ $t('intergration.createApp.step4') }}</span>
        </li>
      </ul>

      <a-button
        type="outline"
        size="small"
        style="margin-top: 12px; text-transform: capitalize"
        @click="handleCreateToken"
      >
        <template #icon>
          <span
            class="repo-icon"
            :style="{ 'background-image': `url(${repoIcon[repo]})` }"
          ></span>
        </template>
        {{
          $t('intergration.createApp.button', { repo: capitalize(repo) })
        }}</a-button
      >
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { capitalize } from 'lodash';
  import { PropType } from 'vue';
  import copy from '@/components/copy/index.vue';
  import { repoIcon, imgItem } from '../config';

  const props = defineProps({
    repo: {
      type: String,
      default() {
        return 'x';
      },
    },
    callbackUrl: {
      type: String,
      default() {
        return '/';
      },
    },
    sourceInfo: {
      type: Object as PropType<imgItem>,
      default() {
        return {};
      },
    },
  });
  const homeUrl = window.location.origin;
  const handleCreateToken = () => {
    const url: any = props.sourceInfo.settingUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };
</script>

<style lang="less" scoped>
  .setting-steps-wrap {
    .steps-wrap {
      margin: 0;
      padding: 0 14px;

      li {
        font-size: 12px;
        font-family: inherit;
        line-height: 24px;
        list-style: auto;
      }
    }

    .create-steps {
      width: 100%;
      padding: 12px;
      font-size: 12px;
      background-color: var(--color-fill-2);
      border-radius: 2px;

      .step {
        &.sub {
          padding-left: 10px;
        }
      }
    }

    .repo-icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      vertical-align: -5px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  }
</style>
