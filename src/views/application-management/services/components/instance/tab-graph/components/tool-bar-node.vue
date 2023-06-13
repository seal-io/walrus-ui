<template>
  <NodeToolbar
    :is-visible="_.get(data, 'toolbar.isVisible')"
    :position="Position.Right"
  >
    <a-dropdown :popup-visible="true" @select="handleSelect">
      <span ref="triggerButton">{{ _.get(data, 'toolbar.isVisible') }}</span>
      <template #content>
        <a-doption>action-1</a-doption>
        <a-doption>action-2</a-doption>
        <a-doption>action-3</a-doption>
      </template>
    </a-dropdown>
    <!-- <div class="arco-scrollbar-container arco-dropdown-list-wrapper">
      <ul class="arco-dropdown-list">
        <li class="arco-dropdown-option">
          <span class="arco-dropdown-option-content">option-1</span>
        </li>
        <li class="arco-dropdown-option">
          <span class="arco-dropdown-option-content">option-2</span>
        </li>
        <li class="arco-dropdown-option">
          <span class="arco-dropdown-option-content">option-3</span>
        </li>
      </ul>
    </div> -->
  </NodeToolbar>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { ref, watch } from 'vue';
  import { Position } from '@vue-flow/core';
  import { NodeToolbar } from '@vue-flow/node-toolbar';

  const props = defineProps({
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emits = defineEmits(['select']);
  const triggerButton = ref();
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    triggerButton.value.dispatchEvent(event);
  };
  const handleSelect = (val) => {
    console.log('action:', props.data);
    emits('select', { node: props.data, action: val });
  };
  watch(
    () => props.data?.toolbar?.isVisible,
    (val) => {
      if (val) {
        setTimeout(() => {
          setDropDownVisible();
        });
      }
    },
    {
      immediate: true
    }
  );
</script>
