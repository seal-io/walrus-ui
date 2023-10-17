<script lang="tsx">
  import { defineComponent, toRefs } from 'vue';
  import useCallCommon from '@/hooks/use-call-common';

  export default defineComponent({
    props: {
      basicInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    emits: ['edit'],
    setup(props, { emit }) {
      const { t } = useCallCommon();
      const { basicInfo } = toRefs(props);
      return () => (
        <div class="flow-aside-container">
          <div class="flow-header">{t('applications.workflow.name')}</div>
          <div class="flow-content">
            <icon-branch class="m-r-5 size-16" />
            <span>{basicInfo.value.displayName}</span>
            <a-link onClick={() => emit('edit')}>
              <icon-edit />
            </a-link>
          </div>
          {/* <a-button
            type="outline"
            shape="round"
            class="m-r-5"
            long
            v-slots={{
              icon: () => <icon-plus class="m-r-5" />
            }}
          >
            添加流水线源
          </a-button> */}
        </div>
      );
    }
  });
</script>

<style lang="less" scoped>
  .flow-aside-container {
    height: 100%;

    .flow-header {
      margin-bottom: 50px;
    }

    .flow-content {
      display: flex;
      align-items: center;
      width: max-content;
      height: 36px;
      margin-left: 5px;
      padding: 0 10px;
      border-radius: 18px;
      box-shadow: 0 2px 4px 0 rgba(var(--gray-5), 60%);

      .arco-link {
        height: 22px;
        margin-left: 5px;
        overflow: hidden;
        border-radius: 50%;

        .arco-icon {
          stroke-width: 4;
        }
      }
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
