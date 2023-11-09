<script lang="tsx">
  import { defineComponent, toRefs } from 'vue';

  export default defineComponent({
    props: {
      position: {
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
    emits: ['addParallel'],
    setup(props, { emit }) {
      const { position, btnText } = toRefs(props);

      const handleAddParallel = () => {
        emit('addParallel');
      };
      const renderStep = () => {
        return (
          <div class="step-box">
            <div class="prev btn-wrap"></div>
            <div class="step-content" onClick={() => handleAddParallel()}>
              <icon-plus-circle-fill class="btn-icon m-r-5" />
              <span>{btnText.value}</span>
            </div>
            <div class="next btn-wrap"></div>
          </div>
        );
      };

      return () => (
        <div class={['flow-step']}>
          <div class="box">
            {/* <div class="trigger-btn"></div> */}
            {renderStep()}
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
      border-radius: 0 0 16px 16px;
      content: '';
    }

    &.non-step::before {
      border-radius: 0;
    }

    .trigger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin: 0 10px;
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
        min-width: 135px;
        height: 36px;
        padding: 0 16px;
        color: var(--color-text-2);
        background-color: #fff;
        border: 1px solid var(--color-border-3);
        border-radius: 36px;
        box-shadow: 0 2px 4px 0 rgba(var(--gray-5), 60%);

        .btn-icon {
          color: rgb(var(--arcoblue-5));
          font-size: 16px;
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
