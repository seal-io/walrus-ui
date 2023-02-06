<template>
  <div class="chain-wrap" @click="handleView">
    <!-- <a-link
      v-if="showSetting"
      class="setting-icon"
      @click.stop="handleToSetting"
      ><icon-settings
    /></a-link> -->
    <dl :class="{ inactive: !available }">
      <a-space direction="vertical" :size="12">
        <dt class="icon" :style="{ 'background-image': `url(${src})` }">
          <!-- <img src="" alt="" /> -->
        </dt>
        <dd class="status label">
          <a-tag v-if="!available" color="#c9cdd4" size="small">{{
            $t('intergration.notopen')
          }}</a-tag>
          <span v-else>
            <a-tag v-if="status" color="#4CD263" size="small">{{
              $t('intergration.configured')
            }}</a-tag>
            <a-tag v-if="!status" color="#c9cdd4" size="small">{{
              $t('intergration.unconfigured')
            }}</a-tag>
          </span>
          <!-- {{
            status
              ? $t('intergration.configured')
              : $t('intergration.unconfigured')
          }} -->
        </dd>
        <dd class="label">{{ title }}</dd>
      </a-space>
    </dl>
  </div>
</template>

<script lang="ts" setup>
  // import { PropType } from 'vue';

  const emitList = defineEmits(['setting', 'viewList']);

  const prop = defineProps({
    showSetting: {
      type: Boolean,
      default() {
        return false;
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    status: {
      type: Boolean,
      default() {
        return false;
      },
    },
    src: {
      type: String,
      default() {
        return '';
      },
    },
    available: {
      type: Boolean,
      default() {
        return false;
      },
    },
  });
  const handleToSetting = () => {
    emitList('setting');
  };
  const handleView = () => {
    if (!prop.available) return;
    if (prop.status && prop.showSetting) {
      emitList('viewList');
    } else {
      emitList('setting');
    }
  };
</script>

<style lang="less" scoped>
  .chain-wrap {
    position: relative;
    height: 140px;
    font-size: 0;

    .setting-icon {
      position: absolute;
      top: 8px;
      right: 10px;
      font-size: 18px;
    }

    dl {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-items: center;
      height: 100%;
      padding: 8px;
      text-align: center;
      background-color: #fff;
      border: 2px solid transparent;
      cursor: pointer;

      &:hover {
        border-color: var(--sealblue-6);
      }

      &.inactive {
        border: 2px solid transparent;
        cursor: not-allowed;
      }

      :deep(.arco-space-item) {
        display: flex;
        justify-content: center;
      }

      .icon {
        width: 60px;
        height: 60px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      .label {
        margin-left: 0;
        color: var(--color-text-1);
        font-weight: 500px;
        font-size: 16px;

        &.status {
          font-weight: 400;
          font-size: 12px;
        }
      }
    }
  }
</style>
