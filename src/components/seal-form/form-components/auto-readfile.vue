<script lang="tsx">
  import { defineComponent, ref, Prop, PropType } from 'vue';
  import { InputWidth } from '@/views/config';
  import i18n from '@/locale';
  import readBlob from '@/utils/readBlob';
  import ResizeableContainer from '@/components/resizeable-container/index.vue';
  import AceEditor from '@/components/ace-editor/index.vue';

  export default defineComponent({
    name: 'AutoReadfile',
    emits: ['update:modelValue'],
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
      showGutter: {
        type: Boolean,
        default: false
      },
      widget: {
        type: String as PropType<'textarea' | 'editor'>,
        default: 'editor'
      }
    },
    setup(props, ctx) {
      const editor = ref();
      const textareaWidth = ref(props.minWidth || InputWidth.LARGE);
      const textareaHeight = ref(180);

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
      };

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
            v-model={props.modelValue}
            ref={(val) => {
              editor.value = val;
            }}
            label={props.label}
            editor-default-value={props.defaultValue}
            lang={props.lang}
            read-only={props.viewStatus}
            style={{ width: '100%' }}
            height={textareaHeight.value}
            show-gutter={props.showGutter}
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
            width: `${textareaWidth.value}px`
          }}
        >
          <ResizeableContainer
            min-height={40}
            min-width={props.minWidth || InputWidth.LARGE}
            wrapper="parentNode"
            act-edges={{ right: true, bottom: true }}
            onChange={(data) => handleResize(data)}
          >
            <div class="box">
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
