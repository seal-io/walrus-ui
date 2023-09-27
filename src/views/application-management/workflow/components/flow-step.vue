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
    emits: ['insertPrev', 'insertNext', 'addTask'],
    setup(props, { emit }) {
      const { position } = toRefs(props);
      const list = ref([1]);

      const handleInsertPrev = (index) => {
        list.value.splice(index + 1, 0, 1);
        emit('insertPrev');
      };
      const handleInsertNext = (index) => {
        list.value.splice(index, 0, 1);
        emit('insertNext');
      };

      const handleAddTask = () => {
        list.value.push(1);
        emit('addTask');
      };

      const renderStep = (item, index) => {
        return (
          <div class="step-box" key={index}>
            <div class="prev btn-wrap" onClick={() => handleInsertPrev(index)}>
              <a-tooltip content="添加串行任务">
                <icon-plus-circle-fill class="plus-btn" />
              </a-tooltip>
            </div>
            <div class="step-content">安全扫描-{index}</div>
            <div class="next btn-wrap" onClick={() => handleInsertNext(index)}>
              <a-tooltip content="添加串行任务">
                <icon-plus-circle-fill class="plus-btn" />
              </a-tooltip>
            </div>
          </div>
        );
      };

      const renderPlusTaskBtn = () => {
        return (
          <div class="step-box">
            <div class="step-content" onClick={() => handleAddTask()}>
              <icon-plus-circle-fill class="btn-icon m-r-5" />
              <span>添加任务</span>
            </div>
          </div>
        );
      };
      return () => (
        <div class={['flow-step', position.value]}>
          <div class="box">
            {list.value.length ? (
              <>
                <div class="trigger-btn">
                  <icon-play-circle class="btn" />
                </div>
                {list.value.map((item, index) => {
                  return renderStep(item, index);
                })}
              </>
            ) : (
              renderPlusTaskBtn()
            )}
          </div>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-step {
    position: relative;
    display: flex;
    align-items: center;

    .box {
      position: relative;
      z-index: 5;
      display: flex;
      align-items: center;
      margin: 10px;
    }

    &::before {
      position: absolute;
      right: 0;
      bottom: 50%;
      left: 0;
      display: inline-block;
      height: 56px;
      border: 1px solid var(--color-border-2);
      border-top: none;
      content: '';
    }

    &.last {
      &::before {
        border-radius: 0 0 16px 16px;
      }
    }

    .trigger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin: 0 10px;
      background-color: rgba(var(--arcoblue-1), 0.6);
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        background-color: rgba(var(--arcoblue-2), 0.5);
      }

      .btn {
        color: rgba(var(--arcoblue-5), 1);
        font-size: 20px;
      }
    }

    .step-box {
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        .btn-wrap {
          .plus-btn {
            display: block;
          }

          &::before {
            position: absolute;
            right: -12px;
            bottom: 10px;
            display: inline-block;
            width: 14px;
            height: 1px;
            background-color: rgb(var(--arcoblue-5));
            content: '';
          }

          &.next::before {
            right: auto;
            left: -12px;
          }
        }

        .step-content {
          color: rgb(var(--arcoblue-5));
          border: 1px solid rgb(var(--arcoblue-5));

          .btn-icon {
            color: rgb(var(--arcoblue-5));
          }
        }
      }

      .step-content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 120px;
        height: 36px;
        padding: 0 16px;
        color: var(--color-text-2);
        background-color: #fff;
        border: 1px solid var(--color-border-3);
        border-radius: 36px;
        box-shadow: 0 2px 4px 0 rgba(var(--gray-5), 60%);

        .btn-icon {
          color: var(--color-text-3);
        }
      }

      .prev {
        margin-right: 12px;
      }

      .next {
        margin-left: 12px;
      }

      .btn-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      }

      .plus-btn {
        display: none;
        color: var(--color-text-3);
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: rgb(var(--arcoblue-5));
        }
      }
    }
  }
</style>
