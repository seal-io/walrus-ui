export default function useDownload() {
  const click = (node) => {
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    node.dispatchEvent(mouseEvent);
  };
  const createDom = (url) => {
    const a = document.createElement('a');
    a.href = url;
    return a;
  };
  const download = (url) => {
    try {
      const node = createDom(url);
      click(node);
      setTimeout(() => {
        node.remove();
      }, 100);
    } catch (error) {
      // ingore
    }
  };
  return {
    download
  };
}
