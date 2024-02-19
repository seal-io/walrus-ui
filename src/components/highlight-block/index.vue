<template>
  <div class="high-light-wrapper">
    <highlightjs :language="langType" :code="code" />
    <slot></slot>
    <!-- <div v-html="highlightedCode"></div> -->
  </div>
</template>

<script>
  import 'highlight.js/styles/stackoverflow-light.css';
  import 'highlight.js/lib/common';
  import hljsVuePlugin from '@highlightjs/vue-plugin';
  // import xml from 'highlight.js/lib/languages/xml';
  // import json from 'highlight.js/lib/languages/json';
  // import { onMounted, ref } from 'vue';
  // import 'highlight.js/styles/github.css';
  export default {
    components: {
      highlightjs: hljsVuePlugin.component
    },
    props: {
      code: {
        type: String,
        default() {
          return '';
        }
      },
      langType: {
        type: String,
        default() {
          return 'xml';
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .high-light-wrapper {
    // padding: 10px;
    // white-space: pre;
    // border: 1px solid var(--seal-border-gray-2);
    :deep(.hljs) {
      background-color: var(--color-white);
    }
  }
</style>
