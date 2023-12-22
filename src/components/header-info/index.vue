<template>
  <div>
    <div class="header-info" :class="{ 'top-gap': topGap }">
      <div class="left">
        <div class="img">
          <slot name="icon"></slot>
          <span v-if="showImgIcon" class="custom-icon">
            <slot name="img"></slot>
          </span>
        </div>
      </div>
      <div class="right">
        <slot name="title" class="title">
          <div class="title">{{ info?.name }}</div>
        </slot>
        <slot name="status"></slot>
        <slot name="description" class="desc"></slot>
      </div>
      <div class="extra">
        <slot name="extra"></slot>
      </div>
    </div>
    <!-- <div style="padding: 0 20px">
      <a-divider
        style="margin: 0; border-color: var(--color-fill-2); border-radius: 1px"
        :size="3"
      ></a-divider>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    topGap: {
      type: Boolean,
      default() {
        return false;
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    showImgIcon: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
</script>

<style lang="less" scoped>
  .header-info {
    position: relative;
    display: flex;
    align-items: center;
    height: 112px;
    padding: 16px;
    background-color: #fff;
    border-radius: var(--border-radius-small);

    &.top-gap {
      margin-top: 10px;
    }

    .left {
      width: 80px;

      .img {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 80px;
        background-color: transparent;

        :deep(.iconfont) {
          color: rgb(var(--arcoblue-5));
          font-size: 42px;
          background-color: transparent;
          // box-shadow: 0 0 16px 2px rgb(var(--arcoblue-4));
          border-radius: 50%;
        }

        .custom-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          color: #fff;
          background-color: rgb(var(--arcoblue-5));
          border-radius: 50%;

          :deep(.arco-icon) {
            font-size: 32px;
          }
        }
      }
    }

    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      padding: 8px 16px;
      line-height: 32px;

      :deep(.title) {
        display: flex;
        justify-content: space-between;
        min-width: 400px;
        max-width: max-content;
        font-weight: 500;
        font-size: 20px;

        .normal {
          margin-left: 40px;
          font-weight: 400;
          font-size: 14px;
        }
      }

      :deep(.description) {
        display: flex;
        display: -webkit-box;
        max-width: 940px;
        overflow: hidden;
        line-height: 26px;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .extra {
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
</style>
