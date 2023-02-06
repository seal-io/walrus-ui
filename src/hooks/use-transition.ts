import { TransitionProps } from 'vue';

export default function useTransition() {
  const transitionEvents: TransitionProps = {
    onEnter: (el: Element) => {
      (el as HTMLDivElement).style.height = `${el.scrollHeight}px`;
    },
    onAfterEnter: (el: Element) => {
      (el as HTMLDivElement).style.height = 'auto';
    },
    onBeforeLeave: (el: Element) => {
      (el as HTMLDivElement).style.height = `${el.scrollHeight}px`;
    },
    onLeave: (el: Element) => {
      (el as HTMLDivElement).style.height = '0';
    },
    onAfterLeave: (el: Element) => {
      (el as HTMLDivElement).style.height = '0';
    },
  };
  return transitionEvents;
}
