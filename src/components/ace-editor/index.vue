<template>
  <div class="ace-wrapper">
    <div v-if="$attrs.label" class="label">
      <span>
        <span>{{ $attrs.label }}</span>
        <span
          v-if="$attrs.required"
          class="bold-500 m-l-2 star"
          style="color: rgb(var(--danger-6))"
          >*</span
        >
      </span>
      <a-tooltip v-if="popupInfo" :content="popupInfo">
        <icon-info-circle
          style="stroke-linecap: initial; cursor: default"
          class="mleft-5"
        />
      </a-tooltip>
    </div>
    <div
      v-show="isAce"
      class="ace-box"
      :style="{ height: _.isNumber(height) ? `${height}px` : height }"
    >
      <div
        :id="editorId"
        :style="{ minHeight: _.isNumber(height) ? `${height}px` : height }"
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
  import _, { cloneDeep, each, get, isString, toString } from 'lodash';
  import {
    onMounted,
    nextTick,
    onBeforeMount,
    watch,
    PropType,
    ref,
    useAttrs,
    ComponentPublicInstance
  } from 'vue';
  import ace, { Range } from 'ace-builds';
  import 'ace-builds/src-noconflict/ext-language_tools';
  // import 'ace-builds/src-noconflict/ext-modelist';
  // import 'ace-builds/src-noconflict/theme-monokai';
  import 'ace-builds/src-noconflict/theme-twilight';
  import 'ace-builds/src-noconflict/mode-javascript';
  import 'ace-builds/src-noconflict/mode-text';
  import 'ace-builds/src-noconflict/mode-json';
  // import 'ace-builds/src-noconflict/mode-html';
  import 'ace-builds/src-noconflict/mode-terraform';
  import 'ace-builds/src-noconflict/mode-yaml';
  import 'ace-builds/src-noconflict/mode-sh';
  import 'ace-builds/src-noconflict/mode-xml';
  // import 'ace-builds/src-noconflict/mode-markdown';
  import { Position, Completer } from './config/interface';

  const langTools = ace.require('ace/ext/language_tools');

  // const { Split } = ace.require('ace/ext/split');
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
  const $attrs = useAttrs();
  const emits = defineEmits(['change', 'update:modelValue', 'input']);

  // let timer:any = null
  let aceEditor: any = null;
  const isAce = ref(true);
  const inputVal = ref('');
  const isInitialValue = ref(false);
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
  const setDefaultValue = () => {
    setTimeout(() => {
      // const defaultvalue = isString(props.editorDefaultValue)
      //   ? props.editorDefaultValue
      //   : JSON.stringify(props.editorDefaultValue, null, 2);
      const val =
        props.editorDefaultValue || get(defaultHolder, props.lang) || '';
      aceEditor?.setValue(val, 1);
      inputVal.value = val;
    }, 100);
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
        // if (list.length) {
        //   editor.execCommand('startAutocomplete',{matches: list,})
        // }
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
  const execSplitEditor = () => {
    // if (!props.split) return;
  };
  watch(
    () => props.editorDefaultValue,
    () => {
      // aceEditor?.setValue(props.editorDefaultValue, -1);
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
  watch(
    () => props.lang,
    (newVal) => {
      aceEditor?.setOption('mode', `ace/mode/${newVal}`);
    },
    { immediate: false }
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

      aceEditor = ace.edit(`${props.editorId}`);
      // aceEditor.setValue(props.modelValue);

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
      aceEditor.setOptions({
        wrap: true,
        useWorker: false,
        showPrintMargin: false,
        fontSize: 14,
        readOnly: props.readOnly,
        mode: `ace/mode/${props.lang}`,
        theme: props.theme ? `ace/theme/${props.theme}` : '',
        enableSnippets: false,
        showGutter: props.showGutter,
        autoScrollEditorIntoView: false,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true
      });
    });
  });
  defineExpose({
    clear
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
    // height: 300px;
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
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);

    .label {
      display: flex;
      align-items: center;
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
        background-color: #fff;
        opacity: 1;
        transition: opacity 0.3s;
      }
    }

    .icon-btn {
      position: absolute;
      top: 1px;
      right: 1px;
      color: rgb(var(--arcoblue-4));
      background-color: #fff;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }
</style>
