<template>
  <div class="date-range-wrapper">
    <a-range-picker
      v-model:popup-visible="popupVisible"
      shortcuts-position="left"
      :shortcuts="selectShortcut"
      :disabled-date="disabledDate"
      style="width: 240px"
      :mode="mode"
      :model-value="[start, end]"
      value-format="YYYY-MM-DD"
      @select-shortcut="handleSelectShortcut"
      @popup-visible-change="handlePopupChange"
      @change="handleDateChange"
      @select="handleSelect"
    >
      <template #extra>
        <div class="date-type-wrapper">
          <span
            v-for="item in datePickerMode"
            :key="item.value"
            class="item"
            :class="{ active: timeUnit === item.value }"
            @click="handleClick(item)"
            >{{ $t(item.label) }}</span
          >
        </div>
      </template>
    </a-range-picker>
  </div>
</template>

<script lang="ts" setup>
  import { get } from 'lodash';
  import dayjs from 'dayjs';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { datePickerMode } from '../config';

  type timeType = 'date' | 'month' | 'year';
  type unitType = 'day' | 'month' | 'year';
  const props = defineProps({
    timeUnit: {
      type: String,
      default() {
        return 'day';
      }
    },
    start: {
      type: String,
      default() {
        return '';
      }
    },
    end: {
      type: String,
      default() {
        return '';
      }
    },
    todayIn: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const selectRangeMap = {
    day: 29,
    month: 11,
    year: 9
  };
  const { t } = useI18n();
  const popupVisible = ref(false);
  const startDate = ref('');
  const endDate = ref('');
  const selectShortcut = computed(() => {
    const tDay = props.todayIn ? 0 : 1;
    return [
      {
        label: t('dashboard.datepicker.30days'),
        unit: 'day',
        format: 'YYYY-MM-DD',
        value: [
          dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
          dayjs().subtract(tDay, 'day').format('YYYY-MM-DD')
        ]
      },
      {
        label: t('dashboard.datepicker.6months'),
        unit: 'month',
        format: 'YYYY-MM-DD',
        value: [
          dayjs().subtract(5, 'month').format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD')
        ]
      },
      {
        label: t('dashboard.datepicker.12months'),
        unit: 'month',
        format: 'YYYY-MM-DD',
        value: [
          dayjs().subtract(11, 'month').format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD')
        ]
      }
    ];
  });
  const mode = computed(() => {
    if (props.timeUnit === 'day') {
      return 'date';
    }
    return props.timeUnit as timeType;
  });
  const handleSelect = (value) => {
    endDate.value = get(value, '1') || props.end;
    startDate.value = get(value, '0') || props.start;
  };
  const disabledDate = (current) => {
    const type = props.timeUnit as unitType;
    const range = get(selectRangeMap, type);
    if (!props.todayIn) {
      if (dayjs(current).isSameOrAfter(dayjs().format('YYYY-MM-DD'), 'day')) {
        return true;
      }
    } else if (dayjs(current).isAfter(dayjs().format('YYYY-MM-DD'), 'day')) {
      return true;
    }

    if (
      dayjs(current).isAfter(
        dayjs(startDate.value).add(range, type).format('YYYY-MM-DD'),
        type
      )
    ) {
      return true;
    }
    if (
      dayjs(current).isBefore(
        dayjs(startDate.value).subtract(range, type).format('YYYY-MM-DD'),
        type
      )
    ) {
      return true;
    }
    return false;
  };
  const emits = defineEmits(['update:timeUnit', 'update:start', 'update:end']);
  const handleClick = (item) => {
    emits('update:timeUnit', item.value);
  };
  const handlePopupChange = (visible) => {
    if (visible) {
      startDate.value = props.start;
      endDate.value = props.end;
    }
  };
  const handleSelectShortcut = (val) => {
    const value = get(val, 'value') || [];
    emits('update:timeUnit', val.unit);
    emits('update:start', get(value, '0'));
    emits('update:end', get(value, '1'));
    startDate.value = get(value, '0');
    endDate.value = get(value, '1');
    setTimeout(() => {
      popupVisible.value = false;
    }, 100);
  };
  const handleDateChange = (value) => {
    console.log('change:', value);
    emits('update:start', get(value, '0'));
    emits('update:end', get(value, '1'));
    startDate.value = get(value, '0');
    endDate.value = get(value, '1');
    setTimeout(() => {
      popupVisible.value = false;
    }, 100);
  };
</script>

<style lang="less">
  .date-type-wrapper {
    display: flex;
    justify-content: space-between;

    .item {
      display: inline-block;
      width: 100px;
      height: 28px;
      font-weight: 500;
      line-height: 28px;
      text-align: center;
      border: 1px solid var(--seal-border-gray-2);
      border-radius: 14px;
      cursor: pointer;

      &:hover {
        color: #fff;
        background-color: var(--sealblue-6);
        border-color: transparent;
      }

      &.active {
        color: #fff;
        background-color: var(--sealblue-6);
        border-color: transparent;
      }
    }
  }
</style>

<style lang="less" scoped></style>
