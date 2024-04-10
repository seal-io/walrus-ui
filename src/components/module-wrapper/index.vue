<script lang="tsx">
  import { defineComponent, ref, watchEffect, withModifiers } from 'vue';
  import SlTransition from '@/components/sl-transition/index.vue';
  import { deleteModal } from '@/utils/monitor';

  export default defineComponent({
    props: {
      title: {
        type: String,
        default() {
          return '';
        }
      },
      showTitle: {
        type: Boolean,
        default() {
          return true;
        }
      },
      innerWrap: {
        type: Boolean,
        default() {
          return false;
        }
      },
      status: {
        type: Boolean,
        default() {
          return false;
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showArrow: {
        type: Boolean,
        default() {
          return true;
        }
      },
      showDelete: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    emits: ['delete', 'update:status', 'collapse'],
    setup(props, { emit, slots }) {
      const isCollapse = ref(props.status);
      const handleCollapse = () => {
        if (props.disabled) return;
        isCollapse.value = !isCollapse.value;
        emit('update:status', isCollapse.value);
        emit('collapse', isCollapse.value);
      };
      const handleDeleteConfirm = () => {
        emit('delete');
      };
      const handleDelete = () => {
        deleteModal({ onOk: handleDeleteConfirm });
      };

      watchEffect(() => {
        isCollapse.value = props.status;
      });

      const renderArrow = () => {
        if (!props.showArrow) return null;
        return (
          <span class="text">
            {!isCollapse.value ? <icon-right /> : <icon-down />}
          </span>
        );
      };

      const renderDefaultRight = () => {
        if (!props.showDelete) return null;
        return (
          <a-button
            status="danger"
            type="text"
            onClick={withModifiers(() => handleDelete(), ['stop'])}
            v-slots={{
              icon: () => <icon-delete style="font-size: 16px" />
            }}
          ></a-button>
        );
      };

      const renderTitle = () => {
        if (!props.showTitle) return null;
        return (
          <div class={['title', { 'no-del-btn': !props.showDelete }]}>
            <div
              class="text-wrap"
              onClick={withModifiers(() => handleCollapse(), ['stop'])}
            >
              <a-space>
                {renderArrow()}
                {slots.title ? slots.title() : <span>{props.title}</span>}
              </a-space>
            </div>
            {slots.right ? slots.right() : renderDefaultRight()}
          </div>
        );
      };

      return () => (
        <div class={['mo-wrap', { disabled: props.disabled }]}>
          {renderTitle()}
          <SlTransition>
            <div v-show={isCollapse.value}>
              <div class={['content', { inner: props.innerWrap }]}>
                {slots.default?.()}
              </div>
            </div>
          </SlTransition>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .mo-wrap {
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 10px;
      font-weight: var(--font-weight-medium);
      font-size: 14px;
      background-color: var(--color-fill-1);
      cursor: pointer;

      .text-wrap {
        display: flex;
        flex: 1;
        height: 100%;
      }

      &.no-del-btn {
        justify-content: space-between;
      }
    }

    .text {
      display: flex;
    }

    .collapse-icon {
      color: rgba(var(--arcoblue-6), 0.7);
      font-size: var(--font-size-large);
      cursor: pointer;
      transition: all 0.2s var(--seal-transition-func);
      .hoverable();

      &:hover {
        .hoverableHover();

        color: rgba(var(--arcoblue-6), 0.7);
      }

      &.collapse {
        transition: all 0.2s var(--seal-transition-func);
      }
    }

    .content {
      padding: 10px;

      &.inner {
        padding: 0;
      }
    }
  }
</style>
