<template>
  <div class="condition-box">
    <div class="operator">
      <a-select
        :options="relationOptions"
        style="width: 80px"
        size="small"
      ></a-select>
    </div>
    <a-space class="condition" :size="10" direction="vertical">
      <div class="condition-item" style="width: 400px">
        <a-select :options="operatorList" style="flex: 1"></a-select>
        <a-select :options="operatorList" style="flex-basis: 100px"></a-select>
        <a-input style="flex: 1"></a-input>
        <a-button
          type="outline"
          size="mini"
          shape="round"
          class="mini-icon-btn"
          style="margin-left: 8px"
          @click="handleAddFilter"
        >
          <icon-plus></icon-plus>
        </a-button>
        <a-button
          type="outline"
          size="mini"
          shape="round"
          class="mini-icon-btn"
          style="margin-left: 8px"
          @click="handleDeleteFilter"
        >
          <icon-minus></icon-minus>
        </a-button>
      </div>

      <div class="condition-item" style="width: 400px">
        <a-select :options="operatorList" style="flex: 1"></a-select>
        <a-select :options="operatorList" style="flex-basis: 100px"></a-select>
        <a-input style="flex: 1"></a-input>
        <a-button
          type="outline"
          size="mini"
          shape="round"
          class="mini-icon-btn"
          style="margin-left: 8px"
          @click="handleAddFilter"
        >
          <icon-plus></icon-plus>
        </a-button>
        <a-button
          type="outline"
          size="mini"
          shape="round"
          class="mini-icon-btn"
          style="margin-left: 8px"
          @click="handleDeleteFilter"
        >
          <icon-minus></icon-minus>
        </a-button>
      </div>

      <div class="condition-box">
        <div class="operator">
          <a-select
            :options="relationOptions"
            style="width: 80px"
            size="small"
          ></a-select>
        </div>
        <a-space class="condition" :size="10" direction="vertical">
          <div class="condition-item" style="width: 400px">
            <a-select :options="operatorList" style="flex: 1"></a-select>
            <a-select
              :options="operatorList"
              style="flex-basis: 100px"
            ></a-select>
            <a-input style="flex: 1"></a-input>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleAddFilter"
            >
              <icon-plus></icon-plus>
            </a-button>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleDeleteFilter"
            >
              <icon-minus></icon-minus>
            </a-button>
          </div>
          <div class="condition-item" style="width: 400px">
            <a-select :options="operatorList" style="flex: 1"></a-select>
            <a-select
              :options="operatorList"
              style="flex-basis: 100px"
            ></a-select>
            <a-input style="flex: 1"></a-input>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleAddFilter"
            >
              <icon-plus></icon-plus>
            </a-button>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleDeleteFilter"
            >
              <icon-minus></icon-minus>
            </a-button>
          </div>
        </a-space>
      </div>

      <div class="condition-box">
        <div class="operator">
          <a-select
            :options="relationOptions"
            style="width: 80px"
            size="small"
          ></a-select>
        </div>
        <a-space class="condition" :size="10" direction="vertical">
          <div class="condition-item" style="width: 400px">
            <a-select :options="operatorList" style="flex: 1"></a-select>
            <a-select
              :options="operatorList"
              style="flex-basis: 100px"
            ></a-select>
            <a-input style="flex: 1"></a-input>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleAddFilter"
            >
              <icon-plus></icon-plus>
            </a-button>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleDeleteFilter"
            >
              <icon-minus></icon-minus>
            </a-button>
          </div>
          <div class="condition-item" style="width: 400px">
            <a-select :options="operatorList" style="flex: 1"></a-select>
            <a-select
              :options="operatorList"
              style="flex-basis: 100px"
            ></a-select>
            <a-input style="flex: 1"></a-input>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleAddFilter"
            >
              <icon-plus></icon-plus>
            </a-button>
            <a-button
              type="outline"
              size="mini"
              shape="round"
              class="mini-icon-btn"
              style="margin-left: 8px"
              @click="handleDeleteFilter"
            >
              <icon-minus></icon-minus>
            </a-button>
          </div>
        </a-space>
      </div>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { relationOptions, operatorList } from '../config';

  const handleAddFilter = () => {};
  const handleDeleteFilter = () => {};
</script>

<style lang="less" scoped>
  .condition-box {
    position: relative;
    display: flex;
    padding: 16px 10px;
    background-color: var(--color-fill-2);
    border-radius: 2px;

    &::before {
      position: absolute;
      top: 15px;
      left: 50px;
      display: inline-block;
      width: 60px;
      border-top: 1px solid var(--color-border-3);
      content: '';
    }

    &::after {
      position: absolute;
      bottom: 15px;
      left: 50px;
      display: inline-block;
      width: 60px;
      border-top: 1px solid var(--color-border-3);
      content: '';
    }

    .condition {
      display: flex;
      flex-direction: column;
    }

    .condition-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 30px;
    }

    .operator {
      position: relative;
      display: flex;
      align-items: center;

      &::before {
        position: absolute;
        top: 0;
        bottom: calc(50% + 14px);
        left: 50%;
        display: inline-block;
        border-left: 1px solid var(--color-border-3);
        content: '';
      }

      &::after {
        position: absolute;
        top: calc(50% + 14px);
        bottom: 0;
        left: 50%;
        display: inline-block;
        border-left: 1px solid var(--color-border-3);
        content: '';
      }
    }
  }
</style>
