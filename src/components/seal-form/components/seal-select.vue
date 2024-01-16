<script lang="tsx">
  import i18n from '@/locale';
  import _ from 'lodash';
  import { defineComponent, ref, toRefs, PropType } from 'vue';
  import TagList from '@/components/tag-list/index.vue';
  import { OnClickOutside } from '@vueuse/components';
  import SealViewItemWrap from './seal-view-item-wrap.vue';
  import Tooltip from '../_components/tooltip.vue';

  export default defineComponent({
    name: 'SealSelect',
    inheritAttrs: false,
    emits: [
      'update:modelValue',
      'update:inputValue',
      'inputValueChange',
      'input',
      'change',
      'focus',
      'blur',
      'clear'
    ],
    props: {
      modelValue: {
        type: [String, Array] as PropType<any[] | string>,
        default: ''
      },
      inputValue: {
        type: String,
        default: ''
      },
      isLocale: {
        type: Boolean,
        default: false
      },
      viewStatus: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      popupInfo: {
        type: String,
        default: ''
      }
    },
    setup(props, { emit, attrs, slots, expose }) {
      const input = ref();
      const input2 = ref();
      const selectRef = ref();
      const isFocus = ref(false);
      const searchValue = ref('');
      const { t } = i18n.global;

      const handleInput = (e) => {
        emit('input', e);
      };
      const handleChange = (value) => {
        emit('update:modelValue', value);
        emit('change', value);
      };
      const handleInputValueChange = (value) => {
        searchValue.value = value;
        emit('update:inputValue', value);
        emit('inputValueChange', value);
      };
      const handleFocus = (e) => {
        emit('focus', e);
        isFocus.value = true;
      };
      const handleBlur = () => {
        isFocus.value = false;
      };
      const focus = () => {
        input.value?.focus?.();
      };
      const blur = () => {
        input.value?.blur?.();
      };
      const handleClear = () => {
        emit('update:modelValue', '');
        emit('change', '');
      };
      const handleClick = () => {
        if (props.viewStatus) return;
        isFocus.value = true;
        input.value?.click?.();
      };
      expose({
        focus,
        blur
      });

      const renderViewSelect = () => {
        if (props.viewStatus) {
          return (
            <a-select
              {...attrs}
              style={{ width: '100%' }}
              ref={input2.value}
              model-value={props.modelValue}
              popup-visible={false}
              allow-search={false}
              allow-create={false}
              allow-clear={false}
              class="v-sel"
              v-slots={{
                ..._.reduce(
                  _.keys(slots),
                  (result, key) => {
                    if (slots[key]) {
                      result[key] = () => slots[key]?.();
                    }
                    return result;
                  },
                  {}
                ),
                empty: () => (
                  <a-empty
                    description={
                      searchValue.value
                        ? t('common.search.nodata')
                        : t('common.data.empty')
                    }
                  ></a-empty>
                ),
                allowIcon: () => null
              }}
            ></a-select>
          );
        }
        return (
          <a-select
            {...attrs}
            style={{ width: '100%' }}
            ref={input.value}
            class="v-sel"
            model-value={props.modelValue}
            onClear={() => handleClear()}
            onChange={(value) => handleChange(value)}
            onInput={(e) => handleInput(e)}
            onFocus={(e) => handleFocus(e)}
            onInputValueChange={(value) => handleInputValueChange(value)}
            v-slots={{
              ..._.reduce(
                _.keys(slots),
                (result, key) => {
                  if (slots[key]) {
                    result[key] = (data) => slots[key]?.(data);
                  }
                  return result;
                },
                {}
              ),
              empty: () => (
                <a-empty
                  description={
                    searchValue.value
                      ? t('common.search.nodata')
                      : t('common.data.empty')
                  }
                ></a-empty>
              )
            }}
          ></a-select>
        );
      };
      // edit status
      const renderSelect = () => {
        return (
          <span
            class={[
              'seal-relative wrapper select',
              {
                'is-focused':
                  isFocus.value ||
                  (Array.isArray(props.modelValue)
                    ? props.modelValue.length
                    : props.modelValue),
                'prefix-icon': slots.prefix,
                'v-sel-view': props.viewStatus
              }
            ]}
            style={{ width: '100%' }}
            onClick={() => handleClick()}
          >
            <span class={['label', { disabled: attrs.disabled }]}>
              <span>
                <span>{attrs.label || props.placeholder}</span>
                {attrs.required && !props.viewStatus ? (
                  <span
                    class="bold-500 m-l-2 star"
                    style="color: rgb(var(--danger-6))"
                  >
                    *
                  </span>
                ) : null}
              </span>
              <Tooltip popupInfo={props.popupInfo} doc={attrs.doc}></Tooltip>
            </span>
            {renderViewSelect()}
          </span>
        );
      };
      // multiple, viewStatus
      const renderView = () => {
        if (props.viewStatus && attrs.multiple) {
          const label = attrs.label || props.placeholder;
          const list = attrs.options || [];
          const values = props.modelValue || [];
          return (
            <SealViewItemWrap label={label as string} style={{ width: '100%' }}>
              <TagList
                values={values as any}
                list={list as any}
                isLocale={props.isLocale}
              ></TagList>
            </SealViewItemWrap>
          );
        }
        return null;
      };
      return () => (
        <>
          {props.viewStatus && attrs.multiple ? (
            renderView()
          ) : (
            <span
              style={{ width: attrs.style?.width || 'max-content' }}
              class="flex"
            >
              <OnClickOutside
                onTrigger={() => handleBlur()}
                style={{ width: '100%' }}
              >
                {renderSelect()}
              </OnClickOutside>
            </span>
          )}
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('../style/index.less');

  .seal-relative.wrapper.select {
    &.v-sel-view {
      cursor: default;

      .label {
        cursor: default;
      }

      :deep(.arco-select-view-single) {
        &.v-sel {
          cursor: default;

          &:focus-within {
            border: 1px solid var(--color-border-2) !important;
            box-shadow: none !important;
          }
        }

        &.v-sel:hover {
          border: 1px solid var(--color-border-2) !important;
          box-shadow: none !important;
        }
      }

      :deep(.arco-select-view-disabled) {
        &.v-sel:hover {
          border-color: transparent !important;
        }
      }
    }
  }
</style>
