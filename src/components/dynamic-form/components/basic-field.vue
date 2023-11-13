<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { emit }) {
      const { type } = toRefs(props.schema);
    }
  });
</script>
