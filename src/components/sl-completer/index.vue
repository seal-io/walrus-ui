<template>
  <div class="autocomplete-area arco-textarea-wrapper">
    <textarea
      id="textarea"
      v-model="expression"
      class="arco-textarea completer"
      :spellcheck="false"
      :rows="5"
      :readonly="disabled"
      @focus="handleFocus"
      @click="handleClick"
      @input="handleInput"
      @blur="handleBlur"
      @keyup.delete="handleDelete"
      @change="handleExpressionChange"
    ></textarea>
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
    toLower
  } from 'lodash';
  import { nextTick, onMounted, ref, onUnmounted } from 'vue';
  import { Textcomplete, TextcompleteOption } from '@textcomplete/core';
  import { TextareaEditor } from '@textcomplete/textarea';

  type SearchCallback<T> = (results: T[]) => void;
  type resultItem = {
    label: string;
    value: string;
  };

  const props = defineProps({
    modelValue: {
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
  const emits = defineEmits(['update:modelValue', 'input']);
  const expression = ref('');
  const editorCtx = ref('');
  const isMatchWork = ref(true);
  let timer: any = null;
  // const textarea = ref()
  let textcomplete: any = null;
  const handleSearch = (term: string, ctx): Array<resultItem> => {
    const regx = /^(\w+)?\.?(\w*)$/;
    if (!ctx || !regx.test(ctx)) return [];
    const dataSource = cloneDeep(props.source);
    const path = split(ctx, '.');
    const initialPath = initial(path);
    const lastItem = last(path);
    if (!initialPath.length) {
      const arr = map(keys(props.source), (key) => {
        return {
          label: key,
          value: key
        };
      }).filter((s) => toLower(s.label).startsWith(toLower(ctx)));
      return arr;
    }
    const data = get(dataSource, `${join(initialPath, '.')}`);
    if (!data) return [];
    const list = map(keys(data), (key) => {
      return {
        label: key,
        value: key
      };
    });
    if (!lastItem) {
      return list;
    }
    return list.filter((o) => toLower(o.label).startsWith(toLower(lastItem)));
  };
  const Strategy: any = [
    {
      id: 'expressionEditor',
      // match: /(\w+)\.(\w*)$/,
      match: /(\w+)?\.?(\w*)$/,
      index: 1,
      search(term: string, callback: SearchCallback<resultItem>, match: any) {
        const regx = /'?(\w+\.)*(\w*)$/g;
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
        return `<span>${data.label}</span>`;
      },
      // replace the text match result
      replace(result: resultItem) {
        const reg = /(\w+)\.(\w*)$/g;
        const matches = editorCtx.value.matchAll(reg);
        const list = Array.from(matches);
        editorCtx.value = '';
        if (!list.length) {
          return `${result.label}`;
        }
        return `${get(list, '0.1')}.${result.label}`;
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
    const regx = /(\w+|\s+|\.+)$/;
    if (!regx.test(expression.value)) {
      isMatchWork.value = false;
      textcomplete.hide();
    } else {
      isMatchWork.value = true;
    }
  };
  const initEditor = () => {
    const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
    const editor = new TextareaEditor(textarea);
    textcomplete = new Textcomplete(editor, Strategy, options);
  };
  const dispatchInput = () => {
    emits('update:modelValue', expression.value);
    emits('input', expression.value);
  };
  const handleInput = (e) => {
    isNeedHide();
    clearTimeout(timer);
    timer = setTimeout(() => {
      dispatchInput();
    }, 100);
  };
  const handleBlur = () => {
    textcomplete.hide();
  };
  const handleExpressionChange = () => {};
  const handleDelete = (val) => {
    const regx = /\.$/;
    if (!regx.test(expression.value)) {
      isMatchWork.value = false;
      textcomplete.hide();
    } else {
      isMatchWork.value = true;
    }
  };
  const handleFocus = () => {};
  const handleClick = () => {};
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
  .autocomplete-area.arco-textarea-wrapper {
    border: none;
  }

  .completer {
    color: #e4e420;
    font-size: var(--font-size-large);
    background-color: rgb(29 33 41 / 80%);

    &.arco-textarea {
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
      color: var(--color-white);
      background-color: rgb(64, 128, 255);
    }

    li {
      box-sizing: border-box;
      height: 24px;
      margin: 0;
      padding: 0 10px;
      color: var(--color-text-2);
      line-height: 24px;

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
