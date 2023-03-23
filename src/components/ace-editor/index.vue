<template>
  <div class="ace-box" :style="{ height }">
    <div :id="editorId" style="height: 100%"></div>
  </div>
</template>

<script lang="ts" setup>
  import _ from 'lodash';
  import {
    onMounted,
    nextTick,
    onBeforeMount,
    defineEmits,
    watch,
    ref,
    ComponentPublicInstance
  } from 'vue';
  import ace from 'ace-builds';
  import 'ace-builds/src-noconflict/ext-language_tools';
  // import 'ace-builds/src-noconflict/ext-modelist';
  // import 'ace-builds/src-noconflict/theme-monokai';
  import 'ace-builds/src-noconflict/theme-twilight';
  import 'ace-builds/src-noconflict/mode-javascript';
  import 'ace-builds/src-noconflict/mode-text';
  import 'ace-builds/src-noconflict/mode-json';
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
    defaultValue: {
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
      type: String,
      default() {
        return '300px';
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
    }
  });
  const emits = defineEmits(['change', 'update:modelValue']);
  // let timer:any = null
  let aceEditor: any = null;
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
    () => props.defaultValue,
    (newVal) => {
      aceEditor?.setValue(props.defaultValue, -1);
    },
    { immediate: true }
  );
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
      aceEditor.on('change', function (args: any) {
        const val = aceEditor.getValue();
        emits('change', val);
        emits('update:modelValue', val);
      });
      aceEditor.setOptions({
        wrap: true, // 换行
        useWorker: false,
        showPrintMargin: false,
        fontSize: 14,
        readOnly: props.readOnly,
        mode: `ace/mode/${props.lang}`,
        // theme: 'ace/theme/monokai',
        enableSnippets: false,
        autoScrollEditorIntoView: false, // 自动滚动编辑器视图
        enableLiveAutocompletion: true, // 智能补全
        enableBasicAutocompletion: true
      });
    });
  });
  onBeforeMount(() => {
    aceEditor?.destroy?.();
    aceEditor?.container?.remove();
  });
</script>

<style lang="less" scoped>
  .ace-box {
    position: relative;
    width: 100%;
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
