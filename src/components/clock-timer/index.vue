<template>
  <span class="time-box">
    <span>{{ stopped ? value : time }}</span>
  </span>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, watch, watchEffect } from 'vue';
  import i18n from '@/locale';

  const { t, locale } = i18n.global;
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
    },
    value: {
      type: String,
      default() {
        return '';
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });

  const time = ref('00:00:00');
  let timer: any = null;
  const updateTime = () => {
    console.log('props.startTime', props.startTime);
    if (!props.startTime) {
      clearInterval(timer);
      return;
    }
    timer = setInterval(() => {
      const res = dayjs().diff(dayjs(props.startTime));
      time.value = dayjs.duration(res).format('HH:mm:ss');
      // equal or great than 1 day
      if (res >= 24 * 60 * 60 * 1000) {
        const days = dayjs.duration(res).get('days');
        const unit = days > 1 && locale === 'en-US' ? 's' : '';
        time.value = `${days}${t('common.time.day')}${unit} ${time.value}`;
      }
    }, 1000);
  };

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
  watch(
    () => props.show,
    (newVal) => {
      if (!newVal) {
        time.value = '00:00:00';
        clearInterval(timer);
      }
    },
    {
      immediate: true
    }
  );
  watchEffect(() => {
    if (props.show && props.startTime) {
      updateTime();
    }
  });
</script>

<style lang="less" scoped>
  .time-box {
    display: inline-block;
    // width: 65px;
  }
</style>
