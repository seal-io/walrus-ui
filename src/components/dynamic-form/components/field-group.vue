<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { slots }) {
      return () => (
        <div>
          <div class="title parent-name">
            {props.schema.title || props.schema.name}
          </div>
          <div class="description"></div>
          <div class="child-fields">{slots.default?.()}</div>
        </div>
      );
    }
  });
</script>
