<template>
  <div class="ace-box" :style="{ height: `${height + 2}px` }">
    <div :id="editorId" :style="{ minHeight: `${height}px` }"></div>
  </div>
</template>

<script lang="ts" setup>
  import _, { cloneDeep, each, get } from 'lodash';
  import {
    onMounted,
    nextTick,
    onBeforeMount,
    defineEmits,
    watch,
    PropType,
    ref,
    defineExpose,
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
      type: Number,
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
    }
  });
  const emits = defineEmits(['change', 'update:modelValue']);
  console.log('terraform');
  // let timer:any = null
  let aceEditor: any = null;
  const isInitialValue = ref(false);
  const markerIdList = ref<number[]>([]);
  const backupAddlines = ref<number[]>([]);
  const backupRemoveLines = ref<number[]>([]);
  const regx = /(\w+\.)*(\w*)$/g;
  const identifer = /[a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]/;
  const identifer2 =
    /([a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]+\.)*([a-zA-Z_0-9$\-\u00A2-\u2000\u2070-\uFFFF]*)$/;

  const hintList = [
    {
      name: 'vulnerability',
      value: 'vulnerability',
      type: 'seal',
      score: 6,
      meta: 'custom'
    },
    { name: 'cvss3', value: 'cvss3', score: 6, meta: 'custom' },
    { name: 'serverity', value: 'serverity', score: 6, meta: 'custom' },
    { name: 'license', value: 'license', score: 6, meta: 'custom' },
    { name: 'file', value: 'file', score: 6, meta: 'custom' },
    { name: 'myObj', value: 'file', score: 6, meta: 'custom' }
  ];
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
    console.log('markerId===', markerIdList, markerId);
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
    const ctx = wordRange.replace(/\n/g, '');
    const result = ctx.matchAll(regx);
    const valList = Array.from(result);
    console.log('prefix===3===', ctx);
    return _.get(valList, '0.0');
  };
  const getCompletionList = (path: string): Array<Completer> => {
    if (!path) return [];
    const pathList = _.split(path, '.');
    const initialPath = _.initial(pathList);
    const lastItem = _.last(pathList);
    let list: Completer[] = [];
    console.log('source===:', {
      path,
      source: props.source,
      initialPath,
      lastItem
    });
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
        console.log('wordRange===', wordRange);
        const valuePath = getValuePath(wordRange);
        const list = getCompletionList(valuePath);
        console.log('prefix====', { pos, prefix, session, value: valuePath });
        console.log('completions:', prefix, list, props.source);
        callback(null, list);
        // if (list.length) {
        //   editor.execCommand('startAutocomplete',{matches: list,})
        // }
      }
    });
  };
  const execSplitEditor = () => {
    // if (!props.split) return;
  };
  watch(
    () => props.editorDefaultValue,
    () => {
      // aceEditor?.setValue(props.editorDefaultValue, -1);
      console.log(
        'editorDefaultValue==',
        props.editorId,
        props.editorDefaultValue,
        props.modelValue
      );
      setTimeout(() => {
        aceEditor?.setValue(props.editorDefaultValue, -1);
      }, 200);
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
      console.log('aceEditor==', aceEditor);

      aceEditor.session.on('change', (args) => {
        console.log('session change:', args);
      });
      aceEditor.on('change', function (args: any) {
        const val = aceEditor.getValue();
        emits('change', val);
        emits('update:modelValue', val);
        clearDiffRowDecoration(args);
        console.log('editor change===', val);
        // aceEditor.session.removeGutterDecoration(3, 'gutter-rm-line');
        // aceEditor.session.addGutterDecoration(3, 'gutter-rm-line');
        // aceEditor.session.setBreakpoints([2, 3, 4, 5]);
        // const hlRange = aceEditor.session.highlightLines(3, 3, 'hight-light');
        // aceEditor.session.addMarker(new Range(2, 5), 'myMarker', 'text');
        // aceEditor.getSession().setAnnotations([
        //   {
        //     row: 1,
        //     column: 10,
        //     text: 'Strange error',
        //     type: 'delete' // also warning and information
        //   }
        // ]);
        console.log('args======', args);
      });
      aceEditor.setOptions({
        wrap: true, // 换行
        useWorker: false,
        showPrintMargin: false,
        fontSize: 14,
        readOnly: props.readOnly,
        mode: `ace/mode/${props.lang}`,
        theme: props.theme ? `ace/theme/${props.theme}` : '',
        enableSnippets: false,
        showGutter: props.showGutter,
        autoScrollEditorIntoView: false, // 自动滚动编辑器视图
        enableLiveAutocompletion: true, // 智能补全
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
    border: 1px solid var(--color-border-2);
    border-radius: var(--border-radius-small);
  }

  #ace-editor {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
  }
</style>
