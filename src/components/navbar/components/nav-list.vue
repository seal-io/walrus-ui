<template>
  <div class="nav-list-wrap">
    <a-tabs :active-key="defaultActive" lazy-load @tab-click="handleTabChange">
      <a-tab-pane
        v-for="item in list"
        :key="item.active"
        :title="$t(item.label)"
      >
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  interface NavDataMap {
    name: string;
    label: string;
    active: string;
  }
  const props = defineProps({
    list: {
      type: Array as PropType<NavDataMap[]>,
      default() {
        return [];
      }
    },
    defaultActive: {
      type: String,
      dfault() {
        return '';
      }
    }
  });
  const handleTabChange = (active) => {
    const tab: NavDataMap | undefined = props.list.find(
      (item) => item.active === active
    );
    router.push({
      name: tab?.name
    });
  };
</script>

<style lang="less" scoped>
  @nav-tab-height: 55px;

  .nav-list-wrap {
    :deep(.arco-tabs-content) {
      padding-top: 0;
    }

    :deep(.arco-tabs-nav) {
      height: @nav-tab-height;

      &::before {
        height: 0;
      }

      .arco-tabs-tab ~ .arco-tabs-nav-ink {
        display: none;
      }

      .arco-tabs-tab.arco-tabs-tab-active ~ .arco-tabs-nav-ink {
        display: block;
      }

      .arco-tabs-tab {
        color: var(--seal-color-text-1);
        font-weight: var(--font-weight-medium);

        &:hover {
          color: var(--seal-active-text);
        }

        &-active {
          color: var(--seal-active-text);
        }

        .arco-tabs-tab-title {
          &::before {
            display: none;
          }
        }
      }

      .arco-tabs-nav-ink {
        background-color: var(--seal-active-text);
      }
    }
  }
</style>
