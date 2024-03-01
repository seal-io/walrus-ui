import { StatusDarkColorBgMap, StatusLightColorBgMap } from '@/views/config';
import { computed } from 'vue';

export default function useStatusConfig() {
  const statusColorMap = computed(() => {
    // return {
    //   running: appStore.isDark
    //     ? StatusDarkColorBgMap.transitioning
    //     : StatusLightColorBgMap.transitioning,
    //   failed: appStore.isDark
    //     ? StatusDarkColorBgMap.error
    //     : StatusLightColorBgMap.error,
    //   succeed: appStore.isDark
    //     ? StatusDarkColorBgMap.ready
    //     : StatusLightColorBgMap.ready,
    //   succeeded: appStore.isDark
    //     ? StatusDarkColorBgMap.ready
    //     : StatusLightColorBgMap.ready
    // };
    return {
      running: 'rgba(247, 186, 30,1)',
      auditing: 'rgba(135, 145, 247, .5)',
      failed: 'rgba(245, 63, 63,.7)',
      succeed: 'rgba(128, 212, 197, 1)',
      succeeded: 'rgba(128, 212, 197, 1)'
    };
  });

  const chartStatusColorMap = computed(() => {
    // return {
    //   running: appStore.isDark
    //     ? StatusDarkColorBgMap.transitioning
    //     : StatusLightColorBgMap.transitioning,
    //   failed: appStore.isDark
    //     ? StatusDarkColorBgMap.error
    //     : StatusLightColorBgMap.error,
    //   succeed: appStore.isDark
    //     ? StatusDarkColorBgMap.ready
    //     : StatusLightColorBgMap.ready,
    //   succeeded: appStore.isDark
    //     ? StatusDarkColorBgMap.ready
    //     : StatusLightColorBgMap.ready
    // };
    return {
      running: 'rgba(247, 186, 30,.5)',
      auditing: 'rgba(135, 145, 247, .5)',
      failed: 'rgba(245, 63, 63,.5)',
      succeed: 'rgba(128, 212, 197, .8)',
      succeeded: 'rgba(128, 212, 197, .8)'
    };
  });

  const deployDataConfig = computed(() => {
    return [
      {
        name: 'dashboard.deployment.succeed',
        value: 0,
        key: 'succeeded',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.succeed }
      },
      {
        name: 'dashboard.deployment.failed',
        value: 0,
        key: 'failed',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.failed }
      },
      {
        name: 'dashboard.deployment.running',
        value: 0,
        key: 'running',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.running }
      }
    ];
  });

  return {
    statusColorMap,
    chartStatusColorMap,
    deployDataConfig
  };
}
