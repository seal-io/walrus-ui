<template>
  <span>
    <span>{{ time }}</span>
  </span>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, watch } from 'vue';

  const props = defineProps({
    startTime: {
      type: String,
      default() {
        return '';
      }
    },
    stopped: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const time = ref('');
  let timer: any = null;
  const updateTime = () => {
    if (!props.startTime) {
      clearInterval(timer);
      return;
    }
    timer = setInterval(() => {
      const res = dayjs().diff(dayjs(props.startTime));
      time.value = dayjs(res).format('HH:mm:ss');
    }, 1000);
  };
  watch(
    () => props.startTime,
    () => {
      updateTime();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.stopped,
    (newVal) => {
      if (newVal) {
        clearInterval(timer);
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="less" scoped></style>
