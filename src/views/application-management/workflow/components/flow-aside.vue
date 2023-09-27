<script lang="tsx">
  import { defineComponent, toRefs, ref, onMounted, onUnmounted } from 'vue';

  export default defineComponent({
    setup() {
      return () => (
        <div class="flow-aside-container">
          <div class="flow-header">流水线源</div>
          <div class="flow-content">
            <icon-branch class="m-r-5 size-16" />
            <span>job-XXX-123123</span>
          </div>
          <a-button
            type="outline"
            shape="round"
            class="m-r-5"
            long
            v-slots={{
              icon: () => <icon-plus class="m-r-5" />
            }}
          >
            添加流水线源
          </a-button>
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-aside-container {
    height: 100%;
    // background-color: var(--color-fill-2);
    .flow-header {
      margin-bottom: 50px;
    }

    .flow-content {
      display: flex;
      align-items: center;
      height: 36px;
      margin-left: 5px;
      padding: 0 10px;
      border-radius: 18px;
      box-shadow: 0 2px 4px 0 rgba(var(--gray-5), 60%);
    }

    :deep(.arco-btn-outline) {
      margin-top: 50px;
      box-shadow: 0 2px 4px 0 rgba(var(--arcoblue-3), 50%);

      &:hover {
        box-shadow: 0 2px 4px 0 rgba(var(--arcoblue-3), 100%);
      }
    }
  }
</style>
