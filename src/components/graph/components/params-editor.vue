<template>
  <div ref="editorWrap" class="autocomplete-area arco-input-wrapper">
    <icon-search style="margin-right: 5px" />
    <input
      id="textarea"
      ref="input"
      v-model.trim="expression"
      class="arco-input completer arco-input-size-medium"
      :spellcheck="false"
      :rows="5"
      :readonly="disabled"
      autocomplete="off"
      :placeholder="placeholder"
      @focus="handleFocus"
      @click="handleClick"
      @input="handleInput"
      @keydown.enter="handleEnter"
      @keyup.delete="handleDelete"
      @change="handleExpressionChange"
    />
    <span
      class="arco-icon-hover arco-input-icon-hover arco-input-clear-btn"
      @click.stop="handleClear"
    >
      <icon-close />
    </span>
  </div>
</template>

<script lang="ts" setup>
  import {
    get,
    debounce,
    split,
    join,
    filter,
    map,
    cloneDeep,
    keys,
    trim,
    last,
    initial,
    toLower,
    isArray,
    includes,
    head,
    clone,
    isBoolean
  } from 'lodash';
  import { onClickOutside } from '@vueuse/core';
  import { nextTick, onMounted, ref, onUnmounted, watch } from 'vue';
  import { Textcomplete, TextcompleteOption } from '@textcomplete/core';
  import { TextareaEditor } from '@textcomplete/textarea';

  type SearchCallback<T> = (results: T[]) => void;
  type resultItem = {
    label: string;
    value: string;
    type?: string;
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
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    source: {
      type: Object,
      default() {
        return {};
      }
    }
  });
  const emits = defineEmits(['update:modelValue', 'input', 'change']);
  const expression = ref('');
  const editorCtx = ref('');
  const editorWrap = ref();
  const input = ref();
  const inputFlag = ref(false);
  const isMatchWork = ref(true);
  let timer: any = null;
  // const textarea = ref()
  let textcomplete: any = null;
  const handleSearch = (term: string, ctx): Array<resultItem> => {
    const dataSource = cloneDeep(props.source);
    const textValue = trim(ctx);
    if (!textValue) {
      const arr = map(keys(props.source), (key) => {
        return {
          label: key,
          value: key,
          type: isBoolean(props.source[key]) ? 'boolean' : 'string'
        };
      });
      return arr;
    }
    const path = split(ctx, ':');
    const sourceKey = get(path, '0');
    const option = get(path, '1');
    console.log('search:', path);
    if (path.length === 1) {
      const arr = map(keys(props.source), (key) => {
        return {
          label: key,
          value: key,
          type: isBoolean(props.source[key]) ? 'boolean' : 'string'
        };
      }).filter((item) => includes(item.label, sourceKey));
      return arr;
    }
    const data = get(dataSource, sourceKey);
    if (!data || !data.length) return [];
    if (isArray(data)) {
      return data.filter((item) => {
        if (!option) {
          return true;
        }
        return includes(item.label, option);
      });
    }
    return [];
  };
  const Strategy: any = [
    {
      id: 'expressionEditor',
      match: /(:|\s*|\w+)$/,
      index: 1,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        const regx = /(\w+:?\w*|\s+)$/g;
        const allResult = editorCtx.value.match(regx);
        const ctx = head(allResult);
        // const ctx = get(list, '0.0');
        callback(handleSearch(term, ctx));
      },
      context(beforeCursor: string) {
        editorCtx.value = beforeCursor;
        return isMatchWork.value; // true、false
      },
      template(data: resultItem) {
        return data.type
          ? `<span>${data.label}</span><span class='type'>(${data.type})</span>`
          : `<span>${data.label}</span>`;
      },
      // replace the text match result
      replace(result: resultItem) {
        const reg = /(\w+):(\w*)$/g;
        const matches = editorCtx.value.matchAll(reg);
        const list = Array.from(matches);
        console.log('list==1==', list, result, editorCtx.value);
        editorCtx.value = '';
        if (!list.length) {
          return ` ${result.label}`;
        }
        if (get(list, '0.2')) {
          return `${result.label}`;
        }
        return `:${result.label}`;
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
    const regx = /(\w+|\s+|:+)$/;
    if (!regx.test(expression.value)) {
      isMatchWork.value = false;
      textcomplete.hide();
    } else {
      isMatchWork.value = true;
    }
  };
  const initEditor = () => {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
    console.log('area:', textarea);
    const editor = new TextareaEditor(textarea);
    textcomplete = new Textcomplete(editor, Strategy, options);
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
    textcomplete.hide();
    // setTimeout(() => {
    //   runChange()
    // },200)
  };
  onClickOutside(editorWrap, (ev) => {
    handleBlur();
  });
  const handleEnter = () => {
    // if (!textcomplete?.dropdown?.shown) {
    //   runChange()
    // }
  };
  const handleExpressionChange = (e) => {
    textcomplete.hide();
    emits('update:modelValue', expression.value);
    setTimeout(() => {
      runChange();
    }, 200);
  };
  const handleDelete = (val) => {
    const regx = /:$/;
    if (!regx.test(expression.value)) {
      isMatchWork.value = false;
      textcomplete.hide();
    } else {
      isMatchWork.value = true;
    }
  };
  const handleFocus = () => {
    console.log('focus');
  };
  const handleClick = () => {
    console.log('click');
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
  onMounted(async () => {
    expression.value = props.modelValue;
    nextTick(() => {
      initEditor();
    });
  });
  onUnmounted(() => {
    textcomplete.destroy();
  });
</script>

<style lang="less" scoped>
  .autocomplete-area.arco-input-wrapper {
    display: flex;
    align-items: center;
    padding-left: 10px;
    border: 1px solid var(--seal-border-gray-2);

    &:focus-within {
      border: 1px solid rgb(var(--primary-6));
      transition: all 0.2s var(--seal-transition-func);
    }
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
      padding: 5px 6px;
      border-radius: 2px;
    }
  }

  textarea[readonly] {
    cursor: not-allowed;
  }
</style>

<style lang="less">
  .autocomplete-dropdown-list {
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

      &::marker {
        display: none;
      }
    }
  }
</style>
