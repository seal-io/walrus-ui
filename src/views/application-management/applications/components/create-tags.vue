<template>
  <a-space wrap>
    <a-input
      v-if="showInput"
      ref="inputRef"
      v-model.trim="inputVal"
      :style="{ width: '90px' }"
      size="mini"
      @keyup.enter="handleAdd"
      @blur="handleBlur"
    />
    <a-tag
      v-else
      :style="{
        width: '90px',
        color: 'rgb(var(--arcoblue-5))',
        backgroundColor: 'rgba(var(--arcoblue-1), 0.3)',
        border: '1px solid rgb(var(--arcoblue-5))',
        cursor: 'pointer'
      }"
      @click="handleEdit"
    >
      <template #icon>
        <icon-plus style="color: rgb(var(--arcoblue-5))" />
      </template>
      {{ $t('applications.applications.tags.button') }}
    </a-tag>
    <a-tag
      v-for="(tag, index) in tagList"
      :key="index"
      closable
      color="rgb(232, 242, 255)"
      style="color: inherit"
      @close="handleRemove(index)"
      >{{ tag }}
    </a-tag>
  </a-space>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import { PropType, watch, ref, nextTick } from 'vue';

  const props = defineProps({
    tags: Array as PropType<string[]>,
    default() {
      return [];
    }
  });
  const emits = defineEmits(['update:tags']);
  const tagList = ref<string[]>([]);
  const inputRef = ref(null);
  const showInput = ref(false);
  const inputVal = ref('');

  const handleRemove = (index) => {
    tagList.value.splice(index, 1);
    emits('update:tags', tagList.value);
  };
  const handleAdd = () => {
    if (inputVal.value) {
      tagList.value.push(inputVal.value);
      tagList.value = _.uniq(tagList.value);
      inputVal.value = '';
      emits('update:tags', tagList.value);
    }
  };
  const handleBlur = () => {
    showInput.value = false;
  };
  const handleEdit = () => {
    showInput.value = true;

    nextTick(() => {
      if (inputRef.value) {
        inputRef.value?.focus?.();
      }
    });
  };
  watch(
    () => props.tags,
    () => {
      tagList.value = _.cloneDeep(props.tags || []);
    },
    {
      immediate: true,
      deep: true
    }
  );
</script>

<style lang="less" scoped></style>
