import { ref } from 'vue';

export function readBlob(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve(e.target.result);
    };
    reader.readAsText(blob, 'utf-8');
  });
}
export default {};
