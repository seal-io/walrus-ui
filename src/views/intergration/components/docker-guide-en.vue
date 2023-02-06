<template>
  <div class="container">
    <a-typography>
      <a-typography-title :heading="6"
        ><div class="title">
          <icon-exclamation-circle
            style="margin-right: 5px; color: #f76560"
          />Image push is not currently supported
        </div>
      </a-typography-title>
      <a-typography-paragraph>
        <div class="block"
          >Now, you can use
          <span class="code">{{
            proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
          }}</span>
          to pull the image, and Seal will perform a policy scan on the upstream
          image to ensure that the image is as expected.</div
        >
      </a-typography-paragraph>
      <a-typography-paragraph>
        <div v-if="isDockerIo"
          >You can use
          <span class="code"
            >docker pull
            {{
              proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
            }}/library/alpine</span
          >
          instead of performing
          <span class="code">docker pull alpine</span>。</div
        >
        <div v-else
          >You can use
          <span class="code"
            >docker pull
            {{
              proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
            }}/library/alpine</span
          >
          instead of performing
          <span class="code"
            >docker pull
            {{
              upstreamUrl.replace(/^(http:\/\/|https:\/\/)/, '')
            }}/library/alpine。</span
          ></div
        >
      </a-typography-paragraph>
      <div v-if="!isHttps">
        <a-typography-paragraph>
          Since a <strong>non-TLS mirror address</strong>is used， you need to
          allow the proxy address in the Docker Daemon's
          <a-link :href="configLink" target="_blank">configuration file</a-link>
          or
          <a-link target="_blank" :href="runParamsLink"
            >startup parameters</a-link
          >. For example, on Linux, you need to add the following configuration
          items to the <span class="code">/etc/docker/daemon.json</span> file.
        </a-typography-paragraph>
        <highlightBlock :code="getExtraConfig('http')" lang-type="json" />
        <a-typography-paragraph>
          You can find more information on the scope of the
          <strong>non-TLS mirror address</strong> by visiting
          <a-link
            href="https://docs.docker.com/registry/insecure"
            target="_blank"
            >https://docs.docker.com/registry/insecure</a-link
          >. We strongly recommend that you change the
          <strong>proxy managment TLS mode</strong> in your
          <strong>system settings</strong> for a higher level of security.
        </a-typography-paragraph>
      </div>
      <div v-if="isHttps">
        <a-typography-paragraph
          v-if="userStore?.userInfo?.userSetting?.ProxyTLS === 'Customize'"
        >
          If you are using a service certificate issued by a non-authoritative
          authority in <strong>Agent Management</strong>, you need to ensure
          that The environment in which the Docker Client is running, trusts the
          service certificate (or its signing CA).
        </a-typography-paragraph>
        <a-typography-paragraph
          v-if="userStore?.userInfo?.userSetting?.ProxyTLS === 'Terminate'"
        >
          If your TLS-terminated reverse proxy service uses a service
          certificate issued by a non-authoritative authority, you need to
          ensure that the environment in which Docker Client is running, trusts
          the service certificate (or its signing CA).
        </a-typography-paragraph>
        <div
          v-if="
            ['Customize', 'Terminate'].includes(
              userStore?.userInfo?.userSetting?.ProxyTLS
            )
          "
        >
          <a-typography-paragraph>
            Otherwise, you need to allow the proxy address in the Docker
            Daemon's
            <a-link :href="configLink" target="_blank"
              >configuration file</a-link
            >
            or
            <a-link target="_blank" :href="runParamsLink"
              >startup parameters</a-link
            >. For example, on Linux, you need to add the following
            configuration items to the
            <span class="code">/etc/docker/daemon.json</span>file.
          </a-typography-paragraph>
          <highlightBlock :code="getExtraConfig('https')" lang-type="json" />
          <a-typography-paragraph>
            You can find more information on the scope of application of
            <strong>non-TLS mirror addresses</strong> by visiting
            <a-link
              href="https://docs.docker.com/registry/insecure"
              target="_blank"
              >https://docs.docker.com/registry/insecure</a-link
            >
          </a-typography-paragraph>
        </div>
      </div>
    </a-typography>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/store';
  import highlightBlock from '@/components/highlight-block/index.vue';

  const props = defineProps({
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
  const userStore = useUserStore();
  const configLink =
    'https://docs.docker.com/config/daemon/#configure-the-docker-daemon';
  const runParamsLink =
    'https://docs.docker.com/engine/reference/commandline/dockerd/#insecure-registries';
  const isHttps = computed(() => {
    const url = new URL(props.proxyUrl);
    return url.protocol === 'https:';
  });
  const isDockerIo = computed(() => {
    const reg = /(docker.io)$/;
    return reg.test(props.upstreamUrl);
  });
  const getExtraConfig = (type: string) => {
    return `{
    "insecure-registries" : ["${
      type === 'http'
        ? props.proxyUrl.replace(/^(http:\/\/)/, '')
        : props.proxyUrl.replace(/^(https:\/\/)/, '')
    }"]
}`;
  };
</script>

<style lang="less" scoped>
  .container {
    :deep(.arco-typography) {
      margin-top: 10px;
      font-size: 12px;

      .title {
        margin-bottom: 20px;
        padding: 5px;
        color: #f76560;
        font-weight: 400;
        background-color: var(--seal-color-mark);
        border-radius: 4px;
      }
    }

    :deep(.arco-link) {
      display: inline;
      font-size: 12px;
    }

    .block {
      margin-bottom: 10px;
    }

    .marker {
      padding: 1px 5px;
      color: #f76560;
      background-color: var(--seal-color-mark);
    }

    .code {
      padding: 1px 5px;
      color: #f76560;
      background-color: var(--seal-color-mark);
      border-radius: 2px;
    }
  }
</style>
