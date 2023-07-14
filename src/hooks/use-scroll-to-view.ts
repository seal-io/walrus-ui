export default function useScrollToView() {
  const scrollToView = () => {
    const dom = document.querySelector(
      '.arco-form-item-status-error.arco-form-item'
    );
    if (dom) {
      dom.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };
  return { scrollToView };
}
