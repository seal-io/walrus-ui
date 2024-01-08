import * as Diff from 'diff';
import _ from 'lodash';
import { ref } from 'vue';

export default function useCodeDiff() {
  interface DiffItem {
    count: number;
    value: string;
    line: number;
    removed?: boolean;
    added?: boolean;
  }
  const removeLines = ref<number[]>([]);
  const addLines = ref<number[]>([]);
  const diffResult = ref<DiffItem[]>([]);
  const codeResult = ref('');

  const clearDiffLines = () => {
    removeLines.value = [];
    addLines.value = [];
  };

  const setDiffResult = (oldStr, newStr) => {
    diffResult.value = Diff.diffLines(oldStr || '', newStr || '');
    console.log('diffResult==========', _.cloneDeep(diffResult.value));
  };

  const getCodeResult = () => {
    codeResult.value = _.reduce(
      diffResult.value,
      (str, item) => {
        str += item.value;
        return str;
      },
      ''
    );
  };

  const getDiffResultLines = () => {
    clearDiffLines();
    diffResult.value = _.map(diffResult.value, (item, index) => {
      if (index === 0) {
        item.line = item.count;
      } else {
        item.line =
          item.count + _.get(diffResult.value, `${index - 1}.line`, 0);
      }
      return item;
    });
    _.each(diffResult.value, (item, index) => {
      let { count } = item;
      while (count > 0) {
        if (item.removed) {
          removeLines.value.push(
            _.add(_.get(diffResult.value, `${index - 1}.line`) || 0, count)
          );
        }
        if (item.added) {
          addLines.value.push(
            _.add(_.get(diffResult.value, `${index - 1}.line`) || 0, count)
          );
        }
        count -= 1;
      }
    });
  };
  const getDiffCodeResult = (content) => {
    if (!content?.old && !content?.new) {
      return;
    }
    setDiffResult(content.old, content.new);
    getCodeResult();
    getDiffResultLines();
  };
  return {
    removeLines,
    addLines,
    diffResult,
    codeResult,
    setDiffResult,
    getCodeResult,
    getDiffResultLines,
    clearDiffLines,
    getDiffCodeResult
  };
}
