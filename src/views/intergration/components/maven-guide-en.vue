<template>
  <div class="container">
    <a-typography>
      <a-typography-paragraph>
        You can now pull or push Java builds using
        <span class="marker">{{ proxyUrl }}</span
        >. Seal will do a policy scan of the pulled or pushed build to make sure
        it is as expected.
      </a-typography-paragraph>
      <a-typography-title :heading="6"
        >1. Pull the artifact use the
        <a-link href="https://maven.apache.org" target="_blank">Maven</a-link>
        client
      </a-typography-title>
      <a-typography-paragraph>
        <div>
          You need to configure the
          <a-link :href="mirrorUrl" target="_blank"
            >repository mirror address</a-link
          >
          in the Maven global configuration file.
        </div>
      </a-typography-paragraph>
      <highlight-block :code="settingsInfo"></highlight-block>
      <a-typography-paragraph>
        If <span class="marker">{{ upstreamUrl }}</span> can proxy to multiple
        upstream Maven repository addresses (similar to
        <a-link :href="SnoatypeRepo" target="_blank"
          >Snoatype Nexus' repository group</a-link
        >), you should configure the Maven configuration to use a
        <a-link :href="singleMirror" target="_blank"
          >single repository mirror</a-link
        >
        to ensure All pulled builds are checked by Seal.
      </a-typography-paragraph>
    </a-typography>

    <a-typography>
      <a-typography-title :heading="6"
        >2. Push the artifact use the
        <a-link href="https://maven.apache.org" target="_blank">Maven</a-link>
        client
      </a-typography-title>
      <a-typography-paragraph>
        You need to configure the
        <a-link :href="releaseManageRepo" target="_blank"
          >repository for release management</a-link
        >
        in the Maven project configuration file. Assuming
        <span class="marker">{{ upstreamUrl }}</span> is for publishing
        <strong>official</strong> artifact, you can configure as follows.
      </a-typography-paragraph>
      <a-typography-paragraph>
        <highlight-block :code="dependenciesInfo"></highlight-block>
      </a-typography-paragraph>
      <a-typography-paragraph>
        If the dependent
        <a-link :href="mavenDepoly" target="_blank">Maven Deploy Plugin</a-link>
        version is higher than 2.8, you can also configure
        altReleaseDeploymentRepository and altSnapshotDeploymentRepository in
        the
        <a-link :href="mavenConfigUrl" target="_blank"
          >global configuration file</a-link
        >
        to avoid modifying the project configuration file
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6">
        3. Pull the artifact use the
        <a-link href="https://docs.gradle.org" target="_blank">Gradle</a-link>
        client
      </a-typography-title>
      <a-typography-paragraph>
        You need to declare the
        <a-link :href="gradleMirrorurl" target="_blank"
          >repository mirror address</a-link
        >
        in the Gradle project configuration file
      </a-typography-paragraph>
      <highlight-block :code="gradleBuildInfo"></highlight-block>
      <a-typography-paragraph>
        If the Gradle version is higher than 7, you can also declare a
        <a-link :href="centerRepo" target="_blank"
          >centralized repository</a-link
        >
        in the dependency resolution management of the global configuration file
        to avoid modifying the project configuration file
      </a-typography-paragraph>
      <a-typography-paragraph>
        If <span class="marker">{{ upstreamUrl }}</span> is able to proxy to
        multiple upstream Maven repository addresses (similar to
        <a-link :href="SnoatypeRepo" target="_blank">Snoatype Nexus</a-link>
        repository group), you should configure only one repository address in
        your configuration to ensure that all All packages can be inspected by
        Seal.
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :heading="6">
        4. Push the artifact use the
        <a-link href="https://docs.gradle.org" target="_blank">Gradle</a-link>
        client
      </a-typography-title>
      <a-typography-paragraph>
        You need to configure
        <a-link :href="gradleReleaseRepo" target="_blank"
          >release-managed repositories</a-link
        >
        in the Gradle project configuration file. Assuming
        <span class="marker">{{ upstreamUrl }}</span> is for publishing
        <strong>official</strong>
        artifact, you can configure as follows.
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
