/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue-flow/background' {
  export { Background } from '@vue-flow/background';
}
declare module '@vue-flow/controls' {
  export { Controls } from '@vue-flow/controls';
}
declare module 'xterm-addon-fit' {
  export { FitAddon } from 'xterm-addon-fit';
}
declare module 'tippy.js' {
  import tippy from 'tippy.js';

  export { followCursor } from 'tippy.js';
  export default tippy;
}

declare module '@vueuse/core' {
  export {
    createReusableTemplate,
    onClickOutside,
    useElementSize,
    useThrottleFn,
    useResizeObserver,
    useClipboard,
    useDebounceFn,
    useElementHover,
    useDark,
    useToggle,
    useFullscreen,
    usePreferredLanguages
  } from '@vueuse/core';
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
