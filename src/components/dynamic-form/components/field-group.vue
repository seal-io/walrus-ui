<script lang="tsx">
  import { defineComponent, ref, withModifiers } from 'vue';
  import _, { divide } from 'lodash';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import schemaFieldProps from '../fields/schema-field-props';

  export default defineComponent({
    props: schemaFieldProps,
    setup(props, { slots }) {
      const status = ref(false);
      const hovered = ref(false);

      const handleClickRight = () => {
        setTimeout(() => {
          status.value = true;
          console.log('status========', status.value);
        }, 100);
      };
      const handleEnter = () => {
        hovered.value = true;
      };
      const handleLeave = () => {
        hovered.value = false;
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
                  </div>
                  <div>{slots.buttons?.()}</div>
                </div>
              ) : null}
              <div class="child-fields">{slots.default?.()}</div>
            </>
          );
        }
        return (
          <div
            onMouseover={withModifiers(
              () => handleEnter(),
              ['stop', 'prevent', 'native']
            )}
            onMouseout={withModifiers(
              () => handleLeave(),
              ['stop', 'prevent', 'native']
            )}
          >
            <ModuleWrapper
              class={[{ 'mo-wrap-hover': hovered.value }]}
              v-model:status={status.value}
              title={props.schema.title || props.schema.name}
              showDelete={false}
              v-slots={{
                title: () => {
                  return <span>{props.schema.title || props.schema.name}</span>;
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
            </ModuleWrapper>
          </div>
        );
      };

      return () => (
        <div
          class={[
            'field-group',
            `level-${props.level}`,
            { marked: props.level <= 1 },
            { collapse: props.level > 1 }
          ]}
          id={`${props.schema.title || props.schema.name}`}
        >
          {renderContent()}
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
    // padding-right: 6px;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    &.collapse {
      padding: 0;
      padding-bottom: 20px;
      border: none;
    }

    :deep(.mo-wrap) {
      .title {
        background-color: #fff;
      }

      .content {
        padding: 16px;
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
