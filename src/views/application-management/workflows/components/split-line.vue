<script lang="tsx">
  import { defineComponent, toRefs } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  export default defineComponent({
    props: {
      position: {
        type: String,
        default() {
          return '';
        }
      },
      showLine: {
        type: Boolean,
        default() {
          return true;
        }
      },
      type: {
        type: String,
        default() {
          return '';
        }
      },
      btnText: {
        type: String,
        default() {
          return '';
        }
      }
    },
    emits: ['add'],
    setup(props, { emit }) {
      const { t } = useCallCommon();
      const { position } = toRefs(props);
      const handleAddStage = () => {
        emit('add');
      };

      return () => (
        <div class="split-line">
          <div
            class={[
              'split-line-btn',
              { 'show-line': props.showLine },
              position.value,
              props.type
            ]}
          >
            <a-tooltip content={props.btnText}>
              <icon-plus-circle-fill
                class="plus-btn"
                onClick={() => handleAddStage()}
              />
            </a-tooltip>
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .split-line {
    position: relative;
    width: 48px;
    height: 100%;

    .split-line-btn {
      position: relative;
      height: 100%;

      &::before {
        width: 0;
      }

      &.show-line::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background-color: var(--color-border-2);
        content: '';
      }

      &::after {
        position: absolute;
        top: 99px;
        left: 0;
        width: 48px;
        height: 1px;
        background-color: var(--color-border-2);
        content: '';
      }

      &.first {
        &::after {
          left: 24px;
          width: 24px;
        }
      }

      &.last {
        &::after {
          left: 0;
          width: 24px;
        }
      }

      .plus-btn {
        position: absolute;
        top: 90px;
        left: 50%;
        z-index: 2;
        color: rgb(var(--arcoblue-5));
        font-size: 20px;
        transform: translateX(-50%);
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }

      &.internal {
        &::after {
          top: 27px;
        }

        .plus-btn {
          top: 18px;
        }
      }
    }
  }
</style>
