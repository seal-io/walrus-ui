<template>
  <div ref="editorWrap" class="autocomplete-area">
    <span
      class="arco-input-wrapper"
      style="width: 100%"
      :class="{ 'arco-input-focus': isFocus, 'arco-input-error': $attrs.error }"
      @click="handleClick"
    >
      <input
        :id="editorId"
        ref="input"
        v-model.trim="expression"
        class="arco-input completer arco-input-size-medium"
        :spellcheck="false"
        :readonly="disabled"
        autocomplete="off"
        :placeholder="placeholder"
        v-bind="$attrs"
        @focus="handleFocus"
        @input="handleInput"
        @keydown.enter="handleEnter"
        @keyup.delete="handleDelete"
        @change="handleExpressionChange"
      />
      <span v-if="$attrs.showWordLimit" class="arco-input-suffix">
        <span class="arco-input-word-limit"
          >{{ expression.length }}/{{ $attrs.maxLength }}</span
        >
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
  import {
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
    onBeforeUnmount
  } from 'vue';
  import { Textcomplete, TextcompleteOption } from '@textcomplete/core';
  import { TextareaEditor } from '@textcomplete/textarea';

  type SearchCallback<T> = (results: T[]) => void;
  type resultItem = {
    label: string;
    value: string;
    type?: string;
    description?: string;
  };

  const props = defineProps({
    modelValue: {
      type: String,
      default() {
        return '';
      }
    },
    placeholder: {
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
    }
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
  let timer: any = null;
  // const textarea = ref()
  let textcomplete: any = null;
  const handleSearch = (term: string, ctx): Array<resultItem> => {
    const sourceData = completeData.value || props.source;
    console.log('completeData...999', sourceData, completeData.value);
    const regx = /([A-Za-z0-9_-]+)?\.?([A-Za-z0-9_-]*)\.?$/;
    console.log('array==3=', regx.test(ctx), ctx);
    if (!ctx || !regx.test(ctx)) return [];
    console.log('term===1', term, ctx, textcomplete, props.source);
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
          label: s.value,
          value: s.value,
          description: s.label
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
        label: '{}',
        value: '{}'
      }
    ];
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
      // match: /(\w+)\.(\w*)$/,
      match: /(?<=\$\{.*)([A-Za-z0-9_-]+)?\.?([A-Za-z0-9_-]*)$/,
      index: 1,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        const regx = /([A-Za-z0-9_-]+\.)*([A-Za-z0-9_-]*)$/g;
        console.log('term===2=', term, editorCtx.value);
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
          ? `<span>${data.label}<span class="desc">(${data.description})</span></span>`
          : `<span>${data.label}</span>`;
      },
      // replace the text match result
      replace(result: resultItem) {
        const reg = /([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]*)$/g;
        const matches = editorCtx.value.matchAll(reg);
        const list = Array.from(matches);
        // console.log('matches===', list, matches)
        editorCtx.value = '';
        if (!list.length) {
          return `${result.label}`;
        }
        return `${get(list, '0.1')}.${result.label}`;
      }
    },
    {
      id: props.editorId,
      // match: /(\w+)\.(\w*)$/,
      match: /(?<=\$\{?).*(?=.*)/,
      index: 2,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        callback(getResultOptions());
      },
      template(data: resultItem) {
        return `<span>${data.label}</span>`;
      },
      replace: (result: resultItem): string => {
        setTimeout(() => {
          input.value.selectionEnd -= 1;
        }, 100);
        return `${result.label}`;
      }
    }
  ];
  const options: TextcompleteOption = {
    dropdown: {
      className: 'autocomplete-dropdown-list',
      maxCount: 20,
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
  const initEditor = () => {
    const textarea = document.getElementById(
      `${props.editorId}`
    ) as HTMLTextAreaElement;
    if (!textarea) return;
    const editor = new TextareaEditor(textarea);
    textcomplete = new Textcomplete(editor, Strategy, options);
    console.log('area:', textarea, textcomplete);
  };
  const dispatchInput = () => {
    emits('update:modelValue', expression.value);
    emits('input', expression.value);
  };
  const handleInput = (e) => {
    // console.log('input==', expression.value, e)
    inputFlag.value = true;
    isNeedHide();
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatchInput();
    }, 100);
  };
  const runChange = () => {
    emits('change', expression.value);
    inputFlag.value = false;
  };
  const handleBlur = () => {
    textcomplete?.hide?.();
    // setTimeout(() => {
    //   runChange()
    // },200)
  };
  onClickOutside(editorWrap, (ev) => {
    handleBlur();
    isFocus.value = false;
  });
  const handleEnter = () => {
    // if (!textcomplete?.dropdown?.shown) {
    //   runChange()
    // }
  };
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
    console.log('focus');
  };
  const handleClick = () => {
    console.log('click');
    isFocus.value = true;
  };
  const handleClear = () => {
    expression.value = '';
    editorCtx.value = '';
    emits('update:modelValue', expression.value);
    input.value.dispatchEvent(new CustomEvent('change'));
    // setTimeout(() => {
    //   runChange()
    // },200)
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
  // watch(
  //   () => props.editorId,
  //   () => {
  //     expression.value = props.modelValue;
  //     nextTick(() => {
  //       initEditor();
  //     });
  //   },
  //   {
  //     immediate: true
  //   }
  // );
  onMounted(async () => {
    expression.value = props.modelValue;
    nextTick(() => {
      console.log('area:');
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
