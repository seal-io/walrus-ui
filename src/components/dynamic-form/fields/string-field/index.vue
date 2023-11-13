<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import schemaFieldProps from '../schema-field-props';
  import BasicField from '../../components/basic-field.vue';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { emit }) {
      const handleChange = (data) => {
        emit('change', data);
      };
      return () => {
        return (
          <a-form-item>
            <BasicField {...props}></BasicField>
          </a-form-item>
        );
      };
    }
  });
</script>
