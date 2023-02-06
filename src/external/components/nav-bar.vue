<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img alt="logo" class="logo" src="../../assets/images/seal-logo.png" />
      </a-space>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';

  const { changeLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];
  const triggerBtn = ref();
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };
</script>

<style scoped lang="less">
  @media screen and (min-width: 1512px) {
    .navbar {
      box-sizing: border-box;
      width: 1440px;
    }
  }
  @media screen and (max-width: 1511px) {
    .navbar {
      box-sizing: border-box;
      width: 100%;
      padding-right: 20px;
    }
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    margin: 0 auto;
    background-color: var(--seal-color-bg-1);
    // border-bottom: 1px solid var(--color-border);
    :deep(.arco-typography) {
      color: #fff;
    }
  }

  .nav-list {
    display: flex;
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 5px;

    :deep(.arco-space-item) {
      font-size: 0;
    }

    .logo {
      width: 100px;
      height: auto;
      cursor: pointer;
    }
  }

  .right-side {
    display: flex;
    list-style: none;
    // padding-right: 10px;
    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;

      &:last-child {
        padding-right: 0;
      }
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      color: rgb(var(--gray-8));
      font-size: 16px;
      border-color: var(--seal-color-text-1);
    }

    svg {
      color: var(--seal-color-text-1);
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
