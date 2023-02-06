<template>
  <div class="setting-steps-wrap">
    <a-space direction="vertical" :size="12" class="create-steps">
      <div class="cap-title">{{
        $t('intergration.createApp.title', { repo: capitalize(repo) })
      }}</div>
      <div class="sub-title">{{
        $t('intergration.jira.private.token.title')
      }}</div>
      <ul class="steps-wrap">
        <li>
          <div class="step">{{
            $t('intergration.jira.private.token.step1')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.token.step1.0')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.token.step1.1')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.token.step1.3')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.token.step1.4')
          }}</div>
        </li>
      </ul>
      <div class="sub-title">{{
        $t('intergration.jira.private.oauth2.title')
      }}</div>
      <ul class="steps-wrap">
        <li>
          <div class="step">{{
            $t('intergration.jira.private.token.step1.0')
          }}</div>
          <div class="step">{{
            $t('intergration.jira.private.token.step1.1')
          }}</div>
        </li>
        <li>
          <div class="step">{{
            $t('intergration.jira.private.oauth2.step2')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.oauth2.step2.1')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.oauth2.step2.2')
          }}</div>
        </li>
        <li>
          <div class="step">{{
            $t('intergration.jira.private.oauth2.step3')
          }}</div>
          <div class="step sub">{{
            $t('intergration.jira.private.oauth2.step3.1')
          }}</div>
          <div class="step sub"
            >{{ $t('intergration.jira.private.oauth2.step3.2')
            }}<a-link>{{ callbackUrl }}</a-link>
            <copy :content="callbackUrl"></copy
          ></div>
        </li>
        <li>
          <div class="step">{{
            $t('intergration.jira.private.oauth2.step4')
          }}</div>
        </li>
        <li>
          <div class="step">{{
            $t('intergration.jira.private.oauth2.step5')
          }}</div>
        </li>
      </ul>

      <a-button
        type="outline"
        size="small"
        :disabled="!isPrivate || !privateUrl"
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
    isPrivate: {
      type: Boolean,
      default() {
        return true;
      },
    },
    privateUrl: {
      type: String,
      default() {
        return '';
      },
    },
    // ['private_oauth2', 'private_access_token'];
    type: {
      type: String,
      default() {
        return 'private_oauth2';
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
    let url: any = props.privateUrl;
    if (props.type === 'private_access_token') {
      url = `${url}//secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens`;
    } else if (props.type === 'private_oauth2') {
      url = `${url}/plugins/servlet/applinks/listApplicationLinks`;
    }
    if (url) {
      window.open(url, '_blank');
    }
  };
</script>

<style lang="less" scoped>
  .setting-steps-wrap {
    .sub-title {
      font-weight: 700;
    }

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
          // padding-left: 10px;
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
