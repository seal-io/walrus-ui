<script lang="tsx">
  import {
    defineComponent,
    inject,
    toRefs,
    ref,
    reactive,
    computed,
    watch
  } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../schema-field-props';
  import BasicField from '../../components/basic-field.vue';

  export default defineComponent({
    inject: ['schemaFormEditable'],
    props: schemaFieldProps,
    setup(props, { emit }) {
      const handleChange = (data) => {
        if (props.onChange) {
          props.onChange(data);
          return;
        }
        emit('change', data);
      };
      return () => {
        return (
          <BasicField
            {...props}
            onChange={(data) => handleChange(data)}
          ></BasicField>
        );
      };
    }
  });
</script>
