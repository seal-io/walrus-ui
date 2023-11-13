<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import formProps from './form-props';

  export default defineComponent({
    props: formProps,
    setup(props) {
      const formref = ref();
      const formData = ref();
      const { disabled, layout } = toRefs(props);

      return () => (
        <a-form
          ref={formref}
          disabled={disabled.value}
          v-model={formData.value}
          auto-label-width
          layout={layout.value}
        ></a-form>
      );
    }
  });
</script>
