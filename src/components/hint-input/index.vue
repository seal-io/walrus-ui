<template>
  <div ref="editorWrap" class="autocomplete-area">
    <span
      class="arco-input-wrapper"
      style="width: 100%"
      :class="{
        'arco-input-focus': isFocus,
        'arco-input-error': $attrs.error,
        'is-focused': isFocus || modelValue
      }"
      @click="handleClick"
    >
      <span class="label" :class="{ pswd: $attrs.sensitive }">
        <span
          ><span>{{ $attrs.label || placeholder }}</span>
          <span
            v-if="$attrs.required"
            class="bold-500 m-l-2 star"
            style="color: rgb(var(--danger-6))"
            >*</span
          ></span
        >
        <a-tooltip v-if="popupInfo" :content="popupInfo">
          <icon-info-circle
            style="stroke-linecap: initial; cursor: default"
            class="m-l-2"
          />
        </a-tooltip>
      </span>
      <input
        :id="editorId"
        ref="input"
        v-model.trim="expression"
        class="arco-input completer arco-input-size-medium"
        :spellcheck="false"
        :readonly="disabled"
        autocomplete="off"
        v-bind="$attrs"
        :type="inputType"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.enter="handleEnter"
        @keyup.delete="handleDelete"
        @change="handleExpressionChange"
      />
      <span class="arco-input-suffix">
        <span v-if="$attrs.showWordLimit" class="arco-input-word-limit"
          >{{ expression.length }}/{{ $attrs.maxLength }}</span
        >
        <span
          v-if="$attrs.sensitive"
          class="arco-icon-hover"
          @click="handleVisibleToggle"
        >
          <icon-eye-invisible v-if="invisible" />
          <icon-eye v-else />
        </span>
      </span>
    </span>
    <!-- <span
      class="arco-icon-hover arco-input-icon-hover arco-input-clear-btn"
      @click.stop="handleClear"
    >
      <icon-close />
    </span> -->
  </div>
</template>

<script lang="ts" setup>
  import _, {
    get,
    split,
    join,
    filter,
    map,
    cloneDeep,
    keys,
    last,
    initial,
    toLower,
    isArray
  } from 'lodash';
  import { onClickOutside } from '@vueuse/core';
  import {
    nextTick,
    onMounted,
    ref,
    onUnmounted,
    watch,
    useAttrs,
    PropType,
    inject,
    onBeforeUnmount,
    computed
  } from 'vue';
  import { Textcomplete, TextcompleteOption } from '@textcomplete/core';
  import { TextareaEditor } from '@textcomplete/textarea';
  import tippy from 'tippy.js';
  import 'tippy.js/dist/tippy.css';

  type SearchCallback<T> = (results: T[]) => void;
  type resultItem = {
    label: string;
    value: string;
    type?: string;
    tips?: string;
    sensitive?: boolean;
    showTips?: boolean;
    description?: string;
  };

  const props = defineProps({
    modelValue: {
      type: String,
      default() {
        return '';
      }
    },
    showRequiredMark: {
      type: Boolean,
      default() {
        return true;
      }
    },
    placeholder: {
      type: String,
      default() {
        return '';
      }
    },
    popupInfo: {
      type: String,
      default() {
        return '';
      }
    },
    editorId: {
      type: String,
      default() {
        return 'expressionEditor';
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    show: {
      type: Boolean,
      default() {
        return false;
      }
    },
    source: {
      type: Object as PropType<Record<string, any>>,
      default() {
        return {};
      }
    },
    eventHandler: Function
  });
  const completeData = inject('completeData', ref(null));
  const $attrs = useAttrs();
  const emits = defineEmits(['update:modelValue', 'input', 'change']);
  const expression = ref('');
  const editorCtx = ref('');
  const editorWrap = ref();
  const input = ref();
  const isFocus = ref(false);
  const inputFlag = ref(false);
  const isMatchWork = ref(true);
  const invisible = ref(true);
  const moveLastPosition = ref(false);
  const tooltipConfig = {
    ignoreAttributes: true,
    placement: 'top-end',
    maxWidth: 240,
    maxHeight: 150,
    arrow: true,
    interactive: false,
    showOnCreate: true
  };

  // const textarea = ref()
  let textcomplete: any = null;
  let textEditor: any = null;
  let tippyInstance: any = null;

  const inputType = computed(() => {
    return $attrs.sensitive && invisible.value ? 'password' : 'text';
  });

  const handleVisibleToggle = () => {
    invisible.value = !invisible.value;
    isFocus.value = true;
  };
  const handleSearch = (term: string, ctx): Array<resultItem> => {
    const sourceData = completeData.value || props.source;
    const regx = /([\w-]+)?\.?([\w-]*)\.?$/;
    if (!ctx || !regx.test(ctx)) return [];
    const dataSource = cloneDeep(sourceData);
    const path = split(ctx, '.');

    // exludes the last item
    const initialPath = initial(path);
    const lastItem = last(path);

    if (!initialPath.length) {
      const resultList = map(keys(sourceData), (key) => {
        return {
          label: key,
          value: key
        };
      }).filter((s) => {
        return toLower(s.label).startsWith(toLower(lastItem));
      });
      return resultList;
    }

    const data = get(dataSource, `${join(initialPath, '.')}`);
    if (!data) return [];

    let resultList: resultItem[] = [];

    if (isArray(data)) {
      resultList = map(data || [], (s) => {
        return {
          ...s,
          label: s.value,
          value: s.value
        };
      });
    } else {
      resultList = map(keys(data), (key) => {
        return {
          label: key,
          value: key
        };
      });
    }
    if (lastItem) {
      resultList = filter(resultList, (s) =>
        toLower(s.label).startsWith(toLower(lastItem))
      );
    }
    return resultList;
  };
  const getResultOptions = () => {
    return [
      {
        label: '${}',
        value: '{}'
      }
    ];
  };
  const getReplaceResult = (result, reg) => {
    const matches = editorCtx.value.matchAll(reg);
    const list = Array.from(matches);
    const mactchStartIndex = get(list, '0.index');
    const mactchEndIndex = get(list, '1.index') || editorCtx.value.length;
    const res =
      editorCtx.value.slice(0, mactchStartIndex) +
      result.label +
      editorCtx.value.slice(mactchEndIndex);
    return res;
  };
  const setCursorPos = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(input.value, input.value.selectionStart);
    range.setEnd(input.value, input.value.selectionEnd);
    selection?.removeAllRanges();
    selection?.addRange(range);
    input.value.selectionStart -= input.value.selectionStart;
  };
  const Strategy: any = [
    {
      id: props.editorId,
      match: /^.*(?:\$\{.*)([\w-]+)\.?([\w-]*)$/,
      index: 1,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        const regx = /([\w-]+\.)*([\w-]*)$/g;
        const allResult = editorCtx.value.matchAll(regx);
        const list = Array.from(allResult);
        const ctx = get(list, '0.0');
        callback(handleSearch(term, ctx));
      },
      context(beforeCursor: string) {
        editorCtx.value = beforeCursor;
        return isMatchWork.value; // true、false
      },
      template(data: resultItem) {
        return data.description
          ? `<span class="box"><span>${data.label}<span class="desc">(${data.description})</span></span></span>`
          : `<span class="box"><span>${data.label}</span></span>`;
      },
      // replace the text match result
      replace(result: resultItem) {
        const reg = /([\w-]*)$/g;
        const res = getReplaceResult(result, reg);
        editorCtx.value = '';
        return res;
      }
    },
    {
      id: props.editorId,
      match: /^.*(?:\$\{?).*(?=.*)/,
      index: 2,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        callback(getResultOptions());
      },
      template(data: resultItem) {
        return `<span>${data.label}</span>`;
      },
      replace: (result: resultItem): string => {
        const reg = /(?:\$)(\{?\}?)$/g;
        const res = getReplaceResult(result, reg);
        editorCtx.value = '';
        setTimeout(() => {
          input.value.selectionEnd -= 1;
        }, 100);
        return res;
      }
    }
  ];
  const options: TextcompleteOption = {
    dropdown: {
      className: `autocomplete-dropdown-list ${props.editorId}`,
      maxCount: 10,
      item: {
        className: 'complete-item',
        activeClassName: 'complete-item-active'
      }
    }
  };
  const isNeedHide = () => {
    const regx = /(\w+|\s+|.+)$/;
    if (!regx.test(expression.value)) {
      isMatchWork.value = false;
      textcomplete?.hide?.();
    } else {
      isMatchWork.value = true;
    }
  };
  const tippyInstanceHide = () => {
    get(tippyInstance, '0')?.destroy?.();
  };
  const debounceFunc = _.debounce(() => {
    input.value.selectionEnd -= 1;
  }, 0);

  const resetCursorPos = () => {
    if (moveLastPosition.value) {
      debounceFunc();
    }
  };
  const getTextcompleteDownItem = () => {
    tippyInstanceHide();
    resetCursorPos();
    const activeIndex = textcomplete.dropdown.activeIndex || 0;
    const items = textcomplete.dropdown.items || [];
    const data = get(items, `${activeIndex}.searchResult.data`);
    moveLastPosition.value =
      activeIndex === items.length - 1 && activeIndex > 0;

    if (data?.showTips) {
      const content = data.sensitive ? '******' : data.tips;
      tippyInstance = tippy(`.${props.editorId} .complete-item-active`, {
        ...tooltipConfig,
        content
      });
    }
  };
  const debounceGetTextcompleteDownItem = _.debounce(() => {
    getTextcompleteDownItem();
  }, 0);
  const initEvent = () => {
    textcomplete?.on('shown', (e) => {
      debounceGetTextcompleteDownItem();
    });
    textcomplete?.on('select', (e) => {
      tippyInstanceHide();
    });
    textcomplete?.on('hide', (e) => {
      moveLastPosition.value = false;
      tippyInstanceHide();
    });
    textEditor.on('move', (e) => {
      if (e.detail.code === 'UP') {
        moveLastPosition.value = false;
      }
      getTextcompleteDownItem();
    });
  };
  const initEditor = () => {
    const textarea = document.getElementById(
      `${props.editorId}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    textEditor = new TextareaEditor(textarea);
    textcomplete = new Textcomplete(textEditor, Strategy, options);
    initEvent();
  };

  const dispatchInput = () => {
    emits('update:modelValue', expression.value);
    emits('input', expression.value);
  };
  const debounceDispatchInput = _.debounce(() => {
    dispatchInput();
  }, 100);
  const handleInput = (e) => {
    inputFlag.value = true;
    isNeedHide();
    debounceDispatchInput();
    debounceGetTextcompleteDownItem();
  };
  const runChange = () => {
    emits('change', expression.value);
    inputFlag.value = false;
    props.eventHandler?.();
  };
  const handleBlur = () => {
    isFocus.value = false;
    textcomplete?.hide?.();
  };
  onClickOutside(editorWrap, (ev) => {
    handleBlur();
    isFocus.value = false;
  });
  const handleEnter = () => {};
  const handleExpressionChange = (e) => {
    textcomplete?.hide?.();
    emits('update:modelValue', expression.value);
    setTimeout(() => {
      runChange();
    }, 100);
  };
  const handleDelete = (val) => {
    // const regx = /\.$/;
    // if (!regx.test(expression.value)) {
    //   isMatchWork.value = false;
    //   textcomplete?.hide?.();
    // } else {
    //   isMatchWork.value = true;
    // }
  };
  const handleFocus = () => {
    isFocus.value = true;
  };
  const handleClick = () => {
    isFocus.value = true;
    input.value?.focus?.();
  };
  const handleClear = () => {
    expression.value = '';
    editorCtx.value = '';
    emits('update:modelValue', expression.value);
    input.value.dispatchEvent(new CustomEvent('change'));
  };
  watch(
    () => props.modelValue,
    () => {
      expression.value = props.modelValue;
    },
    {
      immediate: true
    }
  );

  onMounted(async () => {
    expression.value = props.modelValue;
    nextTick(() => {
      initEditor();
    });
  });
  onBeforeUnmount(() => {
    textcomplete?.destroy?.();
  });
</script>

<script lang="ts">
  export default {
    name: 'HintInput',
    inheritAttrs: false
  };
</script>

<style lang="less" scoped>
  // .autocomplete-area.arco-input-wrapper {
  //   display: flex;
  //   align-items: center;
  //   padding-left: 10px;
  //   border: 1px solid var(--seal-border-gray-2);

  //   &:focus-within {
  //     border: 1px solid rgb(var(--primary-6));
  //     transition: all 0.2s var(--seal-transition-func);
  //   }
  // }
  .autocomplete-area {
    position: relative;
    width: 100%;
  }

  .close {
    position: relative;
    color: var(--color-text-2);
    font-size: 12px;
    cursor: pointer;

    &::after {
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      background-color: var(--color-fill-2);
      border-radius: 7px;
      content: '';
    }
  }

  .completer {
    // color: #e4e420;
    font-size: 14px;
    // background-color: rgb(29 33 41 / 80%);
    &.arco-input {
      padding: 4px 0;
      border-radius: var(--border-radius-small);
    }
  }

  textarea[readonly] {
    cursor: not-allowed;
  }
</style>

<style lang="less">
  .tippy-box {
    pointer-events: all;

    .tippy-content {
      max-height: 60px;
      overflow: auto;
      word-wrap: break-word;
    }
  }

  .autocomplete-dropdown-list {
    z-index: 9999 !important;
    box-sizing: border-box;
    min-width: 120px;
    max-height: 160px;
    margin: 0;
    padding: 4px 0;
    overflow-y: auto;
    background-color: var(--color-bg-popup);
    border: 1px solid var(--color-fill-3);
    border-radius: var(--border-radius-small);
    box-shadow: 0 4px 10px #0000001a;

    .textcomplete-header {
      display: none;
    }

    .textcomplete-footer {
      display: none;
    }

    .box {
      position: relative;
    }

    .complete-item-active {
      color: #fff;
      background-color: rgb(var(--primary-6));

      .type {
        color: #fff;
      }

      .desc {
        color: var(--color-text-3);
        font-size: 12px;
        opacity: 0.8;
      }
    }

    li {
      box-sizing: border-box;
      height: 24px;
      margin: 0;
      padding: 0 10px;
      color: var(--color-text-2);
      line-height: 24px;

      .type {
        color: rgba(78, 89, 105, 0.7);
        font-size: 12px;
      }

      &::marker {
        color: transparent;
      }
    }

    .complete-item {
      list-style-type: none;

      .desc {
        color: var(--color-text-3);
        font-size: 12px;
        opacity: 0.7;
      }

      &::marker {
        display: none;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('./style/input.less');
</style>
