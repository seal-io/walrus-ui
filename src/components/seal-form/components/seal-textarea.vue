<script lang="tsx">
  import { ref, defineComponent } from 'vue';
  import Tooltip from '../_components/tooltip.vue';
  import SealViewItemWrap from './seal-view-item-wrap.vue';

  export default defineComponent({
    name: 'SealTextarea',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      viewStatus: {
        type: Boolean,
        default: false
      },
      popupInfo: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'clear'],
    setup(props, ctx) {
      const input = ref();
      const isFocus = ref(false);
      const { emit, slots } = ctx;
      const attrs = ctx.attrs as any;

      const handleInput = (value, e) => {
        const maxLength = attrs.maxLength || attrs['max-length'];

        if (maxLength && value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
        emit('update:modelValue', value);
        emit('input', value, e);
      };
      const handleChange = (value, e) => {
        emit('update:modelValue', value);
        emit('change', value, e);
      };
      const handleFocus = (e) => {
        emit('focus', e);
        isFocus.value = true;
      };
      const handleBlur = (e) => {
        emit('blur', e);
        isFocus.value = false;
      };
      const handleClear = () => {
        emit('update:modelValue', '');
        emit('change', '');
      };
      const handleClick = () => {
        input.value?.focus?.();
        isFocus.value = true;
      };

      const renderViewStatus = () => {
        if (props.viewStatus) {
          return (
            <SealViewItemWrap
              label={attrs.label || props.placeholder}
              style={{
                width: attrs.style?.width || 'max-content',
                ...attrs?.height
              }}
            >
              <span>{props.modelValue}</span>
            </SealViewItemWrap>
          );
        }
        return null;
      };
      const renderEditStatus = () => {
        if (!props.viewStatus) {
          return (
            <span
              class={[
                'seal-relative wrapper textarea',
                {
                  'is-focused': isFocus.value || props.modelValue,
                  'prefix-icon': slots.prefix
                }
              ]}
              style={{
                width: (attrs.style?.width as string) || 'max-content'
              }}
            >
              <span
                class={['label', { disabled: attrs.disabled }]}
                onClick={() => handleClick()}
              >
                <span>
                  <span>{attrs.label || props.placeholder}</span>
                  {attrs.required ? (
                    <span
                      class="bold-500 m-l-2 star"
                      style={{ color: 'rgb(var(--danger-6))' }}
                    >
                      *
                    </span>
                  ) : null}
                </span>
                <Tooltip popup-info={props.popupInfo} doc={attrs.doc}></Tooltip>
              </span>
              <a-textarea
                {...attrs}
                ref={(el) => {
                  input.value = el;
                }}
                model-value={props.modelValue}
                onClear={() => handleClear()}
                onFocus={(e) => handleFocus(e)}
                onInput={(value, e) => handleInput(value, e)}
                onBlur={(e) => handleBlur(e)}
                onChange={(value, e) => handleChange(value, e)}
                v-slots={{
                  ...slots
                }}
              ></a-textarea>
            </span>
          );
        }
        return null;
      };
      return () => (
        <>
          {renderViewStatus()}
          {renderEditStatus()}
        </>
      );
    }
  });
</script>

<style lang="less" scoped>
  @import url('../style/index.less');
  @import url('../style/textarea.less');
</style>
