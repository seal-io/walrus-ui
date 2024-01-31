import * as Diff from 'diff';
import _ from 'lodash';
import { ref } from 'vue';

export default function useCodeView() {
  interface DiffItem {
    count: number;
    value: string;
    line: number;
    removed?: boolean;
    added?: boolean;
  }

  interface DiffCodeItem {
    type?: string;
    chunks: string[];
    lineCounts: number;
    startLine: number;
    collapsed?: boolean;
  }

  const diffResult = ref<DiffItem[]>([]);
  const removeChunks = ref<DiffCodeItem[]>([]);
  const addChunks = ref<DiffCodeItem[]>([]);
  const unifiedChunks = ref<DiffCodeItem[]>([]);
  const collapseNum = ref<number>(10);

  const clearDiffLines = () => {
    removeChunks.value = [];
    addChunks.value = [];
    unifiedChunks.value = [];
  };

  const setDiffResult = (oldStr, newStr) => {
    diffResult.value = Diff.diffLines(oldStr || '', newStr || '');
  };

  const getCodeDiffChunks = () => {
    unifiedChunks.value = _.map(diffResult.value, (item, index) => {
      let type = '';
      if (item.added) {
        type = 'add';
      }
      if (item.removed) {
        type = 'remove';
      }
      return {
        type,
        chunks: _.split(item.value, '\n'),
        lineCounts: item.count,
        startLine:
          _.get(diffResult.value, [`${index - 1}`, 'startLine'], 0) + 1,
        collapsed: item.count > collapseNum.value && type === ''
      };
    });
    _.each(unifiedChunks.value, (item, index) => {
      if (!item.type) {
        addChunks.value.push(_.cloneDeep(item));
        removeChunks.value.push(_.cloneDeep(item));
      }
      if (item.type === 'add') {
        addChunks.value.push(_.cloneDeep(item));
        removeChunks.value.push({
          type: '',
          lineCounts: item.lineCounts,
          chunks: Array(item.lineCounts).fill('\n'),
          startLine: item.startLine,
          collapsed: item.collapsed
        });
      }
      if (item.type === 'remove') {
        removeChunks.value.push(_.cloneDeep(item));
        addChunks.value.push({
          type: '',
          lineCounts: item.lineCounts,
          startLine: item.startLine,
          chunks: Array(item.lineCounts).fill('\n'),
          collapsed: item.collapsed
        });
      }
    });
  };

  const getDiffCodeResult = (content) => {
    removeChunks.value = [];
    addChunks.value = [];
    if (!content?.old && !content?.new) {
      return;
    }
    setTimeout(() => {
      setDiffResult(content.old, content.new);
      getCodeDiffChunks();
    }, 100);
  };
  return {
    removeChunks,
    addChunks,
    unifiedChunks,
    diffResult,
    setDiffResult,
    clearDiffLines,
    getDiffCodeResult
  };
}
