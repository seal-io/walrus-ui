<script lang="tsx">
  import { defineComponent, ref } from 'vue';
  import AttributesContent from './attributes-content.vue';
  import diffValue from './config/diff-content.json';

  export default defineComponent({
    name: 'RunAttributes',
    setup() {
      const diffContent = ref({
        old: '',
        new: ''
      });

      const setDiffContent = () => {
        diffContent.value = {
          old: diffValue.old?.computedAttributes
            ? JSON.stringify(diffValue.old?.computedAttributes, null, 2)
            : '',
          new: JSON.stringify(diffValue.new?.computedAttributes, null, 2)
        };
      };
      setDiffContent();
      return () => (
        <div class="run-attributes">
          <AttributesContent
            diff-content={diffContent.value}
          ></AttributesContent>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .run-attributes {
    :deep(.arco-tabs-nav) {
      display: none;
    }
  }
</style>
