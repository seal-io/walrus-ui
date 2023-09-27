<script lang="tsx">
  import { defineComponent, toRefs, ref, onMounted, onUnmounted } from 'vue';

  export default defineComponent({
    props: {
      position: {
        type: String,
        default() {
          return '';
        }
      }
    },
    emits: ['addStage'],
    setup(props, { emit }) {
      const { position } = toRefs(props);
      const handleAddStage = () => {
        emit('addStage');
      };

      return () => (
        <div class="split-line">
          <div class={['split-line-btn', position.value]}>
            <a-tooltip content="添加新的阶段">
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
        color: var(--color-text-3);
        font-size: 20px;
        transform: translateX(-50%);
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>
