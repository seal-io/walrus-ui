<script lang="tsx">
  import i18n from '@/locale';
  import { defineComponent, ref, watch } from 'vue';

  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    emits: ['update:show', 'confirm', 'cancel'],
    setup(props, { slots, emit }) {
      const { t } = i18n.global;

      const formData = ref({
        comment: ''
      });

      const handleCancel = () => {
        formData.value.comment = '';
        emit('update:show', false);
        emit('cancel');
      };

      const handleOk = () => {
        emit('confirm', formData.value.comment);
        setTimeout(() => {
          emit('update:show', false);
        }, 100);
      };

      const handleBeforeOpen = () => {
        formData.value.comment = '';
      };

      const handleBeforeClose = () => {
        formData.value.comment = '';
      };

      return () => (
        <a-modal
          top="10%"
          closable={false}
          align-center={false}
          width={600}
          ok-text={t('common.button.confirm')}
          cancel-button-props={{ type: 'outline' }}
          visible={props.show}
          mask-closable={false}
          unmount-on-close={true}
          body-style={{ 'max-height': '400px', 'overflow': 'auto' }}
          modal-class="project-modal"
          title={props.title}
          onCancel={() => handleCancel()}
          onOk={() => handleOk()}
          onBeforeOpen={() => handleBeforeOpen()}
          onBeforeClose={() => handleBeforeClose()}
          v-slots={{
            footer: () => (
              <a-space
                size={30}
                fill
                align="center"
                style={{
                  'paddingBottom': '20px',
                  'justify-content': 'center'
                }}
              >
                <a-button
                  type="primary"
                  onClick={() => handleOk()}
                  style={{ width: '88px' }}
                >
                  {t('common.button.confirm')}
                </a-button>
                <a-button type="outline" onClick={() => handleCancel()}>
                  {t('common.button.cancel')}
                </a-button>
              </a-space>
            )
          }}
        >
          <a-form model={formData.value} auto-label-width>
            {slots.default ? (
              slots.default()
            ) : (
              <a-form-item hide-label>
                <seal-textarea
                  v-model={formData.value.comment}
                  label={t('common.table.mark')}
                  style={{ width: '100%' }}
                  max-length={100}
                  show-word-limit
                ></seal-textarea>
              </a-form-item>
            )}
          </a-form>
        </a-modal>
      );
    }
  });
</script>

<style lang="less">
  .arco-modal.project-modal {
    .btn-wrapper {
      margin-left: 12px;

      .arco-icon {
        color: rgb(var(--arcoblue-6));
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>
