<script lang="tsx">
  import i18n from '@/locale';
  import useCallCommon from '@/hooks/use-call-common';
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      title: String,
      bordered: {
        type: Boolean,
        default() {
          return true;
        }
      },
      flexStart: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isDetail: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showBack: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showEdit: {
        type: Boolean,
        default() {
          return false;
        }
      },
      iconed: {
        type: Boolean,
        default() {
          return false;
        }
      }
    },
    emits: ['edit'],
    setup(props, { slots, emit }) {
      const { router } = useCallCommon();
      const handleBack = () => {
        router.back();
      };
      const handleEdit = () => {
        emit('edit');
      };

      return () => (
        <div
          class={[
            'group-title',
            {
              'bordered': props.bordered,
              'is-detail': props.isDetail,
              'iconed': props.iconed,
              'flex-start': props.flexStart
            }
          ]}
        >
          <div class="label">
            {props.showBack && (
              <>
                <a-link onClick={() => handleBack()}>
                  <icon-arrow-left
                    style={{ 'stroke-width': 5, 'font-size': '16px' }}
                  />
                </a-link>
                <a-divider direction="vertical"></a-divider>
              </>
            )}
            <div class="title-wrap">
              <>
                {slots.title ? slots.title() : <span>{props.title}</span>}
                {slots.extra?.()}
                {props.showEdit && (
                  <a-link class="m-l-10" onClick={() => handleEdit()}>
                    <icon-edit></icon-edit>
                    <span class="mleft-5">
                      {i18n.global.t('common.button.edit')}
                    </span>
                  </a-link>
                )}
              </>
            </div>
          </div>
          {slots.right && <div class="right">{slots.right?.()}</div>}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .group-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-weight: var(--font-weight-regular);

    &.iconed {
      padding-left: 8px;
    }

    &.iconed::before {
      position: absolute;
      top: 0;
      bottom: 10px;
      left: 0;
      display: inline-block;
      width: 3px;
      background-color: rgba(var(--arcoblue-6), 0.8);
      border-radius: 0 4px 4px 0;
      content: '';
    }

    &.bordered {
      font-weight: var(--font-weight-regular);
      border-bottom: 1px solid var(--seal-border-gray);
    }

    &.is-detail {
      margin-bottom: 10px;
      border-bottom: 1px solid var(--color-white);
    }

    &.flex-start {
      .label {
        .title-wrap {
          justify-content: flex-start;
        }
      }
    }

    .label {
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--color-text-2);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-large);

      .title-wrap {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
</style>
