// create click event and mouseover event
export default function useMouseEvent(refEL) {
  const enterEvent = new MouseEvent('enter', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  const handleMouseEnter = () => {
    console.log('handleMouseEnter', refEL);
    refEL.value.current.dispatchEvent(enterEvent);
  };
  return {
    enterEvent,
    handleMouseEnter
  };
}
