<script lang="tsx">
  import { defineComponent, toRefs, ref, reactive, computed, watch } from 'vue';
  import _ from 'lodash';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { slots }) {
      return () => (
        <div class="field-group">
          <div class="title parent-name">
            {props.schema.title || props.schema.name}
          </div>
          <div class="description">{props.schema.description}</div>
          <div class="child-fields">{slots.default?.()}</div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .field-group {
    padding: 10px 0;
    border-radius: var(--border-radius-small);

    .title {
      margin-top: 10px;
      margin-bottom: 10px;
      padding: 10px 0;
      font-weight: 500;
      font-size: 24px;
      border-bottom: 1px solid var(--color-border-2);
    }

    .description {
      margin-bottom: 20px;
    }
  }
</style>
