<template>
  <div class="single-params">
    <div class="wrap">
      <div
        class="title"
        :class="{
          'actived': show,
          'selected': !!modelValue.length,
          'no-drop': !options.length,
        }"
        @click="handleShow"
      >
        <span>{{ title }}</span>
        <span>
          <!-- <span v-if="showSwitch" @click.stop="() => {}">
            <span v-if="ShowSwitchLable">view</span>
            <a-switch
              v-model="viewEnable"
              size="small"
              @change="handleViewChange"
            ></a-switch
          ></span> -->
          <icon-right />
        </span>
      </div>
      <Transition v-bind="{ ...transitionEvents }" name="drop-slider">
        <div v-show="show" class="box" :class="{ actived: show }">
          <div class="box-wrap">
            <ul class="option-wrap">
              <li
                v-for="item in options"
                :key="item.value"
                class="option"
                @click.stop="handleClickItem(item)"
              >
                <span>{{ $t(item.label || '') }}</span>
                <span class="description">
                  <span class="content">{{ item.total }}</span>
                  <a-checkbox
                    v-if="multiple"
                    :model-value="includes(modelValue, item.value)"
                  ></a-checkbox>
                  <a-radio
                    v-else
                    :model-value="includes(modelValue, item.value)"
                  ></a-radio>
                </span>
              </li>
              <li v-if="!options.length"><a-empty></a-empty></li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { remove, includes, cloneDeep } from 'lodash';
  import { computed, ref, Transition } from 'vue';
  import { PropType } from 'vue-demi';
  import useTransition from '@/hooks/use-transition';

  interface OptionList {
    label: string;
    value: string;
    total?: any;
  }
  const props = defineProps({
    options: {
      type: Array as PropType<OptionList[]>,
      default() {
        return [];
      },
    },
    showSwitch: {
      type: Boolean,
      default() {
        return true;
      },
    },
    multiple: {
      type: Boolean,
      default() {
        return true;
      },
    },
    modelValue: {
      type: [Array, String] as PropType<string | string[]>,
      default() {
        return '';
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    content: {
      type: [String, Number] as PropType<string | number>,
      default() {
        return '';
      },
    },
    activeKey: {
      type: Boolean,
      default() {
        return false;
      },
    },
    ShowSwitchLable: {
      type: Boolean,
      default() {
        return true;
      },
    },
  });
  const transitionEvents = useTransition();
  const emits = defineEmits([
    'update:modelValue',
    'change',
    'toggle',
    'viewChange',
  ]);
  const viewEnable = ref(true);
  const show = computed(() => {
    return props.activeKey;
  });
  const handleShow = () => {
    // if (!props.options.length) return;
    emits('toggle', show.value);
  };
  const handleViewChange = (val) => {
    emits('viewChange', val);
  };
  const handleClickItem = (option) => {
    let value: string | string[] = props.multiple ? '' : [];
    if (props.multiple) {
      const list = cloneDeep(props.modelValue);
      if (includes(list, option.value)) {
        remove(list, (s) => s === option.value);
        value = [...list];
      } else {
        value = [...new Set([...list, option.value])];
      }
    } else {
      value = props.modelValue === option.value ? '' : option.value;
    }
    emits('update:modelValue', value);
    emits('change', value);
  };
</script>

<style lang="less" scoped>
  @bgcolor: #f1f6fe;

  .single-params {
    li,
    ul {
      margin: 0;
      padding: 0;
      font-size: 0;
      list-style-type: none;
    }

    .drop-slider-enter-from,
    .drop-slider-leave-to {
      height: 0;
    }

    .drop-slider-enter-active,
    .drop-slider-leave-active {
      transition: height 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    }

    .wrap {
      overflow: hidden;
      border: 1px solid var(--seal-border-gray-2);
      border-radius: 2px;

      .title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 200px;
        height: 28px;
        padding: 0 10px;
        overflow: hidden;
        color: var(--color-text-2);
        font-size: 13px;
        background-color: #fff;
        cursor: pointer;
        // background-color: var(--color-fill-2);
        .arco-icon-right {
          transform: rotate(0);
          transition: transform 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
        }

        .arco-switch {
          margin: 0 5px;
        }

        &.actived.no-drop {
          border-bottom: none;
        }

        &.actived {
          border-bottom: 1px solid var(--seal-border-gray-2);

          .arco-icon-right {
            transform: rotate(90deg);
            transition: transform 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
          }
        }

        &.selected::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: inline-block;
          width: 6px;
          background-color: rgb(var(--primary-6));
          content: '';
        }
      }
    }

    .box {
      height: 0;
      overflow: hidden;
    }

    .box.actived {
      overflow: hidden;
    }

    .box-wrap {
      max-height: 200px;
      overflow: auto;
    }

    .option-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: max-content;
      background-color: #f9fafb;

      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 32px;
        padding: 0 10px;
        color: var(--color-text-2);
        font-size: 13px;
        text-align: left;
        border-bottom: 1px solid var(--seal-border-gray-2);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

        &:last-child {
          border-bottom: 0;
        }

        &:hover {
          background: @bgcolor;
          transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
        }

        .description {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .content {
          margin-right: 5px;
        }
      }
    }
  }
</style>
