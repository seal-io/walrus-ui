<script lang="tsx">
  import { defineComponent, ref, Prop, PropType } from 'vue';
  import { InputWidth } from '@/views/config';
  import i18n from '@/locale';
  import readBlob from '@/utils/readBlob';
  import ResizeableContainer from '@/components/resizeable-container/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';

  export default defineComponent({
    name: 'AutoReadfile',
    emits: ['update:modelValue', 'change'],
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: false
      },
      viewStatus: {
        type: Boolean,
        default: true
      },
      tips: {
        type: String,
        default: ''
      },
      defaultValue: {
        type: String,
        default: ''
      },
      lang: {
        type: String,
        default() {
          return 'json';
        }
      },
      minWidth: {
        type: Number,
        default: InputWidth.LARGE
      },
      minHeight: {
        type: Number,
        default: 180
      },
      showGutter: {
        type: Boolean,
        default: true
      },
      showLineNumbers: {
        type: Boolean,
        default: true
      },
      widget: {
        type: String as PropType<'textarea' | 'editor'>,
        default: 'editor'
      }
    },
    setup(props, ctx) {
      const editor = ref();
      const textareaWidth = ref(props.minWidth);
      const textareaHeight = ref(props.minHeight);

      const handleResize = ({ width, height }) => {
        textareaHeight.value = props.label ? height - 36 : height;
        textareaWidth.value = width;
      };

      const handleBeforeUpload = async (file) => {
        return true;
      };

      const handleUploadSuccess = async (list, fileItem) => {
        const res = await readBlob(fileItem.file);

        ctx.emit('update:modelValue', res);
        editor.value?.setValue?.(res);
        ctx.emit('change', res);
      };

      const validate = () => {
        const errors = editor.value?.getAnnotations?.();
        return errors;
      };

      ctx.expose({
        validate
      });
      const renderTextarea = () => {
        return (
          <div
            class="textarea-wrap"
            style={{
              width: `${textareaWidth.value}px`,
              height: `${textareaHeight.value}px`
            }}
          >
            <seal-textarea
              modelValue={props.modelValue}
              placeholder={props.placeholder}
              required={props.required}
              spellcheck={false}
              onUpdate:modelValue={(val) => ctx.emit('update:modelValue', val)}
              onChange={(val) => {
                ctx.emit('update:modelValue', val);
              }}
              style={{
                border: 'none',
                width: `100%`,
                height: `${textareaHeight.value}px`
              }}
              auto-size={{ minRows: 6 }}
            />
          </div>
        );
      };
      const renderEditor = () => {
        return (
          <AceEditor
            modelValue={props.modelValue}
            ref={(el) => {
              editor.value = el;
            }}
            required={props.required}
            label={props.label}
            editor-default-value={props.defaultValue}
            lang={props.lang}
            read-only={props.viewStatus}
            style={{ width: '100%' }}
            height={textareaHeight.value}
            show-gutter={props.showGutter}
            showLineNumbers={props.showLineNumbers}
            onUpdate:modelValue={(val) => {
              ctx.emit('update:modelValue', val);
            }}
          ></AceEditor>
        );
      };
      const renderButton = () => {
        if (props.viewStatus) return null;
        return (
          <div class="m-t-10 btn">
            <a-upload
              action="/"
              auto-upload={false}
              show-file-list={false}
              on-before-upload={handleBeforeUpload}
              onChange={handleUploadSuccess}
              v-slots={{
                'upload-button': () => (
                  <div>
                    <a-button type="primary" size="small">
                      <icon-file />
                      {i18n.global.t('operation.connectors.detail.readfile')}
                    </a-button>
                    <span style="margin-left: 5px" class="tips">
                      {props.tips}
                    </span>
                  </div>
                )
              }}
            ></a-upload>
          </div>
        );
      };
      return () => (
        <div
          class="auto-reader"
          style={{
            flex: 1
          }}
        >
          <ResizeableContainer
            min-height={props.minHeight}
            style={{
              width: `${textareaWidth.value}px`
            }}
            wrapper="parentNode"
            act-edges={{ right: true, bottom: true }}
            onChange={(data) => handleResize(data)}
          >
            <div
              class="box"
              style={{
                width: `${textareaWidth.value}px`,
                minWidth: `${props.minWidth}px`
              }}
            >
              {props.widget === 'editor' ? renderEditor() : renderTextarea()}
            </div>
          </ResizeableContainer>
          {renderButton()}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .auto-reader {
    display: flex;
    flex-direction: column;
    max-width: 100%;

    .tips {
      color: var(--color-text-3);
    }

    .box {
      position: relative;
      overflow: hidden;

      &::after {
        position: absolute;
        right: 2px;
        bottom: -5px;
        z-index: 10;
        display: inline-block;
        color: var(--color-text-3);
        transform: rotate(45deg);
        opacity: 0.6;
        content: '||';
      }
    }

    .textarea-wrap {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      transition: border 0.2s, box-shadow 0.2s;

      :deep(.arco-textarea-wrapper) {
        overflow-y: auto;
      }

      :deep(.seal-relative.wrapper) {
        &.is-focused {
          .label {
            top: 0;
            right: 16px;
            padding: 4px 0;
            background-color: #fff;
          }
        }
      }

      &:hover {
        border: 1px solid var(--color-primary-light-2);
        box-shadow: 0 0 2px 0 var(--color-primary-light-2);
        transition: border 0.2s, box-shadow 0.2s;
      }
    }
  }
</style>
