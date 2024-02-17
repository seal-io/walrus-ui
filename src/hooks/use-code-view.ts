import { line } from '@antv/x6/lib/registry/port-layout/line';
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

  interface DiffContent {
    lineCounts: number;
    chunks: DiffCodeItem[];
  }

  const diffResult = ref<DiffItem[]>([]);
  const leftChunks = ref<DiffCodeItem[]>([]);
  const rightChunks = ref<DiffCodeItem[]>([]);
  const unifiedChunks = ref<DiffCodeItem[]>([]);
  const collapseNum = ref<number>(10);

  const clearDiffLines = () => {
    leftChunks.value = [];
    rightChunks.value = [];
    unifiedChunks.value = [];
  };

  const setDiffResult = (oldStr, newStr) => {
    diffResult.value = Diff.diffLines(oldStr || '', newStr || '', {
      ignoreWhitespace: false
    });
  };

  const shouldSetBlank = (type, index) => {
    if (index === unifiedChunks.value.length - 1) {
      return true;
    }
    index = type === 'remove' ? index + 1 : index - 1;

    const chunk = unifiedChunks.value[index];
    return !chunk || !chunk.type;
  };

  const createBlankChunk = (lineCounts) => {
    return {
      type: 'blank',
      lineCounts,
      chunks: new Array(lineCounts).fill('\n'),
      lines: new Array(lineCounts).fill('\n'),
      startLine: 1,
      collapsed: false
    };
  };

  const adaptSplitResult = (left, right) => {
    _.each(left.chunks, (leftChunk, index) => {
      const rightChunk = right.chunks[index];
      if (leftChunk.collapsed && rightChunk.collapsed) {
        // 记录下左右栏chunk index; 点击展开时，通过此index定位chunk进行展开。
        leftChunk.leftIndex = leftChunks.value.length;
        leftChunk.rightIndex = rightChunks.value.length;

        rightChunk.leftIndex = leftChunks.value.length;
        rightChunk.rightIndex = rightChunks.value.length;
      }

      leftChunks.value.push(_.cloneDeep(leftChunk));
      rightChunks.value.push(_.cloneDeep(rightChunk));

      // 修改的行数不一致时，补充空白块。例如：左栏删除 3行，右栏添加5行代码。则左栏需补充 2行空白，进行对齐。
      if (leftChunk.type === 'remove' && rightChunk.type === 'add') {
        const count = leftChunk.lineCount - rightChunk.lineCount;
        if (count < 0) {
          leftChunks.value.push(createBlankChunk(Math.abs(count)));
        } else if (count > 0) {
          rightChunks.value.push(createBlankChunk(count));
        }
      }
    });
  };

  const setDiffChunks = () => {
    const left: DiffContent = {
      lineCounts: 1,
      chunks: []
    };
    const right: DiffContent = {
      lineCounts: 1,
      chunks: []
    };
    const setChunkLineNumber = (item, lineNumer) => {
      item.startLine = lineNumer;
      return lineNumer + item.lineCounts;
    };

    _.each(unifiedChunks.value, (item, index) => {
      if (!item.type) {
        left.lineCounts = setChunkLineNumber(item, left.lineCounts);
        left.chunks.push(item);

        const clonedChunk = _.cloneDeep(item);
        right.lineCounts = setChunkLineNumber(clonedChunk, right.lineCounts);
        right.chunks.push(clonedChunk);
      }

      if (item.type === 'add') {
        right.lineCounts = setChunkLineNumber(item, right.lineCounts);

        right.chunks.push(_.cloneDeep(item));
        if (shouldSetBlank(item.type, index)) {
          left.chunks.push(createBlankChunk(item.lineCounts));
        }
      }

      if (item.type === 'remove') {
        left.lineCounts = setChunkLineNumber(item, left.lineCounts);
        left.chunks.push(_.cloneDeep(item));

        if (shouldSetBlank(item.type, index)) {
          right.chunks.push(createBlankChunk(item.lineCounts));
        }
      }
    });

    adaptSplitResult(left, right);
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
      let lines = item.value.split('\n');
      lines =
        index === diffResult.value.length - 1
          ? lines.slice(0)
          : lines.slice(0, -1);

      return {
        type,
        chunks: lines,
        lineCounts: lines.length,
        startLine: 1,
        collapsed: lines.length > collapseNum.value && type === ''
      };
    });
    setDiffChunks();
  };

  const getDiffCodeResult = (content) => {
    clearDiffLines();
    if (!content?.old && !content?.new) {
      return;
    }
    setTimeout(() => {
      setDiffResult(content.old, content.new);
      getCodeDiffChunks();
    }, 100);
  };
  return {
    leftChunks,
    rightChunks,
    unifiedChunks,
    diffResult,
    setDiffResult,
    clearDiffLines,
    getDiffCodeResult
  };
}
