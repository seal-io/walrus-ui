<script lang="tsx">
  import {
    defineComponent,
    ref,
    withModifiers,
    inject,
    computed,
    watch,
    nextTick,
    onBeforeUnmount
  } from 'vue';
  import _ from 'lodash';
  import i18n from '@/locale';
  import ModuleWrapper from '@/components/module-wrapper/index.vue';
  import { InjectSchemaFormStatusKey, PageAction } from '@/views/config';
  import Tooltip from '@/components/seal-form/_components/tooltip.vue';
  import schemaFieldProps from '../fields/schema-field-props';
  import { ProvideErrorFieldsKey } from '../config';
  import FIELD_TYPE from '../config/field-type';
  import { parentObjectExsits, initFieldDefaultValue } from '../utils';

  export default defineComponent({
    props: schemaFieldProps,
    emits: ['change', 'unset'],
    setup(props, { slots, emit }) {
      // hidden
      const hidden = _.get(props.schema, ['x-walrus-ui', 'hidden'], false);

      const errorFields = inject(ProvideErrorFieldsKey, ref([]));
      const schemaFormStatus = inject(
        InjectSchemaFormStatusKey,
        ref(PageAction.CREATE)
      );

      const fullPath = _.join(props.fieldPath, '.');
      const isUnset = ref(true);
      const status = ref(false);
      const hovered = ref(false);
      const groupHovered = ref(false);
      const isUnmounted = ref(false);

      const fieldPathData = computed(() => {
        return _.get(props.formData, props.fieldPath);
      });
      const exsitsError = computed(() => {
        const fieldPath = _.join(props.fieldPath, '.');
        return _.some(errorFields.value, (item) => {
          return _.startsWith(item, fieldPath);
        });
      });

      const unsetType = () => {
        return (
          props.schema.type === FIELD_TYPE.OBJECT ||
          props.schema.type === FIELD_TYPE.ARRAY
        );
      };

      const deleteCacheFormKey = () => {
        _.each([...props.FieldPathMap.keys()], (key) => {
          const keyPathSchema = props.FieldPathMap.get(key);
          if (
            key.startsWith(fullPath) &&
            key !== fullPath &&
            (!props.cachedFormData.has(key) || props.cachedFormData.get(key)) &&
            (keyPathSchema.type === FIELD_TYPE.OBJECT ||
              keyPathSchema.type === FIELD_TYPE.ARRAY) &&
            !keyPathSchema.required
          ) {
            _.unset(props.formData, _.split(key, '.'));
          }
        });
      };

      const initCachedUnsetValue = () => {
        if (props.cachedFormData.get(fullPath) !== undefined) {
          isUnset.value = props.cachedFormData.get(fullPath);
          status.value = !isUnset.value;
          if (isUnset.value) {
            _.unset(props.formData, props.fieldPath);
          }
        }
      };

      const handleToggleField = (checked) => {
        if (!checked) {
          status.value = false;
          isUnset.value = true;
          _.unset(props.formData, props.fieldPath);
          props.cachedFormData.set(fullPath, isUnset.value);
        } else {
          status.value = true;
          isUnset.value = false;
          if (
            _.has(props.uiFormData, props.fieldPath) &&
            parentObjectExsits(props.formData, props.fieldPath)
          ) {
            _.set(
              props.formData,
              props.fieldPath,
              _.cloneDeep(_.get(props.uiFormData, props.fieldPath))
            );
          } else if (parentObjectExsits(props.formData, props.fieldPath)) {
            _.set(
              props.formData,
              props.fieldPath,
              _.cloneDeep(_.get(props.defaultFormData, props.fieldPath))
            );
            _.set(
              props.uiFormData,
              props.fieldPath,
              _.cloneDeep(_.get(props.defaultFormData, props.fieldPath))
            );
          }
          props.cachedFormData.set(fullPath, isUnset.value);

          setTimeout(() => {
            deleteCacheFormKey();
          }, 100);
        }

        emit('unset', isUnset.value);
        emit('change', props.formData);
      };
      const handleClickRight = () => {
        setTimeout(() => {
          status.value = true;
        }, 100);
      };
      const handleEnter = () => {
        if (isUnset.value && schemaFormStatus.value !== PageAction.VIEW) {
          return;
        }
        hovered.value = true;
      };
      const handleLeave = () => {
        hovered.value = false;
      };
      const handleGroupEnter = () => {
        if (isUnset.value && schemaFormStatus.value !== PageAction.VIEW) {
          return;
        }
        groupHovered.value = true;
      };
      const handleGroupLeave = () => {
        groupHovered.value = false;
      };

      const initUnsetValue = () => {
        if (schemaFormStatus.value === PageAction.CREATE) {
          return;
        }
        if (schemaFormStatus.value === PageAction.VIEW) {
          isUnset.value = false;
          return;
        }
        if (unsetType()) {
          if (_.has(props.formData, props.fieldPath)) {
            isUnset.value = false;
          } else {
            isUnset.value = true;
          }
        }
      };
      const handleWatchFieldValue = () => {
        if (_.has(props.formData, props.fieldPath)) {
          isUnset.value = false;
          status.value = props.level < 2 ? true : status.value;
        } else {
          isUnset.value = true;
        }
      };
      const debounceWatchFieldValue = _.debounce(handleWatchFieldValue, 200);
      const renderRequiredStar = () => {
        if (
          props.schema.isRequired &&
          schemaFormStatus.value !== PageAction.VIEW
        ) {
          return <span class="error-star m-l-2">*</span>;
        }
        return null;
      };

      initUnsetValue();

      watch(
        () => fieldPathData.value,
        () => {
          handleWatchFieldValue();
        },
        { immediate: true }
      );
      watch(
        () => exsitsError.value,
        (val) => {
          if (exsitsError.value) {
            status.value = true;
          }
        },
        { immediate: true }
      );

      const renderNullableButton = () => {
        if (schemaFormStatus.value === PageAction.VIEW) {
          return null;
        }
        return (
          <span onClick={withModifiers(() => {}, ['stop'])}>
            {!props.schema.isRequired &&
            unsetType() &&
            !props.schema.minItems ? (
              <a-switch
                type="text"
                size="mini"
                class="m-r-10"
                model-value={!isUnset.value}
                onChange={(val) => handleToggleField(val)}
              ></a-switch>
            ) : null}
          </span>
        );
      };
      // level 0 content always show
      const renderLevel0Conent = () => {
        return (
          <a-grid-item
            span={{ lg: props.schema.colSpan, md: 12, sm: 12, xs: 12 }}
          >
            {props.schema.title || props.schema.name ? (
              <div class="title parent-name">
                <div class="flex flex-align-center">
                  <>{renderNullableButton()}</>
                  <span>{props.schema.title || props.schema.name}</span>
                  {renderRequiredStar()}
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
                  <div class="flex flex-align-center">
                    <>{renderNullableButton()}</>
                    <span>{props.schema.title || props.schema.name}</span>
                    {renderRequiredStar()}
                    <Tooltip
                      popup-info={props.schema.description}
                      doc={props.schema.externalDocs}
                    ></Tooltip>
                  </div>
                  <div>{slots.buttons?.()}</div>
                </div>
              ) : null}
              {status.value ? slots.default?.() : null}
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
                {
                  'mo-wrap-hover':
                    hovered.value &&
                    (!isUnset.value ||
                      schemaFormStatus.value === PageAction.VIEW)
                },
                _.join(props.fieldPath, '.')
              ]}
              status={status.value}
              disabled={
                isUnset.value && schemaFormStatus.value !== PageAction.VIEW
              }
              onUpdate:status={(val) => {
                status.value = val;
              }}
              title={props.schema.title || props.schema.name}
              showDelete={false}
              showArrow={schemaFormStatus.value === PageAction.VIEW}
              v-slots={{
                title: () => {
                  return (
                    <span class="flex flex-align-center">
                      <>{renderNullableButton()}</>
                      <span>{props.schema.title || props.schema.name}</span>
                      {renderRequiredStar()}
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
              style={{ marginBottom: '20px' }}
            >
              <div
                onMouseenter={withModifiers(() => handleGroupEnter(), ['stop'])}
                onMouseleave={withModifiers(() => handleGroupLeave(), ['stop'])}
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
    // margin-bottom: 20px;
    padding: 0 20px;
    padding-bottom: 10px;
    border-radius: 0 0 var(--border-radius-small) var(--border-radius-small);
    box-shadow: var(--color-form-card-shadow);

    .error-star {
      position: relative;
      top: 2px;
      display: flex;
      align-items: center;
      color: rgb(var(--danger-6));
      font-size: var(--font-size-small);
    }

    &:hover {
      box-shadow: var(--color-form-card-shadow-hover);
      transition: box-shadow 0.2s var(--seal-transition-func);
    }

    &.field-group-hovered:hover {
      border-color: rgb(var(--arcoblue-6));
      transition: border-color 0.2s var(--seal-transition-func);
    }

    &.collapse {
      margin: 0;
      padding: 0;
      // padding-bottom: 20px;
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
        background-color: var(--color-white);
      }

      &.disabled {
        cursor: default;

        .title {
          cursor: default;
        }
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
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-normal);
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
