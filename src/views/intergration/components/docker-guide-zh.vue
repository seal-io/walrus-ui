<template>
  <div class="container">
    <a-typography>
      <a-typography-title :heading="6"
        ><div class="title">
          <icon-exclamation-circle
            style="margin-right: 5px; color: #f76560"
          />暂时不支持镜像推送
        </div>
      </a-typography-title>
      <a-typography-paragraph>
        <div class="block"
          >现在，您可以使用
          <span class="code">{{
            proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
          }}</span>
          拉取镜像，Seal 将会对上游的镜像进行策略扫描以确保镜像符合预期。</div
        >
      </a-typography-paragraph>
      <a-typography-paragraph>
        <div v-if="isDockerIo"
          >您可以使用
          <span class="code"
            >docker pull
            {{
              proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
            }}/library/alpine</span
          >
          来替换执行 <span class="code">docker pull alpine</span>。</div
        >
        <div v-else
          >您可以使用
          <span class="code"
            >docker pull
            {{
              proxyUrl.replace(/^(http:\/\/|https:\/\/)/, '')
            }}/library/alpine</span
          >
          来替换执行
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
          由于使用<strong>非 TLS 的镜像地址</strong>，您需要在 Docker Daemon
          的<a-link :href="configLink" target="_blank">配置文件</a-link
          >或者<a-link target="_blank" :href="runParamsLink">启动参数</a-link
          >中允许该代理地址。例如，在 Linux 上，您需要在
          <span class="code">/etc/docker/daemon.json</span>
          文件中，增加如下配置项。
        </a-typography-paragraph>
        <highlightBlock :code="getExtraConfig('http')" lang-type="json" />
        <a-typography-paragraph>
          关于<strong>非 TLS 的镜像地址</strong>的适用范围，您可以通过浏览
          <a-link
            href="https://docs.docker.com/registry/insecure"
            target="_blank"
            >https://docs.docker.com/registry/insecure</a-link
          >
          以获得更多信息。我们强烈建议您在<strong>系统设置</strong>中更改<strong>代理管理</strong>的<strong
            >TLS 模式</strong
          >以获得更高级别的安全。
        </a-typography-paragraph>
      </div>
      <div v-if="isHttps">
        <a-typography-paragraph
          v-if="userStore?.userInfo?.userSetting?.ProxyTLS === 'Customize'"
        >
          如果您在<strong>代理管理</strong>中使用了由非权威机构签发的服务证书，您需要确保
          Docker Client 所运行的环境信任该服务证书（或其签名CA)。
        </a-typography-paragraph>
        <a-typography-paragraph
          v-if="userStore?.userInfo?.userSetting?.ProxyTLS === 'Terminate'"
        >
          如果您做 TLS 终止
          的反向代理服务中使用了由非权威机构签发的服务证书，您需要确保 Docker
          Client 所运行的环境信任该服务证书（或其签名CA)。
        </a-typography-paragraph>
        <div
          v-if="
            ['Customize', 'Terminate'].includes(
              userStore?.userInfo?.userSetting?.ProxyTLS
            )
          "
        >
          <a-typography-paragraph>
            否则，您需要在 Docker Daemon 的<a-link
              :href="configLink"
              target="_blank"
              >配置文件</a-link
            >或者<a-link target="_blank" :href="runParamsLink">启动参数</a-link
            >中允许该代理地址。例如，在 Linux 上，您需要在
            <span class="code">/etc/docker/daemon.json</span
            >文件中，增加如下配置项。
          </a-typography-paragraph>
          <highlightBlock :code="getExtraConfig('https')" lang-type="json" />
          <a-typography-paragraph>
            关于<strong>非 TLS 的镜像地址</strong>的适用范围，您可以通过浏览
            <a-link
              href="https://docs.docker.com/registry/insecure"
              target="_blank"
              >https://docs.docker.com/registry/insecure</a-link
            >
            以获得更多信息。
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
