export default function readBlob(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve(e.target.result);
    };
    reader.readAsText(blob, 'utf-8');
  });
}

// blob 2 base64
export function blobToBase64(text: string) {
  return new Promise((resolve) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve(e.target.result);
    };
    reader.readAsDataURL(blob);
  });
}
