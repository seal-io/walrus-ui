<template>
  <div class="ace-wrapper">
    <div v-if="$attrs.label || slots.label" class="label">
      <span>
        <slot name="label"
          ><span>{{ $attrs.label }}</span></slot
        >
        <span
          v-if="$attrs.required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        >
      </span>
      <Tooltip :popup-info="popupInfo" :doc="$attrs.doc"></Tooltip>
    </div>
    <div
      v-show="isAce"
      class="ace-box"
      :class="{ dark: appStore.theme === 'dark' }"
      :style="{
        height: _.isNumber(height) ? `${height}px` : height
      }"
    >
      <div
        :id="`${editorId}-${traceKey}`"
        ref="editorRef"
        :style="{
          minHeight: _.isNumber(height) ? `${height}px` : height
        }"
      ></div>
    </div>
    <a-input
      v-show="!isAce"
      v-model="inputVal"
      :default-value="editorDefaultValue"
      @input="handleInput"
    ></a-input>
    <icon-launch
      v-if="showToggle"
      class="icon-btn"
      @click="handleToggleInput"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';
  import _, { cloneDeep, each, get, isString, toString } from 'lodash';
  import Tooltip from '@/components/seal-form/_components/tooltip.vue';
  import {
    onMounted,
    nextTick,
    onBeforeMount,
    watch,
    PropType,
    ref,
    useAttrs,
    inject,
    useSlots,
    computed
  } from 'vue';
  import { InjectTraceKey } from '@/views/config';
  import ace, { Range, edit } from 'ace-builds';
  import 'ace-builds/src-noconflict/ext-language_tools';
  import 'ace-builds/src-noconflict/ext-searchbox';
  // import 'ace-builds/src-noconflict/theme-monokai';
  // import 'ace-builds/src-noconflict/theme-solarized_dark';
  // import 'ace-builds/src-noconflict/theme-dracula';
  import 'ace-builds/src-noconflict/theme-nord_dark';
  import 'ace-builds/src-noconflict/mode-javascript';
  import 'ace-builds/src-noconflict/mode-text';
  import 'ace-builds/src-noconflict/mode-json';
  import 'ace-builds/src-noconflict/mode-terraform';
  import 'ace-builds/src-noconflict/mode-yaml';
  import 'ace-builds/src-noconflict/mode-sh';
  import 'ace-builds/src-noconflict/mode-xml';
  import { Position, Completer } from './config/interface';

  const langTools = ace.require('ace/ext/language_tools');

  const props = defineProps({
    modelValue: {
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
    liveInput: {
      type: Boolean,
      default() {
        return false;
      }
    },
    editorDefaultValue: {
      type: String,
      default() {
        return '';
      }
    },
    theme: {
      type: String,
      default() {
        return '';
      }
    },
    lang: {
      type: String,
      default() {
        return 'text';
      }
    },
    editorId: {
      type: String,
      default() {
        return 'aceEditor';
      }
    },
    height: {
      type: [Number, String],
      default() {
        return 200;
      }
    },
    readOnly: {
      type: Boolean,
      default() {
        return false;
      }
    },
    split: {
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
    },
    addLines: {
      type: Array as PropType<number[]>,
      default() {
        return [];
      }
    },
    showGutter: {
      type: Boolean,
      default() {
        return true;
      }
    },
    removeLines: {
      type: Array as PropType<number[]>,
      default() {
        return [];
      }
    },
    showToggle: {
      type: Boolean,
      default() {
        return false;
      }
    }
  });
  const defaultHolder = {
    yaml: '# yaml format'
  };
  const appStore = useAppStore();
  const slots = useSlots();
  const traceKey = inject(InjectTraceKey, ref('traceKey'));
  const $attrs = useAttrs();
  const emits = defineEmits(['change', 'update:modelValue', 'input', 'blur']);

  // let timer:any = null
  let aceEditor: any = null;
  const darkTheme = 'nord_dark';
  const isAce = ref(true);
  const inputVal = ref('');
  const editorRef = ref();
  const isInitialValue = ref(true);
  const markerIdList = ref<number[]>([]);
  const backupAddlines = ref<number[]>([]);
  const backupRemoveLines = ref<number[]>([]);
  const regx = /(\w+\.)*(\w*)$/g;
  const identifer = /[a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]/;
  const identifer2 =
    /([a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]+\.)*([a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]*)$/;

  const resetGutterDiffDecoration = (row) => {
    aceEditor?.session?.removeGutterDecoration(row, 'row-add-icon');
    aceEditor?.session?.removeGutterDecoration(row, 'row-delete-icon');
  };
  const setHighLightLine = (row, className) => {
    const markerId = aceEditor?.session?.addMarker(
      new Range(row, 0, row, 1000),
      className,
      'fullLine'
    );
    markerIdList.value.push(markerId);
  };
  const removeMarkers = () => {
    // clear highlight lines
    if (markerIdList.value.length) {
      each(markerIdList.value, (markerId) => {
        aceEditor?.session?.removeMarker(markerId);
      });
    }
    // clear highlight gutter
    if (backupAddlines.value.length) {
      each(backupAddlines.value, (row) => {
        aceEditor?.session?.removeGutterDecoration(row - 1, 'row-add-icon');
      });
    }
    if (backupRemoveLines.value.length) {
      each(backupRemoveLines.value, (row) => {
        aceEditor?.session?.removeGutterDecoration(row - 1, 'row-delete-icon');
      });
    }
  };
  const setDiffRowDecoration = () => {
    removeMarkers();
    each(props.addLines, (row) => {
      resetGutterDiffDecoration(row - 1);
      aceEditor?.session?.addGutterDecoration(row - 1, 'row-add-icon');
      setHighLightLine(row - 1, 'text-add-line');
    });
    each(props.removeLines, (row) => {
      resetGutterDiffDecoration(row - 1);
      aceEditor?.session?.addGutterDecoration(row - 1, 'row-delete-icon');
      setHighLightLine(row - 1, 'text-delete-line');
    });
    backupAddlines.value = cloneDeep(props.addLines);
    backupRemoveLines.value = cloneDeep(props.removeLines);
  };
  const clearDiffRowDecoration = (args) => {
    if (args?.action === 'remove' && get(args, 'end.column') === 0) {
      resetGutterDiffDecoration(get(args, 'end.row'));
    }
  };
  const getValuePath = (wordRange) => {
    const ctx = wordRange?.replace(/\n/g, '');
    const result = ctx?.matchAll(regx);
    const valList = Array.from(result);
    return _.get(valList, '0.0');
  };
  const getCompletionList = (path: string): Array<Completer> => {
    if (!path) return [];
    const pathList = _.split(path, '.');
    const initialPath = _.initial(pathList);
    const lastItem = _.last(pathList);
    let list: Completer[] = [];

    if (!initialPath.length) {
      list = _.map(_.keys(props.source), (key) => {
        return {
          name: key,
          value: key
        };
      }).filter((s) => _.toLower(s.name).startsWith(_.toLower(lastItem)));
      return list;
    }
    const data = _.get(props.source, `${_.join(initialPath, '.')}`);
    if (!data) return [];
    list = _.map(_.keys(data), (key) => {
      return {
        name: key,
        value: key
      };
    });
    // a.
    if (!lastItem) return list;
    // a.b
    return list.filter((o) =>
      _.toLower(o.name).startsWith(_.toLower(lastItem))
    );
  };
  // default value is empty str,or will throw error in console
  const setDefaultValueDebounce = _.debounce(() => {
    const val = props.editorDefaultValue || '';
    aceEditor?.setValue(val, 1);
    inputVal.value = val;
  }, 100);
  const setDefaultValue = () => {
    setDefaultValueDebounce();
  };
  const setLanguageTools = () => {
    langTools.setCompleters();
    langTools.addCompleter({
      identifierRegexps: [identifer],
      getCompletions(
        editor: any,
        session: any,
        pos: Position,
        prefix: any,
        callback: any
      ) {
        const wordRange = editor.session.getTextRange({
          start: { row: 0, column: 0 },
          end: pos
        });
        const valuePath = getValuePath(wordRange) || '';
        const list = getCompletionList(valuePath);
        callback(null, list);
      }
    });
  };
  const handleInput = (val) => {
    emits('change', val);
    emits('input', val);
    emits('update:modelValue', val);
  };
  const handleToggleInput = () => {
    isAce.value = !isAce.value;
  };

  watch(
    () => props.editorDefaultValue,
    (nv) => {
      const oldvalue = aceEditor?.getValue();
      if (oldvalue === nv) return;
      setDefaultValue();
      nextTick(() => {
        setDiffRowDecoration();
      });
    },
    { immediate: true }
  );
  const clear = () => {
    aceEditor?.setValue('');
  };
  const setValue = (val) => {
    aceEditor?.setValue(val, 1);
  };
  watch(
    () => props.lang,
    (newVal) => {
      aceEditor?.setOption('mode', `ace/mode/${newVal}`);
    },
    { immediate: false }
  );
  watch(
    () => props.theme, // monokai, twilight
    (newVal) => {
      aceEditor?.setOption('theme', `ace/theme/${newVal}`);
    },
    { immediate: false }
  );
  watch(
    () => appStore.theme,
    (val) => {
      console.log('sysTheme', val);
      if (val === 'dark') {
        aceEditor?.setOption('theme', `ace/theme/${darkTheme}`);
      } else {
        aceEditor?.setOption('theme', '');
      }
    },
    {
      immediate: false
    }
  );
  watch(
    () => props.readOnly,
    (newVal) => {
      aceEditor?.setOption('readOnly', newVal);
    },
    { immediate: false }
  );

  onMounted(() => {
    nextTick(() => {
      setLanguageTools();

      aceEditor = ace.edit(editorRef.value);

      aceEditor.session.on('change', (args) => {
        // TODO
      });
      aceEditor.on('change', function (args: any) {
        const val = aceEditor.getValue();
        inputVal.value = val;
        emits('change', val);
        emits('input', val);
        emits('update:modelValue', val);
        clearDiffRowDecoration(args);
      });
      aceEditor.on('blur', function (args: any) {
        const val = aceEditor.getValue();
        emits('update:modelValue', val);
        emits('blur');
      });
      aceEditor.setOptions({
        wrap: true,
        useWorker: false,
        showPrintMargin: false,
        fontSize: 14,
        readOnly: props.readOnly,
        mode: `ace/mode/${props.lang}`,
        theme: appStore.theme === 'dark' ? `ace/theme/${darkTheme}` : '',
        enableSnippets: false,
        showGutter: props.showGutter,
        autoScrollEditorIntoView: false,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        placeholder: get(defaultHolder, props.lang) || ''
      });
    });
  });
  defineExpose({
    clear,
    setValue
  });
  onBeforeMount(() => {
    aceEditor?.destroy?.();
    aceEditor?.container?.remove();
  });
</script>

<style lang="less">
  @import url('./style.less');
</style>

<style lang="less" scoped>
  .ace-box {
    position: relative;
    width: 100%;
    overflow: auto;
    // height: 300px
  }

  #ace-editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }

  .ace-wrapper {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .label {
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 10px;
      color: var(--color-text-3);
      border-bottom: 1px solid var(--color-border-2);
    }

    .title {
      padding: 10px;
      color: var(--color-text-3);
      border-bottom: 1px solid var(--color-border-2);
    }

    .star {
      position: relative;
      top: 2px;
    }

    &:hover {
      .icon-btn {
        background-color: var(--color-white);
        opacity: 1;
        transition: opacity 0.3s;
      }
    }

    .icon-btn {
      position: absolute;
      top: 1px;
      right: 1px;
      color: rgb(var(--arcoblue-4));
      background-color: var(--color-white);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
</style>
