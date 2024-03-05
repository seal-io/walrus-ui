<script lang="tsx">
  import 'highlight.js/styles/atom-one-light.css';
  import { ref, computed, defineComponent, watch } from 'vue';
  import 'highlight.js/lib/common';
  import hljs from 'highlight.js/lib/core';
  import { escapeHtml } from './utils';

  export default defineComponent({
    props: {
      code: {
        type: String,
        required: true
      },
      lang: {
        type: String,
        default: ''
      },
      autodetect: {
        type: Boolean,
        default: true
      },
      ignoreIllegals: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const language = ref(props.lang);

      watch(
        () => props.lang,
        (nv) => {
          language.value = nv;
        }
      );

      const autodetect = computed(() => props.autodetect && !language.value);
      const cannotDetectLanguage = computed(
        () => !autodetect.value && !hljs.getLanguage(language.value)
      );

      const className = computed((): string => {
        if (cannotDetectLanguage.value) {
          return '';
        }
        return `hljs ${language.value}`;
      });

      const highlightedCode = computed((): string => {
        // No idea what language to use, return raw code
        if (cannotDetectLanguage.value) {
          console.warn(
            `The language "${language.value}" you specified could not be found.`
          );
          return escapeHtml(props.code);
        }

        if (autodetect.value) {
          const result = hljs.highlightAuto(props.code);
          return result.value;
        }
        const result = hljs.highlight(props.code, {
          language: language.value,
          ignoreIllegals: props.ignoreIllegals
        });
        return result.value;
      });
      return () => (
        <pre>
          <code
            class={className.value}
            tabindex="0"
            innerHTML={highlightedCode.value}
          ></code>
        </pre>
      );
    }
  });
</script>
