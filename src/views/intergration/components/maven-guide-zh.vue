<template>
  <div class="container">
    <a-typography>
      <a-typography-paragraph>
        现在，您可以使用<span class="marker">{{ proxyUrl }}</span
        >拉取或推送Java构建物。Seal
        将会对拉取或推送的构建物进行策略扫描以确保其符合预期。
      </a-typography-paragraph>
      <a-typography-title :heading="6"
        >1. 使用
        <a-link href="https://maven.apache.org" target="_blank">Maven</a-link>
        客户端拉取构建物</a-typography-title
      >
      <a-typography-paragraph>
        <div
          >您需要在 Maven 全局配置文件中配置<a-link
            :href="mirrorUrl"
            target="_blank"
            >使用仓库镜像地址</a-link
          >。</div
        >
      </a-typography-paragraph>
      <highlight-block :code="settingsInfo"></highlight-block>
      <a-typography-paragraph>
        如果 <span class="marker">{{ upstreamUrl }}</span> 能够代理到多个上游
        Maven 仓库地址（类似
        <a-link :href="SnoatypeRepo" target="_blank"
          >Snoatype Nexus 的仓库组</a-link
        >），您应该在 Maven 配置中配置<a-link
          :href="singleMirror"
          target="_blank"
          >使用单一仓库镜像</a-link
        >，以确保所有拉取的构建物都能经过 Seal 的检查。
      </a-typography-paragraph>
    </a-typography>

    <a-typography>
      <a-typography-title :heading="6"
        >2. 使用
        <a-link href="https://maven.apache.org" target="_blank">Maven</a-link>
        客户端推送构建物</a-typography-title
      >
      <a-typography-paragraph>
        您需要在 Maven 项目配置文件中配置<a-link
          :href="releaseManageRepo"
          target="_blank"
          >发布管理的仓库</a-link
        >。假设<span class="marker">{{ upstreamUrl }}</span
        >是用于发布<strong>正式</strong>构建物，您可以进行如下配置。
      </a-typography-paragraph>
      <a-typography-paragraph>
        <highlight-block :code="dependenciesInfo"></highlight-block>
      </a-typography-paragraph>
      <a-typography-paragraph>
        如果所依赖的
        <a-link :href="mavenDepoly" target="_blank">Maven Deploy Plugin</a-link>
        版本高于2.8，您还可以在<a-link :href="mavenConfigUrl" target="_blank"
          >全局配置文件</a-link
        >中配置 altReleaseDeploymentRepository 和
        altSnapshotDeploymentRepository ，以避免修改项目配置文件。
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6">
        3. 使用
        <a-link href="https://docs.gradle.org" target="_blank">Gradle</a-link>
        客户端拉取构建物
      </a-typography-title>
      <a-typography-paragraph>
        您需要在 Gradle 项目配置文件中声明<a-link
          :href="gradleMirrorurl"
          target="_blank"
          >仓库镜像地址</a-link
        >
      </a-typography-paragraph>
      <highlight-block :code="gradleBuildInfo"></highlight-block>
      <a-typography-paragraph>
        如果 Gradle
        的版本高于7，您还可以在全局配置文件的依赖解析管理中声明<a-link
          :href="centerRepo"
          target="_blank"
          >中心化的仓库</a-link
        >，以避免修改项目配置文件。
      </a-typography-paragraph>
      <a-typography-paragraph>
        如果 <span class="marker">{{ upstreamUrl }}</span> 能够代理到多个上游
        Maven 仓库地址（类似
        <a-link :href="SnoatypeRepo" target="_blank">Snoatype Nexus</a-link>
        的仓库组），您应该在配置中仅配置一个仓库地址，以确保所有的包都能经过
        Seal 的检查。
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6">
        4. 使用
        <a-link href="https://docs.gradle.org" target="_blank">Gradle</a-link>
        客户端推送构建物
      </a-typography-title>
      <a-typography-paragraph>
        您需要在 Gradle 项目配置文件中的配置<a-link
          :href="gradleReleaseRepo"
          target="_blank"
          >发布管理的仓库</a-link
        >。假设
        <span class="marker">{{ upstreamUrl }}</span>
        是用于发布<strong>正式</strong>构建物，您可以进行如下配置。
      </a-typography-paragraph>
      <a-typography-paragraph>
        <highlight-block :code="gradlePushBuildInfo"></highlight-block>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import highlightBlock from '@/components/highlight-block/index.vue';
  import {
    dependency,
    addCount,
    settings,
    gradleBuild,
    gradlePushBuild,
    startP,
    updateP,
  } from '../config/code';

  const props = defineProps({
    proxyName: {
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
    proxyUrl: {
      type: String,
      default() {
        return '';
      },
    },
  });
  const gradleReleaseRepo =
    'https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:snapshot_and_release_repositories';
  const centerRepo =
    'https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration';
  const gradleMirrorurl =
    'https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:maven_repo';
  const mavenConfigUrl =
    'https://maven.apache.org/plugins/maven-deploy-plugin/deploy-mojo.html';
  const mavenDepoly =
    'https://maven.apache.org/plugins/maven-deploy-plugin/index.html';
  const releaseManageRepo =
    'https://maven.apache.org/plugins/maven-deploy-plugin/usage.html';
  const singleMirror =
    'https://maven.apache.org/guides/mini/guide-mirror-settings.html#using-a-single-repository';
  const SnoatypeRepo =
    'https://help.sonatype.com/repomanager2/configuration/managing-repository-groups';
  const mirrorUrl =
    'https://maven.apache.org/guides/mini/guide-mirror-settings.html#using-mirrors-for-repositories';
  const countInfo = computed(() => {
    return addCount({ proxyName: props.proxyName, proxyUrl: props.proxyUrl });
  });
  const settingsInfo = computed(() => {
    return settings({
      upstreamUrl: props.upstreamUrl,
      proxyUrl: props.proxyUrl,
    });
  });
  const dependenciesInfo = computed(() => {
    return dependency({
      name: props.proxyName,
      upstreamUrl: props.upstreamUrl,
      proxyUrl: props.proxyUrl,
    });
  });
  const gradleBuildInfo = computed(() => {
    return gradleBuild(props.proxyUrl);
  });
  const gradlePushBuildInfo = computed(() => {
    return gradlePushBuild(props.proxyUrl);
  });
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-typography) {
      margin-top: 10px;
      font-size: 13px;
    }

    :deep(.arco-link) {
      display: inline;
      font-size: 13px;
    }

    .block {
      margin-bottom: 10px;
    }

    .marker {
      padding: 1px 5px;
      color: #f76560;
      background-color: var(--seal-color-mark);
    }
  }
</style>
