import { StatusDarkColorBgMap, StatusLightColorBgMap } from '@/views/config';
import { computed } from 'vue';
import { useAppStore } from '@/store';

export default function useStatusConfig() {
  const appStore = useAppStore();
  const statusMap = {
    running: 'running',
    failed: 'failed',
    succeeded: 'succeeded',
    canceled: 'canceled'
    // planned: 'planned'
  };

  const statusColorMap = computed(() => {
    return {
      running: 'rgba(247, 186, 30,1)',
      // planned: 'rgba(66, 106, 208, 1)',
      failed: 'rgba(225,105,101,1)',
      succeeded: 'rgba(128, 212, 197, 1)',
      canceled: 'rgba(201,205,212,1)'
    };
  });

  const chartStatusColorMap = computed(() => {
    return appStore.isDark
      ? {
          running: 'rgba(247, 186, 30,.5)',
          // planned: 'rgba(102, 139, 220, .5)',
          failed: 'rgba(203, 46, 52,.4)',
          succeeded: 'rgba(128, 212, 197, .5)',
          canceled: 'rgba(201,205,212,0.5)'
        }
      : {
          running: 'rgba(247, 186, 30,.8)',
          // planned: 'rgba(102, 139, 220, .8)',
          failed: 'rgba(241, 106, 106,.6)',
          succeeded: 'rgba(128, 212, 197, .8)',
          canceled: 'rgba(201,205,212,0.8)'
        };
  });

  const deployDataConfig = computed(() => {
    return [
      {
        name: 'Succeeded',
        value: 0,
        key: 'succeeded',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.succeeded }
      },
      {
        name: 'Failed',
        value: 0,
        key: 'failed',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.failed }
      },
      {
        name: 'Running',
        value: 0,
        key: 'running',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.running }
      },
      // {
      //   name: 'Planned',
      //   value: 0,
      //   key: 'planned',
      //   label: { show: false },
      //   itemStyle: { color: chartStatusColorMap.value.planned }
      // },
      {
        name: 'Canceled',
        value: 0,
        key: 'canceled',
        label: { show: false },
        itemStyle: { color: chartStatusColorMap.value.canceled }
      }
    ];
  });

  return {
    statusColorMap,
    statusMap,
    chartStatusColorMap,
    deployDataConfig
  };
}
