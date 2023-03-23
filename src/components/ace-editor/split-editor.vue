<template>
  <div class="editor-container" :style="{ width: cW, height: cH }">
    <slot></slot>
    <div
      id="aceEditor"
      ref="editor"
      :class="className"
      :style="{ width: cW, height: cH }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
  import { hasIn, keys, each } from 'lodash';
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import ace from 'ace-builds';
  import { Split } from 'ace-builds/src-noconflict/ext-split';
  // const Split  = ace.require('ace/ext/split');
  const Range = ace.require('ace/ext/range');
  const props = defineProps({
    lang: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    },
    fontSize: {
      type: Number,
      default: 12
    },
    content: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default() {
        return '100%';
      }
    },
    height: {
      type: String,
      default: '100%'
    },
    className: {
      type: String,
      default: 'vue-ace-editor'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    orientation: {
      type: String,
      default: 'beside'
    },
    splits: {
      type: Number,
      default: 2
    }
  });
  const $emit = defineEmits([
    'init',
    'onFocus',
    'onBlur',
    'onChange',
    'onInput',
    'onCopy',
    'onPaste'
  ]);
  let aceEditor: any = null;
  let split: any = null;
  let splitEditor: any = null;
  let availableOptions: any = null;

  const cH = computed(() => {
    if (typeof props.height === 'number') return `${props.height}px`;
    if (typeof props.height === 'string') return props.height;
    return '';
  });
  const cW = computed(() => {
    if (typeof props.width === 'number') return `${props.width}px`;
    if (typeof props.width === 'string') return props.width;
    return '';
  });

  const setMode = () => {
    each(split, (editor) => {
      editor.getSession().setMode(`ace/mode/${props.lang}`);
    });
    return split;
  };
  const setTheme = () => {
    each(split, (editor) => {
      editor.setTheme(`ace/theme/${props.theme}`);
    });
    return split;
  };
  const setFontSize = () => {
    each(split, (editor) => {
      editor.setFontSize(props.fontSize);
    });
    return split;
  };
  const setValue = () => {
    each(split, (editor, index) => {
      editor.getSession().setValue(props.content[index] || '');
    });
    return split;
  };
  const getValue = () => {
    const ret: any[] = [];
    each(split, (editor: any) => {
      ret.push(editor?.getValue?.());
    });
    return ret;
  };
  const setOptions = () => {
    each(split, (editor) => {
      if (keys(props.options).length === 0) return;
      keys(props.options).forEach((k) => {
        if (hasIn(availableOptions, k)) {
          editor.setOption(k, props.options[k]);
        } else {
          console.warn(
            `VueAce: editor option ${k} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`
          );
        }
      });
    });
    return split;
  };
  const setReadonly = () => {
    each(split, (editor) => {
      editor.setReadOnly(props.readonly);
    });
    return split;
  };
  const setCompleteData = (data) => {
    ace.require('ace/ext/language_tools').addCompleter({
      getCompletions(editor, session, pos, prefix, callback) {
        return callback(null, data);
      }
    });
  };
  const onFocus = () => {
    $emit('onFocus', split);
  };
  const onBlur = () => {
    $emit('onBlur', split);
  };
  const onChange = (obj) => {
    obj = Object.assign(obj, {
      value: getValue(),
      split
    });
    $emit('onChange', obj);
  };
  const onInput = () => {
    $emit('onInput', split);
  };
  const onCopy = (txt) => {
    $emit('onCopy', txt);
  };
  const onPaste = (obj) => {
    $emit('onPaste', obj);
  };
  const resize = () => {
    each(split, (editor) => {
      editor.resize();
    });
    return split;
  };
  const setRange = (startRow, startCol, endRow, endCol) => {
    return new Range(startRow, startCol, endRow, endCol);
  };
  const setOrientation = () => {
    aceEditor?.env?.split?.setOrientation(
      aceEditor.env.split[props.orientation?.toUpperCase?.()]
    );
  };
  const setSplits = () => {
    aceEditor?.env?.split?.setSplits(props.splits);
    each(split, (editor) => {
      editor.$blockScrolling = Infinity;
      editor.on('focus', onFocus);
      editor.on('blur', onBlur);
      editor.on('copy', onCopy);
      editor.on('paste', onPaste);
      editor.on('change', onChange);
      editor.on('input', onInput);
    });
  };
  const init = () => {
    aceEditor = ace.edit('aceEditor');
    $emit('init', aceEditor);
    split = new Split(aceEditor.container, `ace/theme/${props.theme}`, 2);
    aceEditor.env.split = split;
    splitEditor = split?.getEditor(0);
    availableOptions = splitEditor.$options;
    split.forEach((editor) => {
      editor.$blockScrolling = Infinity;
      editor.on('focus', onFocus);
      editor.on('blur', onBlur);
      editor.on('copy', onCopy);
      editor.on('paste', onPaste);
      editor.on('change', onChange);
      editor.on('input', onInput);
    });
    setMode();
    setTheme();
    setFontSize();
    setOptions();
    setValue();
    setReadonly();
    setOrientation();
  };
  watch(
    () => props.fontSize,
    () => {
      setFontSize();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.content,
    () => {
      setValue();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.theme,
    () => {
      setTheme();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.lang,
    () => {
      setMode();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.height,
    () => {
      nextTick(() => {
        resize();
      });
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.width,
    () => {
      nextTick(() => {
        resize();
      });
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.orientation,
    () => {
      setOrientation();
    },
    {
      immediate: true
    }
  );
  watch(
    () => props.splits,
    () => {
      setSplits();
    },
    {
      immediate: true
    }
  );
  onMounted(() => {
    init();
  });
  onUnmounted(() => {
    aceEditor.destroy();
    aceEditor.container.remove();
  });
</script>

<style scoped>
  .editor-container {
    position: relative;
  }
</style>
