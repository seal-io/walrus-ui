<script lang="tsx">
  import { defineComponent, ref, withModifiers, inject } from 'vue';
  import _ from 'lodash';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { ProvideErrorFieldsKey } from '../config';
  import FIELD_TYPE from '../config/field-type';
  import { initFieldValue } from '../utils';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change'],
    setup(props, { slots, emit }) {
      const errorFields = inject(ProvideErrorFieldsKey, ref([]));
      const collapsed = _.get(
        props.schema,
        ['x-walrus-ui', 'collapsed'],
        false
      );
      const nullableText = _.get(props.schema, ['x-walrus-ui', 'nullable'], '');
      const status = ref(collapsed);
      const hovered = ref(false);
      const groupHovered = ref(false);

      const exsitsError = () => {
        const fieldPath = _.join(props.fieldPath, '.');
        return _.some(errorFields.value, (item) => {
          return _.startsWith(item, fieldPath);
        });
      };
      const handleUnsetField = () => {
        initFieldValue({
          defaultFormData: props.defaultFormData,
          schema: props.schema,
          formData: props.formData,
          uiFormData: props.uiFormData,
          fieldPath: props.fieldPath,
          required: _.includes(props.requiredFields, props.schema.name)
        });
        emit('change', props.formData);
        console.log('handleUnsetField', props.formData, props.fieldPath);
      };
      const handleClickRight = () => {
        setTimeout(() => {
          status.value = true;
        }, 100);
      };
      const handleEnter = () => {
        hovered.value = true;
      };
      const handleLeave = () => {
        hovered.value = false;
      };
      const handleGroupEnter = () => {
        groupHovered.value = true;
      };
      const handleGroupLeave = () => {
        groupHovered.value = false;
      };
      const renderNullableButton = () => {
        return (
          <>
            {props.schema.nullable && nullableText ? (
              <a-button
                type="text"
                size="mini"
                onClick={() => handleUnsetField()}
              >
                {nullableText}
              </a-button>
            ) : null}
          </>
        );
      };
      const renderLevel0Conent = () => {
        return (
          <a-grid-item
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
            {props.schema.title || props.schema.name ? (
              <div class="title parent-name">
                <div>
                  <span>{props.schema.title || props.schema.name}</span>
                  {renderNullableButton()}
                </div>
                <div>{slots.buttons?.()}</div>
              </div>
            ) : null}
            {slots.default?.()}
            <div>{slots.footer?.()}</div>
          </a-grid-item>
        );
      };
      const renderContent = () => {
        if (props.level < 2) {
          return (
            <>
              {props.schema.title || props.schema.name ? (
                <div class="title parent-name">
                  <div>
                    <span>{props.schema.title || props.schema.name}</span>
                    {props.schema.description ? (
                      <a-tooltip content={props.schema.description}>
                        <icon-info-circle
                          style="stroke-linecap: initial; cursor: default"
                          class="m-l-2"
                        />
                      </a-tooltip>
                    ) : null}
                    {renderNullableButton()}
                  </div>
                  <div>{slots.buttons?.()}</div>
                </div>
              ) : null}
              {slots.default?.()}
              <div>{slots.footer?.()}</div>
            </>
          );
        }
        return (
          <div
            onMouseover={withModifiers(
              () => handleEnter(),
              ['stop', 'prevent']
            )}
            onMouseout={withModifiers(() => handleLeave(), ['stop', 'prevent'])}
          >
            <ModuleWrapper
              class={[
                { 'mo-wrap-hover': hovered.value },
                _.join(props.fieldPath, '.')
              ]}
              status={status.value || exsitsError()}
              onUpdate:status={(val) => {
                status.value = val;
              }}
              title={props.schema.title || props.schema.name}
              showDelete={false}
              v-slots={{
                title: () => {
                  return (
                    <span>
                      <span>{props.schema.title || props.schema.name}</span>
                      {renderNullableButton()}
                    </span>
                  );
                },
                right: () => {
                  return (
                    <span onClick={() => handleClickRight()}>
                      {slots.buttons?.()}
                    </span>
                  );
                }
              }}
            >
              {slots.default?.()}
              <div>{slots.footer?.()}</div>
            </ModuleWrapper>
          </div>
        );
      };

      return () => (
        <>
          {props.level === 0 ? (
            renderLevel0Conent()
          ) : (
            <a-grid-item
              span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
            >
              <div
                onMouseover={withModifiers(
                  () => handleGroupEnter(),
                  ['stop', 'prevent']
                )}
                onMouseout={withModifiers(
                  () => handleGroupLeave(),
                  ['stop', 'prevent']
                )}
                class={[
                  'field-group',
                  `level-${props.level}`,
                  { 'field-group-hovered': groupHovered.value },
                  { collapse: props.level > 1 }
                ]}
                id={`${props.schema.title || props.schema.name}`}
              >
                {renderContent()}
              </div>
            </a-grid-item>
          )}
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  .field-group {
    position: relative;
    z-index: 1;
    height: 100%;
    margin: 0 2px;
    margin-bottom: 20px;
    padding: 0 20px;
    padding-bottom: 10px;
    border-radius: 0%;
    box-shadow: 0 4px 3px -1px rgba(234, 236, 238, 0.8),
      0 1px 4px 0 rgba(169, 174, 184, 0.2);

    // &:hover {
    //   box-shadow: rgba(201, 205, 212, 0.2) 0 4px 6px -1px,
    //     rgba(201, 205, 212, 0.8) 0 4px 6px 0;
    //   transition: box-shadow 0.2s var(--seal-transition-func);
    // }
    &:hover {
      box-shadow: rgba(33, 74, 196, 0.2) 0 3px 5px -1px,
        rgba(33, 74, 196, 0.1) 0 3px 5px 0;
      transition: box-shadow 0.2s var(--seal-transition-func);
    }

    &.field-group-hovered:hover {
      border-color: rgb(var(--arcoblue-6));
      transition: border-color 0.2s var(--seal-transition-func);
    }

    &.collapse {
      margin: 0;
      padding: 0;
      padding-bottom: 20px;
      border: none;
      box-shadow: none;
    }

    :deep(.mo-wrap) {
      border: none;
      border: 1px solid var(--color-border-2);
      border-radius: 0;
      border-radius: var(--border-radius-small);

      .common-button {
        margin-left: 0;
      }

      .title {
        height: 52px;
        padding-right: 16px;
        font-size: 12px;
        background-color: #fff;
      }

      .content {
        padding: 20px;
      }

      &.mo-wrap-hover:hover {
        border-color: rgb(var(--arcoblue-6));
        transition: border-color 0.2s var(--seal-transition-func);
      }
    }

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
      font-size: 14px;
      // border-bottom: 1px solid var(--color-border-2);
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
