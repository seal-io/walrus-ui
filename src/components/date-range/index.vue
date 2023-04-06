<template>
  <div class="date-range-wrapper">
    <a-range-picker
      ref="dateRangePicker"
      v-model:popup-visible="popupVisible"
      shortcuts-position="left"
      :shortcuts="selectShortcut"
      :disabled-date="disabledDate"
      :style="{ width: width }"
      :mode="mode"
      :model-value="[start, end]"
      :value-format="'YYYY-MM-DD'"
      :class="{ 'border-less': borderLess }"
      @picker-value-change="handlePickValueChange"
      @select-shortcut="handleSelectShortcut"
      @popup-visible-change="handlePopupChange"
      @change="handleDateChange"
      @select="handleSelect"
    >
      <template v-if="mode === 'date'" #cell="{ date }">
        <slot name="cell" :date="date">
          <div class="arco-picker-date">
            <div class="arco-picker-date-value">
              {{ date.getDate() }}
            </div>
          </div>
        </slot>
      </template>
      <template v-if="showExtra" #extra>
        <slot name="extra">
          <div v-if="timezone" class="date-type-wrapper">
            <span
              v-for="item in timeZoneMode"
              :key="item.value"
              class="item"
              :class="{ active: timeMode === item.value }"
              @click="handleChangeTimeMode(item)"
              >{{ $t(item.label) }}</span
            >
          </div>
          <div v-else class="date-type-wrapper">
            <span
              v-for="item in datePickerMode"
              :key="item.value"
              class="item"
              :class="{ active: timeUnit === item.value }"
              @click="handleClick(item)"
              >{{ $t(item.label) }}</span
            >
          </div>
        </slot>
      </template>
    </a-range-picker>
  </div>
</template>

<script lang="ts" setup>
  import { get, map } from 'lodash';
  import dayjs from 'dayjs';
  import { computed, ref, PropType, watch, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { datePickerMode, timeZoneMode } from './config';

  type timeType = 'date' | 'month' | 'year';
  type unitType = 'day' | 'month' | 'year' | 'date';
  type ShortCutsType = {
    label: string;
    unit: string;
    format: string;
    value: string[];
  };
  const props = defineProps({
    timeUnit: {
      type: String as PropType<unitType>,
      default() {
        return 'day';
      }
    },
    timezone: {
      type: Boolean,
      default() {
        return false;
      }
    },
    timeMode: {
      type: String,
      default() {
        return 'utc';
      }
    },
    width: {
      type: String,
      default() {
        return '240px';
      }
    },
    showExtra: {
      type: Boolean,
      default() {
        return false;
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
    },
    borderLess: {
      type: Boolean,
      default() {
        return false;
      }
    },
    shortCuts: {
      type: Array as PropType<ShortCutsType[]>,
      default() {
        return [];
      }
    },
    maxRange: {
      type: Object as PropType<{ type: any; range: number }>,
      default() {
        return { type: 'month', range: 2 };
      }
    }
  });
  const selectRangeMap = {
    day: 29,
    month: 11,
    year: 9
  };
  const emits = defineEmits([
    'update:timeUnit',
    'update:start',
    'update:end',
    'change',
    'update:timeMode'
  ]);
  const { t } = useI18n();
  const popupVisible = ref(false);
  const startDate = ref('');
  const endDate = ref('');
  const pointDate = ref('');
  const dateRangePicker = ref();
  const mode = ref<timeType>('date');

  const selectShortcut = computed(() => {
    if (props.shortCuts?.length) {
      return map(props.shortCuts, (item) => {
        item.label = t(item.label);
        return item;
      });
    }
    const tDay = props.todayIn ? 0 : 1;
    const subDay = props.todayIn ? 30 : 29;
    return [
      {
        label: t('dashboard.datepicker.30days'),
        unit: 'day',
        format: 'YYYY-MM-DD',
        value: [
          dayjs().subtract(subDay, 'day').format('YYYY-MM-DD'),
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

  const generateTimezoneFormat = (value) => {
    if (!props.timezone) {
      return value;
    }
    const start = dayjs(get(value, 0))
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0);
    if (props.timeMode === 'utc') {
      return [
        dayjs(start).format('YYYY-MM-DDTHH:mm:ss+00:00'),
        dayjs(get(value, 1)).format('YYYY-MM-DDTHH:mm:ss+00:00')
      ];
    }
    return [dayjs(start).format(), dayjs(get(value, 1)).format()];
  };
  const handleSelect = (val) => {
    console.log('valueString:', val);
    // const value = generateTimezoneFormat(val);
    // endDate.value = get(value, '1') || props.end;
    // startDate.value = get(value, '0') || props.start;
    pointDate.value = get(val, '1') || get(val, '0');
  };
  const disabledDate = (current) => {
    // const type = props.timeUnit as unitType;
    // const range = get(selectRangeMap, type);
    let rangValue = props.maxRange;

    if (mode.value === 'date') {
      rangValue = { type: 'month', range: 2 };
    }
    if (mode.value === 'month') {
      rangValue = { type: 'month', range: 2 };
    }
    if (mode.value === 'year') {
      rangValue = { type: 'year', range: 1 };
    }
    const { type, range } = rangValue;
    if (!props.todayIn) {
      if (dayjs(current).isSameOrAfter(dayjs().format('YYYY-MM-DD'), type)) {
        return true;
      }
    } else if (dayjs(current).isAfter(dayjs().format('YYYY-MM-DD'), type)) {
      return true;
    }
    if (
      dayjs(current).isBefore(
        dayjs(pointDate.value).subtract(range, type).format('YYYY-MM-DD'),
        type
      )
    ) {
      return true;
    }
    if (
      dayjs(current).isAfter(
        dayjs(pointDate.value).add(range, type).format('YYYY-MM-DD'),
        type
      )
    ) {
      return true;
    }
    return false;
  };

  const handleClick = (item) => {
    emits('update:timeUnit', item.value);
  };

  const setRangeValue = (metaValue) => {
    const value = generateTimezoneFormat(metaValue);
    emits('update:start', get(value, '0'));
    emits('update:end', get(value, '1'));
    startDate.value = get(value, '0');
    endDate.value = get(value, '1');
    setTimeout(() => {
      popupVisible.value = false;
    }, 100);
    return value;
  };
  const handleChangeTimeMode = (item) => {
    emits('update:timeMode', item.value);
    setTimeout(() => {
      const values = setRangeValue([startDate.value, endDate.value]);
      emits('change', values);
    }, 100);
  };
  const handlePopupChange = (visible, ...args) => {
    console.log('popupchange===', args);
    if (visible) {
      startDate.value = props.start;
      endDate.value = props.end;
    }
  };
  const handleSelectShortcut = (val) => {
    const metaValue = get(val, 'value') || [];
    const values = setRangeValue(metaValue);
    // console.log('value====', value);
    emits('update:timeUnit', val.unit);
  };
  const handleDateChange = (val, ...args) => {
    console.log('change:', val, args);
    const value = setRangeValue(val);
    emits('change', value);
  };
  const handlePickValueChange = (...args) => {
    console.log('pick value change:', args);
  };
  watch(
    () => endDate.value,
    (val) => {
      pointDate.value = val;
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.timeUnit,
    (val) => {
      if (val === 'day') {
        mode.value = 'date';
      } else {
        mode.value = val;
      }
    },
    {
      immediate: true
    }
  );
  watch(
    () => dateRangePicker?.value?.rangePanelProps.startHeaderMode,
    (val) => {
      console.log('dateRangePicker?.value===', val);
      mode.value = val ?? 'date';
    },
    {
      immediate: true,
      deep: true
    }
  );
  onMounted(() => {
    console.log('dateRangePicker?.value===', dateRangePicker?.value);
  });
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
