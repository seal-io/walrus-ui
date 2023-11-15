<script lang="tsx">
  import { defineComponent } from 'vue';
  import _ from 'lodash';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { slots }) {
      return () => (
        <div
          class="field-group"
          id={`${props.schema.title || props.schema.name}`}
        >
          {props.schema.title || props.schema.name ? (
            <div class="title parent-name">
              <div>
                <span>{props.schema.title || props.schema.name}</span>
                <span class="field-path">{`(${props.fieldPath.join(
                  '.'
                )})`}</span>
              </div>
              <div>{slots.buttons?.()}</div>
            </div>
          ) : null}
          <div class="child-fields">{slots.default?.()}</div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .field-group {
    margin-bottom: 16px;
    padding: 0 16px;
    padding-bottom: 10px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    &.level-0 {
      padding: 0;
      border: none;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 10px 0;
      font-weight: 500;
      font-size: 16px;
      border-bottom: 1px solid var(--color-border-2);
    }

    .description {
      margin-bottom: 20px;
    }

    .field-path {
      margin-left: 5px;
      color: var(--color-text-3);
      font-size: 12px;
    }
  }
</style>
